from django.contrib import admin

from .models import DeliveryZone, StaticPage, StoreInfo


@admin.register(StoreInfo)
class StoreInfoAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return not StoreInfo.objects.exists()


@admin.register(DeliveryZone)
class DeliveryZoneAdmin(admin.ModelAdmin):
    list_display = ("name", "is_active", "order")
    list_editable = ("is_active", "order")
    actions = ["enable_zones", "disable_zones"]

    @admin.action(description="Mark selected zones as active")
    def enable_zones(self, request, queryset):
        queryset.update(is_active=True)

    @admin.action(description="Mark selected zones as inactive")
    def disable_zones(self, request, queryset):
        queryset.update(is_active=False)


@admin.register(StaticPage)
class StaticPageAdmin(admin.ModelAdmin):
    list_display = ("slug", "title_en")
