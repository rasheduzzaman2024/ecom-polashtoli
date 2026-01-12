// Authentication & Role Management System

// User Roles
const ROLES = {
    CUSTOMER: 'customer',
    SALESMAN: 'salesman',
    ADMIN: 'admin'
};

// Demo Users (Replace with backend API)
const demoUsers = [
    {
        id: 1,
        username: 'admin@polashtoli.com',
        password: 'admin123',
        role: ROLES.ADMIN,
        name: 'Admin User',
        avatar: 'A'
    },
    {
        id: 2,
        username: 'salesman@polashtoli.com',
        password: 'sales123',
        role: ROLES.SALESMAN,
        name: 'Salesman User',
        avatar: 'S'
    },
    {
        id: 3,
        username: 'customer@polashtoli.com',
        password: 'customer123',
        role: ROLES.CUSTOMER,
        name: 'Customer User',
        avatar: 'C'
    }
];

// Authentication Functions
const Auth = {
    // Login
    login: function(username, password) {
        const user = demoUsers.find(u => 
            u.username === username && u.password === password
        );
        
        if (user) {
            // Store user session
            const session = {
                id: user.id,
                username: user.username,
                role: user.role,
                name: user.name,
                avatar: user.avatar,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('userSession', JSON.stringify(session));
            localStorage.setItem('isLoggedIn', 'true');
            
            return {
                success: true,
                user: session
            };
        }
        
        return {
            success: false,
            message: 'Invalid username or password'
        };
    },
    
    // Register
    register: function(userData) {
        // Check if username exists
        const exists = demoUsers.find(u => u.username === userData.username);
        
        if (exists) {
            return {
                success: false,
                message: 'Username already exists'
            };
        }
        
        // Create new user (in real app, save to database)
        const newUser = {
            id: demoUsers.length + 1,
            username: userData.username,
            password: userData.password,
            role: userData.role || ROLES.CUSTOMER,
            name: userData.name,
            avatar: userData.name.charAt(0).toUpperCase()
        };
        
        demoUsers.push(newUser);
        
        return {
            success: true,
            message: 'Registration successful'
        };
    },
    
    // Logout
    logout: function() {
        localStorage.removeItem('userSession');
        localStorage.removeItem('isLoggedIn');
        window.location.href = '../login.html';
    },
    
    // Get Current User
    getCurrentUser: function() {
        const session = localStorage.getItem('userSession');
        return session ? JSON.parse(session) : null;
    },
    
    // Check if Logged In
    isLoggedIn: function() {
        return localStorage.getItem('isLoggedIn') === 'true';
    },
    
    // Check Role
    hasRole: function(role) {
        const user = this.getCurrentUser();
        return user && user.role === role;
    },
    
    // Check Multiple Roles
    hasAnyRole: function(roles) {
        const user = this.getCurrentUser();
        return user && roles.includes(user.role);
    },
    
    // Require Login
    requireLogin: function() {
        if (!this.isLoggedIn()) {
            window.location.href = '../login.html';
            return false;
        }
        return true;
    },
    
    // Require Role
    requireRole: function(roles) {
        if (!this.requireLogin()) return false;
        
        const allowedRoles = Array.isArray(roles) ? roles : [roles];
        
        if (!this.hasAnyRole(allowedRoles)) {
            alert('Access Denied: You do not have permission to access this page');
            this.redirectToDashboard();
            return false;
        }
        
        return true;
    },
    
    // Redirect to Appropriate Dashboard
    redirectToDashboard: function() {
        const user = this.getCurrentUser();
        
        if (!user) {
            window.location.href = '../login.html';
            return;
        }
        
        switch(user.role) {
            case ROLES.ADMIN:
                window.location.href = '../admin/dashboard.html';
                break;
            case ROLES.SALESMAN:
                window.location.href = '../admin/dashboard.html';
                break;
            case ROLES.CUSTOMER:
                window.location.href = '../customer/dashboard.html';
                break;
            default:
                window.location.href = '../index.html';
        }
    },
    
    // Get Role Permissions
    getPermissions: function() {
        const user = this.getCurrentUser();
        
        if (!user) return [];
        
        switch(user.role) {
            case ROLES.ADMIN:
                return [
                    'view_dashboard',
                    'view_analytics',
                    'manage_products',
                    'manage_orders',
                    'manage_customers',
                    'manage_coupons',
                    'manage_settings',
                    'view_reports',
                    'export_data'
                ];
            case ROLES.SALESMAN:
                return [
                    'view_dashboard',
                    'manage_products',
                    'manage_orders',
                    'view_customers'
                ];
            case ROLES.CUSTOMER:
                return [
                    'view_products',
                    'place_orders',
                    'view_orders',
                    'manage_wishlist',
                    'manage_profile'
                ];
            default:
                return [];
        }
    },
    
    // Check Permission
    hasPermission: function(permission) {
        const permissions = this.getPermissions();
        return permissions.includes(permission);
    }
};

// Display Current User Info
function displayUserInfo() {
    const user = Auth.getCurrentUser();
    
    if (!user) return;
    
    // Update user avatar
    const avatarElements = document.querySelectorAll('.admin-user-avatar, .user-avatar');
    avatarElements.forEach(el => {
        el.textContent = user.avatar;
    });
    
    // Update user name
    const nameElements = document.querySelectorAll('.admin-user-info h6, .user-name');
    nameElements.forEach(el => {
        el.textContent = user.name;
    });
    
    // Update user role
    const roleElements = document.querySelectorAll('.admin-user-info p, .user-role');
    roleElements.forEach(el => {
        el.textContent = capitalizeRole(user.role);
    });
}

// Capitalize Role
function capitalizeRole(role) {
    return role.charAt(0).toUpperCase() + role.slice(1);
}

// Handle Login Form
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    const result = Auth.login(username, password);
    
    if (result.success) {
        // Show success message
        showMessage('Login successful! Redirecting...', 'success');
        
        // Redirect after short delay
        setTimeout(() => {
            Auth.redirectToDashboard();
        }, 1000);
    } else {
        showMessage(result.message, 'error');
    }
}

// Handle Register Form
function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const role = document.getElementById('registerRole').value;
    
    // Validate
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters', 'error');
        return;
    }
    
    const result = Auth.register({
        name: name,
        username: username,
        password: password,
        role: role
    });
    
    if (result.success) {
        showMessage('Registration successful! Please login.', 'success');
        
        // Switch to login tab after delay
        setTimeout(() => {
            document.querySelector('[data-tab="login"]').click();
        }, 1500);
    } else {
        showMessage(result.message, 'error');
    }
}

// Show Message
function showMessage(message, type) {
    const messageDiv = document.getElementById('authMessage') || createMessageDiv();
    messageDiv.textContent = message;
    messageDiv.className = 'auth-message ' + type;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Create Message Div
function createMessageDiv() {
    const div = document.createElement('div');
    div.id = 'authMessage';
    div.className = 'auth-message';
    document.querySelector('.auth-form').prepend(div);
    return div;
}

// Logout Handler
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        Auth.logout();
    }
}

// Initialize Auth on Page Load
document.addEventListener('DOMContentLoaded', function() {
    // Display user info if logged in
    if (Auth.isLoggedIn()) {
        displayUserInfo();
    }
    
    // Add logout event listeners
    document.querySelectorAll('[data-action="logout"]').forEach(btn => {
        btn.addEventListener('click', handleLogout);
    });
});

// Export for global use
window.Auth = Auth;
window.ROLES = ROLES;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleLogout = handleLogout;
window.displayUserInfo = displayUserInfo;
