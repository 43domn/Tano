// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand(); // Разворачиваем приложение на весь экран

// Регистрация плагина скролла
gsap.registerPlugin(ScrollTrigger);

// Анимация появления элементов на главном экране
gsap.from(".fade-in", {
    y: 40,
    opacity: 0,
    duration: 1.2,
    stagger: 0.2,
    ease: "power4.out"
});

// Логика "особенного скроллинга" (Pinning)
const panels = gsap.utils.toArray('.panel');

let tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".sticky-container",
        start: "top top",
        end: "+=200%", // Контейнер закреплен, пока пользователь не проскроллит 200% высоты экрана
        scrub: 1,      // Плавная привязка анимации к скроллу
        pin: true      // Останавливает скроллинг остального сайта
    }
});

// Появление первой панели
tl.to(panels[0], { opacity: 1, duration: 1 })
  // Переход от первой ко второй
  .to(panels[0], { opacity: 0, duration: 1, scale: 0.9 }, "+=0.5")
  .to(panels[1], { opacity: 1, duration: 1 }, "<")
  // Переход от второй к третьей
  .to(panels[1], { opacity: 0, duration: 1, scale: 0.9 }, "+=0.5")
  .to(panels[2], { opacity: 1, duration: 1 }, "<");

// Плавный скролл при клике на кнопку и Haptic Feedback (вибрация телефона)
document.getElementById('main-btn').addEventListener('click', () => {
    // Вызов тактильного отклика Telegram
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    
    // Скролл к каталогу
    document.getElementById('catalog-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
});
