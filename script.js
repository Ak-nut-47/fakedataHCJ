const productDataUrl = 'https://weak-gold-iguana-suit.cyclic.app/fakedata';
const productList = document.querySelector('.product-list');
const sortSelect = document.getElementById('sortSelect');
const checkboxes = document.querySelectorAll('input[type="checkbox"]');

let products = [];

// Fetch data from the server
fetch(productDataUrl)
    .then(response => response.json())
    .then(data => {
        products = data;
        renderProducts(products);
    })
    .catch(error => console.error('Error fetching data:', error));

// Render products
function renderProducts(productsToRender) {
    productList.innerHTML = '';
    productsToRender.forEach(product => {
        const card = createProductCard(product);
        productList.appendChild(card);
    });
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.innerHTML = `
        <img src="${product.avatar}" alt="${product.name}">
        <h2>${product.name}</h2>
        <p>Product: ${product.product}</p>
        <p>Price: $${product.price}</p>
        <p>Material: ${product.material}</p>
    `;
    return card;
}

// Event listeners for filters
sortSelect.addEventListener('change', () => {
    const sortBy = sortSelect.value;
    const sortedProducts = sortProducts(products, sortBy);
    renderProducts(sortedProducts);
});

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const filters = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        const filteredProducts = filterProducts(products, filters);
        renderProducts(filteredProducts);
    });
});

// Sorting products
function sortProducts(productsToSort, sortBy) {
    const sortedProducts = [...productsToSort];
    sortedProducts.sort((a, b) => {
        const aPrice = parseFloat(a.price);
        const bPrice = parseFloat(b.price);
        if (sortBy === 'asc') {
            return aPrice - bPrice;
        } else {
            return bPrice - aPrice;
        }
    });
    return sortedProducts;
}

// Filtering products
function filterProducts(productsToFilter, filters) {
    if (filters.length === 0) {
        return productsToFilter;
    }
    return productsToFilter.filter(product => filters.includes(product.product));
}
// ----------------------------url updation ---------------->>>>>>>>>>>>>>>>>>>>>>>>

// ... (Previous code)

// Update URL query parameters
function updateURLParams(sortBy, filters) {
    const params = new URLSearchParams();
    if (sortBy) {
        params.set('sort', sortBy);
    }
    filters.forEach(filter => {
        params.append('filter', filter);
    });
    const newURL = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newURL);
}

// Event listeners for filters
sortSelect.addEventListener('change', () => {
    const sortBy = sortSelect.value;
    const sortedProducts = sortProducts(products, sortBy);
    renderProducts(sortedProducts);
    const activeFilters = getActiveFilters();
    updateURLParams(sortBy, activeFilters);
});

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const activeFilters = getActiveFilters();
        const filteredProducts = filterProducts(products, activeFilters);
        renderProducts(filteredProducts);
        const sortBy = sortSelect.value;
        updateURLParams(sortBy, activeFilters);
    });
});

// Retrieve active filters
function getActiveFilters() {
    return Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);
}

// Initial load: parse URL and apply filters if any
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sortBy = urlParams.get('sort');
    const filters = urlParams.getAll('filter');

    if (sortBy) {
        sortSelect.value = sortBy;
        const sortedProducts = sortProducts(products, sortBy);
        renderProducts(sortedProducts);
    }

    checkboxes.forEach(checkbox => {
        if (filters.includes(checkbox.value)) {
            checkbox.checked = true;
        }
    });

    const filteredProducts = filterProducts(products, filters);
    renderProducts(filteredProducts);
});

// ... (Rest of the code)
