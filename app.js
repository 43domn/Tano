const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const panels = gsap.utils.toArray(".panel");

// Створюємо головний таймлайн для скролу
let tl = gsap.timeline({
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "+=" + (panels.length * 100) + "%",
        scrub: 1,
        pin: true,
        snap: 1 / (panels.length - 1)
    }
});

// Логіка перемикання секцій з затемненням
panels.forEach((panel, i) => {
    if (i > 0) {
        // Попередня секція плавно зникає та затемнюється
        tl.to(panels[i-1], { 
            opacity: 0, 
            scale: 0.8, 
            duration: 0.5,
            pointerEvents: 'none'
        }, i)
        // Нова секція з'являється
        .from(panel, { 
            opacity: 0, 
            yPercent: 30, 
            duration: 0.5 
        }, i);
    }
    
    // Оновлення меню
    ScrollTrigger.create({
        trigger: "body",
        start: (i * (100 / (panels.length - 1))) + "% top",
        onEnter: () => updateMenu(panel.id),
        onEnterBack: () => updateMenu(panel.id)
    });
});

function updateMenu(id) {
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.link === id);
    });
    if (tg.HapticFeedback) tg.HapticFeedback.selectionChanged();
}

// Плавний перехід по кліку
document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.link;
        const index = panels.findIndex(p => p.id === target);
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const scrollTarget = (index / (panels.length - 1)) * totalHeight;

        gsap.to(window, {
            scrollTo: scrollTarget,
            duration: 1.2,
            ease: "power4.inOut"
        });
    });
});
