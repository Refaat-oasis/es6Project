

document.addEventListener("DOMContentLoaded", () => {
    let products = [];
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const productsGrid = document.getElementById("products-grid");
    const brandFilter = document.getElementById("filter-brand");
    const typeFilter = document.getElementById("filter-type");
    const priceFilter = document.getElementById("filter-price");
    const searchFilter = document.getElementById("filter-search");
    const priceValue = document.getElementById("price-value");
    const cartCount = document.getElementById("cart-count");


    const slides = document.querySelectorAll(".slide");
    const prevBtn = document.getElementById("prevSlide");
    const nextBtn = document.getElementById("nextSlide");
    let currentSlide = 0;
    let sliderInterval;

    const showSlide = (index) => {
        slides.forEach(slide => slide.classList.remove("active"));
        if (index >= slides.length) currentSlide = 0;
        else if (index < 0) currentSlide = slides.length - 1;
        else currentSlide = index;
        slides[currentSlide].classList.add("active");
    };

    const nextSlide = () => showSlide(currentSlide + 1);
    const prevSlide = () => showSlide(currentSlide - 1);

    const startSlider = () => {
        sliderInterval = setInterval(nextSlide, 3000);
    };

    const stopSlider = () => clearInterval(sliderInterval);

    nextBtn.addEventListener("click", () => {
        stopSlider();
        nextSlide();
        startSlider();
    });

    prevBtn.addEventListener("click", () => {
        stopSlider();
        prevSlide();
        startSlider();
    });

    startSlider();


    let filteredProducts = [];
    let itemsToShow = 8;
    const itemsPerLoad = 8;
    const showMoreBtn = document.getElementById("show-more-btn");

    const fetchProducts = async () => {
        try {
            const response = await fetch("../data/products.json");
            products = await response.json();
            populateBrandFilter();
            applyFiltersAndRender();
        } catch (error) {
            console.error("Error fetching products:", error);
            productsGrid.innerText = "Error loading products.";
        }
    };

    const populateBrandFilter = () => {
        const brands = ["all", ...new Set(products.map(p => p.brand))];
        brandFilter.textContent = "";
        brands.forEach(brand => {
            const option = document.createElement("option");
            option.value = brand;
            option.innerText = brand.charAt(0).toUpperCase() + brand.slice(1);
            brandFilter.appendChild(option);
        });
    };

    const productImages = [
        "../data/images/slider/7acaa884-0cf3-4d53-aea7-945eae1e6452._SL300__.jfif",
        "../data/images/slider/OIP (1).webp",
        "../data/images/slider/OIP (2).webp",
        "../data/images/slider/OIP (3).webp",
        "../data/images/slider/OIP.webp"
    ];

    const createProductCard = (product, index) => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.dataset.id = product.id;

        card.addEventListener("click", (e) => {
            if (e.target.classList.contains("add-to-cart-btn")) return;
            window.location.href = `product.html?id=${product.id}`;
        });


        const imgContainer = document.createElement("div");
        imgContainer.className = "product-image-container";
        const img = document.createElement("img");

        img.src = productImages[product.id % productImages.length];
        img.alt = product.name;
        imgContainer.appendChild(img);

        const info = document.createElement("div");
        info.className = "product-info";

        const brand = document.createElement("p");
        brand.className = "product-brand";
        brand.innerText = product.brand;

        const name = document.createElement("h3");
        name.className = "product-name";
        name.innerText = product.name;

        const price = document.createElement("p");
        price.className = "product-price";
        price.innerText = `$${product.price}`;

        const btn = document.createElement("button");
        btn.className = "add-to-cart-btn";
        btn.innerText = "Add to Cart";
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            addToCart(product);
        });

        info.appendChild(brand);
        info.appendChild(name);
        info.appendChild(price);
        info.appendChild(btn);

        card.appendChild(imgContainer);
        card.appendChild(info);

        return card;
    };

    const renderProducts = () => {
        productsGrid.textContent = "";
        const visibleProducts = filteredProducts.slice(0, itemsToShow);

        if (visibleProducts.length === 0) {
            productsGrid.innerText = "No products found.";
            showMoreBtn.style.display = "none";
            return;
        }

        visibleProducts.forEach(product => {
            productsGrid.appendChild(createProductCard(product));
        });

        if (itemsToShow >= filteredProducts.length) {
            showMoreBtn.style.display = "none";
        } else {
            showMoreBtn.style.display = "block";
        }
    };

    const applyFiltersAndRender = () => {
        const selectedBrand = brandFilter.value;
        const selectedType = typeFilter.value;
        const maxPrice = parseInt(priceFilter.value);
        const searchQuery = searchFilter.value.toLowerCase().trim();

        priceValue.innerText = `$${maxPrice}`;

        filteredProducts = products.filter(p => {
            const brandMatch = selectedBrand === "all" || p.brand === selectedBrand;
            const typeMatch = selectedType === "all" || p.type === selectedType;
            const priceMatch = p.price <= maxPrice;
            const searchMatch = p.name.toLowerCase().includes(searchQuery);
            return brandMatch && typeMatch && priceMatch && searchMatch;
        });

        itemsToShow = itemsPerLoad;
        renderProducts();
    };

    showMoreBtn.addEventListener("click", () => {
        itemsToShow += itemsPerLoad;
        renderProducts();
    });

    brandFilter.addEventListener("change", applyFiltersAndRender);
    typeFilter.addEventListener("change", applyFiltersAndRender);
    priceFilter.addEventListener("input", applyFiltersAndRender);
    searchFilter.addEventListener("input", applyFiltersAndRender);

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

    updateCartCount();
    fetchProducts();

    const scrollTopBtn = document.getElementById("scroll-top");
    const scrollBottomBtn = document.getElementById("scroll-bottom");

    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    scrollBottomBtn.addEventListener("click", () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    });
});
