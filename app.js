// Ініціалізація Telegram Web App
const tg = window.Telegram.WebApp;
tg.expand();
tg.setHeaderColor('#ffffff');

// Реєстрація плагінів GSAP
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const panels = gsap.utils.toArray('.panel');
const navButtons = document.querySelectorAll('.nav-btn');

// Логіка закріплення екранів (Pinning)
panels.forEach((panel, i) => {
    // Не робимо pinning для футера, щоб він просто виїжджав в кінці
    if(panel.id !== 'contacts') {
        ScrollTrigger.create({
            trigger: panel,
            start: "top top",
            pin: true,
            pinSpacing: false,
            snap: 1, // Доводка до екрану
            onUpdate: (self) => {
                if (self.isActive) {
                    updateNav(panel.id);
                }
            },
            onEnter: () => {
                if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
            },
            onEnterBack: () => {
                if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
            }
        });
    }

    // Анімація появи елементів всередині кожного екрану
    const elementsToAnimate = panel.querySelectorAll('.fade-in');
    if (elementsToAnimate.length > 0) {
        gsap.from(elementsToAnimate, {
            scrollTrigger: {
                trigger: panel,
                start: "top center",
                toggleActions: "play none none reverse"
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out"
        });
    }
});

// Функція оновлення активної кнопки в меню
function updateNav(id) {
    navButtons.forEach(btn => {
        if (btn.getAttribute('data-target') === `#${id}`) {
            btn.classList.add('active');
            
            // Зміна кольору тексту кнопок меню залежно від фону секції
            const navMenu = document.querySelector('.nav-menu');
            if (id === 'hero' || id === 'cooperation') {
                navButtons.forEach(b => { if(!b.classList.contains('active')) b.style.color = '#000'; });
                navMenu.style.background = 'rgba(0, 0, 0, 0.05)';
            } else {
                navButtons.forEach(b => { if(!b.classList.contains('active')) b.style.color = '#fff'; });
                navMenu.style.background = 'rgba(255, 255, 255, 0.15)';
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
            ease: "power4.inOut"
        });
    });
});
