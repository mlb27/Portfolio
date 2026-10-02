const languageButtons = document.querySelectorAll("[data-language]");

function getSavedLanguage() {
  try {
    return localStorage.getItem("portfolio-language") === "de" ? "de" : "en";
  } catch {
    return document.documentElement.lang === "de" ? "de" : "en";
  }
}

function animateHeroProfession() {
  const profession = document.querySelector(".hero__profession");
  if (!profession) {
    return;
  }

  profession.style.setProperty("--profession-characters", profession.textContent.trim().length);
  profession.classList.remove("hero__profession--typing");
  profession.offsetWidth;
  profession.classList.add("hero__profession--typing");
}

function setLanguage(language) {
  document.documentElement.lang = language;

  document.querySelectorAll("[data-en][data-de]").forEach((element) => {
    element.textContent = element.dataset[language];
  });

  document.querySelectorAll("[data-placeholder-en][data-placeholder-de]").forEach((element) => {
    element.placeholder = element.getAttribute(`data-placeholder-${language}`);
  });

  document.querySelectorAll("[data-aria-label-en][data-aria-label-de]").forEach((element) => {
    element.setAttribute("aria-label", element.getAttribute(`data-aria-label-${language}`));
  });

  document.querySelectorAll("[data-alt-en][data-alt-de]").forEach((element) => {
    element.alt = element.getAttribute(`data-alt-${language}`);
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

  animateHeroProfession();

  try {
    localStorage.setItem("portfolio-language", language);
  } catch {
    return;
  }
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
});

setLanguage(getSavedLanguage());

window.addEventListener("pageshow", () => {
  const language = getSavedLanguage();
  if (language !== document.documentElement.lang) {
    document.querySelector(`[data-language="${language}"]`)?.click();
  }
});

const referencesTrack = document.querySelector(".references__track");

if (referencesTrack) {
  const previousButton = document.querySelector(".references__arrow--previous");
  const nextButton = document.querySelector(".references__arrow--next");
  const dots = [...document.querySelectorAll(".references__dot")];
  const status = document.querySelector(".references__status");
  const cards = [...referencesTrack.querySelectorAll(".references__card")];
  let slide = 0;

  function getReferenceStep() {
    const cardWidth = cards[0].getBoundingClientRect().width;
    const trackGap = Number.parseFloat(getComputedStyle(referencesTrack).columnGap);

    return cardWidth + trackGap;
  }

  function updateCarousel(animate = true) {
    referencesTrack.classList.toggle("references__track--no-transition", !animate);
    referencesTrack.style.setProperty("--track-offset", `${slide * -getReferenceStep()}px`);

    cards.forEach((card, index) => {
      const isActive = index === slide;
      card.classList.toggle("is-active", isActive);
      card.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === slide);
    });

    previousButton.disabled = slide === 0;
    nextButton.disabled = slide === cards.length - 1;
    updateReferenceStatus();
  }

  function updateReferenceStatus() {
    const isGerman = document.documentElement.lang === "de";
    const label = isGerman ? "Referenz" : "Reference";
    const separator = isGerman ? "von" : "of";

    status.textContent = `${label} ${slide + 1} ${separator} ${cards.length}`;
  }

  function moveCarousel(direction) {
    const nextSlide = slide + direction;
    if (nextSlide < 0 || nextSlide >= cards.length) {
      return;
    }

    slide = nextSlide;
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

    const cardIndex = cards.indexOf(card);
    if (cardIndex >= 0 && cardIndex !== slide) {
      moveCarousel(cardIndex - slide);
    }
  });

  function resetCarouselPosition() {
    updateCarousel(false);
    referencesTrack.offsetWidth;
    requestAnimationFrame(() => {
      referencesTrack.classList.remove("references__track--no-transition");
    });
  }

  window.addEventListener("resize", resetCarouselPosition);
  resetCarouselPosition();

  if ("IntersectionObserver" in window) {
    const visibleCards = new Set();
    let revealTimer = null;

    function revealNextReference() {
      if (revealTimer !== null) {
        return;
      }

      const card = cards.find((item) => visibleCards.has(item));
      if (!card) {
        return;
      }

      visibleCards.delete(card);
      card.classList.add("references__card--visible");
      referencesObserver.unobserve(card);

      revealTimer = setTimeout(() => {
        revealTimer = null;
        revealNextReference();
      }, 350);
    }

    const referencesObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
          visibleCards.add(entry.target);
        } else {
          visibleCards.delete(entry.target);
        }
      });

      revealNextReference();
    }, { threshold: 0.15 });

    referencesTrack.classList.add("references__track--reveal-ready");
    cards.forEach((card) => referencesObserver.observe(card));
  }
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
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let isSubmitting = false;

  function isFieldValid(field) {
    const value = field.value.trim();

    if (value.length === 0 || !field.validity.valid) {
      return false;
    }

    return field.type !== "email" || emailPattern.test(value);
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
