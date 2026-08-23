from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import DeliveryZoneViewSet, StaticPageViewSet, StoreInfoView

router = DefaultRouter()
router.register("delivery-zones", DeliveryZoneViewSet, basename="delivery-zone")
router.register("static-pages", StaticPageViewSet, basename="static-page")

urlpatterns = [
    path("store-info/", StoreInfoView.as_view(), name="store-info"),
] + router.urls
