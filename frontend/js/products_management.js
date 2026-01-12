// Products Management System

// Demo Products Data (Replace with API calls)
// ID Format: YYMMDDNNNN (Year Month Day Serial)
let productsData = [
    {
        id: '2601010001', // 2026-01-01, first product
        name: 'Samsung Galaxy S24',
        category: 'electronics',
        price: 85000,
        discount: 10,
        stock: 25,
        sku: 'ELEC-001',
        description: 'Latest Samsung flagship smartphone with advanced AI features',
        images: ['https://via.placeholder.com/300x300?text=Galaxy+S24'],
        tags: ['trending', 'new arrival', 'bestseller'],
        featured: true,
        status: 'active',
        createdAt: '2026-01-01'
    },
    {
        id: '2601020001', // 2026-01-02, first product
        name: 'Nike Air Max Shoes',
        category: 'fashion',
        price: 12000,
        discount: 15,
        stock: 45,
        sku: 'FASH-001',
        description: 'Comfortable and stylish running shoes',
        images: ['https://via.placeholder.com/300x300?text=Nike+Shoes'],
        tags: ['sports', 'trending'],
        featured: false,
        status: 'active',
        createdAt: '2026-01-02'
    },
    {
        id: '2601030001', // 2026-01-03, first product
        name: 'Leather Sofa Set',
        category: 'home',
        price: 55000,
        discount: 20,
        stock: 8,
        sku: 'HOME-001',
        description: 'Premium 5-seater leather sofa with warranty',
        images: ['https://via.placeholder.com/300x300?text=Sofa+Set'],
        tags: ['furniture', 'premium'],
        featured: true,
        status: 'active',
        createdAt: '2026-01-03'
    },
    {
        id: '2601040001', // 2026-01-04, first product
        name: 'MAC Lipstick Ruby Woo',
        category: 'beauty',
        price: 2500,
        discount: 0,
        stock: 120,
        sku: 'BEAUTY-001',
        description: 'Classic red lipstick, matte finish',
        images: ['https://via.placeholder.com/300x300?text=MAC+Lipstick'],
        tags: ['cosmetics', 'trending'],
        featured: false,
        status: 'active',
        createdAt: '2026-01-04'
    },
    {
        id: '2601050001', // 2026-01-05, first product
        name: 'Yoga Mat Premium',
        category: 'sports',
        price: 1800,
        discount: 25,
        stock: 3,
        sku: 'SPORT-001',
        description: 'Eco-friendly yoga mat with carry bag',
        images: ['https://via.placeholder.com/300x300?text=Yoga+Mat'],
        tags: ['fitness', 'sale'],
        featured: false,
        status: 'active',
        createdAt: '2026-01-05'
    },
    {
        id: '2601060001', // 2026-01-06, first product
        name: 'Apple MacBook Pro M3',
        category: 'electronics',
        price: 245000,
        discount: 5,
        stock: 0,
        sku: 'ELEC-002',
        description: 'Latest MacBook Pro with M3 chip',
        images: ['https://via.placeholder.com/300x300?text=MacBook+Pro'],
        tags: ['laptop', 'apple', 'premium'],
        featured: true,
        status: 'active',
        createdAt: '2026-01-06'
    }
];

// Generate Product ID based on date and serial number
// Format: YYMMDDNNNN (e.g., 2601060001 = 2026-01-06, product #1)
function generateProductId(date = new Date()) {
    const year = date.getFullYear().toString().slice(-2); // Last 2 digits (26)
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 01-12
    const day = String(date.getDate()).padStart(2, '0'); // 01-31
    const datePrefix = year + month + day; // e.g., "260106"
    
    // Find the highest serial number for this date
    const todayProducts = productsData.filter(p => p.id.startsWith(datePrefix));
    let maxSerial = 0;
    
    todayProducts.forEach(product => {
        const serial = parseInt(product.id.slice(-4)); // Last 4 digits
        if (serial > maxSerial) maxSerial = serial;
    });
    
    // Next serial number (0001, 0002, etc.)
    const nextSerial = String(maxSerial + 1).padStart(4, '0');
    
    return datePrefix + nextSerial;
}

// Product Modal
let productModal;
let currentEditingProductId = null;
let selectedImages = [];

// Initialize Products Page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize modal
    const modalElement = document.getElementById('productModal');
    if (modalElement) {
        productModal = new bootstrap.Modal(modalElement);
    }
    
    // Load products
    loadProducts();
    updateStats();
    
    // Sidebar toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('adminSidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchProducts');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchProducts(e.target.value);
        });
    }
});

// Load Products
function loadProducts(filters = {}) {
    let filteredProducts = [...productsData];
    
    // Apply filters
    if (filters.category) {
        filteredProducts = filteredProducts.filter(p => p.category === filters.category);
    }
    
    if (filters.stockStatus) {
        filteredProducts = filteredProducts.filter(p => {
            if (filters.stockStatus === 'in-stock') return p.stock > 10;
            if (filters.stockStatus === 'low-stock') return p.stock > 0 && p.stock <= 10;
            if (filters.stockStatus === 'out-of-stock') return p.stock === 0;
            return true;
        });
    }
    
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.category.toLowerCase().includes(searchTerm) ||
            p.sku.toLowerCase().includes(searchTerm)
        );
    }
    
    // Render products
    renderProducts(filteredProducts);
}

// Render Products Table
function renderProducts(products) {
    const tbody = document.getElementById('productsTableBody');
    
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center py-5">
                    <i class="bi bi-inbox" style="font-size: 3rem; color: #cbd5e0;"></i>
                    <p class="mt-3 text-muted">No products found</p>
                </td>
            </tr>
        `;
        return;
    }
    
    products.forEach(product => {
        const finalPrice = product.price - (product.price * product.discount / 100);
        const stockStatus = getStockStatus(product.stock);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <input type="checkbox" class="product-checkbox" value="${product.id}">
            </td>
            <td>
                <img src="${product.images[0]}" alt="${product.name}" 
                     style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
            </td>
            <td>
                <strong>${product.name}</strong>
                <br><small class="text-muted">ID: ${product.id}</small>
                <br><small class="text-muted">SKU: ${product.sku}</small>
            </td>
            <td><span class="admin-badge info">${capitalizeFirst(product.category)}</span></td>
            <td>
                <strong>৳${finalPrice.toLocaleString()}</strong>
                ${product.discount > 0 ? `<br><small class="text-muted"><del>৳${product.price.toLocaleString()}</del></small>` : ''}
            </td>
            <td>
                <span class="admin-badge ${stockStatus.class}">${product.stock}</span>
            </td>
            <td>
                ${product.discount > 0 ? `<span class="admin-badge warning">${product.discount}% OFF</span>` : '-'}
            </td>
            <td>
                <span class="admin-badge ${product.stock > 0 ? 'success' : 'danger'}">
                    ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
            </td>
            <td>
                <button class="admin-btn-icon" onclick="editProduct('${product.id}')" title="Edit">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="admin-btn-icon" onclick="deleteProduct('${product.id}')" title="Delete">
                    <i class="bi bi-trash"></i>
                </button>
                <button class="admin-btn-icon" onclick="duplicateProduct('${product.id}')" title="Duplicate">
                    <i class="bi bi-files"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Get Stock Status
function getStockStatus(stock) {
    if (stock === 0) return { class: 'danger', text: 'Out of Stock' };
    if (stock <= 10) return { class: 'warning', text: 'Low Stock' };
    return { class: 'success', text: 'In Stock' };
}

// Update Stats
function updateStats() {
    const total = document.getElementById('totalProducts');
    const inStock = document.getElementById('inStockProducts');
    const lowStock = document.getElementById('lowStockProducts');
    const outOfStock = document.getElementById('outOfStockProducts');
    const count = document.getElementById('productsCount');
    
    if (total) total.textContent = productsData.length;
    if (inStock) inStock.textContent = productsData.filter(p => p.stock > 10).length;
    if (lowStock) lowStock.textContent = productsData.filter(p => p.stock > 0 && p.stock <= 10).length;
    if (outOfStock) outOfStock.textContent = productsData.filter(p => p.stock === 0).length;
    if (count) count.textContent = productsData.length;
}

// Open Add Product Modal
function openAddProductModal() {
    currentEditingProductId = null;
    const nextId = generateProductId();
    document.getElementById('productModalTitle').textContent = `Add New Product (ID: ${nextId})`;
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('productFinalPrice').value = '';
    selectedImages = [];
    if (productModal) productModal.show();
}

// Edit Product
function editProduct(id) {
    const product = productsData.find(p => p.id === id);
    if (!product) return;
    
    currentEditingProductId = id;
    document.getElementById('productModalTitle').textContent = `Edit Product (ID: ${product.id})`;
    
    // Fill form
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productDiscount').value = product.discount;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productSKU').value = product.sku;
    document.getElementById('productDescription').value = product.description;
    document.getElementById('productTags').value = product.tags.join(', ');
    document.getElementById('productFeatured').checked = product.featured;
    
    calculateFinalPrice();
    
    // Show existing images
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    product.images.forEach(img => {
        const div = document.createElement('div');
        div.style.cssText = 'position: relative; width: 100px; height: 100px;';
        div.innerHTML = `
            <img src="${img}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
        `;
        preview.appendChild(div);
    });
    
    if (productModal) productModal.show();
}

// Save Product
function saveProduct() {
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
        sku: document.getElementById('productSKU').value || `PROD-${Date.now()}`,
        description: document.getElementById('productDescription').value,
        tags: document.getElementById('productTags').value.split(',').map(t => t.trim()).filter(t => t),
        featured: document.getElementById('productFeatured').checked,
        status: 'active'
    };
    
    if (currentEditingProductId) {
        // Update existing product
        const index = productsData.findIndex(p => p.id === currentEditingProductId);
        if (index !== -1) {
            productsData[index] = {
                ...productsData[index],
                ...productData,
                images: selectedImages.length > 0 ? selectedImages : productsData[index].images
            };
            showNotification('Product updated successfully!', 'success');
        }
    } else {
        // Add new product with auto-generated ID
        const newProductId = generateProductId(); // Auto-generate ID based on today's date
        const today = new Date().toISOString().split('T')[0];
        
        const newProduct = {
            id: newProductId,
            ...productData,
            images: selectedImages.length > 0 ? selectedImages : ['https://via.placeholder.com/300x300?text=No+Image'],
            createdAt: today
        };
        productsData.push(newProduct);
        showNotification(`Product added successfully! ID: ${newProductId}`, 'success');
    }
    
    // Reload products
    loadProducts();
    updateStats();
    if (productModal) productModal.hide();
}

// Delete Product
function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    const index = productsData.findIndex(p => p.id === id);
    if (index !== -1) {
        productsData.splice(index, 1);
        loadProducts();
        updateStats();
        showNotification('Product deleted successfully!', 'success');
    }
}

// Duplicate Product
function duplicateProduct(id) {
    const product = productsData.find(p => p.id === id);
    if (!product) return;
    
    const newProductId = generateProductId();
    const today = new Date().toISOString().split('T')[0];
    
    const newProduct = {
        ...product,
        id: newProductId,
        name: product.name + ' (Copy)',
        sku: `COPY-${Date.now()}`,
        createdAt: today
    };
    
    productsData.push(newProduct);
    loadProducts();
    updateStats();
    showNotification(`Product duplicated! New ID: ${newProductId}`, 'success');
}

// Calculate Final Price
function calculateFinalPrice() {
    const price = parseFloat(document.getElementById('productPrice').value) || 0;
    const discount = parseFloat(document.getElementById('productDiscount').value) || 0;
    const finalPrice = price - (price * discount / 100);
    document.getElementById('productFinalPrice').value = '৳' + finalPrice.toFixed(2);
}

// Preview Images
function previewImages(event) {
    const files = event.target.files;
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    selectedImages = [];
    
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                selectedImages.push(e.target.result);
                
                const div = document.createElement('div');
                div.style.cssText = 'position: relative; width: 100px; height: 100px;';
                div.innerHTML = `
                    <img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
                    <button type="button" onclick="removeImage(this)" 
                            style="position: absolute; top: 5px; right: 5px; background: red; color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer;">
                        ×
                    </button>
                `;
                preview.appendChild(div);
            };
            
            reader.readAsDataURL(file);
        }
    });
}

// Remove Image
function removeImage(button) {
    const div = button.parentElement;
    const img = div.querySelector('img');
    const index = selectedImages.indexOf(img.src);
    if (index > -1) {
        selectedImages.splice(index, 1);
    }
    div.remove();
}

// Search Products
function searchProducts(query) {
    loadProducts({ search: query });
}

// Filter Products
function filterProducts() {
    const category = document.getElementById('categoryFilter').value;
    const stockStatus = document.getElementById('stockFilter').value;
    
    loadProducts({
        category: category,
        stockStatus: stockStatus
    });
}

// Refresh Products
function refreshProducts() {
    loadProducts();
    showNotification('Products refreshed!', 'success');
}

// Toggle Select All
function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.product-checkbox');
    checkboxes.forEach(cb => cb.checked = selectAll.checked);
}

// Import Products
function importProducts() {
    alert('Import feature: Upload CSV file with products\nFormat: Name,Category,Price,Discount,Stock,SKU,Description');
    // TODO: Implement CSV import functionality
}

// Export Products
function exportProducts() {
    const csv = convertToCSV(productsData);
    downloadCSV(csv, 'products-export.csv');
    showNotification('Products exported successfully!', 'success');
}

// Convert to CSV
function convertToCSV(data) {
    const headers = ['ID', 'Name', 'Category', 'Price', 'Discount', 'Stock', 'SKU', 'Status'];
    const rows = data.map(p => [
        p.id,
        `"${p.name}"`,
        p.category,
        p.price,
        p.discount,
        p.stock,
        p.sku,
        p.status
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

// Download CSV
function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Show Notification
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : 'danger'} position-fixed`;
    notification.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 300px; animation: slideIn 0.3s ease;';
    notification.innerHTML = `
        <i class="bi bi-${type === 'success' ? 'check-circle' : 'x-circle'}"></i>
        ${message}
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Capitalize First Letter
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Export for global use
window.Products = {
    loadProducts,
    openAddProductModal,
    editProduct,
    deleteProduct,
    saveProduct,
    filterProducts,
    searchProducts,
    refreshProducts,
    duplicateProduct
};
