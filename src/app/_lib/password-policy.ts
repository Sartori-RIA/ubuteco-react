export const MIN_PASSWORD_LENGTH = 12;

export type PasswordIssue = "mismatch" | "too_short" | "current_required";

export function passwordIssue(input: {
  password: string;
  confirmation: string;
  currentPassword?: string;
  requireCurrent?: boolean;
}): PasswordIssue | null {
  const password = input.password.trim();
  if (!password) return null;
  if (password.length < MIN_PASSWORD_LENGTH) return "too_short";
  if (password !== input.confirmation) return "mismatch";
  if (input.requireCurrent && !input.currentPassword?.trim()) return "current_required";
  return null;
}
