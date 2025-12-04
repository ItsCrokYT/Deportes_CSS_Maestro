// 1. Inicializar AOS
AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 100
});

// 2. Swiper Config (Slider Principal)
const swiper = new Swiper(".mySwiper", {
    direction: "horizontal",
    loop: true,
    effect: "fade",
    speed: 1000,
    autoplay: {
        delay: 5000,
        disableOnInteraction: false,
    },
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});

// 3. Navbar Scroll Effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('nav-scrolled');
        navbar.classList.add('bg-padel-dark');
        navbar.classList.add('shadow-md');
        navbar.classList.remove('py-6');
        navbar.classList.remove('bg-transparent');
        navbar.classList.add('py-4');
    } else {
        navbar.classList.remove('nav-scrolled');
        navbar.classList.remove('bg-padel-dark');
        navbar.classList.remove('shadow-md');
        navbar.classList.add('py-6');
        navbar.classList.add('bg-transparent');
        navbar.classList.remove('py-4');
    }
});

// 4. Menú Móvil
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('translate-x-full');
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('translate-x-full');
    });
});

// 5. LIGHTBOX LOGIC
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');

function openLightbox(imgSrc, title) {
    lightboxImg.src = imgSrc;
    lightboxCaption.innerText = title;
    
    lightbox.classList.remove('hidden');
    setTimeout(() => {
        lightbox.classList.remove('opacity-0');
        document.body.classList.add('lightbox-active');
    }, 10);
}

function closeLightbox() {
    lightbox.classList.add('opacity-0');
    setTimeout(() => {
        lightbox.classList.add('hidden');
        document.body.classList.remove('lightbox-active');
    }, 300);
}

document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

// 6. GESTOR UNIFICADO DE CLICS
document.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (!item) return; 

    const container = item.parentElement.closest('.style-polaroid') || item.parentElement;

    // A) POLAROID (Intercambio)
    if (container.classList.contains('style-polaroid')) {
        const wrapper = container.querySelector('.polaroid-scroll-wrapper');
        const mainImage = container.children[0]; 
        
        // MODO MÓVIL (Wrapper existe)
        if (wrapper && wrapper.contains(item)) {
             const bigImg = mainImage.querySelector('img');
             const smallImg = item.querySelector('img');
             const bigSrc = bigImg.src;
             const smallSrc = smallImg.src;
             
             mainImage.style.opacity = '0.5';
             setTimeout(() => {
                 bigImg.src = smallSrc;
                 mainImage.style.opacity = '1';
             }, 200);

             wrapper.querySelectorAll('.gallery-item').forEach(el => el.classList.remove('active-thumb'));
             item.classList.add('active-thumb');
             return;
        }

        // MODO ESCRITORIO (Sin wrapper)
        if (!wrapper && container.children[0] !== item) {
            // Fade Out
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            const currentBig = container.children[0];
            currentBig.style.opacity = '0';

            setTimeout(() => {
                // Intercambio de contenido
                const tempHTML = container.children[0].innerHTML;
                container.children[0].innerHTML = item.innerHTML;
                item.innerHTML = tempHTML;
                
                // Restaurar
                container.children[0].style.opacity = '1';
                item.style.opacity = '0.6';
                item.style.transform = 'scale(1)';
            }, 250);
        }
        return; 
    }

    // B) OTRAS GALERÍAS (Lightbox)
    const img = item.querySelector('img');
    if (img) {
        let title = "";
        if (item.querySelector('h4')) title = item.querySelector('h4').innerText;
        else if (item.querySelector('p')) title = item.querySelector('p').innerText;
        else if (item.querySelector('span')) title = item.querySelector('span').innerText;
        openLightbox(img.src, title);
    }
});

// 7. PLAN SELECTION
const planCards = document.querySelectorAll('.plan-card');
const selectedClasses = ['bg-gradient-to-b', 'from-slate-800', 'to-slate-900', 'border-2', 'border-padel-neon', 'transform', 'md:-translate-y-4', 'shadow-2xl', 'shadow-padel-neon/10', 'z-20'];
const unselectedClasses = ['bg-slate-800/50', 'backdrop-blur-sm', 'border-2', 'border-slate-700', 'hover:border-padel-blue'];

function selectPlan(selectedCard) {
    planCards.forEach(card => {
        card.classList.remove(...selectedClasses);
        card.classList.add(...unselectedClasses);
        const btn = card.querySelector('.plan-btn');
        btn.classList.remove('bg-padel-neon', 'text-padel-dark');
        btn.classList.add('border', 'border-slate-600', 'text-white');
        const icons = card.querySelectorAll('.plan-icon');
        icons.forEach(icon => {
            icon.classList.remove('text-padel-neon');
            icon.classList.add('text-padel-blue');
        });
    });
    selectedCard.classList.remove(...unselectedClasses);
    selectedCard.classList.add(...selectedClasses);
    const activeBtn = selectedCard.querySelector('.plan-btn');
    activeBtn.classList.remove('border', 'border-slate-600', 'text-white');
    activeBtn.classList.add('bg-padel-neon', 'text-padel-dark');
    const activeIcons = selectedCard.querySelectorAll('.plan-icon');
    activeIcons.forEach(icon => {
        icon.classList.remove('text-padel-blue');
        icon.classList.add('text-padel-neon');
    });
}
planCards.forEach(card => card.addEventListener('click', () => selectPlan(card)));

// 8. BOOKING MODAL
const bookingModal = document.getElementById('booking-modal');
const closeBookingBtn = document.getElementById('close-booking');
const bookingTriggers = document.querySelectorAll('.trigger-booking'); 

function openBooking() {
    bookingModal.classList.remove('hidden');
    setTimeout(() => {
        bookingModal.classList.remove('opacity-0');
        bookingModal.querySelector('div').classList.remove('scale-95');
        bookingModal.querySelector('div').classList.add('scale-100');
    }, 10);
    document.body.style.overflow = 'hidden'; 
}
function closeBooking() {
    bookingModal.classList.add('opacity-0');
    bookingModal.querySelector('div').classList.remove('scale-100');
    bookingModal.querySelector('div').classList.add('scale-95');
    setTimeout(() => {
        bookingModal.classList.add('hidden');
        document.body.style.overflow = ''; 
    }, 300);
}
bookingTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault(); e.stopPropagation(); openBooking();
    });
});
closeBookingBtn.addEventListener('click', closeBooking);
bookingModal.addEventListener('click', (e) => { if (e.target === bookingModal) closeBooking(); });

// 9. SWIPER MEMBRESÍAS
const swiperMemberships = new Swiper(".memberships-swiper", {
    slidesPerView: 1.2, 
    spaceBetween: 20,
    centeredSlides: true,
    initialSlide: 1, // Inicia en el slide del medio
    breakpoints: {
        768: {
            slidesPerView: 3, 
            spaceBetween: 30,
            centeredSlides: false,
            initialSlide: 0, // En PC empieza en el 0 para ver los 3
            allowTouchMove: false 
        }
    },
    pagination: { el: ".swiper-pagination", clickable: true },
    on: {
        slideChange: function () {
            const activeIndex = this.activeIndex;
            const slides = document.querySelectorAll('.memberships-swiper .swiper-slide');
            if (slides[activeIndex]) {
                const activeCard = slides[activeIndex].querySelector('.plan-card');
                if (activeCard) selectPlan(activeCard);
            }
        },
        // FIX: Forzar selección del slide 1 (Master Club) al iniciar
        init: function() {
            const slides = document.querySelectorAll('.memberships-swiper .swiper-slide');
            // Seleccionamos el slide[1] que es el del medio
            if (slides[1]) {
                const activeCard = slides[1].querySelector('.plan-card');
                if (activeCard) selectPlan(activeCard);
            }
        }
    }
});

// 10. HERO INTERACTION
const statsCard = document.getElementById('stats-card');
const heroBtns = document.querySelectorAll('.hero-btn');

function handleScrollAnimation() {
    if (window.innerWidth >= 768) {
        if (window.scrollY > 50) {
             if (statsCard) {
                 statsCard.classList.remove('opacity-0', 'translate-y-20');
                 statsCard.classList.add('opacity-100', 'translate-y-0');
                 statsCard.classList.remove('pointer-events-none');
             }
             heroBtns.forEach(btn => btn.classList.add('opacity-0', 'pointer-events-none'));
        } else {
             if (statsCard) {
                 statsCard.classList.add('opacity-0', 'translate-y-20');
                 statsCard.classList.remove('opacity-100', 'translate-y-0');
                 statsCard.classList.add('pointer-events-none');
             }
             heroBtns.forEach(btn => btn.classList.remove('opacity-0', 'pointer-events-none'));
        }
    } else {
        if (statsCard) {
            statsCard.classList.remove('opacity-0', 'translate-y-20');
             statsCard.classList.add('opacity-100', 'translate-y-0');
             statsCard.classList.remove('pointer-events-none');
        }
        heroBtns.forEach(btn => btn.classList.remove('opacity-0', 'pointer-events-none'));
    }
}

window.addEventListener('scroll', handleScrollAnimation);
window.addEventListener('resize', () => {
    handleScrollAnimation();
    handlePolaroidMobileLayout();
});
handleScrollAnimation();

// 11. SISTEMA DE GALERÍA MAESTRA
const galleryTickers = {}; 

function setGalleryStyle(galleryId, styleName) {
    const galleryContainer = document.getElementById(galleryId);
    if (!galleryContainer) return;

    if (galleryTickers[galleryId]) {
        clearInterval(galleryTickers[galleryId]);
        delete galleryTickers[galleryId];
        const clones = galleryContainer.querySelectorAll('.cloned-item');
        clones.forEach(clone => clone.remove());
    }

    galleryContainer.className = 'gallery-master'; 
    galleryContainer.classList.add(styleName);

    if (styleName === 'style-slider') initGalleryTicker(galleryContainer, galleryId);
    if (styleName === 'style-polaroid') {
        handlePolaroidMobileLayout();
    }
    
    setTimeout(() => {
        if (typeof AOS !== 'undefined') AOS.refresh();
    }, 200);
}

function initGalleryTicker(container, id) {
    const items = Array.from(container.children);
    items.forEach(item => {
        const clone = item.cloneNode(true);
        clone.classList.add('cloned-item'); 
        container.appendChild(clone);
    });
    let scrollPos = 0;
    const speed = 1; 
    const ticker = setInterval(() => {
        scrollPos += speed;
        if (scrollPos >= container.scrollWidth / 2) scrollPos = 0;
        container.scrollLeft = scrollPos;
    }, 16); 
    galleryTickers[id] = ticker;
}

// 12. LÓGICA MÓVIL POLAROID
function handlePolaroidMobileLayout() {
    const polaroidContainer = document.querySelector('.style-polaroid');
    if (!polaroidContainer) return;

    const isMobile = window.innerWidth < 768;
    let scrollWrapper = polaroidContainer.querySelector('.polaroid-scroll-wrapper');
    const loadMoreBtn = document.getElementById('load-more-btn');

    if (loadMoreBtn) loadMoreBtn.style.display = 'none';

    if (isMobile) {
        polaroidContainer.classList.add('mobile-active');
        if (!scrollWrapper) {
            scrollWrapper = document.createElement('div');
            scrollWrapper.className = 'polaroid-scroll-wrapper';
            const items = Array.from(polaroidContainer.children);
            items.forEach((item, index) => {
                if (index !== 0) { 
                    item.classList.remove('hidden', 'md:block', 'md:hidden');
                    item.style.display = 'block'; 
                    scrollWrapper.appendChild(item);
                }
            });
            polaroidContainer.appendChild(scrollWrapper);
        }
    } else {
        polaroidContainer.classList.remove('mobile-active');
        if (scrollWrapper) {
            const items = Array.from(scrollWrapper.children);
            items.forEach(item => {
                polaroidContainer.appendChild(item);
            });
            scrollWrapper.remove();
        }
    }
    
    setTimeout(() => {
        if (typeof AOS !== 'undefined') AOS.refresh();
    }, 200);
}

document.addEventListener('DOMContentLoaded', () => {
    setGalleryStyle('galeria-1', 'style-polaroid'); 
    setGalleryStyle('galeria-2', 'style-bento'); 
});

window.addEventListener('load', () => {
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
});
