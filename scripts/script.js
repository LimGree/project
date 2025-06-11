// Алгоритм для функции loadCardTitles:
// Найти элемент с id="card-titles" и сохранить в переменную titlesList.
// Проверить, существует ли titlesList:
// Если нет:
// – Вывести в консоль ошибку:
// "Ошибка: Список заголовков не найден."
// – Завершить выполнение функции.
// Найти все элементы с классом .card__title и сохранить в переменную titleElements.
// Проверить, найдены ли элементы:
// Если нет:
// – Вывести в консоль ошибку:
// "Ошибка: Заголовки карточек не найдены."
// – Завершить выполнение функции.
// Создать массив cardTitles, содержащий текст каждого элемента из titleElements.
// Очистить содержимое элемента titlesList.
// Для каждого заголовка в cardTitles:
// Создать новый элемент <li>.
// Установить текст заголовка как содержимое <li>.
// Добавить класс card-titles__item к <li>.
// Добавить элемент <li> в titlesList.
// Вывести в консоль список заголовков:
// "Заголовки букетов загружены:", cardTitles.
// Блок-схема: images/diagram.png.

// Управление прелоадером
function showContent() {
    const preloaderElement = document.getElementById('preloader');
    const contentElement = document.getElementById('content');

    if (!preloaderElement || !contentElement) {
        console.error('Ошибка: Не найдены элементы прелоадера или контента.');
        return;
    }

    setTimeout(() => {
        preloaderElement.style.opacity = '0';
        setTimeout(() => {
            preloaderElement.style.display = 'none';
            contentElement.style.display = 'block';
            contentElement.classList.add('show');
            console.log('Контент отображён');
            if (window.getComputedStyle(contentElement).display === 'none') {
                console.error('Ошибка: Контент всё ещё скрыт, проверьте CSS.');
            }
        }, 1000);
    }, 3000);
}

// Обработка кликов по навигации
function handleLinksClick() {
    const links = document.querySelectorAll('.links-link');
    if (links.length === 0) {
        console.error('Ошибка: Ссылки навигации не найдены.');
        return;
    }

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach(link => {
        const page = link.getAttribute('href').split('/').pop() || 'index.html';
        if (page === currentPage) {
            link.classList.add('links-link--active');
        }
        link.addEventListener('click', function(event) {
            if (this.dataset.page === 'logout') {
                event.preventDefault();
                localStorage.removeItem('user');
                console.log('Пользователь вышел.');
                window.location.href = 'index.html';
            } else {
                links.forEach(l => l.classList.remove('links-link--active'));
                this.classList.add('links-link--active');
                console.log(`Выбран пункт навигации: ${this.dataset.page}`);
            }
        });
    });
}

// Гамбургер-меню
function handleBurgerMenu() {
    const burger = document.querySelector('.burger-menu');
    const navList = document.querySelector('.links-list');
    if (!burger || !navList) {
        console.error('Ошибка: Бургер-меню или список навигации не найдены.');
        return;
    }

    burger.addEventListener('click', () => {
        navList.classList.toggle('show');
        console.log('Меню открыто/закрыто.');
    });
}

// Инициализация Swiper
function initSwiper() {
    if (!window.Swiper) {
        console.error('Ошибка: Swiper не загружен.');
        return;
    }

    const swiperContainer = document.querySelector('.cards__carousel');
    if (!swiperContainer) {
        console.error('Ошибка: Контейнер карусели (.cards__carousel) не найден.');
        return;
    }

    const prevButton = swiperContainer.querySelector('.swiper-button-prev');
    const nextButton = swiperContainer.querySelector('.swiper-button-next');
    console.log('Кнопки навигации:', { prevButton: !!prevButton, nextButton: !!nextButton });

    const swiper = new Swiper('.cards__carousel', {
        slidesPerView: 2,
        spaceBetween: 20,
        loop: true,
        navigation: {
            nextEl: '.swiper-button-prev',
            prevEl: '.swiper-button-next',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            1200: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 1,
            }
        }
    });

    console.log('Swiper инициализирован.');
    if (prevButton) prevButton.addEventListener('click', () => console.log('Нажата кнопка "Назад"'));
    if (nextButton) nextButton.addEventListener('click', () => console.log('Нажата кнопка "Вперёд"'));
}

// Обработка кликов и наведения на карточки
function handleCardClick() {
    const cards = document.querySelectorAll('.card');
    if (cards.length === 0) {
        console.error('Ошибка: Карточки не найдены.');
        return;
    }

    cards.forEach(card => {
        card.addEventListener('click', function(event) {
            if (!event.target.classList.contains('card__add-to-cart')) {
                cards.forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                console.log(`Выбран букет: ${this.dataset.section}`);
            }
        });
        card.addEventListener('mouseover', function() {
            console.log(`Наведение на букет: ${this.dataset.section}`);
        });
    });
}

// Вывод заголовков карточек
function loadCardTitles() {
    const titlesList = document.getElementById('card-titles');
    if (!titlesList) {
        console.error('Ошибка: Список заголовков не найден.');
        return;
    }

    const titleElements = document.querySelectorAll('.card__title');
    if (titleElements.length === 0) {
        console.error('Ошибка: Заголовки карточек не найдены.');
        return;
    }

    const cardTitles = Array.from(titleElements).map(element => element.textContent);
    titlesList.innerHTML = '';
    cardTitles.forEach(title => {
        const listItem = document.createElement('li');
        listItem.textContent = title;
        listItem.classList.add('card-titles__item');
        titlesList.appendChild(listItem);
    });

    console.log('Заголовки букетов загружены:', cardTitles);
}

// Обработка формы поиска
function handleSearchForm() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    if (!searchForm || !searchInput) {
        console.error('Ошибка: Форма или поле поиска не найдены.');
        return;
    }

    const savedSearch = localStorage.getItem('searchQuery');
    if (savedSearch) {
        searchInput.value = savedSearch;
        console.log('Восстановлен поисковый запрос:', savedSearch);
    }

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            localStorage.setItem('searchQuery', query);
            console.log('Поисковый запрос сохранён:', query);
            alert(`Поиск: ${query}`);
            if (window.location.pathname.includes('catalog.html')) {
                loadCatalog(query);
            }
        } else {
            console.warn('Поисковый запрос пустой.');
        }
    });
}

// Загрузка отзывов
function loadReviews(filterCategory = 'all') {
    const reviewsList = document.getElementById('reviews-list');
    if (!reviewsList) {
        console.error('Ошибка: Список отзывов не найден.');
        return;
    }

    const reviewsData = [
        { id: 'review1', title: 'Прекрасный букет "Нежность"', category: 'roses', text: 'Свежие цветы, быстрая доставка!' },
        { id: 'review2', title: 'Любовь к розам', category: 'roses', text: 'Розы стояли долго!' },
        { id: 'review3', title: 'Сиреневый рай', category: 'hydrangeas', text: 'Гортензии просто волшебные!' },
        { id: 'review4', title: 'Фиолетовая мечта', category: 'hydrangeas', text: 'Аромат потрясающий.' },
        { id: 'review5', title: 'Розовые мечты', category: 'peonies', text: 'Пионы восхитительны!' },
        { id: 'review6', title: 'Нежные пионы', category: 'peonies', text: 'Букет превзошёл ожидания.' },
        { id: 'review7', title: 'Весеннее настроение', category: 'tulips', text: 'Тюльпаны подняли настроение!' },
        { id: 'review8', title: 'Яркие тюльпаны', category: 'tulips', text: 'Очень свежие цветы.' },
        { id: 'review9', title: 'Классика роз', category: 'roses', text: 'Идеальный подарок.' },
        { id: 'review10', title: 'Пионы для любви', category: 'peonies', text: 'Букет шикарный!' },
    ];

    reviewsList.innerHTML = '';
    reviewsData.forEach(review => {
        if (filterCategory === 'all' || review.category === filterCategory) {
            const listItem = document.createElement('li');
            listItem.classList.add('reviews__item');
            const link = document.createElement('a');
            link.href = '#';
            link.classList.add('reviews__link');
            link.dataset.title = review.id;
            link.textContent = review.text;
            listItem.appendChild(link);
            reviewsList.appendChild(listItem);
        }
    });

    console.log(`Список отзывов загружен с фильтром: ${filterCategory}`);
}

// Фильтрация отзывов
function filterReviews() {
    const filterButtons = document.querySelectorAll('.reviews__filter-button');
    if (filterButtons.length === 0) {
        console.error('Ошибка: Кнопки фильтрации не найдены.');
        return;
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const selectedCategory = this.dataset.filter;
            if (!['all', 'roses', 'peonies', 'tulips', 'hydrangeas'].includes(selectedCategory)) {
                console.error('Ошибка: Неверная категория фильтра.');
                return;
            }
            loadReviews(selectedCategory);
            console.log(`Применён фильтр: ${selectedCategory}`);
        });
    });
}

// Обработка кликов по отзывам
function handleReviewClick() {
    const reviewsList = document.getElementById('reviews-list');
    if (!reviewsList) {
        console.error('Ошибка: Список отзывов не найден.');
        return;
    }

    reviewsList.addEventListener('click', event => {
        if (event.target.classList.contains('reviews__link')) {
            event.preventDefault();
            console.log(`Выбран отзыв: ${event.target.dataset.title}`);
        }
    });
}

// Загрузка данных из JSON
async function fetchCardsData() {
    try {
        const response = await fetch('data/bouquets.json');
        if (!response.ok) {
            throw new Error(`Ошибка загрузки JSON: ${response.status}`);
        }
        const data = await response.json();
        console.log('Данные из JSON загружены:', data);
        return data;
    } catch (error) {
        console.error('Ошибка при загрузке JSON:', error);
        return [];
    }
}

// Рендеринг динамического блока
async function renderDynamicCards() {
    const container = document.getElementById('dynamic-cards');
    if (!container) {
        console.error('Ошибка: Контейнер для динамических карточек не найден.');
        return;
    }

    const bouquets = await fetchCardsData();
    if (!bouquets.length) {
        console.error('Ошибка: Данные не загружены.');
        return;
    }

    const categories = [...new Set(bouquets.map(b => b.category))];
    const titleElement = document.createElement('h3');
    titleElement.classList.add('dynamic-cards__title');
    titleElement.textContent = 'Категории букетов';

    const listElement = document.createElement('ul');
    listElement.classList.add('dynamic-cards__list');

    categories.forEach(category => {
        const itemElement = document.createElement('li');
        itemElement.classList.add('dynamic-cards__item');
        const title = document.createElement('div');
        title.classList.add('dynamic-cards__item-title');
        title.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        const description = document.createElement('p');
        description.classList.add('dynamic-cards__item-description');
        description.textContent = `Букеты из ${category}`;
        itemElement.appendChild(title);
        itemElement.appendChild(description);
        listElement.appendChild(itemElement);
    });

    container.appendChild(titleElement);
    container.appendChild(listElement);
    console.log('Динамический блок загружен.');
}

// Загрузка страницы продукта
async function loadProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const bouquetId = urlParams.get('id');
    if (!bouquetId) {
        console.error('Ошибка: ID букета не указан.');
        return;
    }

    const bouquets = await fetchCardsData();
    const bouquet = bouquets.find(b => b.id == bouquetId);
    if (!bouquet) {
        console.error('Ошибка: Букет не найден.');
        return;
    }

    document.getElementById('product-title').textContent = bouquet.name;
    document.getElementById('product-image').src = bouquet.image;
    document.getElementById('product-image').alt = bouquet.name;
    document.getElementById('product-description').textContent = bouquet.description;
    document.getElementById('product-price').textContent = `Цена: ${bouquet.price} ₽`;
    document.getElementById('product-discount').textContent = bouquet.discount ? `Скидка: ${bouquet.discount}%` : '';
    document.querySelector('.product__add-to-cart').dataset.id = bouquet.id;

    console.log('Страница продукта загружена:', bouquet);
}

// Загрузка каталога
async function loadCatalog(searchQuery = '') {
    const catalogList = document.getElementById('catalog-list');
    if (!catalogList) {
        console.error('Ошибка: Список каталога не найден.');
        return;
    }

    const bouquets = await fetchCardsData();
    const filterButtons = document.querySelectorAll('.catalog__filter-button');
    let activeFilter = 'all';

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            activeFilter = this.dataset.filter;
            renderCatalog(bouquets, activeFilter, searchQuery);
        });
    });

    renderCatalog(bouquets, activeFilter, searchQuery);
}

function renderCatalog(bouquets, filter, searchQuery) {
    const catalogList = document.getElementById('catalog-list');
    catalogList.innerHTML = '';

    const filteredBouquets = bouquets.filter(b => {
        const matchesFilter = filter === 'all' || b.category === filter;
        const matchesSearch = !searchQuery || b.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    filteredBouquets.forEach(bouquet => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.dataset.section = `bouquet-${bouquet.id}`;
                card.innerHTML = `
            <img src="${bouquet.image}" alt="${bouquet.name}" class="card__image">
            <h3 class="card__title"><a href="product.html?id=${bouquet.id}">${bouquet.name}</a></h3>
            <p>${bouquet.description}</p>
            <p>Цена: ${bouquet.price} ₽</p>
            ${bouquet.discount ? `<p>Скидка: ${bouquet.discount}%</p>` : ''}
            <button class="card__add-to-cart" data-id="${bouquet.id}">Добавить в корзину</button>
        `;
        catalogList.appendChild(card);
    });

    console.log(`Каталог загружен с фильтром: ${filter}, поиск: ${searchQuery}`);
}

// Управление корзиной
function handleCart() {
    const cartButtons = document.querySelectorAll('.card__add-to-cart, .product__add-to-cart');
    cartButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const bouquetId = button.dataset.id;
            const bouquets = await fetchCardsData();
            const bouquet = bouquets.find(b => b.id == bouquetId);
            if (!bouquet) {
                console.error('Ошибка: Букет не найден.');
                return;
            }

            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existingItem = cart.find(item => item.id == bouquetId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...bouquet, quantity: 1 });
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            console.log('Букет добавлен в корзину:', bouquet);
            alert(`${bouquet.name} добавлен в корзину!`);
        });
    });
}

function loadCart() {
    const cartList = document.getElementById('cart-list');
    const cartTotal = document.getElementById('cart-total');
    if (!cartList || !cartTotal) {
        console.error('Ошибка: Элементы корзины не найдены.');
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cartList.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity * (1 - (item.discount || 0) / 100);
        total += itemTotal;
        const li = document.createElement('li');
        li.classList.add('cart__item');
        li.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <span>${itemTotal.toFixed(2)} ₽</span>
            <button class="cart__remove" data-id="${item.id}">Удалить</button>
        `;
        cartList.appendChild(li);
    });

    cartTotal.textContent = `Итого: ${total.toFixed(2)} ₽`;

    document.querySelectorAll('.cart__remove').forEach(button => {
        button.addEventListener('click', () => {
            const id = button.dataset.id;
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            cart = cart.filter(item => item.id != id);
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCart();
            console.log(`Букет ID ${id} удалён из корзины.`);
        });
    });

    console.log('Корзина загружена:', cart);
}

function loadOrder() {
    const orderList = document.getElementById('order-list');
    const orderTotal = document.getElementById('order-total');
    if (!orderList || !orderTotal) {
        console.error('Ошибка: Элементы заказа не найдены.');
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    orderList.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity * (1 - (item.discount || 0) / 100);
        total += itemTotal;
        const li = document.createElement('li');
        li.classList.add('order__item');
        li.innerHTML = `
            <span>${item.name} (x${item.quantity})</span>
            <span>${itemTotal.toFixed(2)} ₽</span>
        `;
        orderList.appendChild(li);
    });

    orderTotal.textContent = `Итого: ${total.toFixed(2)} ₽`;
    console.log('Заказ загружен:', cart);
}

// Обработка формы заказа
function handleOrderForm() {
    const orderForm = document.getElementById('order-form');
    if (!orderForm) {
        console.error('Ошибка: Форма заказа не найдена.');
        return;
    }

    orderForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const address = document.getElementById('address').value;
        const message = document.getElementById('message').value;
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');

        if (!cart.length) {
            alert('Корзина пуста!');
            return;
        }

        console.log('Заказ оформлен:', { name, address, message, cart });
        alert('Заказ успешно оформлен!');
        localStorage.removeItem('cart');
        window.location.href = 'index.html';
    });
}

// Обработка формы регистрации
function handleRegisterForm() {
    const registerForm = document.getElementById('register-form');
    if (!registerForm) {
        console.error('Ошибка: Форма регистрации не найдена.');
        return;
    }

    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        localStorage.setItem('user', JSON.stringify({ name, email, password }));
        console.log('Пользователь зарегистрирован:', { name, email });
        alert('Регистрация успешна! Пожалуйста, войдите.');
        window.location.href = 'login.html';
    });
}

// Обработка формы входа
function handleLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) {
        console.error('Ошибка: Форма входа не найдена.');
        return;
    }

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        if (user.email === email && user.password === password) {
            console.log('Вход выполнен:', email);
            alert('Вход успешен!');
            window.location.href = 'index.html';
        } else {
            console.error('Ошибка входа: неверные данные.');
            alert('Неверный email или пароль.');
        }
    });
}

// Обработка формы админ-панели
function handleAdminForm() {
    const adminForm = document.getElementById('admin-form');
    if (!adminForm) {
        console.error('Ошибка: Форма админ-панели не найдена.');
        return;
    }

    adminForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const description = document.getElementById('description').value;
        const price = parseFloat(document.getElementById('price').value);
        const discount = parseInt(document.getElementById('discount').value) || 0;
        const image = document.getElementById('image').value;
        const category = document.getElementById('category').value;

        const bouquets = await fetchCardsData();
        const newBouquet = {
            id: bouquets.length ? Math.max(...bouquets.map(b => b.id)) + 1 : 1,
            name,
            description,
            price,
            discount,
            image,
            category,
            isTop: false
        };

        // Имитация добавления в JSON (в реальном проекте нужен сервер)
        bouquets.push(newBouquet);
        localStorage.setItem('bouquets', JSON.stringify(bouquets));
        console.log('Букет добавлен:', newBouquet);
        alert('Букет добавлен!');
        adminForm.reset();
    });
}

// Обработка формы подписки
function handleSubscribeForm() {
    const subscribeForms = document.querySelectorAll('.subscribe-form');
    subscribeForms.forEach(form => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = form.querySelector('input[type="email"]').value;
            console.log('Подписка оформлена:', email);
            alert('Вы успешно подписались!');
            form.reset();
        });
    });
}

// Обработка кнопки скролла
function handleScrollTop() {
    const scrollTopButton = document.getElementById('scroll-top');
    if (!scrollTopButton) {
        console.error('Ошибка: Кнопка скролла не найдена.');
        return;
    }

    scrollTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        console.log('Скролл к началу страницы.');
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopButton.classList.add('visible');
        } else {
            scrollTopButton.classList.remove('visible');
        }
    });
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    showContent();
    handleLinksClick();
    handleBurgerMenu();
    handleSearchForm();
    handleSubscribeForm();
    handleScrollTop();
    handleCart();

    if (window.location.pathname.includes('index.html')) {
        initSwiper();
        handleCardClick();
        loadCardTitles();
        loadReviews();
        filterReviews();
        handleReviewClick();
        renderDynamicCards();
    } else if (window.location.pathname.includes('product.html')) {
        loadProduct();
    } else if (window.location.pathname.includes('catalog.html')) {
        loadCatalog();
    } else if (window.location.pathname.includes('cart.html')) {
        loadCart();
    } else if (window.location.pathname.includes('order.html')) {
        loadOrder();
        handleOrderForm();
    } else if (window.location.pathname.includes('register.html')) {
        handleRegisterForm();
    } else if (window.location.pathname.includes('login.html')) {
        handleLoginForm();
    } else if (window.location.pathname.includes('admin.html')) {
        handleAdminForm();
    }
});
