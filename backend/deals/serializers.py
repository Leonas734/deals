from rest_framework import serializers
from deals.models import CustomUser, Deal, Comment
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils.timezone import now
from django.shortcuts import get_object_or_404

class UserSerializer(serializers.ModelSerializer):    
    class Meta:
        model = CustomUser
        fields = ('username', 'profile_picture')

class UserSerializerPrivate(serializers.ModelSerializer):    
    class Meta:
        model = CustomUser
        fields = ('username', 'profile_picture', 'email_verified')

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
        user_data = UserSerializerPrivate(user).data
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

    def validate_email(self, value):
        if self.instance.email == value:
            raise serializers.ValidationError('Email is current email address.')
        return value

class UpdateUserProfilePictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['profile_picture', 'password']

class UpdateUserPasswordSerializer(serializers.ModelSerializer):
    new_password = serializers.CharField(max_length=128)
    new_password_repeat = serializers.CharField(max_length=128)
    class Meta:
        model = CustomUser
        fields = ['password', 'new_password_repeat', 'new_password',]

    def validate(self, data):
        if data['new_password'] != data['new_password_repeat']:
            raise serializers.ValidationError({'new_password': 'Passwords do not match.'})
        return data

class DealSerializer(serializers.ModelSerializer):
    rating = serializers.ReadOnlyField()
    user = UserSerializer(read_only=True)
    rated_by_user = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Deal
        exclude = ('up_votes', 'down_votes',)
        read_only_fields = (
            'user', 'id', 'created', 'updated', 'rating',
        )

    def validate(self, attrs):
        if attrs.get('instore_only') and (
            attrs.get('postage_cost') or attrs.get('sent_from')):
            raise serializers.ValidationError({'detail': 'Please select either instore only or shipping only.'})

        # Ensures Deal start date is before deal end date
        if (attrs.get('deal_start_date') != None and attrs.get('deal_end_date') != None) and (
            attrs.get('deal_start_date') > attrs.get('deal_end_date')):
            raise serializers.ValidationError({'detail': 'Invalid dates.'})

        if self.context['request'].method == 'PATCH':
            attrs['updated'] = now()
            # If user updating their Deal to postage or shipping
            # reset the other so both options are never selected.
            if attrs.get('instore_only'):
                attrs['postage_cost'] = 0
                attrs['sent_from'] = None
            if attrs.get('postage_cost') or attrs.get('sent_from'):
                attrs['instore_only'] = False
        return super().validate(attrs)

    def get_rated_by_user(self, obj):
        username = self.context['request'].user.username
        return obj.rated_by_user(username)

class DealVoteSerializer(serializers.Serializer):
    vote = serializers.BooleanField(allow_null=True)

class CommentSerializer(serializers.ModelSerializer):
    liked_by_user = serializers.SerializerMethodField(read_only=True)
    quoted_comment_data = serializers.ReadOnlyField()
    total_likes = serializers.ReadOnlyField()
    user = UserSerializer(read_only=True)
    class Meta:
        model = Comment
        exclude = ('likes',)
        read_only_fields = (
            'id', 'user', 'created',
            )
        extra_kwargs = {
            'quoted_comment': {
                'write_only': True
            }
        }

    def get_liked_by_user(self, obj):
        username = self.context['request'].user.username
        return obj.liked_by_user(username)