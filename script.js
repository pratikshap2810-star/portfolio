/* =========================================================
   NAVBAR: scroll appearance + mobile toggle + active section
   ========================================================= */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

function updateNavbarOnScroll() {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
updateNavbarOnScroll();
window.addEventListener('scroll', updateNavbarOnScroll);

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

// Close the mobile menu after a link is tapped
navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Highlight the nav link for the section currently in view
const sections = document.querySelectorAll('main section[id]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active-link', link.dataset.section === id);
        });
      }
    });
  },
  { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
);

sections.forEach((section) => sectionObserver.observe(section));

/* =========================================================
   SCROLL REVEAL
   ========================================================= */
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealEls.forEach((el) => revealObserver.observe(el));

/* =========================================================
   TYPING ANIMATION FOR HERO ROLE
   ========================================================= */
const roles = ['AI/ML Engineer', 'Data Science Enthusiast', 'Aspiring Software Developer'];
const typedRoleEl = document.getElementById('typedRole');

let roleIndex = 0;
let charIndex = roles[0].length;
let isDeleting = false;

function typeLoop() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    typedRoleEl.textContent = roles[0];
    return;
  }

  const currentRole = roles[roleIndex];
  let delay = isDeleting ? 45 : 90;

  if (!isDeleting && charIndex < currentRole.length) {
    charIndex++;
  } else if (isDeleting && charIndex > 0) {
    charIndex--;
  } else if (!isDeleting && charIndex === currentRole.length) {
    isDeleting = true;
    delay = 1400;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 300;
  }

  typedRoleEl.textContent = currentRole.slice(0, charIndex);
  setTimeout(typeLoop, delay);
}

typeLoop();

/* =========================================================
   HERO CANVAS: drifting node network
   ========================================================= */
const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');
let nodes = [];
let animationFrameId;

function resizeCanvas() {
  const hero = document.querySelector('.hero');
  canvas.width = hero.offsetWidth;
  canvas.height = hero.offsetHeight;
  initNodes();
}

function initNodes() {
  const density = Math.min(70, Math.floor((canvas.width * canvas.height) / 22000));
  nodes = Array.from({ length: density }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.25,
    vy: (Math.random() - 0.5) * 0.25,
    r: Math.random() * 1.6 + 0.8,
  }));
}

function drawNetwork() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const linkDistance = 130;

  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    a.x += a.vx;
    a.y += a.vy;

    if (a.x < 0 || a.x > canvas.width) a.vx *= -1;
    if (a.y < 0 || a.y > canvas.height) a.vy *= -1;

    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < linkDistance) {
        const opacity = 1 - dist / linkDistance;
        ctx.strokeStyle = `rgba(124, 92, 255, ${opacity * 0.25})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    ctx.fillStyle = 'rgba(34, 211, 238, 0.55)';
    ctx.beginPath();
    ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
    ctx.fill();
  }

  animationFrameId = requestAnimationFrame(drawNetwork);
}

const prefersReducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

function startCanvasAnimation() {
  resizeCanvas();
  if (!prefersReducedMotionQuery.matches) {
    cancelAnimationFrame(animationFrameId);
    drawNetwork();
  }
}

window.addEventListener('resize', () => {
  cancelAnimationFrame(animationFrameId);
  startCanvasAnimation();
});

startCanvasAnimation();

/* =========================================================
   CONTACT FORM (frontend-only demo)
   ========================================================= */
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  formNote.textContent =
    "This form is a frontend demo, so it isn't connected to an inbox yet — please reach out via email or GitHub above for now.";
  contactForm.reset();
});

/* =========================================================
   FOOTER YEAR
   ========================================================= */
document.getElementById('year').textContent = new Date().getFullYear();

/* =========================================================
   PROFILE IMAGE FALLBACK
   Shows a simple placeholder if profile.jpg hasn't been added yet,
   so the layout still looks intentional before the real photo exists.
   ========================================================= */
const profileImg = document.getElementById('profileImg');
profileImg.addEventListener('error', () => {
  profileImg.replaceWith(
    Object.assign(document.createElement('div'), {
      className: 'hero__photo-fallback',
      textContent: 'PM',
    })
  );
});
