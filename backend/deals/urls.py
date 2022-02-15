from deals.views import (
    SignUpView, LogInView, EmailVerificationView, UpdateUserEmailView,
    UpdateUserProfilePictureView, UpdateUserPasswordView, DealViewSet,
    CommentViewSet, UserView
    )

from rest_framework_simplejwt.views import TokenRefreshView

from django.urls import path
from rest_framework import routers

router = routers.SimpleRouter()
router.register(r'deals', DealViewSet)

urlpatterns = router.urls
urlpatterns = [
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
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
    path('user/<str:username>/',UserView.as_view(), name='user_view'),
    path('deal_comment/<str:comment_id>/', CommentViewSet.as_view({'get': 'retrieve'}), name='get_deal_comment'),
    path('deal_comment/', CommentViewSet.as_view({'post': 'create'}), name='create_deal_comment'),
    path('deal_comment/<str:comment_id>/like/', CommentViewSet.as_view({'post': 'like'}), name='like_deal_comment')
]

urlpatterns += router.urls