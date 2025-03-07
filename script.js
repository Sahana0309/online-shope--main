const productContainer = document.getElementById('product-container');
const search = document.getElementById('search');
const cartBtn = document.getElementById('cart-btn');
const closeBtn = document.getElementById('close-btn');
const cartContainer = document.getElementById('cart-container');
const innerCart = document.getElementById('cart');
const total = document.getElementById('total-price');
let products = [];
let cart = [];

function calculatePrice() {
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    total.innerHTML = `$ ${totalPrice.toFixed(2)}`;
}

function addToCart(item) {
    const index = cart.findIndex(cartItem => item.id === cartItem.id);
    if (index === -1) {
        cart.push({ ...item, quantity: 1 });
    } else {
        cart[index].quantity++;
    }
    displayCart(cart);
    calculatePrice();
}

function incrementQuantity(itemId) {
    cart = cart.map(item =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    displayCart(cart);
    calculatePrice();
}

function decrementQuantity(itemId) {
    cart = cart.map(item =>
        item.id === itemId ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
    );
    displayCart(cart);
    calculatePrice();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    displayCart(cart);
    calculatePrice(); // Recalculate after removal
}

function displayProducts(products) {
    productContainer.innerHTML = '';
    products.forEach(product => {
        const productBox = document.createElement('div');
        productBox.classList.add('col-lg-4', 'col-md-6');

        productBox.innerHTML = `
        <div class="card my-3">
            <img src="${product.image}" class="card-img-top" alt="${product.title}">
            <div class="card-body">
                <h5>${product.title}</h5>
                <p class="text-success fs-5">$ ${product.price.toFixed(2)}</p>
                <button class="btn btn-warning">Add To Cart</button>
            </div>
        </div>
        `;

        productBox.querySelector('.btn').addEventListener('click', () => {
            addToCart(product);
            openSideBar();
        });

        productContainer.appendChild(productBox);
    });
}

async function fetchProducts() {
    try {
        const res = await fetch(`https://fakestoreapi.com/products`);
        products = await res.json();
        displayProducts(products);
    } catch (error) {
        console.error('Failed to fetch products:', error);
    }
}

function searchProduct() {
    const query = search.value.trim().toLowerCase();
    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(query)
    );
    displayProducts(filteredProducts);
}

function openSideBar() {
    cartContainer.style.transform = 'translateX(0)';
}

function closeSideBar() {
    cartContainer.style.transform = 'translateX(110%)';
}

cartBtn.addEventListener('click', openSideBar);
closeBtn.addEventListener('click', closeSideBar);

function displayCart(items) {
    innerCart.innerHTML = '';
    items.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
        <div class="d-flex align-items-center justify-content-between">
            <img src="${item.image}" alt="cart_item" class="cart-image"/>
            <span>$ ${(item.price * item.quantity).toFixed(2)}</span>
            <button class="btn btn-sm btn-warning mx-2" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
        <div class="d-flex gap-2 align-items-center justify-content-center mt-2">
            <button class="btn btn-sm btn-danger">-</button>
            <span>${item.quantity}</span>
            <button class="btn btn-sm btn-primary">+</button>
        </div>
        `;

        cartItem.querySelector('.btn-primary').addEventListener('click', () => {
            incrementQuantity(item.id);
        });
        cartItem.querySelector('.btn-danger').addEventListener('click', () => {
            decrementQuantity(item.id);
        });

        innerCart.appendChild(cartItem);
    });
}

// Fetch products on page load
fetchProducts();

// Trigger search on input change
search.addEventListener('input', searchProduct);
