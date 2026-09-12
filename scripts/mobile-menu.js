const mobileMenuButton = document.querySelector(".mobile-menu-button");
const mobileNavigation = document.querySelector("#mobile-navigation");

if (mobileMenuButton && mobileNavigation) {
  function sizeMobileNavigation() {
    const viewport = window.visualViewport;
    const viewportWidth = viewport ? viewport.width : document.documentElement.clientWidth;
    const viewportHeight = viewport ? viewport.height : document.documentElement.clientHeight;

    mobileNavigation.style.setProperty("--mobile-navigation-viewport-width", `${viewportWidth}px`);
    mobileNavigation.style.setProperty("--mobile-navigation-viewport-height", `${viewportHeight}px`);
  }

  function closeMobileNavigation() {
    if (mobileNavigation.open) {
      mobileMenuButton.setAttribute("aria-expanded", "false");
      mobileNavigation.close();
    }
  }

  mobileMenuButton.addEventListener("click", () => {
    if (mobileNavigation.open) {
      closeMobileNavigation();
      return;
    }

    sizeMobileNavigation();
    mobileNavigation.showModal();
    mobileMenuButton.setAttribute("aria-expanded", "true");
  });

  mobileNavigation.addEventListener("click", (event) => {
    if (event.target === mobileNavigation) {
      closeMobileNavigation();
    }
  });

  mobileNavigation.querySelectorAll("a[href^='#']").forEach((link) => {
    link.addEventListener("click", closeMobileNavigation);
  });

  mobileNavigation.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeMobileNavigation();
  });

  mobileNavigation.addEventListener("close", () => {
    mobileMenuButton.setAttribute("aria-expanded", "false");
  });

  window.addEventListener("resize", sizeMobileNavigation);

  const desktopViewport = window.matchMedia("(min-width: 769px)");
  desktopViewport.addEventListener("change", (event) => {
    if (event.matches) {
      closeMobileNavigation();
    }
  });
}
