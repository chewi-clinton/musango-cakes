from rest_framework import serializers

from .models import DeliveryZone, StaticPage, StoreInfo


class StoreInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoreInfo
        fields = [
            "business_name",
            "logo",
            "email",
            "phone",
            "whatsapp_number",
            "instagram_url",
            "facebook_url",
            "x_url",
            "address_text",
            "maps_embed_url",
            "directions_url",
            "opening_hours",
        ]


class DeliveryZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryZone
        fields = ["id", "name", "order"]


class StaticPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaticPage
        fields = ["slug", "title_en", "title_fr", "body_en", "body_fr"]
