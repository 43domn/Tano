// Инициализация Telegram
const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const panels = gsap.utils.toArray(".panel");

// 1. ЛОГИКА "БЕЗУПРЕЧНОГО" СКРОЛЛИНГА
// Мы создаем один большой таймлайн, который приклеивает секции
const mainTl = gsap.timeline({
    scrollTrigger: {
        trigger: "#mainContainer",
        start: "top top",
        end: "+=" + (panels.length * 100) + "%", // Высота зависит от кол-ва блоков
        scrub: 1, // Плавность скролла
        pin: true, // Закрепление
        snap: 1 / (panels.length - 1) // Авто-доводка до блока
    }
});

panels.forEach((panel, i) => {
    if (i > 0) {
        // Эффект перехода: предыдущий блок уходит вглубь и затемняется
        mainTl.to(panels[i-1].querySelector(".glass-card"), {
            opacity: 0,
            scale: 0.8,
            filter: "blur(15px)",
            duration: 0.5
        }, i)
        // Новый блок выплывает снизу
        .from(panel.querySelector(".glass-card"), {
            yPercent: 100,
            opacity: 0,
            duration: 0.5
        }, i);
    }
});

// 2. ЛОГИКА МЕНЮ
const menuToggle = document.getElementById("menuToggle");
const menuOverlay = document.getElementById("menuOverlay");
const menuLinks = document.querySelectorAll(".menu-link");

menuToggle.addEventListener("click", () => {
    menuOverlay.classList.toggle("open");
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
});

// Закрытие при клике по пункту и переход к секции
menuLinks.forEach((link, i) => {
    link.addEventListener("click", () => {
        const target = link.getAttribute("data-target");
        menuOverlay.classList.remove("open");

        // Рассчитываем позицию для скролла
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const targetScroll = (i / (panels.length - 1)) * totalHeight;

        gsap.to(window, {
            scrollTo: targetScroll,
            duration: 1.5,
            ease: "power4.inOut"
        });

        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    });
});

// Закрытие меню при клике вне окна
menuOverlay.addEventListener("click", (e) => {
    if (e.target === menuOverlay) menuOverlay.classList.remove("open");
});

// Подстройка под тему Telegram (цвета статус-бара)
tg.setHeaderColor(tg.colorScheme === 'dark' ? '#0A0A0A' : '#ffffff');
