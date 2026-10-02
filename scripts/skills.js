const skillsGrid = document.querySelector(".skills__grid");

if (skillsGrid && "IntersectionObserver" in window) {
  const skillItems = [...skillsGrid.querySelectorAll(".skills__item")];
  const visibleSkills = new Set();
  let revealTimer = null;

  function revealNextSkill() {
    if (revealTimer !== null) {
      return;
    }

    const item = skillItems.find((skill) => visibleSkills.has(skill));
    if (!item) {
      return;
    }

    visibleSkills.delete(item);
    item.classList.add("skills__item--visible");
    skillsObserver.unobserve(item);

    revealTimer = setTimeout(() => {
      revealTimer = null;
      revealNextSkill();
    }, 120);
  }

  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
        visibleSkills.add(entry.target);
      } else {
        visibleSkills.delete(entry.target);
      }
    });

    revealNextSkill();
  }, { threshold: 0.15 });

  skillsGrid.classList.add("skills__grid--reveal-ready");
  skillItems.forEach((item) => skillsObserver.observe(item));
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
