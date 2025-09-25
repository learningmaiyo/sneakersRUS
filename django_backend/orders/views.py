from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from django.db.models import Q
from .models import Order, OrderStatus
from .serializers import (
    OrderSerializer, OrderListSerializer, CreateOrderSerializer,
    UpdateOrderStatusSerializer
)


class IsOwnerOrAdmin(permissions.BasePermission):
    """Custom permission: users can only see their own orders, admins see all"""
    
    def has_permission(self, request, view):
        return request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # Admin can access any order
        if request.user.is_staff:
            return True
        
        # User can only access their own orders
        return obj.user == request.user


class OrderViewSet(viewsets.ModelViewSet):
    """ViewSet for order management"""
    permission_classes = [IsOwnerOrAdmin]
    
    def get_queryset(self):
        """Filter orders based on user permissions"""
        if self.request.user.is_staff:
            # Admin can see all orders
            queryset = Order.objects.all()
        else:
            # Regular users can only see their own orders
            queryset = Order.objects.filter(user=self.request.user)
        
        # Filter by status
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        # Search functionality
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(order_number__icontains=search) |
                Q(user__email__icontains=search) |
                Q(notes__icontains=search)
            )
        
        return queryset.select_related('user').prefetch_related('items__product')
    
    def get_serializer_class(self):
        """Use different serializers for different actions"""
        if self.action == 'list':
            return OrderListSerializer
        elif self.action == 'create':
            return CreateOrderSerializer
        return OrderSerializer
    
    def create(self, request):
        """Create order from current cart"""
        serializer = CreateOrderSerializer(data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    order = Order.objects.create_from_cart(
                        user=request.user,
                        shipping_address=serializer.validated_data.get('shipping_address'),
                        notes=serializer.validated_data.get('notes', '')
                    )
                
                order_serializer = OrderSerializer(order)
                return Response(
                    {
                        'message': 'Order created successfully',
                        'order': order_serializer.data
                    },
                    status=status.HTTP_201_CREATED
                )
                
            except ValueError as e:
                return Response(
                    {'error': str(e)}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel an order"""
        order = self.get_object()
        
        if order.cancel_order():
            return Response({
                'message': 'Order cancelled successfully',
                'order': OrderSerializer(order).data
            })
        else:
            return Response(
                {'error': 'Order cannot be cancelled in its current status'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['put'], permission_classes=[permissions.IsAdminUser])
    def update_status(self, request, pk=None):
        """Update order status (admin only)"""
        order = self.get_object()
        serializer = UpdateOrderStatusSerializer(
            data=request.data, 
            context={'order': order}
        )
        
        if serializer.is_valid():
            order.status = serializer.validated_data['status']
            
            # Add notes if provided
            notes = serializer.validated_data.get('notes')
            if notes:
                existing_notes = order.notes or ''
                timestamp = timezone.now().strftime('%Y-%m-%d %H:%M')
                new_note = f"\n[{timestamp}] {notes}"
                order.notes = existing_notes + new_note
            
            order.save()
            
            return Response({
                'message': 'Order status updated successfully',
                'order': OrderSerializer(order).data
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def my_orders(self, request):
        """Get current user's orders"""
        if request.user.is_anonymous:
            return Response(
                {'error': 'Authentication required'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        orders = Order.objects.filter(user=request.user)
        page = self.paginate_queryset(orders)
        if page is not None:
            serializer = OrderListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = OrderListSerializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def statistics(self, request):
        """Get order statistics (admin only)"""
        from django.db.models import Count, Sum, Avg
        from django.utils import timezone
        from datetime import timedelta
        
        # Date filters
        today = timezone.now().date()
        last_30_days = today - timedelta(days=30)
        
        # Basic statistics
        total_orders = Order.objects.count()
        paid_orders = Order.objects.filter(status=OrderStatus.PAID).count()
        total_revenue = Order.objects.filter(
            status__in=[OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED]
        ).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        
        # Recent statistics
        recent_orders = Order.objects.filter(created_at__date__gte=last_30_days)
        recent_revenue = recent_orders.filter(
            status__in=[OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED]
        ).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        
        # Average order value
        avg_order_value = Order.objects.filter(
            status__in=[OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED]
        ).aggregate(Avg('total_amount'))['total_amount__avg'] or 0
        
        # Orders by status
        status_breakdown = {}
        for status_choice in OrderStatus.choices:
            status_breakdown[status_choice[1]] = Order.objects.filter(
                status=status_choice[0]
            ).count()
        
        return Response({
            'total_orders': total_orders,
            'paid_orders': paid_orders,
            'total_revenue': float(total_revenue),
            'recent_revenue_30_days': float(recent_revenue),
            'average_order_value': float(avg_order_value),
            'orders_by_status': status_breakdown,
            'conversion_rate': (paid_orders / total_orders * 100) if total_orders > 0 else 0
        })