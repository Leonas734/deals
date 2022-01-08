from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    profile_picture = models.ImageField(default='profile_pictures/DEFAULT-USER-PROFILE-PICTURE.jpg', upload_to='profile_pictures/')
    email = models.EmailField(
        _("email address"),
        blank=False,
        unique=True,
        error_messages={
            "unique": _("A user with that email address already exists."),
        },
    )