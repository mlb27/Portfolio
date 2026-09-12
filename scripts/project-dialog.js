const projectDialog = document.querySelector("#project-dialog");

if (projectDialog) {
  const projects = [
    {
      key: "join",
      number: "01",
      name: "Join",
      description: {
        en: "Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign users and categories.",
        de: "Ein vom Kanban-System inspirierter Task-Manager. Erstelle und organisiere Aufgaben per Drag-and-drop und weise Benutzer sowie Kategorien zu.",
      },
      technologies: [
        { name: "CSS", icon: "css" },
        { name: "HTML", icon: "html" },
        { name: "Firebase", icon: "firebase" },
        { name: "Angular", icon: "angular" },
        { name: "TypeScript", icon: "typescript" },
      ],
      image: "./assets/images/projects/join-dialog.png",
      github: "https://github.com/willidevac/Join",
      live: "",
    },
    {
      key: "el-pollo-loco",
      number: "02",
      name: "El Pollo Loco",
      description: {
        en: "Jump, run and throw game based on object-oriented approach. Help Pepe to find coins and tabasco salsa to fight against the crazy hen.",
        de: "Ein Jump-and-Run-Spiel auf Basis eines objektorientierten Ansatzes. Hilf Pepe, Münzen und Tabasco-Salsa für den Kampf gegen das verrückte Huhn zu finden.",
      },
      technologies: [
        { name: "JavaScript", icon: "javascript" },
        { name: "HTML", icon: "html" },
        { name: "CSS", icon: "css" },
      ],
      image: "./assets/images/projects/el-pollo-loco-dialog.png",
      github: "https://github.com/mlb27/El-Pollo-Loco",
      live: "",
    },
    {
      key: "da-bubble",
      number: "03",
      name: "DABubble",
      description: {
        en: "This App is a Slack Clone App. It revolutionizes team communication and collaboration with its intuitive interface, real-time messaging, and robust channel organization.",
        de: "Diese App ist ein Slack-Klon. Sie verbessert die Kommunikation und Zusammenarbeit im Team durch eine intuitive Oberfläche, Echtzeitnachrichten und eine übersichtliche Kanalorganisation.",
      },
      technologies: [
        { name: "Angular", icon: "angular" },
        { name: "Firebase", icon: "firebase" },
        { name: "TypeScript", icon: "typescript" },
      ],
      image: "./assets/images/projects/da-bubble-dialog.png",
      github: "",
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
    projectDialog.classList.toggle("project-dialog--long", project.key === "da-bubble");
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
