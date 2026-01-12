// Orders Page JavaScript

let allOrders = [];

document.addEventListener('DOMContentLoaded', function() {
    loadOrders();
});

// Load orders
function loadOrders() {
    allOrders = JSON.parse(localStorage.getItem('orders')) || [];
    displayOrders(allOrders);
}

// Display orders
function displayOrders(orders) {
    const container = document.getElementById('ordersList');
    
    if (orders.length === 0) {
        container.innerHTML = `
            <div class="card">
                <div class="card-body text-center py-5">
                    <i class="bi bi-bag-x" style="font-size: 4rem; color: #ccc;"></i>
                    <h4 class="mt-3">No orders yet</h4>
                    <p class="text-muted">Start shopping to see your orders here</p>
                    <a href="products.html" class="btn btn-primary">Browse Products</a>
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = orders.map(order => `
        <div class="card mb-3">
            <div class="card-header bg-light">
                <div class="row align-items-center">
                    <div class="col-md-3">
                        <strong>Order #${order.id}</strong><br>
                        <small class="text-muted">${new Date(order.date).toLocaleDateString()}</small>
                    </div>
                    <div class="col-md-3">
                        <small class="text-muted">Total:</small><br>
                        <strong>৳${order.total.toFixed(2)}</strong>
                    </div>
                    <div class="col-md-3">
                        <span class="badge bg-${getStatusColor(order.status)}">${order.status}</span>
                    </div>
                    <div class="col-md-3 text-end">
                        <button class="btn btn-sm btn-primary" onclick="viewOrderDetails(${order.id})">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="row">
                    ${order.items.slice(0, 3).map(item => `
                        <div class="col-md-4">
                            <div class="d-flex align-items-center mb-2">
                                <img src="${item.image || 'https://via.placeholder.com/50'}" 
                                     class="rounded me-2" style="width: 50px; height: 50px; object-fit: cover;">
                                <div>
                                    <small><strong>${item.name}</strong></small><br>
                                    <small class="text-muted">Qty: ${item.quantity || 1}</small>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                    ${order.items.length > 3 ? `<div class="col-md-12"><small class="text-muted">+${order.items.length - 3} more items</small></div>` : ''}
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

// View order details
function viewOrderDetails(orderId) {
    const order = allOrders.find(o => o.id == orderId);
    
    if (!order) return;
    
    const modalContent = document.getElementById('orderDetailsContent');
    modalContent.innerHTML = `
        <div class="row mb-4">
            <div class="col-md-6">
                <h6>Order Information</h6>
                <p class="mb-1"><strong>Order ID:</strong> #${order.id}</p>
                <p class="mb-1"><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
                <p class="mb-1"><strong>Status:</strong> <span class="badge bg-${getStatusColor(order.status)}">${order.status}</span></p>
                <p class="mb-1"><strong>Payment:</strong> ${order.paymentMethod || 'Cash on Delivery'}</p>
            </div>
            <div class="col-md-6">
                <h6>Delivery Address</h6>
                <p class="mb-1">${order.firstName} ${order.lastName}</p>
                <p class="mb-1">${order.address}</p>
                <p class="mb-1">${order.city}, ${order.division}</p>
                <p class="mb-1">${order.postalCode}</p>
                <p class="mb-1"><strong>Phone:</strong> ${order.phone}</p>
            </div>
        </div>
        
        <h6>Order Items</h6>
        <table class="table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${order.items.map(item => `
                    <tr>
                        <td>
                            <div class="d-flex align-items-center">
                                <img src="${item.image || 'https://via.placeholder.com/50'}" 
                                     class="rounded me-2" style="width: 50px; height: 50px; object-fit: cover;">
                                <span>${item.name}</span>
                            </div>
                        </td>
                        <td>৳${item.price}</td>
                        <td>${item.quantity || 1}</td>
                        <td>৳${(item.price * (item.quantity || 1)).toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="3" class="text-end"><strong>Total:</strong></td>
                    <td><strong>৳${order.total.toFixed(2)}</strong></td>
                </tr>
            </tfoot>
        </table>
        
        ${order.orderNotes ? `<p><strong>Order Notes:</strong> ${order.orderNotes}</p>` : ''}
        
        <div class="mt-4">
            <button class="btn btn-primary" onclick="downloadInvoice(${order.id})">
                <i class="bi bi-download me-2"></i>Download Invoice
            </button>
            ${order.status === 'Pending' ? `
                <button class="btn btn-danger ms-2" onclick="cancelOrder(${order.id})">
                    <i class="bi bi-x-circle me-2"></i>Cancel Order
                </button>
            ` : ''}
        </div>
    `;
    
    new bootstrap.Modal(document.getElementById('orderDetailsModal')).show();
}

// Filter orders
function filterOrders() {
    const statusFilter = document.getElementById('statusFilter').value;
    const dateFilter = parseInt(document.getElementById('dateFilter').value);
    
    let filtered = [...allOrders];
    
    // Filter by status
    if (statusFilter) {
        filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Filter by date
    if (dateFilter) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - dateFilter);
        filtered = filtered.filter(order => new Date(order.date) >= cutoffDate);
    }
    
    displayOrders(filtered);
}

// Clear filters
function clearFilters() {
    document.getElementById('statusFilter').value = '';
    document.getElementById('dateFilter').value = '';
    displayOrders(allOrders);
}

// Download invoice
function downloadInvoice(orderId) {
    showNotification('Invoice download coming soon!', 'info');
}

// Cancel order
function cancelOrder(orderId) {
    if (confirm('Are you sure you want to cancel this order?')) {
        const orderIndex = allOrders.findIndex(o => o.id == orderId);
        if (orderIndex !== -1) {
            allOrders[orderIndex].status = 'Cancelled';
            localStorage.setItem('orders', JSON.stringify(allOrders));
            loadOrders();
            showNotification('Order cancelled successfully', 'info');
            bootstrap.Modal.getInstance(document.getElementById('orderDetailsModal')).hide();
        }
    }
}
