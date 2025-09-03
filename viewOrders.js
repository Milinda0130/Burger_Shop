// API Base URL
const API_BASE_URL = 'http://localhost:8080/orders';

document.addEventListener("DOMContentLoaded", () => {
    loadOrdersFromAPI();
});

// Load orders from API
async function loadOrdersFromAPI() {
    try {
        const response = await fetch(API_BASE_URL);
        if (response.ok) {
            const orders = await response.json();
            renderOrders(orders);
        } else {
            showAlert('Failed to load orders', 'error');
        }
    } catch (error) {
        console.error('Error loading orders:', error);
        showAlert('Error loading orders', 'error');
        // Fallback to sessionStorage if API fails
        const fallbackOrders = JSON.parse(sessionStorage.getItem("orders")) || [];
        renderOrders(fallbackOrders);
    }
}

function renderOrders(orders) {
    const orderTableBody = document.getElementById("orderTableBody");
    if (!orderTableBody) return;

    orderTableBody.innerHTML = "";

    if (orders.length === 0) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td colspan="6" class="text-center py-4 text-gray-500">
                No orders found. Start by placing an order from the main menu!
            </td>
        `;
        orderTableBody.appendChild(row);
        return;
    }

    orders.forEach((order, index) => {
        const row = document.createElement("tr");
        row.className = 'hover:bg-gray-50 dark:hover:bg-gray-700';

        const itemsList = order.items && Array.isArray(order.items)
            ? order.items.map(item => {
                const quantity = Number(item.quantity) || 0;
                const price = Number(item.price) || 0;
                return `<li class="mb-1">${item.name} (x${quantity}) - Rs.${(price * quantity).toFixed(2)}</li>`;
            }).join("")
            : "<li>No items</li>";

        const discount = Number(order.discount) || 0;
        const totalPrice = Number(order.totalPrice) || 0;

        row.innerHTML = `
            <td class="px-4 py-2">${order.orderID || index + 1}</td>
            <td class="px-4 py-2">${order.customerName || "N/A"}</td>
            <td class="px-4 py-2">${order.contactNumber || "N/A"}</td>
            <td class="px-4 py-2">
                <ul class="list-disc list-inside text-sm">${itemsList}</ul>
            </td>
            <td class="px-4 py-2">Rs.${discount.toFixed(2)}</td>
            <td class="px-4 py-2 font-semibold">Rs.${totalPrice.toFixed(2)}</td>
            <td class="px-4 py-2">
                <button onclick="deleteOrder(${order.orderID || index})" 
                        class="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5">
                    Delete
                </button>
            </td>
        `;

        orderTableBody.appendChild(row);
    });

    attachPrintListeners();
}

// Delete order
async function deleteOrder(orderId) {
    if (confirm('Are you sure you want to delete this order?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/${orderId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                showAlert('Order deleted successfully!', 'success');
                loadOrdersFromAPI(); // Reload orders
            } else {
                showAlert('Failed to delete order', 'error');
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            showAlert('Error deleting order', 'error');
        }
    }
}

// Search orders by customer name
async function searchOrders() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const customerName = searchInput.value.trim();
    
    if (customerName === '') {
        loadOrdersFromAPI();
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/customer?customerName=${encodeURIComponent(customerName)}`);
        if (response.ok) {
            const orders = await response.json();
            renderOrders(orders);
        } else {
            showAlert('Search failed', 'error');
        }
    } catch (error) {
        console.error('Error searching orders:', error);
        showAlert('Error searching orders', 'error');
    }
}

function attachPrintListeners() {
    document.querySelectorAll("button[data-index]").forEach(button => {
        button.addEventListener("click", () => {
            const index = parseInt(button.getAttribute("data-index"));
            printOrder(index);
        });
    });
}

// Show alert function
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    // Add styles
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    if (type === 'success') {
        alertDiv.style.backgroundColor = '#10b981';
    } else if (type === 'error') {
        alertDiv.style.backgroundColor = '#ef4444';
    }
    
    document.body.appendChild(alertDiv);
    
    // Remove alert after 3 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 3000);
}

// Add CSS animation
if (!document.getElementById('alert-styles')) {
    const style = document.createElement('style');
    style.id = 'alert-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}
