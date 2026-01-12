/**
 * Polashtoli Store - Complete Messaging System
 * Includes: AI Assistant (Python Backend), WhatsApp, Messenger
 * 
 * @version 2.0.0 - Production Ready
 * @author Polashtoli Team
 */

(function() {
    'use strict';
    
    // ========================================
    // CONFIGURATION - UPDATE THESE VALUES
    // ========================================
    const CONFIG = {
        chatbot: {
            apiUrl: 'http://localhost:5000/api/chat',  // Your Python chatbot API
            enabled: true,  // Set to true to use Python API, false for dummy responses
            timeout: 30000  // API timeout in milliseconds
        },
        whatsapp: {
            phoneNumber: '8801964616035',  // Your WhatsApp number (no + or spaces)
            message: 'Hello! I need help with Polashtoli Store.'
        },
        messenger: {
            pageId: 'polashtoli'  // Your Facebook Page username or ID
        },
        badge: {
            show: true,  // Show notification badge on message button
            count: 3     // Badge number (or set dynamically)
        }
    };
    
    // ========================================
    // GLOBAL VARIABLES
    // ========================================
    let messageSelectionModal = null;
    let chatbotModal = null;
    let messageBtn = null;
    let isInitialized = false;
    
    // ========================================
    // INITIALIZATION
    // ========================================
    
    /**
     * Initialize the messaging system
     */
    function init() {
        if (isInitialized) return;
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setup);
        } else {
            setup();
        }
        
        isInitialized = true;
    }
    
    /**
     * Setup all event listeners and DOM references
     */
    function setup() {
        // Get DOM elements
        messageSelectionModal = document.getElementById('messageSelectionModal');
        chatbotModal = document.getElementById('chatbotModal');
        messageBtn = document.getElementById('messageBtn');
        
        if (!messageBtn) {
            console.warn('⚠️ Message button not found. Make sure HTML is properly included.');
            return;
        }
        
        // Message button click
        messageBtn.addEventListener('click', openMessageSelection);
        
        // Chatbot input - Enter key to send
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    sendChatMessage();
                }
            });
        }
        
        // Send message button
        const sendBtn = document.getElementById('sendMessage');
        if (sendBtn) {
            sendBtn.addEventListener('click', sendChatMessage);
        }
        
        // Close on click outside
        document.addEventListener('click', handleClickOutside);
        
        console.log('✅ Messaging system initialized successfully');
        console.log('🤖 Chatbot API:', CONFIG.chatbot.apiUrl);
        console.log('📱 Chatbot enabled:', CONFIG.chatbot.enabled);
    }
    
    // ========================================
    // MESSAGE SELECTION FUNCTIONS
    // ========================================
    
    /**
     * Open message selection modal
     */
    function openMessageSelection() {
        if (messageSelectionModal) {
            messageSelectionModal.classList.add('active');
            chatbotModal.classList.remove('active');
        }
    }
    
    /**
     * Close message selection modal
     */
    function closeMessageSelection() {
        if (messageSelectionModal) {
            messageSelectionModal.classList.remove('active');
        }
    }
    
    /**
     * Open AI Assistant chatbot
     */
    function openAIAssistant() {
        closeMessageSelection();
        if (chatbotModal) {
            chatbotModal.classList.add('active');
            
            // Focus on input
            const chatInput = document.getElementById('chatInput');
            if (chatInput) {
                setTimeout(() => chatInput.focus(), 100);
            }
        }
    }
    
    /**
     * Open WhatsApp
     */
    function openWhatsApp() {
        const phoneNumber = CONFIG.whatsapp.phoneNumber;
        const message = encodeURIComponent(CONFIG.whatsapp.message);
        const url = `https://wa.me/${phoneNumber}?text=${message}`;
        
        window.open(url, '_blank');
        closeMessageSelection();
        
        console.log('📱 WhatsApp opened:', phoneNumber);
    }
    
    /**
     * Open Facebook Messenger
     */
    function openMessenger() {
        const pageId = CONFIG.messenger.pageId;
        const url = `https://m.me/${pageId}`;
        
        window.open(url, '_blank');
        closeMessageSelection();
        
        console.log('💬 Messenger opened:', pageId);
    }
    
    /**
     * Go back to message selection from chatbot
     */
    function backToSelection() {
        if (chatbotModal) {
            chatbotModal.classList.remove('active');
        }
        if (messageSelectionModal) {
            messageSelectionModal.classList.add('active');
        }
    }
    
    /**
     * Close chatbot modal
     */
    function closeChatbot() {
        if (chatbotModal) {
            chatbotModal.classList.remove('active');
        }
    }
    
    // ========================================
    // CHATBOT FUNCTIONS
    // ========================================
    
    /**
     * Send chat message to Python backend
     */
    async function sendChatMessage() {
        const chatInput = document.getElementById('chatInput');
        if (!chatInput) return;
        
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Disable input while processing
        chatInput.disabled = true;
        const sendBtn = document.getElementById('sendMessage');
        if (sendBtn) sendBtn.disabled = true;
        
        // Add user message to chat
        addChatMessage(message, 'user');
        chatInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        try {
            let botResponse;
            
            if (CONFIG.chatbot.enabled) {
                // Call Python chatbot API
                console.log('🤖 Calling Python API:', CONFIG.chatbot.apiUrl);
                botResponse = await callChatbotAPI(message);
                console.log('✅ Bot response received');
            } else {
                // Use dummy responses
                console.log('⚠️ Using dummy responses (API disabled)');
                await delay(1000);
                botResponse = getDummyResponse(message);
            }
            
            hideTypingIndicator();
            addChatMessage(botResponse, 'bot');
            
        } catch (error) {
            console.error('❌ Chatbot error:', error);
            hideTypingIndicator();
            
            // Fallback to dummy response
            const fallbackResponse = getDummyResponse(message);
            addChatMessage(fallbackResponse, 'bot');
            
            // Show subtle error notification
            addChatMessage(
                '⚠️ Note: Using offline responses. For live assistance, contact us via WhatsApp.',
                'bot'
            );
        } finally {
            // Re-enable input
            chatInput.disabled = false;
            if (sendBtn) sendBtn.disabled = false;
            chatInput.focus();
        }
    }
    
    /**
     * Call Python chatbot API
     * @param {string} message - User message
     * @returns {Promise<string>} Bot response
     */
    async function callChatbotAPI(message) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.chatbot.timeout);
        
        try {
            // Get cart from localStorage (same as main.js)
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Make API request
            const response = await fetch(CONFIG.chatbot.apiUrl, {
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
                }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Handle different response formats
            if (data.response) {
                return data.response;
            } else if (data.message) {
                return data.message;
            } else if (data.reply) {
                return data.reply;
            } else if (typeof data === 'string') {
                return data;
            } else {
                throw new Error('Invalid response format from API');
            }
            
        } catch (error) {
            if (error.name === 'AbortError') {
                throw new Error('Request timeout - server took too long to respond');
            }
            throw error;
        }
    }
    
    /**
     * Get dummy response (fallback)
     * @param {string} message - User message
     * @returns {string} Bot response
     */
    function getDummyResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Greeting
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return 'Hello! Welcome to Polashtoli Store. How can I assist you today? 😊';
        }
        
        // Cart queries
        if (lowerMessage.includes('cart')) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                return 'Your cart is empty. Browse our products to add items! 🛒';
            }
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            return `You have ${totalItems} item${totalItems > 1 ? 's' : ''} in your cart. Would you like to proceed to checkout?`;
        }
        
        // Product queries
        if (lowerMessage.includes('product') || lowerMessage.includes('item') || lowerMessage.includes('search')) {
            return 'I can help you find products! We have Electronics, Fashion, Home, Beauty, and Sports categories. What are you looking for? 🔍';
        }
        
        // Order tracking
        if (lowerMessage.includes('order') || lowerMessage.includes('track') || lowerMessage.includes('delivery')) {
            return 'I can help you track your order. Please provide your order number (e.g., ORD-2026-001). 📦';
        }
        
        // Pricing
        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
            return 'Our products have competitive prices with regular discounts. Which product would you like to know about? 💰';
        }
        
        // Shipping
        if (lowerMessage.includes('shipping') || lowerMessage.includes('ship')) {
            return 'We offer FREE shipping on orders over ৳1000! Standard delivery takes 3-5 business days within Bangladesh. 🚚';
        }
        
        // Returns
        if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
            return 'We have a 30-day return policy. You can return any unused product within 30 days for a full refund or exchange. ✅';
        }
        
        // Payment
        if (lowerMessage.includes('payment') || lowerMessage.includes('pay') || lowerMessage.includes('bkash') || lowerMessage.includes('nagad')) {
            return 'We accept bKash, Nagad, Visa, Mastercard, and Cash on Delivery (COD). Choose your preferred payment method at checkout! 💳';
        }
        
        // Contact
        if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email')) {
            return 'You can reach us at:\n📞 Phone: +880 1964616035\n📧 Email: info@polashtoli.com\nWe\'re here 24/7 to help!';
        }
        
        // Thank you
        if (lowerMessage.includes('thank')) {
            return 'You\'re welcome! Is there anything else I can help you with? 😊';
        }
        
        // Default response
        return 'Thank you for your message! I\'m here to help. Can you please provide more details about what you\'re looking for? 🤔';
    }
    
    /**
     * Add message to chat window
     * @param {string} message - Message text
     * @param {string} sender - 'user' or 'bot'
     */
    function addChatMessage(message, sender) {
        const chatBody = document.getElementById('chatbotBody');
        if (!chatBody) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
        
        const currentTime = new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        if (sender === 'bot') {
            messageDiv.innerHTML = `
                <div class="bot-avatar">
                    <i class="bi bi-robot"></i>
                </div>
                <div class="message-content">
                    <p>${escapeHtml(message)}</p>
                    <small class="message-time">${currentTime}</small>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <p>${escapeHtml(message)}</p>
                    <small class="message-time">${currentTime}</small>
                </div>
            `;
        }
        
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
    
    /**
     * Show typing indicator
     */
    function showTypingIndicator() {
        const chatBody = document.getElementById('chatbotBody');
        if (!chatBody) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'bot-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="bot-avatar">
                <i class="bi bi-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        chatBody.appendChild(typingDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }
    
    /**
     * Hide typing indicator
     */
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // ========================================
    // UTILITY FUNCTIONS
    // ========================================
    
    /**
     * Escape HTML to prevent XSS attacks
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Handle click outside modals
     * @param {Event} event - Click event
     */
    function handleClickOutside(event) {
        if (messageSelectionModal && messageSelectionModal.classList.contains('active')) {
            if (!messageSelectionModal.contains(event.target) && 
                !messageBtn.contains(event.target)) {
                closeMessageSelection();
            }
        }
    }
    
    /**
     * Get or create user ID
     * @returns {string} User ID
     */
    function getUserId() {
        let userId = localStorage.getItem('userId');
        if (!userId) {
            userId = 'guest_' + Math.random().toString(36).substring(7);
            localStorage.setItem('userId', userId);
        }
        return userId;
    }
    
    /**
     * Delay helper
     * @param {number} ms - Milliseconds to delay
     * @returns {Promise}
     */
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Update configuration
     * @param {Object} newConfig - New configuration options
     */
    function updateConfig(newConfig) {
        if (newConfig.chatbot) {
            CONFIG.chatbot = { ...CONFIG.chatbot, ...newConfig.chatbot };
        }
        if (newConfig.whatsapp) {
            CONFIG.whatsapp = { ...CONFIG.whatsapp, ...newConfig.whatsapp };
        }
        if (newConfig.messenger) {
            CONFIG.messenger = { ...CONFIG.messenger, ...newConfig.messenger };
        }
        if (newConfig.badge) {
            CONFIG.badge = { ...CONFIG.badge, ...newConfig.badge };
            updateBadge();
        }
        
        console.log('✅ Configuration updated:', CONFIG);
    }
    
    /**
     * Update badge count
     */
    function updateBadge() {
        const badge = document.querySelector('.message-badge');
        if (badge) {
            if (CONFIG.badge.show) {
                badge.textContent = CONFIG.badge.count;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    }
    
    // ========================================
    // PUBLIC API
    // ========================================
    
    // Expose public API
    window.MessagingSystem = {
        init: init,
        updateConfig: updateConfig,
        openMessageSelection: openMessageSelection,
        closeMessageSelection: closeMessageSelection,
        openAIAssistant: openAIAssistant,
        openWhatsApp: openWhatsApp,
        openMessenger: openMessenger,
        backToSelection: backToSelection,
        closeChatbot: closeChatbot,
        getConfig: () => ({ ...CONFIG })
    };
    
    // Make functions globally available for onclick handlers
    window.openMessageSelection = openMessageSelection;
    window.closeMessageSelection = closeMessageSelection;
    window.openAIAssistant = openAIAssistant;
    window.openWhatsApp = openWhatsApp;
    window.openMessenger = openMessenger;
    window.backToSelection = backToSelection;
    window.closeChatbot = closeChatbot;
    
    // Auto-initialize
    init();
    
    console.log('💬 Polashtoli Messaging System Loaded');
    
})();
