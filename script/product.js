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

    const productImages = [
        "../data/images/slider/7acaa884-0cf3-4d53-aea7-945eae1e6452._SL300__.jfif",
        "../data/images/slider/OIP (1).webp",
        "../data/images/slider/OIP (2).webp",
        "../data/images/slider/OIP (3).webp",
        "../data/images/slider/OIP.webp"
    ];

    const renderProductDetails = (product) => {
        productContainer.textContent = "";

        const detailsDiv = document.createElement("div");
        detailsDiv.className = "product-info";

        const backBtn = document.createElement("button");
        backBtn.className = "back-btn";
        backBtn.innerHTML = '<i class="fas fa-arrow-left"></i> Back to Shop';
        backBtn.addEventListener("click", () => {
            window.location.href = "home.html";
        });

        const imgContainer = document.createElement("div");
        imgContainer.className = "product-image-container-detail";
        const img = document.createElement("img");
        img.src = productImages[product.id % productImages.length];
        img.alt = product.name;
        imgContainer.appendChild(img);

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

        const stock = document.createElement("p");
        stock.className = "product-stock";
        stock.innerText = `Available: ${product.quantity}`;
        if (product.quantity <= 0) {
            stock.style.color = "red";
            stock.innerText = "Out of Stock";
        }

        const desc = document.createElement("p");
        desc.className = "product-description";
        desc.innerText = product.description;

        const btn = document.createElement("button");
        btn.className = "add-to-cart-btn";
        btn.innerText = product.quantity > 0 ? "Add to Cart" : "Out of Stock";
        btn.disabled = product.quantity <= 0;
        btn.addEventListener("click", () => addToCart(product));

        detailsDiv.appendChild(backBtn);
        detailsDiv.appendChild(imgContainer);
        detailsDiv.appendChild(title);
        detailsDiv.appendChild(brand);
        detailsDiv.appendChild(type);
        detailsDiv.appendChild(price);
        detailsDiv.appendChild(stock);
        detailsDiv.appendChild(desc);
        detailsDiv.appendChild(btn);

        productContainer.appendChild(detailsDiv);
    };

    const addToCart = (product) => {
        const existingItem = cart.find(item => item.id === product.id);
        const currentQtyInCart = existingItem ? existingItem.quantity : 0;

        if (currentQtyInCart < product.quantity) {
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
        } else {
            alert(`Sorry, only ${product.quantity} items available in stock.`);
        }
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
