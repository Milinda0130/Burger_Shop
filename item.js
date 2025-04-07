// Store items in an array
let items = [];
let editingIndex = -1;

// Load items when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    loadItemsFromLocalStorage();
    
    // If no items found in localStorage, try loading from JSON
    if (!items.length) {
        loadItemsFromJSON();
    }
    
    // Set up form submission listener
    document.querySelector('form').addEventListener('submit', handleFormSubmit);
    
    // Set up search functionality if a search input exists
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', searchItem);
    }
});

// Load items from JSON file
function loadItemsFromJSON() {
    fetch('items.json')
        .then(response => response.json())
        .then(data => {
            if (!localStorage.getItem('items')) {
                items = data;
                refreshTable();
                saveItemsToLocalStorage();
            }
        })
        .catch(error => console.error('Error loading items:', error));
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();

    const itemno = document.getElementById('itemno').value.trim();
    const itemtype = document.getElementById('itemtype').value.trim();
    const name = document.getElementById('name').value.trim();
    // Fix: Use id 'price' to get the price input
    const price = document.getElementById('price').value.trim();
        const image = document.getElementById('image').files[0];

    if (itemno === '' || itemtype === '' || name === '' || price === '' || !image) {
        alert('Please fill in all fields and select an image');
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = function() {
        const imageUrl = reader.result;
        
        if (editingIndex === -1) {
            addItem({ itemno, itemtype, name, price, imageUrl });
        } else {
            updateItem(editingIndex, { itemno, itemtype, name, price, imageUrl });
            document.querySelector('form button').innerText = 'Register';
            editingIndex = -1;
        }

        document.querySelector('form').reset();
    };
}

// Add a new item
function addItem(item) {
    items.push(item);
    addItemToTable(item, items.length - 1);
    saveItemsToLocalStorage();
    updateMenuPage();
}

// Update an existing item
function updateItem(index, updatedItem) {
    items[index] = updatedItem;
    refreshTable(); // Refresh the entire table to ensure correct display
    saveItemsToLocalStorage();
    updateMenuPage();
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
            <button onclick="deleteItem(${index})"data-modal-target="popup-modal" data-modal-toggle="popup-modal" class="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-xs px-3 py-1.5 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-white-800">
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
const price = document.getElementById('price').value.trim();
    document.querySelector('form button').innerText = 'Update Item';
    editingIndex = index;
    
    // Scroll to the form
    document.querySelector('form').scrollIntoView({ behavior: 'smooth' });
}

// Delete an item

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

// Modified deleteItem function to use the custom confirm
async function deleteItem(index) {
    const confirmed = await customConfirm('Are you sure you want to delete this item?');
    if (confirmed) {
        items.splice(index, 1);
        refreshTable();
        saveItemsToLocalStorage();
        updateMenuPage();
    }
}

// Refresh the entire table
function refreshTable() {
    const tableBody = document.querySelector('table tbody');
    tableBody.innerHTML = '';
    items.forEach((item, index) => addItemToTable(item, index));
}

// Save items to localStorage
function saveItemsToLocalStorage() {
    localStorage.setItem('items', JSON.stringify(items));
}

// Load items from localStorage
function loadItemsFromLocalStorage() {
    const storedItems = localStorage.getItem('items');
    if (storedItems) {
        items = JSON.parse(storedItems);
        refreshTable();
    }
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

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, setting up event listeners');
    loadItemsFromLocalStorage();
    
    // If no items found in localStorage, try loading from JSON
    if (!items.length) {
        loadItemsFromJSON();
    }
    
    // Set up form submission listener
    const form = document.querySelector('form');
    form.addEventListener('submit', handleFormSubmit);
    console.log('Form submission listener added', form);
    
    // Rest of your code...
});