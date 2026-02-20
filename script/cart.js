document.addEventListener("DOMContentLoaded", () => {
    const cartItemsGrid = document.getElementById("cart-items");
    const cartSummary = document.getElementById("cart-summary");
    const totalPriceSpan = document.getElementById("total-price");
    const buyNowBtn = document.getElementById("buy-now-btn");
    const successOverlay = document.getElementById("success-overlay");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const renderCart = () => {
        cartItemsGrid.textContent = "";

        if (cart.length === 0) {
            const emptyMsg = document.createElement("p");
            emptyMsg.className = "empty-msg";
            emptyMsg.textContent = "Your cart is empty.";
            cartItemsGrid.appendChild(emptyMsg);
            cartSummary.style.display = "none";
            return;
        }

        cartSummary.style.display = "flex";
        let total = 0;

        cart.forEach((item, index) => {
            const itemElement = createCartItemElement(item, index);
            cartItemsGrid.appendChild(itemElement);
            total += item.price * item.quantity;
        });

        totalPriceSpan.innerText = `$${total.toFixed(2)}`;
    };

    const createCartItemElement = (item, index) => {
        const div = document.createElement("div");
        div.className = "cart-item";

        const name = document.createElement("div");
        name.className = "cart-item-name";
        name.innerText = item.name;

        const price = document.createElement("div");
        price.className = "cart-item-price";
        price.innerText = `$${item.price}`;

        const controls = document.createElement("div");
        controls.className = "cart-item-controls";

        const decBtn = document.createElement("button");
        decBtn.className = "control-btn";
        const decIcon = document.createElement("i");
        decIcon.className = "fas fa-minus";
        decBtn.appendChild(decIcon);
        decBtn.addEventListener("click", () => updateQuantity(index, -1));

        const qty = document.createElement("span");
        qty.innerText = item.quantity;

        const incBtn = document.createElement("button");
        incBtn.className = "control-btn";
        const incIcon = document.createElement("i");
        incIcon.className = "fas fa-plus";
        incBtn.appendChild(incIcon);
        incBtn.addEventListener("click", () => updateQuantity(index, 1));

        controls.appendChild(decBtn);
        controls.appendChild(qty);
        controls.appendChild(incBtn);

        const remove = document.createElement("div");
        remove.className = "remove-btn";
        const removeIcon = document.createElement("i");
        removeIcon.className = "fas fa-trash-alt";
        remove.appendChild(removeIcon);
        remove.addEventListener("click", () => removeItem(index));

        div.appendChild(name);
        div.appendChild(price);
        div.appendChild(controls);
        div.appendChild(remove);

        return div;
    };

    const updateQuantity = (index, change) => {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        saveCart();
        renderCart();
    };

    const removeItem = (index) => {
        cart.splice(index, 1);
        saveCart();
        renderCart();
    };

    const saveCart = () => {
        localStorage.setItem("cart", JSON.stringify(cart));
    };

    buyNowBtn.addEventListener("click", () => {
        if (cart.length === 0) return;

        successOverlay.classList.add("active");

        setTimeout(() => {
            cart = [];
            saveCart();
            window.location.href = "home.html";
        }, 1000);
    });

    renderCart();
});
