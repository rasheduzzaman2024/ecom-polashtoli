# 🚀 Polashtoli Backend API

Complete Spring Boot REST API for Polashtoli E-Commerce Store with PostgreSQL database.

## 📋 Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- PostgreSQL 12 or higher
- IntelliJ IDEA (recommended) or any Java IDE

## 🗄️ Database Setup

### 1. Start PostgreSQL

```bash
# Ubuntu/Debian
sudo service postgresql start

# macOS
brew services start postgresql
```

### 2. Database Already Created

Your database `polashtoli_db` is already set up with all tables and demo data!

```sql
Database: polashtoli_db
User: postgres
Password: postgres (change in application.properties)
```

## ⚙️ Configuration

### Update Database Credentials

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/polashtoli_db
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD  # Change this!
```

## 🚀 Running the Application

### Method 1: Using IntelliJ IDEA

1. **Import Project:**
   - Open IntelliJ IDEA
   - File → Open
   - Select the `polashtoli-backend` folder
   - Wait for Maven to download dependencies

2. **Run Application:**
   - Open `PolashtolicApplication.java`
   - Click the green play button ▶️
   - Or press `Shift + F10`

3. **Verify:**
   ```
   🚀 Polashtoli Backend API is running!
   📍 http://localhost:8080/api
   ```

### Method 2: Using Maven Command Line

```bash
cd polashtoli-backend

# Clean and install dependencies
mvn clean install

# Run application
mvn spring-boot:run
```

### Method 3: Using JAR File

```bash
# Build JAR
mvn clean package

# Run JAR
java -jar target/polashtoli-backend-1.0.0.jar
```

## 📡 API Endpoints

Base URL: `http://localhost:8080/api`

### 🛍️ Products API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products` | Get all products |
| GET | `/products/{id}` | Get product by ID |
| GET | `/products/sku/{sku}` | Get product by SKU |
| POST | `/products` | Create new product |
| PUT | `/products/{id}` | Update product |
| DELETE | `/products/{id}` | Delete product |
| GET | `/products/category/{category}` | Filter by category |
| GET | `/products/search?q={query}` | Search products |
| GET | `/products/featured` | Get featured products |
| GET | `/products/stock/{status}` | Filter by stock status |
| GET | `/products/stats` | Get product statistics |

### 👥 Customers API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customers` | Get all customers |
| GET | `/customers/{id}` | Get customer by ID |
| GET | `/customers/email/{email}` | Get customer by email |
| POST | `/customers` | Create new customer |
| PUT | `/customers/{id}` | Update customer |
| DELETE | `/customers/{id}` | Delete customer |
| GET | `/customers/search?q={query}` | Search customers |
| GET | `/customers/stats` | Get customer statistics |

### 📦 Orders API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders` | Get all orders |
| GET | `/orders/{id}` | Get order by ID |
| POST | `/orders` | Create new order |
| PUT | `/orders/{id}` | Update order |
| DELETE | `/orders/{id}` | Delete order |
| PATCH | `/orders/{id}/status?status={status}` | Update order status |
| GET | `/orders/customer/{customerId}` | Get customer orders |
| GET | `/orders/status/{status}` | Filter by status |
| GET | `/orders/recent` | Get recent orders |
| GET | `/orders/stats` | Get order statistics |

### 🎟️ Coupons API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/coupons` | Get all coupons |
| GET | `/coupons/{id}` | Get coupon by ID |
| GET | `/coupons/code/{code}` | Get coupon by code |
| POST | `/coupons` | Create new coupon |
| PUT | `/coupons/{id}` | Update coupon |
| DELETE | `/coupons/{id}` | Delete coupon |
| GET | `/coupons/active` | Get active coupons |
| POST | `/coupons/validate?code={code}&amount={amount}` | Validate coupon |
| GET | `/coupons/stats` | Get coupon statistics |

## 🧪 Testing API Endpoints

### Using cURL:

```bash
# Get all products
curl http://localhost:8080/api/products

# Get product by ID
curl http://localhost:8080/api/products/2601060001

# Create new product
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "category": "electronics",
    "price": 5000,
    "stock": 10,
    "sku": "TEST-001",
    "description": "Test product"
  }'

# Search products
curl "http://localhost:8080/api/products/search?q=samsung"

# Get product statistics
curl http://localhost:8080/api/products/stats
```

### Using Postman:

1. Import the collection (create one with endpoints above)
2. Set base URL: `http://localhost:8080/api`
3. Test each endpoint

### Using Browser:

- http://localhost:8080/api/products
- http://localhost:8080/api/customers
- http://localhost:8080/api/orders
- http://localhost:8080/api/coupons

## 📊 Sample Request/Response

### Create Product:

**Request:**
```json
POST /api/products
Content-Type: application/json

{
  "name": "Samsung Galaxy S24",
  "category": "electronics",
  "price": 85000,
  "discount": 10,
  "stock": 25,
  "sku": "ELEC-001",
  "description": "Latest Samsung flagship smartphone",
  "images": ["https://example.com/image.jpg"],
  "tags": ["trending", "new arrival"],
  "featured": true
}
```

**Response:**
```json
{
  "id": "2601070001",
  "name": "Samsung Galaxy S24",
  "category": "electronics",
  "price": 85000,
  "discount": 10,
  "stock": 25,
  "sku": "ELEC-001",
  "description": "Latest Samsung flagship smartphone",
  "images": ["https://example.com/image.jpg"],
  "tags": ["trending", "new arrival"],
  "featured": true,
  "status": "active",
  "createdAt": "2026-01-07",
  "updatedAt": "2026-01-07T10:30:00"
}
```

## 🔧 Troubleshooting

### Port 8080 Already in Use

```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>

# Or change port in application.properties
server.port=8081
```

### Database Connection Failed

```properties
# Check PostgreSQL is running
sudo service postgresql status

# Verify credentials in application.properties
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD
```

### Maven Dependencies Not Downloaded

```bash
# Force update
mvn clean install -U

# Or in IntelliJ: Right-click pom.xml → Maven → Reload Project
```

## 📁 Project Structure

```
polashtoli-backend/
├── src/main/java/com/polashtoli/
│   ├── PolashtolicApplication.java     # Main application
│   ├── config/
│   │   └── CorsConfig.java             # CORS configuration
│   ├── controller/
│   │   ├── ProductController.java      # Products REST API
│   │   ├── CustomerController.java     # Customers REST API
│   │   ├── OrderController.java        # Orders REST API
│   │   └── CouponController.java       # Coupons REST API
│   ├── service/
│   │   ├── ProductService.java         # Products business logic
│   │   ├── CustomerService.java        # Customers business logic
│   │   ├── OrderService.java           # Orders business logic
│   │   └── CouponService.java          # Coupons business logic
│   ├── repository/
│   │   ├── ProductRepository.java      # Products data access
│   │   ├── CustomerRepository.java     # Customers data access
│   │   ├── OrderRepository.java        # Orders data access
│   │   └── CouponRepository.java       # Coupons data access
│   └── model/
│       ├── Product.java                # Product entity
│       ├── Customer.java               # Customer entity
│       ├── Order.java                  # Order entity
│       ├── OrderItem.java              # Order item entity
│       └── Coupon.java                 # Coupon entity
├── src/main/resources/
│   └── application.properties          # Configuration
└── pom.xml                             # Maven dependencies
```

## 🎯 Features

✅ Complete CRUD operations for all entities
✅ RESTful API design
✅ PostgreSQL database integration
✅ JPA/Hibernate ORM
✅ Auto-generated product IDs (YYMMDDNNNN format)
✅ Transaction management
✅ Exception handling
✅ CORS configuration
✅ Search and filter capabilities
✅ Statistics endpoints
✅ Validation

## 🔜 Next Steps

1. **Start the backend** (see Running section above)
2. **Test API endpoints** using browser/Postman/cURL
3. **Connect frontend** to backend API
4. **Update frontend** to use real data instead of demo data

## 📞 Support

For issues or questions:
1. Check logs in console/terminal
2. Verify database connection
3. Check API endpoint URLs
4. Review error messages

## 📄 License

MIT License - Feel free to use for your projects!

---

**Backend Status:** ✅ Ready to run!
**Database:** ✅ Connected to PostgreSQL
**API:** ✅ All endpoints ready
**Frontend Integration:** 🔄 Ready to connect
