# orders/signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Order
from django.core.mail import EmailMessage
from django.conf import settings

@receiver(post_save, sender=Order)
def send_order_email(sender, instance, created, **kwargs):
    if created:
        subject = f"🧾 Order #{instance.id} - {instance.customer_name}"
        
        html_content = f"""
        <html>
        <body style="font-family: Arial, sans-serif; color: #111;">
            <h2 style="color: #2c3e50;">New Order Received</h2>
            <table style="border-collapse: collapse; width: 100%;">
                <tr>
                    <td style="padding: 8px;"><strong>Order ID:</strong></td>
                    <td style="padding: 8px;">{instance.id}</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><strong>Customer Name:</strong></td>
                    <td style="padding: 8px;">{instance.customer_name}</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><strong>Product:</strong></td>
                    <td style="padding: 8px;">{instance.product}</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><strong>Quantity:</strong></td>
                    <td style="padding: 8px;">{instance.quantity}</td>
                </tr>
                <tr>
                    <td style="padding: 8px;"><strong>Total Cost:</strong></td>
                    <td style="padding: 8px;">₹{instance.total_cost}</td>
                </tr>
            </table>
            <p style="margin-top: 20px;">You can confirm this order by replying to this email with:</p>
            <p style="background-color: #f0f0f0; padding: 10px; font-family: monospace; border-left: 4px solid #3498db;">
                Order {instance.id} confirmed
            </p>
            <p style="color: #777;">This will automatically update the order status in your system.</p>
        </body>
        </html>
        """

        email = EmailMessage(
            subject=subject,
            body=html_content,
            from_email=settings.EMAIL_HOST_USER,
            to=["arjunvv447@gmail.com"],
        )
        email.content_subtype = "html" 
        email.send()