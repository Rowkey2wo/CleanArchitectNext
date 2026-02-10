import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export function createPasswordHash(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(plain: string, storedHash: string): boolean {
  const [salt, expected] = storedHash.split(":");
  if (!salt || !expected) return false;

  const calculated = scryptSync(plain, salt, 64).toString("hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  const calculatedBuffer = Buffer.from(calculated, "hex");

  if (expectedBuffer.length !== calculatedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, calculatedBuffer);
}