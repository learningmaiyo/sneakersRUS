from django.contrib import admin
from .models import CartItem


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    """Admin configuration for CartItem model"""
    list_display = [
        'user', 'product', 'quantity', 'size', 'subtotal', 'created_at'
    ]
    list_filter = [
        'created_at', 'updated_at', 'product__brand', 'size'
    ]
    search_fields = [
        'user__email', 'product__name', 'product__brand'
    ]
    readonly_fields = ['id', 'subtotal', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Cart Item', {
            'fields': ('user', 'product', 'quantity', 'size')
        }),
        ('Details', {
            'fields': ('subtotal',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        """Optimize queryset"""
        return super().get_queryset(request).select_related('user', 'product')
    
    def subtotal(self, obj):
        """Display subtotal for cart item"""
        return f"R{obj.subtotal:.2f}"
    subtotal.short_description = 'Subtotal'