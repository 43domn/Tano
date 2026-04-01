const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();
tg.setHeaderColor('#050505');

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const panels = gsap.utils.toArray(".panel");

// Механіка "СТОП" скролу (Pinning)
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "+=" + (panels.length * 100) + "%",
        scrub: 1,
        pin: true,
        snap: {
            snapTo: 1 / (panels.length - 1),
            duration: { min: 0.3, max: 0.7 },
            delay: 0.1,
            ease: "power2.inOut"
        }
    }
});

// Анімація перекриття карток
panels.forEach((panel, i) => {
    if (i > 0) {
        tl.from(panel.querySelector(".card"), {
            yPercent: 100,
            opacity: 0,
            scale: 0.8,
            duration: 1
        }, i);
    }
});

// Логіка Меню
const overlay = document.getElementById("menuOverlay");
const openBtn = document.getElementById("openMenu");
const closeBtn = document.getElementById("closeMenu");

openBtn.addEventListener("click", () => {
    overlay.classList.add("active");
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
});

closeBtn.addEventListener("click", () => {
    overlay.classList.remove("active");
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
});

// Навігація в меню
document.querySelectorAll(".menu-item").forEach((btn) => {
    btn.addEventListener("click", () => {
        const index = btn.getAttribute("data-index");
        overlay.classList.remove("active");
        
        gsap.to(window, {
            scrollTo: { y: index * window.innerHeight, autoKill: false },
            duration: 1.5,
            ease: "power4.inOut"
        });
        
        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    });
});
