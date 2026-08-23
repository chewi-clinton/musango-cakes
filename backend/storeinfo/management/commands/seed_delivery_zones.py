from django.core.management.base import BaseCommand

from storeinfo.models import DeliveryZone

# Broad placeholder set of major Douala neighborhoods — the business owner must
# confirm/prune this to areas actually served before launch.
ZONES = [
    "Akwa",
    "Bali",
    "Bonanjo",
    "Bonapriso",
    "Bonamoussadi",
    "Deido",
    "Makepe",
    "Ndokoti",
    "Logbessou",
    "New Bell",
    "Bepanda",
    "Kotto",
    "Village",
    "Cité des Palmiers",
    "Ndogbong",
    "Bassa",
    "Bonaberi",
    "Ndogpassi",
    "Yassa",
    "Cité SIC",
    "Nyalla",
    "Japoma",
    "Denver",
    "PK8-PK14 corridor",
]


class Command(BaseCommand):
    help = "Seed a placeholder set of Douala delivery zones (confirm before launch)."

    def handle(self, *args, **options):
        for i, name in enumerate(ZONES):
            obj, created = DeliveryZone.objects.update_or_create(
                name=name, defaults={"order": i, "is_active": True}
            )
            self.stdout.write(f"{'Created' if created else 'Updated'} zone: {obj}")
