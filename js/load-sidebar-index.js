// Загружаем sidebar для главной страницы
fetch('sidebar.html')
    .then(response => response.text())
    .then(data => {
        document.querySelector('.sidebar').innerHTML = data;
        
        // Подсветка активной страницы (для index.html пути другие)
        const currentPage = 'index.html';
        document.querySelectorAll('.nav-item').forEach(item => {
            const href = item.getAttribute('href');
            if (href.includes('index.html') || (href === '../index.html')) {
                item.classList.add('active');
            }
        });
    })
    .catch(error => console.error('Ошибка загрузки sidebar:', error));