# Burger Shop E-Commerce Application

This is a burger shop e-commerce application with a Spring Boot backend and HTML/JavaScript frontend.

## Backend (Spring Boot)

The backend is a Spring Boot application running on port 8080 with the following features:

- **Customer Management**: CRUD operations for customers
- **RESTful API**: REST endpoints for customer operations
- **Database**: H2 in-memory database
- **CORS**: Configured to allow frontend communication

### Backend Endpoints

#### Customer Management
- `POST /customer/create` - Create a new customer
- `GET /customer` - Get all customers
- `GET /customer/{id}` - Get customer by ID
- `PUT /customer/{id}` - Update customer
- `DELETE /customer/{id}` - Delete customer
- `GET /customer/search?name={name}` - Search customers by name

#### Item Management
- `POST /items/create` - Create a new item
- `GET /items` - Get all items
- `GET /items/{itemno}` - Get item by number
- `PUT /items/{itemno}` - Update item
- `DELETE /items/{itemno}` - Delete item
- `GET /items/type/{itemtype}` - Get items by type

#### Order Management
- `POST /orders` - Create a new order
- `GET /orders` - Get all orders
- `GET /orders/{orderID}` - Get order by ID
- `DELETE /orders/{orderID}` - Delete order
- `GET /orders/customer?customerName={name}` - Get orders by customer name

## Frontend

The frontend consists of HTML pages with JavaScript functionality:

- **index.html** - Main menu and cart functionality
- **addCustomer.html** - Customer management interface
- **addItem.html** - Item management interface
- **viewOrders.html** - Order viewing interface

## Integration

The frontend now communicates with the Spring Boot backend instead of using localStorage:

- Customer data is stored in the backend database
- All CRUD operations go through the REST API
- Real-time search functionality
- Proper error handling and user feedback

## How to Use

1. **Start the Backend**: Ensure your Spring Boot application is running on port 8080
2. **Open Frontend**: Open the HTML files in a web browser
3. **Customer Management**: Use the Add Customer page to manage customers
4. **Ordering**: Use the main page to place orders with existing customers

## Features

- **Customer Management**: Add, edit, delete, and search customers
- **Item Management**: Add, edit, delete, and search menu items
- **Order Management**: Create, view, delete, and search orders
- **Menu Management**: Browse and filter food items by category
- **Shopping Cart**: Add items, adjust quantities, apply discounts
- **Order Processing**: Place orders with customer information
- **Real-time Updates**: All changes are immediately reflected in the UI
- **Search Functionality**: Real-time search for customers, items, and orders

## Technical Details

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Spring Boot 3.2.0, Spring Data JPA, H2 Database
- **Communication**: RESTful API with JSON data exchange
- **CORS**: Configured for cross-origin requests
- **Error Handling**: Comprehensive error handling with user-friendly messages

## Notes

- The backend must be running for the frontend to function properly
- Customer data is persisted in the H2 database
- The system automatically creates customers when placing orders if they don't exist
- All API calls include proper error handling and user feedback
