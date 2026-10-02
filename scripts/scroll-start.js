if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

function resetStartPosition() {
  if (window.location.hash) {
    history.replaceState(history.state, "", window.location.pathname + window.location.search);
  }

  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

resetStartPosition();
window.addEventListener("pageshow", resetStartPosition);
