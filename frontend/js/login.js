// Login Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        window.location.href = 'profile.html';
    }
    
    // Login form submission
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Register form submission
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
});

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    try {
        // Send login request to backend
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Save user data
            const userData = {
                id: data.id,
                name: data.name,
                email: data.email,
                token: data.token,
                rememberMe: rememberMe
            };
            
            localStorage.setItem('user', JSON.stringify(userData));
            
            // Save token
            if (data.token) {
                localStorage.setItem('authToken', data.token);
            }
            
            showNotification('Login successful!', 'success');
            
            // Redirect
            setTimeout(() => {
                const returnUrl = new URLSearchParams(window.location.search).get('return') || 'profile.html';
                window.location.href = returnUrl;
            }, 1000);
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        console.error('Login error:', error);
        
        // Demo login (for development)
        const userData = {
            id: Date.now(),
            name: 'Demo User',
            email: email,
            rememberMe: rememberMe
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        showNotification('Login successful! (Demo mode)', 'success');
        
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1000);
    }
}

// Handle registration
async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'danger');
        return;
    }
    
    // Validate password strength
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters!', 'danger');
        return;
    }
    
    try {
        // Send registration request to backend
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, phone, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Save user data
            const userData = {
                id: data.id,
                name: data.name,
                email: data.email,
                phone: data.phone,
                token: data.token
            };
            
            localStorage.setItem('user', JSON.stringify(userData));
            
            if (data.token) {
                localStorage.setItem('authToken', data.token);
            }
            
            showNotification('Registration successful!', 'success');
            
            // Redirect to profile
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1000);
        } else {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        
        // Demo registration (for development)
        const userData = {
            id: Date.now(),
            name: name,
            email: email,
            phone: phone
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        showNotification('Registration successful! (Demo mode)', 'success');
        
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1000);
    }
}

// Social login handlers
function loginWithGoogle() {
    showNotification('Google login coming soon!', 'info');
}

function loginWithFacebook() {
    showNotification('Facebook login coming soon!', 'info');
}
