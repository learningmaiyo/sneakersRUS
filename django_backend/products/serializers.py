from rest_framework import serializers
from .models import Product, WishlistItem


class ProductSerializer(serializers.ModelSerializer):
    """Serializer for Product model"""
    is_on_sale = serializers.ReadOnlyField()
    discount_percentage = serializers.ReadOnlyField()
    is_wishlisted = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'brand', 'description', 'price', 'original_price',
            'image_url', 'category', 'sizes', 'colors', 'tags',
            'stock_quantity', 'in_stock', 'is_new', 'featured',
            'is_on_sale', 'discount_percentage', 'is_wishlisted',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_is_wishlisted(self, obj):
        """Check if product is in user's wishlist"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return WishlistItem.objects.filter(
                user=request.user, 
                product=obj
            ).exists()
        return False


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating products (admin only)"""
    
    class Meta:
        model = Product
        fields = [
            'name', 'brand', 'description', 'price', 'original_price',
            'image_url', 'category', 'sizes', 'colors', 'tags',
            'stock_quantity', 'in_stock', 'is_new', 'featured'
        ]
    
    def validate_sizes(self, value):
        """Validate sizes array"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Sizes must be an array")
        return value
    
    def validate_colors(self, value):
        """Validate colors array"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Colors must be an array")
        return value
    
    def validate_tags(self, value):
        """Validate tags array"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Tags must be an array")
        return value
    
    def validate(self, attrs):
        """Cross-field validation"""
        if attrs.get('original_price') and attrs.get('price'):
            if attrs['original_price'] < attrs['price']:
                raise serializers.ValidationError(
                    "Original price cannot be less than current price"
                )
        return attrs


class WishlistItemSerializer(serializers.ModelSerializer):
    """Serializer for wishlist items"""
    product = ProductSerializer(read_only=True)
    product_id = serializers.UUIDField(write_only=True)
    
    class Meta:
        model = WishlistItem
        fields = ['id', 'product', 'product_id', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def create(self, validated_data):
        """Create wishlist item with current user"""
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)