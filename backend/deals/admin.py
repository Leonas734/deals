from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from deals.models import CustomUser, Deal, Comment

@admin.register(CustomUser)
class UserAdmin(DefaultUserAdmin):
    fieldsets = DefaultUserAdmin.fieldsets + (
        (('Extra details'), {'fields': ('profile_picture', 'email_verified')}),
    )

@admin.register(Deal)
class DealAdmin(admin.ModelAdmin):
    pass

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    pass
