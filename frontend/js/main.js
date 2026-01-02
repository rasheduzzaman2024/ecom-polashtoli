// API Configuration
const API_BASE_URL = 'http://localhost:8080/api';
const CHATBOT_API_URL = 'http://localhost:5000/api';

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadFeaturedProducts();
    initializeChatbot();
    initializeCart();
    initializeSearch();
    initializeScrollEffects();
}

// Products Management
async function loadFeaturedProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products/featured`);
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
        displayDummyProducts();
    }
}

function displayProducts(products) {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    container.innerHTML = products.map(product => `
        <div class="col-lg-3 col-md-4 col-sm-6">
            <div class="product-card">
                <div class="product-image">
                    ${product.discount ? `<span class="product-badge">-${product.discount}%</span>` : ''}
                    <img src="${product.image}" alt="${product.name}">
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
                    <span class="product-category">${product.category}</span>
                    <h5 class="product-title">${product.name}</h5>
                    <div class="product-rating">
                        <span class="stars">${generateStars(product.rating)}</span>
                        <span class="rating-count">(${product.reviewCount})</span>
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

function displayDummyProducts() {
    const dummyProducts = [
        {
            id: 1,
            name: 'Wireless Headphones',
            category: 'Electronics',
            price: 2999,
            originalPrice: 3999,
            discount: 25,
            rating: 4.5,
            reviewCount: 128,
            image: 'https://via.placeholder.com/300x300?text=Headphones'
        },
        {
            id: 2,
            name: 'Smart Watch',
            category: 'Electronics',
            price: 4999,
            originalPrice: 6999,
            discount: 30,
            rating: 4.8,
            reviewCount: 256,
            image: 'https://via.placeholder.com/300x300?text=Smart+Watch'
        },
        {
            id: 3,
            name: 'Laptop Backpack',
            category: 'Fashion',
            price: 1499,
            rating: 4.3,
            reviewCount: 89,
            image: 'https://via.placeholder.com/300x300?text=Backpack'
        },
        {
            id: 4,
            name: 'LED Desk Lamp',
            category: 'Home',
            price: 899,
            originalPrice: 1299,
            discount: 31,
            rating: 4.6,
            reviewCount: 145,
            image: 'https://via.placeholder.com/300x300?text=Desk+Lamp'
        },
        {
            id: 5,
            name: 'Running Shoes',
            category: 'Fashion',
            price: 3499,
            rating: 4.7,
            reviewCount: 203,
            image: 'https://via.placeholder.com/300x300?text=Running+Shoes'
        },
        {
            id: 6,
            name: 'Bluetooth Speaker',
            category: 'Electronics',
            price: 1999,
            originalPrice: 2999,
            discount: 33,
            rating: 4.4,
            reviewCount: 167,
            image: 'https://via.placeholder.com/300x300?text=Speaker'
        },
        {
            id: 7,
            name: 'Coffee Maker',
            category: 'Home',
            price: 5999,
            rating: 4.5,
            reviewCount: 92,
            image: 'https://via.placeholder.com/300x300?text=Coffee+Maker'
        },
        {
            id: 8,
            name: 'Yoga Mat',
            category: 'Sports',
            price: 799,
            originalPrice: 1199,
            discount: 33,
            rating: 4.2,
            reviewCount: 78,
            image: 'https://via.placeholder.com/300x300?text=Yoga+Mat'
        }
    ];
    
    displayProducts(dummyProducts);
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="bi bi-star-fill"></i>';
    }
    if (halfStar) {
        stars += '<i class="bi bi-star-half"></i>';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="bi bi-star"></i>';
    }
    
    return stars;
}

// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function initializeCart() {
    updateCartBadge();
}

function addToCart(productId) {
    // In production, fetch product details from API
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    showNotification('Product added to cart!', 'success');
}

function updateCartBadge() {
    const badge = document.querySelector('.nav-icon .badge');
    if (badge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
    }
}

function addToWishlist(productId) {
    showNotification('Added to wishlist!', 'success');
}

function quickView(productId) {
    // Implement quick view modal
    console.log('Quick view for product:', productId);
}

// Search Functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-box input');
    if (!searchInput) return;
    
    let searchTimeout;
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(e.target.value);
        }, 300);
    });
}

async function performSearch(query) {
    if (query.length < 2) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
        const results = await response.json();
        displaySearchResults(results);
    } catch (error) {
        console.error('Search error:', error);
    }
}

function displaySearchResults(results) {
    // Implement search results dropdown
    console.log('Search results:', results);
}

// Chatbot
let chatbotOpen = false;

function initializeChatbot() {
    const chatbotBtn = document.getElementById('chatbotBtn');
    const chatbotModal = document.getElementById('chatbotModal');
    const closeChatbot = document.getElementById('closeChatbot');
    const sendMessage = document.getElementById('sendMessage');
    const chatInput = document.getElementById('chatInput');
    
    if (!chatbotBtn || !chatbotModal) return;
    
    chatbotBtn.addEventListener('click', toggleChatbot);
    closeChatbot.addEventListener('click', toggleChatbot);
    
    sendMessage.addEventListener('click', () => sendChatMessage());
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });
}

function toggleChatbot() {
    const chatbotModal = document.getElementById('chatbotModal');
    chatbotOpen = !chatbotOpen;
    
    if (chatbotOpen) {
        chatbotModal.classList.add('active');
    } else {
        chatbotModal.classList.remove('active');
    }
}

async function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Display user message
    appendChatMessage(message, 'user');
    chatInput.value = '';
    
    // Show typing indicator
    const typingIndicator = appendTypingIndicator();
    
    try {
        const response = await fetch(`${CHATBOT_API_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                context: {
                    cart: cart,
                    userId: getUserId()
                }
            })
        });
        
        const data = await response.json();
        
        // Remove typing indicator
        typingIndicator.remove();
        
        // Display bot response
        appendChatMessage(data.response, 'bot');
        
        // Handle any actions
        if (data.action) {
            handleChatbotAction(data.action);
        }
    } catch (error) {
        console.error('Chatbot error:', error);
        typingIndicator.remove();
        appendChatMessage('Sorry, I encountered an error. Please try again.', 'bot');
    }
}

function appendChatMessage(message, sender) {
    const chatbotBody = document.getElementById('chatbotBody');
    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
    messageDiv.innerHTML = `<p>${message}</p>`;
    chatbotBody.appendChild(messageDiv);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
    return messageDiv;
}

function appendTypingIndicator() {
    const chatbotBody = document.getElementById('chatbotBody');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'bot-message typing-indicator';
    typingDiv.innerHTML = '<div class="loading"></div>';
    chatbotBody.appendChild(typingDiv);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
    return typingDiv;
}

function handleChatbotAction(action) {
    switch(action.type) {
        case 'navigate':
            window.location.href = action.url;
            break;
        case 'add_to_cart':
            addToCart(action.productId);
            break;
        case 'search':
            performSearch(action.query);
            break;
        default:
            console.log('Unknown action:', action);
    }
}

// Scroll Effects
function initializeScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 250px;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Utility Functions
function getUserId() {
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = 'guest_' + Math.random().toString(36).substring(7);
        localStorage.setItem('userId', userId);
    }
    return userId;
}

// Newsletter Subscription
document.querySelector('.newsletter-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        
        if (response.ok) {
            showNotification('Successfully subscribed to newsletter!', 'success');
            this.reset();
        } else {
            showNotification('Subscription failed. Please try again.', 'danger');
        }
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        showNotification('An error occurred. Please try again.', 'danger');
    }
});

// Animation Styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .notification {
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }
`;
document.head.appendChild(style);

// Export functions for use in other pages
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addToCart,
        addToWishlist,
        quickView,
        performSearch,
        showNotification
    };
}
