// Ініціалізація Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand();
tg.setHeaderColor('#050505'); // Темний хедер

// Реєстрація плагінів GSAP
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const panels = gsap.utils.toArray('.panel');
const navButtons = document.querySelectorAll('.nav-btn');
const navMenu = document.querySelector('.nav-menu');

// ФІКС БАГІВ СКРОЛІНГУ: Попередній блок затемнюється при появі наступного
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".pin-wrapper",
        start: "top top",
        end: `+=${panels.length * 100}%`, // Задаємо висоту для довгого скролу
        scrub: 1, // Плавна прив'язка
        pin: true // Закріплюємо контейнер
    }
});

panels.forEach((panel, i) => {
    if(panel.id !== 'contacts') {
        const glassPanel = panel.querySelector('.glass-panel');
        
        if(i === 0) {
            // Перша панель (Геро) спочатку видима
            gsap.set(glassPanel, { opacity: 1, scale: 1 });
        } else {
            // Попередній блок затемнюється і зменшується, поки з'являється цей
            tl.to(panels[i-1].querySelector('.glass-panel'), { opacity: 0, scale: 0.9, duration: 1 })
              .to(glassPanel, { opacity: 1, scale: 1, duration: 1 }, "<") // "<" - анімації починаються одночасно
              // Додаємо оновлення меню при вході в блок
              .set(panel, { onStart: () => updateNav(panel.id) }, "<");
        }
    }
});

// Анімація Glass-панелей при вході (додатковий ефект)
panels.forEach((panel, i) => {
    if(panel.id !== 'contacts') {
        gsap.from(panel.querySelectorAll('.animate-pop'), {
            scrollTrigger: {
                trigger: panel,
                start: "top center",
                toggleActions: "play none none reverse"
            },
            y: 40,
            opacity: 0,
            scale: 0.95,
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.5)" // М'який відскок
        });
    }
});

// Функція оновлення активної кнопки в меню
function updateNav(id) {
    navButtons.forEach(btn => {
        if (btn.getAttribute('data-target') === `#${id}`) {
            btn.classList.add('active');
            
            // Адаптація меню під фон блоку
            if (id === 'loyalty' || id === 'cooperation') {
                navButtons.forEach(b => { if(!b.classList.contains('active')) b.style.color = '#555'; });
                navMenu.style.background = 'rgba(255, 255, 255, 0.85)';
                navMenu.style.border = '1px solid rgba(0,0,0,0.1)';
            } else {
                navButtons.forEach(b => { if(!b.classList.contains('active')) b.style.color = '#aaa'; });
                navMenu.style.background = 'rgba(25, 25, 25, 0.7)';
                navMenu.style.border = '1px solid rgba(255,255,255,0.08)';
            }
        } else {
            btn.classList.remove('active');
        }
    });
}

// Клік по навігації
navButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const target = btn.getAttribute('data-target');
        
        if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');

        gsap.to(window, {
            duration: 1.2,
            scrollTo: target,
            ease: "power3.inOut"
        });
    });
});
