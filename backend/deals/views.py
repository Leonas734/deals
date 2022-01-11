from rest_framework import viewsets, status, generics
from rest_framework.decorators import action, permission_classes
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView

from deals.models import CustomUser
from deals.serializers import CreateCustomUserSerializer, LogInSerializer
from deals.utils import email_token_generator, send_email

from django.contrib.auth import get_user_model
from django.utils.timezone import now

class SignUpView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = CreateCustomUserSerializer

class LogInView(TokenObtainPairView):
    serializer_class = LogInSerializer

class UserViewSet(viewsets.ModelViewSet):
    http_method_names = ['post', 'get']
    queryset = CustomUser.objects.all()
    serializer_class = CreateCustomUserSerializer
    serializer_action_classes = {}
    
    def get_serializer_class(self):
        try:
            return self.serializer_action_classes[self.action]
        except (KeyError, AttributeError):
            return super().get_serializer_class()

    @action(detail=True, methods=['post'], url_path='verify_email/(?P<token>[^/.]+)')
    def verify_email(self, request, pk=None ,token=None):
        user = get_object_or_404(CustomUser, id=pk)
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

    @action(detail=False, methods=['get'], url_path='verify_email/new_token', permission_classes=[IsAuthenticated,])
    def new_token(self, request):
        if request.user.email_verified:
            return Response({'detail': 'Email already verified or the verification link has expired.'},
                            status=status.HTTP_400_BAD_REQUEST)
        request.user.email_verification_token_date = now()
        request.user.save()
        request.user.refresh_from_db()
        send_email.send_verification_for_email_address(request.user)
        return Response({'detail': 'Email verification sent. Please check your inbox.'},
                            status=status.HTTP_200_OK)
