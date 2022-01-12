import uuid
from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractUser
from django.utils.timezone import now


class CustomUser(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    profile_picture = models.ImageField(
        default=f'{settings.PROFILE_PICTURE_DIR}/{settings.DEFAULT_PROFILE_PICTURE}',
        upload_to=f'{settings.PROFILE_PICTURE_DIR}/')
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
