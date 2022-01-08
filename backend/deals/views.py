from rest_framework import viewsets

from deals.models import CustomUser
from deals.serializers import CreateCustomUserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer = CreateCustomUserSerializer
    serializer_action_classes = {
        'create': CreateCustomUserSerializer,
    }
    
    def get_serializer_class(self):
        try:
            return self.serializer_action_classes[self.action]
        except (KeyError, AttributeError):
            return super().get_serializer_class()
