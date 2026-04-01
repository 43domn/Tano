const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const panels = gsap.utils.toArray(".panel");

// ЛОГИКА LAYERED PINNING (БЕЗ БАГОВ)
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "+=" + (panels.length * 100) + "%",
        scrub: 1,
        pin: true,
        snap: 1 / (panels.length - 1)
    }
});

panels.forEach((panel, i) => {
    if (i > 0) {
        // Уход предыдущего блока: затемнение + уменьшение
        tl.to(panels[i-1], {
            opacity: 0,
            scale: 0.8,
            duration: 0.5,
            filter: "blur(10px)",
            pointerEvents: "none"
        }, i)
        // Появление текущего
        .from(panel, {
            opacity: 0,
            yPercent: 40,
            duration: 0.5
        }, i);
    }
});

// ЛОГИКА ОКНА МЕНЮ
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

// Плавный скролл к секции из меню
document.querySelectorAll(".menu-item").forEach((btn, i) => {
    btn.addEventListener("click", () => {
        menuOverlay.classList.remove("active");
        
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const scrollTarget = (i / (panels.length - 1)) * totalHeight;

        gsap.to(window, {
            scrollTo: scrollTarget,
            duration: 1.2,
            ease: "power4.inOut"
        });

        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    });
});

// Обработка закрытия кликом вне меню
menuOverlay.addEventListener("click", (e) => {
    if (e.target === menuOverlay) menuOverlay.classList.remove("active");
});
