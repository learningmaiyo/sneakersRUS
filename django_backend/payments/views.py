import stripe
from django.conf import settings
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from orders.models import Order
from cart.models import CartItem

stripe.api_key = settings.STRIPE_SECRET_KEY

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_checkout_session(request):
    """Create Stripe checkout session - replaces Supabase edge function"""
    try:
        # Get user's cart items
        cart_items = CartItem.objects.filter(user=request.user).select_related('product')
        
        if not cart_items:
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Calculate totals (same logic as current implementation)
        subtotal = sum(item.subtotal for item in cart_items)
        tax = subtotal * 0.08  # 8% tax
        total_zar = subtotal + tax
        total_usd = total_zar * settings.ZAR_TO_USD_RATE
        
        # Create order
        order = Order.objects.create(
            user=request.user,
            total_amount=total_zar,
            status='pending'
        )
        
        # Create order items
        for item in cart_items:
            order.items.create(
                product=item.product,
                quantity=item.quantity,
                price_at_time=item.product.price,
                size=item.size
            )
        
        # Check for existing Stripe customer
        customers = stripe.Customer.list(email=request.user.email, limit=1)
        customer_id = customers.data[0].id if customers.data else None
        
        # Create Stripe session
        session = stripe.checkout.Session.create(
            customer=customer_id,
            customer_email=request.user.email if not customer_id else None,
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': f'Order #{order.order_number}',
                        'description': f'{len(cart_items)} items (R{total_zar:.2f} ZAR)',
                    },
                    'unit_amount': int(total_usd * 100),
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=f"{request.build_absolute_uri('/')}checkout/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{request.build_absolute_uri('/')}cart",
            metadata={
                'order_id': str(order.id),
                'user_id': str(request.user.id),
                'original_amount_zar': str(total_zar),
            },
        )
        
        # Update order with session ID
        order.stripe_session_id = session.id
        order.save()
        
        return Response({
            'url': session.url, 
            'order_id': str(order.id)
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def stripe_webhook(request):
    """Handle Stripe webhooks"""
    import json
    
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except (ValueError, stripe.error.SignatureVerificationError):
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        order_id = session['metadata']['order_id']
        
        # Update order status and clear cart
        try:
            order = Order.objects.get(id=order_id)
            order.status = 'paid'
            order.save()
            
            # Clear user's cart
            CartItem.objects.filter(user_id=session['metadata']['user_id']).delete()
            
        except Order.DoesNotExist:
            pass
    
    return Response(status=status.HTTP_200_OK)