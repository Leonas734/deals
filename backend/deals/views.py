from rest_framework import mixins
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView

from deals.models import CustomUser
from deals.serializers import (
    CreateUserSerializer, LogInSerializer,
    UpdateUserEmailSerializer,
    )
from deals.utils import email_token_generator, send_email

from django.contrib.auth import get_user_model
from django.utils.timezone import now
from django.contrib.auth import authenticate

class SignUpView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = CreateUserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        user = get_user_model().objects.get(username=serializer.validated_data['username'])
        send_email.send_verification_for_email_address(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
class LogInView(TokenObtainPairView):
    serializer_class = LogInSerializer

class EmailVerificationView(mixins.CreateModelMixin,
                                mixins.ListModelMixin,
                                viewsets.GenericViewSet):

    def create(self, request, user_id, token, *args, **kwargs):
        user = get_object_or_404(CustomUser, id=user_id)
        if user.email_verified:
            return Response({'detail': 'Email already verified or the verification link has expired.'},
                            status=status.HTTP_400_BAD_REQUEST)
        result = email_token_generator.check_token(user, token)
        if result:
            user.email_verified = True
            user.email_verification_token_date = None
            user.save()

            return Response({'detail': 'Email successfully verified.'},
                            status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Email already verified or the verification link has expired.'},
                            status=status.HTTP_400_BAD_REQUEST)

    def list(self, request):
        self.permission_classes = (IsAuthenticated,)
        self.check_permissions(request)
        if request.user.email_verified:
            return Response({'detail': 'Email already verified or the verification link has expired.'},
                            status=status.HTTP_400_BAD_REQUEST)
        request.user.email_verification_token_date = now()
        request.user.save()
        send_email.send_verification_for_email_address(request.user)
        return Response({'detail': 'Email verification sent. Please check your inbox.'},
                            status=status.HTTP_200_OK)

class UpdateUserEmailView(mixins.CreateModelMixin,
                            viewsets.GenericViewSet):
    def create(self, request, *args, **kwargs):
        self.check_permissions(IsAuthenticated,)
        instance = request.user
        serializer = UpdateUserEmailSerializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(username=request.user.username, password=serializer.validated_data['password'])
        if not user:
            return Response({'password': 'Invalid password.'}, status=status.HTTP_400_BAD_REQUEST)
        instance.email = serializer.validated_data['email']
        instance.email_verified = False
        instance.email_verification_token_date = now()
        instance.save()
        send_email.send_verification_for_email_address(instance)
        return Response({'detail': 'Email updated successfully.'}, status=status.HTTP_200_OK)
    