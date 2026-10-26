
/* =========================================
   SHOPSPHERE
   Object-Oriented JavaScript
   Observer + Strategy + Command Patterns
========================================= */

// =========================================
// 1. PRODUCT DATA
// =========================================

const products = [
    {
        id: 1,
        name: "Studio Wireless Headphones",
        category: "Audio",
        price: 2499,
        originalPrice: 3299,
        rating: 4.8,
        badge: "BESTSELLER",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Minimal Smart Watch",
        category: "Wearables",
        price: 3499,
        originalPrice: 4299,
        rating: 4.7,
        badge: "TRENDING",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Everyday Sneakers",
        category: "Accessories",
        price: 1899,
        originalPrice: 2499,
        rating: 4.6,
        badge: "POPULAR",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Premium Headphones",
        category: "Audio",
        price: 2999,
        originalPrice: 3999,
        rating: 4.9,
        badge: "TOP RATED",
        image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Classic Wrist Watch",
        category: "Wearables",
        price: 2199,
        originalPrice: 2799,
        rating: 4.5,
        badge: "NEW",
        image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Travel Backpack",
        category: "Accessories",
        price: 1599,
        originalPrice: 2199,
        rating: 4.7,
        badge: "GREAT VALUE",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 7,
        name: "Portable Audio Speaker",
        category: "Audio",
        price: 1799,
        originalPrice: 2299,
        rating: 4.6,
        badge: "POPULAR",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 8,
        name: "Everyday Smart Watch",
        category: "Wearables",
        price: 2799,
        originalPrice: 3499,
        rating: 4.8,
        badge: "TRENDING",
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80"
    }
];

const formatPrice = amount =>
    "₹" + amount.toLocaleString("en-IN");


// =========================================
// 2. OBSERVER PATTERN
// Subject: Product
// Observer: User
// =========================================

class User {
    constructor(name) {
        this.name = name;
    }

    update(product, oldPrice, newPrice) {
        const message =
            `${product.name} dropped from ${formatPrice(oldPrice)} ` +
            `to ${formatPrice(newPrice)}!`;

        addNotification(this.name, message);

        showToast(message, "success");
    }
}

class Product {
    constructor(data) {
        Object.assign(this, data);
        this.observers = new Set();
    }

    subscribe(observer) {
        this.observers.add(observer);
    }

    unsubscribe(observer) {
        this.observers.delete(observer);
    }

    notify(oldPrice, newPrice) {
        this.observers.forEach(observer => {
            observer.update(this, oldPrice, newPrice);
        });
    }

    changePrice(newPrice) {
        if (!Number.isFinite(newPrice) || newPrice <= 0) {
            return;
        }

        const oldPrice = this.price;

        if (newPrice >= oldPrice) {
            this.price = newPrice;
            renderProducts();
            renderCart();
            return;
        }

        this.price = newPrice;

        // Notify observers only when the price decreases.
        this.notify(oldPrice, newPrice);

        renderProducts();
        renderCart();
    }
}

const catalog = products.map(data => new Product(data));

// One customer object can subscribe to multiple products.
const currentUser = new User("You");

const notifications = [];

function addNotification(title, message) {
    notifications.unshift({
        title,
        message,
        time: new Date().toLocaleTimeString()
    });

    renderNotifications();
}

function renderNotifications() {
    document.getElementById("notificationCount").textContent =
        notifications.length;

    const container = document.getElementById("notificationItems");

    if (notifications.length === 0) {
        container.innerHTML =
            '<p class="muted">No notifications yet.</p>';
        return;
    }

    container.innerHTML = notifications.map(notification => `
    <article class="notification-entry">
      <strong>${notification.title}</strong>
      <p>${notification.message}</p>
      <small>${notification.time}</small>
    </article>
  `).join("");
}


// =========================================
// 3. PRODUCT CATALOG UI
// =========================================

let activeCategory = "All";

function renderProducts() {
    const search =
        document.getElementById("searchInput").value
            .trim()
            .toLowerCase();

    const filtered = catalog.filter(product => {
        const matchesCategory =
            activeCategory === "All" ||
            product.category === activeCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search);

        return matchesCategory && matchesSearch;
    });

    const grid = document.getElementById("productGrid");

    document.getElementById("emptyState").hidden =
        filtered.length !== 0;

    grid.innerHTML = filtered.map(product => {
        const isSubscribed =
            product.observers.has(currentUser);

        const discount = Math.round(
            (1 - product.price / product.originalPrice) * 100
        );

        return `
      <article class="product-card">
        <div class="product-image-wrap">
          <img
            class="product-image"
            src="${product.image}"
            alt="${product.name}"
            loading="lazy"
          >
          <span class="product-badge">${product.badge}</span>
        </div>

        <div class="product-info">
          <span class="product-category">${product.category}</span>
          <h3>${product.name}</h3>

          <div class="product-rating">
            ★★★★★ <span>${product.rating} / 5</span>
          </div>

          <div class="product-price-row">
            <div class="product-price">
              ${formatPrice(product.price)}
              <span class="old-price">
                ${formatPrice(product.originalPrice)}
              </span>
            </div>
            <span class="product-category">${discount}% OFF</span>
          </div>

          <div class="product-actions">
            <button
              class="add-btn"
              data-add="${product.id}"
            >
              Add to cart +
            </button>

            <button
              class="subscribe-btn ${isSubscribed ? "subscribed" : ""}"
              data-subscribe="${product.id}"
              aria-label="${isSubscribed ? "Unsubscribe" : "Subscribe"} to price alerts for ${product.name}"
              title="${isSubscribed ? "Unsubscribe from price alerts" : "Get price-drop alerts"}"
            >
              ${isSubscribed ? "✓" : "♧"}
            </button>
          </div>

          <button
            class="price-drop-btn"
            data-drop="${product.id}"
          >
            ↓ Simulate price drop
          </button>
        </div>
      </article>
    `;
    }).join("");
}


// =========================================
// 4. STRATEGY PATTERN
// PaymentStrategy: common abstraction
// Concrete strategies: Card, UPI, Wallet
// =========================================

class PaymentStrategy {
    pay(amount) {
        throw new Error("pay() must be implemented");
    }
}

class CardPayment extends PaymentStrategy {
    pay(amount) {
        return `Demo card payment of ${formatPrice(amount)} successful.`;
    }
}

class UPIPayment extends PaymentStrategy {
    pay(amount) {
        return `Demo UPI payment of ${formatPrice(amount)} successful.`;
    }
}

class WalletPayment extends PaymentStrategy {
    pay(amount) {
        return `Demo wallet payment of ${formatPrice(amount)} successful.`;
    }
}

class CheckoutService {
    constructor(strategy) {
        this.setStrategy(strategy);
    }

    setStrategy(strategy) {
        if (!(strategy instanceof PaymentStrategy)) {
            throw new Error("Invalid payment strategy");
        }

        this.strategy = strategy;
    }

    checkout(amount) {
        return this.strategy.pay(amount);
    }
}

const paymentStrategies = {
    card: new CardPayment(),
    upi: new UPIPayment(),
    wallet: new WalletPayment()
};


// =========================================
// 5. COMMAND PATTERN
// Receiver: CartService
// Commands: Add, Remove, Coupon
// Invoker: CartInvoker
// =========================================

class CartService {
    constructor() {
        this.items = [];
        this.discountPercent = 0;
    }

    add(productId) {
        this.items.push(productId);
    }

    removeAt(index) {
        if (index < 0 || index >= this.items.length) {
            return null;
        }

        return this.items.splice(index, 1)[0];
    }

    getSubtotal() {
        return this.items.reduce((sum, id) => {
            const product = catalog.find(p => p.id === id);
            return sum + (product ? product.price : 0);
        }, 0);
    }

    getDiscount() {
        return Math.round(
            this.getSubtotal() * this.discountPercent / 100
        );
    }

    getTotal() {
        return this.getSubtotal() - this.getDiscount();
    }
}

class Command {
    execute() {
        throw new Error("execute() must be implemented");
    }

    undo() {
        throw new Error("undo() must be implemented");
    }
}

class AddItemCommand extends Command {
    constructor(cart, productId) {
        super();
        this.cart = cart;
        this.productId = productId;
        this.index = -1;
    }

    execute() {
        this.index = this.cart.items.length;
        this.cart.items.splice(this.index, 0, this.productId);
    }

    undo() {
        this.cart.removeAt(this.index);
    }
}

class RemoveItemCommand extends Command {
    constructor(cart, productId) {
        super();
        this.cart = cart;
        this.productId = productId;
        this.removedIndex = -1;
    }

    execute() {
        this.removedIndex =
            this.cart.items.indexOf(this.productId);

        if (this.removedIndex !== -1) {
            this.cart.removeAt(this.removedIndex);
        }
    }

    undo() {
        if (this.removedIndex !== -1) {
            this.cart.items.splice(
                this.removedIndex,
                0,
                this.productId
            );
        }
    }
}

class ApplyCouponCommand extends Command {
    constructor(cart) {
        super();
        this.cart = cart;
        this.previousDiscount = 0;
    }

    execute() {
        this.previousDiscount = this.cart.discountPercent;
        this.cart.discountPercent = 10;
    }

    undo() {
        this.cart.discountPercent = this.previousDiscount;
    }
}

class CartInvoker {
    constructor() {
        this.history = [];
        this.redoHistory = [];
    }

    run(command) {
        command.execute();

        this.history.push(command);

        // A new action clears the redo history.
        this.redoHistory = [];

        renderCart();
    }

    undo() {
        const command = this.history.pop();

        if (!command) {
            showToast("Nothing to undo.");
            return;
        }

        command.undo();
        this.redoHistory.push(command);

        renderCart();
    }

    redo() {
        const command = this.redoHistory.pop();

        if (!command) {
            showToast("Nothing to redo.");
            return;
        }

        command.execute();
        this.history.push(command);

        renderCart();
    }
}

const cart = new CartService();
const cartInvoker = new CartInvoker();


// =========================================
// 6. CART ACTIONS
// =========================================

function addItem(productId) {
    cartInvoker.run(new AddItemCommand(cart, productId));

    const product = catalog.find(p => p.id === productId);
    showToast(`${product.name} added to your cart.`, "success");
}

function removeItem(productId) {
    if (!cart.items.includes(productId)) {
        return;
    }

    cartInvoker.run(new RemoveItemCommand(cart, productId));
    showToast("Item removed. You can undo this action.");
}

function applyCoupon() {
    const input = document.getElementById("couponInput");
    const message = document.getElementById("cartMessage");

    if (input.value.trim().toUpperCase() !== "SAVE10") {
        message.textContent = "Invalid coupon. Try SAVE10.";
        message.style.color = "#c04a40";
        return;
    }

    if (cart.discountPercent === 10) {
        message.textContent = "Coupon already applied.";
        return;
    }

    cartInvoker.run(new ApplyCouponCommand(cart));

    message.textContent = "SAVE10 applied! You saved 10%.";
    message.style.color = "#198754";
}

function renderCart() {
    const itemsContainer = document.getElementById("cartItems");

    document.getElementById("cartCount").textContent =
        cart.items.length;

    if (cart.items.length === 0) {
        itemsContainer.innerHTML = `
      <div class="empty-cart">
        <div style="font-size:36px;margin-bottom:12px">🛒</div>
        <strong>Your cart is waiting.</strong>
        <p>Add something you love to get started.</p>
      </div>
    `;
    } else {
        itemsContainer.innerHTML = cart.items.map((id, index) => {
            const product = catalog.find(p => p.id === id);

            return `
        <article class="cart-item">
          <img src="${product.image}" alt="${product.name}">
          <div>
            <h3>${product.name}</h3>
            <p>${formatPrice(product.price)}</p>
          </div>
          <button
            class="remove-item"
            data-remove="${id}"
          >
            Remove
          </button>
        </article>
      `;
        }).join("");
    }

    document.getElementById("subtotal").textContent =
        formatPrice(cart.getSubtotal());

    document.getElementById("discount").textContent =
        "-" + formatPrice(cart.getDiscount());

    document.getElementById("total").textContent =
        formatPrice(cart.getTotal());

    document.getElementById("undoBtn").disabled =
        cartInvoker.history.length === 0;

    document.getElementById("redoBtn").disabled =
        cartInvoker.redoHistory.length === 0;

    document.getElementById("checkoutBtn").disabled =
        cart.items.length === 0;

    document.getElementById("checkoutTotal").textContent =
        formatPrice(cart.getTotal());
}


// =========================================
// 7. TOAST NOTIFICATIONS
// =========================================

function showToast(message, type = "") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");

    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    // Automatically remove the toast after 3 seconds.
    setTimeout(() => toast.remove(), 3000);
}


// =========================================
// 8. EVENT LISTENERS
// =========================================

// Product buttons use event delegation.
document.getElementById("productGrid").addEventListener("click", event => {
    const addButton = event.target.closest("[data-add]");
    const subscribeButton = event.target.closest("[data-subscribe]");
    const dropButton = event.target.closest("[data-drop]");

    if (addButton) {
        addItem(Number(addButton.dataset.add));
    }

    if (subscribeButton) {
        const product = catalog.find(
            p => p.id === Number(subscribeButton.dataset.subscribe)
        );

        if (product.observers.has(currentUser)) {
            product.unsubscribe(currentUser);
            showToast(`Price alerts turned off for ${product.name}.`);
        } else {
            product.subscribe(currentUser);
            showToast(`You'll be notified when ${product.name} drops in price.`, "success");
        }

        renderProducts();
    }

    if (dropButton) {
        const product = catalog.find(
            p => p.id === Number(dropButton.dataset.drop)
        );

        const newPrice = Math.max(
            1,
            Math.round(product.price * 0.8)
        );

        product.changePrice(newPrice);
    }
});

// Search and categories.
document.getElementById("searchInput").addEventListener("input", renderProducts);

document.getElementById("categoryList").addEventListener("click", event => {
    const button = event.target.closest("[data-category]");

    if (!button) return;

    activeCategory = button.dataset.category;

    document.querySelectorAll(".category").forEach(category => {
        category.classList.toggle("active", category === button);
    });

    renderProducts();
});

// Cart buttons.
document.getElementById("cartItems").addEventListener("click", event => {
    const button = event.target.closest("[data-remove]");

    if (button) {
        removeItem(Number(button.dataset.remove));
    }
});

document.getElementById("undoBtn").addEventListener("click", () => {
    cartInvoker.undo();
});

document.getElementById("redoBtn").addEventListener("click", () => {
    cartInvoker.redo();
});

document.getElementById("applyCoupon").addEventListener("click", applyCoupon);

// Open and close cart.
const cartOverlay = document.getElementById("cartOverlay");

function openCart() {
    cartOverlay.hidden = false;
}

function closeCart() {
    cartOverlay.hidden = true;
}

document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);

cartOverlay.addEventListener("click", event => {
    if (event.target === cartOverlay) closeCart();
});

// Checkout modal.
const checkoutOverlay = document.getElementById("checkoutOverlay");

document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (cart.items.length === 0) return;

    document.getElementById("checkoutTotal").textContent =
        formatPrice(cart.getTotal());

    document.getElementById("paymentMessage").textContent = "";

    checkoutOverlay.hidden = false;
});

function closeCheckout() {
    checkoutOverlay.hidden = true;
}

document.getElementById("closeCheckout").addEventListener("click", closeCheckout);

checkoutOverlay.addEventListener("click", event => {
    if (event.target === checkoutOverlay) closeCheckout();
});

// Select and execute a payment strategy.
document.getElementById("payBtn").addEventListener("click", () => {
    if (cart.items.length === 0) {
        document.getElementById("paymentMessage").textContent =
            "Your cart is empty.";
        return;
    }

    const selectedMethod =
        document.querySelector('input[name="payment"]:checked').value;

    const checkoutService = new CheckoutService(
        paymentStrategies[selectedMethod]
    );

    const result = checkoutService.checkout(cart.getTotal());

    document.getElementById("paymentMessage").textContent = result;

    showToast("Demo checkout completed.", "success");
});

// Notification panel.
const notificationPanel = document.getElementById("notificationPanel");

document.getElementById("notificationBtn").addEventListener("click", () => {
    notificationPanel.hidden = !notificationPanel.hidden;
});

document.getElementById("closeNotifications").addEventListener("click", () => {
    notificationPanel.hidden = true;
});

// Close overlays using Escape.
document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeCart();
        closeCheckout();
        notificationPanel.hidden = true;
    }
});


// =========================================
// 9. INITIALIZE WEBSITE
// =========================================

renderProducts();
renderCart();
renderNotifications();
