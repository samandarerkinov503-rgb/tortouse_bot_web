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
    console.log("renderProducts funksiyasi chaqirildi");
    const productsDiv = document.getElementById("products");
    if (!productsDiv) {
        console.error("Products container topilmadi!");
        document.getElementById("error-message").style.display = "block";
        return;
    }
    productsDiv.innerHTML = "";
    products.forEach(product => {
        console.log(`Mahsulot render qilinmoqda: ${product.id}`);
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
    console.log(`updateQuantity chaqirildi: productId=${productId}, change=${change}`);
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error(`Mahsulot topilmadi: ${productId}`);
        return;
    }
    if (!cart[productId]) {
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
        console.error(`qty-${productId} elementi topilmadi`);
    }
    updateTotal();
}

function updateTotal() {
    console.log("updateTotal funksiyasi chaqirildi");
    const total = Object.values(cart).reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalElement = document.getElementById("total-price");
    if (totalElement) {
        totalElement.textContent = formatPrice(total);
    } else {
        console.error("total-price elementi topilmadi");
    }
    const addToCartBtn = document.getElementById("add-to-cart");
    if (addToCartBtn) {
        addToCartBtn.disabled = total === 0;
    } else {
        console.error("add-to-cart tugmasi topilmadi");
    }
}

function initializeApp() {
    console.log("initializeApp funksiyasi chaqirildi");
    const addToCartBtn = document.getElementById("add-to-cart");
    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", () => {
            console.log("Savatga Qo‘shish tugmasi bosildi, cart:", cart);
            if (Object.keys(cart).length > 0) {
                try {
                    window.Telegram.WebApp.sendData(JSON.stringify(Object.values(cart)));
                    console.log("Ma’lumot Telegram’ga yuborildi:", JSON.stringify(Object.values(cart)));
                    window.Telegram.WebApp.close();
                } catch (e) {
                    console.error("Telegram’ga ma’lumot yuborishda xato:", e);
                    document.getElementById("error-message").style.display = "block";
                }
            }
        });
    } else {
        console.error("add-to-cart tugmasi topilmadi");
    }

    try {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.ready();
            userLang = window.Telegram.WebApp.initDataUnsafe?.user?.language_code === "ru" ? "ru" : "uz";
            console.log("Telegram Web App ishga tushirildi, userLang:", userLang);
        } else {
            console.error("Telegram Web App mavjud emas!");
            document.getElementById("error-message").style.display = "block";
        }
    } catch (e) {
        console.error("Telegram Web App ishga tushirishda xato:", e);
        document.getElementById("error-message").style.display = "block";
    }
    renderProducts();
}

// DOM yuklanganda ishga tushirish
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM yuklandi, initializeApp chaqirilmoqda");
    initializeApp();
});
