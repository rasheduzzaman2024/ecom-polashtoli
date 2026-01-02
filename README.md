# Polashtoli Store - Advanced E-Commerce Platform

A modern, full-stack e-commerce platform built with cutting-edge technologies and AI-powered shopping assistant.

## 🚀 Features

### Frontend
- **Responsive Design**: Mobile-first, responsive UI using Bootstrap 5
- **Modern UI/UX**: Beautiful, professional design with smooth animations
- **Product Management**: Advanced product browsing, filtering, and search
- **Shopping Cart**: Real-time cart management with persistent storage
- **User Authentication**: Secure login and registration system
- **AI Chatbot**: Intelligent shopping assistant for customer support

### Backend
- **RESTful API**: Clean, well-documented REST APIs
- **Authentication & Authorization**: JWT-based security with role-based access
- **Database**: PostgreSQL with optimized queries and indexes
- **Order Management**: Complete order processing workflow
- **Payment Integration**: Support for multiple payment gateways (bKash, Nagad, Cards)
- **Email Notifications**: Automated email system for orders and updates

### AI Chatbot
- **Natural Language Processing**: Understands customer queries
- **Product Recommendations**: AI-powered product suggestions
- **Order Tracking**: Real-time order status updates
- **Customer Support**: 24/7 automated assistance
- **Context-Aware**: Maintains conversation context
- **Multi-Intent Recognition**: Handles multiple user intents

## 🛠️ Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 5.3
- Custom animations and effects
- Responsive design

### Backend
- **Framework**: Spring Boot 3.2
- **Language**: Java 17
- **Database**: PostgreSQL 15
- **ORM**: Spring Data JPA / Hibernate
- **Security**: Spring Security with JWT
- **API Documentation**: Swagger/OpenAPI
- **Build Tool**: Maven

### AI Chatbot
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **AI/ML**: Custom NLP engine (extensible with OpenAI, Anthropic, etc.)
- **Data Processing**: Pandas, NumPy
- **Database**: PostgreSQL (shared with backend)

### DevOps
- Docker & Docker Compose
- Nginx (reverse proxy)
- Redis (caching)

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.9+
- Python 3.11+
- PostgreSQL 15+
- Node.js 18+ (optional, for frontend dev tools)
- Docker & Docker Compose (for containerized deployment)

## 🚀 Quick Start

### Option 1: Docker Deployment (Recommended)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/polashtoli-store.git
   cd polashtoli-store
   ```

2. **Start all services**
   ```bash
   cd docker
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:8080
   - API Documentation: http://localhost:8080/swagger-ui.html
   - Chatbot API: http://localhost:5000

### Option 2: Manual Setup

#### 1. Database Setup

```bash
# Create PostgreSQL database
createdb polashtoli_db

# Run schema
psql -d polashtoli_db -f database/schema.sql
```

#### 2. Backend Setup

```bash
cd backend

# Update application.properties with your database credentials

# Build and run
mvn clean install
mvn spring-boot:run
```

The backend will start on http://localhost:8080

#### 3. Chatbot Setup

```bash
cd chatbot

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the chatbot
python -m app.main
```

The chatbot will start on http://localhost:5000

#### 4. Frontend Setup

Simply open `frontend/index.html` in a web browser, or serve it with a web server:

```bash
cd frontend
python -m http.server 8081
```

Access at http://localhost:8081

## 📁 Project Structure

```
polashtoli-store/
├── frontend/                 # Frontend application
│   ├── index.html           # Homepage
│   ├── products.html        # Products listing
│   ├── cart.html           # Shopping cart
│   ├── login.html          # Authentication
│   ├── css/
│   │   └── style.css       # Custom styles
│   └── js/
│       └── main.js         # Main JavaScript
│
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/polashtoli/store/
│   │   │   │   ├── controller/    # REST Controllers
│   │   │   │   ├── service/       # Business Logic
│   │   │   │   ├── repository/    # Data Access
│   │   │   │   ├── model/         # Entity Models
│   │   │   │   ├── dto/           # Data Transfer Objects
│   │   │   │   ├── security/      # Security Config
│   │   │   │   └── config/        # Configuration
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/             # Unit & Integration Tests
│   ├── pom.xml              # Maven dependencies
│   └── Dockerfile
│
├── chatbot/                 # Python AI Chatbot
│   ├── app/
│   │   ├── main.py         # FastAPI application
│   │   └── models/         # ML models
│   ├── requirements.txt
│   └── Dockerfile
│
├── database/
│   └── schema.sql          # Database schema
│
└── docker/
    └── docker-compose.yml  # Docker orchestration
```

## 🔌 API Endpoints

### Products API
- `GET /api/products` - Get all products (with pagination)
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/featured` - Get featured products
- `GET /api/products/search?q={query}` - Search products
- `GET /api/products/category/{categoryId}` - Get products by category
- `GET /api/products/filter` - Filter products (price, rating, etc.)
- `POST /api/products` - Create new product (Admin)
- `PUT /api/products/{id}` - Update product (Admin)
- `DELETE /api/products/{id}` - Delete product (Admin)

### Authentication API
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Orders API
- `GET /api/orders` - Get user orders
- `GET /api/orders/{id}` - Get order details
- `POST /api/orders` - Create new order
- `PUT /api/orders/{id}/status` - Update order status (Admin)

### Cart API
- `GET /api/cart` - Get user cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/{id}` - Update cart item
- `DELETE /api/cart/items/{id}` - Remove cart item
- `DELETE /api/cart` - Clear cart

### Chatbot API
- `POST /api/chat` - Send message to chatbot
- `POST /api/recommendations` - Get product recommendations
- `GET /api/health` - Health check

## 🔐 Security

- **JWT Authentication**: Secure token-based authentication
- **Password Encryption**: BCrypt password hashing
- **CORS**: Configured Cross-Origin Resource Sharing
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Input sanitization
- **HTTPS**: SSL/TLS support (configure in production)

## 🎨 Customization

### Frontend Styling
Edit `frontend/css/style.css` to customize:
- Colors (CSS variables in `:root`)
- Fonts
- Animations
- Layout

### Backend Configuration
Edit `backend/src/main/resources/application.properties`:
- Database connection
- JWT secret
- Email settings
- Payment gateway credentials

### Chatbot Behavior
Edit `chatbot/app/main.py`:
- Response templates
- Intent recognition
- Product recommendation logic
- Integration with AI services (OpenAI, Anthropic, etc.)

## 📊 Database Schema

Key tables:
- `users` - User accounts and profiles
- `products` - Product catalog
- `categories` - Product categories
- `brands` - Product brands
- `orders` - Order records
- `order_items` - Order line items
- `carts` - Shopping carts
- `cart_items` - Cart contents
- `reviews` - Product reviews
- `roles` - User roles

See `database/schema.sql` for complete schema.

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### API Testing
Use the Swagger UI at http://localhost:8080/swagger-ui.html

### Chatbot Testing
```bash
cd chatbot
pytest tests/
```

## 📈 Performance Optimization

- **Database Indexing**: Optimized indexes on frequently queried columns
- **Caching**: Redis integration for session and data caching
- **Lazy Loading**: Efficient data loading strategies
- **Connection Pooling**: HikariCP for database connections
- **CDN**: Bootstrap and icons loaded from CDN

## 🚀 Deployment

### Production Checklist
- [ ] Update `application.properties` with production database
- [ ] Set strong JWT secret
- [ ] Configure SSL/TLS certificates
- [ ] Set up backup strategy
- [ ] Configure monitoring and logging
- [ ] Enable HTTPS
- [ ] Set up environment variables
- [ ] Configure firewall rules
- [ ] Set up CI/CD pipeline

### Cloud Deployment Options
- **AWS**: EC2, RDS, S3, CloudFront
- **Google Cloud**: Compute Engine, Cloud SQL, Cloud Storage
- **Azure**: Virtual Machines, Azure Database for PostgreSQL
- **Heroku**: Easy deployment with PostgreSQL add-on
- **DigitalOcean**: Droplets, Managed Databases

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Support

For support, email info@polashtoli.com or join our Slack channel.

## 🎯 Roadmap

- [ ] Mobile app (React Native / Flutter)
- [ ] Advanced analytics dashboard
- [ ] Multi-vendor marketplace
- [ ] Social media integration
- [ ] Advanced AI recommendations
- [ ] Real-time inventory management
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Progressive Web App (PWA)

## 🏆 Credits

Built with ❤️ by the Polashtoli Team

---

**Happy Shopping! 🛍️**
