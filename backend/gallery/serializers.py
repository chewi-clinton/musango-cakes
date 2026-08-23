from rest_framework import serializers

from .models import GalleryCategory, GalleryItem


class GalleryCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryCategory
        fields = ["id", "name", "slug", "order"]


class GalleryItemSerializer(serializers.ModelSerializer):
    category = GalleryCategorySerializer(read_only=True)

    class Meta:
        model = GalleryItem
        fields = ["id", "title", "image", "category", "order"]
