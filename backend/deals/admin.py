from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DefaultUserAdmin
from deals.models import CustomUser

@admin.register(CustomUser)
class UserAdmin(DefaultUserAdmin):
    fieldsets = DefaultUserAdmin.fieldsets + (
        (('Extra details'), {'fields': ('profile_picture',)}),
    )