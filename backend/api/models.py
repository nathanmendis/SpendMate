from django.db import models
from django.contrib.auth.models import User
from .crypto import crypto

class Transaction(models.Model):
    TYPE_CHOICES = (
        ('DEBIT', 'Debit'),
        ('CREDIT', 'Credit'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions', null=True, blank=True)
    date = models.DateField()
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    category = models.CharField(max_length=50, default='Miscellaneous')
    
    # Sensitive Encrypted Fields
    description = models.TextField() 
    person = models.CharField(max_length=500, null=True, blank=True)
    upi_id = models.CharField(max_length=500, null=True, blank=True)
    balance = models.CharField(max_length=500, null=True, blank=True)
    
    # Blind Index for Search (Hashed)
    upi_id_index = models.CharField(max_length=100, db_index=True, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Generate search index BEFORE encrypting
        if self.upi_id:
            self.upi_id_index = crypto.generate_blind_index(self.upi_id)
            
        # Encrypt fields (check if already encrypted to avoid double encryption)
        # In a real app we'd have a field type, but here we'll just check format
        # Fernet tokens start with 'gAAAA'
        if self.description and not self.description.startswith('gAAAA'):
            self.description = crypto.encrypt(self.description)
        if self.person and not self.person.startswith('gAAAA'):
            self.person = crypto.encrypt(self.person)
        if self.upi_id and not self.upi_id.startswith('gAAAA'):
            self.upi_id = crypto.encrypt(self.upi_id)
        if self.balance and not str(self.balance).startswith('gAAAA'):
            self.balance = crypto.encrypt(self.balance)
            
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.date} - [ENCRYPTED]"
