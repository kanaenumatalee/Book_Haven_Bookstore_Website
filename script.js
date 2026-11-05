// ============================================
// Book Haven Bookstore - script.js
// sessionStorage: shopping cart | localStorage: form submissions
// ============================================

const CART_KEY = "cart";
const FORMS_KEY = "contactSubmissions";

// ---------- Footer newsletter (all pages) ----------
function subscribe(event) {
  event.preventDefault();
  alert("Thank you for subscribing.");
  event.target.reset();
}

// ---------- Cart helpers (sessionStorage) ----------
function getCart() {
  try {
    return JSON.parse(sessionStorage.getItem(CART_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveCart(cart) {
  sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Add to Cart: reads the product card the button is in and saves it
function addToCart(button) {
  const card = button.closest("td");
  const name = card.querySelector("h2").textContent.trim();
  const price = parseFloat(card.querySelector("strong").textContent.replace("$", ""));
  const image = card.querySelector("img").src;

  const cart = getCart();
  const existing = cart.find(function (item) {
    return item.name === name;
  });

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name: name, price: price, image: image, quantity: 1 });
  }

  saveCart(cart);
  alert("Item added to the cart.");
}

// View Cart: reads sessionStorage and fills the modal
function renderCart() {
  const list = document.getElementById("cart-items");
  if (!list) return;

  const cart = getCart();
  let total = 0;
  let count = 0;
  list.innerHTML = "";

  cart.forEach(function (item) {
    total += item.price * item.quantity;
    count += item.quantity;
    list.innerHTML +=
      '<div class="cart-item">' +
      '<img src="' + item.image + '" alt="' + item.name + '" />' +
      "<div><h3>" + item.name + "</h3>" +
      "<p>Qty: " + item.quantity + "</p>" +
      "<p>$" + (item.price * item.quantity).toFixed(2) + "</p></div>" +
      "</div>";
  });

  document.getElementById("cart-count").textContent =
    count + (count === 1 ? " item" : " items");
  document.getElementById("cart-total").textContent =
    count > 0 ? "Total: $" + total.toFixed(2) : "Your cart is empty.";
}

function viewCart(event) {
  event.preventDefault();
  renderCart();
  document.getElementById("cart-modal").hidden = false;
}

function closeCart() {
  document.getElementById("cart-modal").hidden = true;
}

// Clear Cart: removes everything from sessionStorage
function clearCart() {
  sessionStorage.removeItem(CART_KEY);
  renderCart();
  alert("Cart cleared.");
}

// Process Order: thanks the customer, then empties sessionStorage
function processOrder() {
  if (getCart().length === 0) {
    alert("Your cart is empty. Please add items before processing an order.");
    return;
  }
  sessionStorage.removeItem(CART_KEY);
  renderCart();
  alert("Thank you for your order.");
}

// Close the cart with the Escape key or by clicking the dark background
document.addEventListener("keydown", function (event) {
  const modal = document.getElementById("cart-modal");
  if (event.key === "Escape" && modal && !modal.hidden) closeCart();
});

document.addEventListener("click", function (event) {
  if (event.target.id === "cart-modal") closeCart();
});

// ---------- Contact / custom order forms (localStorage) ----------
function submitMessage(event) {
  event.preventDefault();
  const form = event.target;

  // Which form was it? Use the heading of its section.
  const heading = form.closest("section").querySelector("h2");
  const entry = { type: heading ? heading.textContent.trim() : "Message" };

  // Save every field (name, email, message/details)
  new FormData(form).forEach(function (value, key) {
    entry[key] = value;
  });
  entry.submitted = new Date().toLocaleString();

  let saved = [];
  try {
    saved = JSON.parse(localStorage.getItem(FORMS_KEY)) || [];
  } catch (error) {
    saved = [];
  }
  saved.push(entry);
  localStorage.setItem(FORMS_KEY, JSON.stringify(saved));

  alert("Thank you for your message.");
  form.reset();
}