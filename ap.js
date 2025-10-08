const products = [
    { id: "p1", name_uz: "Shokoladli tort", name_ru: "Шоколадный торт", price: 120000, photo: "https://i.imgur.com/5z3X0aS.jpg" },
    { id: "p2", name_uz: "Muzqaymoqli pirojnye", name_ru: "Пирожное с мороженым", price: 25000, photo: "https://i.imgur.com/8y6v7Xj.jpg" },
    { id: "p3", name_uz: "Keks", name_ru: "Кекс", price: 8000, photo: "https://i.imgur.com/4k9p2Lm.jpg" },
];

const cart = {};
let userLang = "uz";

function formatPrice(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function renderProducts() {
    const productsDiv = document.getElementById("products");
    if (!productsDiv) {
        console.error("Products container not found!");
        document.getElementById("error-message").style.display = "block";
        return;
    }
    productsDiv.innerHTML = "";
    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card bg-white rounded-lg shadow-md p-4";
        card.innerHTML = `
            <img src="${product.photo}" alt="${product.name_uz}" class="w-full h-48 object-cover rounded-md mb-3">
            <h3 class="text-lg font-semibold text-gray-800">${userLang === "uz" ? product.name_uz : product.name_ru}</h3>
            <p class="text-gray-600">${formatPrice(product.price)} so'm</p>
            <div class="quantity-controls flex items-center gap-3 mt-3">
                <button onclick="updateQuantity('${product.id}', -1)" class="px-3 py-1 bg-red-500 text-white rounded">-</button>
                <span id="qty-${product.id}" class="text-lg">${cart[product.id] ? cart[product.id].qty : 0}</span>
                <button onclick="updateQuantity('${product.id}', 1)" class="px-3 py-1 bg-green-500 text-white rounded">+</button>
            </div>
        `;
        productsDiv.appendChild(card);
    });
    updateTotal();
}

function updateQuantity(productId, change) {
    if (!cart[productId]) {
        const product = products.find(p => p.id === productId);
        if (!product) {
            console.error(`Product with ID ${productId} not found!`);
            return;
        }
        cart[productId] = { id: productId, qty: 0, type: "product", name_uz: product.name_uz, name_ru: product.name_ru, price: product.price };
    }
    cart[productId].qty = Math.max(0, (cart[productId].qty || 0) + change);
    if (cart[productId].qty === 0) {
        delete cart[productId];
    }
    const qtyElement = document.getElementById(`qty-${productId}`);
    if (qtyElement) {
        qtyElement.textContent = cart[productId] ? cart[productId].qty : 0;
    } else {
        console.error(`Quantity element for ${productId} not found!`);
    }
    updateTotal();
}

function updateTotal() {
    const total = Object.values(cart).reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalElement = document.getElementById("total-price");
    if (totalElement) {
        totalElement.textContent = formatPrice(total);
    } else {
        console.error("Total price element not found!");
    }
    const addToCartBtn = document.getElementById("add-to-cart");
    if (addToCartBtn) {
        addToCartBtn.disabled = total === 0;
    } else {
        console.error("Add to cart button not found!");
    }
}

document.getElementById("add-to-cart").addEventListener("click", () => {
    if (Object.keys(cart).length > 0) {
        try {
            window.Telegram.WebApp.sendData(JSON.stringify(Object.values(cart)));
            window.Telegram.WebApp.close();
        } catch (e) {
            console.error("Failed to send data to Telegram:", e);
            document.getElementById("error-message").style.display = "block";
        }
    }
});

// Telegram Web App ishga tushirish
try {
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
        userLang = window.Telegram.WebApp.initDataUnsafe?.user?.language_code === "ru" ? "ru" : "uz";
    } else {
        console.error("Telegram Web App is not available!");
        document.getElementById("error-message").style.display = "block";
    }
} catch (e) {
    console.error("Telegram Web App initialization failed:", e);
    document.getElementById("error-message").style.display = "block";
}
renderProducts();