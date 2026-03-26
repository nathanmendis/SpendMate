from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from django.db.models import Sum, Count, Q
from django.db.models.functions import TruncMonth, TruncDay
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Transaction
from .serializers import TransactionSerializer
from .services.parser import BankStatementParser
from .crypto import crypto
import tempfile
import os

class UploadStatementView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp:
            for chunk in file_obj.chunks():
                temp.write(chunk)
            temp_path = temp.name

        try:
            parser = BankStatementParser(temp_path)
            transactions_data = parser.parse()

            saved_transactions = []
            for item in transactions_data:
                # Deduplication per user
                if not Transaction.objects.filter(
                    user=request.user,
                    date=item['date'], 
                    description=item['description'], 
                    amount=item['amount']
                ).exists():
                    serializer = TransactionSerializer(data=item)
                    if serializer.is_valid():
                        serializer.save(user=request.user)
                        saved_transactions.append(serializer.data)

            return Response({
                'message': f'Successfully parsed {len(transactions_data)} transactions.',
                'saved': len(saved_transactions),
                'transactions': saved_transactions[:10]
            }, status=status.HTTP_201_CREATED)
        finally:
            if os.path.exists(temp_path):
                os.remove(temp_path)

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        base_qs = Transaction.objects.filter(user=request.user)
        total_income = base_qs.filter(type='CREDIT').aggregate(Sum('amount'))['amount__sum'] or 0
        total_expense = base_qs.filter(type='DEBIT').aggregate(Sum('amount'))['amount__sum'] or 0
        net_balance = total_income - total_expense

        category_breakdown = base_qs.filter(type='DEBIT').values('category').annotate(
            total=Sum('amount'), 
            count=Count('id')
        ).order_by('-total')

        daily_trends = base_qs.filter(type='DEBIT').annotate(day=TruncDay('date')).values('day').annotate(
            total=Sum('amount')
        ).order_by('day')

        return Response({
            'overview': {
                'income': total_income,
                'expense': total_expense,
                'net': net_balance
            },
            'categories': list(category_breakdown),
            'trends': list(daily_trends)
        })

class PersonAnalysisView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # Fetch all transactions with a person assigned for this user
        transactions = Transaction.objects.filter(user=request.user).exclude(person__isnull=True)
        
        # Grouping in memory because 'person' is encrypted in the DB
        grouped_stats = {}
        
        for tx in transactions:
            name = crypto.decrypt(tx.person)
            if not name:
                continue
                
            if name not in grouped_stats:
                grouped_stats[name] = {
                    'person': name,
                    'sent': 0,
                    'received': 0,
                    'count': 0
                }
            
            amount = float(tx.amount)
            if tx.type == 'DEBIT':
                grouped_stats[name]['sent'] += amount
            else:
                grouped_stats[name]['received'] += amount
            
            grouped_stats[name]['count'] += 1
            
        # Convert dictionary to a list and calculate Net position
        stats = []
        for name, data in grouped_stats.items():
            data['net'] = data['received'] - data['sent']
            stats.append(data)
            
        # Sort by most sent (as per original logic)
        stats.sort(key=lambda x: x['sent'], reverse=True)
            
        return Response(stats)

class UPISearchView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        upi_id = request.query_params.get('upi_id')
        if not upi_id:
            return Response({'error': 'UPI ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Use Blind Index for searching
        index = crypto.generate_blind_index(upi_id)
        transactions = Transaction.objects.filter(user=request.user, upi_id_index=index).order_by('-date')
        stats = transactions.aggregate(
            sent=Sum('amount', filter=Q(type='DEBIT')),
            received=Sum('amount', filter=Q(type='CREDIT')),
            count=Count('id')
        )
        
        serializer = TransactionSerializer(transactions, many=True)
        return Response({
            'upi_id': upi_id,
            'summary': {
                'sent': stats['sent'] or 0,
                'received': stats['received'] or 0,
                'net': (stats['received'] or 0) - (stats['sent'] or 0),
                'count': stats['count']
            },
            'transactions': serializer.data
        })

class ClearDataView(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self, request):
        count, _ = Transaction.objects.filter(user=request.user).delete()
        return Response({'message': f'Successfully cleared {count} transactions.'})

class PersonTransactionsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        person_name = request.query_params.get('name')
        if not person_name:
            return Response({'error': 'Person name is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # We must filter in memory because 'person' field is encrypted
        transactions = Transaction.objects.filter(user=request.user).exclude(person__isnull=True)
        
        person_txs = []
        sent = 0
        received = 0
        
        for tx in transactions:
            decrypted_name = crypto.decrypt(tx.person)
            if decrypted_name == person_name:
                # Use serializer for consistent output
                serializer = TransactionSerializer(tx)
                data = serializer.data
                person_txs.append(data)
                
                amount = float(tx.amount)
                if tx.type == 'DEBIT':
                    sent += amount
                else:
                    received += amount
        
        # Sort by date desc
        person_txs.sort(key=lambda x: x['date'], reverse=True)
        
        return Response({
            'person': person_name,
            'summary': {
                'sent': sent,
                'received': received,
                'net': received - sent,
                'count': len(person_txs)
            },
            'transactions': person_txs
        })

class DayTransactionsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        target_date = request.query_params.get('date')
        if not target_date:
            return Response({'error': 'Date is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        transactions = Transaction.objects.filter(user=request.user, date=target_date)
        
        sent = transactions.filter(type='DEBIT').aggregate(Sum('amount'))['amount__sum'] or 0
        received = transactions.filter(type='CREDIT').aggregate(Sum('amount'))['amount__sum'] or 0
        
        serializer = TransactionSerializer(transactions, many=True)
        return Response({
            'date': target_date,
            'summary': {
                'sent': sent,
                'received': received,
                'net': received - sent,
                'count': transactions.count()
            },
            'transactions': serializer.data
        })

class HealthView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        return Response({'status': 'ok'})

class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        if not username or not password:
            return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(username=username, password=password, email=email)
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
