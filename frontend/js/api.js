// API Service for Polashtoli Store Frontend
// Connects to Spring Boot Backend

const API_URL = 'http://localhost:8080/api';

// API Helper Object
const API = {
    // ============================================
    // PRODUCTS API
    // ============================================
    products: {
        // Get all products
        getAll: async () => {
            try {
                const response = await fetch(`${API_URL}/products`);
                if (!response.ok) throw new Error('Failed to fetch products');
                return await response.json();
            } catch (error) {
                console.error('API Error (getAll):', error);
                throw error;
            }
        },
        
        // Get product by ID
        getById: async (id) => {
            try {
                const response = await fetch(`${API_URL}/products/${id}`);
                if (!response.ok) throw new Error('Product not found');
                return await response.json();
            } catch (error) {
                console.error('API Error (getById):', error);
                throw error;
            }
        },
        
        // Create product (admin only)
        create: async (productData) => {
            try {
                const response = await fetch(`${API_URL}/products`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
                if (!response.ok) throw new Error('Failed to create product');
                return await response.json();
            } catch (error) {
                console.error('API Error (create):', error);
                throw error;
            }
        },
        
        // Update product (admin only)
        update: async (id, productData) => {
            try {
                const response = await fetch(`${API_URL}/products/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
                if (!response.ok) throw new Error('Failed to update product');
                return await response.json();
            } catch (error) {
                console.error('API Error (update):', error);
                throw error;
            }
        },
        
        // Delete product (admin only)
        delete: async (id) => {
            try {
                const response = await fetch(`${API_URL}/products/${id}`, {
                    method: 'DELETE'
                });
                if (!response.ok) throw new Error('Failed to delete product');
                return true;
            } catch (error) {
                console.error('API Error (delete):', error);
                throw error;
            }
        },
        
        // Search products
        search: async (query) => {
            try {
                const response = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}`);
                if (!response.ok) throw new Error('Search failed');
                return await response.json();
            } catch (error) {
                console.error('API Error (search):', error);
                throw error;
            }
        },
        
        // Get products by category
        getByCategory: async (category) => {
            try {
                const response = await fetch(`${API_URL}/products/category/${category}`);
                if (!response.ok) throw new Error('Failed to fetch category products');
                return await response.json();
            } catch (error) {
                console.error('API Error (getByCategory):', error);
                throw error;
            }
        },
        
        // Get featured products
        getFeatured: async () => {
            try {
                const response = await fetch(`${API_URL}/products/featured`);
                if (!response.ok) throw new Error('Failed to fetch featured products');
                return await response.json();
            } catch (error) {
                console.error('API Error (getFeatured):', error);
                throw error;
            }
        },
        
        // Get product statistics
        getStats: async () => {
            try {
                const response = await fetch(`${API_URL}/products/stats`);
                if (!response.ok) throw new Error('Failed to fetch stats');
                return await response.json();
            } catch (error) {
                console.error('API Error (getStats):', error);
                throw error;
            }
        }
    },
    
    // ============================================
    // ORDERS API
    // ============================================
    orders: {
        getAll: async () => {
            const response = await fetch(`${API_URL}/orders`);
            return await response.json();
        },
        
        getById: async (id) => {
            const response = await fetch(`${API_URL}/orders/${id}`);
            return await response.json();
        },
        
        create: async (orderData) => {
            const response = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
            return await response.json();
        },
        
        getByCustomer: async (customerId) => {
            const response = await fetch(`${API_URL}/orders/customer/${customerId}`);
            return await response.json();
        }
    },
    
    // ============================================
    // CUSTOMERS API
    // ============================================
    customers: {
        getAll: async () => {
            const response = await fetch(`${API_URL}/customers`);
            return await response.json();
        },
        
        getByEmail: async (email) => {
            const response = await fetch(`${API_URL}/customers/email/${email}`);
            return await response.json();
        },
        
        create: async (customerData) => {
            const response = await fetch(`${API_URL}/customers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customerData)
            });
            return await response.json();
        }
    },
    
    // ============================================
    // COUPONS API
    // ============================================
    coupons: {
        getActive: async () => {
            const response = await fetch(`${API_URL}/coupons/active`);
            return await response.json();
        },
        
        validate: async (code, amount) => {
            const response = await fetch(`${API_URL}/coupons/validate?code=${code}&amount=${amount}`, {
                method: 'POST'
            });
            return await response.json();
        }
    }
};
