// Route Guard - Protect Pages by Role

// Page Protection Rules
const PAGE_ROLES = {
    // Admin Pages
    '/admin/dashboard.html': [ROLES.ADMIN, ROLES.SALESMAN],
    '/admin/products.html': [ROLES.ADMIN, ROLES.SALESMAN],
    '/admin/orders.html': [ROLES.ADMIN, ROLES.SALESMAN],
    '/admin/customers.html': [ROLES.ADMIN],
    '/admin/coupons.html': [ROLES.ADMIN],
    '/admin/analytics.html': [ROLES.ADMIN],
    '/admin/settings.html': [ROLES.ADMIN],
    
    // Customer Pages
    '/customer/dashboard.html': [ROLES.CUSTOMER],
    '/customer/wishlist.html': [ROLES.CUSTOMER],
    '/customer/settings.html': [ROLES.CUSTOMER],
    '/profile.html': [ROLES.CUSTOMER],
    '/orders.html': [ROLES.CUSTOMER],
    '/cart.html': [ROLES.CUSTOMER],
    '/checkout.html': [ROLES.CUSTOMER]
};

// Check Page Access
function checkPageAccess() {
    // Get current page path
    const currentPath = window.location.pathname;
    
    // Get page key (relative to frontend folder)
    let pageKey = currentPath;
    if (pageKey.includes('/frontend/')) {
        pageKey = pageKey.split('/frontend')[1];
    }
    
    // Check if page requires authentication
    const requiredRoles = PAGE_ROLES[pageKey];
    
    if (!requiredRoles) {
        // Page doesn't require specific roles
        return true;
    }
    
    // Check if user is logged in
    if (!Auth.isLoggedIn()) {
        alert('Please login to access this page');
        window.location.href = getLoginUrl();
        return false;
    }
    
    // Check if user has required role
    if (!Auth.hasAnyRole(requiredRoles)) {
        alert('Access Denied: You do not have permission to view this page');
        Auth.redirectToDashboard();
        return false;
    }
    
    return true;
}

// Get Login URL based on page
function getLoginUrl() {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/admin/')) {
        return '../login.html';
    }
    
    return 'login.html';
}

// Initialize Route Guard
function initRouteGuard() {
    // Check access when page loads
    checkPageAccess();
    
    // Hide/show navigation items based on role
    updateNavigationByRole();
    
    // Display user info
    if (Auth.isLoggedIn()) {
        displayUserInfo();
    }
}

// Update Navigation Based on Role
function updateNavigationByRole() {
    const user = Auth.getCurrentUser();
    
    if (!user) return;
    
    // Hide admin-only nav items for salesman
    if (user.role === ROLES.SALESMAN) {
        // Hide items that salesmen can't access
        const restrictedItems = [
            '[href="customers.html"]',
            '[href="coupons.html"]',
            '[href="analytics.html"]',
            '[href="settings.html"]'
        ];
        
        restrictedItems.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                const navItem = element.closest('.admin-nav-item');
                if (navItem) {
                    navItem.style.display = 'none';
                }
            }
        });
        
        // Add salesman badge
        const userInfo = document.querySelector('.admin-user-info p');
        if (userInfo) {
            userInfo.textContent = 'Salesman';
        }
    }
    
    // Update logout links
    document.querySelectorAll('[href="../login.html"]').forEach(link => {
        link.addEventListener('click', function(e) {
            if (link.textContent.trim().toLowerCase().includes('logout')) {
                e.preventDefault();
                handleLogout();
            }
        });
    });
}

// Protect specific features
function canAccess(feature) {
    return Auth.hasPermission(feature);
}

// Show feature-specific UI
function showFeatureUI(feature, elementSelector) {
    if (canAccess(feature)) {
        const elements = document.querySelectorAll(elementSelector);
        elements.forEach(el => el.style.display = '');
    } else {
        const elements = document.querySelectorAll(elementSelector);
        elements.forEach(el => el.style.display = 'none');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initRouteGuard();
});

// Export for global use
window.RouteGuard = {
    checkPageAccess: checkPageAccess,
    canAccess: canAccess,
    showFeatureUI: showFeatureUI,
    updateNavigationByRole: updateNavigationByRole
};
