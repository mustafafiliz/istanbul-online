/**
 * Istanbul Online - Software Development Company
 * Main JavaScript File (Clean - No Animations)
 */

// ============================================
// LANGUAGE SWITCHER
// ============================================

class LanguageManager {
  constructor() {
    this.currentLang = localStorage.getItem("lang") || "en";
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
        fetch("assets/lang/tr.json"),
        fetch("assets/lang/en.json"),
      ]);

      this.translations = {
        tr: await trResponse.json(),
        en: await enResponse.json(),
      };
    } catch (error) {
      console.error("Error loading translations:", error);
    }
  }

  getNestedValue(obj, path) {
    return path.split(".").reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  applyTranslations() {
    const lang = this.translations[this.currentLang];
    if (!lang) return;

    // Update text content
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.getAttribute("data-i18n");
      const value = this.getNestedValue(lang, key);
      if (value !== null && value !== undefined) {
        element.textContent = value;
      }
    });

    // Update placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      const key = element.getAttribute("data-i18n-placeholder");
      const value = this.getNestedValue(lang, key);
      if (value !== null && value !== undefined) {
        element.placeholder = value;
      }
    });

    // Update lang switcher buttons
    const langBtn = document.querySelector(".lang-current");
    const footerLangBtn = document.querySelector(".lang-current-footer");
    if (langBtn) {
      langBtn.textContent = this.currentLang.toUpperCase();
    }
    if (footerLangBtn) {
      footerLangBtn.textContent = this.currentLang.toUpperCase();
    }
  }

  updateHtmlLang() {
    document.documentElement.lang = this.currentLang;
  }

  setupSwitcher() {
    // Navbar lang switcher
    const switcher = document.getElementById("langSwitcher");
    if (switcher) {
      switcher.addEventListener("click", () => this.toggleLang());
    }

    // Footer lang switcher
    const footerSwitcher = document.getElementById("footerLangSwitcher");
    if (footerSwitcher) {
      footerSwitcher.addEventListener("click", () => this.toggleLang());
    }
  }

  toggleLang() {
    this.currentLang = this.currentLang === "tr" ? "en" : "tr";
    localStorage.setItem("lang", this.currentLang);
    this.applyTranslations();
    this.updateHtmlLang();
  }

  switchTo(lang) {
    if (this.translations[lang]) {
      this.currentLang = lang;
      localStorage.setItem("lang", lang);
      this.applyTranslations();
      this.updateHtmlLang();
    }
  }
}

// ============================================
// NAVBAR
// ============================================

class Navbar {
  constructor() {
    this.navbar = document.getElementById("navbar");
    this.navLinks = document.querySelectorAll(".nav-link");
    this.sections = document.querySelectorAll("section[id]");
    this.init();
  }

  init() {
    window.addEventListener("scroll", () => this.handleScroll());
    this.setupSmoothScroll();
    this.setupMobileMenu();
  }

  handleScroll() {
    this.updateActiveLink();
  }

  updateActiveLink() {
    const scrollPosition = window.scrollY + 200;

    this.sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        this.navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = anchor.getAttribute("href");
        if (target && target !== "#") {
          const element = document.querySelector(target);
          if (element) {
            const offsetTop =
              element.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({
              top: offsetTop,
              behavior: "smooth",
            });
          }
        }
      });
    });
  }

  setupMobileMenu() {
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const navLinks = document.querySelector(".nav-links");

    if (mobileMenuBtn && navLinks) {
      mobileMenuBtn.addEventListener("click", () => {
        mobileMenuBtn.classList.toggle("active");
        navLinks.classList.toggle("active");
      });
    }
  }
}

// ============================================
// CONTACT FORM
// ============================================

class ContactForm {
  constructor() {
    this.form = document.getElementById("contactForm");
    this.init();
  }

  init() {
    if (!this.form) return;

    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
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
    const currentLang = localStorage.getItem("lang") || "tr";
    const successText = currentLang === "tr" ? "Gönderildi" : "Sent";

    button.innerHTML = `<span>${successText}</span>`;
    button.style.background = "#28ca41";

    setTimeout(() => {
      button.innerHTML = originalText;
      button.style.background = "";
    }, 3000);
  }
}

// ============================================
// COMMUNITY POPUP
// ============================================

class CommunityPopup {
  constructor() {
    this.popup = document.getElementById("communityPopup");
    this.closeBtn = document.getElementById("communityPopupClose");
    this.triggers = document.querySelectorAll(".community-popup-trigger");
    this.init();
  }

  init() {
    if (!this.popup) return;

    // Open popup on trigger click
    this.triggers.forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        this.open();
      });
    });

    // Close popup on close button click
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.close());
    }

    // Close popup on overlay click
    this.popup.addEventListener("click", (e) => {
      if (e.target === this.popup) {
        this.close();
      }
    });

    // Close popup on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.popup.classList.contains("active")) {
        this.close();
      }
    });
  }

  open() {
    if (!this.popup) return;
    this.popup.classList.add("active");
    document.body.classList.add("popup-open");
  }

  close() {
    if (!this.popup) return;
    this.popup.classList.remove("active");
    document.body.classList.remove("popup-open");
  }
}

// ============================================
// INITIALIZE
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  // Initialize language manager
  new LanguageManager();

  // Initialize navbar
  new Navbar();

  // Initialize contact form
  new ContactForm();

  // Initialize community popup
  new CommunityPopup();

  console.log("Istanbul Online - Software Development Company");
});
