import uuid
from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal


class OrderStatus(models.TextChoices):
    """Order status choices"""
    PENDING = 'pending', 'Pending'
    PAID = 'paid', 'Paid'
    PROCESSING = 'processing', 'Processing'
    SHIPPED = 'shipped', 'Shipped'
    DELIVERED = 'delivered', 'Delivered'
    CANCELLED = 'cancelled', 'Cancelled'
    REFUNDED = 'refunded', 'Refunded'


class Order(models.Model):
    """Order model matching Supabase schema"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='orders')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    status = models.CharField(max_choices=OrderStatus.choices, default=OrderStatus.PENDING)
    stripe_session_id = models.CharField(max_length=255, blank=True)
    shipping_address = models.JSONField(null=True, blank=True)
    
    # Additional fields for better order management
    order_number = models.CharField(max_length=20, unique=True, blank=True)
    notes = models.TextField(blank=True, help_text="Internal notes about the order")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'orders'
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
            models.Index(fields=['stripe_session_id']),
        ]
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Order {self.order_number or str(self.id)[:8]} - {self.user.email}"
    
    def save(self, *args, **kwargs):
        """Generate order number if not set"""
        if not self.order_number:
            # Generate order number based on timestamp and UUID
            import time
            timestamp = str(int(time.time()))[-6:]  # Last 6 digits of timestamp
            uuid_part = str(self.id).replace('-', '')[:6].upper()
            self.order_number = f"ORD-{timestamp}-{uuid_part}"
        
        super().save(*args, **kwargs)
    
    @property
    def total_items(self):
        """Get total number of items in order"""
        return sum(item.quantity for item in self.items.all())
    
    @property
    def can_be_cancelled(self):
        """Check if order can be cancelled"""
        return self.status in [OrderStatus.PENDING, OrderStatus.PAID]
    
    def cancel_order(self):
        """Cancel the order if possible"""
        if self.can_be_cancelled:
            self.status = OrderStatus.CANCELLED
            self.save()
            return True
        return False


class OrderItem(models.Model):
    """Order item model matching Supabase schema"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE, related_name='order_items')
    quantity = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    price_at_time = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    size = models.CharField(max_length=20, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'order_items'
        indexes = [
            models.Index(fields=['order']),
            models.Index(fields=['product']),
        ]
    
    def __str__(self):
        size_info = f" (Size: {self.size})" if self.size else ""
        return f"{self.order} - {self.product.name}{size_info} x{self.quantity}"
    
    @property
    def subtotal(self):
        """Calculate subtotal for this order item"""
        return self.price_at_time * self.quantity


# Order creation from cart
class OrderManager(models.Manager):
    """Custom manager for order operations"""
    
    def create_from_cart(self, user, shipping_address=None, notes=''):
        """Create order from user's current cart"""
        from cart.models import CartItem
        from django.db import transaction
        
        with transaction.atomic():
            # Get cart items
            cart_items = CartItem.objects.filter(user=user).select_related('product')
            
            if not cart_items:
                raise ValueError("Cart is empty")
            
            # Calculate total
            total_amount = sum(item.subtotal for item in cart_items)
            
            # Create order
            order = self.create(
                user=user,
                total_amount=total_amount,
                shipping_address=shipping_address,
                notes=notes
            )
            
            # Create order items
            order_items = []
            for cart_item in cart_items:
                order_item = OrderItem(
                    order=order,
                    product=cart_item.product,
                    quantity=cart_item.quantity,
                    price_at_time=cart_item.product.price,
                    size=cart_item.size
                )
                order_items.append(order_item)
            
            OrderItem.objects.bulk_create(order_items)
            
            # Clear cart after order creation
            cart_items.delete()
            
            return order


# Add custom manager
Order.add_to_class('objects', OrderManager())