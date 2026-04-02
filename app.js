const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();
tg.setHeaderColor('#050505');

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const panels = gsap.utils.toArray(".panel");

// 1. НАЛАШТУВАННЯ "БЕЗУПРЕЧНОГО" СКРОЛЛІНГУ
// Ми створюємо один таймлайн, який керує "шарами"
const mainTl = gsap.timeline({
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "+=" + (panels.length * 100) + "%", // Висота залежить від к-сті блоків
        scrub: 1, // М'якість скролла
        pin: true, // Закріплення тіла (дуже важливо!)
        snap: 1 / (panels.length - 1) // Авто-доводка до блоку
    }
});

panels.forEach((panel, i) => {
    // Встановлюємо початковий стан для всіх панелей, крім першої
    if (i > 0) {
        gsap.set(panel, { position: "absolute", top: 0, left: 0, opacity: 0, scale: 0.8 });
    }

    if (i > 0) {
        // Попередня секція плавно зникає та затемнюється
        mainTl.to(panels[i-1], { 
            opacity: 0, 
            scale: 0.8, 
            duration: 0.5,
            pointerEvents: 'none'
        }, i)
        // Нова секція з'являється (нашаровується поверх)
        .to(panel, { 
            opacity: 1, 
            scale: 1, 
            duration: 0.5 
        }, i);
    }
});

// 2. ЛОГІКА ОКНА МЕНЮ
const menuToggle = document.getElementById("menuToggle");
const menuOverlay = document.getElementById("menuOverlay");
const menuItems = document.querySelectorAll(".menu-item");

menuToggle.addEventListener("click", () => {
    menuOverlay.classList.toggle("active");
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
});

// Плавний перехід по кліку на пункт меню
menuItems.forEach((item) => {
    item.addEventListener("click", () => {
        const index = item.getAttribute("data-index");
        menuOverlay.classList.remove("active");

        // Розраховуємо точну позицію для скролла в пікселях
        // Оскільки ми використовуємо pinning, позиція = індекс * висота вьюпорту
        const scrollDistance = index * window.innerHeight;

        gsap.to(window, {
            scrollTo: scrollDistance,
            duration: 1.5,
            ease: "power4.inOut"
        });

        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    });
});

// Закриття меню при клику поза вікном
menuOverlay.addEventListener("click", (e) => {
    if (e.target === menuOverlay) menuOverlay.classList.remove("active");
});
