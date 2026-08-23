from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import DeliveryZone, StaticPage, StoreInfo
from .serializers import DeliveryZoneSerializer, StaticPageSerializer, StoreInfoSerializer


class StoreInfoView(APIView):
    def get(self, request):
        return Response(StoreInfoSerializer(StoreInfo.load()).data)


class DeliveryZoneViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DeliveryZone.objects.filter(is_active=True)
    serializer_class = DeliveryZoneSerializer


class StaticPageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = StaticPage.objects.all()
    serializer_class = StaticPageSerializer
    lookup_field = "slug"
