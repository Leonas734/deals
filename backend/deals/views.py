from rest_framework import mixins
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from deals.permissions import IsOwnerOrReadOnly, IsVerified

from deals.models import CustomUser, Deal, Comment
from deals.serializers import (
    CreateUserSerializer, LogInSerializer,
    UpdateUserEmailSerializer, UpdateUserProfilePictureSerializer,
    UpdateUserPasswordSerializer, DealSerializer, DealVoteSerializer,
    CommentSerializer, UserSerializer
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
            refresh = LogInSerializer().get_token(user=user)

            return Response({
                'detail': 'Email successfully verified.',
                'token': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token)
                    }},status=status.HTTP_200_OK)
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
        self.permission_classes = (IsAuthenticated,)
        self.check_permissions(request,)
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
        refresh = LogInSerializer().get_token(user=request.user)
        return Response({
            'detail': 'Email updated successfully.',
             'token': {'refresh': str(refresh),
              'access': str(refresh.access_token)
              }
            }, status=status.HTTP_200_OK)
    
class UpdateUserProfilePictureView(mixins.CreateModelMixin,
                            viewsets.GenericViewSet):
    def create(self, request, *args, **kwargs):
        self.permission_classes = (IsAuthenticated,)
        self.check_permissions(request,)
        instance = request.user
        serializer = UpdateUserProfilePictureSerializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(username=request.user.username, password=serializer.validated_data['password'])
        if not user:
            return Response({'password': 'Invalid password.'}, status=status.HTTP_400_BAD_REQUEST)
        instance.profile_picture = serializer.validated_data['profile_picture']
        instance.save()
        refresh = LogInSerializer().get_token(user=request.user)
        return Response({
            'detail': 'Profile picture updated successfully.',
            'token': {'refresh': str(refresh),
            'access': str(refresh.access_token)}}, status=status.HTTP_200_OK)
    
class UpdateUserPasswordView(mixins.CreateModelMixin,
                            viewsets.GenericViewSet):
    def create(self, request, *args, **kwargs):
        self.permission_classes = (IsAuthenticated,)
        self.check_permissions(request)
        instance = request.user
        serializer = UpdateUserPasswordSerializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(username=request.user.username, password=serializer.validated_data['password'])
        if not user:
            return Response({'password': 'Invalid password.'}, status=status.HTTP_400_BAD_REQUEST)

        # User trying update password to current password
        user = authenticate(username=request.user.username, password=serializer.validated_data['new_password'])
        if user:
            return Response({'new_password': 'Please enter a new password.'}, status=status.HTTP_400_BAD_REQUEST)
        instance.set_password(serializer.validated_data['new_password'])
        instance.save()
        return Response({'detail': 'Password updated successfully.'}, status=status.HTTP_200_OK)
    
class DealViewSet(viewsets.ModelViewSet):
    serializer_class = DealSerializer
    queryset = Deal.objects.all()
    permission_classes = []
    http_method_names = ['get', 'post', 'patch', 'delete']

    def get_permissions(self):
        print(self.action)
        if (self.action == 'list' or 
            self.action == 'comments' or 
            self.action == 'retrieve' or 
            self.action == 'category'):

            return [AllowAny(), ]
        elif self.action == 'create' or self.action == 'vote':
            return (IsAuthenticated(), IsVerified())
        else :
            return (IsOwnerOrReadOnly(), IsAuthenticated())
    
    def perform_create(self, serializer):
        return serializer.save(user=self.request.user, up_votes=[self.request.user.username])

    @action(detail=True, methods=['get'])
    def category(self, request, pk=None):
        filtered_deals = Deal.objects.filter(category=pk.upper())
        serializer = self.serializer_class(filtered_deals, many=True, context={'request': request})
        return Response(serializer.data,
                            status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def vote(self, request, pk=None):
        deal = self.get_object()
        serializer = DealVoteSerializer(data=request.data)
        if serializer.is_valid():
            deal.vote(request.user.username, vote=serializer.validated_data['vote'])
            serializedDeal = DealSerializer(deal, context={'request': request})
            return Response({'deal': serializedDeal.data},
                             status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)
    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        # Ensure deal exists
        get_object_or_404(Deal, id=pk)
        comments = Comment.objects.filter(deal=pk)
        serializer = CommentSerializer(comments.order_by('created'), many=True, context={'request': request})
        return Response(serializer.data,
                            status=status.HTTP_200_OK)

class CommentViewSet(viewsets.ViewSet):

    def get_permissions(self):
        if self.action == 'create' or self.action == 'like':
            permission_classes = [IsAuthenticated, IsVerified]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]
    

    def create(self, request):
        serializer = CommentSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save(user=self.request.user)
        return Response(serializer.data,
                        status=status.HTTP_201_CREATED)


    def retrieve(self, request, comment_id=None):
        comment = get_object_or_404(Comment, id=comment_id,)
        serializer = CommentSerializer(comment, context={'request': request})
        return Response(serializer.data,
                             status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def like(self, request, comment_id=None):
        comment = get_object_or_404(Comment, id=comment_id)
        comment.like_comment(self.request.user.username)
        serializer = CommentSerializer(comment, context={'request': request})
        return Response(serializer.data,
                        status=status.HTTP_200_OK)

class UserView(generics.RetrieveAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    lookup_field = "username"

