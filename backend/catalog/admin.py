from django.contrib import admin

from .models import Category, Occasion, PriceOption, Product, ProductImage, Promotion


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class PriceOptionInline(admin.TabularInline):
    model = PriceOption
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "is_active", "is_sold_out", "created_at")
    list_editable = ("is_active", "is_sold_out")
    list_filter = ("category", "is_active", "is_sold_out", "occasions")
    search_fields = ("name", "description")
    prepopulated_fields = {"slug": ("name",)}
    filter_horizontal = ("occasions",)
    inlines = [ProductImageInline, PriceOptionInline]


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "group", "order")
    list_editable = ("order",)
    list_filter = ("group",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Occasion)
class OccasionAdmin(admin.ModelAdmin):
    list_display = ("name", "emoji", "order")
    list_editable = ("emoji", "order")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ("title", "discount_type", "discount_value", "is_featured", "is_seasonal")
    list_editable = ("is_featured", "is_seasonal")
    filter_horizontal = ("products",)
