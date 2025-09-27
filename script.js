/**
 * MODERNA - PROFESSIONAL LANDING PAGE JAVASCRIPT
 */

// Utility Functions
const utils = {
  // Debounce function
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle function
  throttle: (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  },

  // Check if element is in viewport
  isInViewport: (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },

  // Smooth scroll to element
  scrollToElement: (element, offset = 0) => {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  }
};

// DOM Elements
const DOM = {
  loadingScreen: document.getElementById('loading-screen'),
  progressBar: document.getElementById('progress-bar'),
  backToTop: document.getElementById('back-to-top'),
  header: document.getElementById('siteHeader'),
  hamburger: document.getElementById('hamburgerBtn'),
  mobileMenu: document.getElementById('mobileMenu'),
  mobileDrawer: document.getElementById('mobileDrawer'),
  darkToggle: document.getElementById('darkToggle'),
  particleCanvas: document.getElementById('particle-canvas'),
  typedText: document.getElementById('typed-text'),
  contactForm: document.getElementById('contactForm'),
  portfolioGrid: document.getElementById('portfolioGrid'),
  testimonialsCarousel: document.getElementById('testimonialsCarousel'),
  stickyCTA: document.getElementById('stickyCTA'),
  currentYear: document.getElementById('currentYear')
};

// ==========================================================================
// LOADING SCREEN
// ==========================================================================
class LoadingScreen {
  constructor() {
    this.init();
  }

  init() {
    // Simulate loading time
    setTimeout(() => {
      this.hide();
    }, 2000);
  }

  hide() {
    if (DOM.loadingScreen) {
      DOM.loadingScreen.classList.add('hidden');
      setTimeout(() => {
        DOM.loadingScreen.style.display = 'none';
      }, 500);
    }
  }
}

// ==========================================================================
// SCROLL PROGRESS BAR
// ==========================================================================
class ScrollProgress {
  constructor() {
    this.init();
  }

  init() {
    if (!DOM.progressBar) return;
    
    window.addEventListener('scroll', utils.throttle(() => {
      this.updateProgress();
    }, 10));
  }

  updateProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    DOM.progressBar.style.width = scrolled + '%';
  }
}

// ==========================================================================
// HEADER BEHAVIOR
// ==========================================================================
class Header {
  constructor() {
    this.lastScrollTop = 0;
    this.init();
  }

  init() {
    if (!DOM.header) return;

    // Initial state
    this.updateHeaderState();
    
    // Scroll listener
    window.addEventListener('scroll', utils.throttle(() => {
      this.updateHeaderState();
    }, 10));
  }

  updateHeaderState() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add/remove solid class based on scroll position
    if (scrollTop > 50) {
      DOM.header.classList.add('solid');
      DOM.header.classList.remove('transparent');
    } else {
      DOM.header.classList.add('transparent');
      DOM.header.classList.remove('solid');
    }

    this.lastScrollTop = scrollTop;
  }
}

// ==========================================================================
// MOBILE NAVIGATION
// ==========================================================================
class MobileNavigation {
  constructor() {
    this.isOpen = false;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.init();
  }

  init() {
    if (!DOM.hamburger || !DOM.mobileMenu) return;

    // Hamburger click
    DOM.hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggle();
    });

    // Close on outside click
    DOM.mobileMenu.addEventListener('click', (e) => {
      if (e.target === DOM.mobileMenu) {
        this.close();
      }
    });

    // Close on link click
    const mobileLinks = DOM.mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.close();
      });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Touch gesture support for closing menu
    this.setupTouchGestures();
  }

  setupTouchGestures() {
    if (!DOM.mobileDrawer) return;

    DOM.mobileDrawer.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    }, { passive: true });

    DOM.mobileDrawer.addEventListener('touchmove', (e) => {
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      const diffX = touchX - this.touchStartX;
      const diffY = Math.abs(touchY - this.touchStartY);

      // Swipe right to close (if horizontal swipe is more than vertical)
      if (diffX > 50 && diffY < 100) {
        this.close();
      }
    }, { passive: true });
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.isOpen = true;
    DOM.mobileMenu.style.display = 'block';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    
    // Add aria attributes for accessibility
    DOM.hamburger.setAttribute('aria-expanded', 'true');
    DOM.mobileDrawer.setAttribute('aria-hidden', 'false');
    
    setTimeout(() => {
      DOM.mobileDrawer.classList.add('open');
      // Focus first menu item
      const firstLink = DOM.mobileMenu.querySelector('a');
      if (firstLink) firstLink.focus();
    }, 10);
  }

  close() {
    this.isOpen = false;
    DOM.mobileDrawer.classList.remove('open');
    
    // Restore body scroll
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    
    // Update aria attributes
    DOM.hamburger.setAttribute('aria-expanded', 'false');
    DOM.mobileDrawer.setAttribute('aria-hidden', 'true');
    
    setTimeout(() => {
      DOM.mobileMenu.style.display = 'none';
      // Return focus to hamburger
      DOM.hamburger.focus();
    }, 300);
  }
}

// Make close function global for HTML onclick
window.closeDrawer = () => {
  if (window.mobileNav) {
    window.mobileNav.close();
  }
};

// ==========================================================================
// DARK MODE TOGGLE
// ==========================================================================
class DarkMode {
  constructor() {
    this.init();
  }

  init() {
    if (!DOM.darkToggle) return;

    // Check for saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      this.enableDark();
    }

    // Toggle listener
    DOM.darkToggle.addEventListener('click', () => {
      this.toggle();
    });
  }

  toggle() {
    document.documentElement.classList.contains('dark') ? this.enableLight() : this.enableDark();
  }

  enableDark() {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    this.updateIcon('fas fa-sun');
  }

  enableLight() {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    this.updateIcon('fas fa-moon');
  }

  updateIcon(iconClass) {
    const icon = DOM.darkToggle.querySelector('i');
    if (icon) {
      icon.className = iconClass;
    }
  }
}

// ==========================================================================
// PARTICLE ANIMATION
// ==========================================================================
class ParticleAnimation {
  constructor() {
    this.canvas = DOM.particleCanvas;
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.isMobile = window.innerWidth <= 768;
    this.particleCount = this.isMobile ? 25 : 50; // Reduce particles on mobile
    this.connectionDistance = this.isMobile ? 100 : 150;
    this.mouse = { x: null, y: null, radius: this.isMobile ? 100 : 150 };
    
    this.init();
  }

  init() {
    this.resizeCanvas();
    this.createParticles();
    this.setupEventListeners();
    
    // Only animate if not on mobile or if user prefers animations
    if (!this.isMobile || !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.animate();
    }
  }

  resizeCanvas() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    
    // Update mobile status on resize
    this.isMobile = window.innerWidth <= 768;
    this.particleCount = this.isMobile ? 25 : 50;
    this.connectionDistance = this.isMobile ? 100 : 150;
  }

  createParticles() {
    this.particles = [];
    const count = this.isMobile ? Math.min(this.particleCount, 20) : this.particleCount;
    
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * (this.isMobile ? 0.3 : 0.5),
        vy: (Math.random() - 0.5) * (this.isMobile ? 0.3 : 0.5),
        size: Math.random() * (this.isMobile ? 1.5 : 2) + 1
      });
    }
  }

  setupEventListeners() {
    window.addEventListener('resize', utils.debounce(() => {
      this.resizeCanvas();
      this.createParticles();
    }, 250));

    // Mouse events for desktop
    if (!this.isMobile) {
      this.canvas.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      });

      this.canvas.addEventListener('mouseleave', () => {
        this.mouse.x = null;
        this.mouse.y = null;
      });
    }

    // Touch events for mobile
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const touch = e.touches[0];
      this.mouse.x = touch.clientX - rect.left;
      this.mouse.y = touch.clientY - rect.top;
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const touch = e.touches[0];
      this.mouse.x = touch.clientX - rect.left;
      this.mouse.y = touch.clientY - rect.top;
    }, { passive: false });

    this.canvas.addEventListener('touchend', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update particles
    this.particles.forEach(particle => {
      // Move particle
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

      // Mouse interaction
      if (this.mouse.x && this.mouse.y) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.mouse.radius) {
          const force = (this.mouse.radius - distance) / this.mouse.radius;
          particle.x -= (dx / distance) * force * 2;
          particle.y -= (dy / distance) * force * 2;
        }
      }

      // Draw particle
      this.ctx.fillStyle = document.documentElement.classList.contains('dark') 
        ? 'rgba(255, 255, 255, 0.3)' 
        : 'rgba(0, 0, 0, 0.1)';
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // Draw connections
    this.drawConnections();
    
    requestAnimationFrame(() => this.animate());
  }

  drawConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.connectionDistance) {
          const opacity = (this.connectionDistance - distance) / this.connectionDistance;
          this.ctx.strokeStyle = document.documentElement.classList.contains('dark')
            ? `rgba(255, 255, 255, ${opacity * 0.2})`
            : `rgba(0, 0, 0, ${opacity * 0.1})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }
}

// ==========================================================================
// TYPED TEXT ANIMATION
// ==========================================================================
class TypedText {
  constructor() {
    this.element = DOM.typedText;
    if (!this.element) return;
    
    this.words = ['experiences', 'solutions', 'websites', 'applications', 'brands'];
    this.currentWord = 0;
    this.currentChar = 0;
    this.isDeleting = false;
    this.typeSpeed = 100;
    this.deleteSpeed = 50;
    this.pauseTime = 2000;
    
    this.init();
  }

  init() {
    this.type();
  }

  type() {
    const word = this.words[this.currentWord];
    
    if (this.isDeleting) {
      this.element.textContent = word.substring(0, this.currentChar - 1);
      this.currentChar--;
    } else {
      this.element.textContent = word.substring(0, this.currentChar + 1);
      this.currentChar++;
    }

    let typeSpeed = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

    if (!this.isDeleting && this.currentChar === word.length) {
      typeSpeed = this.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentChar === 0) {
      this.isDeleting = false;
      this.currentWord = (this.currentWord + 1) % this.words.length;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// ==========================================================================
// COUNTER ANIMATION
// ==========================================================================
class CounterAnimation {
  constructor() {
    this.counters = document.querySelectorAll('.stat-number');
    this.init();
  }

  init() {
    if (!this.counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    this.counters.forEach(counter => {
      observer.observe(counter);
    });
  }

  animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current);
    }, 16);
  }
}

// ==========================================================================
// PORTFOLIO FILTER
// ==========================================================================
class PortfolioFilter {
  constructor() {
    this.filterBtns = document.querySelectorAll('.filter-btn');
    this.portfolioItems = document.querySelectorAll('.portfolio-item');
    this.init();
  }

  init() {
    if (!this.filterBtns.length) return;

    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        this.filterItems(filter);
        this.updateActiveButton(btn);
      });
    });
  }

  filterItems(filter) {
    this.portfolioItems.forEach(item => {
      const category = item.getAttribute('data-category');
      
      if (filter === 'all' || category === filter) {
        item.style.display = 'block';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 10);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });
  }

  updateActiveButton(activeBtn) {
    this.filterBtns.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
  }
}

// ==========================================================================
// TESTIMONIALS CAROUSEL
// ==========================================================================
class TestimonialsCarousel {
  constructor() {
    this.carousel = DOM.testimonialsCarousel;
    if (!this.carousel) return;
    
    this.slides = this.carousel.querySelectorAll('.testimonial-slide');
    this.dots = document.querySelectorAll('.dot');
    this.prevBtn = document.querySelector('.prev-btn');
    this.nextBtn = document.querySelector('.next-btn');
    this.currentIndex = 0;
    this.autoplayInterval = null;
    this.autoplayDelay = 5000;
    
    this.init();
  }

  init() {
    if (!this.slides.length) return;

    // Button listeners
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prev());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.next());

    // Dot listeners
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });

    // Touch/swipe support
    this.setupTouchEvents();
    
    // Autoplay
    this.startAutoplay();
    
    // Pause on hover
    this.carousel.addEventListener('mouseenter', () => this.pauseAutoplay());
    this.carousel.addEventListener('mouseleave', () => this.startAutoplay());
  }

  goToSlide(index) {
    this.slides[this.currentIndex].classList.remove('active');
    this.dots[this.currentIndex].classList.remove('active');
    
    this.currentIndex = index;
    
    this.slides[this.currentIndex].classList.add('active');
    this.dots[this.currentIndex].classList.add('active');
  }

  next() {
    const nextIndex = (this.currentIndex + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }

  prev() {
    const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => {
      this.next();
    }, this.autoplayDelay);
  }

  pauseAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  setupTouchEvents() {
    let startX = 0;
    let endX = 0;

    this.carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });

    this.carousel.addEventListener('touchmove', (e) => {
      endX = e.touches[0].clientX;
    });

    this.carousel.addEventListener('touchend', () => {
      const diffX = startX - endX;
      const minSwipeDistance = 50;

      if (Math.abs(diffX) > minSwipeDistance) {
        if (diffX > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    });
  }
}

// ==========================================================================
// FAQ ACCORDION
// ==========================================================================
class FAQAccordion {
  constructor() {
    this.faqItems = document.querySelectorAll('.faq-item');
    this.init();
  }

  init() {
    if (!this.faqItems.length) return;

    this.faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      const icon = question.querySelector('i');

      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all items
        this.faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          const otherIcon = otherItem.querySelector('.faq-question i');
          otherAnswer.style.maxHeight = null;
          otherIcon.style.transform = 'rotate(0deg)';
        });

        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          icon.style.transform = 'rotate(45deg)';
        }
      });
    });
  }
}

// ==========================================================================
// PRICING TOGGLE
// ==========================================================================
class PricingToggle {
  constructor() {
    this.toggle = document.getElementById('pricingToggle');
    this.monthlyPrices = document.querySelectorAll('.monthly');
    this.yearlyPrices = document.querySelectorAll('.yearly');
    this.init();
  }

  init() {
    if (!this.toggle) return;

    this.toggle.addEventListener('change', () => {
      this.updatePrices();
    });

    // Initial state
    this.updatePrices();
  }

  updatePrices() {
    const isYearly = this.toggle.checked;

    this.monthlyPrices.forEach(price => {
      price.style.display = isYearly ? 'none' : 'inline';
    });

    this.yearlyPrices.forEach(price => {
      price.style.display = isYearly ? 'inline' : 'none';
    });
  }
}

// ==========================================================================
// FORM VALIDATION
// ==========================================================================
class FormValidation {
  constructor() {
    this.form = DOM.contactForm;
    if (!this.form) return;
    
    this.init();
  }

  init() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit(e);
    });

    // Real-time validation
    const inputs = this.form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearError(input));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const isRequired = field.hasAttribute('required');

    // Clear previous errors
    this.clearError(field);

    // Required field validation
    if (isRequired && !value) {
      this.showError(field, 'This field is required');
      return false;
    }

    // Email validation
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        this.showError(field, 'Please enter a valid email address');
        return false;
      }
    }

    // Phone validation
    if (type === 'tel' && value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        this.showError(field, 'Please enter a valid phone number');
        return false;
      }
    }

    return true;
  }

  showError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.parentNode.querySelector('.error-message');
    if (!errorElement) {
      errorElement = document.createElement('span');
      errorElement.className = 'error-message';
      field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
  }

  clearError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }

  validateForm() {
    const inputs = this.form.querySelectorAll('input, textarea, select');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  async handleSubmit(e) {
    if (!this.validateForm()) return;

    const formData = new FormData(this.form);
    const submitBtn = this.form.querySelector('button[type="submit"]');
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      this.showSuccessMessage();
      this.form.reset();
      
    } catch (error) {
      this.showErrorMessage('Something went wrong. Please try again.');
    } finally {
      // Reset button
      submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
      submitBtn.disabled = false;
    }
  }

  showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'form-message success';
    message.innerHTML = '<i class="fas fa-check-circle"></i> Thank you! Your message has been sent successfully.';
    
    this.form.insertBefore(message, this.form.firstChild);
    
    setTimeout(() => {
      message.remove();
    }, 5000);
  }

  showErrorMessage(text) {
    const message = document.createElement('div');
    message.className = 'form-message error';
    message.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${text}`;
    
    this.form.insertBefore(message, this.form.firstChild);
    
    setTimeout(() => {
      message.remove();
    }, 5000);
  }
}

// ==========================================================================
// SMOOTH SCROLLING
// ==========================================================================
class SmoothScrolling {
  constructor() {
    this.init();
  }

  init() {
    // Handle all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          const headerHeight = DOM.header ? DOM.header.offsetHeight : 0;
          utils.scrollToElement(target, headerHeight + 20);
        }
      });
    });
  }
}

// ==========================================================================
// BACK TO TOP BUTTON
// ==========================================================================
class BackToTop {
  constructor() {
    this.button = DOM.backToTop;
    if (!this.button) return;
    
    this.init();
  }

  init() {
    // Show/hide based on scroll position
    window.addEventListener('scroll', utils.throttle(() => {
      this.toggleVisibility();
    }, 100));

    // Click handler
    this.button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  toggleVisibility() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 300) {
      this.button.classList.add('visible');
    } else {
      this.button.classList.remove('visible');
    }
  }
}

// ==========================================================================
// STICKY CTA
// ==========================================================================
class StickyCTA {
  constructor() {
    this.cta = DOM.stickyCTA;
    if (!this.cta) return;
    
    this.init();
  }

  init() {
    // Show/hide based on scroll position and screen size
    window.addEventListener('scroll', utils.throttle(() => {
      this.toggleVisibility();
    }, 100));

    window.addEventListener('resize', utils.debounce(() => {
      this.toggleVisibility();
    }, 250));
  }

  toggleVisibility() {
    const isMobile = window.innerWidth <= 768;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const contactSection = document.getElementById('contact');
    
    if (!isMobile || !contactSection) {
      this.cta.style.display = 'none';
      return;
    }

    const contactTop = contactSection.offsetTop;
    const shouldShow = scrollTop > 500 && scrollTop < contactTop - 200;
    
    this.cta.style.display = shouldShow ? 'flex' : 'none';
  }
}

// ==========================================================================
// GSAP ANIMATIONS
// ==========================================================================
class GSAPAnimations {
  constructor() {
    if (typeof gsap === 'undefined') return;
    this.init();
  }

  init() {
    // Register ScrollTrigger
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      this.setupScrollAnimations();
    }

    // Hero animations
    this.setupHeroAnimations();
    
    // Floating shapes
    this.setupFloatingShapes();
  }

  setupHeroAnimations() {
    const tl = gsap.timeline({ delay: 2 });
    
    tl.from('.hero-badge', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    })
    .from('.hero-title', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    }, '-=0.6')
    .from('.hero-description', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.4')
    .from('.hero-actions .btn', {
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.2,
      ease: 'power3.out'
    }, '-=0.2');
  }

  setupFloatingShapes() {
    gsap.to('.shape-1', {
      y: -40,
      x: 20,
      rotation: 10,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    gsap.to('.shape-2', {
      y: 40,
      x: -20,
      rotation: -10,
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    gsap.to('.shape-3', {
      y: -20,
      x: 15,
      rotation: 5,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }

  setupScrollAnimations() {
    // Fade in sections
    gsap.utils.toArray('section').forEach(section => {
      gsap.from(section, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    // Service cards animation
    gsap.utils.toArray('.service-card').forEach((card, index) => {
      gsap.from(card, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    // Portfolio items animation
    gsap.utils.toArray('.portfolio-item').forEach((item, index) => {
      gsap.from(item, {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        delay: index * 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    });
  }
}

// ==========================================================================
// NEWSLETTER SUBSCRIPTION
// ==========================================================================
class Newsletter {
  constructor() {
    this.form = document.querySelector('.newsletter-form');
    if (!this.form) return;
    
    this.init();
  }

  init() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit(e);
    });
  }

  async handleSubmit(e) {
    const email = this.form.querySelector('input[type="email"]').value;
    const button = this.form.querySelector('button');
    
    // Basic email validation
    if (!this.isValidEmail(email)) {
      this.showMessage('Please enter a valid email address', 'error');
      return;
    }

    // Show loading
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    button.disabled = true;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      this.showMessage('Thank you for subscribing!', 'success');
      this.form.reset();
      
    } catch (error) {
      this.showMessage('Something went wrong. Please try again.', 'error');
    } finally {
      button.innerHTML = '<i class="fas fa-arrow-right"></i>';
      button.disabled = false;
    }
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  showMessage(text, type) {
    // Remove existing message
    const existingMessage = this.form.querySelector('.newsletter-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create new message
    const message = document.createElement('div');
    message.className = `newsletter-message ${type}`;
    message.textContent = text;
    
    this.form.appendChild(message);
    
    setTimeout(() => {
      message.remove();
    }, 3000);
  }
}

// ==========================================================================
// MOBILE UTILITIES
// ==========================================================================
class MobileUtils {
  constructor() {
    this.isMobile = this.detectMobile();
    this.isTouch = this.detectTouch();
    this.init();
  }

  detectMobile() {
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  detectTouch() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  init() {
    // Add mobile class to body
    if (this.isMobile) {
      document.body.classList.add('is-mobile');
    }

    if (this.isTouch) {
      document.body.classList.add('is-touch');
    }

    // Handle orientation changes
    window.addEventListener('orientationchange', utils.debounce(() => {
      this.handleOrientationChange();
    }, 250));

    // Handle viewport changes on mobile browsers
    if (this.isMobile) {
      this.handleMobileViewport();
    }

    // Initialize mobile optimizations
    this.initializeMobileOptimizations();
  }

  handleOrientationChange() {
    // Force a reflow to handle iOS Safari viewport issues
    document.body.style.height = '100.1%';
    setTimeout(() => {
      document.body.style.height = '';
    }, 100);
  }

  handleMobileViewport() {
    // Handle iOS Safari viewport height issues
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', utils.debounce(setVH, 250));
  }

  // Prevent zoom on double tap for specific elements
  preventDoubleTabZoom(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      let lastTouchEnd = 0;
      element.addEventListener('touchend', (e) => {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
          e.preventDefault();
        }
        lastTouchEnd = now;
      }, false);
    });
  }

  // Add touch feedback to interactive elements
  addTouchFeedback() {
    const touchElements = document.querySelectorAll('.btn, button, a, .card, .service-card, .portfolio-card');
    
    touchElements.forEach(element => {
      element.addEventListener('touchstart', () => {
        element.style.transform = 'scale(0.95)';
        element.style.transition = 'transform 0.1s ease';
      }, { passive: true });
      
      element.addEventListener('touchend', () => {
        setTimeout(() => {
          element.style.transform = '';
        }, 150);
      }, { passive: true });
      
      element.addEventListener('touchcancel', () => {
        element.style.transform = '';
      }, { passive: true });
    });
  }

  // Optimize animations for mobile performance
  optimizeAnimationsForMobile() {
    // Reduce motion if user prefers
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.add('reduce-motion');
    }
    
    // Configure GSAP for better mobile performance
    if (typeof gsap !== 'undefined') {
      gsap.config({ 
        force3D: true,
        nullTargetWarn: false
      });
    }
  }

  // Utility methods for mobile detection
  isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }
  
  isAndroid() {
    return /Android/.test(navigator.userAgent);
  }
  
  getScreenSize() {
    const width = window.innerWidth;
    if (width >= 1400) return 'xl';
    if (width >= 1200) return 'lg';
    if (width >= 992) return 'md';
    if (width >= 768) return 'sm';
    if (width >= 640) return 'xs';
    return 'xxs';
  }

  // Initialize all mobile optimizations
  initializeMobileOptimizations() {
    if (this.isMobile || this.isTouch) {
      this.addTouchFeedback();
      this.optimizeAnimationsForMobile();
      this.preventDoubleTabZoom('.btn, button, .nav-link');
      
      // Add mobile-specific classes
      document.body.classList.add('mobile-optimized');
      
      // Enable hardware acceleration for better performance
      document.body.style.transform = 'translate3d(0,0,0)';
    }
  }
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================
class App {
  constructor() {
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    // Set current year
    if (DOM.currentYear) {
      DOM.currentYear.textContent = new Date().getFullYear();
    }

    // Initialize mobile utilities first
    const mobileUtils = new MobileUtils();

    // Initialize all components
    new LoadingScreen();
    new ScrollProgress();
    new Header();
    window.mobileNav = new MobileNavigation(); // Make global for HTML access
    new DarkMode();
    new ParticleAnimation();
    new TypedText();
    new CounterAnimation();
    new PortfolioFilter();
    new TestimonialsCarousel();
    new FAQAccordion();
    new PricingToggle();
    new FormValidation();
    new SmoothScrolling();
    new BackToTop();
    new StickyCTA();
    new GSAPAnimations();
    new Newsletter();

    // Mobile-specific optimizations
    if (mobileUtils.isMobile) {
      // Prevent zoom on buttons and form controls
      mobileUtils.preventDoubleTabZoom('button, .btn, input, select');
      
      // Reduce animations on mobile for better performance
      this.optimizeForMobile();
    }

    // Initialize AOS if available and not on mobile with reduced motion
    if (typeof AOS !== 'undefined') {
      const shouldUseAOS = !mobileUtils.isMobile || !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (shouldUseAOS) {
        AOS.init({
          duration: mobileUtils.isMobile ? 600 : 800,
          easing: 'ease-out-cubic',
          once: true,
          offset: mobileUtils.isMobile ? 30 : 50,
          disable: window.innerWidth < 480 // Disable on very small screens
        });
      }
    }

    console.log('🚀 Moderna landing page initialized successfully!');
    console.log(`📱 Mobile device: ${mobileUtils.isMobile}`);
    console.log(`👆 Touch device: ${mobileUtils.isTouch}`);
  }

  optimizeForMobile() {
    // Reduce particle animation complexity
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
      canvas.style.opacity = '0.3';
    }

    // Simplify background animations
    const shapes = document.querySelectorAll('.bg-shapes .shape');
    shapes.forEach(shape => {
      shape.style.animationDuration = '15s';
    });

    // Add touch feedback class
    document.body.classList.add('mobile-optimized');
  }
}

// Start the application
new App();