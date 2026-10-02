const projectsList = document.querySelector(".projects__list");

if (projectsList && "IntersectionObserver" in window) {
  const projectItems = [...projectsList.querySelectorAll(".projects__item")];
  let projectIndex = 0;
  let spotlightTimer;

  function stopProjectIntro() {
    clearTimeout(spotlightTimer);
    projectsObserver.disconnect();
    projectsList.classList.remove("projects__list--intro");
    projectItems.forEach((item) => item.classList.remove("projects__item--spotlight"));
  }

  function highlightNextProject() {
    if (projectIndex >= projectItems.length) {
      stopProjectIntro();
      return;
    }

    const item = projectItems[projectIndex];
    item.classList.add("projects__item--spotlight");

    spotlightTimer = setTimeout(() => {
      item.classList.remove("projects__item--spotlight");
      projectIndex += 1;
      spotlightTimer = setTimeout(highlightNextProject, projectIndex < projectItems.length ? 75 : 150);
    }, 350);
  }

  const projectsObserver = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) {
      return;
    }

    projectsObserver.disconnect();

    const isHovered = window.matchMedia("(hover: hover)").matches && projectsList.matches(":hover");
    if (isHovered || projectsList.contains(document.activeElement)) {
      return;
    }

    projectsList.classList.add("projects__list--intro");
    highlightNextProject();
  }, { threshold: 0.5 });

  projectsList.addEventListener("pointermove", (event) => {
    if (event.pointerType === "mouse") {
      stopProjectIntro();
    }
  });
  projectsList.addEventListener("pointerdown", stopProjectIntro);
  projectsList.addEventListener("focusin", stopProjectIntro);
  projectsObserver.observe(projectsList);
}
