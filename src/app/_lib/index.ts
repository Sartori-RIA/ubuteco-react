export function truncateWords(text: string, max: number): string {
  if (text.length <= max) return text

  return text.slice(0, max).split(" ").slice(0, -1).join(" ") + "..."
}
