from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import CustomOrderRequest
from .serializers import CheckoutSerializer, CustomOrderRequestSerializer, OrderReadSerializer


class CheckoutView(APIView):
    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        return Response(OrderReadSerializer(order).data, status=status.HTTP_201_CREATED)


class CustomOrderRequestView(APIView):
    def post(self, request):
        serializer = CustomOrderRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        obj = serializer.save()
        return Response(serializer.to_representation(obj), status=status.HTTP_201_CREATED)
