document.addEventListener("DOMContentLoaded", () => {
    renderOrders();
});

function renderOrders() {
    const orderTableBody = document.getElementById("orderTableBody");
    if (!orderTableBody) return;

    const orders = JSON.parse(sessionStorage.getItem("orders")) || [];

    orderTableBody.innerHTML = "";

    orders.forEach((order, index) => {
        const row = document.createElement("tr");

        const itemsList = order.items && Array.isArray(order.items)
            ? order.items.map(item => {
                const quantity = Number(item.quantity) || 0;
                const price = Number(item.price) || 0;
                return `<li>${item.name} (x${quantity}) - Rs.${(price * quantity).toFixed(2)}</li>`;
            }).join("")
            : "<li>No items</li>";

        const discount = Number(order.discount) || 0;
        const totalPrice = Number(order.totalPrice) || 0;

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${order.customerName || "N/A"}</td>
            <td>${order.contactNumber || "N/A"}</td>
            <td><ul>${itemsList}</ul></td>
            <td>Rs.${discount.toFixed(2)}</td>
            <td>Rs.${totalPrice.toFixed(2)}</td>
           
        `;

        orderTableBody.appendChild(row);
    });

    attachPrintListeners();
}

function attachPrintListeners() {
    document.querySelectorAll("button[data-index]").forEach(button => {
        button.addEventListener("click", () => {
            const index = parseInt(button.getAttribute("data-index"));
            printOrder(index);
        });
    });
}
