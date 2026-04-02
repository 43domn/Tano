const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const panels = gsap.utils.toArray(".panel");

// 1. СТВОРЕННЯ ТАЙМЛАЙНУ З МІТКАМИ
const mainTl = gsap.timeline({
    scrollTrigger: {
        trigger: "#app-container",
        start: "top top",
        end: "+=" + (panels.length * 100) + "%",
        scrub: 1,
        pin: true,
        snap: 1 / (panels.length - 1)
    }
});

panels.forEach((panel, i) => {
    // Додаємо мітку для кожної панелі (потрібно для телепортації)
    mainTl.addLabel("panel_" + i, i);

    if (i > 0) {
        gsap.set(panel, { position: "absolute", top: 0, left: 0, opacity: 0, scale: 0.9 });
        
        mainTl.to(panels[i-1], { 
            opacity: 0, 
            scale: 0.8, 
            duration: 0.5,
            pointerEvents: 'none'
        }, i)
        .to(panel, { 
            opacity: 1, 
            scale: 1, 
            duration: 0.5 
        }, i);
    }
});

// 2. ЛОГІКА МЕНЮ (ТЕЛЕПОРТАЦІЯ)
const menuToggle = document.getElementById("menuToggle");
const menuOverlay = document.getElementById("menuOverlay");
const menuItems = document.querySelectorAll(".menu-item");

menuToggle.addEventListener("click", () => {
    menuOverlay.classList.toggle("active");
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
});

menuItems.forEach((item) => {
    item.addEventListener("click", () => {
        const index = item.getAttribute("data-index");
        menuOverlay.classList.remove("active");

        // Отримуємо координати мітки в пікселях скролу
        const scrollPos = mainTl.scrollTrigger.labelToScroll("panel_" + index);

        // Плавна телепортація
        gsap.to(window, {
            scrollTo: scrollPos,
            duration: 1.2,
            ease: "power3.inOut"
        });

        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    });
});

// Закриття при кліку на фон
menuOverlay.addEventListener("click", (e) => {
    if (e.target === menuOverlay) menuOverlay.classList.remove("active");
});
