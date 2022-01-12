from rest_framework import serializers
from deals.models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CreateUserSerializer(serializers.ModelSerializer):
    password_repeat = serializers.CharField(write_only=True)
    
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password', 'password_repeat']
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'write_only': True},
        }
    def create(self, validated_data):
        # Extract all but password data into new dict
        data = {
            key: value for key, value in validated_data.items()
            if key not in ('password', 'password_repeat')
        }
        # Add password field manually.
        data['password'] = validated_data['password']
        return self.Meta.model.objects.create_user(**data)

    def validate(self, data):
        if data['password'] != data['password_repeat']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return data

class LogInSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        user_data = CreateUserSerializer(user).data
        for key, value in user_data.items():
            if key != 'id':
                token[key] = value
        return token

    # Validate by checking email and/or username details inside DB, not just username.
    def validate(self, attrs):
        username = attrs.get('username')
        credentials = {
            'username': '',
            'password': attrs.get('password')
        }
        # Check if username or email match any of the users in db
        user_obj = CustomUser.objects.filter(email=username).first() or CustomUser.objects.filter(username=username).first()
        if user_obj:
            credentials['username'] = user_obj.username

        return super().validate(credentials)

class UpdateUserEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'password']