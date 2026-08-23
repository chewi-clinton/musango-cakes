from rest_framework import serializers

from catalog.models import Product, ProductVariant

from .models import Customer, CustomOrderRequest, Order, OrderItem
from .utils import build_custom_order_message, build_order_message, whatsapp_link


class CustomerInputSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150)
    phone = serializers.CharField(max_length=30)

    def get_or_create_customer(self):
        return Customer.objects.get_or_create(
            phone=self.validated_data["phone"], defaults={"name": self.validated_data["name"]}
        )[0]


class OrderItemInputSerializer(serializers.Serializer):
    variant_id = serializers.PrimaryKeyRelatedField(queryset=ProductVariant.objects.all())
    quantity = serializers.IntegerField(min_value=1, default=1)


class CheckoutSerializer(serializers.Serializer):
    customer = CustomerInputSerializer()
    fulfillment_type = serializers.ChoiceField(choices=Order.fulfillment_type.field.choices)
    items = OrderItemInputSerializer(many=True)

    def create(self, validated_data):
        customer_serializer = CustomerInputSerializer(data=self.initial_data["customer"])
        customer_serializer.is_valid(raise_exception=True)
        customer = customer_serializer.get_or_create_customer()

        order = Order.objects.create(
            customer=customer, fulfillment_type=validated_data["fulfillment_type"]
        )
        for item in validated_data["items"]:
            variant = item["variant_id"]
            OrderItem.objects.create(
                order=order,
                product=variant.product,
                variant=variant,
                quantity=item["quantity"],
            )
        order.whatsapp_message = build_order_message(order)
        order.save()
        return order


class OrderReadSerializer(serializers.ModelSerializer):
    whatsapp_url = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id",
            "status",
            "fulfillment_type",
            "whatsapp_message",
            "whatsapp_url",
            "created_at",
        ]

    def get_whatsapp_url(self, obj):
        return whatsapp_link(obj.whatsapp_message)


class CustomOrderRequestSerializer(serializers.ModelSerializer):
    customer = CustomerInputSerializer(write_only=True)
    whatsapp_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = CustomOrderRequest
        fields = [
            "id",
            "customer",
            "size",
            "flavor",
            "design_reference_image",
            "date_needed",
            "fulfillment_type",
            "special_instructions",
            "whatsapp_message",
            "whatsapp_url",
            "created_at",
        ]
        read_only_fields = ["whatsapp_message", "created_at"]

    def create(self, validated_data):
        customer_data = validated_data.pop("customer")
        customer_serializer = CustomerInputSerializer(data=customer_data)
        customer_serializer.is_valid(raise_exception=True)
        customer = customer_serializer.get_or_create_customer()

        obj = CustomOrderRequest.objects.create(customer=customer, **validated_data)
        obj.whatsapp_message = build_custom_order_message(obj)
        obj.save()
        return obj

    def get_whatsapp_url(self, obj):
        return whatsapp_link(obj.whatsapp_message)
