const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();
tg.setHeaderColor('#050505');

// Оставляем только ScrollTrigger, плагин скролла больше не нужен
gsap.registerPlugin(ScrollTrigger);

const panels = gsap.utils.toArray(".panel");

// 1. НАСТРОЙКА СКРОЛЛИНГА
const mainTl = gsap.timeline({
    scrollTrigger: {
        trigger: "#app-container", // ВАЖНО: теперь привязано к контейнеру, а не к body
        start: "top top",
        end: "+=" + (panels.length * 100) + "%",
        scrub: 1,
        pin: true,
        snap: 1 / (panels.length - 1)
    }
});

panels.forEach((panel, i) => {
    if (i > 0) {
        gsap.set(panel, { position: "absolute", top: 0, left: 0, opacity: 0, scale: 0.8 });
    }

    if (i > 0) {
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

// 2. ЛОГИКА МЕНЮ
const menuToggle = document.getElementById("menuToggle");
const menuOverlay = document.getElementById("menuOverlay");
const menuItems = document.querySelectorAll(".menu-item");

menuToggle.addEventListener("click", () => {
    menuOverlay.classList.toggle("active");
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
});

// Навигация по клику
menuItems.forEach((item) => {
    item.addEventListener("click", () => {
        const index = parseInt(item.getAttribute("data-index"));
        menuOverlay.classList.remove("active"); // Скрываем меню

        // Небольшая задержка, чтобы меню успело плавно исчезнуть без "фризов"
        setTimeout(() => {
            const st = mainTl.scrollTrigger;
            
            // Вычисляем точный пиксель для остановки
            const targetY = st.start + (index * (st.end - st.start) / (panels.length - 1));
            
            // Нативный скролл устройства (работает в Telegram безотказно)
            window.scrollTo({
                top: targetY,
                behavior: "smooth"
            });
        }, 150);

        if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    });
});

// Закрытие при клике по фону
menuOverlay.addEventListener("click", (e) => {
    if (e.target === menuOverlay) menuOverlay.classList.remove("active");
});
