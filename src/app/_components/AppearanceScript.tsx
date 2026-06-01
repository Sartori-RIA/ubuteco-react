export function AppearanceScript() {
  const script = `
    (function () {
      try {
        var key = "ubuteco-appearance";
        var mode = localStorage.getItem(key);
        var resolved = mode === "dark" || (mode !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
        document.documentElement.classList.toggle("dark", resolved);
        document.documentElement.dataset.appearance = mode || "system";
      } catch (e) {}
    })();
  `;

  return <script dangerouslySetInnerHTML={{__html: script}}/>;
}
