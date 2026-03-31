const tg = window.Telegram.WebApp;
tg.expand();

// Регистрируем плагины
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const panels = gsap.utils.toArray('.panel');

// Основная логика закрепления блоков (Pinning)
panels.forEach((panel, i) => {
    ScrollTrigger.create({
        trigger: panel,
        start: "top top",
        pin: true,
        pinSpacing: false,
        snap: 1,
        onUpdate: (self) => {
            // Если блок активен, подсвечиваем кнопку в меню
            if (self.isActive) {
                updateNav(panel.id);
            }
        },
        onEnter: () => {
            if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
        }
    });
});

// Функция обновления активной кнопки
function updateNav(id) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-target') === `#${id}`);
    });
}

// Логика клика по кнопкам навигации
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const target = btn.getAttribute('data-target');
        
        // Вибрация при клике
        if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');

        // Плавный скролл к секции
        gsap.to(window, {
            duration: 1,
            scrollTo: target,
            ease: "power3.inOut"
        });
    });
});

// Анимация текста при входе
gsap.from(".fade-in", {
    y: 30,
    opacity: 0,
    duration: 1.2,
    stagger: 0.2,
    ease: "expo.out"
});
