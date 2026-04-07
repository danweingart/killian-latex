/* ============================================
   MOBILE NAVIGATION
   ============================================ */
(function() {
  const menuBtn = document.querySelector('.cds-header__menu-btn');
  const sideNav = document.querySelector('.cds-side-nav');
  const overlay = document.querySelector('.cds-nav-overlay');

  if (!menuBtn || !sideNav || !overlay) return;

  function openNav() {
    sideNav.classList.add('is-open');
    overlay.classList.add('is-visible');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Focus first link
    const firstLink = sideNav.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function closeNav() {
    sideNav.classList.remove('is-open');
    overlay.classList.remove('is-visible');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    menuBtn.focus();
  }

  menuBtn.addEventListener('click', function() {
    const isOpen = sideNav.classList.contains('is-open');
    isOpen ? closeNav() : openNav();
  });

  overlay.addEventListener('click', closeNav);

  // Close on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sideNav.classList.contains('is-open')) {
      closeNav();
    }
  });

  // Close on link click
  sideNav.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', closeNav);
  });

  // Focus trap
  sideNav.addEventListener('keydown', function(e) {
    if (e.key !== 'Tab') return;

    const focusable = sideNav.querySelectorAll('a, button');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
})();


/* ============================================
   CONTACT FORM VALIDATION
   ============================================ */
(function() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const notification = document.getElementById('form-notification');
  const fileInput = document.getElementById('attachment');
  const fileName = document.getElementById('file-name');

  // File input display
  if (fileInput && fileName) {
    fileInput.addEventListener('change', function() {
      if (this.files.length > 0) {
        const file = this.files[0];
        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
        fileName.textContent = file.name + ' (' + sizeMB + ' MB)';

        if (file.size > 5 * 1024 * 1024) {
          fileName.textContent = file.name + ' - File too large (max 5 MB)';
          fileName.style.color = 'var(--cds-red-60)';
          this.value = '';
        } else {
          fileName.style.color = '';
        }
      } else {
        fileName.textContent = '';
      }
    });
  }

  // Validation helpers
  function validateField(input) {
    var group = input.closest('.cds-form-group');
    if (!group) return true;

    var isValid = true;

    if (input.required && !input.value.trim()) {
      isValid = false;
    } else if (input.type === 'email' && input.value.trim()) {
      isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
    } else if (input.type === 'tel' && input.value.trim()) {
      isValid = /[\d\s\-\(\)\+]{7,}/.test(input.value.trim());
    }

    if (isValid) {
      group.classList.remove('cds-form-group--error');
    } else {
      group.classList.add('cds-form-group--error');
    }

    return isValid;
  }

  // Validate on blur
  form.querySelectorAll('.cds-text-input, .cds-textarea').forEach(function(input) {
    input.addEventListener('blur', function() {
      validateField(this);
    });
  });

  // Submit
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    var allValid = true;
    form.querySelectorAll('.cds-text-input[required]').forEach(function(input) {
      if (!validateField(input)) {
        allValid = false;
      }
    });

    if (!allValid) {
      var firstError = form.querySelector('.cds-form-group--error .cds-text-input');
      if (firstError) firstError.focus();
      return;
    }

    var submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    var formData = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
    .then(function(response) {
      if (response.ok) {
        notification.className = 'cds-notification cds-notification--success';
        notification.textContent = 'Thank you for your message. We will get back to you within one business day.';
        form.reset();
        if (fileName) fileName.textContent = '';
      } else {
        throw new Error('Form submission failed');
      }
    })
    .catch(function() {
      notification.className = 'cds-notification cds-notification--error';
      notification.textContent = 'There was an error sending your message. Please call us at (330) 644-6746 or try again later.';
    })
    .finally(function() {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Submit Message <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path d="M8 1l7 7-7 7M1 8h14" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>';
      notification.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
})();


/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var elements = document.querySelectorAll('.cds-fade-in');
  if (!elements.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(function(el) {
    observer.observe(el);
  });
})();
