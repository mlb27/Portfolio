const growthMindsetItem = document.querySelector(".skills__item--growth");
const growthMindsetTrigger = growthMindsetItem?.querySelector(".skills__growth-trigger");
const growthMindsetTooltip = growthMindsetItem?.querySelector(".skills__growth-tooltip");

if (growthMindsetItem && growthMindsetTrigger && growthMindsetTooltip) {
  function setGrowthMindsetOpen(isOpen) {
    growthMindsetItem.classList.toggle("is-open", isOpen);
    growthMindsetTrigger.setAttribute("aria-expanded", isOpen);
    growthMindsetTooltip.setAttribute("aria-hidden", !isOpen);
  }

  growthMindsetTrigger.addEventListener("click", () => {
    setGrowthMindsetOpen(!growthMindsetItem.classList.contains("is-open"));
  });

  document.addEventListener("click", (event) => {
    if (!growthMindsetItem.contains(event.target)) {
      setGrowthMindsetOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && growthMindsetItem.classList.contains("is-open")) {
      setGrowthMindsetOpen(false);
      growthMindsetTrigger.focus();
    }
  });

  const desktopViewport = window.matchMedia("(min-width: 769px)");
  desktopViewport.addEventListener("change", () => setGrowthMindsetOpen(false));
}
