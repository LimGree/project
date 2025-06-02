document.querySelector('.search-bar button').addEventListener('click', () => {
  const query = document.querySelector('.search-bar input').value;
  alert(`Поиск: ${query}`);
});

// Добавим базовую имитацию загрузки товаров
const grids = document.querySelectorAll('.grid');
grids.forEach(grid => {
  for (let i = 0; i < 6; i++) {
    const item = document.createElement('div');
    item.textContent = 'Букет';
    item.style.textAlign = 'center';
    item.style.lineHeight = '100px';
    grid.appendChild(item);
  }
});
