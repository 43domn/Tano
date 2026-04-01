// Инициализация Telegram
const tg = window.Telegram.WebApp;
tg.expand();

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const panels = gsap.utils.toArray(".panel");
const navBtns = document.querySelectorAll(".nav-btn");

// Основная анимация скролла
panels.forEach((panel, i) => {
    // Не трогаем последнюю панель для эффекта наслоения
    if (i < panels.length - 1) {
        gsap.to(panel, {
            scrollTrigger: {
                trigger: panel,
                start: "top top",
                end: "bottom top",
                scrub: true,
                pin: true,
                pinSpacing: false
            },
            // Тот самый эффект "красоты": затемнение и уменьшение
            opacity: 0.4,
            scale: 0.85,
            filter: "blur(10px)"
        });
    }

    // Синхронизация навигации при скролле
    ScrollTrigger.create({
        trigger: panel,
        start: "top center",
        end: "bottom center",
        onToggle: self => {
            if (self.isActive) {
                updateNav(i);
            }
        }
    });
});

// Функция переключения активной кнопки
function updateNav(index) {
    navBtns.forEach((btn, i) => {
        btn.classList.toggle("active", i === index);
    });
    // Легкая вибрация при переключении (фишка Telegram)
    if (tg.HapticFeedback) {
        tg.HapticFeedback.selectionChanged();
    }
}

// Обработка кликов по кнопкам навигации
navBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-section");
        
        gsap.to(window, {
            duration: 1,
            scrollTo: { y: index * window.innerHeight, autoKill: false },
            ease: "power4.inOut"
        });
    });
});
