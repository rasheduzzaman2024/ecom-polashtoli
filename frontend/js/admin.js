// Admin Dashboard JavaScript

// Demo Data (Replace with API calls)
const adminData = {
    stats: {
        totalSales: 891000,
        salesChange: 12.5,
        totalOrders: 1547,
        ordersChange: 8.2,
        totalCustomers: 3245,
        customersChange: 15.3,
        totalRevenue: 921000,
        revenueChange: 18.7
    },
    recentOrders: [
        {
            id: 'ORD-2024-1547',
            customer: 'Rafiq Ahmed',
            date: '2026-01-05',
            total: 8500,
            status: 'delivered',
            payment: 'paid'
        },
        {
            id: 'ORD-2024-1546',
            customer: 'Fatima Khan',
            date: '2026-01-05',
            total: 12300,
            status: 'processing',
            payment: 'paid'
        },
        {
            id: 'ORD-2024-1545',
            customer: 'Karim Hassan',
            date: '2026-01-04',
            total: 5600,
            status: 'shipped',
            payment: 'paid'
        },
        {
            id: 'ORD-2024-1544',
            customer: 'Nadia Rahman',
            date: '2026-01-04',
            total: 15800,
            status: 'pending',
            payment: 'pending'
        },
        {
            id: 'ORD-2024-1543',
            customer: 'Jabir Ali',
            date: '2026-01-03',
            total: 9200,
            status: 'delivered',
            payment: 'paid'
        },
        {
            id: 'ORD-2024-1542',
            customer: 'Sadia Islam',
            date: '2026-01-03',
            total: 7400,
            status: 'cancelled',
            payment: 'refunded'
        },
        {
            id: 'ORD-2024-1541',
            customer: 'Habib Mia',
            date: '2026-01-02',
            total: 18600,
            status: 'delivered',
            payment: 'paid'
        },
        {
            id: 'ORD-2024-1540',
            customer: 'Amina Begum',
            date: '2026-01-02',
            total: 6700,
            status: 'processing',
            payment: 'paid'
        }
    ]
};

// Initialize Dashboard
function initDashboard() {
    loadStats();
    loadRecentOrders();
    initSidebarToggle();
    initRealTimeUpdates();
}

// Load Statistics
function loadStats() {
    const stats = adminData.stats;
    
    // Update stat values
    document.getElementById('totalSales').textContent = '৳' + stats.totalSales.toLocaleString();
    document.getElementById('salesChange').textContent = '+' + stats.salesChange + '%';
    
    document.getElementById('totalOrders').textContent = stats.totalOrders.toLocaleString();
    document.getElementById('ordersChange').textContent = '+' + stats.ordersChange + '%';
    
    document.getElementById('totalCustomers').textContent = stats.totalCustomers.toLocaleString();
    document.getElementById('customersChange').textContent = '+' + stats.customersChange + '%';
    
    document.getElementById('totalRevenue').textContent = '৳' + stats.totalRevenue.toLocaleString();
    document.getElementById('revenueChange').textContent = '+' + stats.revenueChange + '%';
    
    // Animate counters
    animateCounters();
}

// Animate Counter Numbers
function animateCounters() {
    const counters = document.querySelectorAll('.admin-stat-value');
    
    counters.forEach(counter => {
        const target = counter.textContent;
        const numericValue = parseInt(target.replace(/[^0-9]/g, ''));
        const prefix = target.match(/[^\d]/)?.[0] || '';
        const duration = 2000;
        const steps = 60;
        const increment = numericValue / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= numericValue) {
                counter.textContent = prefix + numericValue.toLocaleString();
                clearInterval(timer);
            } else {
                counter.textContent = prefix + Math.floor(current).toLocaleString();
            }
        }, duration / steps);
    });
}

// Load Recent Orders
function loadRecentOrders() {
    const tbody = document.getElementById('recentOrdersTable');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    adminData.recentOrders.forEach(order => {
        const row = createOrderRow(order);
        tbody.appendChild(row);
    });
}

// Create Order Row
function createOrderRow(order) {
    const tr = document.createElement('tr');
    
    // Status badge class
    const statusClass = {
        'delivered': 'success',
        'processing': 'info',
        'shipped': 'warning',
        'pending': 'warning',
        'cancelled': 'danger'
    }[order.status] || 'info';
    
    // Payment badge class
    const paymentClass = {
        'paid': 'success',
        'pending': 'warning',
        'refunded': 'danger',
        'failed': 'danger'
    }[order.payment] || 'warning';
    
    tr.innerHTML = `
        <td><strong>${order.id}</strong></td>
        <td>${order.customer}</td>
        <td>${formatDate(order.date)}</td>
        <td><strong>৳${order.total.toLocaleString()}</strong></td>
        <td><span class="admin-badge ${statusClass}">${capitalizeFirst(order.status)}</span></td>
        <td><span class="admin-badge ${paymentClass}">${capitalizeFirst(order.payment)}</span></td>
        <td>
            <button class="admin-btn-icon" onclick="viewOrder('${order.id}')" title="View">
                <i class="bi bi-eye"></i>
            </button>
            <button class="admin-btn-icon" onclick="editOrder('${order.id}')" title="Edit">
                <i class="bi bi-pencil"></i>
            </button>
        </td>
    `;
    
    return tr;
}

// Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Capitalize First Letter
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Sidebar Toggle for Mobile
function initSidebarToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('adminSidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }
}

// View Order Details
function viewOrder(orderId) {
    const order = adminData.recentOrders.find(o => o.id === orderId);
    if (order) {
        alert('View Order: ' + orderId + '\n\nCustomer: ' + order.customer + '\nTotal: ৳' + order.total.toLocaleString() + '\nStatus: ' + order.status);
        // TODO: Open modal or navigate to order details page
    }
}

// Edit Order
function editOrder(orderId) {
    alert('Edit Order: ' + orderId);
    // TODO: Open edit form or navigate to edit page
}

// Real-time Updates Simulation
function initRealTimeUpdates() {
    // Simulate real-time order updates every 30 seconds
    setInterval(() => {
        // Update order count badge
        const orderBadge = document.querySelector('.admin-nav-item[href="orders.html"] .admin-nav-badge');
        if (orderBadge) {
            const currentCount = parseInt(orderBadge.textContent);
            // Random chance of new order
            if (Math.random() > 0.7) {
                orderBadge.textContent = currentCount + 1;
                showNotification('New order received!');
            }
        }
    }, 30000);
}

// Show Notification
function showNotification(message) {
    const notificationBadge = document.querySelector('.admin-notification-badge');
    if (notificationBadge) {
        const currentCount = parseInt(notificationBadge.textContent);
        notificationBadge.textContent = currentCount + 1;
    }
    
    // Optional: Show toast notification
    console.log('Notification:', message);
}

// Export Stats (CSV)
function exportStats() {
    const stats = adminData.stats;
    const csv = 'Metric,Value\n' +
                'Total Sales,৳' + stats.totalSales + '\n' +
                'Total Orders,' + stats.totalOrders + '\n' +
                'Total Customers,' + stats.totalCustomers + '\n' +
                'Total Revenue,৳' + stats.totalRevenue;
    
    downloadCSV(csv, 'admin-stats.csv');
}

// Export Orders (CSV)
function exportOrders() {
    let csv = 'Order ID,Customer,Date,Total,Status,Payment\n';
    
    adminData.recentOrders.forEach(order => {
        csv += `${order.id},${order.customer},${order.date},৳${order.total},${order.status},${order.payment}\n`;
    });
    
    downloadCSV(csv, 'recent-orders.csv');
}

// Download CSV Helper
function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
});

// Export functions for global use
window.adminDashboard = {
    viewOrder: viewOrder,
    editOrder: editOrder,
    exportStats: exportStats,
    exportOrders: exportOrders,
    loadStats: loadStats,
    loadRecentOrders: loadRecentOrders
};
