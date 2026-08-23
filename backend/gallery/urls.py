from rest_framework.routers import DefaultRouter

from .views import GalleryCategoryViewSet, GalleryItemViewSet

router = DefaultRouter()
router.register("gallery-categories", GalleryCategoryViewSet, basename="gallery-category")
router.register("gallery-items", GalleryItemViewSet, basename="gallery-item")

urlpatterns = router.urls
