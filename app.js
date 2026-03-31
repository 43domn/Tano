const tg = window.Telegram.WebApp;
tg.expand();
tg.headerColor = '#000000';

gsap.registerPlugin(ScrollTrigger);

// Анімація головного екрану при вході
gsap.from(".fade-in", {
    y: 30,
    opacity: 0,
    duration: 1.2,
    stagger: 0.2,
    ease: "expo.out"
});

// Налаштування "особливого скролінгу" (Section Pinning & Snapping)
const panels = gsap.utils.toArray('.panel');

panels.forEach((panel, i) => {
    ScrollTrigger.create({
        trigger: panel,
        start: "top top",
        pin: true,           // Фіксуємо блок
        pinSpacing: false,   // Наступний блок заходить поверх попереднього
        snap: 1,             // Доводка скролу до країв блоку
        onEnter: () => {
            if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
        }
    });

    // Плавна поява контенту всередині кожного блоку
    gsap.from(panel.querySelector('.content-box'), {
        scrollTrigger: {
            trigger: panel,
            start: "top center",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
});

// Підтримка теми Telegram
document.body.style.setProperty('--tg-theme-bg-color', tg.backgroundColor);
