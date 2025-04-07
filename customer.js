let customers = [];
let editingIndex = -1;

document.addEventListener('DOMContentLoaded', function() {
    loadCustomersFromLocalStorage();
});

document.getElementById('customerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('customerName').value.trim();
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    const contactNumber = document.getElementById('placeholder').value.trim();

    if (name === '' || email === '' || address === '' || contactNumber === '') {
        alert('Please fill in all fields');
        return;
    }

    const formButton = document.querySelector('#addCustomerButton');
    if (editingIndex === -1) {
        addCustomer({ name, email, address, contactNumber });
    } else {
        updateCustomer(editingIndex, { name, email, address, contactNumber });
        formButton.innerText = 'Register';
        editingIndex = -1;
    }

    document.getElementById('customerForm').reset();
});

function addCustomer(customer) {
    customers.push(customer);
    saveCustomersToLocalStorage();
    addCustomerToTable(customer, customers.length - 1);
}

function updateCustomer(index, updatedCustomer) {
    customers[index] = updatedCustomer;
    saveCustomersToLocalStorage();
    updateCustomerInTable(index, updatedCustomer);
}

function addCustomerToTable(customer, index) {
    const tableBody = document.querySelector('#customerTable tbody');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td class="px-2 py-2">${customer.name}</td>
        <td class="px-2 py-2">${customer.email}</td>
        <td class="px-2 py-2">${customer.address}</td>
        <td class="px-2 py-2">${customer.contactNumber}</td>
        <td class="px-2 py-2 flex space-x-2">
            <button onclick="editCustomer(${index})" class="py-1 px-3 text-xs text-white bg-gradient-to-r from-gray-400 to-gray-600 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-blue-200 rounded-lg">
                Edit
            </button>
            
            <button onclick="deleteCustomer(${index})" class="py-1 px-3 text-xs text-white bg-gradient-to-r from-gray-400 to-gray-600 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-red-200 rounded-lg">
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
    row.cells[3].innerText = customer.contactNumber;
}

function deleteCustomer(index) {
    customers.splice(index, 1);
    saveCustomersToLocalStorage();
    refreshTable();
}

function editCustomer(index) {
    const customer = customers[index];
    document.getElementById('customerName').value = customer.name;
    document.getElementById('email').value = customer.email;
    document.getElementById('address').value = customer.address;
    document.getElementById('placeholder').value = customer.contactNumber;

    document.querySelector('#addCustomerButton').innerText = 'Update Customer';
    editingIndex = index;
}

function searchCustomer() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const tableRows = document.querySelectorAll('#customerTable tbody tr');

    tableRows.forEach((row) => {
        const name = row.cells[0].innerText.toLowerCase();
        if (name.includes(searchInput)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function refreshTable() {
    const tableBody = document.querySelector('#customerTable tbody');
    tableBody.innerHTML = '';
    customers.forEach((customer, index) => {
        addCustomerToTable(customer, index);
    });
}

function saveCustomersToLocalStorage() {
    localStorage.setItem('customers', JSON.stringify(customers));
}

function loadCustomersFromLocalStorage() {
    const storedCustomers = localStorage.getItem('customers');
    if (storedCustomers) {
        customers = JSON.parse(storedCustomers);
        refreshTable();
    }
}