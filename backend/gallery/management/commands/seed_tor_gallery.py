import json
from pathlib import Path

from django.core.files import File
from django.core.management.base import BaseCommand
from django.utils.text import slugify

from gallery.models import GalleryCategory, GalleryItem

REPO_ROOT = Path(__file__).resolve().parents[4]
DATA_FILE = REPO_ROOT / "scraped_data" / "scraped_tor_gallery.json"
MEDIA_ROOT = REPO_ROOT / "backend" / "media"


class Command(BaseCommand):
    help = "Seed gallery items from scraped_data/scraped_tor_gallery.json."

    def handle(self, *args, **options):
        if not DATA_FILE.exists():
            self.stderr.write(f"Missing {DATA_FILE} — run scripts/scrape_tor_gallery.mjs first.")
            return

        data = json.loads(DATA_FILE.read_text())
        # Curated order matching the reference site's actual filter-pill order
        # (not alphabetical) — falls back to alphabetical for any new category.
        preferred_order = [
            "Wedding", "Luxury", "Birthday", "Dessert Box",
            "Custom", "Kids", "Anniversary", "Signature",
        ]
        ordered_categories = sorted(
            data["categories"],
            key=lambda c: preferred_order.index(c) if c in preferred_order else len(preferred_order),
        )
        category_objs = {}
        for i, cat_name in enumerate(ordered_categories):
            obj, _ = GalleryCategory.objects.update_or_create(
                slug=slugify(cat_name), defaults={"name": cat_name, "order": i}
            )
            category_objs[cat_name] = obj

        created_count = 0
        skipped = 0
        for i, item in enumerate(data["items"]):
            full_path = MEDIA_ROOT / item["local_image"]
            if not full_path.exists():
                skipped += 1
                continue

            category = category_objs.get(item["category"])
            if not category:
                skipped += 1
                continue

            gallery_item, created = GalleryItem.objects.update_or_create(
                title=item["title"],
                category=category,
                defaults={"order": i},
            )
            if created or not gallery_item.image:
                with open(full_path, "rb") as f:
                    gallery_item.image.save(Path(item["local_image"]).name, File(f), save=True)
            created_count += 1

        self.stdout.write(
            f"Seeded {created_count} gallery items across {len(category_objs)} categories "
            f"({skipped} skipped due to missing files)."
        )
