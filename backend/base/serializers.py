# orders/serializers.py

from rest_framework import serializers
from .models import Order
from django.core.mail import send_mail
from django.conf import settings

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['status', 'created_at']

    def create(self, validated_data):
        order = Order.objects.create(**validated_data)

        return order
