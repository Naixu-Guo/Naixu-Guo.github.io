(function () {
  var nav = document.getElementById("site-nav");
  var toggle = document.getElementById("nav-toggle");
  var menu = document.getElementById("mobile-menu");
  var desktopNavMedia = window.matchMedia("(min-width: 921px)");

  function syncNavState() {
    if (!nav) return;
    if (window.scrollY > 12) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }

  function closeMenu() {
    if (!menu || !toggle) return;
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }

  function handleDesktopNavChange(event) {
    if (event.matches) {
      closeMenu();
    }
  }

  syncNavState();
  window.addEventListener("scroll", syncNavState, { passive: true });

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var isOpen = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    if (desktopNavMedia.addEventListener) {
      desktopNavMedia.addEventListener("change", handleDesktopNavChange);
    } else {
      desktopNavMedia.addListener(handleDesktopNavChange);
    }
  }
})();
