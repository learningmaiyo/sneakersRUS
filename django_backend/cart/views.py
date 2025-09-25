from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from .models import CartItem
from .serializers import (
    CartItemSerializer, AggregatedCartItemSerializer, 
    AddToCartSerializer, UpdateCartItemSerializer, CartTotalsSerializer
)


class CartViewSet(viewsets.ModelViewSet):
    """ViewSet for cart management with aggregation support"""
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Get current user's cart items"""
        return CartItem.objects.filter(user=self.request.user).select_related('product')
    
    @action(detail=False, methods=['get'])
    def aggregated(self, request):
        """Get aggregated cart items (main cart view)"""
        try:
            aggregated_items = CartItem.aggregated.get_aggregated_cart(request.user)
            serializer = AggregatedCartItemSerializer(aggregated_items, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """Add item to cart with smart aggregation"""
        serializer = AddToCartSerializer(data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    cart_item = CartItem.aggregated.add_to_cart(
                        user=request.user,
                        product_id=serializer.validated_data['product_id'],
                        size=serializer.validated_data.get('size', ''),
                        quantity=serializer.validated_data.get('quantity', 1)
                    )
                
                return Response({
                    'message': 'Item added to cart successfully',
                    'item': CartItemSerializer(cart_item).data
                }, status=status.HTTP_201_CREATED)
                
            except ValueError as e:
                return Response(
                    {'error': str(e)}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['put'])
    def update_quantity(self, request):
        """Update cart item quantity with aggregation logic"""
        serializer = UpdateCartItemSerializer(data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    if serializer.validated_data['quantity'] == 0:
                        # Remove item
                        removed = CartItem.aggregated.remove_from_cart(
                            user=request.user,
                            product_id=serializer.validated_data['product_id'],
                            size=serializer.validated_data.get('size', '')
                        )
                        
                        if removed:
                            return Response({'message': 'Item removed from cart'})
                        else:
                            return Response(
                                {'error': 'Item not found'}, 
                                status=status.HTTP_404_NOT_FOUND
                            )
                    else:
                        # Update quantity
                        cart_item = CartItem.aggregated.update_quantity(
                            user=request.user,
                            product_id=serializer.validated_data['product_id'],
                            size=serializer.validated_data.get('size', ''),
                            new_quantity=serializer.validated_data['quantity']
                        )
                        
                        return Response({
                            'message': 'Cart updated successfully',
                            'item': CartItemSerializer(cart_item).data
                        })
                        
            except ValueError as e:
                return Response(
                    {'error': str(e)}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['delete'])
    def remove_item(self, request):
        """Remove item from cart"""
        product_id = request.query_params.get('product_id')
        size = request.query_params.get('size', '')
        
        if not product_id:
            return Response(
                {'error': 'product_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            with transaction.atomic():
                removed = CartItem.aggregated.remove_from_cart(
                    user=request.user,
                    product_id=product_id,
                    size=size
                )
                
                if removed:
                    return Response({'message': 'Item removed from cart'})
                else:
                    return Response(
                        {'error': 'Item not found'}, 
                        status=status.HTTP_404_NOT_FOUND
                    )
                    
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['delete'])
    def clear(self, request):
        """Clear entire cart"""
        try:
            with transaction.atomic():
                count = CartItem.aggregated.clear_cart(request.user)
                return Response({
                    'message': f'Cart cleared. {count} items removed.'
                })
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def totals(self, request):
        """Get cart totals and summary"""
        try:
            totals = CartItem.aggregated.get_cart_totals(request.user)
            serializer = CartTotalsSerializer(totals)
            return Response(serializer.data)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    @action(detail=False, methods=['get'])
    def raw_items(self, request):
        """Get raw cart items (for checkout/order processing)"""
        cart_items = self.get_queryset()
        serializer = CartItemSerializer(cart_items, many=True)
        return Response(serializer.data)