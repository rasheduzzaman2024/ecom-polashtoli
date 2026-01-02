// Product Details Page JavaScript

let currentProduct = null;
let productId = null;

document.addEventListener('DOMContentLoaded', function() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    productId = urlParams.get('id');
    
    if (productId) {
        loadProductDetails(productId);
        loadRelatedProducts(productId);
    } else {
        showNotification('Product not found', 'danger');
        window.location.href = 'products.html';
    }
    
    // Review form submission
    document.getElementById('reviewForm').addEventListener('submit', submitReview);
});

// Load product details
async function loadProductDetails(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        const product = await response.json();
        
        currentProduct = product;
        displayProductDetails(product);
    } catch (error) {
        console.error('Error loading product:', error);
        displayDummyProduct(id);
    }
}

// Display product details
function displayProductDetails(product) {
    // Update page title
    document.title = `${product.name} - Polashtoli Store`;
    document.getElementById('productName').textContent = product.name;
    
    // Update product info
    document.getElementById('category').textContent = product.category || 'General';
    document.getElementById('productTitle').textContent = product.name;
    document.getElementById('productStars').innerHTML = generateStars(product.rating || 4);
    document.getElementById('ratingCount').textContent = `(${product.reviewCount || 0} reviews)`;
    document.getElementById('currentPrice').textContent = `৳${product.price}`;
    
    if (product.originalPrice) {
        document.getElementById('originalPrice').textContent = `৳${product.originalPrice}`;
        document.getElementById('originalPrice').style.display = 'inline';
    }
    
    if (product.discount) {
        document.getElementById('discountBadge').textContent = `${product.discount}% OFF`;
        document.getElementById('discountBadge').style.display = 'inline-block';
    }
    
    document.getElementById('productDescription').textContent = product.description || 'No description available.';
    document.getElementById('fullDescription').innerHTML = `<p>${product.description || 'No description available.'}</p>`;
    
    // Update meta
    document.getElementById('sku').textContent = product.sku || 'N/A';
    document.getElementById('categoryMeta').textContent = product.category || 'N/A';
    document.getElementById('stockStatus').textContent = product.stockQuantity > 0 ? `In Stock (${product.stockQuantity} available)` : 'Out of Stock';
    document.getElementById('stockStatus').className = product.stockQuantity > 0 ? 'text-success' : 'text-danger';
    
    // Update images
    if (product.images && product.images.length > 0) {
        document.getElementById('mainImage').src = product.images[0];
        displayThumbnails(product.images);
    } else {
        document.getElementById('mainImage').src = `https://via.placeholder.com/600x600?text=${encodeURIComponent(product.name)}`;
    }
    
    // Update specifications
    if (product.specifications) {
        displaySpecifications(product.specifications);
    }
    
    // Load reviews
    loadReviews(product.id);
}

// Display dummy product for demo
function displayDummyProduct(id) {
    const dummyProduct = {
        id: id,
        name: 'Premium Wireless Headphones',
        category: 'Electronics',
        price: 2999,
        originalPrice: 3999,
        discount: 25,
        rating: 4.5,
        reviewCount: 128,
        description: 'Experience premium sound quality with these wireless headphones. Features include active noise cancellation, 30-hour battery life, and comfortable over-ear design.',
        sku: 'WH-2999',
        stockQuantity: 50,
        images: ['https://via.placeholder.com/600x600?text=Headphones'],
        specifications: {
            'Brand': 'Premium Audio',
            'Model': 'PA-2999',
            'Connectivity': 'Bluetooth 5.0',
            'Battery Life': '30 hours',
            'Weight': '250g',
            'Color': 'Black'
        }
    };
    
    currentProduct = dummyProduct;
    displayProductDetails(dummyProduct);
}

// Display thumbnails
function displayThumbnails(images) {
    const container = document.getElementById('thumbnails');
    container.innerHTML = images.map((img, index) => `
        <div class="col-3">
            <img src="${img}" class="img-fluid rounded cursor-pointer" 
                 onclick="changeMainImage('${img}')" alt="Product thumbnail">
        </div>
    `).join('');
}

// Change main image
function changeMainImage(imageSrc) {
    document.getElementById('mainImage').src = imageSrc;
}

// Display specifications
function displaySpecifications(specs) {
    const table = document.getElementById('specsTable');
    
    if (typeof specs === 'string') {
        try {
            specs = JSON.parse(specs);
        } catch (e) {
            specs = {};
        }
    }
    
    table.innerHTML = Object.entries(specs).map(([key, value]) => `
        <tr>
            <th style="width: 30%">${key}</th>
            <td>${value}</td>
        </tr>
    `).join('');
}

// Load reviews
async function loadReviews(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`);
        const reviews = await response.json();
        
        displayReviews(reviews);
        document.getElementById('reviewsBadge').textContent = reviews.length;
    } catch (error) {
        console.error('Error loading reviews:', error);
        displayDummyReviews();
    }
}

// Display reviews
function displayReviews(reviews) {
    const container = document.getElementById('reviewsList');
    
    if (reviews.length === 0) {
        container.innerHTML = '<p>No reviews yet. Be the first to review this product!</p>';
        return;
    }
    
    container.innerHTML = reviews.map(review => `
        <div class="review-item mb-4 pb-4 border-bottom">
            <div class="d-flex justify-content-between mb-2">
                <div>
                    <strong>${review.userName || 'Anonymous'}</strong>
                    <div class="stars">${generateStars(review.rating)}</div>
                </div>
                <small class="text-muted">${new Date(review.createdAt).toLocaleDateString()}</small>
            </div>
            ${review.title ? `<h6>${review.title}</h6>` : ''}
            <p>${review.comment}</p>
            ${review.verified ? '<span class="badge bg-success">Verified Purchase</span>' : ''}
        </div>
    `).join('');
}

// Display dummy reviews
function displayDummyReviews() {
    const dummyReviews = [
        {
            userName: 'John Doe',
            rating: 5,
            title: 'Excellent product!',
            comment: 'Really happy with this purchase. Quality is top-notch.',
            verified: true,
            createdAt: new Date()
        },
        {
            userName: 'Jane Smith',
            rating: 4,
            title: 'Good value for money',
            comment: 'Works as expected. Would recommend.',
            verified: true,
            createdAt: new Date()
        }
    ];
    
    displayReviews(dummyReviews);
    document.getElementById('reviewsBadge').textContent = dummyReviews.length;
}

// Submit review
async function submitReview(e) {
    e.preventDefault();
    
    const review = {
        productId: productId,
        rating: document.getElementById('rating').value,
        title: document.getElementById('reviewTitle').value,
        comment: document.getElementById('reviewText').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(review)
        });
        
        if (response.ok) {
            showNotification('Review submitted successfully!', 'success');
            document.getElementById('reviewForm').reset();
            loadReviews(productId);
        } else {
            showNotification('Failed to submit review. Please try again.', 'danger');
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        showNotification('An error occurred. Please try again.', 'danger');
    }
}

// Load related products
async function loadRelatedProducts(productId) {
    try {
        // In production, fetch related products from API
        const response = await fetch(`${API_BASE_URL}/products?size=4`);
        const data = await response.json();
        
        displayRelatedProducts(data.content || data);
    } catch (error) {
        console.error('Error loading related products:', error);
        displayDummyRelatedProducts();
    }
}

// Display related products
function displayRelatedProducts(products) {
    const container = document.getElementById('relatedProducts');
    
    container.innerHTML = products.slice(0, 4).map(product => `
        <div class="col-lg-3 col-md-6">
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image || 'https://via.placeholder.com/300x300'}" alt="${product.name}">
                </div>
                <div class="product-info">
                    <h6><a href="product-details.html?id=${product.id}">${product.name}</a></h6>
                    <div class="product-price">
                        <span class="current-price">৳${product.price}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Display dummy related products
function displayDummyRelatedProducts() {
    const dummyProducts = [
        { id: 2, name: 'Smart Watch', price: 4999, image: 'https://via.placeholder.com/300x300?text=Smart+Watch' },
        { id: 3, name: 'Laptop Backpack', price: 1499, image: 'https://via.placeholder.com/300x300?text=Backpack' },
        { id: 6, name: 'Bluetooth Speaker', price: 1999, image: 'https://via.placeholder.com/300x300?text=Speaker' },
        { id: 9, name: 'Gaming Mouse', price: 1599, image: 'https://via.placeholder.com/300x300?text=Gaming+Mouse' }
    ];
    
    displayRelatedProducts(dummyProducts);
}

// Quantity functions
function decreaseQuantity() {
    const input = document.getElementById('quantity');
    if (input.value > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

function increaseQuantity() {
    const input = document.getElementById('quantity');
    input.value = parseInt(input.value) + 1;
}

// Add to cart from details page
function addToCartFromDetails() {
    const quantity = parseInt(document.getElementById('quantity').value);
    
    if (!currentProduct) {
        showNotification('Product not loaded', 'danger');
        return;
    }
    
    // Add to cart with quantity
    for (let i = 0; i < quantity; i++) {
        addToCart(currentProduct.id);
    }
    
    showNotification(`Added ${quantity} item(s) to cart!`, 'success');
}

// Buy now
function buyNow() {
    addToCartFromDetails();
    setTimeout(() => {
        window.location.href = 'checkout.html';
    }, 500);
}

// Add to wishlist from details page
function addToWishlistFromDetails() {
    if (!currentProduct) {
        showNotification('Product not loaded', 'danger');
        return;
    }
    
    addToWishlist(currentProduct.id);
}
