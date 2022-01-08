from rest_framework import serializers

from deals.models import CustomUser

class CreateCustomUserSerializer(serializers.ModelSerializer):
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