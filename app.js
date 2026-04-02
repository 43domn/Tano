const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

// Налаштування теми Telegram
tg.setHeaderColor('#F5F5F7');
tg.setBackgroundColor('#F5F5F7');

// Реєструємо тільки плагін для плавного скролу до точки
gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

const screens = document.querySelectorAll(".screen");

// 1. НАЛАШТУВАННЯ ФІЗИЧНИХ ШАРІВ (Ідеальна точність)
screens.forEach((screen, i) => {
    // Встановлюємо жорсткий z-index, щоб при скролі блоки правильно накривали один одного
    screen.style.zIndex = i + 1;

    // Додаємо легку анімацію появи контенту всередині блоку
    if (i > 0) {
        gsap.from(screen.querySelector('.card'), {
            scrollTrigger: {
                trigger: screen,
                start: "top 80%", // Спрацьовує, коли блок з'являється на екрані
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        });
    }
});

// 2. ЛОГІКА МЕНЮ ТА ЖОРСТКА ТЕЛЕПОРТАЦІЯ
const menuToggle = document.getElementById("menuToggle");
const menuOverlay = document.getElementById("menuOverlay");
const menuLinks = document.querySelectorAll(".link-item");

menuToggle.addEventListener("click", () => {
    menuOverlay.classList.toggle("active");
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
});

menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
        const idx = parseInt(link.getAttribute("data-index"));
        menuOverlay.classList.remove("active");

        // Ідеально точна формула телепортації:
        // індекс кнопки * фізична висота вікна пристрою
        const exactScrollPosition = idx * window.innerHeight;

        gsap.to(window, {
            scrollTo: exactScrollPosition,
            duration: 1.2,
            ease: "power3.inOut"
        });

        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    });
});

// Закриття меню при кліку на розмитий фон
menuOverlay.addEventListener("click", (e) => {
    if (e.target === menuOverlay) menuOverlay.classList.remove("active");
});
