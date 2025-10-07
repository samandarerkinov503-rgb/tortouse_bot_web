const products = [
    {id: "p1", name: "Shokoladli tort", price: 120000, photo: "https://i.imgur.com/5z3X0aS.jpg"},
    {id: "p2", name: "Muzqaymoqli pirojnye", price: 25000, photo: "https://i.imgur.com/8y6v7Xj.jpg"},
    {id: "p3", name: "Keks", price: 8000, photo: "https://i.imgur.com/4k9p2Lm.jpg"},
];

Telegram.WebApp.ready();
Telegram.WebApp.expand();

const productsDiv = document.getElementById('products');
products.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
        <img src="${p.photo}" width="100" />
        <p>${p.name} - ${p.price} so‘m</p>
        <input type="number" value="1" min="1" id="qty_${p.id}">
    `;
    productsDiv.appendChild(div);
});

document.getElementById('add-to-cart').addEventListener('click', () => {
    const cart = products.map(p => ({id: p.id, qty: parseInt(document.getElementById(`qty_${p.id}`).value)})).filter(item => item.qty > 0);
    Telegram.WebApp.sendData(JSON.stringify(cart));
    Telegram.WebApp.close();
});