const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UPPER_REGEX = /[A-Z]/;
const LOWER_REGEX = /[a-z]/;
const NUMBER_REGEX = /\d/;
const SYMBOL_REGEX = /[^A-Za-z0-9]/;

export function assertEmail(value: unknown): string {
  if (typeof value !== "string") {
    throw new Error("Invalid email");
  }

  const email = value.trim().toLowerCase();
  if (!EMAIL_REGEX.test(email) || email.length > 254) {
    throw new Error("Invalid email");
  }

  return email;
}

export function assertStrongPassword(value: unknown): string {
  if (typeof value !== "string") {
    throw new Error("Invalid password");
  }

  const password = value.trim();
  const validLength = password.length >= 12 && password.length <= 128;

  if (
    !validLength ||
    !UPPER_REGEX.test(password) ||
    !LOWER_REGEX.test(password) ||
    !NUMBER_REGEX.test(password) ||
    !SYMBOL_REGEX.test(password)
  ) {
    throw new Error("Weak password");
  }

  return password;
}

export function assertString(value: unknown, min = 1, max = 255): string {
  if (typeof value !== "string") {
    throw new Error("Invalid input");
  }

  const text = value.trim();
  if (text.length < min || text.length > max) {
    throw new Error("Invalid input");
  }

  return text;
}