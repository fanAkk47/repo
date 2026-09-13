// Массив товаров - это наш "склад данных"
// Корзина - пустой массив, куда будем складывать товары
// Загружаем корзину из localStorage (если она там есть)
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const products = [
    {
        id: 1,
        name: 'Ноутбук ASUS VivoBook',
        price: 65000,
        category: 'laptops',
        image: 'nout1.png'
    },
    {
        id: 2,
        name: 'iPhone 15 Pro',
        price: 95000,
        category: 'phones',
        image: 'iphone1.png'
    },
    {
        id: 3,
        name: 'AirPods Pro',
        price: 25000,
        category: 'accessories',
        image: 'airpods1.png'
    },
    {
        id: 4,
        name: 'MacBook Air M2',
        price: 120000,
        category: 'laptops',
        image: 'macbook1.png'
    },
    {
        id: 5,
        name: 'Samsung Galaxy S24',
        price: 85000,
        category: 'phones',
        image: 'samsung.png'
    },
    {
        id: 6,
        name: 'Sony WH-1000XM5',
        price: 35000,
        category: 'accessories',
        image: 'sony1.png'
    }
];

// Выведем в консоль, чтобы проверить
console.log('Товары загружены:', products);
console.log('Первый товар:', products[0]);
// Функция создаёт HTML-код для одной карточки товара
function createProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">${product.price.toLocaleString('ru-RU')} ₽</p>
            <button class="add-to-cart-btn">В корзину</button>
        </div>
    `;
}

// Функция отрисовывает все товары на странице
function renderProducts(productsToRender) {
    const container = document.querySelector('.cards-container');
    
    // Создаём HTML для всех товаров
    const cardsHTML = productsToRender.map(product => createProductCard(product)).join('');
    
    // Вставляем в контейнер
    container.innerHTML = cardsHTML;
}

// Отрисовываем все товары при загрузке страницы
renderProducts(products);
// Находим все кнопки фильтров
const filterButtons = document.querySelectorAll('.filter-btn');

// Вешаем слушатель клика на каждую кнопку
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Убираем класс 'active' у всех кнопок
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Добавляем класс 'active' только к нажатой кнопке
        this.classList.add('active');
        
        // Получаем категорию из data-атрибута
        const category = this.dataset.category;
        
        // Фильтруем товары
        if (category === 'all') {
            renderProducts(products); // Показываем все
        } else {
            const filteredProducts = products.filter(product => product.category === category);
            renderProducts(filteredProducts); // Показываем только отфильтрованные
        }
    });
});
// Функция обновления счётчика корзины в шапке
// Функция обновления счётчика корзины в шапке
function updateCartCount() {
    const countElement = document.getElementById('cart-count');
    countElement.textContent = cart.length;
    
    // Сохраняем корзину в localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Функция добавления товара в корзину
function addToCart(productId) {
    // Находим товар в массиве products по id
    const product = products.find(p => p.id === productId);
    
    if (product) {
        cart.push(product); // Добавляем в корзину
        updateCartCount(); // Обновляем счётчик
        console.log('Добавлено в корзину:', product.name);
        console.log('Всего товаров:', cart.length);
    }
}

// Вешаем обработчики кликов на кнопки "В корзину"
// Используем делегирование событий (об этом ниже)
document.querySelector('.cards-container').addEventListener('click', function(event) {
    // Проверяем, кликнули ли мы именно по кнопке "В корзину"
    if (event.target.classList.contains('add-to-cart-btn')) {
        // Находим карточку-родителя кнопки
        const card = event.target.closest('.product-card');
        // Достаём id товара из data-атрибута
        const productId = Number(card.dataset.id);
        // Добавляем в корзину
        addToCart(productId);
    }
});
// Функция открытия корзины
function openCart() {
    document.getElementById('cart-panel').classList.add('active');
    document.getElementById('cart-overlay').classList.add('active');
    renderCartItems();
}

// Функция закрытия корзины
function closeCart() {
    document.getElementById('cart-panel').classList.remove('active');
    document.getElementById('cart-overlay').classList.remove('active');
}

// Функция отрисовки товаров в корзине
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #666;">Корзина пуста</p>';
        document.getElementById('cart-total-price').textContent = '0 ₽';
        return;
    }
    
    // Создаём HTML для каждого товара в корзине
    const itemsHTML = cart.map((item, index) => `
        <div class="cart-item" data-index="${index}">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="price">${item.price.toLocaleString('ru-RU')} ₽</p>
                <button class="remove-from-cart-btn" data-index="${index}">Удалить</button>
            </div>
        </div>
    `).join('');
    
    cartItemsContainer.innerHTML = itemsHTML;
    
    // Считаем общую сумму
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('cart-total-price').textContent = total.toLocaleString('ru-RU') + ' ₽';
}

// Обработчик клика на иконку корзины (открытие)
document.querySelector('.cart-icon').addEventListener('click', openCart);

// Обработчик клика на кнопку закрытия
document.getElementById('close-cart-btn').addEventListener('click', closeCart);

// Обработчик клика на overlay (закрытие при клике вне панели)
document.getElementById('cart-overlay').addEventListener('click', closeCart);

// Делегирование событий для кнопок "Удалить" в корзине
document.getElementById('cart-items').addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-from-cart-btn')) {
        const index = Number(event.target.dataset.index);
        cart.splice(index, 1); // Удаляем товар из массива
        updateCartCount();
        renderCartItems();
    }
});
// При загрузке страницы обновляем счётчик и отрисовываем корзину (если она не пуста)
updateCartCount();
if (cart.length > 0) {
    renderCartItems();
}
// Функция открытия формы заказа
function openCheckout() {
    if (cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }
    
    // Отрисовываем список товаров в форме
    const orderItemsContainer = document.getElementById('order-items');
    const itemsHTML = cart.map(item => `
        <div class="order-item">
            <span>${item.name}</span>
            <span>${item.price.toLocaleString('ru-RU')} ₽</span>
        </div>
    `).join('');
    orderItemsContainer.innerHTML = itemsHTML;
    
    // Считаем общую сумму
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    document.getElementById('order-total-price').textContent = total.toLocaleString('ru-RU') + ' ₽';
    
    // Показываем модальное окно
    document.getElementById('checkout-modal').classList.add('active');
    document.getElementById('checkout-overlay').classList.add('active');
}

// Функция закрытия формы заказа
function closeCheckout() {
    document.getElementById('checkout-modal').classList.remove('active');
    document.getElementById('checkout-overlay').classList.remove('active');
}

// Обработчик клика на кнопку "Оформить заказ" в корзине
document.querySelector('.checkout-btn').addEventListener('click', openCheckout);

// Обработчик клика на кнопку закрытия модального окна
document.getElementById('close-checkout-btn').addEventListener('click', closeCheckout);

// Обработчик клика на overlay модального окна
document.getElementById('checkout-overlay').addEventListener('click', closeCheckout);

// Обработчик отправки формы
document.getElementById('checkout-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Предотвращаем стандартную отправку формы
    
    // Получаем данные из формы
    const formData = new FormData(this);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const address = formData.get('address');
    
    // Валидация телефона (простая проверка)
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(phone)) {
        alert('Пожалуйста, введите корректный номер телефона');
        return;
    }
    
    // Имитация отправки заказа (в реальном приложении здесь был бы запрос на сервер)
    console.log('Заказ оформлен:');
    console.log('Имя:', name);
    console.log('Телефон:', phone);
    console.log('Адрес:', address);
    console.log('Товары:', cart);
    
    // Показываем сообщение об успехе
    const modal = document.getElementById('checkout-modal');
    modal.innerHTML = `
        <div class="success-message">
            <h2>✓ Заказ оформлен!</h2>
            <p>Спасибо за покупку, ${name}!</p>
            <p>Мы свяжемся с вами по телефону ${phone}</p>
            <button class="submit-order-btn" onclick="location.reload()">Вернуться в магазин</button>
        </div>
    `;
    
    // Очищаем корзину
    cart = [];
    localStorage.removeItem('cart');
    updateCartCount();
});