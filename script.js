const languageButtons = document.querySelectorAll("[data-language]");
const translatedElements = document.querySelectorAll("[data-en][data-de]");

function setLanguage(language) {
  document.documentElement.lang = language;

  translatedElements.forEach((element) => {
    element.textContent = element.dataset[language];
  });

  document.querySelectorAll("[data-placeholder-en][data-placeholder-de]").forEach((element) => {
    element.placeholder = element.getAttribute(`data-placeholder-${language}`);
  });

  document.querySelectorAll("[data-aria-label-en][data-aria-label-de]").forEach((element) => {
    element.setAttribute("aria-label", element.getAttribute(`data-aria-label-${language}`));
  });

  const contactForm = document.querySelector(".contact__form");
  if (contactForm) {
    contactForm.setAttribute("aria-label", language === "de" ? "Kontakt" : "Contact");
  }

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

  function getReferenceStep() {
    const cardWidth = cards[0].getBoundingClientRect().width;
    const trackGap = Number.parseFloat(getComputedStyle(referencesTrack).columnGap);

    return cardWidth + trackGap;
  }

  function updateCarousel(animate = true) {
    referencesTrack.classList.toggle("references__track--no-transition", !animate);
    referencesTrack.style.setProperty("--track-offset", `${position * -getReferenceStep()}px`);

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

    updateReferenceStatus();
  }

  function updateReferenceStatus() {
    const isGerman = document.documentElement.lang === "de";
    const label = isGerman ? "Referenz" : "Reference";
    const separator = isGerman ? "von" : "of";

    status.textContent = `${label} ${slide + 1} ${separator} ${originalCards.length}`;
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
  languageButtons.forEach((button) => {
    button.addEventListener("click", updateReferenceStatus);
  });

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

  function resetCarouselPosition() {
    isTransitioning = false;
    updateCarousel(false);
    requestAnimationFrame(() => {
      referencesTrack.classList.remove("references__track--no-transition");
    });
  }

  window.addEventListener("resize", resetCarouselPosition);
  resetCarouselPosition();
}

const contactForm = document.querySelector(".contact__form");

if (contactForm) {
  contactForm.noValidate = true;
  const fields = [...contactForm.querySelectorAll(".contact__field input, .contact__field textarea")];
  const consent = document.querySelector("#contact-consent");
  const consentError = document.querySelector("#contact-consent-error");
  const submitButton = contactForm.querySelector(".contact__submit");
  const successStatus = contactForm.querySelector(".contact__status--success");
  const errorStatus = contactForm.querySelector(".contact__status--error");
  let isSubmitting = false;

  function isFieldValid(field) {
    return field.value.trim().length > 0 && field.validity.valid;
  }

  function showFieldError(field) {
    const isValid = isFieldValid(field);
    const error = document.getElementById(field.getAttribute("aria-describedby"));
    field.closest(".contact__field").classList.toggle("contact__field--invalid", !isValid);
    field.setAttribute("aria-invalid", String(!isValid));
    error.hidden = isValid;
  }

  function hideFieldError(field) {
    const error = document.getElementById(field.getAttribute("aria-describedby"));
    field.closest(".contact__field").classList.remove("contact__field--invalid");
    field.removeAttribute("aria-invalid");
    error.hidden = true;
  }

  function showConsentError() {
    const isValid = consent.checked;
    consent.setAttribute("aria-invalid", String(!isValid));
    consentError.hidden = isValid;
  }

  function hideConsentError() {
    consent.removeAttribute("aria-invalid");
    consentError.hidden = true;
  }

  function isFormValid() {
    return consent.checked && fields.every(isFieldValid);
  }

  function updateSubmitButton() {
    submitButton.disabled = isSubmitting || !isFormValid();
  }

  function hideFormStatus() {
    successStatus.hidden = true;
    errorStatus.hidden = true;
  }

  function updateContactForm() {
    updateSubmitButton();
    hideFormStatus();
  }

  fields.forEach((field) => {
    field.addEventListener("blur", () => showFieldError(field));
    field.addEventListener("focus", () => hideFieldError(field));
    field.addEventListener("input", updateContactForm);
  });

  consent.addEventListener("blur", showConsentError);
  consent.addEventListener("focus", hideConsentError);
  consent.addEventListener("change", updateContactForm);
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    fields.forEach(showFieldError);
    showConsentError();
    updateContactForm();

    if (!isFormValid()) {
      const invalidField = fields.find((field) => !isFieldValid(field));
      (invalidField || consent).focus();
      return;
    }

    isSubmitting = true;
    updateSubmitButton();

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error("Contact form request failed");
      }

      contactForm.reset();
      fields.forEach(hideFieldError);
      hideConsentError();
      successStatus.hidden = false;
    } catch (error) {
      errorStatus.hidden = false;
    } finally {
      isSubmitting = false;
      updateSubmitButton();
    }
  });

  updateContactForm();
}
