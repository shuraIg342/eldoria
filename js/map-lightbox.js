// Lightbox для просмотра карт в полном размере с зумом
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('map-modal');
    const modalImage = modal.querySelector('.map-modal-image');
    const modalCaption = modal.querySelector('.map-modal-caption');
    const closeBtn = modal.querySelector('.map-modal-close');
    const clickableMaps = document.querySelectorAll('.map-clickable');
    const zoomInBtn = modal.querySelector('.zoom-in');
    const zoomOutBtn = modal.querySelector('.zoom-out');
    const zoomResetBtn = modal.querySelector('.zoom-reset');
    const imageWrapper = modal.querySelector('.map-image-wrapper');

    let scale = 1;
    let panning = false;
    let pointX = 0;
    let pointY = 0;
    let startX = 0;
    let startY = 0;

    // Открытие модалки при клике на карту
    clickableMaps.forEach(container => {
        container.addEventListener('click', function() {
            const img = this.querySelector('img');
            const fullSrc = img.getAttribute('data-full') || img.src;
            const alt = img.alt;

            modalImage.src = fullSrc;
            modalCaption.textContent = alt;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Сброс зума при открытии
            resetZoom();
        });
    });

    // Закрытие по кнопке
    closeBtn.addEventListener('click', closeModal);

    // Закрытие по клику на фон
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target === imageWrapper) {
            closeModal();
        }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Зум колёсиком мыши
    imageWrapper.addEventListener('wheel', function(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        zoom(delta);
    }, { passive: false });

    // Кнопки зума
    zoomInBtn.addEventListener('click', () => zoom(1.2));
    zoomOutBtn.addEventListener('click', () => zoom(0.8));
    zoomResetBtn.addEventListener('click', resetZoom);

    // Pan (перетаскивание) для ПК
    modalImage.addEventListener('mousedown', function(e) {
        e.preventDefault();
        panning = true;
        startX = e.clientX - pointX;
        startY = e.clientY - pointY;
        modalImage.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', function(e) {
        if (!panning) return;
        e.preventDefault();
        pointX = e.clientX - startX;
        pointY = e.clientY - startY;
        updateTransform();
    });

    document.addEventListener('mouseup', function() {
        panning = false;
        modalImage.style.cursor = 'grab';
    });

    // Touch события для мобильных (pinch to zoom)
    let initialDistance = 0;
    let initialScale = 1;

    imageWrapper.addEventListener('touchstart', function(e) {
        if (e.touches.length === 2) {
            initialDistance = getDistance(e.touches);
            initialScale = scale;
        } else if (e.touches.length === 1) {
            panning = true;
            startX = e.touches[0].clientX - pointX;
            startY = e.touches[0].clientY - pointY;
        }
    }, { passive: false });

    imageWrapper.addEventListener('touchmove', function(e) {
        if (e.touches.length === 2) {
            e.preventDefault();
            const distance = getDistance(e.touches);
            const newScale = initialScale * (distance / initialDistance);
            setScale(newScale);
        } else if (e.touches.length === 1 && panning) {
            e.preventDefault();
            pointX = e.touches[0].clientX - startX;
            pointY = e.touches[0].clientY - startY;
            updateTransform();
        }
    }, { passive: false });

    imageWrapper.addEventListener('touchend', function() {
        panning = false;
    });

    // Вспомогательные функции
    function getDistance(touches) {
        const dx = touches[0].clientX - touches[1].clientX;
        const dy = touches[0].clientY - touches[1].clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function zoom(factor) {
        const newScale = scale * factor;
        setScale(Math.max(0.5, Math.min(newScale, 5))); // Ограничение от 0.5x до 5x
    }

    function setScale(newScale) {
        scale = newScale;
        updateTransform();
    }

    function resetZoom() {
        scale = 1;
        pointX = 0;
        pointY = 0;
        updateTransform();
    }

    function updateTransform() {
        modalImage.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            modalImage.src = '';
            resetZoom();
        }, 300);
    }
});