// ===== TECH BACKGROUND SYMBOLS =====
const bgTech = document.getElementById('bgTech');
if (bgTech) {
    const techSymbols = [
        '&lt;/&gt;', '{ }', '&lt;div&gt;', 'function()', 'async', 'await',
        'const', 'let', 'var', 'return', 'import', 'export', 'class',
        'void', 'main()', 'if()', 'else', 'for()', 'while()',
        'console.log', 'npm', 'git', 'node', 'react', 'vue',
        'HTML', 'CSS', 'JS', 'PHP', 'SQL', 'API', 'JSON',
        'UX', 'UI', 'SEO', 'DevOps', 'www', '.com', '.dev',
        '&lt;body&gt;', '&lt;head&gt;', '&lt;meta&gt;', '&lt;link&gt;',
        '300px', '100vh', 'flex', 'grid', '#000', '#fff',
        'http://', 'https://', 'localhost', 'debug', 'build',
        'design', 'code', 'dev', 'web', 'app', 'site',
        'Photoshop', 'Illustrator', 'Premiere', 'After Effects',
        'Windows', 'Linux', 'MacOS', 'iOS', 'Android',
        'CPU', 'GPU', 'RAM', 'SSD', 'BIOS', 'kernel',
        'virus', 'malware', 'firewall', 'encrypt', 'backup',
        'WiFi', 'Bluetooth', 'cloud', 'server', 'host',
        '3D', '4K', '8K', 'FPS', 'RGB', 'VPN', 'DNS'
    ];

    for (let i = 0; i < 30; i++) {
        const span = document.createElement('span');
        span.textContent = techSymbols[Math.floor(Math.random() * techSymbols.length)];
        span.style.left = Math.random() * 100 + '%';
        span.style.fontSize = (0.7 + Math.random() * 1) + 'rem';
        span.style.animationDuration = (20 + Math.random() * 20) + 's';
        span.style.animationDelay = (Math.random() * 15) + 's';
        span.style.opacity = 0.3 + Math.random() * 0.5;
        bgTech.appendChild(span);
    }
}

// ===== MOBILE NAV =====
const toggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

if (toggle && nav) {
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('open');
        nav.classList.toggle('open');
    });

    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('open');
            nav.classList.remove('open');
        });
    });

    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !nav.contains(e.target)) {
            toggle.classList.remove('open');
            nav.classList.remove('open');
        }
    });
}

// ===== SCROLL PROGRESS =====
const progress = document.getElementById('scrollProgress');
if (progress) {
    window.addEventListener('scroll', () => {
        const h = document.documentElement;
        const total = h.scrollHeight - h.clientHeight;
        progress.style.width = (h.scrollTop / total * 100) + '%';
    });
}

// ===== BACK TO TOP =====
const backTop = document.getElementById('backTop');
if (backTop) {
    window.addEventListener('scroll', () => {
        backTop.classList.toggle('visible', window.scrollY > 400);
    });

    backTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll(
    '.service-card, .stat-item, .contact-card, .about-wrap, .services-grid, .contact-wrap, .consult-box, .hero-photo-wrap'
);

if (revealEls.length) {
    revealEls.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    revealEls.forEach(el => observer.observe(el));
}

// ===== 3D CARD TILT =====
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 8;
        const rotateY = (centerX - x) / 8;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(30px) translateY(-10px)`;
        card.style.boxShadow = `-${(centerX - x) / 5}px ${(centerY - y) / 5}px 40px rgba(41, 182, 246, 0.15)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) translateY(0)';
        card.style.boxShadow = '';
    });
});

// ===== 3D PARALLAX ON HERO =====
const hero = document.querySelector('.home-hero');
if (hero) {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
            hero.style.backgroundPositionY = scrolled * 0.25 + 'px';
        }
    });
}

// ===== 3D PARALLAX ON PAGE HERO =====
document.querySelectorAll('.page-hero').forEach(section => {
    window.addEventListener('scroll', () => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const offset = (window.innerHeight - rect.top) * 0.03;
            const h1 = section.querySelector('h1');
            if (h1) h1.style.transform = `translateZ(${offset}px)`;
        }
    });
});

// ===== STATS COUNTER =====
const statNums = document.querySelectorAll('.stat-num');

statNums.forEach(el => {
    const target = parseInt(el.dataset.target);
    if (!target) return;

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            let current = 0;
            const step = Math.ceil(target / 35);

            const update = () => {
                current += step;
                if (current < target) {
                    el.textContent = current;
                    requestAnimationFrame(update);
                } else {
                    el.textContent = target + '+';
                    obs.unobserve(el);
                }
            };
            update();
        });
    }, { threshold: 0.5 });

    obs.observe(el);
});

// ===== FORM SUCCESS DETECTION =====
if (window.location.search.includes('success=true')) {
    const form = document.getElementById('contactForm');
    const consultBox = document.querySelector('.consult-box');
    if (form) form.style.display = 'none';
    if (consultBox) {
        const msg = document.createElement('div');
        msg.className = 'form-success active';
        msg.innerHTML = '<i class="fas fa-check-circle"></i><h3>تم الإرسال بنجاح!</h3><p>شكراً لتواصلك، سأرد عليك في أقرب وقت ممكن</p>';
        consultBox.appendChild(msg);
    }
}

