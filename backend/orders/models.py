from django.db import models

from catalog.models import PriceOption, Product


class Customer(models.Model):
    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=30)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.phone})"


FULFILLMENT_CHOICES = [
    ("delivery", "Delivery"),
    ("pickup", "Pickup"),
]

ORDER_STATUS_CHOICES = [
    ("new", "New"),
    ("confirmed", "Confirmed"),
    ("preparing", "Preparing"),
    ("ready", "Ready"),
    ("delivered", "Delivered"),
]


class Cart(models.Model):
    session_key = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart {self.session_key}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    price_option = models.ForeignKey(PriceOption, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"


class Order(models.Model):
    customer = models.ForeignKey(
        Customer, on_delete=models.SET_NULL, null=True, blank=True, related_name="orders"
    )
    status = models.CharField(max_length=20, choices=ORDER_STATUS_CHOICES, default="new")
    fulfillment_type = models.CharField(max_length=20, choices=FULFILLMENT_CHOICES, default="delivery")
    whatsapp_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Order #{self.pk} ({self.get_status_display()})"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    price_option = models.ForeignKey(PriceOption, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"


class CustomOrderRequest(models.Model):
    customer = models.ForeignKey(
        Customer, on_delete=models.SET_NULL, null=True, blank=True, related_name="custom_requests"
    )
    size = models.CharField(max_length=50)
    flavor = models.CharField(max_length=100)
    design_reference_image = models.ImageField(
        upload_to="custom_orders/", null=True, blank=True
    )
    date_needed = models.DateField(null=True, blank=True)
    fulfillment_type = models.CharField(max_length=20, choices=FULFILLMENT_CHOICES, default="delivery")
    special_instructions = models.TextField(blank=True)
    whatsapp_message = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Custom order request #{self.pk}"
