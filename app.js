const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

// Устанавливаем цвет статус-бара Telegram
tg.setHeaderColor('#050505');

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const panels = gsap.utils.toArray(".panel");

// 1. НАСТРОЙКА СКРОЛЛА (БЕЗ SNAP)
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "+=" + (panels.length * 100) + "%",
        scrub: 1, // Мягкость скролла
        pin: true, // Закрепление секций
        // Функция snap удалена, теперь пользователь скроллит сам как хочет
    }
});

// Анимация слоев (каждая следующая карточка перекрывает предыдущую)
panels.forEach((panel, i) => {
    if (i > 0) {
        tl.to(panels[i-1].querySelector(".card"), {
            opacity: 0,
            scale: 0.8,
            filter: "blur(10px)",
            duration: 0.5
        }, i)
        .from(panel.querySelector(".card"), {
            opacity: 0,
            yPercent: 50,
            duration: 0.5
        }, i);
    }
});

// 2. ЛОГИКА МЕНЮ
const menuOverlay = document.getElementById("menuOverlay");
const openMenu = document.getElementById("openMenu");
const closeMenu = document.getElementById("closeMenu");

openMenu.addEventListener("click", () => {
    menuOverlay.classList.add("active");
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
});

closeMenu.addEventListener("click", () => {
    menuOverlay.classList.remove("active");
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
});

// 3. НАВИГАЦИЯ ПО МЕНЮ
document.querySelectorAll(".menu-item").forEach((btn) => {
    btn.addEventListener("click", () => {
        const index = parseInt(btn.getAttribute("data-index"));
        menuOverlay.classList.remove("active");

        // Расчет позиции для скролла
        const scrollDistance = index * window.innerHeight;

        gsap.to(window, {
            scrollTo: { y: scrollDistance, autoKill: false },
            duration: 1.2,
            ease: "power3.inOut"
        });

        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    });
});

// Закрытие по клику на темный фон
menuOverlay.addEventListener("click", (e) => {
    if (e.target === menuOverlay) {
        menuOverlay.classList.remove("active");
    }
});
