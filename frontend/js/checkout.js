// Checkout Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Check if cart has items
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        alert('Your cart is empty!');
        window.location.href = 'cart.html';
        return;
    }
    
    loadOrderSummary();
    
    // Payment method change
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'card') {
                document.getElementById('cardDetails').style.display = 'block';
            } else {
                document.getElementById('cardDetails').style.display = 'none';
            }
        });
    });
    
    // Form submission
    document.getElementById('checkoutForm').addEventListener('submit', handleCheckout);
});

// Load order summary
function loadOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('orderItems');
    
    container.innerHTML = cart.map(item => `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <div class="d-flex align-items-center">
                <img src="${item.image || 'https://via.placeholder.com/50'}" 
                     alt="${item.name}" class="rounded me-2" style="width: 50px; height: 50px; object-fit: cover;">
                <div>
                    <small><strong>${item.name}</strong></small><br>
                    <small class="text-muted">Qty: ${item.quantity || 1}</small>
                </div>
            </div>
            <span>৳${(item.price * (item.quantity || 1)).toFixed(2)}</span>
        </div>
    `).join('');
    
    // Calculate totals
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * (item.quantity || 1);
    });
    
    const shipping = subtotal >= 1000 ? 0 : 100;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;
    
    document.getElementById('summarySubtotal').textContent = `৳${subtotal.toFixed(2)}`;
    document.getElementById('summaryShipping').textContent = shipping === 0 ? 'FREE' : `৳${shipping.toFixed(2)}`;
    document.getElementById('summaryTax').textContent = `৳${tax.toFixed(2)}`;
    document.getElementById('summaryTotal').textContent = `৳${total.toFixed(2)}`;
}

// Handle checkout
async function handleCheckout(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        address2: document.getElementById('address2').value,
        city: document.getElementById('city').value,
        division: document.getElementById('division').value,
        postalCode: document.getElementById('postalCode').value,
        paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
        orderNotes: document.getElementById('orderNotes').value,
        items: JSON.parse(localStorage.getItem('cart')) || []
    };
    
    // Calculate total
    let subtotal = 0;
    formData.items.forEach(item => {
        subtotal += item.price * (item.quantity || 1);
    });
    const shipping = subtotal >= 1000 ? 0 : 100;
    const tax = subtotal * 0.05;
    formData.total = subtotal + shipping + tax;
    
    try {
        // Send order to backend
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            const order = await response.json();
            
            // Save order to localStorage
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push({
                id: order.id || Date.now(),
                date: new Date().toISOString(),
                total: formData.total,
                status: 'Pending',
                items: formData.items,
                ...formData
            });
            localStorage.setItem('orders', JSON.stringify(orders));
            
            // Clear cart
            localStorage.removeItem('cart');
            updateCartBadge();
            
            // Show success message
            showNotification('Order placed successfully!', 'success');
            
            // Redirect to success page
            setTimeout(() => {
                window.location.href = `order-success.html?orderId=${order.id || Date.now()}`;
            }, 1000);
        } else {
            throw new Error('Order submission failed');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        
        // For demo: still process order locally
        const orderId = Date.now();
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push({
            id: orderId,
            date: new Date().toISOString(),
            total: formData.total,
            status: 'Pending',
            items: formData.items,
            ...formData
        });
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Clear cart
        localStorage.removeItem('cart');
        updateCartBadge();
        
        // Show success
        alert('Order placed successfully! Order ID: ' + orderId);
        window.location.href = 'orders.html';
    }
}
