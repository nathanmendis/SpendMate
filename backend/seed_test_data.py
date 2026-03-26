import os
import django
import sys
from datetime import date, timedelta
import random

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Transaction

def seed():
    # Clean existing
    Transaction.objects.all().delete()
    
    categories = ['Food & Dining', 'Bills & Utilities', 'Subscriptions', 'Shopping', 'Transfers', 'Miscellaneous']
    people = ['Rahul Raut', 'Priya Sharma', 'Karan Mehta', 'Anita Dass', 'Vikram Singh']
    upi_ids = ['rahul@okhdfc', 'priya@okaxis', 'karan@okicici', 'anita@paytm', 'vikram@okb']
    
    # Add income
    Transaction.objects.create(
        date=date.today() - timedelta(days=20),
        description="SALARY CREDIT",
        amount=75000.00,
        type='CREDIT',
        category='Miscellaneous',
        balance=75000.00
    )
    
    current_balance = 75000.00
    
    # Add expenses
    for i in range(1, 31):
        is_credit = random.random() < 0.2
        amount = round(random.uniform(50, 2000), 2)
        trans_type = 'CREDIT' if is_credit else 'DEBIT'
        category = random.choice(categories)
        person = random.choice(people)
        upi_id = random.choice(upi_ids)
        
        if trans_type == 'CREDIT':
            current_balance += amount
        else:
            current_balance -= amount
            
        Transaction.objects.create(
            date=date.today() - timedelta(days=i),
            description=f"{'TRANSFER FROM' if is_credit else 'TRANSFER TO'} {person} VIA UPI",
            amount=amount,
            type=trans_type,
            category=category,
            person=person,
            upi_id=upi_id,
            balance=current_balance
        )
        
    print(f"Successfully seeded {Transaction.objects.count()} transactions.")

if __name__ == '__main__':
    seed()
