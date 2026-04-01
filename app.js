const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();
tg.setHeaderColor('#050505');

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const panels = gsap.utils.toArray(".panel");

// Инициализация "Стоп-скролла"
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: "#app-container",
        start: "top top",
        end: "+=" + (panels.length * 100) + "%",
        scrub: 1.2,
        pin: true,
        snap: 1 / (panels.length - 1),
    }
});

// Анимация появления каждой карточки
panels.forEach((panel, i) => {
    if (i > 0) {
        tl.from(panel.querySelector(".card"), {
            yPercent: 120,
            opacity: 0,
            scale: 0.7,
            rotationX: -20,
            duration: 1.5,
            ease: "power4.out"
        }, i);
    }
});

// Логика меню
const overlay = document.getElementById("menuOverlay");
const openBtn = document.getElementById("openMenu");
const closeBtn = document.getElementById("closeMenu");

openBtn.onclick = () => {
    overlay.classList.add("active");
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
};

closeBtn.onclick = () => {
    overlay.classList.remove("active");
};

// Навигация через меню
document.querySelectorAll(".menu-item").forEach((btn) => {
    btn.onclick = () => {
        const index = btn.getAttribute("data-index");
        overlay.classList.remove("active");
        
        gsap.to(window, {
            scrollTo: { y: index * window.innerHeight, autoKill: false },
            duration: 2,
            ease: "power4.inOut"
        });
        
        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    };
});
