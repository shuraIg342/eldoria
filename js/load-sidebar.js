// Загружаем sidebar для страниц в папке sections/
fetch('../sidebar.html')
    .then(response => response.text())
    .then(data => {
        document.querySelector('.sidebar').innerHTML = data;
        
        // Подсветка активной страницы
        const currentPage = window.location.pathname.split('/').pop();
        document.querySelectorAll('.nav-item').forEach(item => {
            const href = item.getAttribute('href');
            if (href === currentPage) {
                item.classList.add('active');
            }
        });
    })
    .catch(error => console.error('Ошибка загрузки sidebar:', error));