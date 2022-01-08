from rest_framework import routers
from deals.views import UserViewSet

router = routers.SimpleRouter()
router.register(r'user', UserViewSet)
urlpatterns = router.urls
