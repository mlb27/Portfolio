const mobileMenuButton = document.querySelector(".mobile-menu-button");
const mobileNavigation = document.querySelector("#mobile-navigation");

if (mobileMenuButton && mobileNavigation) {
  const languageButtons = document.querySelectorAll("[data-language]");

  function updateMobileMenuButtonLabel() {
    const language = document.documentElement.lang === "de" ? "De" : "En";
    const action = mobileNavigation.open ? "close" : "open";
    const labelKey = `${action}Label${language}`;

    mobileMenuButton.setAttribute("aria-label", mobileMenuButton.dataset[labelKey]);
  }

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
      updateMobileMenuButtonLabel();
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
    updateMobileMenuButtonLabel();
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
    updateMobileMenuButtonLabel();
  });

  languageButtons.forEach((button) => {
    button.addEventListener("click", updateMobileMenuButtonLabel);
  });

  window.addEventListener("resize", sizeMobileNavigation);

  const desktopViewport = window.matchMedia("(min-width: 991px)");
  desktopViewport.addEventListener("change", (event) => {
    if (event.matches) {
      closeMobileNavigation();
    }
  });

  updateMobileMenuButtonLabel();
}
