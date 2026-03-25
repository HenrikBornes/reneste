/* =============================================
   RENESTE.NO – Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Sticky Header ---------- */
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  /* ---------- Mobile Navigation ---------- */
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      const spans = mobileToggle.querySelectorAll('span');
      if (mobileNav.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        const spans = mobileToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }

  /* ---------- Scroll Animations ---------- */
  const fadeElements = document.querySelectorAll('.fade-in');
  if (fadeElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));
  }

  /* ---------- Contact Form ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      console.log('Kontaktskjema sendt:', data);
      alert('Takk for din henvendelse! Vi tar kontakt snart.');
      contactForm.reset();
    });
  }

  /* ---------- Quote Calculator ---------- */
  const quoteCalc = document.querySelector('.quote-calculator');
  if (quoteCalc) {
    let currentStep = 1;
    const totalSteps = 3;
    const state = {
      address: '',
      boligtype: '',
      taktype: '',
      tjeneste: ''
    };

    const panels = quoteCalc.querySelectorAll('.quote-panel');
    const steps = quoteCalc.querySelectorAll('.quote-step');

    function showStep(step) {
      panels.forEach(p => p.classList.remove('active'));
      steps.forEach(s => {
        s.classList.remove('active', 'completed');
      });

      const activePanel = quoteCalc.querySelector(`[data-step="${step}"]`);
      if (activePanel) activePanel.classList.add('active');

      steps.forEach(s => {
        const sNum = parseInt(s.dataset.stepNum);
        if (sNum === step) s.classList.add('active');
        if (sNum < step) s.classList.add('completed');
      });

      currentStep = step;
    }

    // Option card selection
    quoteCalc.querySelectorAll('.option-card').forEach(card => {
      card.addEventListener('click', () => {
        const group = card.closest('.option-grid');
        group.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');

        const field = card.dataset.field;
        const value = card.dataset.value;
        if (field && value) state[field] = value;
      });
    });

    // Next buttons
    quoteCalc.querySelectorAll('.btn-next').forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentStep === 1) {
          const addrInput = quoteCalc.querySelector('#quoteAddress');
          if (addrInput && addrInput.value.trim()) {
            state.address = addrInput.value.trim();
          } else {
            addrInput.focus();
            addrInput.style.borderColor = '#e53e3e';
            setTimeout(() => addrInput.style.borderColor = '', 2000);
            return;
          }
        }

        if (currentStep === 2 && !state.boligtype) {
          return;
        }

        if (currentStep < totalSteps) {
          showStep(currentStep + 1);
        }

        if (currentStep === 3) {
          calculateEstimate();
        }
      });
    });

    // Back buttons
    quoteCalc.querySelectorAll('.btn-back').forEach(btn => {
      btn.addEventListener('click', () => {
        if (currentStep > 1) showStep(currentStep - 1);
      });
    });

    function calculateEstimate() {
      let baseLow = 5000;
      let baseHigh = 10000;

      if (state.boligtype === 'enebolig') {
        baseLow = 6000; baseHigh = 12000;
      } else if (state.boligtype === 'rekkehus') {
        baseLow = 4500; baseHigh = 9000;
      } else if (state.boligtype === 'leilighet') {
        baseLow = 3000; baseHigh = 6000;
      } else if (state.boligtype === 'hytte') {
        baseLow = 5000; baseHigh = 10000;
      }

      if (state.taktype === 'betongstein') {
        baseLow += 1000; baseHigh += 2000;
      } else if (state.taktype === 'skifer') {
        baseLow += 2000; baseHigh += 3000;
      }

      const priceEl = quoteCalc.querySelector('.price-range');
      if (priceEl) {
        priceEl.textContent = `${baseLow.toLocaleString('nb-NO')} – ${baseHigh.toLocaleString('nb-NO')} kr`;
      }
    }

    // Quote send form
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
      quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(quoteForm);
        const data = {
          ...state,
          ...Object.fromEntries(formData)
        };
        console.log('Tilbudsforespørsel sendt:', data);
        alert('Takk! Vi sender deg et tilbud innen 24 timer.');
        quoteForm.reset();
        showStep(1);
      });
    }

    showStep(1);
  }

});
