(() => {
    'use strict';

    // Navbar scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });

    // Hamburger
    const ham = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    ham?.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        const spans = ham.querySelectorAll('span');
        const open = navLinks.classList.contains('open');
        spans[0].style.transform = open ? 'rotate(45deg) translate(4px,4px)' : '';
        spans[1].style.opacity = open ? '0' : '1';
        spans[2].style.transform = open ? 'rotate(-45deg) translate(4px,-4px)' : '';
    });

    // Scroll Reveal
    const revealEls = document.querySelectorAll('.feature-card,.price-card,.testimonial-card,.spotlight-grid,.hero-badge,.cta-title,.cta-subtitle');
    revealEls.forEach(el => el.classList.add('reveal'));

    const ro = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('visible'), (e.target.dataset.index || 0) * 80);
                ro.unobserve(e.target);
            }
        });
    }, { threshold: 0.08 });

    revealEls.forEach(el => ro.observe(el));

    // Accordion
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const item = header.closest('.accordion-item');
            const isActive = item.classList.contains('active');
            const parent = item.closest('.feature-accordion');

            // Close all items
            parent.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));

            // If the clicked item was NOT active, open it
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Pricing Toggle
    const toggle = document.getElementById('pricingToggle');
    const proPrice = document.getElementById('proPrice');
    const monthlyLabel = document.getElementById('monthlyLabel');
    const annualLabel = document.getElementById('annualLabel');
    let isAnnual = false;

    toggle?.addEventListener('click', () => {
        isAnnual = !isAnnual;
        toggle.classList.toggle('on', isAnnual);
        if (proPrice) proPrice.textContent = isAnnual ? '$13' : '$19';
        monthlyLabel.style.opacity = isAnnual ? '0.5' : '1';
        annualLabel.style.opacity = isAnnual ? '1' : '0.5';
    });

    // Parallax Glow
    const glows = document.querySelectorAll('.hero-ref-glow');
    document.addEventListener('mousemove', e => {
        const xr = (e.clientX / window.innerWidth - 0.5) * 40;
        const yr = (e.clientY / window.innerHeight - 0.5) * 30;
        glows.forEach((g, i) => {
            g.style.transform = `translate(${xr}px, ${yr}px)`;
        });
    });

    // Floating Cards Parallax
    const floatCards = document.querySelectorAll('.floating-dashboard-card');
    document.addEventListener('mousemove', e => {
        const xr = (e.clientX / window.innerWidth - 0.5);
        const yr = (e.clientY / window.innerHeight - 0.5);
        floatCards.forEach((c, i) => {
            const d = (i + 1) * 12;
            c.style.transform = `translateY(${-Math.sin(Date.now() / 2000 + i) * 6}px) translate(${xr * d}px, ${yr * d}px)`;
        });
    });

    // Preview Window Tilt
    const pw = document.querySelector('.preview-window');
    const pWrap = document.querySelector('.spotlight-preview');

    pWrap?.addEventListener('mousemove', e => {
        const rect = pWrap.getBoundingClientRect();
        const xr = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
        const yr = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
        if (pw) pw.style.transform = `rotateY(${xr}deg) rotateX(${-yr}deg)`;
    });

    pWrap?.addEventListener('mouseleave', () => {
        if (pw) pw.style.transform = 'rotateY(-4deg) rotateX(2deg)';
    });

    // Smooth scroll nav
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                navLinks?.classList.remove('open');
            }
        });
    });

    // Particle canvas in hero
    const canvas = document.createElement('canvas');
    canvas.id = 'particleCanvas';
    canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:0;opacity:0.4';
    document.querySelector('.hero-ref')?.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }

    function createParticles() {
        particles = Array.from({ length: 60 }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.5 + 0.5,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            alpha: Math.random() * 0.5 + 0.1,
        }));
    }

    function drawParticles() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(59,130,246,${p.alpha})`;
            ctx.fill();
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = W;
            if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H;
            if (p.y > H) p.y = 0;
        });

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(59,130,246,${0.12 * (1 - dist / 100)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(drawParticles);
    }

    new ResizeObserver(() => { resize(); createParticles(); }).observe(canvas.parentElement);
    resize(); createParticles(); drawParticles();

    // Button ripple
    document.querySelectorAll('.btn-hero-primary,.btn-hero-secondary,.btn-primary,.price-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.cssText = `
        position:absolute;border-radius:50%;
        width:${size}px;height:${size}px;
        left:${e.clientX - rect.left - size / 2}px;
        top:${e.clientY - rect.top - size / 2}px;
        background:rgba(255,255,255,0.15);
        transform:scale(0);
        animation:ripple .6s linear;
        pointer-events:none;
      `;
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Ripple keyframe
    if (!document.getElementById('rippleStyle')) {
        const s = document.createElement('style');
        s.id = 'rippleStyle';
        s.textContent = '@keyframes ripple{to{transform:scale(2.5);opacity:0}}';
        document.head.appendChild(s);
    }

    //  Typing effect in hero badge
    const badge = document.querySelector('.hero-badge-new');
    if (badge) {
        const text = badge.querySelector('span:last-child');
        if (text) {
            const original = text.textContent;
            text.textContent = '';
            let i = 0;
            setTimeout(() => {
                const timer = setInterval(() => {
                    text.textContent = original.slice(0, ++i);
                    if (i >= original.length) clearInterval(timer);
                }, 45);
            }, 600);
        }
    }


})();
