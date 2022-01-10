from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from deals.models import CustomUser
from deals.serializers import CreateCustomUserSerializer
from deals.utils import email_token_generator

class UserViewSet(viewsets.ModelViewSet):
    http_method_names = ['post']
    queryset = CustomUser.objects.all()
    serializer_class = CreateCustomUserSerializer
    serializer_action_classes = {
        'create': CreateCustomUserSerializer,
    }
    
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
