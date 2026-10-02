const skillsGrid = document.querySelector(".skills__grid");

if (skillsGrid && "IntersectionObserver" in window) {
  const skillItems = [...skillsGrid.querySelectorAll(".skills__item")];

  skillItems.forEach((item, index) => {
    item.style.setProperty("--skill-reveal-delay", `${index * 120}ms`);
  });

  const skillsObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      skillsGrid.classList.add("skills__grid--visible");
      skillsObserver.disconnect();
    }
  }, { threshold: 0.15 });

  skillsGrid.classList.add("skills__grid--reveal-ready");
  skillsObserver.observe(skillsGrid);
}

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

  const desktopViewport = window.matchMedia("(min-width: 991px)");
  desktopViewport.addEventListener("change", () => setGrowthMindsetOpen(false));
}
