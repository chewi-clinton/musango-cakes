import django_filters
from rest_framework import viewsets

from .models import Category, Occasion, Product, Promotion
from .serializers import (
    CategorySerializer,
    OccasionSerializer,
    ProductDetailSerializer,
    ProductListSerializer,
    PromotionSerializer,
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = "slug"


class OccasionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Occasion.objects.all()
    serializer_class = OccasionSerializer
    lookup_field = "slug"


class ProductFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name="category__slug")
    occasion = django_filters.CharFilter(field_name="occasions__slug")
    min_price = django_filters.NumberFilter(field_name="variants__price", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="variants__price", lookup_expr="lte")

    class Meta:
        model = Product
        fields = ["category", "occasion", "min_price", "max_price"]


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_active=True).distinct()
    lookup_field = "slug"
    filterset_class = ProductFilter

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ProductDetailSerializer
        return ProductListSerializer


class PromotionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer
