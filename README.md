# 📊 SpendMate - High-Precision Bank Statement Analyzer

A high-performance, **full-stack financial hub** designed to parse bank statement PDFs (Union Bank, HDFC, ICICI, etc.) and generate precision insights—securely and automatically.

---

## 🚀 Key Features

### 📄 precision Regex Parsing
- **Advanced Regex Engine**: Specially tuned for Indian bank formats (including **Union Bank** / **UPIAR** / **UPIAB**).
- **Automatic Entity Extraction**: Identifies names, UPI IDs, and bank prefixes from long transaction narratives.
- **Categorization Engine**: Rules-based classification (Food, Bills, Shopping, etc.) for high-speed spend tracking.

### 🛡️ Production-Grade Security
- **JWT Authentication**: Secure user sessions powered by `djangorestframework-simplejwt`.
- **AES-256 Encryption at Rest**: Sensitive PII (Names, Descriptions, UPI IDs) is encrypted via **Fernet** before storage.
- **Blind Search Indexing**: Fast searching for encrypted UPI IDs using cryptographic hashes (HMAC-SHA256).
- **Multi-Tenant Data Isolation**: Database-level filtering ensures users only ever see their own transactions.

### 📈 Analytics Dashboard
- **Real-time Visualization**: Dynamic daily trend charts (Recharts) and category breakdowns.
- **Person-wise Analysis**: Consolidated views of all money sent/received per contact with net-position tracking.
- **Unified Health Monitoring**: Live status indicator showing real-time backend pulse and sync status.

---

## 🛠️ Tech Stack

- **Backend**: Django 6.x, Django REST Framework, **PostgreSQL 15**, `pdfplumber`, `cryptography`, `dj-database-url`.
- **Frontend**: **React 18** (Vite), **Tailwind CSS v4**, Framer Motion, Recharts, Lucide Icons.
- **Architecture**: **Dockerized** with multi-stage builds and Nginx production web server.

---

## 🐳 Getting Started (Docker Compose)

The entire project is containerized for a one-command setup.

**Ensure you have Docker and Docker Compose installed.**

1. **Clone and Enter**
   ```bash
   cd spend_mate
   ```

2. **Launch with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the App**
   - **Frontend**: [http://localhost](http://localhost)
   - **Backend API**: [http://localhost:8080/api/](http://localhost:8080/api/)
   - **Database**: PostgreSQL (Containerized)

---

## ⚙️ Development Setup (No Docker)

If you wish to run without Docker, ensure you have **Poetry** (Python) and **Node.js** installed.

### 🐍 Backend
```bash
cd backend
python -m poetry install
# Set Environment Variables (DATABASE_URL, SECRET_KEY, ENCRYPTION_KEY)
python -m poetry run python manage.py migrate
python -m poetry run python manage.py runserver 0.0.0.0:8080
```

### ⚛️ Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🏦 Bank Statement Support
SpendMate's parser is modular. To add support for a new bank format, simply extend the logic in `backend/api/services/parser.py`. Current optimizations include robust handling for **Union Bank of India** and generic Indian UPI statements.

---

## 🛡️ License
MIT License. Built for performance and privacy.
