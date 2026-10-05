(() => {
  "use strict";

  // ---------- Faculty data ----------
  const FACULTY = [
    "Ali", "Hammad", "Furqan", "Hassan", "Naveed",
    "Omar", "Jamal", "Muddarab", "Adnan", "Muneeb", "Waqar",
  ];

  // A small, muted palette for avatar initials — rotates deterministically.
  const AVATAR_COLORS = ["#1D5A42", "#B6852F", "#246B4E", "#8A6A2A", "#164634"];

  function renderFaculty() {
    const grid = document.getElementById("faculty-grid");
    if (!grid) return;

    grid.innerHTML = FACULTY.map((name, i) => {
      const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
      return `
        <div class="text-center">
          <div class="faculty-avatar" style="background:${color}">${name.charAt(0)}</div>
          <p class="font-medium text-ink-900 mt-3 text-sm">${name}</p>
          <p class="text-xs text-ink-600 mt-0.5">Faculty Member</p>
        </div>
      `;
    }).join("");
  }

  // ---------- Nav background on scroll ----------
  function initNavScroll() {
    const nav = document.getElementById("site-nav");
    if (!nav) return;

    const update = () => {
      if (window.scrollY > 40) {
        nav.classList.add("nav-solid");
      } else {
        nav.classList.remove("nav-solid");
      }
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  // ---------- Mobile menu ----------
  function initMobileMenu() {
    const toggle = document.getElementById("nav-toggle");
    const menu = document.getElementById("mobile-menu");
    const iconOpen = document.getElementById("nav-icon-open");
    const iconClose = document.getElementById("nav-icon-close");
    if (!toggle || !menu) return;

    const close = () => {
      menu.classList.add("hidden");
      toggle.setAttribute("aria-expanded", "false");
      iconOpen.classList.remove("hidden");
      iconClose.classList.add("hidden");
    };

    toggle.addEventListener("click", () => {
      const isOpen = !menu.classList.contains("hidden");
      if (isOpen) {
        close();
      } else {
        menu.classList.remove("hidden");
        toggle.setAttribute("aria-expanded", "true");
        iconOpen.classList.add("hidden");
        iconClose.classList.remove("hidden");
      }
    });

    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  }

  // ---------- Footer year ----------
  function setFooterYear() {
    const el = document.getElementById("footer-year");
    if (el) el.textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderFaculty();
    initNavScroll();
    initMobileMenu();
    setFooterYear();
  });
})();
