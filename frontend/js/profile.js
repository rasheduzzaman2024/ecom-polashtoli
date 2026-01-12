// Profile Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        window.location.href = 'login.html?return=profile.html';
        return;
    }
    
    loadUserProfile();
    loadDashboardData();
    
    // Form submissions
    document.getElementById('updateProfileForm').addEventListener('submit', updateProfile);
    document.getElementById('changePasswordForm').addEventListener('submit', changePassword);
});

// Load user profile
function loadUserProfile() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    document.getElementById('userName').textContent = user.name;
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileEmail').textContent = user.email;
    
    // Settings form
    document.getElementById('settingsName').value = user.name;
    document.getElementById('settingsEmail').value = user.email;
    document.getElementById('settingsPhone').value = user.phone || '';
}

// Load dashboard data
function loadDashboardData() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Calculate stats
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    // Update stats
    document.getElementById('totalOrders').textContent = orders.length;
    document.getElementById('pendingOrders').textContent = pendingOrders;
    document.getElementById('wishlistCount').textContent = wishlist.length;
    document.getElementById('totalSpent').textContent = `৳${totalSpent.toFixed(2)}`;
    
    // Load recent orders
    loadRecentOrders(orders.slice(0, 3));
}

// Load recent orders
function loadRecentOrders(orders) {
    const container = document.getElementById('recentOrdersList');
    
    if (orders.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">No orders yet</p>';
        return;
    }
    
    container.innerHTML = orders.map(order => `
        <div class="border-bottom py-3">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1">Order #${order.id}</h6>
                    <small class="text-muted">${new Date(order.date).toLocaleDateString()}</small>
                </div>
                <div class="text-end">
                    <strong>৳${order.total.toFixed(2)}</strong><br>
                    <span class="badge bg-${getStatusColor(order.status)}">${order.status}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Get status color
function getStatusColor(status) {
    const colors = {
        'Pending': 'warning',
        'Processing': 'info',
        'Shipped': 'primary',
        'Delivered': 'success',
        'Cancelled': 'danger'
    };
    return colors[status] || 'secondary';
}

// Show tab
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    
    // Remove active class from all links
    document.querySelectorAll('.list-group-item a').forEach(link => {
        link.classList.remove('active-tab');
    });
    
    // Show selected tab
    const tabMap = {
        'overview': 'overviewTab',
        'orders': 'ordersTab',
        'wishlist': 'wishlistTab',
        'addresses': 'addressesTab',
        'settings': 'settingsTab'
    };
    
    document.getElementById(tabMap[tabName]).style.display = 'block';
    
    // Load tab-specific data
    if (tabName === 'orders') {
        loadAllOrders();
    } else if (tabName === 'wishlist') {
        loadWishlist();
    } else if (tabName === 'addresses') {
        loadAddresses();
    }
    
    return false;
}

// Load all orders
function loadAllOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const container = document.getElementById('allOrdersList');
    
    if (orders.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">No orders yet</p>';
        return;
    }
    
    container.innerHTML = orders.map(order => `
        <div class="card mb-3">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-3">
                        <h6>Order #${order.id}</h6>
                        <small class="text-muted">${new Date(order.date).toLocaleDateString()}</small>
                    </div>
                    <div class="col-md-3">
                        <small class="text-muted">Items:</small>
                        <div>${order.items.length} item(s)</div>
                    </div>
                    <div class="col-md-2">
                        <small class="text-muted">Total:</small>
                        <div><strong>৳${order.total.toFixed(2)}</strong></div>
                    </div>
                    <div class="col-md-2">
                        <span class="badge bg-${getStatusColor(order.status)}">${order.status}</span>
                    </div>
                    <div class="col-md-2 text-end">
                        <a href="orders.html?id=${order.id}" class="btn btn-sm btn-outline-primary">View Details</a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Load wishlist
function loadWishlist() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const container = document.getElementById('wishlistItems');
    
    if (wishlist.length === 0) {
        container.innerHTML = '<p class="col-12 text-center text-muted">Your wishlist is empty</p>';
        return;
    }
    
    container.innerHTML = wishlist.map(item => `
        <div class="col-md-3">
            <div class="product-card">
                <div class="product-image">
                    <img src="${item.image || 'https://via.placeholder.com/300'}" alt="${item.name}">
                </div>
                <div class="product-info">
                    <h6>${item.name}</h6>
                    <div class="product-price">
                        <span class="current-price">৳${item.price}</span>
                    </div>
                    <button class="btn btn-sm btn-primary w-100" onclick="addToCart(${item.id})">Add to Cart</button>
                    <button class="btn btn-sm btn-outline-danger w-100 mt-1" onclick="removeFromWishlist(${item.id})">Remove</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Load addresses
function loadAddresses() {
    const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
    const container = document.getElementById('addressesList');
    
    if (addresses.length === 0) {
        container.innerHTML = '<p class="text-muted">No saved addresses</p>';
        return;
    }
    
    container.innerHTML = addresses.map((addr, index) => `
        <div class="col-md-6">
            <div class="card">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <h6>${addr.label}</h6>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteAddress(${index})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                    <p class="mb-0">${addr.address}</p>
                    <p class="mb-0">${addr.city}, ${addr.postalCode}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Update profile
async function updateProfile(e) {
    e.preventDefault();
    
    const name = document.getElementById('settingsName').value;
    const email = document.getElementById('settingsEmail').value;
    const phone = document.getElementById('settingsPhone').value;
    
    const user = JSON.parse(localStorage.getItem('user'));
    user.name = name;
    user.email = email;
    user.phone = phone;
    
    localStorage.setItem('user', JSON.stringify(user));
    
    loadUserProfile();
    showNotification('Profile updated successfully!', 'success');
}

// Change password
async function changePassword(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;
    
    if (newPassword !== confirmPassword) {
        showNotification('Passwords do not match!', 'danger');
        return;
    }
    
    if (newPassword.length < 6) {
        showNotification('Password must be at least 6 characters!', 'danger');
        return;
    }
    
    // In production, send request to backend
    showNotification('Password changed successfully!', 'success');
    document.getElementById('changePasswordForm').reset();
}

// Save address
function saveAddress() {
    showNotification('Address saved successfully!', 'success');
    bootstrap.Modal.getInstance(document.getElementById('addAddressModal')).hide();
}

// Delete address
function deleteAddress(index) {
    if (confirm('Delete this address?')) {
        const addresses = JSON.parse(localStorage.getItem('addresses')) || [];
        addresses.splice(index, 1);
        localStorage.setItem('addresses', JSON.stringify(addresses));
        loadAddresses();
        showNotification('Address deleted', 'info');
    }
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        window.location.href = 'index.html';
    }
}
