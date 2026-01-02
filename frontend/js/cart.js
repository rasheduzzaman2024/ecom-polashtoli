// Cart Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
    loadRecommendedProducts();
});

// Load cart items
function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cartItemsContainer');
    const emptyMessage = document.getElementById('emptyCartMessage');
    
    if (cart.length === 0) {
        container.innerHTML = '';
        emptyMessage.style.display = 'block';
        document.getElementById('checkoutBtn').disabled = true;
        updateCartSummary();
        return;
    }
    
    emptyMessage.style.display = 'none';
    
    container.innerHTML = cart.map((item, index) => `
        <div class="card mb-3">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="${item.image || 'https://via.placeholder.com/150'}" 
                             alt="${item.name}" class="img-fluid rounded">
                    </div>
                    <div class="col-md-4">
                        <h6 class="mb-1">${item.name}</h6>
                        <small class="text-muted">${item.category || 'General'}</small>
                        ${item.attributes ? `<br><small class="text-muted">${item.attributes}</small>` : ''}
                    </div>
                    <div class="col-md-2">
                        <strong>৳${item.price}</strong>
                    </div>
                    <div class="col-md-2">
                        <div class="input-group input-group-sm">
                            <button class="btn btn-outline-secondary" onclick="updateQuantity(${index}, -1)">
                                <i class="bi bi-dash"></i>
                            </button>
                            <input type="number" class="form-control text-center" 
                                   value="${item.quantity || 1}" min="1" readonly>
                            <button class="btn btn-outline-secondary" onclick="updateQuantity(${index}, 1)">
                                <i class="bi bi-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-md-1">
                        <strong>৳${(item.price * (item.quantity || 1)).toFixed(2)}</strong>
                    </div>
                    <div class="col-md-1 text-end">
                        <button class="btn btn-sm btn-outline-danger" onclick="removeFromCartPage(${index})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    updateCartSummary();
}

// Update quantity
function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart[index]) {
        cart[index].quantity = (cart[index].quantity || 1) + change;
        
        if (cart[index].quantity < 1) {
            cart[index].quantity = 1;
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems();
        updateCartBadge();
        showNotification('Cart updated', 'success');
    }
}

// Remove from cart (cart page specific)
function removeFromCartPage(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (confirm('Remove this item from cart?')) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems();
        updateCartBadge();
        showNotification('Item removed from cart', 'info');
    }
}

// Update cart summary
function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    let subtotal = 0;
    let itemCount = 0;
    
    cart.forEach(item => {
        const qty = item.quantity || 1;
        subtotal += item.price * qty;
        itemCount += qty;
    });
    
    const shipping = subtotal >= 1000 ? 0 : 100;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;
    
    document.getElementById('itemCount').textContent = itemCount;
    document.getElementById('subtotal').textContent = `৳${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `৳${shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `৳${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `৳${total.toFixed(2)}`;
}

// Apply coupon
function applyCoupon() {
    const code = document.getElementById('couponCode').value.trim();
    
    if (!code) {
        showNotification('Please enter a coupon code', 'warning');
        return;
    }
    
    // Demo coupon codes
    const validCoupons = {
        'SAVE10': 10,
        'SAVE20': 20,
        'FIRST100': 100
    };
    
    if (validCoupons[code]) {
        showNotification(`Coupon applied! You saved ৳${validCoupons[code]}`, 'success');
        // Apply discount logic here
    } else {
        showNotification('Invalid coupon code', 'danger');
    }
}

// Load recommended products
async function loadRecommendedProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products?size=4`);
        const data = await response.json();
        displayRecommendedProducts(data.content || data.slice(0, 4));
    } catch (error) {
        displayDummyRecommendedProducts();
    }
}

// Display recommended products
function displayRecommendedProducts(products) {
    const container = document.getElementById('recommendedProducts');
    
    container.innerHTML = products.map(product => `
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
                    <button class="add-to-cart-btn btn-sm" onclick="addToCart(${product.id})">
                        <i class="bi bi-cart-plus"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Display dummy recommended products
function displayDummyRecommendedProducts() {
    const dummyProducts = [
        { id: 1, name: 'Wireless Headphones', price: 2999, image: 'https://via.placeholder.com/300x300?text=Headphones' },
        { id: 2, name: 'Smart Watch', price: 4999, image: 'https://via.placeholder.com/300x300?text=Smart+Watch' },
        { id: 3, name: 'Bluetooth Speaker', price: 1999, image: 'https://via.placeholder.com/300x300?text=Speaker' },
        { id: 4, name: 'Power Bank', price: 1499, image: 'https://via.placeholder.com/300x300?text=Power+Bank' }
    ];
    
    displayRecommendedProducts(dummyProducts);
}
