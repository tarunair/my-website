document.addEventListener('DOMContentLoaded', () => {
    const imageWrappers = Array.from(document.querySelectorAll('.image-wrapper'));
    const heroText = document.querySelector('.hero-text');
    const hero = document.querySelector('.hero');
    let activeImage = null;
    let isMobile = window.innerWidth < 768;
    let currentImageIndex = 0;
    let scrollTimeout;

    function debounce(fn, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), wait);
        };
    }

    function checkViewport() {
        isMobile = window.innerWidth < 768;
        resetImageStates();
        if (isMobile) {
            activateImageByIndex(currentImageIndex);
            setupScrollHandler();
        }
    }

    function resetImageStates() {
        imageWrappers.forEach(wrapper => {
            wrapper.classList.remove('active', 'inactive');
            gsap.set(wrapper, { opacity: 1, scale: 1, clearProps: 'all' });
            gsap.set(wrapper.querySelector('.interactive-image'), { clearProps: 'all' });
        });
    }

    function setupAnimations() {
        gsap.from('.hero-text span', { y: 50, opacity: 0, duration: 1.5, stagger: 0.1, ease: 'power2.out' });
        if (!isMobile) {
            gsap.from('.image-wrapper', { y: 100, opacity: 0, rotation: 10, duration: 1.2, stagger: 0.2, ease: 'power3.out' });
        }
    }

    function setupScrollHandler() {
        window.addEventListener('scroll', debounce(() => {
            const scrollPercent = window.scrollY / (hero.offsetHeight * 0.8);
            const nextIndex = Math.min(Math.floor(scrollPercent * imageWrappers.length), imageWrappers.length - 1);
            if (nextIndex !== currentImageIndex && nextIndex >= 0) {
                currentImageIndex = nextIndex;
                activateImageByIndex(currentImageIndex);
            }
        }, 50));
    }

    function activateImageByIndex(index) {
        imageWrappers.forEach((wrapper, i) => {
            wrapper.classList.toggle('active', i === index);
            gsap.to(wrapper, { opacity: i === index ? 1 : 0, duration: 0.8, ease: 'power2.inOut' });
        });
    }

    function setupEventListeners() {
        imageWrappers.forEach(wrapper => {
            if (!isMobile) {
                wrapper.addEventListener('click', () => handleImageClick(wrapper));
                wrapper.addEventListener('mouseenter', () => hoverEffect(wrapper, 1.05));
                wrapper.addEventListener('mouseleave', () => hoverEffect(wrapper, 1));
            }
        });

        document.addEventListener('click', e => {
            if (!isMobile && !e.target.closest('.image-wrapper') && activeImage) {
                deactivateImage();
            }
        });

        window.addEventListener('resize', debounce(() => {
            const wasMobile = isMobile;
            checkViewport();
            if (wasMobile !== isMobile) {
                if (isMobile) {
                    setupScrollHandler();
                    activateImageByIndex(0);
                } else if (activeImage) {
                    deactivateImage();
                }
            }
        }, 200));
    }

    function hoverEffect(wrapper, scaleValue) {
        if (!activeImage) {
            gsap.to(wrapper, { scale: scaleValue, duration: 0.3 });
        }
    }

    function handleImageClick(wrapper) {
        if (isMobile) return;
        if (activeImage === wrapper) {
            deactivateImage();
        } else {
            if (activeImage) deactivateImage();
            activateImage(wrapper);
        }
    }

    function activateImage(wrapper) {
        activeImage = wrapper;
        gsap.to(wrapper, { scale: 1.1, duration: 0.5, ease: 'power2.out' });
        imageWrappers.forEach(w => {
            if (w !== wrapper) {
                gsap.to(w, { opacity: 0.5, scale: 0.95, duration: 0.5 });
                w.classList.add('inactive');
            }
        });
        gsap.to('.hero-text span', { opacity: 0.3, y: 20, duration: 0.5, stagger: 0.1, ease: 'power2.out' });
        wrapper.classList.add('active');
        heroText.classList.add('background');
        enableCursorTracking(wrapper.querySelector('.interactive-image'));
    }

    function deactivateImage() {
        if (!activeImage) return;
        imageWrappers.forEach(w => {
            gsap.to(w, { opacity: 1, scale: 1, duration: 0.5 });
            w.classList.remove('inactive', 'active');
        });
        gsap.to('.hero-text span', { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' });
        heroText.classList.remove('background');
        activeImage = null;
    }

    function enableCursorTracking(image) {
        function onMouseMove(e) {
            if (!activeImage) {
                document.removeEventListener('mousemove', onMouseMove);
                return;
            }
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            gsap.to(image, { x: x * 30, y: y * 20, duration: 0.5, ease: 'power2.out' });
        }
        document.addEventListener('mousemove', onMouseMove);
    }

    checkViewport();
    setupAnimations();
    setupEventListeners();
});
