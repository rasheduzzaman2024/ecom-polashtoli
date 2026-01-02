# 📂 Project Structure Overview

```
polashtoli-store/
│
├── 📱 frontend/                          # Client-side application
│   ├── index.html                        # Homepage with hero, featured products
│   ├── products.html                     # Product listing page (create this)
│   ├── cart.html                         # Shopping cart page (create this)
│   ├── login.html                        # Login/Register page (create this)
│   │
│   ├── css/
│   │   └── style.css                     # Main stylesheet (modern, animated)
│   │
│   └── js/
│       └── main.js                       # Main JavaScript (API calls, chatbot)
│
├── ⚙️ backend/                           # Spring Boot server
│   ├── src/main/
│   │   ├── java/com/polashtoli/store/
│   │   │   ├── PolashtolicStoreApplication.java  # Main app class
│   │   │   │
│   │   │   ├── controller/               # REST API endpoints
│   │   │   │   └── ProductController.java    # Products API
│   │   │   │
│   │   │   ├── service/                  # Business logic
│   │   │   │   └── ProductService.java       # Product operations
│   │   │   │
│   │   │   ├── repository/               # Database access
│   │   │   │   ├── ProductRepository.java
│   │   │   │   ├── UserRepository.java
│   │   │   │   ├── OrderRepository.java
│   │   │   │   ├── CartRepository.java
│   │   │   │   └── CategoryRepository.java
│   │   │   │
│   │   │   ├── model/                    # JPA entities
│   │   │   │   ├── Product.java
│   │   │   │   ├── User.java
│   │   │   │   ├── Order.java
│   │   │   │   ├── OrderItem.java
│   │   │   │   ├── Cart.java
│   │   │   │   ├── CartItem.java
│   │   │   │   ├── Category.java
│   │   │   │   ├── Brand.java
│   │   │   │   ├── Role.java
│   │   │   │   └── Review.java
│   │   │   │
│   │   │   ├── dto/                      # Data transfer objects
│   │   │   │   └── ProductDTO.java
│   │   │   │
│   │   │   ├── security/                 # Security configuration
│   │   │   │   └── (JWT, authentication)
│   │   │   │
│   │   │   ├── config/                   # App configuration
│   │   │   │   └── (CORS, OpenAPI, etc.)
│   │   │   │
│   │   │   └── exception/                # Exception handling
│   │   │       └── (Custom exceptions)
│   │   │
│   │   └── resources/
│   │       └── application.properties    # App configuration
│   │
│   ├── pom.xml                           # Maven dependencies
│   └── Dockerfile                        # Backend containerization
│
├── 🤖 chatbot/                           # AI assistant service
│   ├── app/
│   │   ├── main.py                       # FastAPI application
│   │   └── models/                       # ML models (optional)
│   │
│   ├── requirements.txt                  # Python dependencies
│   └── Dockerfile                        # Chatbot containerization
│
├── 🗄️ database/
│   └── schema.sql                        # Complete PostgreSQL schema
│
├── 🐳 docker/
│   └── docker-compose.yml                # Multi-container orchestration
│
├── 📖 Documentation
│   ├── README.md                         # Main documentation
│   ├── QUICK_START.md                    # Getting started guide
│   ├── ARCHITECTURE.md                   # System architecture
│   └── PROJECT_STRUCTURE.md              # This file
│
└── .gitignore                            # Git ignore rules
```

## 🎯 Key Files Explained

### Frontend Files

**index.html** - Homepage
- Hero carousel with product promotions
- Featured products section
- Category cards
- Newsletter subscription
- AI chatbot integration
- Fully responsive design

**style.css** - Custom Styling
- Modern gradient designs
- Smooth animations
- Custom fonts (Playfair Display + Work Sans)
- Mobile-first responsive layout
- Chatbot UI styles

**main.js** - Frontend Logic
- API integration functions
- Shopping cart management
- Product loading and display
- Chatbot communication
- Search functionality
- Notification system

### Backend Files

**PolashtolicStoreApplication.java**
- Spring Boot entry point
- Application configuration
- Component scanning

**Controllers** - REST API Endpoints
```java
ProductController.java
├── GET    /api/products           // All products
├── GET    /api/products/{id}      // Single product
├── GET    /api/products/featured  // Featured products
├── GET    /api/products/search    // Search products
├── POST   /api/products           // Create product
├── PUT    /api/products/{id}      // Update product
└── DELETE /api/products/{id}      // Delete product
```

**Models** - Database Entities
- Represent database tables
- Define relationships
- Include validation
- Implement auditing

**Repositories** - Data Access
- Spring Data JPA interfaces
- Custom queries
- Database operations

**DTOs** - Data Transfer Objects
- Clean data structures
- API response format
- Request validation

### Database Files

**schema.sql** - Database Structure
```sql
├── Users & Authentication
│   ├── users
│   ├── roles
│   └── user_roles
│
├── Product Catalog
│   ├── products
│   ├── categories
│   ├── brands
│   ├── product_images
│   └── product_tags
│
├── Shopping & Orders
│   ├── carts
│   ├── cart_items
│   ├── orders
│   └── order_items
│
├── Reviews & Engagement
│   ├── reviews
│   └── user_wishlist
│
└── Utilities
    └── newsletter_subscriptions
```

### Chatbot Files

**main.py** - AI Service
- FastAPI application
- Natural language processing
- Intent recognition
- Response generation
- Backend API integration

## 📝 File Creation Status

### ✅ Created Files
- [x] Frontend: index.html, style.css, main.js
- [x] Backend: Application, Controllers, Models, Repositories
- [x] Chatbot: main.py, requirements.txt
- [x] Database: schema.sql
- [x] Docker: docker-compose.yml, Dockerfiles
- [x] Docs: README, QUICK_START, ARCHITECTURE

### 📋 Files to Create (as needed)
- [ ] Frontend: products.html, cart.html, login.html, profile.html
- [ ] Backend: Service implementations, Security config
- [ ] Tests: Unit tests, Integration tests
- [ ] CI/CD: GitHub Actions, deployment scripts

## 🚀 Adding New Features

### To Add a New Entity
1. Create model in `backend/src/.../model/`
2. Create repository in `backend/src/.../repository/`
3. Create DTO in `backend/src/.../dto/`
4. Create service in `backend/src/.../service/`
5. Create controller in `backend/src/.../controller/`
6. Update database schema in `database/schema.sql`

### To Add a New Frontend Page
1. Create HTML file in `frontend/`
2. Link CSS: `<link rel="stylesheet" href="css/style.css">`
3. Link JS: `<script src="js/main.js"></script>`
4. Add navigation links in existing pages

### To Add Chatbot Features
1. Update intent recognition in `chatbot/app/main.py`
2. Add response templates
3. Integrate with backend APIs
4. Test conversation flows

## 🔍 Finding Specific Code

**Want to find...**
- API endpoints? → Look in `controller/` files
- Database queries? → Look in `repository/` files
- Business logic? → Look in `service/` files
- Database structure? → Look in `database/schema.sql`
- Frontend styles? → Look in `frontend/css/style.css`
- API calls? → Look in `frontend/js/main.js`

## 🎨 Customization Quick Reference

| What to Change | Where to Look |
|----------------|---------------|
| Colors & Theme | `frontend/css/style.css` (`:root` variables) |
| Store Name | Search "Polashtoli" across all files |
| Database Settings | `backend/src/.../resources/application.properties` |
| API URLs | `frontend/js/main.js` (top of file) |
| Chatbot Responses | `chatbot/app/main.py` (process_message function) |
| Product Categories | `database/schema.sql` or via API |

## 📚 Documentation Priority

1. **QUICK_START.md** - Start here!
2. **README.md** - Comprehensive guide
3. **ARCHITECTURE.md** - System design
4. **This file** - Navigate the codebase

---

Happy exploring! 🎉
