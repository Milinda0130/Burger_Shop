let customers = [];
let editingIndex = -1;

// API Base URL
const API_BASE_URL = 'http://localhost:8080/customer';

document.addEventListener('DOMContentLoaded', function() {
    loadCustomersFromAPI();
});

document.getElementById('customerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('customerName').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    const contactNumber = document.getElementById('placeholder').value.trim();

    if (name === '' || email === '' || address === '' || contactNumber === '') {
        showAlert('Please fill in all fields', 'error');
        return;
    }

    const customerData = { name, email, address, contact: contactNumber };

    const formButton = document.querySelector('#addCustomerButton');
    if (editingIndex === -1) {
        addCustomer(customerData);
    } else {
        updateCustomer(editingIndex, customerData);
        formButton.innerText = 'Register';
        editingIndex = -1;
    }

    document.getElementById('customerForm').reset();
});

async function addCustomer(customer) {
    try {
        const response = await fetch(`${API_BASE_URL}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(customer)
        });

        if (response.ok) {
            const savedCustomer = await response.json();
            customers.push(savedCustomer);
            addCustomerToTable(savedCustomer, customers.length - 1);
            showAlert('Customer added successfully!', 'success');
        } else if (response.status === 409) {
            showAlert('Customer already exists with this email!', 'error');
        } else {
            showAlert('Failed to add customer', 'error');
        }
    } catch (error) {
        console.error('Error adding customer:', error);
        showAlert('Error adding customer', 'error');
    }
}

async function updateCustomer(id, updatedCustomer) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCustomer)
        });

        if (response.ok) {
            const savedCustomer = await response.json();
            const index = customers.findIndex(c => c.id === id);
            if (index !== -1) {
                customers[index] = savedCustomer;
                updateCustomerInTable(index, savedCustomer);
                showAlert('Customer updated successfully!', 'success');
            }
        } else if (response.status === 409) {
            showAlert('Email already exists!', 'error');
        } else {
            showAlert('Failed to update customer', 'error');
        }
    } catch (error) {
        console.error('Error updating customer:', error);
        showAlert('Error updating customer', 'error');
    }
}

function addCustomerToTable(customer, index) {
    const tableBody = document.querySelector('#customerTable tbody');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td class="px-2 py-2">${customer.name}</td>
        <td class="px-2 py-2">${customer.email}</td>
        <td class="px-2 py-2">${customer.address}</td>
        <td class="px-2 py-2">${customer.contact}</td>
        <td class="px-2 py-2 flex space-x-2">
            <button onclick="editCustomer(${customer.id})" class="py-1 px-3 text-xs text-white bg-gradient-to-r from-gray-400 to-gray-600 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-blue-200 rounded-lg">
                Edit
            </button>
            
            <button onclick="deleteCustomer(${customer.id})" class="py-1 px-3 text-xs text-white bg-gradient-to-r from-gray-400 to-gray-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-200 rounded-lg">
                Delete
            </button>
        </td>
    `;

    tableBody.appendChild(row);
}

function updateCustomerInTable(index, customer) {
    const tableBody = document.querySelector('#customerTable tbody');
    const row = tableBody.rows[index];

    row.cells[0].innerText = customer.name;
    row.cells[1].innerText = customer.email;
    row.cells[2].innerText = customer.address;
    row.cells[3].innerText = customer.contact;
}

async function deleteCustomer(id) {
    if (confirm('Are you sure you want to delete this customer?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                const index = customers.findIndex(c => c.id === id);
                if (index !== -1) {
                    customers.splice(index, 1);
                    refreshTable();
                    showAlert('Customer deleted successfully!', 'success');
                }
            } else {
                showAlert('Failed to delete customer', 'error');
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
            showAlert('Error deleting customer', 'error');
        }
    }
}

function editCustomer(id) {
    const customer = customers.find(c => c.id === id);
    if (customer) {
        document.getElementById('customerName').value = customer.name;
        document.getElementById('email').value = customer.email;
        document.getElementById('address').value = customer.address;
        document.getElementById('placeholder').value = customer.contact;

        document.querySelector('#addCustomerButton').innerText = 'Update Customer';
        editingIndex = id;
    }
}

async function searchCustomer() {
    const searchInput = document.getElementById('searchInput').value.trim();
    
    if (searchInput === '') {
        refreshTable();
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/search?name=${encodeURIComponent(searchInput)}`);
        if (response.ok) {
            const searchResults = await response.json();
            displaySearchResults(searchResults);
        } else {
            showAlert('Search failed', 'error');
        }
    } catch (error) {
        console.error('Error searching customers:', error);
        showAlert('Error searching customers', 'error');
    }
}

function displaySearchResults(searchResults) {
    const tableBody = document.querySelector('#customerTable tbody');
    tableBody.innerHTML = '';
    
    searchResults.forEach((customer, index) => {
        addCustomerToTable(customer, index);
    });
}

function refreshTable() {
    const tableBody = document.querySelector('#customerTable tbody');
    tableBody.innerHTML = '';
    customers.forEach((customer, index) => {
        addCustomerToTable(customer, index);
    });
}

async function loadCustomersFromAPI() {
    try {
        const response = await fetch(API_BASE_URL);
        if (response.ok) {
            customers = await response.json();
            refreshTable();
        } else {
            showAlert('Failed to load customers', 'error');
        }
    } catch (error) {
        console.error('Error loading customers:', error);
        showAlert('Error loading customers', 'error');
    }
}

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