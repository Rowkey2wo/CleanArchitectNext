import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { LoginUseCase } from "@/core/auth/auth.usecase";
import { PrismaUserRepository } from "@/infrastructure/db/user.prisma.repo";
import { createSessionToken, issueAuthCookie } from "@/infrastructure/auth/session.provider";
import { toPublicError, tooManyRequests } from "@/lib/errors";
import { assertEmail, assertString } from "@/lib/validation";

const attempts = new Map<string, { count: number; expiresAt: number }>();

function checkRateLimit(ip: string) {
  const now = Date.now();
  const record = attempts.get(ip);

  if (!record || record.expiresAt < now) {
    attempts.set(ip, { count: 1, expiresAt: now + 10 * 60_000 });
    return;
  }

  if (record.count >= 10) {
    throw tooManyRequests();
  }

  record.count += 1;
}

function compareHash(password: string, storedHash: string) {
  const [salt, expected] = storedHash.split(":");
  if (!salt || !expected) return false;

  const calculated = scryptSync(password, salt, 64).toString("hex");
  return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(calculated, "hex"));
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    checkRateLimit(ip);

    const body = (await req.json()) as { email?: unknown; password?: unknown };
    const email = assertEmail(body.email);
    const password = assertString(body.password, 12, 128);

    const repo = new PrismaUserRepository();
    const useCase = new LoginUseCase(repo, { compare: compareHash });

    const user = await useCase.execute(email, password);
    const token = createSessionToken({ id: user.id, email: user.email, role: user.role });
    await issueAuthCookie(token);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const publicError = toPublicError(error);
    if (publicError.statusCode === 500) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ error: publicError.message }, { status: publicError.statusCode });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Use POST" }, { status: 405 });
}

export function createPasswordHash(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}