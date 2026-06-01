export function AppearanceScript() {
  const script = `
    (function () {
      var key = "ubuteco-appearance";
      var mode = localStorage.getItem(key);
      var dark = mode === "dark" || (mode !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      if (dark) document.documentElement.classList.add("dark");
      document.documentElement.dataset.appearance = mode || "system";
    })();
  `;

  return <script dangerouslySetInnerHTML={{__html: script}} />;
}
