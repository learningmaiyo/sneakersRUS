# Django E-commerce Backend

Complete Django + PostgreSQL migration from your Supabase-based sneaker store.

## 🚀 Quick Start

1. **Setup Environment**
```bash
cd django_backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Database Setup**
```bash
# Create PostgreSQL database
createdb ecommerce_db

# Copy environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
python manage.py migrate
python manage.py createsuperuser
```

3. **Load Initial Data**
```bash
# Create products, migrate from Supabase
python manage.py loaddata fixtures/initial_data.json
```

4. **Run Development Server**
```bash
python manage.py runserver
```

## 📱 Frontend Integration

Update your React app API calls:

```javascript
// OLD: Supabase
const { data } = await supabase.from('products').select('*')

// NEW: Django API
const response = await fetch('http://localhost:8000/api/v1/products/')
const data = await response.json()
```

## 🔄 Key Differences

| Feature | Supabase | Django |
|---------|----------|---------|
| **Cart Aggregation** | Frontend logic | Database-level aggregation |
| **Authentication** | JWT tokens | Django JWT + sessions |
| **Admin Interface** | Custom React components | Django Admin (rich features) |
| **Real-time Updates** | Built-in subscriptions | WebSockets + Channels |
| **File Storage** | Supabase Storage | Django + AWS S3 |

## 🎯 Migration Benefits

- **Better Performance**: Database-level cart aggregation
- **Rich Admin Interface**: Django Admin replaces custom admin
- **Scalability**: Proven Django patterns for e-commerce
- **Security**: Built-in CSRF, XSS protection
- **Ecosystem**: Extensive package ecosystem

Your Django + PostgreSQL backend is now ready with all Supabase functionality migrated!