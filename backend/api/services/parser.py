import re
import pdfplumber
import pandas as pd
from datetime import datetime

class BankStatementParser:
    def __init__(self, file_path):
        self.file_path = file_path
        self.categories = {
            'Food & Dining': ['zomato', 'swiggy', 'mcdonald', 'kfc', 'starbucks', 'uber eats', 'restaurant', 'bakery'],
            'Bills & Utilities': ['airtel', 'jio', 'vi', 'bescom', 'recharge', 'electricity', 'gas', 'water'],
            'Subscriptions': ['netflix', 'prime', 'spotify', 'hotstar', 'youtube'],
            'Shopping': ['amazon', 'flipkart', 'myntra', 'ajio', 'shopping', 'store', 'mall'],
            'Transfers': ['transfer', 'neft', 'rtgs', 'imps', 'upi', 'to'],
            'Miscellaneous': []
        }

    def parse(self):
        transactions = []
        with pdfplumber.open(self.file_path) as pdf:
            for page in pdf.pages:
                tables = page.extract_tables()
                for table in tables:
                    # Filter and clean table
                    df = pd.DataFrame(table)
                    # Simple heuristic: header usually contains "Date"
                    if not df.empty and any("date" in str(col).lower() for col in df.iloc[0]):
                        # Set header
                        df.columns = df.iloc[0]
                        df = df[1:]
                        
                        # Process rows
                        for _, row in df.iterrows():
                            # Clean and identify columns
                            data = self._process_row(row)
                            if data:
                                transactions.append(data)
        return transactions

    def _process_row(self, row):
        # We need at least Date, Description, Amount
        # Columns might vary by bank. This is a generic logic.
        # Most statements: [Date, Particulars, Withdrawal, Deposit, Balance]
        try:
            row_dict = row.to_dict()
            date_str = self._get_val(row_dict, ['date', 'value date'])
            desc = self._get_val(row_dict, ['particulars', 'description', 'narration'])
            debit = self._get_val(row_dict, ['withdrawal', 'debit', 'dr'])
            credit = self._get_val(row_dict, ['deposit', 'credit', 'cr'])
            balance = self._get_val(row_dict, ['balance'])

            if not date_str or not desc:
                return None

            # Parse date
            parsed_date = self._parse_date(date_str)
            if not parsed_date:
                return None

            # Determine type and amount
            amount = 0
            trans_type = 'DEBIT'
            
            debit_val = self._parse_amount(debit)
            credit_val = self._parse_amount(credit)

            if credit_val > 0:
                amount = credit_val
                trans_type = 'CREDIT'
            elif debit_val > 0:
                amount = debit_val
                trans_type = 'DEBIT'
            else:
                return None

            # Analysis
            upi_id = self._extract_upi_id(desc)
            person = self._extract_person(desc)
            category = self._categorize(desc)

            return {
                'date': parsed_date,
                'description': desc,
                'amount': amount,
                'type': trans_type,
                'category': category,
                'person': person,
                'upi_id': upi_id,
                'balance': self._parse_amount(balance)
            }
        except Exception:
            return None

    def _get_val(self, row_dict, possible_keys):
        for k in row_dict.keys():
            if str(k).lower().strip() in possible_keys:
                return row_dict[k]
        return None

    def _parse_amount(self, val):
        if not val or val == '' or str(val).lower() == 'nan':
            return 0
        try:
            # Remove commas and non-numeric characters except '.'
            clean_val = re.sub(r'[^\d.]', '', str(val))
            return float(clean_val)
        except ValueError:
            return 0

    def _parse_date(self, date_str):
        # Common formats: DD-MM-YYYY, DD/MM/YYYY, DD-Mon-YYYY
        formats = ['%d-%m-%Y', '%d/%m/%Y', '%d-%b-%Y', '%Y-%m-%d', '%d %b %Y']
        date_str = str(date_str).strip()
        for fmt in formats:
            try:
                return datetime.strptime(date_str, fmt).date()
            except ValueError:
                continue
        # Fallback for multi-line or partial dates
        match = re.search(r'(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})', date_str)
        if match:
            day, month, year = match.groups()
            if len(year) == 2: year = '20' + year
            try:
                return datetime(int(year), int(month), int(day)).date()
            except ValueError:
                return None
        return None

    def _extract_upi_id(self, text):
        text = str(text)
        # Try to find a specific UPI ID in the format user@bank
        match = re.search(r'([a-zA-Z0-9.\-_]+@[a-zA-Z]+)', text)
        if match:
            return match.group(1).strip()
        return None

    def _extract_person(self, text):
        text = str(text).replace('\n', ' ').strip()
        
        # Format: UPI[A-Z]*/TXID/(DR|CR)/NAME/BANK/UPIID
        # This regex matches the name segment (usually the 4th segment)
        upi_pattern = re.search(r'UPI[A-Z]*/\d+/(?:DR|CR|dr|cr)/([^/]+)/', text)
        if upi_pattern:
            name = upi_pattern.group(1).strip()
            # Basic sanity check: names shouldn't be just numbers or very short
            if name and not name.isdigit() and len(name) > 2:
                return name

        # General split logic for multi-part descriptions
        if '/' in text:
            parts = [p.strip() for p in text.split('/') if p.strip()]
            
            # For HDFC/ICICI/Union Bank style strings
            # Look for parts that look like names (alphabetical, reasonable length)
            for p in parts:
                if p and not p.isdigit() and len(p) > 2 and '@' not in p and p not in ['UPI', 'UPIAR', 'UPIAB', 'DR', 'CR']:
                    return p
            
        # Fallback for "TO TRANSFER NAME" or "UPI-NAME"
        name_match = re.search(r'(?:TO|TRANSFER|UPI)[-\s]+([A-Z\s]{3,20})(?:\s|/|-|$)', text, re.I)
        if name_match:
            return name_match.group(1).strip()

        return None

    def _categorize(self, text):
        text = str(text).lower()
        for category, keywords in self.categories.items():
            for kw in keywords:
                if kw in text:
                    return category
        return 'Miscellaneous'
