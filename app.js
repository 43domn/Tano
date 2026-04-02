const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

// Налаштування теми Telegram (світла)
tg.setHeaderColor('#F5F5F7');
tg.setBackgroundColor('#F5F5F7');

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const screens = gsap.utils.toArray(".screen");

// 1. ПРЕМІАЛЬНИЙ СКРОЛЛ-ТАЙМЛАЙН
const mainTl = gsap.timeline({
    scrollTrigger: {
        trigger: "#smooth-wrapper",
        start: "top top",
        end: "+=" + (screens.length * 100) + "%",
        scrub: 1.2, // Трохи повільніше для відчуття "ваги"
        pin: true,
        snap: 1 / (screens.length - 1)
    }
});

screens.forEach((screen, i) => {
    mainTl.addLabel("pos_" + i, i);

    if (i > 0) {
        // Початковий стан для наступних екранів (вони знизу і прозорі)
        gsap.set(screen, { position: "absolute", top: 0, left: 0, opacity: 0, y: 100 });
        
        mainTl.to(screens[i-1], { 
            opacity: 0, 
            y: -50,
            scale: 0.9,
            duration: 0.5,
            pointerEvents: 'none'
        }, i)
        .to(screen, { 
            opacity: 1, 
            y: 0,
            scale: 1,
            duration: 0.5 
        }, i);
    }
});

// 2. МЕНЮ ТА ТЕЛЕПОРТАЦІЯ
const menuToggle = document.getElementById("menuToggle");
const menuOverlay = document.getElementById("menuOverlay");
const menuLinks = document.querySelectorAll(".link-item");

menuToggle.addEventListener("click", () => {
    menuOverlay.classList.toggle("active");
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
});

menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
        const idx = link.getAttribute("data-index");
        menuOverlay.classList.remove("active");

        // Ідеальний розрахунок точки скролу
        const scrollPos = mainTl.scrollTrigger.labelToScroll("pos_" + idx);

        gsap.to(window, {
            scrollTo: scrollPos,
            duration: 1.5,
            ease: "expo.inOut" // Преміальне сповільнення в кінці
        });

        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    });
});

// Закриття при кліку на фон (blur)
menuOverlay.addEventListener("click", (e) => {
    if (e.target === menuOverlay) menuOverlay.classList.remove("active");
});
