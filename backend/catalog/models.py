from django.db import models


class Category(models.Model):
    GROUP_CHOICES = [
        ("cakes", "Cakes"),
        ("pastries", "Pastries"),
    ]

    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    group = models.CharField(max_length=20, choices=GROUP_CHOICES)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name_plural = "categories"
        ordering = ["group", "order", "name"]

    def __str__(self):
        return self.name


class Occasion(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, unique=True)
    emoji = models.CharField(max_length=8, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    description = models.TextField(blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")
    occasions = models.ManyToManyField(Occasion, blank=True, related_name="products")
    is_active = models.BooleanField(default=True)
    is_sold_out = models.BooleanField(default=False)
    # SEO
    meta_title = models.CharField(
        max_length=70, blank=True, help_text="Defaults to the product name if left blank."
    )
    meta_description = models.CharField(max_length=160, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="products/")
    alt_text = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.product.name} image #{self.order}"


class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")
    size = models.CharField(max_length=50, blank=True)
    flavor = models.CharField(max_length=100, blank=True)
    color = models.CharField(max_length=50, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=0)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        bits = " / ".join(b for b in [self.size, self.flavor, self.color] if b)
        return f"{self.product.name} - {bits or 'default'} ({self.price} FCFA)"


class Promotion(models.Model):
    DISCOUNT_CHOICES = [
        ("percentage", "Percentage"),
        ("fixed", "Fixed amount"),
    ]

    title = models.CharField(max_length=150)
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_CHOICES, blank=True)
    discount_value = models.DecimalField(max_digits=10, decimal_places=0, null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    is_seasonal = models.BooleanField(default=False)
    starts_at = models.DateTimeField(null=True, blank=True)
    ends_at = models.DateTimeField(null=True, blank=True)
    products = models.ManyToManyField(Product, blank=True, related_name="promotions")

    def __str__(self):
        return self.title
