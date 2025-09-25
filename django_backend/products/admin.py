from django.contrib import admin
from .models import Product, WishlistItem


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """Admin configuration for Product model"""
    list_display = [
        'name', 'brand', 'price', 'original_price', 'category',
        'stock_quantity', 'in_stock', 'featured', 'is_new', 'created_at'
    ]
    list_filter = [
        'brand', 'category', 'in_stock', 'featured', 'is_new', 'created_at'
    ]
    search_fields = ['name', 'brand', 'description', 'category']
    list_editable = ['price', 'stock_quantity', 'in_stock', 'featured', 'is_new']
    readonly_fields = ['id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'brand', 'description', 'category')
        }),
        ('Pricing', {
            'fields': ('price', 'original_price')
        }),
        ('Media', {
            'fields': ('image_url',)
        }),
        ('Variants', {
            'fields': ('sizes', 'colors', 'tags'),
            'classes': ('collapse',)
        }),
        ('Inventory', {
            'fields': ('stock_quantity', 'in_stock')
        }),
        ('Status', {
            'fields': ('featured', 'is_new')
        }),
        ('Timestamps', {
            'fields': ('id', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        """Optimize queryset"""
        return super().get_queryset(request).select_related()


@admin.register(WishlistItem)
class WishlistItemAdmin(admin.ModelAdmin):
    """Admin configuration for WishlistItem model"""
    list_display = ['user', 'product', 'created_at']
    list_filter = ['created_at', 'product__brand']
    search_fields = ['user__email', 'product__name', 'product__brand']
    readonly_fields = ['id', 'created_at']
    
    def get_queryset(self, request):
        """Optimize queryset"""
        return super().get_queryset(request).select_related('user', 'product')