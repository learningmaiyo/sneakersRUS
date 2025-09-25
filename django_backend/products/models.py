import uuid
from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal


class Product(models.Model):
    """Product model matching Supabase schema"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    brand = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    image_url = models.URLField()
    category = models.CharField(max_length=100, blank=True)
    
    # JSON fields for arrays
    sizes = models.JSONField(default=list, help_text="Available sizes as array")
    colors = models.JSONField(default=list, help_text="Available colors as array")  
    tags = models.JSONField(default=list, help_text="Product tags as array")
    
    # Stock management
    stock_quantity = models.IntegerField(default=0)
    in_stock = models.BooleanField(default=True)
    
    # Product status
    is_new = models.BooleanField(default=False)
    featured = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'products'
        indexes = [
            models.Index(fields=['brand']),
            models.Index(fields=['category']),
            models.Index(fields=['featured']),
            models.Index(fields=['in_stock']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.brand} {self.name}"
    
    @property
    def is_on_sale(self):
        """Check if product is on sale"""
        return self.original_price and self.original_price > self.price
    
    @property
    def discount_percentage(self):
        """Calculate discount percentage"""
        if self.is_on_sale:
            discount = ((self.original_price - self.price) / self.original_price) * 100
            return round(discount, 1)
        return 0
    
    def update_stock(self, quantity_change):
        """Update stock quantity atomically"""
        from django.db.models import F
        
        self.refresh_from_db()
        new_quantity = self.stock_quantity + quantity_change
        
        if new_quantity < 0:
            raise ValueError("Insufficient stock")
        
        Product.objects.filter(id=self.id).update(
            stock_quantity=F('stock_quantity') + quantity_change,
            in_stock=new_quantity > 0,
            updated_at=models.functions.Now()
        )
        
        self.refresh_from_db()


class WishlistItem(models.Model):
    """Wishlist model matching Supabase schema"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='wishlist_items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='wishlisted_by')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'wishlist_items'
        unique_together = ['user', 'product']
    
    def __str__(self):
        return f"{self.user.email} - {self.product.name}"