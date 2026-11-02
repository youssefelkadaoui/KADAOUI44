/* =========================================================
   44 — Youssef Kadaoui
   Interactions: particles, typing, reveal, filters, forms…
   ========================================================= */
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var isEnglish = document.documentElement.lang === 'en';

    /* ---------- Language gate (first visit) ---------- */
    var gate = document.getElementById('langGate');
    if (gate) {
        var LANG_KEY = 'kadaoui44-lang';
        var savedLang = null;
        try {
            savedLang = localStorage.getItem(LANG_KEY);
        } catch (err) {
            savedLang = null;
        }

        var hideGate = function () {
            gate.classList.add('hidden');
            document.body.style.overflow = '';
        };

        if (savedLang) {
            hideGate();
        } else {
            document.body.style.overflow = 'hidden';
        }

        gate.querySelectorAll('[data-lang]').forEach(function (option) {
            option.addEventListener('click', function (e) {
                var lang = option.getAttribute('data-lang');
                try {
                    localStorage.setItem(LANG_KEY, lang);
                } catch (err) {
                    /* storage unavailable — ignore */
                }

                if (lang === document.documentElement.lang) {
                    e.preventDefault();
                    hideGate();
                }
            });
        });
    }

    /* ---------- Header on scroll ---------- */
    var header = document.getElementById('header');
    if (header) {
        var onScrollHeader = function () {
            header.classList.toggle('scrolled', window.scrollY > 12);
        };
        window.addEventListener('scroll', onScrollHeader, { passive: true });
        onScrollHeader();
    }

    /* ---------- Scroll progress ---------- */
    var progress = document.getElementById('scrollProgress');
    if (progress) {
        var onScrollProgress = function () {
            var doc = document.documentElement;
            var total = doc.scrollHeight - doc.clientHeight;
            progress.style.width = (total > 0 ? (doc.scrollTop / total) * 100 : 0) + '%';
        };
        window.addEventListener('scroll', onScrollProgress, { passive: true });
        onScrollProgress();
    }

    /* ---------- Mobile nav ---------- */
    var toggle = document.getElementById('navToggle');
    var nav = document.getElementById('nav');
    if (toggle && nav) {
        var closeNav = function () {
            toggle.classList.remove('open');
            nav.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        };

        toggle.addEventListener('click', function () {
            var isOpen = nav.classList.toggle('open');
            toggle.classList.toggle('open', isOpen);
            toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', closeNav);
        });

        document.addEventListener('click', function (e) {
            if (!toggle.contains(e.target) && !nav.contains(e.target)) closeNav();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeNav();
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 992) closeNav();
        });
    }

    /* ---------- Back to top ---------- */
    var backTop = document.getElementById('backTop');
    if (backTop) {
        window.addEventListener('scroll', function () {
            backTop.classList.toggle('visible', window.scrollY > 420);
        }, { passive: true });

        backTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    }

    /* ---------- Reveal on scroll ---------- */
    var revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length) {
        if ('IntersectionObserver' in window && !reduceMotion) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('in');
                    observer.unobserve(entry.target);
                });
            }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

            revealEls.forEach(function (el, index) {
                var siblings = el.parentElement ? el.parentElement.children : [];
                var pos = Array.prototype.indexOf.call(siblings, el);
                el.style.transitionDelay = (Math.min(pos, 5) * 70) + 'ms';
                observer.observe(el);
            });
        } else {
            revealEls.forEach(function (el) { el.classList.add('in'); });
        }
    }

    /* ---------- Animated counters ---------- */
    var counters = document.querySelectorAll('[data-count]');
    if (counters.length) {
        var animateCounter = function (el) {
            var target = parseFloat(el.getAttribute('data-count')) || 0;
            var suffix = el.getAttribute('data-suffix') || '';
            var duration = 1500;
            var start = null;

            if (reduceMotion) {
                el.textContent = target + suffix;
                return;
            }

            var frame = function (time) {
                if (start === null) start = time;
                var p = Math.min((time - start) / duration, 1);
                var eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.round(target * eased) + suffix;
                if (p < 1) requestAnimationFrame(frame);
            };
            requestAnimationFrame(frame);
        };

        if ('IntersectionObserver' in window) {
            var counterObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                });
            }, { threshold: 0.4 });
            counters.forEach(function (el) { counterObserver.observe(el); });
        } else {
            counters.forEach(animateCounter);
        }
    }

    /* ---------- Skill bars ---------- */
    var bars = document.querySelectorAll('.bar i[data-w]');
    if (bars.length) {
        var fillBar = function (el) {
            el.style.width = el.getAttribute('data-w') + '%';
        };
        if ('IntersectionObserver' in window && !reduceMotion) {
            var barObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    fillBar(entry.target);
                    barObserver.unobserve(entry.target);
                });
            }, { threshold: 0.4 });
            bars.forEach(function (el) { barObserver.observe(el); });
        } else {
            bars.forEach(fillBar);
        }
    }

    /* ---------- Typing effect ---------- */
    var typed = document.getElementById('typed');
    if (typed && !reduceMotion) {
        var words = isEnglish ? [
            'Web Developer',
            'Graphic Designer',
            'Tech Solutions Expert',
            'Digital Content Creator'
        ] : [
            'مطوّر مواقع',
            'مصمم جرافيك',
            'خبير حلول تقنية',
            'صانع محتوى رقمي'
        ];
        var wordIndex = 0;
        var charIndex = 0;
        var deleting = false;

        var tick = function () {
            var word = words[wordIndex];
            if (!deleting) {
                charIndex++;
                typed.textContent = word.slice(0, charIndex);
                if (charIndex === word.length) {
                    deleting = true;
                    setTimeout(tick, 1600);
                    return;
                }
                setTimeout(tick, 85);
            } else {
                charIndex--;
                typed.textContent = word.slice(0, charIndex);
                if (charIndex === 0) {
                    deleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                    setTimeout(tick, 320);
                    return;
                }
                setTimeout(tick, 40);
            }
        };
        setTimeout(tick, 700);
    }

    /* ---------- Card spotlight + tilt ---------- */
    var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (canHover && !reduceMotion) {
        document.querySelectorAll('.card').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                card.style.setProperty('--mx', x + 'px');
                card.style.setProperty('--my', y + 'px');
            });

            card.addEventListener('mouseleave', function () {
                card.style.removeProperty('--mx');
                card.style.removeProperty('--my');
            });
        });

        document.querySelectorAll('.tilt').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var px = (e.clientX - rect.left) / rect.width - 0.5;
                var py = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = 'perspective(900px) rotateX(' + (-py * 6) + 'deg) rotateY(' + (px * 6) + 'deg) translateY(-6px)';
            });
            card.addEventListener('mouseleave', function () {
                card.style.transform = '';
            });
        });
    }

    /* ---------- Portfolio filter ---------- */
    var filterButtons = document.querySelectorAll('.filter button');
    var projects = document.querySelectorAll('.project');
    if (filterButtons.length && projects.length) {
        filterButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var cat = btn.getAttribute('data-filter');

                filterButtons.forEach(function (b) {
                    b.classList.toggle('active', b === btn);
                    b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
                });

                projects.forEach(function (project) {
                    var show = cat === 'all' || project.getAttribute('data-cat') === cat;
                    project.hidden = !show;
                });
            });
        });
    }

    /* ---------- Contact form success ---------- */
    if (window.location.search.indexOf('success=true') !== -1) {
        var form = document.getElementById('contactForm');
        var formCard = document.querySelector('.form-card');
        var formNote = document.querySelector('.form-note');
        if (form && formCard) {
            form.style.display = 'none';
            if (formNote) formNote.style.display = 'none';
            var success = document.createElement('div');
            success.className = 'form-success active';
            success.innerHTML = isEnglish
                ? '<i class="fas fa-circle-check"></i><h3>Your message was sent successfully</h3><p>Thank you for reaching out. I will get back to you as soon as possible.</p>'
                : '<i class="fas fa-circle-check"></i><h3>تم إرسال رسالتك بنجاح</h3><p>شكراً لتواصلك، سأرد عليك في أقرب وقت ممكن.</p>';
            formCard.appendChild(success);
            success.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        }
    }

    /* ---------- Auto year ---------- */
    document.querySelectorAll('[data-year]').forEach(function (el) {
        el.textContent = new Date().getFullYear();
    });

    /* ---------- Particle network (digital world) ---------- */
    var canvas = document.getElementById('fx');
    if (canvas && !reduceMotion) {
        var ctx = canvas.getContext('2d');
        var width = 0;
        var height = 0;
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        var particles = [];
        var animationId = null;

        var buildParticles = function () {
            var count = Math.min(80, Math.max(26, Math.floor(window.innerWidth / 18)));
            particles = [];
            for (var i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.22 * dpr,
                    vy: (Math.random() - 0.5) * 0.22 * dpr,
                    r: (Math.random() * 1.4 + 0.5) * dpr
                });
            }
        };

        var resizeCanvas = function () {
            width = canvas.width = Math.floor(window.innerWidth * dpr);
            height = canvas.height = Math.floor(window.innerHeight * dpr);
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
            buildParticles();
        };

        var linkDistance = 132 * dpr;

        var draw = function () {
            ctx.clearRect(0, 0, width, height);

            for (var i = 0; i < particles.length; i++) {
                var p = particles[i];
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < -20) p.x = width + 20;
                if (p.x > width + 20) p.x = -20;
                if (p.y < -20) p.y = height + 20;
                if (p.y > height + 20) p.y = -20;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(56, 189, 248, 0.55)';
                ctx.fill();

                for (var j = i + 1; j < particles.length; j++) {
                    var q = particles[j];
                    var dx = p.x - q.x;
                    var dy = p.y - q.y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < linkDistance) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = 'rgba(56, 189, 248, ' + (0.16 * (1 - dist / linkDistance)) + ')';
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }

            animationId = requestAnimationFrame(draw);
        };

        resizeCanvas();
        draw();

        var resizeTimeout;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeCanvas, 180);
        });

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animationId = requestAnimationFrame(draw);
            }
        });
    }
})();
