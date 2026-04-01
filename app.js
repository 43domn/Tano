const tg = window.Telegram.WebApp;
tg.expand();
tg.setHeaderColor('#050505'); // Темний хедер для преміум-вигляду

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const panels = gsap.utils.toArray('.panel');
const navButtons = document.querySelectorAll('.nav-btn');
const navMenu = document.querySelector('.nav-menu');

panels.forEach((panel, i) => {
    // Фіксація блоків (Pinning)
    if(panel.id !== 'contacts') {
        ScrollTrigger.create({
            trigger: panel,
            start: "top top",
            pin: true,
            pinSpacing: false,
            snap: {
                snapTo: 1,
                duration: {min: 0.3, max: 0.8},
                ease: "power1.inOut"
            },
            onUpdate: (self) => {
                if (self.isActive) updateNav(panel.id);
            },
            onEnter: () => { if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light'); },
            onEnterBack: () => { if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light'); }
        });
    }

    // ВАУ-Анімація появи елементів (Spring effect)
    const elementsToAnimate = panel.querySelectorAll('.animate-pop');
    if (elementsToAnimate.length > 0) {
        gsap.from(elementsToAnimate, {
            scrollTrigger: {
                trigger: panel,
                start: "top center",
                toggleActions: "play none none reverse"
            },
            y: 40,
            opacity: 0,
            scale: 0.95,
            duration: 0.9,
            stagger: 0.1,
            ease: "back.out(1.5)" // Ефект пружинки
        });
    }
});

function updateNav(id) {
    navButtons.forEach(btn => {
        if (btn.getAttribute('data-target') === `#${id}`) {
            btn.classList.add('active');
            
            // Адаптація кольору меню під світлі/темні блоки
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

navButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const target = btn.getAttribute('data-target');
        if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');

        gsap.to(window, {
            duration: 1,
            scrollTo: target,
            ease: "power3.inOut"
        });
    });
});
