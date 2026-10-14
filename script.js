document.addEventListener('DOMContentLoaded', function () {
    let zoomLevel = 1;

    // Função para adicionar suporte a Libras
    document.getElementById('libras-btn').addEventListener('click', function () {
        alert('Suporte a Libras ativado (simulação).');
        // Aqui você pode integrar com uma API de Libras, como a Hand Talk
    //https://www.handtalk.me/br/ visitar esse site
    });

    // Função para aumentar o zoom
    document.getElementById('zoom-in-btn').addEventListener('click', function () {
        zoomLevel += 0.1;
        document.body.style.transform = `scale(${zoomLevel})`;
        document.body.style.transformOrigin = '0 0';
    });

    // Função para diminuir o zoom
    document.getElementById('zoom-out-btn').addEventListener('click', function () {
        if (zoomLevel > 1) {
            zoomLevel -= 0.1;
            document.body.style.transform = `scale(${zoomLevel})`;
            document.body.style.transformOrigin = '0 0';
        }
    });
});


// ============================================
// CARROSSEL DE IMAGENS
// ============================================

// Seleciona os elementos do DOM
const track = document.querySelector('.carousel-track');
const slides = Array.from(document.querySelectorAll('.carousel-slide'));
const nextBtn = document.querySelector('.carousel-btn.next');
const prevBtn = document.querySelector('.carousel-btn.prev');
const indicators = Array.from(document.querySelectorAll('.carousel-indicator'));
const carouselContainer = document.querySelector('.carousel-container');

// Índice do slide atual
let currentIndex = 0;

// ============================================
// FUNÇÃO: Atualiza a posição do carrossel
// ============================================
function updateCarousel() {
    // Calcula a largura de um slide
    const slideWidth = slides[0].getBoundingClientRect().width;

    // Move o track para o slide correto
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

    // Atualiza os indicadores (bolinhas)
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('current-indicator', index === currentIndex);
    });
}

// ============================================
// FUNÇÃO: Avança ou retrocede o slide
// ============================================
function moveSlide(direction) {
    currentIndex += direction;

    // Loop infinito: se passar do último, volta ao primeiro
    if (currentIndex < 0) {
        currentIndex = slides.length - 1;
    } else if (currentIndex >= slides.length) {
        currentIndex = 0;
    }

    updateCarousel();
}

// ============================================
// FUNÇÃO: Vai direto para um slide específico
// ============================================
function currentSlide(index) {
    currentIndex = index;
    updateCarousel();
}

// ============================================
// EVENTOS: Botões anterior e próximo
// ============================================
nextBtn.addEventListener('click', () => {
    moveSlide(1);
    resetAutoPlay();
});

prevBtn.addEventListener('click', () => {
    moveSlide(-1);
    resetAutoPlay();
});

// ============================================
// EVENTOS: Indicadores (bolinhas)
// ============================================
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        currentSlide(index);
        resetAutoPlay();
    });
});

// ============================================
// AUTO-PLAY: Troca automática a cada 5 segundos
// ============================================
let autoPlayInterval = null;

function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
        moveSlide(1);
    }, 5000);
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

function resetAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
}

// Inicia o auto-play ao carregar
startAutoPlay();

// ============================================
// PAUSA O AUTO-PLAY AO PASSAR O MOUSE
// ============================================
carouselContainer.addEventListener('mouseenter', stopAutoPlay);
carouselContainer.addEventListener('mouseleave', startAutoPlay);

// ============================================
// SUPORTE A TECLADO (acessibilidade)
// ============================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        moveSlide(1);
        resetAutoPlay();
    } else if (e.key === 'ArrowLeft') {
        moveSlide(-1);
        resetAutoPlay();
    }
});

// ============================================
// SUPORTE A SWIPE (telas touch)
// ============================================
let touchStartX = 0;
let touchEndX = 0;

carouselContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoPlay();
}, { passive: true });

carouselContainer.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startAutoPlay();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50; // distância mínima para considerar swipe
    const diff = touchStartX - touchEndX;

    if (diff > swipeThreshold) {
        moveSlide(1);  // swipe para a esquerda → próximo
    } else if (diff < -swipeThreshold) {
        moveSlide(-1); // swipe para a direita → anterior
    }
}

// ============================================
// AJUSTA AO REDIMENSIONAR A JANELA
// ============================================
window.addEventListener('resize', () => {
    updateCarousel();
});

// ============================================
// INICIALIZAÇÃO
// ============================================
updateCarousel();