# 🗄️ DATABASE & BACKEND INTEGRATION GUIDE

## ✅ CURRENT STATUS:

```
Frontend:  ✅ Complete (HTML/CSS/JS with demo data)
Backend:   ❌ Not connected (need Spring Boot API)
Database:  ❌ Not created (need PostgreSQL setup)
```

---

## 🎯 COMPLETE ARCHITECTURE:

```
┌────────────────────────────────────────────────────┐
│                   FRONTEND                         │
│  (HTML + JavaScript + Bootstrap)                   │
│                                                    │
│  - products.html                                   │
│  - orders.html                                     │
│  - customers.html                                  │
└────────────┬───────────────────────────────────────┘
             │
             │ HTTP/AJAX Requests
             │ (fetch API)
             ↓
┌────────────────────────────────────────────────────┐
│               BACKEND API                          │
│         (Spring Boot + Java)                       │
│                                                    │
│  Controllers:                                      │
│  - ProductController.java                          │
│  - OrderController.java                            │
│  - CustomerController.java                         │
│  - AuthController.java                             │
│                                                    │
│  Services:                                         │
│  - ProductService.java                             │
│  - OrderService.java                               │
│  - CustomerService.java                            │
│                                                    │
│  Repositories:                                     │
│  - ProductRepository.java (JPA)                    │
│  - OrderRepository.java                            │
│  - CustomerRepository.java                         │
└────────────┬───────────────────────────────────────┘
             │
             │ JDBC/JPA
             │
             ↓
┌────────────────────────────────────────────────────┐
│              POSTGRESQL DATABASE                   │
│                                                    │
│  Tables:                                           │
│  - products                                        │
│  - orders                                          │
│  - order_items                                     │
│  - customers                                       │
│  - users (authentication)                          │
│  - coupons                                         │
│  - categories                                      │
└────────────────────────────────────────────────────┘
```

---

## 📦 PART 1: DATABASE SETUP (PostgreSQL)

### **Step 1: Install PostgreSQL**

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS (with Homebrew)
brew install postgresql
brew services start postgresql

# Check installation
psql --version
```

### **Step 2: Create Database**

```bash
# Login to PostgreSQL
sudo -u postgres psql

# Create database
CREATE DATABASE polashtoli_db;

# Create user
CREATE USER polashtoli_user WITH PASSWORD 'your_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE polashtoli_db TO polashtoli_user;

# Exit
\q
```

### **Step 3: Create Tables**

```sql
-- Connect to database
\c polashtoli_db

-- Products Table
CREATE TABLE products (
    id VARCHAR(10) PRIMARY KEY,  -- Format: YYMMDDNNNN
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(5, 2) DEFAULT 0,
    stock INT NOT NULL DEFAULT 0,
    sku VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    images TEXT[],  -- Array of image URLs
    tags TEXT[],    -- Array of tags
    featured BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'active',
    created_at DATE NOT NULL DEFAULT CURRENT_DATE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_created_date (created_at),
    INDEX idx_sku (sku)
);

-- Customers Table
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
    id VARCHAR(15) PRIMARY KEY,  -- Format: ORD-YYMMDDNNNNN
    customer_id INT REFERENCES customers(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    final_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    payment_status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(50),
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_customer (customer_id),
    INDEX idx_status (status),
    INDEX idx_created_date (created_at)
);

-- Order Items Table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(15) REFERENCES orders(id),
    product_id VARCHAR(10) REFERENCES products(id),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    INDEX idx_order (order_id),
    INDEX idx_product (product_id)
);

-- Users Table (Authentication)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,  -- Hashed
    role VARCHAR(20) NOT NULL,  -- admin, salesman, customer
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Coupons Table
CREATE TABLE coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(20) NOT NULL,  -- percentage, fixed
    discount_value DECIMAL(10, 2) NOT NULL,
    min_purchase DECIMAL(10, 2) DEFAULT 0,
    max_discount DECIMAL(10, 2),
    usage_limit INT,
    used_count INT DEFAULT 0,
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function to auto-generate product ID
CREATE OR REPLACE FUNCTION generate_product_id()
RETURNS TRIGGER AS $$
DECLARE
    date_prefix VARCHAR(6);
    next_serial INT;
BEGIN
    -- Format: YYMMDD
    date_prefix := TO_CHAR(CURRENT_DATE, 'YYMMDD');
    
    -- Get next serial for today
    SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 7 FOR 4) AS INT)), 0) + 1
    INTO next_serial
    FROM products
    WHERE id LIKE date_prefix || '%';
    
    -- Generate ID
    NEW.id := date_prefix || LPAD(next_serial::TEXT, 4, '0');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-ID generation
CREATE TRIGGER before_insert_product
    BEFORE INSERT ON products
    FOR EACH ROW
    WHEN (NEW.id IS NULL)
    EXECUTE FUNCTION generate_product_id();
```

---

## 🚀 PART 2: SPRING BOOT BACKEND

### **Step 1: Project Structure**

```
backend/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/polashtoli/
│       │       ├── PolashtolicApplication.java
│       │       ├── config/
│       │       │   ├── CorsConfig.java
│       │       │   └── SecurityConfig.java
│       │       ├── controller/
│       │       │   ├── ProductController.java
│       │       │   ├── OrderController.java
│       │       │   ├── CustomerController.java
│       │       │   └── AuthController.java
│       │       ├── service/
│       │       │   ├── ProductService.java
│       │       │   ├── OrderService.java
│       │       │   └── CustomerService.java
│       │       ├── repository/
│       │       │   ├── ProductRepository.java
│       │       │   ├── OrderRepository.java
│       │       │   └── CustomerRepository.java
│       │       └── model/
│       │           ├── Product.java
│       │           ├── Order.java
│       │           └── Customer.java
│       └── resources/
│           └── application.properties
└── pom.xml
```

### **Step 2: Dependencies (pom.xml)**

```xml
<dependencies>
    <!-- Spring Boot Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <!-- Spring Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    
    <!-- PostgreSQL Driver -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>
    
    <!-- Spring Security -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    
    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt</artifactId>
        <version>0.9.1</version>
    </dependency>
</dependencies>
```

### **Step 3: Configuration (application.properties)**

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/polashtoli_db
spring.datasource.username=polashtoli_user
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Server Configuration
server.port=8080
server.servlet.context-path=/api

# CORS Configuration
cors.allowed-origins=http://localhost:3000,http://localhost:8080
```

### **Step 4: Product Model (Product.java)**

```java
package com.polashtoli.model;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "products")
public class Product {
    
    @Id
    @Column(length = 10)
    private String id;  // Format: YYMMDDNNNN
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String category;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(precision = 5, scale = 2)
    private BigDecimal discount = BigDecimal.ZERO;
    
    @Column(nullable = false)
    private Integer stock;
    
    @Column(unique = true, nullable = false)
    private String sku;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @ElementCollection
    private List<String> images;
    
    @ElementCollection
    private List<String> tags;
    
    private Boolean featured = false;
    
    private String status = "active";
    
    @Column(name = "created_at")
    private LocalDate createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Getters and Setters
    // ...
}
```

### **Step 5: Product Repository (ProductRepository.java)**

```java
package com.polashtoli.repository;

import com.polashtoli.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {
    
    // Find by category
    List<Product> findByCategory(String category);
    
    // Find by stock status
    List<Product> findByStockGreaterThan(Integer minStock);
    List<Product> findByStockBetween(Integer min, Integer max);
    List<Product> findByStock(Integer stock);
    
    // Find by date
    List<Product> findByCreatedAt(LocalDate date);
    
    // Search
    List<Product> findByNameContainingIgnoreCase(String name);
    
    // Count by date
    Long countByCreatedAt(LocalDate date);
}
```

### **Step 6: Product Service (ProductService.java)**

```java
package com.polashtoli.service;

import com.polashtoli.model.Product;
import com.polashtoli.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    // Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    // Get product by ID
    public Product getProductById(String id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));
    }
    
    // Create product (ID auto-generated by database)
    public Product createProduct(Product product) {
        product.setCreatedAt(LocalDate.now());
        return productRepository.save(product);
    }
    
    // Update product
    public Product updateProduct(String id, Product product) {
        Product existing = getProductById(id);
        existing.setName(product.getName());
        existing.setCategory(product.getCategory());
        existing.setPrice(product.getPrice());
        existing.setDiscount(product.getDiscount());
        existing.setStock(product.getStock());
        existing.setDescription(product.getDescription());
        existing.setImages(product.getImages());
        existing.setTags(product.getTags());
        existing.setFeatured(product.getFeatured());
        return productRepository.save(existing);
    }
    
    // Delete product
    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }
    
    // Filter by category
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategory(category);
    }
    
    // Search products
    public List<Product> searchProducts(String query) {
        return productRepository.findByNameContainingIgnoreCase(query);
    }
}
```

### **Step 7: Product Controller (ProductController.java)**

```java
package com.polashtoli.controller;

import com.polashtoli.model.Product;
import com.polashtoli.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "*")
public class ProductController {
    
    @Autowired
    private ProductService productService;
    
    // GET /api/products
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
    
    // GET /api/products/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable String id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }
    
    // POST /api/products
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.createProduct(product));
    }
    
    // PUT /api/products/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
        @PathVariable String id,
        @RequestBody Product product
    ) {
        return ResponseEntity.ok(productService.updateProduct(id, product));
    }
    
    // DELETE /api/products/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
    
    // GET /api/products/category/{category}
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(productService.getProductsByCategory(category));
    }
    
    // GET /api/products/search?q=query
    @GetMapping("/search")
    public ResponseEntity<List<Product>> search(@RequestParam String q) {
        return ResponseEntity.ok(productService.searchProducts(q));
    }
}
```

---

## 🔌 PART 3: CONNECT FRONTEND TO BACKEND

### **Step 1: Create API Service (frontend/js/api.js)**

```javascript
// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';

// API Helper
const API = {
    // Products
    products: {
        getAll: async () => {
            const response = await fetch(`${API_BASE_URL}/products`);
            return response.json();
        },
        
        getById: async (id) => {
            const response = await fetch(`${API_BASE_URL}/products/${id}`);
            return response.json();
        },
        
        create: async (productData) => {
            const response = await fetch(`${API_BASE_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            return response.json();
        },
        
        update: async (id, productData) => {
            const response = await fetch(`${API_BASE_URL}/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            return response.json();
        },
        
        delete: async (id) => {
            await fetch(`${API_BASE_URL}/products/${id}`, {
                method: 'DELETE'
            });
        },
        
        search: async (query) => {
            const response = await fetch(`${API_BASE_URL}/products/search?q=${query}`);
            return response.json();
        }
    },
    
    // Orders
    orders: {
        getAll: async () => {
            const response = await fetch(`${API_BASE_URL}/orders`);
            return response.json();
        },
        // ... more methods
    },
    
    // Customers
    customers: {
        getAll: async () => {
            const response = await fetch(`${API_BASE_URL}/customers`);
            return response.json();
        },
        // ... more methods
    }
};

export default API;
```

### **Step 2: Update products.js to use API**

```javascript
// Replace demo data with API calls
let productsData = [];

// Load Products from API
async function loadProducts(filters = {}) {
    try {
        // Fetch from backend
        productsData = await API.products.getAll();
        
        // Apply filters
        let filteredProducts = [...productsData];
        
        if (filters.category) {
            filteredProducts = filteredProducts.filter(p => p.category === filters.category);
        }
        
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredProducts = filteredProducts.filter(p => 
                p.name.toLowerCase().includes(searchTerm) ||
                p.sku.toLowerCase().includes(searchTerm)
            );
        }
        
        renderProducts(filteredProducts);
    } catch (error) {
        console.error('Error loading products:', error);
        showNotification('Failed to load products', 'error');
    }
}

// Save Product using API
async function saveProduct() {
    const form = document.getElementById('productForm');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const productData = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        discount: parseFloat(document.getElementById('productDiscount').value) || 0,
        stock: parseInt(document.getElementById('productStock').value),
        sku: document.getElementById('productSKU').value,
        description: document.getElementById('productDescription').value,
        tags: document.getElementById('productTags').value.split(',').map(t => t.trim()),
        featured: document.getElementById('productFeatured').checked
    };
    
    try {
        if (currentEditingProductId) {
            // Update
            await API.products.update(currentEditingProductId, productData);
            showNotification('Product updated successfully!', 'success');
        } else {
            // Create
            const newProduct = await API.products.create(productData);
            showNotification(`Product added! ID: ${newProduct.id}`, 'success');
        }
        
        loadProducts();
        productModal.hide();
    } catch (error) {
        console.error('Error saving product:', error);
        showNotification('Failed to save product', 'error');
    }
}

// Delete Product using API
async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
        await API.products.delete(id);
        showNotification('Product deleted successfully!', 'success');
        loadProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
        showNotification('Failed to delete product', 'error');
    }
}
```

---

## 📝 PART 4: MIGRATION STEPS

### **Step 1: Start Backend**

```bash
cd backend
mvn spring-boot:run
```

Backend will start on: http://localhost:8080

### **Step 2: Test API**

```bash
# Test GET all products
curl http://localhost:8080/api/products

# Test CREATE product
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "category": "electronics",
    "price": 5000,
    "stock": 10,
    "sku": "TEST-001"
  }'
```

### **Step 3: Update Frontend**

```javascript
// In products.js, add this at the top:
const API_URL = 'http://localhost:8080/api';

// Update loadProducts to use API
async function loadProducts() {
    const response = await fetch(`${API_URL}/products`);
    productsData = await response.json();
    renderProducts(productsData);
}
```

### **Step 4: Enable CORS in Backend**

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:8080", "http://127.0.0.1:8080")
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowedHeaders("*");
            }
        };
    }
}
```

---

## ✅ SUMMARY

### **What You Need:**

1. **PostgreSQL Database** 
   - Install PostgreSQL
   - Create database & tables
   - Set up auto-ID generation

2. **Spring Boot Backend**
   - Create Spring Boot project
   - Add dependencies
   - Create models, repositories, services, controllers
   - Configure database connection

3. **Frontend Updates**
   - Create api.js service
   - Update products.js to use API
   - Replace demo data with API calls

### **After Setup:**

✅ Real database with persistent data
✅ RESTful API for all operations
✅ Auto-generated product IDs
✅ Proper authentication
✅ Scalable architecture

---

## 🚀 NEXT STEPS

1. **Create Spring Boot project**
2. **Set up PostgreSQL database**
3. **Connect frontend to backend**
4. **Test CRUD operations**
5. **Deploy to production**

**Want me to create the complete Spring Boot backend files?**
