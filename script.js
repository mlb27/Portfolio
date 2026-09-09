const languageButtons = document.querySelectorAll("[data-language]");
const translatedElements = document.querySelectorAll("[data-en][data-de]");

function setLanguage(language) {
  document.documentElement.lang = language;

  translatedElements.forEach((element) => {
    element.textContent = element.dataset[language];
  });

  languageButtons.forEach((button) => {
    const isActive = button.dataset.language === language;

    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive);
  });
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
});

const referencesTrack = document.querySelector(".references__track");

if (referencesTrack) {
  const previousButton = document.querySelector(".references__arrow--previous");
  const nextButton = document.querySelector(".references__arrow--next");
  const dots = [...document.querySelectorAll(".references__dot")];
  const status = document.querySelector(".references__status");
  const originalCards = [...referencesTrack.querySelectorAll(".references__card")];
  const activeReferenceOrder = [1, 2, 0];

  function createClone(card) {
    const clone = card.cloneNode(true);

    clone.classList.add("references__card--clone");
    clone.classList.remove("is-active");
    clone.setAttribute("aria-hidden", "true");

    return clone;
  }

  const leadingClones = originalCards.slice(-2).map(createClone);
  const trailingClones = originalCards.slice(0, 2).map(createClone);

  referencesTrack.prepend(...leadingClones);
  referencesTrack.append(...trailingClones);

  const cards = [...referencesTrack.querySelectorAll(".references__card")];
  let position = 3;
  let slide = 0;
  let isTransitioning = false;

  function updateCarousel(animate = true) {
    referencesTrack.classList.toggle("references__track--no-transition", !animate);
    referencesTrack.style.setProperty("--track-offset", `${position * -696}px`);

    cards.forEach((card, index) => {
      card.classList.toggle("is-active", index === position);
    });

    originalCards.forEach((card) => {
      const isActive = Number(card.dataset.reference) === activeReferenceOrder[slide];
      card.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === slide);
    });

    status.textContent = `Reference ${slide + 1} of 3`;
  }

  function moveCarousel(direction) {
    if (isTransitioning) {
      return;
    }

    isTransitioning = true;
    position += direction;
    slide = (slide + direction + 3) % 3;
    updateCarousel();
  }

  previousButton.addEventListener("click", () => moveCarousel(-1));
  nextButton.addEventListener("click", () => moveCarousel(1));

  referencesTrack.addEventListener("click", (event) => {
    const card = event.target.closest(".references__card");

    if (!card) {
      return;
    }

    const cardPosition = cards.indexOf(card);

    if (cardPosition === position - 1) {
      moveCarousel(-1);
    } else if (cardPosition === position + 1) {
      moveCarousel(1);
    }
  });

  referencesTrack.addEventListener("transitionend", (event) => {
    if (event.target !== referencesTrack || event.propertyName !== "transform") {
      return;
    }

    if (position === 1 || position === 5) {
      position = position === 1 ? 4 : 2;
      updateCarousel(false);
      referencesTrack.offsetWidth;
      requestAnimationFrame(() => {
        referencesTrack.classList.remove("references__track--no-transition");
      });
    }

    isTransitioning = false;
  });

  updateCarousel(false);
  requestAnimationFrame(() => {
    referencesTrack.classList.remove("references__track--no-transition");
  });
}