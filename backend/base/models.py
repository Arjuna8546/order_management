from django.db import models

class Order(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('confirm', 'Confirm'),
        ('ready to dispatch', 'Ready to Dispatch'),
        ('deliver', 'Deliver'),
    ]

    customer_name = models.CharField(max_length=255)
    customer_id = models.CharField(max_length=100)
    user_email = models.EmailField()
    quantity = models.PositiveIntegerField()
    product = models.CharField(max_length=255)
    product_cost = models.DecimalField(max_digits=10, decimal_places=2)
    total_cost = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} - {self.customer_name}"