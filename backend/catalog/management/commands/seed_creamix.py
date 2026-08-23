import json
import re
from pathlib import Path

from django.core.files import File
from django.core.management.base import BaseCommand
from django.utils.text import slugify

from catalog.models import Category, Occasion, Product, ProductImage, ProductVariant

REPO_ROOT = Path(__file__).resolve().parents[4]
DATA_FILE = REPO_ROOT / "scraped_data" / "scraped_creamix.json"
MEDIA_ROOT = REPO_ROOT / "backend" / "media"

# Curated mapping of scraped Creamix product slugs -> Musango's own taxonomy.
# Prices are placeholder FCFA amounts (Creamix's Naira prices are not reused).
PRODUCT_META = {
    "mo-tiered-whipped-cream-cake-1783037562": {
        "category": "custom-cakes",
        "occasions": ["anniversary", "celebration"],
        "base_price": 45000,
    },
    "seyi-cake-in-7-4-1780151974": {
        "category": "birthday-cakes",
        "occasions": ["birthday"],
        "base_price": 25000,
    },
    "6-2-layers-ribbon-cake-1775422302": {
        "category": "birthday-cakes",
        "occasions": ["birthday", "celebration"],
        "base_price": 20000,
    },
    "box-of-12-custom-cupcakes-1778619884": {
        "category": "cupcakes",
        "occasions": ["birthday", "gift"],
        "base_price": 8000,
    },
    "box-of-12-cupcakes-with-toppings-1778141180": {
        "category": "cupcakes",
        "occasions": ["birthday"],
        "base_price": 9000,
    },
    "minnie-mouse-cake-in-6-1779295748": {
        "category": "kids-cakes",
        "occasions": ["birthday"],
        "base_price": 18000,
    },
    "single-layer-character-cake-1779295460": {
        "category": "kids-cakes",
        "occasions": ["birthday"],
        "base_price": 16000,
    },
    "treat-pack-1780152219": {
        "category": "gift-boxes",
        "occasions": ["gift"],
        "base_price": 7000,
    },
    "cake-slice-1780151268": {
        "category": "other-pastries",
        "occasions": [],
        "base_price": 3000,
    },
}


def sanitize_description(text):
    """Strip Creamix's real business name out of scraped meta descriptions —
    only the generic sentence structure is a reusable reference, never their
    actual identity."""
    return re.sub(
        r"from Creamix (Bakeshop|Cakes|Bake Shop)",
        "from Musango Cakes & More",
        text,
        flags=re.IGNORECASE,
    )


class Command(BaseCommand):
    help = "Seed products from scraped_data/scraped_creamix.json (structural reference only)."

    def handle(self, *args, **options):
        if not DATA_FILE.exists():
            self.stderr.write(f"Missing {DATA_FILE} — run scripts/scrape_creamix.mjs first.")
            return

        data = json.loads(DATA_FILE.read_text())
        for entry in data:
            meta = PRODUCT_META.get(entry["slug"])
            if not meta:
                self.stdout.write(f"Skipping unmapped product: {entry['slug']}")
                continue

            category = Category.objects.get(slug=meta["category"])
            slug = slugify(entry["name"])[:220]
            product, created = Product.objects.update_or_create(
                slug=slug,
                defaults={
                    "name": entry["name"].strip().title(),
                    "description": sanitize_description(entry["description"]),
                    "category": category,
                },
            )
            product.occasions.set(Occasion.objects.filter(slug__in=meta["occasions"]))

            product.images.all().delete()
            for i, rel_path in enumerate(entry["images"]):
                full_path = MEDIA_ROOT / rel_path
                if not full_path.exists():
                    continue
                with open(full_path, "rb") as f:
                    img = ProductImage(
                        product=product,
                        alt_text=f"{product.name} photo {i + 1}",
                        order=i,
                    )
                    img.image.save(Path(rel_path).name, File(f), save=True)

            product.variants.all().delete()
            sizes = entry["sizes"][:4] or ["Standard"]
            base_price = meta["base_price"]
            for i, size in enumerate(sizes):
                ProductVariant.objects.create(
                    product=product,
                    size=size,
                    price=base_price + i * 5000,
                    order=i,
                )

            self.stdout.write(f"{'Created' if created else 'Updated'} product: {product}")
