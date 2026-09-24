const projectDialog = document.querySelector("#project-dialog");

if (projectDialog) {
  const projects = [
    {
      key: "join-issue-collector",
      number: "01",
      name: "Join Issue Collector",
      description: {
        en: "A Kanban issue collector that extends Join with a public stakeholder entry and an AI-assisted n8n email-to-triage workflow. Guests and registered users work with the same Firebase-backed board.",
        de: "Ein Kanban-Issue-Collector, der Join um einen öffentlichen Stakeholder-Eingang und einen KI-gestützten n8n-Workflow von E-Mails zur Triage erweitert. Gäste und angemeldete Nutzer arbeiten im selben Firebase-Board.",
      },
      technologies: [
        { name: "HTML", icon: "html" },
        { name: "CSS", icon: "css" },
        { name: "JavaScript", icon: "javascript" },
        { name: "Firebase", icon: "firebase" },
        { name: "n8n", icon: "n8n" },
      ],
      image: "./assets/images/projects/join-issue-collector-dialog.png",
      github: "https://github.com/mlb27/Join-Issue-Collector",
      live: "https://moritz-boehm.developerakademie.net/join-issue-collector/",
    },
    {
      key: "da-bubble",
      number: "02",
      name: "DA Bubble",
      description: {
        en: "A Slack-inspired team chat with channels, direct messages, threads and emoji reactions. Angular and Firebase provide real-time communication across the application.",
        de: "Ein von Slack inspirierter Team-Chat mit Channels, Direktnachrichten, Threads und Emoji-Reaktionen. Angular und Firebase ermöglichen die Echtzeitkommunikation in der gesamten Anwendung.",
      },
      technologies: [
        { name: "Angular", icon: "angular" },
        { name: "Firebase", icon: "firebase" },
        { name: "TypeScript", icon: "typescript" },
      ],
      image: "./assets/images/projects/da-bubble-dialog.png",
      github: "https://github.com/ChristopherBraun196/DA-Bubble",
      live: "",
    },
    {
      key: "code-a-cuisine",
      number: "03",
      name: "Code à Cuisine",
      description: {
        en: "An AI-powered recipe generator that creates three tailored recipes from available ingredients and personal cooking preferences. n8n handles the generation while Supabase stores validated recipes.",
        de: "Ein KI-gestützter Rezeptgenerator, der aus vorhandenen Zutaten und persönlichen Kochpräferenzen drei passende Rezepte erstellt. n8n übernimmt die Generierung, Supabase speichert die validierten Rezepte.",
      },
      technologies: [
        { name: "Angular", icon: "angular" },
        { name: "TypeScript", icon: "typescript" },
        { name: "SCSS", icon: "sass" },
        { name: "Supabase", icon: "supabase" },
      ],
      image: "./assets/images/projects/code-a-cuisine-dialog.jpg",
      github: "https://github.com/mlb27/code-a-cuisine",
      live: "",
    },
  ];

  const projectTriggers = [...document.querySelectorAll(".projects__trigger")];
  const dialogNumber = projectDialog.querySelector(".project-dialog__number");
  const dialogTitle = projectDialog.querySelector("#project-dialog-title");
  const dialogDescription = projectDialog.querySelector("#project-dialog-description");
  const dialogTechnologies = projectDialog.querySelector(".project-dialog__technologies");
  const dialogImage = projectDialog.querySelector(".project-dialog__image");
  const githubLink = projectDialog.querySelector(".project-dialog__github");
  const liveLink = projectDialog.querySelector(".project-dialog__live");
  const closeButton = projectDialog.querySelector(".project-dialog__close");
  const nextButton = projectDialog.querySelector(".project-dialog__next");
  const projectLanguageButtons = [...document.querySelectorAll("[data-language]")];
  let currentProject = 0;
  let lastTrigger = null;

  function getLanguage() {
    return document.documentElement.lang === "de" ? "de" : "en";
  }

  function setProjectLink(link, url) {
    link.href = url || "#";
    link.toggleAttribute("aria-disabled", !url);

    if (url) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    } else {
      link.removeAttribute("target");
      link.removeAttribute("rel");
    }
  }

  function renderTechnologies(technologies) {
    dialogTechnologies.replaceChildren();

    technologies.forEach((technology) => {
      const item = document.createElement("li");
      const icon = document.createElement("span");
      const label = document.createElement("span");

      item.className = "project-dialog__technology";
      icon.className = `project-dialog__technology-icon project-dialog__technology-icon--${technology.icon}`;
      icon.setAttribute("aria-hidden", "true");
      label.textContent = technology.name;
      item.append(icon, label);
      dialogTechnologies.append(item);
    });

    dialogTechnologies.setAttribute(
      "aria-label",
      `${getLanguage() === "de" ? "Technologien" : "Technologies"}: ${technologies
        .map((technology) => technology.name)
        .join(", ")}`,
    );
  }

  function renderProject(index, animate = false) {
    const project = projects[index];
    const language = getLanguage();

    currentProject = index;
    projectDialog.classList.toggle("project-dialog--later", index > 0);
    dialogNumber.textContent = project.number;
    dialogTitle.textContent = project.name;
    dialogDescription.textContent = project.description[language];
    dialogImage.src = project.image;
    dialogImage.alt = `${project.name} ${language === "de" ? "Projektvorschau" : "project preview"}`;
    closeButton.setAttribute(
      "aria-label",
      language === "de" ? "Projektdetails schließen" : "Close project details",
    );
    renderTechnologies(project.technologies);
    setProjectLink(githubLink, project.github);
    setProjectLink(liveLink, project.live);

    if (animate) {
      projectDialog.classList.remove("project-dialog--switching");
      projectDialog.offsetWidth;
      projectDialog.classList.add("project-dialog--switching");
    }
  }

  projectTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const index = projects.findIndex((project) => project.key === trigger.dataset.project);

      if (index < 0) {
        return;
      }

      lastTrigger = trigger;
      renderProject(index);
      projectDialog.showModal();
      projectDialog.scrollTop = 0;
      projectDialog.focus({ preventScroll: true });
    });
  });

  closeButton.addEventListener("click", () => projectDialog.close());
  nextButton.addEventListener("click", () => renderProject((currentProject + 1) % projects.length, true));
  projectLanguageButtons.forEach((button) => {
    button.addEventListener("click", () => renderProject(currentProject));
  });

  projectDialog.querySelectorAll("a[aria-disabled='true']").forEach((link) => {
    link.addEventListener("click", (event) => event.preventDefault());
  });

  projectDialog.addEventListener("click", (event) => {
    const disabledLink = event.target.closest("a[aria-disabled='true']");

    if (disabledLink) {
      event.preventDefault();
    }
  });

  projectDialog.addEventListener("animationend", () => {
    projectDialog.classList.remove("project-dialog--switching");
  });

  projectDialog.addEventListener("close", () => {
    projectDialog.classList.remove("project-dialog--switching");
    lastTrigger?.focus();
  });
}
