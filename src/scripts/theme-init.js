(() => {
  const system = window.matchMedia("(prefers-color-scheme: dark)");
  const normalize = (value) => (value === "light" || value === "dark" ? value : "system");
  let preference = "system";

  try {
    preference = normalize(localStorage.theme);
  } catch {
    // Theme switching still works when browser storage is unavailable.
  }

  function apply() {
    document.documentElement.dataset.themePreference = preference;
    document.documentElement.dataset.theme =
      preference === "system" ? (system.matches ? "dark" : "light") : preference;
    document.dispatchEvent(new Event("moecore:theme-updated"));
  }

  document.addEventListener("moecore:theme-select", (event) => {
    preference = normalize(event.detail);
    try {
      if (preference === "system") localStorage.removeItem("theme");
      else localStorage.theme = preference;
    } catch {
      // Keep the selected appearance for this page even if it cannot be saved.
    }
    apply();
  });

  system.addEventListener("change", () => {
    if (preference === "system") apply();
  });
  window.addEventListener("storage", (event) => {
    if (event.key === "theme" || event.key === null) {
      preference = normalize(event.newValue);
      apply();
    }
  });
  apply();
})();
