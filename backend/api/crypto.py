from cryptography.fernet import Fernet
from django.conf import settings
import hashlib
import hmac

class CryptoManager:
    def __init__(self):
        self.fernet = Fernet(settings.ENCRYPTION_KEY.encode())
        self.salt = settings.SECRET_KEY.encode() # Using Django secret as salt for blind index

    def encrypt(self, data):
        if not data: return None
        return self.fernet.encrypt(str(data).encode()).decode()

    def decrypt(self, encrypted_data):
        if not encrypted_data: return None
        try:
            return self.fernet.decrypt(encrypted_data.encode()).decode()
        except:
            return "[ENCRYPTION ERROR]"

    def generate_blind_index(self, data):
        if not data: return None
        # This allows searching for exact matches of lowercase values without revealing the PII
        payload = str(data).lower().strip().encode()
        return hmac.new(self.salt, payload, hashlib.sha256).hexdigest()

crypto = CryptoManager()
