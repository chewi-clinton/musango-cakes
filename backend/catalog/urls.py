from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet, OccasionViewSet, ProductViewSet, PromotionViewSet

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("occasions", OccasionViewSet, basename="occasion")
router.register("products", ProductViewSet, basename="product")
router.register("promotions", PromotionViewSet, basename="promotion")

urlpatterns = router.urls
