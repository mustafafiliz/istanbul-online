/**
 * İstanbul Online - Doctor.io
 * Main TypeScript File
 * Modern Healthcare Software Website
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

interface AnimationConfig {
    threshold: number;
    rootMargin: string;
}

interface CounterElement extends HTMLElement {
    dataset: {
        count: string;
    };
}

// ============================================
// CURSOR GLOW EFFECT
// ============================================

class CursorGlow {
    private cursorGlow: HTMLElement | null;
    private mouseX: number = 0;
    private mouseY: number = 0;
    private currentX: number = 0;
    private currentY: number = 0;
    private isActive: boolean = false;

    constructor() {
        this.cursorGlow = document.getElementById('cursorGlow');
        this.init();
    }

    private init(): void {
        if (!this.cursorGlow) return;

        document.addEventListener('mousemove', (e: MouseEvent) => {
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

    private animate(): void {
        if (!this.isActive || !this.cursorGlow) return;

        // Smooth lerp animation
        this.currentX += (this.mouseX - this.currentX) * 0.1;
        this.currentY += (this.mouseY - this.currentY) * 0.1;

        this.cursorGlow.style.left = `${this.currentX}px`;
        this.cursorGlow.style.top = `${this.currentY}px`;

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

class Navbar {
    private navbar: HTMLElement | null;
    private navLinks: NodeListOf<HTMLAnchorElement>;
    private sections: NodeListOf<HTMLElement>;
    private lastScrollTop: number = 0;

    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        this.init();
    }

    private init(): void {
        window.addEventListener('scroll', () => this.handleScroll());
        this.setupSmoothScroll();
        this.setupMobileMenu();
    }

    private handleScroll(): void {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Add/remove scrolled class
        if (this.navbar) {
            if (scrollTop > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        }

        // Update active nav link
        this.updateActiveLink();

        this.lastScrollTop = scrollTop;
    }

    private updateActiveLink(): void {
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

    private setupSmoothScroll(): void {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', (e: Event) => {
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

    private setupMobileMenu(): void {
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
    private animatedElements: NodeListOf<HTMLElement>;
    private observer: IntersectionObserver;
    private config: AnimationConfig = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    constructor() {
        this.animatedElements = document.querySelectorAll('[data-animate]');
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersect(entries),
            {
                threshold: this.config.threshold,
                rootMargin: this.config.rootMargin
            }
        );
        this.init();
    }

    private init(): void {
        this.animatedElements.forEach((element) => {
            this.observer.observe(element);
        });
    }

    private handleIntersect(entries: IntersectionObserverEntry[]): void {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const element = entry.target as HTMLElement;
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
// NUMBER COUNTER ANIMATION
// ============================================

class NumberCounter {
    private counters: NodeListOf<CounterElement>;
    private observer: IntersectionObserver;
    private duration: number = 2000;

    constructor() {
        this.counters = document.querySelectorAll('[data-count]') as NodeListOf<CounterElement>;
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersect(entries),
            { threshold: 0.5 }
        );
        this.init();
    }

    private init(): void {
        this.counters.forEach((counter) => {
            this.observer.observe(counter);
        });
    }

    private handleIntersect(entries: IntersectionObserverEntry[]): void {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const counter = entry.target as CounterElement;
                this.animateCounter(counter);
                this.observer.unobserve(counter);
            }
        });
    }

    private animateCounter(element: CounterElement): void {
        const target = parseInt(element.dataset.count);
        const start = 0;
        const startTime = performance.now();

        const updateCounter = (currentTime: number): void => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.duration, 1);
            
            // Easing function
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
// FORM HANDLER
// ============================================

class ContactForm {
    private form: HTMLFormElement | null;

    constructor() {
        this.form = document.getElementById('contactForm') as HTMLFormElement;
        this.init();
    }

    private init(): void {
        if (!this.form) return;

        this.form.addEventListener('submit', (e: Event) => this.handleSubmit(e));
        this.setupInputAnimations();
    }

    private handleSubmit(e: Event): void {
        e.preventDefault();
        
        const formData = new FormData(this.form!);
        const data: Record<string, string> = {};
        
        formData.forEach((value, key) => {
            data[key] = value as string;
        });

        // Show success message
        this.showSuccessMessage();
        
        // Reset form
        this.form!.reset();
    }

    private showSuccessMessage(): void {
        const button = this.form!.querySelector('button[type="submit"]') as HTMLButtonElement;
        const originalText = button.innerHTML;
        
        button.innerHTML = `
            <span>Gönderildi ✓</span>
        `;
        button.style.background = 'linear-gradient(135deg, #28ca41, #00d4aa)';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
        }, 3000);
    }

    private setupInputAnimations(): void {
        const inputs = this.form!.querySelectorAll('input, select, textarea');
        
        inputs.forEach((input) => {
            input.addEventListener('focus', () => {
                input.parentElement?.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement?.classList.remove('focused');
            });
        });
    }
}

// ============================================
// PARALLAX EFFECT
// ============================================

class ParallaxEffect {
    private elements: NodeListOf<HTMLElement>;

    constructor() {
        this.elements = document.querySelectorAll('.gradient-orb, .floating-card');
        this.init();
    }

    private init(): void {
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('mousemove', (e: MouseEvent) => this.handleMouseMove(e));
    }

    private handleScroll(): void {
        const scrollY = window.pageYOffset;
        
        this.elements.forEach((element, index) => {
            const speed = (index + 1) * 0.05;
            const yPos = scrollY * speed;
            
            if (element.classList.contains('gradient-orb')) {
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
    }

    private handleMouseMove(e: MouseEvent): void {
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const moveX = (clientX - centerX) / centerX;
        const moveY = (clientY - centerY) / centerY;

        document.querySelectorAll('.floating-card').forEach((card, index) => {
            const depth = (index + 1) * 10;
            const x = moveX * depth;
            const y = moveY * depth;
            
            (card as HTMLElement).style.transform = `translate(${x}px, ${y}px)`;
        });
    }
}

// ============================================
// TYPING EFFECT
// ============================================

class TypingEffect {
    private element: HTMLElement | null;
    private texts: string[];
    private currentTextIndex: number = 0;
    private currentCharIndex: number = 0;
    private isDeleting: boolean = false;
    private typeSpeed: number = 100;
    private deleteSpeed: number = 50;
    private pauseTime: number = 2000;

    constructor(selector: string, texts: string[]) {
        this.element = document.querySelector(selector);
        this.texts = texts;
        if (this.element && this.texts.length > 0) {
            this.init();
        }
    }

    private init(): void {
        this.type();
    }

    private type(): void {
        if (!this.element) return;

        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
        }

        let timeout = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

        if (!this.isDeleting && this.currentCharIndex === currentText.length) {
            timeout = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentCharIndex === 0) {
            this.isDeleting = false;
            this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
        }

        setTimeout(() => this.type(), timeout);
    }
}

// ============================================
// MAGNETIC BUTTONS
// ============================================

class MagneticButtons {
    private buttons: NodeListOf<HTMLButtonElement>;

    constructor() {
        this.buttons = document.querySelectorAll('.cta-button');
        this.init();
    }

    private init(): void {
        this.buttons.forEach((button) => {
            button.addEventListener('mousemove', (e: MouseEvent) => this.handleMouseMove(e, button));
            button.addEventListener('mouseleave', () => this.handleMouseLeave(button));
        });
    }

    private handleMouseMove(e: MouseEvent, button: HTMLButtonElement): void {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    }

    private handleMouseLeave(button: HTMLButtonElement): void {
        button.style.transform = 'translate(0, 0)';
    }
}

// ============================================
// TILT EFFECT FOR CARDS
// ============================================

class TiltEffect {
    private cards: NodeListOf<HTMLElement>;

    constructor() {
        this.cards = document.querySelectorAll('.service-card, .feature-item, .testimonial-card');
        this.init();
    }

    private init(): void {
        this.cards.forEach((card) => {
            card.addEventListener('mousemove', (e: MouseEvent) => this.handleMouseMove(e, card));
            card.addEventListener('mouseleave', () => this.handleMouseLeave(card));
        });
    }

    private handleMouseMove(e: MouseEvent, card: HTMLElement): void {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    }

    private handleMouseLeave(card: HTMLElement): void {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    }
}

// ============================================
// CHART ANIMATION
// ============================================

class ChartAnimation {
    private chartBars: NodeListOf<HTMLElement>;
    private observer: IntersectionObserver;

    constructor() {
        this.chartBars = document.querySelectorAll('.chart-bar');
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersect(entries),
            { threshold: 0.5 }
        );
        this.init();
    }

    private init(): void {
        const chart = document.querySelector('.mockup-chart');
        if (chart) {
            this.observer.observe(chart);
        }
    }

    private handleIntersect(entries: IntersectionObserverEntry[]): void {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                this.chartBars.forEach((bar, index) => {
                    bar.style.animation = 'none';
                    bar.offsetHeight; // Trigger reflow
                    bar.style.animation = `chartGrow 1.5s ease-out ${index * 0.1}s forwards`;
                });
                this.observer.unobserve(entry.target);
            }
        });
    }
}

// ============================================
// SMOOTH REVEAL
// ============================================

class SmoothReveal {
    private initRevealOnLoad(): void {
        // Reveal hero elements on page load
        setTimeout(() => {
            document.querySelectorAll('.hero [data-animate]').forEach((element, index) => {
                setTimeout(() => {
                    element.classList.add('animated');
                }, index * 100);
            });
        }, 300);
    }

    constructor() {
        this.initRevealOnLoad();
    }
}

// ============================================
// INITIALIZE ALL
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new CursorGlow();
    new Navbar();
    new ScrollAnimations();
    new NumberCounter();
    new ContactForm();
    new ParallaxEffect();
    new MagneticButtons();
    new TiltEffect();
    new ChartAnimation();
    new SmoothReveal();

    // Add loaded class to body for initial animations
    document.body.classList.add('loaded');

    console.log('🏥 İstanbul Online - Doctor.io initialized!');
});

// ============================================
// EXPORTS (for potential module usage)
// ============================================

export {
    CursorGlow,
    Navbar,
    ScrollAnimations,
    NumberCounter,
    ContactForm,
    ParallaxEffect,
    TypingEffect,
    MagneticButtons,
    TiltEffect,
    ChartAnimation,
    SmoothReveal
};

