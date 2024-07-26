const socket = io();

// Cuando se crea un producto
socket.on('productCreated', () => {
    fetch('/api/products')
        .then(response => response.json())
        .then(products => updateProductList(products));
});

// Cuando se elimina un producto
socket.on('productDeleted', () => {
    fetch('/api/products')
        .then(response => response.json())
        .then(products => updateProductList(products));
});

function updateProductList(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    products.forEach(product => {
        const productItem = document.createElement('li');
        productItem.innerHTML = `
            <h3>${product.title}</h3>
            <p>Descripción: ${product.description}</p>
            <p>Código: ${product.code}</p>
            <p>Precio: $${product.price}</p>
            <p>Stock: ${product.stock}</p>
            <p>Categoría: ${product.category}</p>
            <p>Thumbnails: ${product.thumbnails.join(' ')}</p>
        `;
        productList.appendChild(productItem);
    });
}
