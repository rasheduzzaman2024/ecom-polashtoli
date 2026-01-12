// Products page specific JavaScript (Storefront with API Integration)

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
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = search;
    }
    
    loadProducts();
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                currentFilters.search = this.value;
                currentPage = 1;
                loadProducts();
            }
        });
    }
});

// Load products from API
async function loadProducts() {
    try {
        let products;
        
        // Check if API is available
        if (typeof API !== 'undefined') {
            // Use API service
            if (currentFilters.search) {
                products = await API.products.search(currentFilters.search);
            } else if (currentFilters.categories.length > 0) {
                const category = currentFilters.categories[0].replace('cat-', '');
                products = await API.products.getByCategory(category);
            } else {
                products = await API.products.getAll();
            }
            
            // Transform backend data to frontend format
            if (typeof transformProducts === 'function') {
                products = transformProducts(products);
            } else {
                // Manual transformation if transformProducts not available
                products = products.map(p => {
                    const finalPrice = p.price - (p.price * (p.discount || 0) / 100);
                    return {
                        id: p.id,
                        name: p.name,
                        category: p.category,
                        price: finalPrice.toFixed(2),
                        originalPrice: p.discount > 0 ? p.price.toFixed(2) : null,
                        discount: p.discount || 0,
                        rating: 4.5, // TODO: Implement ratings
                        reviewCount: Math.floor(Math.random() * 200) + 50, // TODO: Implement reviews
                        image: p.images && p.images.length > 0 ? p.images[0] : null,
                        images: p.images || [],
                        stock: p.stock,
                        sku: p.sku,
                        description: p.description,
                        tags: p.tags || [],
                        featured: p.featured,
                        status: p.status
                    };
                });
            }
        } else {
            // Fallback: Try direct fetch
            const response = await fetch(buildProductsUrl());
            const data = await response.json();
            products = data.content || data;
        }
        
        // Apply client-side filters
        let filteredProducts = applyClientFilters(products);
        
        // Apply sorting
        filteredProducts = applySorting(filteredProducts);
        
        // Calculate pagination
        const totalProducts = filteredProducts.length;
        const productsPerPage = 12;
        const totalPages = Math.ceil(totalProducts / productsPerPage);
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
        
        displayProducts(paginatedProducts);
        updateProductsCount(totalProducts);
        
        if (totalPages > 1) {
            displayPagination(totalPages, currentPage - 1);
        } else {
            const pagination = document.getElementById('pagination');
            if (pagination) pagination.innerHTML = '';
        }
    } catch (error) {
        console.error('Error loading products from API:', error);
        console.warn('Falling back to dummy products...');
        displayDummyProducts();
    }
}

// Apply client-side filters (price, ratings, brands)
function applyClientFilters(products) {
    let filtered = [...products];
    
    // Price range filter
    if (currentFilters.priceRange) {
        const parts = currentFilters.priceRange.split('-');
        const min = parseInt(parts[0]);
        const max = parts[1] ? parseInt(parts[1]) : Infinity;
        
        filtered = filtered.filter(p => {
            const price = parseFloat(p.price);
            return price >= min && price <= max;
        });
    }
    
    // Rating filter
    if (currentFilters.ratings.length > 0) {
        const minRating = Math.min(...currentFilters.ratings.map(Number));
        filtered = filtered.filter(p => (p.rating || 0) >= minRating);
    }
    
    // Brands filter (using tags)
    if (currentFilters.brands.length > 0) {
        filtered = filtered.filter(p => {
            return p.tags && p.tags.some(tag => 
                currentFilters.brands.includes(tag.toLowerCase())
            );
        });
    }
    
    return filtered;
}

// Apply sorting
function applySorting(products) {
    let sorted = [...products];
    
    switch (currentFilters.sort) {
        case 'price-low':
            sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            break;
        case 'price-high':
            sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            break;
        case 'newest':
            // Products should already be sorted by date from backend
            break;
        case 'rating':
            sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
        case 'featured':
        default:
            // Featured products first, then by rating
            sorted.sort((a, b) => {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                return (b.rating || 0) - (a.rating || 0);
            });
            break;
    }
    
    return sorted;
}

// Build API URL with filters (fallback for direct fetch)
function buildProductsUrl() {
    const API_URL = typeof API_BASE_URL !== 'undefined' ? API_BASE_URL : 'http://localhost:8080/api';
    let url = `${API_URL}/products?page=${currentPage - 1}&size=12`;
    
    if (currentFilters.search) {
        url = `${API_URL}/products/search?q=${encodeURIComponent(currentFilters.search)}&page=${currentPage - 1}&size=12`;
    } else if (currentFilters.categories.length > 0) {
        const category = currentFilters.categories[0].replace('cat-', '');
        url = `${API_URL}/products/category/${category}?page=${currentPage - 1}&size=12`;
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
    
    if (!container) {
        console.error('Products grid container not found');
        return;
    }
    
    if (products.length === 0) {
        container.innerHTML = '<div class="col-12"><div class="alert alert-info">No products found. Try adjusting your filters.</div></div>';
        return;
    }
    
    container.innerHTML = products.map(product => {
        const finalPrice = parseFloat(product.price);
        const originalPrice = product.originalPrice ? parseFloat(product.originalPrice) : null;
        const hasDiscount = product.discount > 0;
        
        return `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="product-card">
                <div class="product-image">
                    ${hasDiscount ? `<span class="product-badge">-${product.discount}%</span>` : ''}
                    <img src="${product.image || getProductImage(product)}" 
                         alt="${product.name}"
                         onerror="this.src='https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}'">
                    <div class="product-actions">
                        <button class="product-action-btn" onclick="addToWishlist('${product.id}')" title="Add to Wishlist">
                            <i class="bi bi-heart"></i>
                        </button>
                        <button class="product-action-btn" onclick="quickView('${product.id}')" title="Quick View">
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
                        <span class="stars">${generateStars(product.rating || 4.5)}</span>
                        <span class="rating-count">(${product.reviewCount || 0})</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">৳${finalPrice.toLocaleString()}</span>
                        ${originalPrice ? `<span class="original-price">৳${originalPrice.toLocaleString()}</span>` : ''}
                        ${hasDiscount ? `<span class="discount-badge">${product.discount}% OFF</span>` : ''}
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart('${product.id}')">
                        <i class="bi bi-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

// Display dummy products for demo/fallback
function displayDummyProducts() {
    const dummyProducts = [
        {
            id: '2601010001', name: 'Wireless Headphones', category: 'electronics',
            price: '2999', originalPrice: '3999', discount: 25, rating: 4.5, reviewCount: 128,
            image: 'https://via.placeholder.com/300x300?text=Headphones'
        },
        {
            id: '2601020001', name: 'Smart Watch', category: 'electronics',
            price: '4999', originalPrice: '6999', discount: 30, rating: 4.8, reviewCount: 256,
            image: 'https://via.placeholder.com/300x300?text=Smart+Watch'
        },
        {
            id: '2601030001', name: 'Laptop Backpack', category: 'fashion',
            price: '1499', rating: 4.3, reviewCount: 89,
            image: 'https://via.placeholder.com/300x300?text=Backpack'
        },
        {
            id: '2601040001', name: 'LED Desk Lamp', category: 'home',
            price: '899', originalPrice: '1299', discount: 31, rating: 4.6, reviewCount: 145,
            image: 'https://via.placeholder.com/300x300?text=Desk+Lamp'
        },
        {
            id: '2601050001', name: 'Running Shoes', category: 'fashion',
            price: '3499', rating: 4.7, reviewCount: 203,
            image: 'https://via.placeholder.com/300x300?text=Running+Shoes'
        },
        {
            id: '2601060001', name: 'Bluetooth Speaker', category: 'electronics',
            price: '1999', originalPrice: '2999', discount: 33, rating: 4.4, reviewCount: 167,
            image: 'https://via.placeholder.com/300x300?text=Speaker'
        },
        {
            id: '2601070001', name: 'Coffee Maker', category: 'home',
            price: '5999', rating: 4.5, reviewCount: 92,
            image: 'https://via.placeholder.com/300x300?text=Coffee+Maker'
        },
        {
            id: '2601070002', name: 'Yoga Mat', category: 'sports',
            price: '799', originalPrice: '1199', discount: 33, rating: 4.2, reviewCount: 78,
            image: 'https://via.placeholder.com/300x300?text=Yoga+Mat'
        },
        {
            id: '2601070003', name: 'Gaming Mouse', category: 'electronics',
            price: '1599', rating: 4.6, reviewCount: 156,
            image: 'https://via.placeholder.com/300x300?text=Gaming+Mouse'
        },
        {
            id: '2601070004', name: 'Water Bottle', category: 'sports',
            price: '399', originalPrice: '599', discount: 33, rating: 4.3, reviewCount: 234,
            image: 'https://via.placeholder.com/300x300?text=Water+Bottle'
        },
        {
            id: '2601070005', name: 'Sunglasses', category: 'fashion',
            price: '1299', rating: 4.4, reviewCount: 167,
            image: 'https://via.placeholder.com/300x300?text=Sunglasses'
        },
        {
            id: '2601070006', name: 'USB Charger', category: 'electronics',
            price: '599', originalPrice: '899', discount: 33, rating: 4.1, reviewCount: 98,
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
    if (product.image) {
        return product.image;
    }
    return `https://via.placeholder.com/300x300?text=${encodeURIComponent(product.name)}`;
}

// Update products count
function updateProductsCount(count) {
    const countElement = document.getElementById('productsCount');
    if (countElement) {
        countElement.textContent = `Showing ${count} products`;
    }
}

// Display pagination
function displayPagination(totalPages, currentPageIndex) {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    let html = '';
    
    // Previous button
    html += `<li class="page-item ${currentPageIndex === 0 ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="changePage(${currentPageIndex}); return false;">Previous</a>
    </li>`;
    
    // Page numbers (show max 5 pages)
    const maxPages = 5;
    let startPage = Math.max(0, currentPageIndex - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages);
    
    if (endPage - startPage < maxPages) {
        startPage = Math.max(0, endPage - maxPages);
    }
    
    for (let i = startPage; i < endPage; i++) {
        html += `<li class="page-item ${i === currentPageIndex ? 'active' : ''}">
            <a class="page-link" href="#" onclick="changePage(${i + 1}); return false;">${i + 1}</a>
        </li>`;
    }
    
    // Next button
    html += `<li class="page-item ${currentPageIndex === totalPages - 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="changePage(${currentPageIndex + 2}); return false;">Next</a>
    </li>`;
    
    pagination.innerHTML = html;
}

// Change page
function changePage(page) {
    currentPage = page;
    loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Sort products
function sortProducts() {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        currentFilters.sort = sortSelect.value;
        currentPage = 1;
        loadProducts();
    }
}

// Apply filters
function applyFilters() {
    // Get selected categories
    currentFilters.categories = Array.from(document.querySelectorAll('input[type="checkbox"][id^="cat"]:checked, input[type="checkbox"][value^="cat"]:checked'))
        .map(cb => cb.value || cb.id);
    
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
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    
    // Reset sort select
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.value = 'featured';
    
    currentPage = 1;
    loadProducts();
}

// Quick view product
function quickView(productId) {
    console.log('Quick view for product:', productId);
    // For now, redirect to product details
    window.location.href = `product-details.html?id=${productId}`;
}

// Generate star ratings HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let html = '';
    for (let i = 0; i < fullStars; i++) {
        html += '<i class="bi bi-star-fill"></i>';
    }
    if (hasHalfStar) {
        html += '<i class="bi bi-star-half"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        html += '<i class="bi bi-star"></i>';
    }
    
    return html;
}
