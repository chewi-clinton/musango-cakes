from django.db import models


class StoreInfo(models.Model):
    """Singleton — always pk=1."""

    business_name = models.CharField(max_length=150, default="Musango Cakes & More")
    logo = models.ImageField(upload_to="branding/", null=True, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=30, blank=True)
    whatsapp_number = models.CharField(
        max_length=30,
        default="+000000000000",
        help_text="Placeholder until the real business WhatsApp number is supplied.",
    )
    instagram_url = models.URLField(blank=True)
    facebook_url = models.URLField(blank=True)
    x_url = models.URLField(blank=True)
    address_text = models.CharField(
        max_length=200, default="Douala, Cameroon", blank=True
    )
    maps_embed_url = models.URLField(blank=True)
    directions_url = models.URLField(blank=True)
    opening_hours = models.CharField(max_length=200, blank=True)

    class Meta:
        verbose_name_plural = "store info"

    def __str__(self):
        return self.business_name

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class DeliveryZone(models.Model):
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return self.name


class StaticPage(models.Model):
    slug = models.SlugField(max_length=100, unique=True)
    title_en = models.CharField(max_length=200)
    title_fr = models.CharField(max_length=200, blank=True)
    body_en = models.TextField()
    body_fr = models.TextField(blank=True)

    def __str__(self):
        return self.title_en
