// Store items in an array
let items = [];
let editingIndex = -1;

// API Base URL
const API_BASE_URL = 'http://localhost:8080/items';

// Load items when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    loadItemsFromAPI();
    
    // Set up form submission listener
    document.querySelector('form').addEventListener('submit', handleFormSubmit);
    
    // Set up search functionality if a search input exists
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', searchItem);
    }
});

// Load items from API
async function loadItemsFromAPI() {
    try {
        const response = await fetch(API_BASE_URL);
        if (response.ok) {
            items = await response.json();
            refreshTable();
        } else {
            showAlert('Failed to load items', 'error');
        }
    } catch (error) {
        console.error('Error loading items:', error);
        showAlert('Error loading items', 'error');
    }
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();

    const itemno = document.getElementById('itemno').value.trim();
    const itemtype = document.getElementById('itemtype').value.trim();
    const name = document.getElementById('name').value.trim();
    const price = document.getElementById('price').value.trim();
    const image = document.getElementById('image').files[0];

    if (itemno === '' || itemtype === '' || name === '' || price === '' || !image) {
        showAlert('Please fill in all fields and select an image', 'error');
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = async function() {
        const imageUrl = reader.result;
        
        const itemData = {
            itemno: parseInt(itemno),
            itemtype: itemtype,
            name: name,
            price: parseFloat(price),
            imageUrl: imageUrl
        };
        
        if (editingIndex === -1) {
            await addItem(itemData);
        } else {
            await updateItem(editingIndex, itemData);
            document.querySelector('form button').innerText = 'Add Item';
            editingIndex = -1;
        }

        document.querySelector('form').reset();
    };
}

// Add a new item
async function addItem(item) {
    try {
        const response = await fetch(`${API_BASE_URL}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item)
        });

        if (response.ok) {
            const savedItem = await response.json();
            items.push(savedItem);
            addItemToTable(savedItem, items.length - 1);
            showAlert('Item added successfully!', 'success');
            updateMenuPage();
        } else {
            showAlert('Failed to add item', 'error');
        }
    } catch (error) {
        console.error('Error adding item:', error);
        showAlert('Error adding item', 'error');
    }
}

// Update an existing item
async function updateItem(index, updatedItem) {
    try {
        const item = items[index];
        const response = await fetch(`${API_BASE_URL}/${item.itemno}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedItem)
        });

        if (response.ok) {
            const savedItem = await response.json();
            items[index] = savedItem;
            refreshTable();
            showAlert('Item updated successfully!', 'success');
            updateMenuPage();
        } else {
            showAlert('Failed to update item', 'error');
        }
    } catch (error) {
        console.error('Error updating item:', error);
        showAlert('Error updating item', 'error');
    }
}

// Add item to the table
function addItemToTable(item, index) {
    const tableBody = document.querySelector('table tbody');
    const row = document.createElement('tr');
    row.className = 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600';

    row.innerHTML = `
        <td class="px-2 py-2">${item.itemno}</td>
        <td class="px-2 py-2">${item.itemtype}</td>
        <td class="px-2 py-2">${item.name}</td>
        <td class="px-2 py-2">${item.price}</td>
        <td class="px-2 py-2"><img src="${item.imageUrl}" alt="${item.name}" class="w-16 h-16 object-cover rounded"></td>
        <td class="px-2 py-2">
            <button onclick="editItem(${index})"  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-1.5 me-2 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-white-800">
                Edit
            </button>
            <button onclick="deleteItem(${index})" class="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-xs px-3 py-1.5 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-white-800">
                Delete
            </button>
        </td>
    `;

    tableBody.appendChild(row);
}

// Fill the form fields for editing
function editItem(index) {
    const item = items[index];
    document.getElementById('itemno').value = item.itemno;
    document.getElementById('itemtype').value = item.itemtype;
    document.getElementById('name').value = item.name;
    document.getElementById('price').value = item.price;
    document.querySelector('form button').innerText = 'Update Item';
    editingIndex = index;
    
    // Scroll to the form
    document.querySelector('form').scrollIntoView({ behavior: 'smooth' });
}

// Custom confirm dialog
function customConfirm(message) {
    return new Promise((resolve) => {
        // Get elements
        const overlay = document.getElementById('customConfirmOverlay');
        const confirmMessage = overlay.querySelector('.custom-confirm-message');
        const confirmBtn = document.getElementById('customConfirmDelete');
        const cancelBtn = document.getElementById('customConfirmCancel');
        
        // Set message
        confirmMessage.textContent = message || 'Are you sure you want to delete this item? This action cannot be undone.';
        
        // Show the overlay
        overlay.classList.add('active');
        
        // Set up event handlers
        confirmBtn.onclick = () => {
            overlay.classList.remove('active');
            resolve(true);
        };
        
        cancelBtn.onclick = () => {
            overlay.classList.remove('active');
            resolve(false);
        };
    });
}

// Delete an item
async function deleteItem(index) {
    const confirmed = await customConfirm('Are you sure you want to delete this item?');
    if (confirmed) {
        try {
            const item = items[index];
            const response = await fetch(`${API_BASE_URL}/${item.itemno}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                items.splice(index, 1);
                refreshTable();
                showAlert('Item deleted successfully!', 'success');
                updateMenuPage();
            } else {
                showAlert('Failed to delete item', 'error');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            showAlert('Error deleting item', 'error');
        }
    }
}

// Refresh the entire table
function refreshTable() {
    const tableBody = document.querySelector('table tbody');
    tableBody.innerHTML = '';
    items.forEach((item, index) => addItemToTable(item, index));
}

// Search functionality
function searchItem() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const tableRows = document.querySelectorAll('table tbody tr');

    tableRows.forEach((row) => {
        const name = row.cells[2].innerText.toLowerCase();
        const itemNo = row.cells[0].innerText.toLowerCase();
        const itemType = row.cells[1].innerText.toLowerCase();
        
        if (name.includes(searchInput) || itemNo.includes(searchInput) || itemType.includes(searchInput)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Update menu page - placeholder function to maintain compatibility
function updateMenuPage() {
    console.log('Menu page updated');
    // This function would typically update the menu page if needed
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