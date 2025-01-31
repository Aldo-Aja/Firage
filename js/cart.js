document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartContainer = document.getElementById('cart-items'); // Ensure this exists in your cart page
    const totalPriceElement = document.getElementById('total-price'); // For total price display

    function updateCartUI() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartContainer.innerHTML = '';

        let total = 0;
        cart.forEach((item, index) => {
            total += parseInt(item.price); // Ensure price is treated as an integer

            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item', 'd-flex', 'justify-content-between', 'align-items-center', 'mb-3');
            cartItem.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="${item.image}" class="border rounded me-3" style="width: 80px; height: 80px;" />
                    <div>
                        <p class="mb-1">${item.name}</p>
                        <p class="text-muted">Rp. ${parseInt(item.price).toLocaleString('id-ID')}</p>
                    </div>
                </div>
                <button class="btn btn-danger btn-sm remove-from-cart" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartContainer.appendChild(cartItem);
        });

        // Update total price display
        totalPriceElement.textContent = `Rp. ${total.toLocaleString('id-ID')}`;
        addRemoveEventListeners();
    }

    function addRemoveEventListeners() {
        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', function () {
                const index = this.getAttribute('data-index');
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartUI();
            });
        });
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-product-id');
            const productName = this.closest('.card-body').querySelector('.card-text').textContent;
            const productPrice = parseInt(
                this.closest('.card-body').querySelector('h5').textContent.replace(/\D/g, '') // Remove all non-numeric characters
            );
            const productImage = this.closest('.card').querySelector('.card-img-top').src;

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart.push({ id: productId, name: productName, price: productPrice, image: productImage });
            localStorage.setItem('cart', JSON.stringify(cart));

            updateCartUI();
            alert(`${productName} added to cart!`);
        });
    });

    updateCartUI();
});
