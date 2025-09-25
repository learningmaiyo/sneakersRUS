from rest_framework import serializers
from .models import Order, OrderItem, OrderStatus
from products.serializers import ProductSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for order items"""
    product = ProductSerializer(read_only=True)
    subtotal = serializers.ReadOnlyField()
    
    class Meta:
        model = OrderItem
        fields = [
            'id', 'product', 'quantity', 'price_at_time', 'size', 
            'subtotal', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for orders"""
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    total_items = serializers.ReadOnlyField()
    can_be_cancelled = serializers.ReadOnlyField()
    
    # Currency conversion
    total_amount_usd = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'user_email', 'total_amount', 'total_amount_usd',
            'status', 'stripe_session_id', 'shipping_address', 'notes',
            'total_items', 'can_be_cancelled', 'items',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'order_number', 'user_email', 'total_amount', 
            'total_items', 'can_be_cancelled', 'created_at', 'updated_at'
        ]
    
    def get_total_amount_usd(self, obj):
        """Convert total amount to USD"""
        from django.conf import settings
        zar_to_usd_rate = getattr(settings, 'ZAR_TO_USD_RATE', 0.055)
        return round(float(obj.total_amount) * zar_to_usd_rate, 2)


class OrderListSerializer(serializers.ModelSerializer):
    """Simplified serializer for order list view"""
    user_email = serializers.CharField(source='user.email', read_only=True)
    total_items = serializers.ReadOnlyField()
    total_amount_usd = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'user_email', 'total_amount', 'total_amount_usd',
            'status', 'total_items', 'created_at'
        ]
        read_only_fields = fields
    
    def get_total_amount_usd(self, obj):
        """Convert total amount to USD"""
        from django.conf import settings
        zar_to_usd_rate = getattr(settings, 'ZAR_TO_USD_RATE', 0.055)
        return round(float(obj.total_amount) * zar_to_usd_rate, 2)


class CreateOrderSerializer(serializers.Serializer):
    """Serializer for creating orders from cart"""
    shipping_address = serializers.JSONField(required=False, allow_null=True)
    notes = serializers.CharField(max_length=1000, required=False, allow_blank=True)
    
    def validate_shipping_address(self, value):
        """Validate shipping address structure"""
        if value:
            required_fields = ['first_name', 'last_name', 'address_line_1', 'city', 'postal_code', 'country']
            for field in required_fields:
                if field not in value:
                    raise serializers.ValidationError(f"Missing required field: {field}")
        return value


class UpdateOrderStatusSerializer(serializers.Serializer):
    """Serializer for updating order status (admin only)"""
    status = serializers.ChoiceField(choices=OrderStatus.choices)
    notes = serializers.CharField(max_length=1000, required=False, allow_blank=True)
    
    def validate_status(self, value):
        """Validate status transition"""
        order = self.context.get('order')
        if order:
            # Define valid status transitions
            valid_transitions = {
                OrderStatus.PENDING: [OrderStatus.PAID, OrderStatus.CANCELLED],
                OrderStatus.PAID: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
                OrderStatus.PROCESSING: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
                OrderStatus.SHIPPED: [OrderStatus.DELIVERED],
                OrderStatus.DELIVERED: [OrderStatus.REFUNDED],
                OrderStatus.CANCELLED: [],  # Terminal state
                OrderStatus.REFUNDED: [],   # Terminal state
            }
            
            current_status = order.status
            if value not in valid_transitions.get(current_status, []):
                raise serializers.ValidationError(
                    f"Cannot change status from {current_status} to {value}"
                )
        
        return value