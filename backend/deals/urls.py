from rest_framework import routers
from deals.views import UserViewSet, SignUpView, LogInView

from django.urls import path
router = routers.SimpleRouter()
router.register(r'user', UserViewSet)
urlpatterns = [
    path('sign_up/', SignUpView.as_view(), name='sign_up'),
    path('log_in/', LogInView.as_view(), name='log_in'),
]
urlpatterns += router.urls
