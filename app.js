const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();
tg.setHeaderColor('#050505');

// Ждем полной загрузки DOM
window.addEventListener('load', () => {
    if (typeof gsap !== "undefined") {
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
        
        // Включаем фиксацию только если GSAP доступен
        document.body.style.overflow = "hidden";
        
        const panels = gsap.utils.toArray(".panel");
        
        // Делаем панели абсолютными только через JS
        gsap.set(".panel", { position: "absolute", top: 0, left: 0 });

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
                tl.from(panel.querySelector(".card"), {
                    yPercent: 100,
                    opacity: 0,
                    duration: 1
                }, i);
            }
        });

        // Навигация меню
        document.querySelectorAll(".menu-item").forEach((btn) => {
            btn.addEventListener("click", () => {
                const index = btn.getAttribute("data-index");
                document.getElementById("menuOverlay").classList.remove("active");
                
                gsap.to(window, {
                    scrollTo: { y: index * window.innerHeight, autoKill: false },
                    duration: 1.2
                });
            });
        });
    }
});

// Бургер
const overlay = document.getElementById("menuOverlay");
document.getElementById("openMenu").onclick = () => overlay.classList.add("active");
document.getElementById("closeMenu").onclick = () => overlay.classList.remove("active");
