document.addEventListener("DOMContentLoaded", () => {
    const productContainer = document.getElementById("product-details");
    const cartCount = document.getElementById("cart-count");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const getProductId = () => {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get("id"));
    };

    const fetchProductDetails = async (id) => {
        try {
            const response = await fetch("../data/products.json");
            const products = await response.json();
            const product = products.find(p => p.id === id);

            if (product) {
                renderProductDetails(product);
            } else {
                productContainer.textContent = "";
                const h2 = document.createElement("h2");
                h2.textContent = "Product Not Found";
                const p = document.createElement("p");
                p.textContent = "Sorry, the product you are looking for does not exist.";
                productContainer.appendChild(h2);
                productContainer.appendChild(p);
            }
        } catch (error) {
            console.error("Error fetching product details:", error);
            productContainer.innerText = "Error loading product details.";
        }
    };

    const renderProductDetails = (product) => {
        productContainer.textContent = "";

        const detailsDiv = document.createElement("div");
        detailsDiv.className = "product-info";

        const imgPlaceholder = document.createElement("div");
        imgPlaceholder.className = "product-image-placeholder";
        const icon = document.createElement("i");
        icon.className = getIconForType(product.type);
        imgPlaceholder.appendChild(icon);

        const title = document.createElement("h2");
        title.innerText = product.name;

        const brand = document.createElement("p");
        brand.className = "product-brand";
        brand.innerText = `by ${product.brand}`;

        const type = document.createElement("span");
        type.className = "product-type";
        type.innerText = product.type.charAt(0).toUpperCase() + product.type.slice(1);

        const price = document.createElement("p");
        price.className = "product-price";
        price.innerText = `$${product.price}`;

        const desc = document.createElement("p");
        desc.className = "product-description";
        desc.innerText = product.description;

        const btn = document.createElement("button");
        btn.className = "add-to-cart-btn";
        btn.innerText = "Add to Cart";
        btn.addEventListener("click", () => addToCart(product));

        detailsDiv.appendChild(imgPlaceholder);
        detailsDiv.appendChild(title);
        detailsDiv.appendChild(brand);
        detailsDiv.appendChild(type);
        detailsDiv.appendChild(price);
        detailsDiv.appendChild(desc);
        detailsDiv.appendChild(btn);

        productContainer.appendChild(detailsDiv);
    };

    const getIconForType = (type) => {
        switch (type) {
            case "laptop": return "fas fa-laptop";
            case "cpu": return "fas fa-microchip";
            case "hard": return "fas fa-hdd";
            case "accessory": return "fas fa-keyboard";
            default: return "fas fa-box";
        }
    };

    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1
            });
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartCount();
        alert(`${product.name} added to cart!`);
    };

    const updateCartCount = () => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.innerText = totalItems;
    };

    const productId = getProductId();
    if (productId) {
        fetchProductDetails(productId);
    } else {
        productContainer.textContent = "";
        const h2 = document.createElement("h2");
        h2.textContent = "No Product Selected";
        productContainer.appendChild(h2);
    }

    updateCartCount();
});
