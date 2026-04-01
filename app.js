const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

// Проверяем, загрузились ли библиотеки
if (typeof gsap !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const panels = gsap.utils.toArray(".panel");

    // Плавное появление карточек при скролле
    panels.forEach((panel) => {
        gsap.from(panel.querySelector(".card"), {
            scrollTrigger: {
                trigger: panel,
                start: "top center",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 50,
            duration: 0.8
        });
    });

    // Навигация меню
    document.querySelectorAll(".menu-item").forEach((btn) => {
        btn.addEventListener("click", () => {
            const index = btn.getAttribute("data-index");
            document.getElementById("menuOverlay").classList.remove("active");
            
            gsap.to(window, {
                scrollTo: { y: panels[index], autoKill: false },
                duration: 1
            });
        });
    });
}

// Открытие/закрытие меню
const overlay = document.getElementById("menuOverlay");
document.getElementById("openMenu").addEventListener("click", () => overlay.classList.add("active"));
document.getElementById("closeMenu").addEventListener("click", () => overlay.classList.remove("active"));
