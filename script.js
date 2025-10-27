// --- NAVBAR BURGER MENU --- //
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector(".navbar nav ul");
  if (!nav) return; // nothing to do

  // Reuse existing burger if present in DOM, otherwise create one (fallback)
  let burger = document.querySelector(".navbar .burger-menu");
  if (!burger) {
    burger = document.createElement("div");
    burger.classList.add("burger-menu");
    burger.setAttribute('role', 'button');
    burger.setAttribute('tabindex', '0');
    burger.setAttribute('aria-label', 'Toggle navigation');
    burger.innerHTML = `<i class="fas fa-bars" aria-hidden="true"></i>`;
    document.querySelector(".navbar").insertBefore(burger, nav);
  }

  const setIcon = (isOpen) => {
    burger.innerHTML = isOpen
      ? `<i class="fas fa-times" aria-hidden="true"></i>`
      : `<i class="fas fa-bars" aria-hidden="true"></i>`;
  };

  const toggleNav = () => {
    nav.classList.toggle("show");
    burger.classList.toggle("active");
    setIcon(burger.classList.contains("active"));
  };

  // Click to toggle
  burger.addEventListener("click", toggleNav);

  // Keyboard accessibility (Enter / Space)
  burger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleNav();
    }
  });
  // Close mobile menu when resizing to larger screens (desktop/laptop)
  const MOBILE_BREAKPOINT = 768; // matches CSS
  const onResize = () => {
    if (window.innerWidth > MOBILE_BREAKPOINT) {
      if (nav.classList.contains('show')) {
        nav.classList.remove('show');
      }
      if (burger.classList.contains('active')) {
        burger.classList.remove('active');
        setIcon(false);
      }
    }
  };

  window.addEventListener('resize', onResize);
  // Run once to ensure correct initial state on load
  onResize();
});

// --- NAVBAR SCROLL EFFECT --- //
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// --- SKILL BARS ANIMATION ON SCROLL --- //
const skillBars = document.querySelectorAll(".skill-bar");
const options = { threshold: 0.4 };

const animateBars = (entry) => {
  if (entry.isIntersecting) {
    entry.target.style.width = entry.target.dataset.skill;
  }
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(animateBars);
}, options);

skillBars.forEach((bar) => {
  bar.style.width = "0";
  observer.observe(bar);
});

// --- SMOOTH SCROLL (for older browsers fallback) --- //
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 70,
        behavior: "smooth",
      });
    }
  });
});

// --- CONTACT FORM DYNAMIC VALIDATION --- //
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const nameInput = form.querySelector('input[type="text"]');
  const emailInput = form.querySelector('input[type="email"]');
  const messageInput = form.querySelector('textarea');
  const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('button');

  const ensureErrorEl = (input) => {
    let el = input.nextElementSibling;
    if (!el || !el.classList || !el.classList.contains('error-message')) {
      el = document.createElement('div');
      el.className = 'error-message';
      input.parentNode.insertBefore(el, input.nextSibling);
    }
    return el;
  };

  const showError = (input, msg) => {
    input.classList.add('invalid');
    input.classList.remove('valid');
    const el = ensureErrorEl(input);
    el.textContent = msg;
    el.setAttribute('role', 'alert');
  };

  const showValid = (input) => {
    input.classList.remove('invalid');
    input.classList.add('valid');
    const el = ensureErrorEl(input);
    el.textContent = '';
    el.removeAttribute('role');
  };

  const validators = {
    name: () => {
      if (!nameInput) return true;
      const v = nameInput.value.trim();
      if (v.length < 2) { showError(nameInput, 'Please enter your name (2+ characters).'); return false; }
      showValid(nameInput); return true;
    },
    email: () => {
      if (!emailInput) return true;
      const v = emailInput.value.trim();
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(v)) { showError(emailInput, 'Please enter a valid email address.'); return false; }
      showValid(emailInput); return true;
    },
    message: () => {
      if (!messageInput) return true;
      const v = messageInput.value.trim();
      if (v.length < 10) { showError(messageInput, 'Message must be at least 10 characters.'); return false; }
      showValid(messageInput); return true;
    }
  };

  [nameInput, emailInput, messageInput].forEach((inp) => {
    if (!inp) return;
    inp.addEventListener('input', () => {
      if (inp === nameInput) validators.name();
      if (inp === emailInput) validators.email();
      if (inp === messageInput) validators.message();
    });
    inp.addEventListener('blur', () => {
      if (inp === nameInput) validators.name();
      if (inp === emailInput) validators.email();
      if (inp === messageInput) validators.message();
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const ok = [validators.name(), validators.email(), validators.message()].every(Boolean);
    if (!ok) {
      const firstInvalid = form.querySelector('.invalid');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Simulate send
    if (submitBtn) {
      submitBtn.disabled = true;
      const original = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      setTimeout(() => {
        form.reset();
        form.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        form.querySelectorAll('input, textarea').forEach(i => i.classList.remove('valid'));
        submitBtn.textContent = 'Message sent!';
        setTimeout(() => { if (submitBtn) { submitBtn.textContent = original; submitBtn.disabled = false; } }, 2200);
      }, 900);
    }
  });
});
/* === DARK/LIGHT MODE TOGGLE (Switch Version) === */
/* === DARK/LIGHT MODE TOGGLE (Switch Version - Guaranteed Fix) === */
document.addEventListener("DOMContentLoaded", () => {
  console.log("Theme toggle script loaded ✅"); // test output

  const toggleBtn = document.getElementById("theme-toggle");
  if (!toggleBtn) {
    console.warn("⚠️ Theme toggle button not found in DOM");
    return;
  }

  const body = document.body;

  // Apply saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    body.classList.add("light-mode");
  }

  // Handle click
  toggleBtn.addEventListener("click", () => {
    console.log("Toggle clicked"); // test output

    body.classList.toggle("light-mode");

    if (body.classList.contains("light-mode")) {
      localStorage.setItem("theme", "light");
    } else {
      localStorage.setItem("theme", "dark");
    }
  });
});


