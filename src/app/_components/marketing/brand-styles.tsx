/** Shared brand accents — landing, auth, and app shell. */
export const BRAND_CTA =
  "!border-0 !bg-blue-600 !text-white shadow-md shadow-blue-600/20 hover:!bg-blue-700 focus:!ring-blue-600 dark:!bg-blue-500 dark:hover:!bg-blue-400";

export const AMBIENT_PAGE =
  "bg-gradient-to-br from-amber-100 via-orange-50 to-blue-100 dark:from-amber-950/40 dark:via-background dark:to-blue-950/50";

export const AMBIENT_APP =
  "bg-gradient-to-br from-background via-amber-50/25 to-blue-50/20 dark:via-amber-950/10 dark:to-blue-950/15";

export const AMBIENT_BLOBS = (
  <>
    <div
      aria-hidden
      className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl dark:bg-amber-600/10"
    />
    <div
      aria-hidden
      className="pointer-events-none absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl dark:bg-blue-600/10"
    />
  </>
);
