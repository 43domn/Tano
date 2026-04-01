const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const panels = gsap.utils.toArray(".panel");

// 1. НАЛАШТУВАННЯ СКРОЛУ (БЕЗ АВТОСКРОЛУ)
// Створюємо таймлайн, який керує "шарами"
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "+=" + (panels.length * 100) + "%",
        scrub: 1.2, // М'якість руху
        pin: true,
        // snap: 1 / (panels.length - 1) <-- ЦЕ ВИДАЛЕНО, тепер скрол вільний
    }
});

panels.forEach((panel, i) => {
    if (i > 0) {
        // Ефект відходу попередньої картки (глибина)
        tl.to(panels[i-1].querySelector(".card"), {
            opacity: 0,
            scale: 0.8,
            filter: "blur(10px)",
            duration: 0.5
        }, i)
        // Поява нової картки
        .from(panel.querySelector(".card"), {
            opacity: 0,
            yPercent: 50,
            duration: 0.5
        }, i);
    }
});

// 2. ЛОГИКА МЕНЮ (ВИПРАВЛЕНА)
const menuOverlay = document.getElementById("menuOverlay");
const openMenu = document.getElementById("openMenu");
const closeMenu = document.getElementById("closeMenu");

openMenu.addEventListener("click", () => {
    menuOverlay.classList.add("active");
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
});

closeMenu.addEventListener("click", () => {
    menuOverlay.classList.remove("active");
});

// ПЕРЕХІД ДО РОЗДІЛУ
document.querySelectorAll(".menu-item").forEach((btn) => {
    btn.addEventListener("click", () => {
        const index = parseInt(btn.getAttribute("data-index"));
        menuOverlay.classList.remove("active");

        // Розраховуємо точну позицію в пікселях
        // Оскільки ми використовуємо pinning, позиція = індекс * висота вьюпорту
        const scrollDistance = index * window.innerHeight;

        gsap.to(window, {
            scrollTo: { y: scrollDistance, autoKill: false },
            duration: 1.5,
            ease: "power4.inOut"
        });

        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    });
});

// Клік поза вікном
menuOverlay.addEventListener("click", (e) => {
    if (e.target === menuOverlay) menuOverlay.classList.remove("active");
});
