
from deals.views import (
    SignUpView, LogInView, EmailVerificationView, UpdateUserEmailView,
    UpdateUserProfilePictureView, UpdateUserPasswordView
    )

from django.urls import path
urlpatterns = [
    path('sign_up/', SignUpView.as_view(), name='sign_up'),
    path('log_in/', LogInView.as_view(), name='log_in'),
    path('email_verification/<str:user_id>/<str:token>/',
    EmailVerificationView.as_view({'post': 'create'} ), name='verify_email'),
    path('email_verification/new_token/',
    EmailVerificationView.as_view({'get': 'list'} ), name='verify_email_resend'),
    path('user/update_email/',
    UpdateUserEmailView.as_view({'post': 'create'}), name='update_user_email'),
    path('user/update_profile_picture/',
    UpdateUserProfilePictureView.as_view({'post': 'create'}), name='update_user_profile_picture'),
    path('user/update_password/',
    UpdateUserPasswordView.as_view({'post': 'create'}), name='update_user_password'),
]
