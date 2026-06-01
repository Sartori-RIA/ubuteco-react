import Script from "next/script";

const APPEARANCE_INIT_SCRIPT = `
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

export function AppearanceScript() {
  return (
    <Script id="ubuteco-appearance-init" strategy="beforeInteractive">
      {APPEARANCE_INIT_SCRIPT}
    </Script>
  );
}
