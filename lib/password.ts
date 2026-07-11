/**
 * lib/password.ts — shared password validation rules
 *
 * Import this on both client and server so rules are never duplicated.
 * All functions are pure and have no side-effects.
 */

export interface PasswordRule {
  id:      string;
  label:   string;
  test:    (pw: string) => boolean;
}

/** Ordered list of requirements shown to users */
export const PASSWORD_RULES: PasswordRule[] = [
  { id: "length",    label: "At least 8 characters",          test: (p) => p.length >= 8 },
  { id: "uppercase", label: "One uppercase letter (A–Z)",      test: (p) => /[A-Z]/.test(p) },
  { id: "lowercase", label: "One lowercase letter (a–z)",      test: (p) => /[a-z]/.test(p) },
  { id: "number",    label: "One number (0–9)",                test: (p) => /[0-9]/.test(p) },
  { id: "special",   label: "One special character (!@#$…)",   test: (p) => /[^A-Za-z0-9]/.test(p) },
];

/** Returns true only when ALL rules pass */
export function isStrongPassword(password: string): boolean {
  return PASSWORD_RULES.every((r) => r.test(password));
}

/**
 * Returns a human-readable error message for the first failing rule,
 * or null if the password is valid.
 */
export function getPasswordError(password: string): string | null {
  for (const rule of PASSWORD_RULES) {
    if (!rule.test(password)) return `Password must include: ${rule.label.toLowerCase()}.`;
  }
  return null;
}

/** 0–4 strength score (one point per passing rule) */
export function passwordStrength(password: string): number {
  if (!password) return 0;
  return PASSWORD_RULES.filter((r) => r.test(password)).length;
}

export const STRENGTH_LABEL = ["", "Weak", "Fair", "Good", "Strong", "Strong"] as const;
export const STRENGTH_COLOR = [
  "",
  "bg-red-400",
  "bg-amber-400",
  "bg-blue-400",
  "bg-green-400",
  "bg-green-500",
] as const;
