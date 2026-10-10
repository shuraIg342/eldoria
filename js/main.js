// ===== ПРИВЕТСТВЕННЫЙ БАННЕР =====
const welcomeBanner = document.getElementById('welcome-banner');
const mainContent = document.getElementById('main-content');

if (welcomeBanner && mainContent) {
    welcomeBanner.addEventListener('click', () => {
        welcomeBanner.classList.add('dismissed');
        setTimeout(() => {
            welcomeBanner.style.display = 'none';
            mainContent.classList.add('visible');
        }, 1000);
    });
}

// ===== ГЕНЕРАЦИЯ ЧАСТИЦ =====
function createParticle() {
    if (!welcomeBanner) return;
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 10 + 's';
    particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
    welcomeBanner.appendChild(particle);
}

// Создаём начальные частицы
for (let i = 0; i < 20; i++) {
    createParticle();
}

// ===== АНИМАЦИЯ ПОЯВЛЕНИЯ ЭЛЕМЕНТОВ ПРИ СКРОЛЛЕ =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Наблюдаем за карточками
document.querySelectorAll('.card, .map-card, .term-card, .resident-card, .class-detail').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});