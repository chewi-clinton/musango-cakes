from django.urls import path

from .views import CheckoutView, CustomOrderRequestView

urlpatterns = [
    path("checkout/", CheckoutView.as_view(), name="checkout"),
    path("custom-order-requests/", CustomOrderRequestView.as_view(), name="custom-order-request"),
]
