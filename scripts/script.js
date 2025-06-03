/* 
 * Алгоритм отображения букетов:
 * 1. Загрузить данные из data.json через fetch
 * 2. Отобразить данные в соответствующих секциях (главная, каталог, товар)
 * 3. Добавить фильтрацию и поиск
 * 4. Реализовать корзину с localStorage
 * 5. Управлять авторизацией и админ-панелью
 * Блок-схема: [описание текстом, так как графический файл не требуется]
 * - Начало -> Загрузка JSON -> Проверка страницы -> Рендеринг данных -> Добавление слушателей -> Конец
 * Ссылка на блок-схему: [внутренний комментарий, так как графический файл не обязателен]
 */

// Предзагрузчик
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.querySelector('.preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 1000);
});

// Загрузка букетов из JSON
async function loadBouquets() {
    try {
        const response = await fetch('data/data.json');
        if (!response.ok) throw new Error('Ошибка загрузки данных');
        return await response.json();
    } catch (error) {
        console.error('Ошибка:', error);
        return [];
    }
}

// Отображение карточки букета
function renderBouquet(bouquet) {
    const price = bouquet.discount > 0 ? bouquet.price * (1 - bouquet.discount / 100) : bouquet.price;
    const discountBadge = bouquet.discount > 0 ? `<div class="discount-badge">-${bouquet.discount}%</div>` : '';
    const priceDisplay = bouquet.discount > 0 ? `<s>${bouquet.price} ₽</s> ${price.toFixed(0)} ₽` : `${price} ₽`;
    return `
        <div class="product-card-horizontal" data-id="${bouquet.id}">
            ${discountBadge}
            <img src="${bouquet.image}" alt="${bouquet.name}" width="400" height="300" class="product-card-horizontal__img">
            <div class="product-card-horizontal__info">
                <h3 class="product-card-horizontal__name">${bouquet.name}</h3>
                <p>${bouquet.description}</p>
                <p class="product-card-horizontal__price">${priceDisplay}</p>
                <div class="product-card-horizontal__buttons">
                    <button class="product-card-horizontal__button cart-btn" type="button" onclick="addToCart(${bouquet.id})">В корзину</button>
                    <a href="product.html?id=${bouquet.id}"><button class="product-card-horizontal__button product-card-horizontal__button--buy" type="button">Купить</button></a>
                </div>
            </div>
        </div>
    `;
}

// Отображение букетов на главной странице
async function displayMainPage() {
    const bouquets = await loadBouquets();
    const bestOffers = document.getElementById('best-offers');
    const discounts = document.getElementById('discounts');
    const topBouquets = document.getElementById('top-bouquets');

    bestOffers.innerHTML = bouquets.slice(0, 6).map(renderBouquet).join('');
    discounts.innerHTML = bouquets.filter(b => b.discount > 0).map(renderBouquet).join('');

    // Используем for...in для топ-букетов
    let topHtml = '';
    for (const index in bouquets) {
        if (bouquets[index].isTop) {
            topHtml += `<div class="swiper-slide">${renderBouquet(bouquets[index])}</div>`;
        }
    }
    topBouquets.innerHTML = topHtml;

    // Инициализация Swiper
    new Swiper('.swiper-container', {
        slidesPerView: 3,
        spaceBetween: 25,
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            480: {
                slidesPerView: 1,
            },
        },
    });

    addHoverEffects();
}

// Отображение каталога
async function displayCatalog() {
    const bouquets = await loadBouquets();
    const catalogGrid = document.getElementById('catalog-grid');
    catalogGrid.innerHTML = bouquets.map(renderBouquet).join('');
    addHoverEffects();

    // Фильтрация
    document.getElementById('category-filter').addEventListener('change', (e) => {
        const category = e.target.value;
        const filtered = category ? bouquets.filter(b => b.category === category) : bouquets;
        catalogGrid.innerHTML = filtered.map(renderBouquet).join('');
        addHoverEffects();
    });
}


// Поиск
function setupSearch() {
    const searchButton = document.getElementById('search-btn');
    if (searchButton) {
        searchButton.addEventListener('click', async() => {
            const searchTerm = document.getElementById('search-input').value.toLowerCase();
            const bouquets = await loadBouquets();
            const filtered = bouquets.filter(b =>
                b.name.toLowerCase().includes(searchTerm) ||
                b.description.toLowerCase().includes(searchTerm)
            );
            const catalogGrid = document.getElementById('catalog-grid');
            if (catalogGrid) {
                catalogGrid.innerHTML = filtered.map(renderBouquet).join('');
                addHoverEffects();
            } else {
                const bestOffers = document.getElementById('best-offers');
                if (bestOffers) {
                    bestOffers.innerHTML = filtered.map(renderBouquet).join('');
                    document.getElementById('discounts').innerHTML = '';
                    document.getElementById('top-bouquets').innerHTML = '';
                    addHoverEffects();
                }
            }
        });
    }
}

// Отображение страницы товара
async function displayProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id'));
    const bouquets = await loadBouquets();
    const bouquet = bouquets.find(b => b.id === id);
    if (bouquet) {
        const price = bouquet.discount > 0 ? bouquet.price * (1 - bouquet.discount / 100) : bouquet.price;
        const discountBadge = bouquet.discount > 0 ? `<div class="discount-badge">-${bouquet.discount}%</div>` : '';
        const priceDisplay = bouquet.discount > 0 ? `<s>${bouquet.price} ₽</s> ${price.toFixed(0)} ₽` : `${price} ₽`;
        document.getElementById('product-details').innerHTML = `
            <div class="product-card-horizontal">
                ${discountBadge}
                <img src="${bouquet.image}" alt="${bouquet.name}" width="400" height="300" class="product-card-horizontal__img">
                <div class="product-card-horizontal__info">
                    <h2 class="product-card-horizontal__name">${bouquet.name}</h2>
                    <p>${bouquet.description}</p>
                    <p class="product-card-horizontal__price">${priceDisplay}</p>
                    <div class="product-card-horizontal__buttons">
                        <button class="product-card-horizontal__button cart-btn" type="button" onclick="addToCart(${bouquet.id})">В корзину</button>
                        <button class="product-card-horizontal__button product-card-horizontal__button--buy" type="button" onclick="window.location.href='order.html?id=${bouquet.id}'">Купить</button>
                    </div>
                </div>
            </div>
        `;
        addHoverEffects();
    }
}

// Корзина
function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!cart.includes(id)) {
        cart.push(id);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Товар добавлен в корзину!');
    } else {
        alert('Товар уже в корзине!');
    }
}

async function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItems = document.getElementById('cart-items');
    const bouquets = await loadBouquets();
    cartItems.innerHTML = cart.map(id => {
        const bouquet = bouquets.find(b => b.id === id);
        if (bouquet) {
            const price = bouquet.discount > 0 ? bouquet.price * (1 - bouquet.discount / 100) : bouquet.price;
            const priceDisplay = bouquet.discount > 0 ? `<s>${bouquet.price} ₽</s> ${price.toFixed(0)} ₽` : `${price} ₽`;
            return `
                <div class="product-card-horizontal" data-id="${bouquet.id}">
                    <img src="${bouquet.image}" alt="${bouquet.name}" width="400" height="300" class="product-card-horizontal__img">
                    <div class="product-card-horizontal__info">
                        <h3 class="product-card-horizontal__name">${bouquet.name}</h3>
                        <p>${bouquet.description}</p>
                        <p class="product-card-horizontal__price">${priceDisplay}</p>
                        <button class="product-card-horizontal__button cart-btn" type="button" onclick="removeFromCart(${bouquet.id})">Удалить</button>
                    </div>
                </div>
            `;
        }
        return '';
    }).join('');
    addHoverEffects();
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

// Оформление заказа
async function setupOrder() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id'));
    const cartItems = document.getElementById('cart-items');
    const bouquets = await loadBouquets();
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (id && !cart.includes(id)) {
        cart.push(id);
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    cartItems.innerHTML = cart.map(id => {
        const bouquet = bouquets.find(b => b.id === id);
        if (bouquet) {
            const price = bouquet.discount > 0 ? bouquet.price * (1 - bouquet.discount / 100) : bouquet.price;
            const priceDisplay = bouquet.discount > 0 ? `<s>${bouquet.price} ₽</s> ${price.toFixed(0)} ₽` : `${price} ₽`;
            return `
                <div class="product-card-horizontal">
                    <img src="${bouquet.image}" alt="${bouquet.name}" width="400" height="300" class="product-card-horizontal__img">
                    <div class="product-card-horizontal__info">
                        <h3 class="product-card-horizontal__name">${bouquet.name}</h3>
                        <p>${bouquet.description}</p>
                        <p class="product-card-horizontal__price">${priceDisplay}</p>
                    </div>
                </div>
            `;
        }
        return '';
    }).join('');

    document.getElementById('order-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const address = document.getElementById('address').value;
        if (name && address) {
            localStorage.removeItem('cart');
            alert('Заказ успешно оформлен!');
            window.location.href = 'index.html';
        } else {
            alert('Пожалуйста, заполните все обязательные поля.');
        }
    });
}

// Регистрация и вход
function setupAuth() {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            let users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.find(u => u.email === email)) {
                alert('Пользователь с таким email уже существует!');
            } else {
                users.push({ name, email, password, isAdmin: email === 'admin@nezhnuy-buket.ru' });
                localStorage.setItem('users', JSON.stringify(users));
                alert('Регистрация успешна!');
                window.location.href = 'login.html';
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                alert('Вход успешен!');
                window.location.href = 'index.html';
            } else {
                alert('Неверный email или пароль!');
            }
        });
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('register-btn').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'block';
        if (currentUser.isAdmin) {
            document.getElementById('admin-btn').style.display = 'block';
        }
    } else {
        document.getElementById('admin-btn').style.display = 'none';
    }

    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });

    document.getElementById('register-btn').addEventListener('click', () => {
        window.location.href = 'register.html';
    });

    document.getElementById('login-btn').addEventListener('click', () => {
        window.location.href = 'login.html';
    });

    document.getElementById('admin-btn').addEventListener('click', () => {
        window.location.href = 'admin.html';
    });
}

// Админ-панель
async function setupAdmin() {
    const addBouquetForm = document.getElementById('add-bouquet-form');
    if (addBouquetForm) {
        addBouquetForm.addEventListener('submit', async(e) => {
            e.preventDefault();
            const bouquets = await loadBouquets();
            const newBouquet = {
                id: bouquets.length ? Math.max(...bouquets.map(b => b.id)) + 1 : 1,
                name: document.getElementById('bouquet-name').value,
                description: document.getElementById('bouquet-description').value,
                price: parseFloat(document.getElementById('bouquet-price').value),
                discount: parseInt(document.getElementById('bouquet-discount').value) || 0,
                image: document.getElementById('bouquet-image').value,
                category: document.getElementById('bouquet-category').value,
                isTop: false
            };
            bouquets.push(newBouquet);
            // В реальном приложении отправить на сервер
            localStorage.setItem('bouquets', JSON.stringify(bouquets));
            alert('Букет добавлен!');
            addBouquetForm.reset();
        });
    }
}

// Эффекты hover
function addHoverEffects() {
    document.querySelectorAll('.product-card-horizontal').forEach(card => {
        card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-10px)');
        card.addEventListener('mouseleave', () => card.style.transform = 'translateY(0)');
    });
}

// Инициализация страниц
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        displayMainPage();
    } else if (window.location.pathname.includes('catalog.html')) {
        displayCatalog();
    } else if (window.location.pathname.includes('product.html')) {
        displayProduct();
    } else if (window.location.pathname.includes('order.html')) {
        setupOrder();
    } else if (window.location.pathname.includes('cart.html')) {
        displayCart();
        document.getElementById('proceed-to-order').addEventListener('click', () => {
            window.location.href = 'order.html';
        });
    } else if (window.location.pathname.includes('admin.html')) {
        setupAdmin();
    }
    setupSearch();
    setupAuth();
    document.querySelector('.menu-toggle').addEventListener('click', () => {
        const navButtons = document.querySelector('.nav__buttons');
        navButtons.classList.toggle('nav__buttons--active');
    });
});