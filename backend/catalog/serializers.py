from rest_framework import serializers

from .models import Category, Occasion, Product, ProductImage, ProductVariant, Promotion


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "group", "description", "order"]


class OccasionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Occasion
        fields = ["id", "name", "slug", "emoji", "order"]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "alt_text", "order"]


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ["id", "size", "flavor", "color", "price", "order"]


class ProductListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    cover_image = serializers.SerializerMethodField()
    starting_price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "category",
            "cover_image",
            "starting_price",
            "is_sold_out",
        ]

    def get_cover_image(self, obj):
        first = obj.images.first()
        return ProductImageSerializer(first).data if first else None

    def get_starting_price(self, obj):
        first = obj.variants.order_by("price").first()
        return first.price if first else None


class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    occasions = OccasionSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "category",
            "occasions",
            "images",
            "variants",
            "is_sold_out",
            "meta_title",
            "meta_description",
        ]


class PromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = [
            "id",
            "title",
            "discount_type",
            "discount_value",
            "is_featured",
            "is_seasonal",
            "starts_at",
            "ends_at",
            "products",
        ]
