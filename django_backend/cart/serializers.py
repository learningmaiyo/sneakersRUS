from rest_framework import serializers
from .models import CartItem
from products.serializers import ProductSerializer


class CartItemSerializer(serializers.ModelSerializer):
    """Serializer for individual cart items"""
    product = ProductSerializer(read_only=True)
    product_id = serializers.UUIDField(write_only=True, required=False)
    subtotal = serializers.ReadOnlyField()
    
    class Meta:
        model = CartItem
        fields = [
            'id', 'product', 'product_id', 'quantity', 'size', 
            'subtotal', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AggregatedCartItemSerializer(serializers.Serializer):
    """Serializer for aggregated cart items"""
    product = ProductSerializer(read_only=True)
    size = serializers.CharField(allow_blank=True, allow_null=True)
    total_quantity = serializers.IntegerField()
    item_ids = serializers.ListField(child=serializers.CharField())
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2)
    
    def to_representation(self, instance):
        """Convert aggregated cart data to serialized format"""
        # Handle the case where instance is a dict from the manager
        if isinstance(instance, dict):
            return {
                'product': ProductSerializer(instance['product']).data,
                'size': instance['size'],
                'total_quantity': instance['total_quantity'],
                'item_ids': instance['item_ids'],
                'subtotal': str(instance['subtotal'])
            }
        return super().to_representation(instance)


class AddToCartSerializer(serializers.Serializer):
    """Serializer for adding items to cart"""
    product_id = serializers.UUIDField()
    quantity = serializers.IntegerField(min_value=1, default=1)
    size = serializers.CharField(allow_blank=True, default='')
    
    def validate_product_id(self, value):
        """Validate product exists"""
        from products.models import Product
        
        try:
            product = Product.objects.get(id=value)
            if not product.in_stock:
                raise serializers.ValidationError("Product is out of stock")
            return value
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product not found")


class UpdateCartItemSerializer(serializers.Serializer):
    """Serializer for updating cart item quantity"""
    product_id = serializers.UUIDField()
    size = serializers.CharField(allow_blank=True, default='')
    quantity = serializers.IntegerField(min_value=0)
    
    def validate_product_id(self, value):
        """Validate product exists"""
        from products.models import Product
        
        try:
            Product.objects.get(id=value)
            return value
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product not found")


class CartTotalsSerializer(serializers.Serializer):
    """Serializer for cart totals"""
    total_items = serializers.IntegerField()
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2)
    tax = serializers.DecimalField(max_digits=10, decimal_places=2)
    tax_rate = serializers.DecimalField(max_digits=5, decimal_places=4)
    total = serializers.DecimalField(max_digits=10, decimal_places=2)
    
    # Currency conversion (matching your current logic)
    total_usd = serializers.SerializerMethodField()
    
    def get_total_usd(self, obj):
        """Convert total to USD"""
        from django.conf import settings
        zar_to_usd_rate = getattr(settings, 'ZAR_TO_USD_RATE', 0.055)
        return round(float(obj['total']) * zar_to_usd_rate, 2)