const aboutElements = document.querySelectorAll(".about__photo, .about__content");

if (aboutElements.length && "IntersectionObserver" in window) {
  const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("about__reveal-visible");
      aboutObserver.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  aboutElements.forEach((element) => {
    element.classList.add("about__reveal-ready");
    aboutObserver.observe(element);
  });
}
