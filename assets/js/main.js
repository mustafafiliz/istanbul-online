/**
 * Istanbul Online - Software Development Company
 * Main JavaScript File
 */

// ============================================
// LANGUAGE SWITCHER
// ============================================

class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('lang') || 'tr';
        this.translations = {};
        this.init();
    }

    async init() {
        await this.loadTranslations();
        this.applyTranslations();
        this.setupSwitcher();
        this.updateHtmlLang();
    }

    async loadTranslations() {
        try {
            const [trResponse, enResponse] = await Promise.all([
                fetch('assets/lang/tr.json'),
                fetch('assets/lang/en.json')
            ]);
            
            this.translations = {
                tr: await trResponse.json(),
                en: await enResponse.json()
            };
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }

    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : null;
        }, obj);
    }

    applyTranslations() {
        const lang = this.translations[this.currentLang];
        if (!lang) return;

        // Update text content
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const value = this.getNestedValue(lang, key);
            if (value) {
                element.textContent = value;
            }
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const value = this.getNestedValue(lang, key);
            if (value) {
                element.placeholder = value;
            }
        });

        // Update lang switcher button
        const langBtn = document.querySelector('.lang-current');
        if (langBtn) {
            langBtn.textContent = this.currentLang.toUpperCase();
        }
    }

    updateHtmlLang() {
        document.documentElement.lang = this.currentLang;
    }

    setupSwitcher() {
        const switcher = document.getElementById('langSwitcher');
        if (switcher) {
            switcher.addEventListener('click', () => {
                this.currentLang = this.currentLang === 'tr' ? 'en' : 'tr';
                localStorage.setItem('lang', this.currentLang);
                this.applyTranslations();
                this.updateHtmlLang();
            });
        }
    }

    switchTo(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('lang', lang);
            this.applyTranslations();
            this.updateHtmlLang();
        }
    }
}

// ============================================
// CURSOR GLOW EFFECT
// ============================================

class CursorGlow {
    constructor() {
        this.cursorGlow = document.getElementById('cursorGlow');
        this.mouseX = 0;
        this.mouseY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.isActive = false;
        this.init();
    }

    init() {
        if (!this.cursorGlow) return;

        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            if (!this.isActive) {
                this.isActive = true;
                this.animate();
            }
        });

        document.addEventListener('mouseleave', () => {
            this.isActive = false;
        });
    }

    animate() {
        if (!this.isActive || !this.cursorGlow) return;

        this.currentX += (this.mouseX - this.currentX) * 0.1;
        this.currentY += (this.mouseY - this.currentY) * 0.1;

        this.cursorGlow.style.left = `${this.currentX}px`;
        this.cursorGlow.style.top = `${this.currentY}px`;

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// NAVBAR
// ============================================

class Navbar {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
        this.setupSmoothScroll();
        this.setupMobileMenu();
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (this.navbar) {
            if (scrollTop > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        }

        this.updateActiveLink();
    }

    updateActiveLink() {
        const scrollPosition = window.scrollY + 200;

        this.sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach((link) => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = anchor.getAttribute('href');
                if (target && target !== '#') {
                    const element = document.querySelector(target);
                    if (element) {
                        const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navLinks = document.querySelector('.nav-links');

        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenuBtn.classList.toggle('active');
                navLinks.classList.toggle('active');
            });
        }
    }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

class ScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll('[data-animate]');
        this.config = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersect(entries),
            {
                threshold: this.config.threshold,
                rootMargin: this.config.rootMargin
            }
        );
        this.init();
    }

    init() {
        this.animatedElements.forEach((element) => {
            this.observer.observe(element);
        });
    }

    handleIntersect(entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.dataset.delay || '0';
                
                setTimeout(() => {
                    element.classList.add('animated');
                }, parseInt(delay));

                this.observer.unobserve(element);
            }
        });
    }
}

// ============================================
// NUMBER COUNTER
// ============================================

class NumberCounter {
    constructor() {
        this.counters = document.querySelectorAll('[data-count]');
        this.duration = 2000;
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersect(entries),
            { threshold: 0.5 }
        );
        this.init();
    }

    init() {
        this.counters.forEach((counter) => {
            this.observer.observe(counter);
        });
    }

    handleIntersect(entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                this.animateCounter(counter);
                this.observer.unobserve(counter);
            }
        });
    }

    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const start = 0;
        const startTime = performance.now();
        const duration = this.duration;

        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (target - start) * easeOutQuart);
            
            element.textContent = current.toString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toString();
            }
        };

        requestAnimationFrame(updateCounter);
    }
}

// ============================================
// CONTACT FORM
// ============================================

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const data = {};
        
        formData.forEach((value, key) => {
            data[key] = value;
        });

        this.showSuccessMessage();
        this.form.reset();
    }

    showSuccessMessage() {
        const button = this.form.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;
        const currentLang = localStorage.getItem('lang') || 'tr';
        const successText = currentLang === 'tr' ? 'Gönderildi' : 'Sent';
        
        button.innerHTML = `<span>${successText}</span>`;
        button.style.background = 'linear-gradient(135deg, #28ca41, #00d4aa)';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
        }, 3000);
    }
}

// ============================================
// PARALLAX EFFECT
// ============================================

class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('.gradient-orb, .floating-card');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    handleScroll() {
        const scrollY = window.pageYOffset;
        
        this.elements.forEach((element, index) => {
            const speed = (index + 1) * 0.05;
            const yPos = scrollY * speed;
            
            if (element.classList.contains('gradient-orb')) {
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
    }

    handleMouseMove(e) {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const moveX = (clientX - centerX) / centerX;
        const moveY = (clientY - centerY) / centerY;

        document.querySelectorAll('.floating-card').forEach((card, index) => {
            const depth = (index + 1) * 10;
            const x = moveX * depth;
            const y = moveY * depth;
            
            card.style.transform = `translate(${x}px, ${y}px)`;
        });
    }
}

// ============================================
// TILT EFFECT
// ============================================

class TiltEffect {
    constructor() {
        this.cards = document.querySelectorAll('.service-card, .project-card, .testimonial-card');
        this.init();
    }

    init() {
        this.cards.forEach((card) => {
            card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
            card.addEventListener('mouseleave', () => this.handleMouseLeave(card));
        });
    }

    handleMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    }

    handleMouseLeave(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    }
}

// ============================================
// CODE TYPING ANIMATION
// ============================================

class CodeTyping {
    constructor() {
        this.codeBlock = document.querySelector('.code-block code');
        this.originalCode = '';
        this.init();
    }

    init() {
        if (!this.codeBlock) return;
        
        this.originalCode = this.codeBlock.innerHTML;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animate();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(this.codeBlock);
    }

    animate() {
        const lines = this.originalCode.split('\n');
        this.codeBlock.innerHTML = '';
        
        lines.forEach((line, index) => {
            setTimeout(() => {
                this.codeBlock.innerHTML += line + '\n';
            }, index * 100);
        });
    }
}

// ============================================
// SMOOTH REVEAL
// ============================================

class SmoothReveal {
    constructor() {
        this.initRevealOnLoad();
    }

    initRevealOnLoad() {
        setTimeout(() => {
            document.querySelectorAll('.hero [data-animate]').forEach((element, index) => {
                setTimeout(() => {
                    element.classList.add('animated');
                }, index * 100);
            });
        }, 300);
    }
}

// ============================================
// PARTICLE BACKGROUND
// ============================================

class ParticleBackground {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.init();
    }

    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            opacity: 0.3;
        `;
        document.body.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle) => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 212, 170, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        this.particles.forEach((particle, i) => {
            this.particles.slice(i + 1).forEach((otherParticle) => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.strokeStyle = `rgba(0, 212, 170, ${0.1 * (1 - distance / 150)})`;
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize language manager first
    const langManager = new LanguageManager();
    
    // Initialize all components
    new CursorGlow();
    new Navbar();
    new ScrollAnimations();
    new NumberCounter();
    new ContactForm();
    new ParallaxEffect();
    new TiltEffect();
    new CodeTyping();
    new SmoothReveal();
    new ParticleBackground();

    document.body.classList.add('loaded');

    console.log('Istanbul Online - Software Development Company');
    console.log('Website: istanbulonline.com');
});
