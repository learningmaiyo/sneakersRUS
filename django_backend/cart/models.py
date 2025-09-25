import uuid
from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal


class CartItem(models.Model):
    """Cart item model matching Supabase schema"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='cart_items')
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE, related_name='cart_items')
    quantity = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    size = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'cart_items'
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['product']),
            models.Index(fields=['user', 'product', 'size']),
        ]
    
    def __str__(self):
        size_info = f" (Size: {self.size})" if self.size else ""
        return f"{self.user.email} - {self.product.name}{size_info} x{self.quantity}"
    
    @property
    def subtotal(self):
        """Calculate subtotal for this cart item"""
        return self.product.price * self.quantity


class AggregatedCartManager(models.Manager):
    """Manager for aggregated cart operations"""
    
    def get_aggregated_cart(self, user):
        """Get aggregated cart items for user"""
        from django.db.models import Sum, F
        from collections import defaultdict
        
        cart_items = CartItem.objects.filter(user=user).select_related('product')
        
        # Group items by product and size
        aggregated = defaultdict(lambda: {
            'product': None,
            'size': None,
            'total_quantity': 0,
            'item_ids': [],
            'subtotal': Decimal('0.00')
        })
        
        for item in cart_items:
            key = f"{item.product.id}_{item.size or 'no-size'}"
            
            if not aggregated[key]['product']:
                aggregated[key]['product'] = item.product
                aggregated[key]['size'] = item.size
            
            aggregated[key]['total_quantity'] += item.quantity
            aggregated[key]['item_ids'].append(str(item.id))
            aggregated[key]['subtotal'] += item.subtotal
        
        return list(aggregated.values())
    
    def add_to_cart(self, user, product_id, size='', quantity=1):
        """Add item to cart or update existing quantity"""
        from products.models import Product
        
        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            raise ValueError("Product not found")
        
        if not product.in_stock:
            raise ValueError("Product is out of stock")
        
        # Try to find existing cart item
        existing_item = CartItem.objects.filter(
            user=user,
            product=product,
            size=size
        ).first()
        
        if existing_item:
            new_quantity = existing_item.quantity + quantity
            if new_quantity > product.stock_quantity:
                raise ValueError("Not enough stock available")
            
            existing_item.quantity = new_quantity
            existing_item.save()
            return existing_item
        else:
            if quantity > product.stock_quantity:
                raise ValueError("Not enough stock available")
            
            return CartItem.objects.create(
                user=user,
                product=product,
                size=size,
                quantity=quantity
            )
    
    def update_quantity(self, user, product_id, size, new_quantity):
        """Update cart item quantity with aggregation logic"""
        if new_quantity <= 0:
            return self.remove_from_cart(user, product_id, size)
        
        # Get all items for this product and size combination
        items = CartItem.objects.filter(
            user=user,
            product_id=product_id,
            size=size
        ).order_by('created_at')
        
        if not items:
            raise ValueError("Cart item not found")
        
        # Calculate current total quantity
        current_total = sum(item.quantity for item in items)
        
        if new_quantity == current_total:
            return items.first()  # No change needed
        
        # Check stock availability
        product = items.first().product
        if new_quantity > product.stock_quantity:
            raise ValueError("Not enough stock available")
        
        # Remove all duplicate items except the first one
        items_to_delete = items[1:]
        for item in items_to_delete:
            item.delete()
        
        # Update the first item with new quantity
        first_item = items.first()
        first_item.quantity = new_quantity
        first_item.save()
        
        return first_item
    
    def remove_from_cart(self, user, product_id, size=''):
        """Remove all items matching product and size from cart"""
        deleted_count = CartItem.objects.filter(
            user=user,
            product_id=product_id,
            size=size
        ).delete()[0]
        
        return deleted_count > 0
    
    def clear_cart(self, user):
        """Clear all items from user's cart"""
        return CartItem.objects.filter(user=user).delete()[0]
    
    def get_cart_totals(self, user):
        """Calculate cart totals"""
        from django.db.models import Sum, F
        
        totals = CartItem.objects.filter(user=user).aggregate(
            total_items=Sum('quantity'),
            subtotal=Sum(F('quantity') * F('product__price'))
        )
        
        subtotal = totals['subtotal'] or Decimal('0.00')
        total_items = totals['total_items'] or 0
        
        # Calculate tax (8% as per your current logic)
        tax_rate = Decimal('0.08')
        tax = subtotal * tax_rate
        total = subtotal + tax
        
        return {
            'total_items': total_items,
            'subtotal': subtotal,
            'tax': tax,
            'tax_rate': tax_rate,
            'total': total
        }


# Add the manager to CartItem
CartItem.add_to_class('aggregated', AggregatedCartManager())