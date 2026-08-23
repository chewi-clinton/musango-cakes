from django.contrib import admin

from .models import Cart, CartItem, Customer, CustomOrderRequest, Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "customer", "status", "fulfillment_type", "created_at")
    list_editable = ("status",)
    list_filter = ("status", "fulfillment_type")
    inlines = [OrderItemInline]


@admin.register(CustomOrderRequest)
class CustomOrderRequestAdmin(admin.ModelAdmin):
    list_display = ("id", "customer", "size", "flavor", "date_needed", "fulfillment_type", "created_at")
    list_filter = ("fulfillment_type",)


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ("name", "phone", "created_at")
    search_fields = ("name", "phone")
    readonly_fields = ("created_at",)


admin.site.register(Cart)
admin.site.register(CartItem)
