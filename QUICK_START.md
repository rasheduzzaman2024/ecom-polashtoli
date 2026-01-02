# 🚀 Polashtoli Store - Quick Start Guide

## Welcome! 👋

This guide will help you get Polashtoli Store up and running in minutes.

## What You Have

A complete, production-ready e-commerce platform with:
- ✅ Modern, responsive frontend (HTML/CSS/JavaScript)
- ✅ Powerful backend API (Spring Boot + PostgreSQL)
- ✅ AI-powered chatbot (Python + FastAPI)
- ✅ Docker deployment ready
- ✅ Complete database schema
- ✅ Comprehensive documentation

## Fastest Way to Start (Docker - Recommended)

### Prerequisites
- Docker Desktop installed
- That's it!

### Steps

1. **Navigate to the project**
   ```bash
   cd polashtoli-store/docker
   ```

2. **Start everything**
   ```bash
   docker-compose up -d
   ```

3. **Access your store**
   - 🌐 Website: http://localhost
   - 🔧 Backend API: http://localhost:8080
   - 📚 API Docs: http://localhost:8080/swagger-ui.html
   - 🤖 Chatbot: http://localhost:5000

4. **Check status**
   ```bash
   docker-compose ps
   ```

That's it! Your e-commerce store is live! 🎉

## Manual Setup (For Development)

### Prerequisites
- Java 17+
- Maven 3.9+
- Python 3.11+
- PostgreSQL 15+

### Step 1: Database

```bash
# Create database
createdb polashtoli_db

# Load schema
psql -d polashtoli_db -f database/schema.sql
```

### Step 2: Backend

```bash
cd backend

# Update database credentials in:
# src/main/resources/application.properties

# Run
mvn clean install
mvn spring-boot:run
```

Backend starts at http://localhost:8080

### Step 3: Chatbot

```bash
cd chatbot

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run
python -m app.main
```

Chatbot starts at http://localhost:5000

### Step 4: Frontend

Just open `frontend/index.html` in your browser!

Or use a simple HTTP server:
```bash
cd frontend
python -m http.server 8081
```

Access at http://localhost:8081

## 🎯 What to Explore First

1. **Homepage** (`frontend/index.html`)
   - Beautiful hero section
   - Featured products
   - Category browsing
   - AI chatbot (bottom right corner)

2. **API Documentation** (http://localhost:8080/swagger-ui.html)
   - All endpoints documented
   - Try them out interactively!

3. **Database** (`database/schema.sql`)
   - Well-designed schema
   - Sample data included
   - Optimized indexes

4. **Chatbot** (Click the chat button)
   - Try: "Show me electronics"
   - Try: "What are today's deals?"
   - Try: "Check my order"

## 🎨 Customization Quick Wins

### Change Colors
Edit `frontend/css/style.css`:
```css
:root {
    --primary-color: #6366f1;  /* Change this! */
    --secondary-color: #8b5cf6;
    --accent-color: #ec4899;
}
```

### Change Store Name
Search and replace "Polashtoli" with your store name in:
- `frontend/index.html`
- `frontend/css/style.css`
- `README.md`

### Add Products
Use the API or directly in database:
```sql
INSERT INTO products (name, description, price, stock_quantity, category_id)
VALUES ('Your Product', 'Description', 99.99, 100, 1);
```

## 📱 Features to Try

### User Features
- Browse products by category
- Search for products
- Add items to cart
- View cart and checkout
- AI chatbot assistance
- Product reviews
- Wishlist

### Admin Features (TODO)
- Add/edit products
- Manage orders
- View analytics
- Manage users
- Configure settings

## 🔐 Default Credentials

Create your admin user:
```sql
INSERT INTO users (email, password, first_name, last_name)
VALUES ('admin@polashtoli.com', '$2a$10$...', 'Admin', 'User');

INSERT INTO user_roles (user_id, role_id)
VALUES (1, 2); -- Assuming role_id 2 is ADMIN
```

## 🛠️ Common Issues & Solutions

### Port Already in Use
```bash
# Find process using port 8080
lsof -i :8080  # Mac/Linux
netstat -ano | findstr :8080  # Windows

# Kill it or change port in application.properties
```

### Database Connection Failed
- Check PostgreSQL is running
- Verify credentials in `application.properties`
- Ensure database `polashtoli_db` exists

### Maven Build Failed
```bash
# Clean and rebuild
mvn clean install -U

# Skip tests if needed
mvn clean install -DskipTests
```

### Python Dependencies Error
```bash
# Upgrade pip first
pip install --upgrade pip

# Then install dependencies
pip install -r requirements.txt
```

## 📚 Next Steps

1. Read `README.md` for comprehensive documentation
2. Check `ARCHITECTURE.md` to understand the system
3. Explore the API with Swagger UI
4. Customize the frontend design
5. Add your own products
6. Configure payment gateways
7. Set up email notifications
8. Deploy to production!

## 🎓 Learning Resources

- **Spring Boot**: https://spring.io/guides
- **FastAPI**: https://fastapi.tiangolo.com
- **PostgreSQL**: https://www.postgresql.org/docs
- **Bootstrap**: https://getbootstrap.com/docs
- **Docker**: https://docs.docker.com

## 💬 Need Help?

- Check the README.md for detailed docs
- Review the code comments
- Explore the API documentation
- Check the database schema

## 🎉 You're Ready!

Your e-commerce platform is set up and ready to customize. Build something amazing!

---

**Built with ❤️ for your success!**

Happy coding! 🚀
