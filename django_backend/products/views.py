from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Product, WishlistItem
from .serializers import (
    ProductSerializer, ProductCreateUpdateSerializer, 
    WishlistItemSerializer
)


class IsAdminOrReadOnly(permissions.BasePermission):
    """Custom permission for admin-only write access"""
    
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.is_staff


class ProductViewSet(viewsets.ModelViewSet):
    """ViewSet for products with search and filtering"""
    queryset = Product.objects.all()
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    search_fields = ['name', 'brand', 'description', 'category']
    ordering_fields = ['name', 'brand', 'price', 'created_at']
    ordering = ['-created_at']
    filterset_fields = ['brand', 'category', 'in_stock', 'is_new', 'featured']
    
    def get_serializer_class(self):
        """Use different serializer for create/update"""
        if self.action in ['create', 'update', 'partial_update']:
            return ProductCreateUpdateSerializer
        return ProductSerializer
    
    def get_queryset(self):
        """Filter products based on query parameters"""
        queryset = super().get_queryset()
        
        # Filter by price range
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Filter by size availability
        size = self.request.query_params.get('size')
        if size:
            queryset = queryset.filter(sizes__contains=size)
        
        # Filter by color availability
        color = self.request.query_params.get('color')
        if color:
            queryset = queryset.filter(colors__contains=color)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured products"""
        featured_products = self.get_queryset().filter(featured=True)
        page = self.paginate_queryset(featured_products)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(featured_products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def new_arrivals(self, request):
        """Get new arrival products"""
        new_products = self.get_queryset().filter(is_new=True)
        page = self.paginate_queryset(new_products)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(new_products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def on_sale(self, request):
        """Get products on sale"""
        sale_products = self.get_queryset().filter(
            original_price__isnull=False,
            original_price__gt=models.F('price')
        )
        page = self.paginate_queryset(sale_products)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(sale_products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def brands(self, request):
        """Get all available brands"""
        brands = self.get_queryset().values_list('brand', flat=True).distinct()
        return Response(sorted(brands))
    
    @action(detail=False, methods=['get'])
    def categories(self, request):
        """Get all available categories"""
        categories = self.get_queryset().values_list('category', flat=True).distinct()
        return Response(sorted(filter(None, categories)))


class WishlistViewSet(viewsets.ModelViewSet):
    """ViewSet for wishlist management"""
    serializer_class = WishlistItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Get current user's wishlist"""
        return WishlistItem.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def toggle(self, request):
        """Toggle product in wishlist"""
        product_id = request.data.get('product_id')
        
        if not product_id:
            return Response(
                {'error': 'product_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            wishlist_item = WishlistItem.objects.get(
                user=request.user, 
                product_id=product_id
            )
            wishlist_item.delete()
            return Response({'message': 'Product removed from wishlist'})
        
        except WishlistItem.DoesNotExist:
            try:
                wishlist_item = WishlistItem.objects.create(
                    user=request.user,
                    product_id=product_id
                )
                serializer = self.get_serializer(wishlist_item)
                return Response({
                    'message': 'Product added to wishlist',
                    'item': serializer.data
                }, status=status.HTTP_201_CREATED)
            
            except Exception as e:
                return Response(
                    {'error': str(e)}, 
                    status=status.HTTP_400_BAD_REQUEST
                )