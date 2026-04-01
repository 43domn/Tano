const tg = window.Telegram.WebApp;
tg.expand();

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const sections = gsap.utils.toArray('.panel');
const navBtns = document.querySelectorAll('.nav-btn');

sections.forEach((section, i) => {
    // Ефект фіксації та затемнення
    ScrollTrigger.create({
        trigger: section,
        start: "top top",
        pin: true,
        pinSpacing: false,
        onUpdate: (self) => {
            if (self.isActive) {
                // Оновлення активної кнопки
                navBtns.forEach(btn => btn.classList.remove('active'));
                document.querySelector(`[data-target="#${section.id}"]`).classList.add('active');
            }
        }
    });

    // Плавне зникнення контенту при скролі вниз
    gsap.to(section.querySelector('.glass-panel'), {
        scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: true
        },
        opacity: 0,
        scale: 0.8,
        filter: "blur(10px)"
    });

    // Красива поява елементів всередині
    gsap.from(section.querySelectorAll('.animate'), {
        scrollTrigger: {
            trigger: section,
            start: "top center"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "back.out(1.7)"
    });
});

// Плавний перехід по кліку
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        gsap.to(window, {
            duration: 1,
            scrollTo: btn.getAttribute('data-target'),
            ease: "power4.inOut"
        });
    });
});
