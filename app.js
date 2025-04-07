let itemlist = JSON.parse(localStorage.getItem("items")) || [];
let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
let customers = JSON.parse(localStorage.getItem("customers")) || [];
let orders = JSON.parse(sessionStorage.getItem("orders")) || [];

// Load items from JSON or localStorage
function loadItemsFromJSON() {
    return new Promise((resolve, reject) => {
        if (localStorage.getItem("items")) {
            itemlist = JSON.parse(localStorage.getItem("items"));
            resolve(itemlist);
        } else {
            fetch("/items.json")
                .then((response) => response.json())
                .then((data) => {
                    itemlist = data;
                    localStorage.setItem("items", JSON.stringify(itemlist));
                    resolve(itemlist);
                })
                .catch((error) => {
                    console.error("Error loading items:", error);
                    reject(error);
                });
        }
    });
}

// Render Menu Items
function loadItems(filteredItems = itemlist) {
    let items = document.getElementById("items");
    items.innerHTML = "";

    filteredItems.forEach((item, index) => {
        const itemCard = document.createElement("div");
        itemCard.classList.add("text-center", "bg-white", "dark:bg-gray-800", "rounded-2xl", "shadow-lg", "p-4", "transition-transform", "transform", "hover:scale-105", "flex", "flex-col", "h-full");
        itemCard.innerHTML = `
            <div class="text-center text-gray-500 dark:text-gray-400 flex-grow">
                <img class="imgitem mx-auto mb-4 w-42 h-42" src="${item.imageUrl}" alt="food items" style="border-radius: 10px;">
                <h3 class="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    <a href="#">${item.name}</a>
                </h3>
                <p>Rs.${item.price}</p>
            </div>
            <button class="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                onclick="addToCart(${index})">
                Add To Cart
            </button>
        `;
        items.appendChild(itemCard);
    });
}

// Filter Functions
function filterCategory(category) {
    let filteredItems = category === "All" ? itemlist : itemlist.filter(item => item.itemtype === category);
    loadItems(filteredItems);
}

function All() {
    
    let filteredItems = itemlist.filter(item => item.itemtype === "Burger" || item.itemtype === "Submarine" || item.itemtype === "Fries" || item.itemtype === "Pasta"|| item.itemtype === "Beverage"|| item.itemtype === "Chicken");
    catogaries.innerHTML= "Burger 🍔 Hub";

    loadItems(filteredItems);
}

function Burger() {
    let filteredItems = itemlist.filter(item => item.itemtype === "Burger");
    catogaries.innerHTML= "Burger";
    loadItems(filteredItems);
  }
function Submarine() {
    let filteredItems = itemlist.filter(item => item.itemtype === "Submarine");
    catogaries.innerHTML= "Submarine";

    loadItems(filteredItems);
  }
function Fries() {
    let filteredItems = itemlist.filter(item => item.itemtype === "Fries");
    catogaries.innerHTML= "Fries";

    loadItems(filteredItems);
  }
function Pasta() {
    let filteredItems = itemlist.filter(item => item.itemtype === "Pasta");
    catogaries.innerHTML= "Pasta";

    loadItems(filteredItems);
  }
function Beverage() {
    let filteredItems = itemlist.filter(item => item.itemtype === "Beverage");
    catogaries.innerHTML= "Beverage";

    loadItems(filteredItems);
  }
function Chicken() {
    let filteredItems = itemlist.filter(item => item.itemtype === "Chicken");
    catogaries.innerHTML= "Chicken";

    loadItems(filteredItems);
  }

// Add to Cart
function addToCart(index) {
    const item = itemlist[index];
    const cartItem = cart.find(cartItem => cartItem.itemno === item.itemno);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...item, quantity: 1 });
    }

    sessionStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

// Render Cart
function renderCart() {
    const cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = "";
    let totalPrice = 0;

    cart.forEach((cartItem, index) => {
        const cartItemElem = document.createElement("div");
        cartItemElem.classList.add("cart-item");
        cartItemElem.innerHTML = `
            <span>${cartItem.name} - Rs.${cartItem.price}</span><br>
  <input type="number" class="qtyValue" value="${cartItem.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
  <span class="oneTotlePrice">Rs.${(parseFloat(cartItem.price) * cartItem.quantity).toFixed(2)}</span>
  <button class="btn btn-danger btn-remove" onclick="removeFromCart(${index})">Remove</button><br><br>
        `;
        cartItems.appendChild(cartItemElem);
        totalPrice += parseFloat(cartItem.price) * cartItem.quantity;
    });

    document.getElementById("calculatedCount").textContent = totalPrice.toFixed(2);
}

// Update Quantity
function updateQuantity(index, quantity) {
    quantity = parseInt(quantity);
    if (quantity < 1) quantity = 1;
    cart[index].quantity = quantity;
    sessionStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

// Remove from Cart
function removeFromCart(index) {
    cart.splice(index, 1);
    sessionStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

// Calculate Total
function calculateTotal() {
    const discount = parseFloat(document.getElementById("discount").value) || 0;
    let totalPrice = parseFloat(document.getElementById("calculatedCount").textContent);
    totalPrice -= discount;
    if (totalPrice < 0) totalPrice = 0;
    return totalPrice.toFixed(2);
}

 

// Show Total Price
function showTotal() {
    showTotal();
    document.getElementById("calculatedCount").value = calculateTotal();
   
}

// Populate Customer Dropdown
function populateCustomerDropdown() {
    const customerSelect = document.getElementById("existingCustomer");
    customerSelect.innerHTML = '<option value="">-- Select a customer --</option>';
    customers.forEach((customer, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `${customer.name} (${customer.contactNumber})`;
        customerSelect.appendChild(option);
    });
}

// Fill Customer Info
function fillCustomerInfo() {
    const selectedIndex = document.getElementById("existingCustomer").value;
    if (selectedIndex !== "") {
        const customer = customers[selectedIndex];
        document.getElementById("customerName").value = customer.name;
        document.getElementById("contactNumber").value = customer.contactNumber;
    } else {
        document.getElementById("customerName").value = "";
        document.getElementById("contactNumber").value = "";
    }
}

// Place Order
function placeOrder() {
    const customerName = document.getElementById("customerName").value.trim();
    const contactNumber = document.getElementById("contactNumber").value.trim();
    const discount = parseFloat(document.getElementById("discount").value) || 0;
    const totalPrice = calculateTotal();

    if (!customerName || !contactNumber) {
        showCustomerInfoAlert();

        return;
    }

    let existingCustomer = customers.find(customer => customer.name === customerName && customer.contactNumber === contactNumber);

    if (!existingCustomer) {
        const newCustomer = { name: customerName, contactNumber: contactNumber };
        customers.push(newCustomer);
        localStorage.setItem("customers", JSON.stringify(customers));
        populateCustomerDropdown();
        showNewCustomerAlert();
    }

    const order = {
        customerName,
        contactNumber,
        items: cart.map(cartItem => ({
            name: cartItem.name,
            price: cartItem.price,
            quantity: cartItem.quantity
        })),
        discount,
        totalPrice
    };

    orders.push(order);
    sessionStorage.setItem("orders", JSON.stringify(orders));

    showOrderSuccessAlert();

     cart = [];
    sessionStorage.setItem("cart", JSON.stringify(cart));
    document.getElementById("customerName").value = "";
    document.getElementById("contactNumber").value = "";
    document.getElementById("discount").value = "";
    renderCart();
      document.getElementById("calculatedCount").value = "";
    clear();
}

// Initialize
window.onload = function () {
    loadItemsFromJSON().then(() => {
        filterCategory("All");
        renderCart();
        populateCustomerDropdown();
    });
};

document.getElementById("calculateTotal").addEventListener("click", showTotal);
document.getElementById("completeOrderButton").addEventListener("click", placeOrder);


function showCustomAlert(message, type) {
    // Create custom alert container
    const alertContainer = document.createElement("div");
    alertContainer.className = "custom-alert";
    
    // Create alert content
    const alertContent = document.createElement("div");
    alertContent.className = `alert-content ${type}-alert`;
    
    // Create icon based on alert type
    const icon = document.createElement("div");
    icon.className = "alert-icon";
    
    // Set different icons based on alert type
    switch(type) {
      case 'total':
        icon.innerHTML = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M16 8l-8 8"></path>
          <path d="M8 8l8 8"></path>
        </svg>`;
        break;
      case 'info':
        icon.innerHTML = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>`;
        break;
      case 'success':
        icon.innerHTML = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>`;
        break;
      case 'customer':
        icon.innerHTML = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>`;
        break;
    }
    
    // Create message or price display
    let messageElement;
    if (type === 'total') {
      // Special formatting for total price
      const heading = document.createElement("h3");
      heading.textContent = "Your Total";
      alertContent.appendChild(heading);
      
      messageElement = document.createElement("div");
      messageElement.className = "price-display";
    } else {
      messageElement = document.createElement("p");
      messageElement.className = "alert-message";
    }
    messageElement.textContent = message;
    
    // Create close button
    const closeButton = document.createElement("button");
    closeButton.className = "close-btn";
    closeButton.textContent = "OK";
    closeButton.onclick = function() {
      document.body.removeChild(alertContainer);
    };
    
    // Assemble the alert
    alertContent.appendChild(icon);
    alertContent.appendChild(messageElement);
    alertContent.appendChild(closeButton);
    alertContainer.appendChild(alertContent);
    
    // Add styles if they don't already exist
    if (!document.getElementById("custom-alert-styles")) {
      const styles = `
        .custom-alert {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .alert-content {
          border-radius: 12px;
          padding: 30px;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          max-width: 320px;
          width: 100%;
          color: white;
          animation: fadeIn 0.3s ease-out;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .total-alert {
          background: linear-gradient(135deg, #6e8efb, #a777e3);
        }
        .info-alert {
          background: linear-gradient(135deg, #3498db, #2980b9);
        }
        .success-alert {
          background: linear-gradient(135deg, #2ecc71, #27ae60);
        }
        .customer-alert {
          background: linear-gradient(135deg, #e67e22, #d35400);
        }
        .alert-icon {
          margin-bottom: 15px;
        }
        .alert-message {
          font-size: 18px;
          margin: 15px 0;
          font-weight: 500;
        }
        .price-display {
          font-size: 32px;
          font-weight: bold;
          margin: 20px 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .close-btn {
          background-color: white;
          border: none;
          padding: 10px 30px;
          border-radius: 30px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 15px;
        }
        .total-alert .close-btn {
          color: #6e8efb;
        }
        .info-alert .close-btn {
          color: #3498db;
        }
        .success-alert .close-btn {
          color: #2ecc71;
        }
        .customer-alert .close-btn {
          color: #e67e22;
        }
        .close-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        h3 {
          margin-top: 0;
          font-size: 24px;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `;
      
      const styleElement = document.createElement("style");
      styleElement.id = "custom-alert-styles";
      styleElement.textContent = styles;
      document.head.appendChild(styleElement);
    }
    
    // Add alert to document
    document.body.appendChild(alertContainer);
  }
  function showTotal() {
    const total = calculateTotal();
    showCustomAlert(`Rs.${total}`, 'total');
    document.getElementById("calculatedCount").value = total;
  }
  
  // Function to show customer info alert
  function showCustomerInfoAlert() {
    showCustomAlert("Please enter customer information", 'info');
  }
  
  // Function to show order success alert
  function showOrderSuccessAlert() {
    showCustomAlert("Order placed successfully!", 'success');
  }
  
  // Function to show new customer alert
  function showNewCustomerAlert() {
    showCustomAlert("New customer added!", 'customer');
  }