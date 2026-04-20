/* =============================================
   SARASWATI HIGH SCHOOL — MAIN JAVASCRIPT
   Interactions, Animations, Scroll Effects
   ============================================= */

(function () {
    'use strict';

    // ============================================
    // PAGE LOAD & TRANSITION
    // ============================================
    const pageTransition = document.querySelector('.page-transition');

    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        if (pageTransition) {
            pageTransition.classList.remove('active');
        }
        initAll();
    });

    // Page transition on link clicks
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (!link) return;

        const href = link.getAttribute('href');
        // Only handle local page links
        if (href && href.endsWith('.html') && !href.startsWith('http') && !href.startsWith('#')) {
            e.preventDefault();
            if (pageTransition) {
                pageTransition.classList.add('active');
            }
            setTimeout(() => {
                window.location.href = href;
            }, 400);
        }
    });

    // ============================================
    // INITIALIZATION
    // ============================================
    function initAll() {
        initNavbar();
        initScrollReveal();
        initCounterAnimation();
        initTestimonials();
        initGalleryFilter();
        initFAQ();
        initContactForm();
        initBackToTop();
        initRippleEffect();
        initParticles();
        initMobileNavOverlay();
    }

    // ============================================
    // NAVBAR
    // ============================================
    function initNavbar() {
        const navbar = document.getElementById('navbar');
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');

        // Scroll effect
        function handleScroll() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        window.addEventListener('scroll', throttle(handleScroll, 100));
        handleScroll();

        // Mobile toggle
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('open');

                const overlay = document.querySelector('.nav-overlay');
                if (overlay) {
                    overlay.classList.toggle('show');
                }
            });
        }
    }

    function initMobileNavOverlay() {
        // Create overlay for mobile nav
        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);

        overlay.addEventListener('click', () => {
            const navToggle = document.getElementById('nav-toggle');
            const navMenu = document.getElementById('nav-menu');
            if (navToggle && navMenu) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('open');
                overlay.classList.remove('show');
            }
        });
    }

    // ============================================
    // SCROLL REVEAL (IntersectionObserver)
    // ============================================
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');

        if (!revealElements.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px',
            }
        );

        revealElements.forEach((el) => observer.observe(el));
    }

    // ============================================
    // COUNTER ANIMATION
    // ============================================
    function initCounterAnimation() {
        const counters = document.querySelectorAll('[data-target]');
        if (!counters.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        counters.forEach((counter) => observer.observe(counter));
    }

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'), 10);
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(update);
    }

    // ============================================
    // TESTIMONIALS SLIDER
    // ============================================
    function initTestimonials() {
        const track = document.getElementById('testimonials-track');
        const prevBtn = document.getElementById('test-prev');
        const nextBtn = document.getElementById('test-next');
        const dotsContainer = document.getElementById('testimonial-dots');

        if (!track || !prevBtn || !nextBtn) return;

        let currentSlide = 0;
        const cards = track.querySelectorAll('.testimonial-card');
        const totalSlides = cards.length;

        function goToSlide(index) {
            currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
            track.style.transform = `translateX(-${currentSlide * 100}%)`;

            // Update dots
            if (dotsContainer) {
                const dots = dotsContainer.querySelectorAll('.dot');
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentSlide);
                });
            }
        }

        prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

        // Dot clicks
        if (dotsContainer) {
            dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
                dot.addEventListener('click', () => goToSlide(i));
            });
        }

        // Auto-advance
        let autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);

        // Pause on hover
        track.addEventListener('mouseenter', () => clearInterval(autoSlide));
        track.addEventListener('mouseleave', () => {
            autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) goToSlide(currentSlide + 1);
                else goToSlide(currentSlide - 1);
            }
        }, { passive: true });
    }

    // ============================================
    // GALLERY FILTER
    // ============================================
    function initGalleryFilter() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');

        if (!filterBtns.length || !galleryItems.length) return;

        filterBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');

                // Update active button
                filterBtns.forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter items with animation
                galleryItems.forEach((item, index) => {
                    const category = item.getAttribute('data-category');

                    if (filter === 'all' || category === filter) {
                        item.classList.remove('hidden');
                        item.style.animation = `fade-in-up 0.5s ease ${index * 0.05}s forwards`;
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }

    // ============================================
    // FAQ ACCORDION
    // ============================================
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        if (!faqItems.length) return;

        faqItems.forEach((item) => {
            const question = item.querySelector('.faq-question');
            if (!question) return;

            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');

                // Close all
                faqItems.forEach((i) => {
                    i.classList.remove('open');
                    const btn = i.querySelector('.faq-question');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                });

                // Toggle current
                if (!isOpen) {
                    item.classList.add('open');
                    question.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    // ============================================
    // CONTACT FORM
    // ============================================
    function initContactForm() {
        const form = document.getElementById('contact-form');
        const successMsg = document.getElementById('form-success');

        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic validation is handled by HTML5 required attributes
            // Show success message
            form.style.display = 'none';
            if (successMsg) {
                successMsg.classList.add('show');
            }

            // Reset after 5 seconds
            setTimeout(() => {
                form.reset();
                form.style.display = 'flex';
                if (successMsg) {
                    successMsg.classList.remove('show');
                }
            }, 5000);
        });
    }

    // ============================================
    // BACK TO TOP
    // ============================================
    function initBackToTop() {
        const btn = document.getElementById('back-to-top');
        if (!btn) return;

        function toggleVisibility() {
            if (window.scrollY > 400) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        }

        window.addEventListener('scroll', throttle(toggleVisibility, 100));

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ============================================
    // RIPPLE EFFECT
    // ============================================
    function initRippleEffect() {
        const buttons = document.querySelectorAll('.ripple-btn');

        buttons.forEach((btn) => {
            btn.addEventListener('click', function (e) {
                const rect = this.getBoundingClientRect();
                const ripple = document.createElement('span');
                ripple.className = 'ripple';

                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
                ripple.style.top = e.clientY - rect.top - size / 2 + 'px';

                this.appendChild(ripple);

                ripple.addEventListener('animationend', () => ripple.remove());
            });
        });
    }

    // ============================================
    // PARTICLES BACKGROUND
    // ============================================
    function initParticles() {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationId;
        let particles = [];

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resize();
        window.addEventListener('resize', debounce(resize, 200));

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.hue = Math.random() > 0.5 ? 230 : 35; // Blue or gold
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 60%, 60%, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Limit particles based on screen size
        const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80);

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        const opacity = (1 - dist / 150) * 0.15;
                        ctx.strokeStyle = `rgba(26, 35, 126, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p) => {
                p.update();
                p.draw();
            });

            connectParticles();
            animationId = requestAnimationFrame(animate);
        }

        // Only animate when visible
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        animate();
                    } else {
                        cancelAnimationFrame(animationId);
                    }
                });
            },
            { threshold: 0 }
        );

        observer.observe(canvas);

        // Reduce animation on low-power devices
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            cancelAnimationFrame(animationId);
            canvas.style.display = 'none';
        }
    }

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    function throttle(fn, delay) {
        let last = 0;
        return function (...args) {
            const now = Date.now();
            if (now - last >= delay) {
                last = now;
                fn.apply(this, args);
            }
        };
    }

    function debounce(fn, delay) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        };
    }
})();
