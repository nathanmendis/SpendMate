from rest_framework import serializers
from .models import Transaction
from .crypto import crypto

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'date', 'amount', 'type', 'category', 'description', 'person', 'upi_id', 'balance', 'created_at']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # Decrypt sensitive fields for the frontend
        ret['description'] = crypto.decrypt(instance.description)
        ret['person'] = crypto.decrypt(instance.person)
        ret['upi_id'] = crypto.decrypt(instance.upi_id)
        ret['balance'] = crypto.decrypt(instance.balance)
        return ret
