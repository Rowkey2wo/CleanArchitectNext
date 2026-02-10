import { NextResponse } from "next/server";
import { RegisterUserUseCase } from "@/core/users/users.usecase";
import { PrismaUserRepository } from "@/infrastructure/db/user.prisma.repo";
import { toPublicError } from "@/lib/errors";
import { assertEmail, assertStrongPassword } from "@/lib/validation";
import { createPasswordHash } from "@/app/api/auth/login/route";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { email?: unknown; password?: unknown };
    const email = assertEmail(body.email);
    const password = assertStrongPassword(body.password);

    const repo = new PrismaUserRepository();
    const useCase = new RegisterUserUseCase(repo);
    const user = await useCase.execute({
      email,
      passwordHash: createPasswordHash(password),
    });

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (error) {
    const publicError = toPublicError(error);
    return NextResponse.json({ error: publicError.message }, { status: publicError.statusCode });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Use POST" }, { status: 405 });
}