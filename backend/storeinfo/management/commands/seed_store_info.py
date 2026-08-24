from django.core.management.base import BaseCommand

from storeinfo.models import StoreInfo

# Real business details as provided by the business owner (2026-08-24).
STORE_INFO = {
    "business_name": "Musango Cakes & More",
    "phone": "+237651589219",
    "whatsapp_number": "+237651589219",
    "email": "musangolensley1111@gmail.com",
    "facebook_url": "https://www.facebook.com/share/19LgJiVa5D/?mibextid=wwXIfr",
    "address_text": "Rondpoint Dakar, Douala, Cameroon",
    "opening_hours": "Open 24/7",
}


class Command(BaseCommand):
    help = "Seed real StoreInfo contact/business details."

    def handle(self, *args, **options):
        obj = StoreInfo.load()
        for field, value in STORE_INFO.items():
            setattr(obj, field, value)
        obj.save()
        self.stdout.write(f"Updated StoreInfo: {obj}")
