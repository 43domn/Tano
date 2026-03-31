const tg = window.Telegram.WebApp;
tg.expand();

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const panels = gsap.utils.toArray('.panel');
const navButtons = document.querySelectorAll('.nav-btn');

panels.forEach((panel, i) => {
    if(panel.id !== 'contacts') {
        ScrollTrigger.create({
            trigger: panel,
            start: "top top",
            pin: true,
            pinSpacing: false,
            snap: 1,
            onUpdate: (self) => {
                if (self.isActive) updateNav(panel.id);
            }
        });
    }

    gsap.from(panel.querySelectorAll('.fade-in'), {
        scrollTrigger: {
            trigger: panel,
            start: "top center",
            toggleActions: "play none none reverse"
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1
    });
});

function updateNav(id) {
    navButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-target') === `#${id}`);
    });
}

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
        gsap.to(window, {
            duration: 0.8,
            scrollTo: btn.getAttribute('data-target'),
            ease: "power2.inOut"
        });
    });
});
