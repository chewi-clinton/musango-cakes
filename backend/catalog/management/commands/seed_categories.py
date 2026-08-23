from django.core.management.base import BaseCommand

from catalog.models import Category, Occasion

CATEGORIES = [
    # (name, slug, group, order)
    ("Birthday Cakes", "birthday-cakes", "cakes", 1),
    ("Wedding Cakes", "wedding-cakes", "cakes", 2),
    ("Custom Cakes", "custom-cakes", "cakes", 3),
    ("Kids Cakes", "kids-cakes", "cakes", 4),
    ("Celebration Cakes", "celebration-cakes", "cakes", 5),
    ("Cupcakes", "cupcakes", "pastries", 1),
    ("Doughnuts", "doughnuts", "pastries", 2),
    ("Cookies", "cookies", "pastries", 3),
    ("Meat Pies", "meat-pies", "pastries", 4),
    ("Gift Boxes", "gift-boxes", "pastries", 5),
    ("Other Pastries", "other-pastries", "pastries", 6),
]

OCCASIONS = [
    # (name, slug, emoji, order)
    ("Birthday", "birthday", "🎂", 1),
    ("Wedding", "wedding", "💍", 2),
    ("Graduation", "graduation", "🎓", 3),
    ("Anniversary", "anniversary", "❤️", 4),
    ("Baby Shower", "baby-shower", "👶", 5),
    ("Celebration", "celebration", "🎉", 6),
    ("Gift", "gift", "🎁", 7),
]


class Command(BaseCommand):
    help = "Seed the Cakes/Pastries category taxonomy and the Occasion tags."

    def handle(self, *args, **options):
        for name, slug, group, order in CATEGORIES:
            obj, created = Category.objects.update_or_create(
                slug=slug, defaults={"name": name, "group": group, "order": order}
            )
            self.stdout.write(f"{'Created' if created else 'Updated'} category: {obj}")

        for name, slug, emoji, order in OCCASIONS:
            obj, created = Occasion.objects.update_or_create(
                slug=slug, defaults={"name": name, "emoji": emoji, "order": order}
            )
            self.stdout.write(f"{'Created' if created else 'Updated'} occasion: {obj}")
