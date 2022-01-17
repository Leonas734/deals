import uuid
from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator
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

class Deal(models.Model):
    
    CATEGORIES = (
        ("GROCERIES", "GROCERIES"),
        ("ELECTRONICS", "ELECTRONICS"),
        ("SPORT & LEISURE", "SPORT & LEISURE"),
        ("FINANCE & INSURANCE", "FINANCE & INSURANCE"),
        ("HOME & GARDEN", "HOME & GARDEN"),
    )

    SENT_FROM_CHOICES = (
        ("UNITED KINGDOM", "UNITED KINGDOM"),
        ("GERMANY", "GERMANY"),
        ("FRANCE", "FRANCE"),
        ("USA", "USA"),
        ("CHINA", "CHINA"), 
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, unique=True)
    user= models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="deals",)
    title = models.CharField(max_length=256, null=False)
    description = models.TextField(max_length=3000, null=False)
    image = models.ImageField(default=f'{settings.DEAL_IMAGE_DIR}/{settings.DEFAULT_DEAL_IMAGE}', upload_to="deal_images/")
    price = models.DecimalField(validators=[MinValueValidator(0)], max_digits=6, decimal_places=2, default=0,)
    url = models.URLField(max_length=500, default=None, null=True,)
    category = models.CharField(choices=CATEGORIES, max_length=60, null=False)
    instore_only = models.BooleanField(default=False)
    postage_cost = models.DecimalField(validators=[MinValueValidator(0)], max_digits=6, decimal_places=2, default=0)
    sent_from = models.CharField(choices=SENT_FROM_CHOICES, max_length=100, default=None, null=True)
    deal_start_date = models.DateField(default=None, null=True)
    deal_end_date = models.DateField(default=None, null=True)
    up_votes = models.JSONField(default=list)
    down_votes = models.JSONField(default=list)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(default=None, null=True)
    
    @property
    def rating(self):
        return len(self.up_votes) - len(self.down_votes)

    def vote(self, username, vote):
        """If vote True=Up vote, False=Down vote, None=No vote"""
        def clear_votes(username):
            if username in self.up_votes:
                self.up_votes.remove(username)
            if username in self.down_votes:
                self.down_votes.remove(username)

        clear_votes(username)

        if vote == True:
            self.up_votes.append(username)
        if vote == False:
            self.down_votes.append(username)
        self.save()

    def voted_by_user(self, username):
        if username in self.up_votes:
            return True
        if username in self.down_votes:
            return False
        return

class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, unique=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="deal_comments")
    deal = models.ForeignKey(Deal, on_delete=models.CASCADE, related_name="comments")
    text = models.TextField(max_length=500, blank=False, null=False)
    quoted_comment = models.ForeignKey("Comment", on_delete=models.CASCADE, null=True, blank=True)
    likes = models.JSONField(default=list)
    created = models.DateTimeField(auto_now_add=True)

    @property
    def quoted_comment_data(self):
        if self.quoted_comment:
            return dict(
                id=str(self.quoted_comment.id),
                user=self.quoted_comment.user.username,
                text=self.quoted_comment.text,
                date=self.quoted_comment.created
            )
        return None

    @property
    def total_likes(self):
        return len(self.likes)

    def like_comment(self, username):
        if username not in self.likes:
            self.likes.append(username)
            self.save()
            return True
        else:
            self.likes.remove(username)
            self.save()
            return False

    def liked_by_user(self, username):
        if username in self.likes:
            return True
        return False