
const API_URL = 'http://localhost:8080/api';

const API = {
    products: {
        getAll: async () => {
            const response = await fetch(`${API_URL}/products`);
return response.json();
},

getById: async (id) => {
    const response = await fetch(`${API_URL}/products/${id}`);
    return response.json();
},

    create: async (product) => {
    const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    return response.json();
},

    update: async (id, product) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    return response.json();
},

    delete: async (id) => {
    await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE'
    });
},

    search: async (query) => {
    const response = await fetch(`${API_URL}/products/search?q=${query}`);
    return response.json();
},

    getByCategory: async (category) => {
    const response = await fetch(`${API_URL}/products/category/${category}`);
    return response.json();
}
},

// Similar structure for orders, customers, coupons
orders: {
    getAll: async () => {
        const response = await fetch(`${API_URL}/orders`);
        return response.json();
    },
        create: async (order) => {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order)
        });
        return response.json();
    }
    // ... more methods
},

customers: {
    getAll: async () => {
        const response = await fetch(`${API_URL}/customers`);
        return response.json();
    }
    // ... more methods
},

coupons: {
    getAll: async () => {
        const response = await fetch(`${API_URL}/coupons`);
        return response.json();
    }
    // ... more methods
}
};