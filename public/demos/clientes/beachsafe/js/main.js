/* ============================================
   BEACHSAFE® VISION BOOK
   Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  
  // Reveal on Scroll
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });
  
  revealElements.forEach(el => revealObserver.observe(el));
  
  // Parallax Effect
  const parallaxElements = document.querySelectorAll('.parallax');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach(el => {
      const speed = el.dataset.speed || 0.5;
      const yPos = -(scrolled * speed);
      el.style.transform = `translateY(${yPos}px)`;
    });
  });
  
  // Smooth Scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Counter Animation
  const counters = document.querySelectorAll('.counter');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseFloat(counter.dataset.target);
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const current = start + (target - start) * easeProgress;
          
          if (counter.dataset.decimal) {
            counter.textContent = current.toFixed(1);
          } else {
            counter.textContent = Math.floor(current).toLocaleString();
          }
          
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          }
        };
        
        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => counterObserver.observe(counter));
  
  // Page Transition
  const pages = document.querySelectorAll('.page');
  
  const pageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.3 });
  
  pages.forEach(page => pageObserver.observe(page));
  
  // Navigation Dots
  const navDots = document.querySelectorAll('.nav-dot');
  
  navDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      const pages = document.querySelectorAll('.page');
      if (pages[index]) {
        pages[index].scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  
  // Update active dot on scroll
  window.addEventListener('scroll', () => {
    const pages = document.querySelectorAll('.page');
    const scrollPos = window.scrollY + window.innerHeight / 2;
    
    pages.forEach((page, index) => {
      const pageTop = page.offsetTop;
      const pageBottom = pageTop + page.offsetHeight;
      
      if (scrollPos >= pageTop && scrollPos < pageBottom) {
        navDots.forEach(dot => dot.classList.remove('active'));
        if (navDots[index]) {
          navDots[index].classList.add('active');
        }
      }
    });
  });
  
  // Image Lazy Loading
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
  
  // Form Validation
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const inputs = form.querySelectorAll('.form-input');
      let isValid = true;
      
      inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
          isValid = false;
          input.style.borderBottomColor = 'red';
        } else {
          input.style.borderBottomColor = '';
        }
      });
      
      if (isValid) {
        // Handle form submission
        console.log('Form submitted');
      }
    });
  });
  
  // Keyboard Navigation
  document.addEventListener('keydown', (e) => {
    const pages = document.querySelectorAll('.page');
    const currentPage = Math.floor(window.scrollY / window.innerHeight);
    
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      e.preventDefault();
      if (currentPage < pages.length - 1) {
        pages[currentPage + 1].scrollIntoView({ behavior: 'smooth' });
      }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      if (currentPage > 0) {
        pages[currentPage - 1].scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
  
});