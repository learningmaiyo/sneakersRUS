from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from .models import Order, OrderItem, OrderStatus


class OrderItemInline(admin.TabularInline):
    """Inline admin for order items"""
    model = OrderItem
    readonly_fields = ['subtotal', 'created_at']
    extra = 0
    
    def subtotal(self, obj):
        """Display subtotal"""
        return f"R{obj.subtotal:.2f}"
    subtotal.short_description = 'Subtotal'


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """Admin configuration for Order model"""
    list_display = [
        'order_number', 'user_link', 'status', 'total_amount', 
        'total_items', 'created_at'
    ]
    list_filter = [
        'status', 'created_at', 'updated_at'
    ]
    search_fields = [
        'order_number', 'user__email', 'stripe_session_id', 'notes'
    ]
    readonly_fields = [
        'id', 'order_number', 'total_items', 'created_at', 'updated_at'
    ]
    
    fieldsets = (
        ('Order Information', {
            'fields': ('order_number', 'user', 'status')
        }),
        ('Payment', {
            'fields': ('total_amount', 'stripe_session_id')
        }),
        ('Shipping', {
            'fields': ('shipping_address',),
            'classes': ('collapse',)
        }),
        ('Notes', {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
        ('System Information', {
            'fields': ('id', 'total_items', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [OrderItemInline]
    
    def get_queryset(self, request):
        """Optimize queryset"""
        return super().get_queryset(request).select_related('user').prefetch_related('items')
    
    def user_link(self, obj):
        """Create link to user admin page"""
        url = reverse('admin:accounts_user_change', args=[obj.user.id])
        return format_html('<a href="{}">{}</a>', url, obj.user.email)
    user_link.short_description = 'User'
    user_link.admin_order_field = 'user__email'
    
    def total_items(self, obj):
        """Display total items count"""
        return obj.total_items
    total_items.short_description = 'Items'
    
    actions = ['mark_as_paid', 'mark_as_processing', 'mark_as_shipped', 'cancel_orders']
    
    def mark_as_paid(self, request, queryset):
        """Mark selected orders as paid"""
        updated = queryset.filter(status=OrderStatus.PENDING).update(status=OrderStatus.PAID)
        self.message_user(request, f'{updated} orders marked as paid.')
    mark_as_paid.short_description = "Mark selected orders as paid"
    
    def mark_as_processing(self, request, queryset):
        """Mark selected orders as processing"""
        updated = queryset.filter(status=OrderStatus.PAID).update(status=OrderStatus.PROCESSING)
        self.message_user(request, f'{updated} orders marked as processing.')
    mark_as_processing.short_description = "Mark selected orders as processing"
    
    def mark_as_shipped(self, request, queryset):
        """Mark selected orders as shipped"""
        updated = queryset.filter(status=OrderStatus.PROCESSING).update(status=OrderStatus.SHIPPED)
        self.message_user(request, f'{updated} orders marked as shipped.')
    mark_as_shipped.short_description = "Mark selected orders as shipped"
    
    def cancel_orders(self, request, queryset):
        """Cancel selected orders"""
        updated = 0
        for order in queryset:
            if order.can_be_cancelled:
                order.status = OrderStatus.CANCELLED
                order.save()
                updated += 1
        self.message_user(request, f'{updated} orders cancelled.')
    cancel_orders.short_description = "Cancel selected orders"


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    """Admin configuration for OrderItem model"""
    list_display = [
        'order_link', 'product_link', 'quantity', 'price_at_time', 
        'size', 'subtotal', 'created_at'
    ]
    list_filter = [
        'created_at', 'product__brand', 'size'
    ]
    search_fields = [
        'order__order_number', 'product__name', 'product__brand'
    ]
    readonly_fields = [
        'id', 'subtotal', 'created_at', 'updated_at'
    ]
    
    def get_queryset(self, request):
        """Optimize queryset"""
        return super().get_queryset(request).select_related('order', 'product')
    
    def order_link(self, obj):
        """Create link to order admin page"""
        url = reverse('admin:orders_order_change', args=[obj.order.id])
        return format_html('<a href="{}">{}</a>', url, obj.order.order_number)
    order_link.short_description = 'Order'
    order_link.admin_order_field = 'order__order_number'
    
    def product_link(self, obj):
        """Create link to product admin page"""
        url = reverse('admin:products_product_change', args=[obj.product.id])
        return format_html('<a href="{}">{}</a>', url, obj.product.name)
    product_link.short_description = 'Product'
    product_link.admin_order_field = 'product__name'
    
    def subtotal(self, obj):
        """Display subtotal"""
        return f"R{obj.subtotal:.2f}"
    subtotal.short_description = 'Subtotal'