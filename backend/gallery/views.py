import django_filters
from rest_framework import viewsets

from .models import GalleryCategory, GalleryItem
from .serializers import GalleryCategorySerializer, GalleryItemSerializer


class GalleryCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GalleryCategory.objects.all()
    serializer_class = GalleryCategorySerializer
    lookup_field = "slug"


class GalleryItemFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name="category__slug")

    class Meta:
        model = GalleryItem
        fields = ["category"]


class GalleryItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GalleryItem.objects.all()
    serializer_class = GalleryItemSerializer
    filterset_class = GalleryItemFilter
