import uuid
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractUser
from django.utils.timezone import now
from django.db.models.signals import post_save
from deals.utils import send_email


class CustomUser(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    profile_picture = models.ImageField(default='profile_pictures/DEFAULT-USER-PROFILE-PICTURE.jpg', upload_to='profile_pictures/')
    email = models.EmailField(
        _('email address'),
        blank=False,
        unique=True,
        error_messages={
            'unique': _('A user with that email address already exists.'),
        },
    )
    email_verified = models.BooleanField(default=False,)
    email_verification_token_date = models.DateTimeField(default=now, null=True)

# SIGNALS
def send_user_email_verifiction(sender, instance, created,**kwargs):
    # Only send email if user object is being created or email field is updated.
    if created == True:
        send_email.send_verification_for_email_address(instance)
    
    # if 'email' in kwargs.get('update_fields'): USE THIS IN FUTURE

# Whenever a new user is created send email verification to user's email address
post_save.connect(send_user_email_verifiction, sender=CustomUser) 