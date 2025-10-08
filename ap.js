const products = [
    {id: "p1", name: "Shokoladli tort", price: 120000, photo: "https://i.imgur.com/5z3X0aS.jpg"},
    {id: "p2", name: "Muzqaymoqli pirojnye", price: 25000, photo: "https://i.imgur.com/8y6v7Xj.jpg"},
    {id: "p3", name: "Keks", price: 8000, photo: "https://i.imgur.com/4k9p2Lm.jpg"}
];

const productsDiv = document.getElementById('products');
const totalDiv = document.getElementById('total');
const addToCartBtn = document.getElementById('add-to-cart');
const errorMessage = document.getElementById('error-message');

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so‘m";
}

function updateTotal() {
    let total = 0;
    products.forEach(p => {
        const qty = parseInt(document.getElementById(`qty_${p.id}`).value) || 0;
        total += p.price * qty;
    });
    totalDiv.textContent = `Jami: ${formatPrice(total)}`;
}

function createProductElement(p) {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
        <img src="${p.photo}" alt="${p.name}"/>
        <div class="product-info">
            <p>${p.name}</p>
            <span>${formatPrice(p.price)}</span>
        </div>
        <div class="quantity">
            <button onclick="changeQty('${p.id}', -1)">−</button>
            <input type="number" id="qty_${p.id}" value="0" min="0" onchange="updateTotal()">
            <button onclick="changeQty('${p.id}', 1)">+</button>
        </div>
    `;
    return div;
}

function changeQty(productId, delta) {
    const input = document.getElementById(`qty_${productId}`);
    let qty = parseInt(input.value) || 0;
    qty = Math.max(0, qty + delta);
    input.value = qty;
    updateTotal();
}

function init() {
    if (!window.Telegram?.WebApp) {
        errorMessage.style.display = 'block';
        addToCartBtn.disabled = true;
        return;
    }
    Telegram.WebApp.ready();
    Telegram.WebApp.expand();
    Telegram.WebApp.MainButton.hide();

    products.forEach(p => {
        productsDiv.appendChild(createProductElement(p));
    });
    updateTotal();

    addToCartBtn.addEventListener('click', () => {
        const cart = products
            .map(p => ({
                id: p.id,
                qty: parseInt(document.getElementById(`qty_${p.id}`).value) || 0
            }))
            .filter(item => item.qty > 0);
        if (cart.length === 0) {
            alert('Savat bo‘sh! Iltimos, mahsulot tanlang.');
            return;
        }
        Telegram.WebApp.sendData(JSON.stringify(cart));
        Telegram.WebApp.close();
    });
}

document.addEventListener('DOMContentLoaded', init);