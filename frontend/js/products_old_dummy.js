// Products page specific JavaScript

let currentPage = 1;
let currentFilters = {
    categories: [],
    priceRange: null,
    ratings: [],
    brands: [],
    search: '',
    sort: 'featured'
};

// Load products on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check for URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const search = urlParams.get('search');
    
    if (category) {
        currentFilters.categories = [category];
    }
    if (search) {
        currentFilters.search = search;
        document.getElementById('searchInput').value = search;
    }
    
    loadProducts();
    
    // Search functionality
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            currentFilters.search = this.value;
            currentPage = 1;
            loadProducts();
        }
    });
});

// Load products from API
async function loadProducts() {
    try {
        const response = await fetch(buildProductsUrl());
        const data = await response.json();
        
        displayProducts(data.content || data);
        updateProductsCount(data.totalElements || data.length);
        
        if (data.totalPages) {
            displayPagination(data.totalPages, data.number);
        }
    } catch (error) {
        console.error('Error loading products:', error);
        displayDummyProducts();
    }
}

// Build API URL with filters
function buildProductsUrl() {
    let url = `${API_BASE_URL}/products?page=${currentPage - 1}&size=12`;
    
    if (currentFilters.search) {
        url = `${API_BASE_URL}/products/search?q=${encodeURIComponent(currentFilters.search)}&page=${currentPage - 1}&size=12`;
    } else if (currentFilters.categories.length > 0) {
        url = `${API_BASE_URL}/products/category/${currentFilters.categories[0]}?page=${currentPage - 1}&size=12`;
    }
    
    if (currentFilters.sort === 'price-low') {
        url += '&sort=price,asc';
    } else if (currentFilters.sort === 'price-high') {
        url += '&sort=price,desc';
    } else if (currentFilters.sort === 'newest') {
        url += '&sort=createdAt,desc';
    } else if (currentFilters.sort === 'rating') {
        url += '&sort=rating,desc';
    }
    
    return url;
}

// Display products in grid
function displayProducts(products) {
    const container = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        container.innerHTML = '<div class="col-12"><div class="alert alert-info">No products found. Try adjusting your filters.</div></div>';
        return;
    }
    
    container.innerHTML = products.map(product => `
        <div class="col-lg-4 col-md-6">
            <div class="product-card">
                <div class="product-image">
                    ${product.discount ? `<span class="product-badge">-${product.discount}%</span>` : ''}
                    <img src="${product.image || getProductImage(product)}" alt="${product.name}">
                    <div class="product-actions">
                        <button class="product-action-btn" onclick="addToWishlist(${product.id})" title="Add to Wishlist">
                            <i class="bi bi-heart"></i>
                        </button>
                        <button class="product-action-btn" onclick="quickView(${product.id})" title="Quick View">
                            <i class="bi bi-eye"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category || 'General'}</span>
                    <h5 class="product-title">
                        <a href="product-details.html?id=${product.id}">${product.name}</a>
                    </h5>
                    <div class="product-rating">
                        <span class="stars">${generateStars(product.rating || 4)}</span>
                        <span class="rating-count">(${product.reviewCount || 0})</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">৳${product.price}</span>
                        ${product.originalPrice ? `<span class="original-price">৳${product.originalPrice}</span>` : ''}
                        ${product.discount ? `<span class="discount-badge">${product.discount}% OFF</span>` : ''}
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="bi bi-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Display dummy products for demo
function displayDummyProducts() {
    const dummyProducts = [
        {
            id: 1, name: 'Wireless Headphones', category: 'Electronics',
            price: 2999, originalPrice: 3999, discount: 25, rating: 4.5, reviewCount: 128,
            image: 'https://via.placeholder.com/300x300?text=Headphones'
        },
        {
            id: 2, name: 'Smart Watch', category: 'Electronics',
            price: 4999, originalPrice: 6999, discount: 30, rating: 4.8, reviewCount: 256,
            image: 'https://via.placeholder.com/300x300?text=Smart+Watch'
        },
        {
            id: 3, name: 'Laptop Backpack', category: 'Fashion',
            price: 1499, rating: 4.3, reviewCount: 89,
            image: 'https://via.placeholder.com/300x300?text=Backpack'
        },
        {
            id: 4, name: 'LED Desk Lamp', category: 'Home',
            price: 899, originalPrice: 1299, discount: 31, rating: 4.6, reviewCount: 145,
            image: 'https://via.placeholder.com/300x300?text=Desk+Lamp'
        },
        {
            id: 5, name: 'Running Shoes', category: 'Fashion',
            price: 3499, rating: 4.7, reviewCount: 203,
            image: 'https://via.placeholder.com/300x300?text=Running+Shoes'
        },
        {
            id: 6, name: 'Bluetooth Speaker', category: 'Electronics',
            price: 1999, originalPrice: 2999, discount: 33, rating: 4.4, reviewCount: 167,
            image: 'https://via.placeholder.com/300x300?text=Speaker'
        },
        {
            id: 7, name: 'Coffee Maker', category: 'Home',
            price: 5999, rating: 4.5, reviewCount: 92,
            image: 'https://via.placeholder.com/300x300?text=Coffee+Maker'
        },
        {
            id: 8, name: 'Yoga Mat', category: 'Sports',
            price: 799, originalPrice: 1199, discount: 33, rating: 4.2, reviewCount: 78,
            image: 'https://via.placeholder.com/300x300?text=Yoga+Mat'
        },
        {
            id: 9, name: 'Gaming Mouse', category: 'Electronics',
            price: 1599, rating: 4.6, reviewCount: 156,
            image: 'https://via.placeholder.com/300x300?text=Gaming+Mouse'
        },
        {
            id: 10, name: 'Water Bottle', category: 'Sports',
            price: 399, originalPrice: 599, discount: 33, rating: 4.3, reviewCount: 234,
            image: 'https://via.placeholder.com/300x300?text=Water+Bottle'
        },
        {
            id: 11, name: 'Sunglasses', category: 'Fashion',
            price: 1299, rating: 4.4, reviewCount: 167,
            image: 'https://via.placeholder.com/300x300?text=Sunglasses'
        },
        {
            id: 12, name: 'USB Charger', category: 'Electronics',
            price: 599, originalPrice: 899, discount: 33, rating: 4.1, reviewCount: 98,
            image: 'https://via.placeholder.com/300x300?text=USB+Charger'
        }
    ];
    
    displayProducts(dummyProducts);
    updateProductsCount(dummyProducts.length);
}

// Get product image placeholder
function getProductImage(product) {
    if (product.images && product.images.length > 0) {
        return product.images[0];
    }
    return `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}`;
}

// Update products count
function updateProductsCount(count) {
    document.getElementById('productsCount').textContent = `Showing ${count} products`;
}

// Display pagination
function displayPagination(totalPages, currentPageNum) {
    const pagination = document.getElementById('pagination');
    let html = '';
    
    // Previous button
    html += `<li class="page-item ${currentPageNum === 0 ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="changePage(${currentPageNum}); return false;">Previous</a>
    </li>`;
    
    // Page numbers
    for (let i = 0; i < totalPages; i++) {
        html += `<li class="page-item ${i === currentPageNum ? 'active' : ''}">
            <a class="page-link" href="#" onclick="changePage(${i + 1}); return false;">${i + 1}</a>
        </li>`;
    }
    
    // Next button
    html += `<li class="page-item ${currentPageNum === totalPages - 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="changePage(${currentPageNum + 2}); return false;">Next</a>
    </li>`;
    
    pagination.innerHTML = html;
}

// Change page
function changePage(page) {
    currentPage = page;
    loadProducts();
    window.scrollTo(0, 0);
}

// Sort products
function sortProducts() {
    const sortSelect = document.getElementById('sortSelect');
    currentFilters.sort = sortSelect.value;
    currentPage = 1;
    loadProducts();
}

// Apply filters
function applyFilters() {
    // Get selected categories
    currentFilters.categories = Array.from(document.querySelectorAll('input[type="checkbox"][value^="cat"]:checked'))
        .map(cb => cb.value);
    
    // Get selected price range
    const priceRadio = document.querySelector('input[name="priceRange"]:checked');
    currentFilters.priceRange = priceRadio ? priceRadio.value : null;
    
    // Get selected ratings
    currentFilters.ratings = Array.from(document.querySelectorAll('input[id^="rating"]:checked'))
        .map(cb => cb.value);
    
    // Get selected brands
    currentFilters.brands = Array.from(document.querySelectorAll('input[id^="brand"]:checked'))
        .map(cb => cb.value);
    
    currentPage = 1;
    loadProducts();
}

// Clear all filters
function clearFilters() {
    // Uncheck all checkboxes and radio buttons
    document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('.filter-group input[type="radio"]').forEach(rb => rb.checked = false);
    
    // Reset filters
    currentFilters = {
        categories: [],
        priceRange: null,
        ratings: [],
        brands: [],
        search: '',
        sort: 'featured'
    };
    
    // Clear search input
    document.getElementById('searchInput').value = '';
    
    currentPage = 1;
    loadProducts();
}

// Quick view product (opens modal - to be implemented)
function quickView(productId) {
    // TODO: Implement quick view modal
    console.log('Quick view for product:', productId);
    window.location.href = `product-details.html?id=${productId}`;
}
