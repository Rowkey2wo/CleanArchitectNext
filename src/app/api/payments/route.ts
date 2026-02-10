import { NextResponse } from "next/server";
import { PrismaPaymentsRepository } from "@/infrastructure/payments/payment.prisma.repo";
import { CreatePaymentUseCase } from "@/core/payments/payments.usecase";
import { requireAuth } from "@/infrastructure/auth/session.provider";
import { badRequest, toPublicError } from "@/lib/errors";
import { assertString } from "@/lib/validation";

function parseAmount(value: unknown): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0 || value > 1_000_000) {
    throw badRequest("Invalid amount");
  }

  return value;
}

function parseMethod(value: unknown): "GCASH" | "BANK" {
  if (value !== "GCASH" && value !== "BANK") {
    throw badRequest("Invalid payment method");
  }

  return value;
}

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    const body = (await req.json()) as { amount?: unknown; method?: unknown; reference?: unknown };

    const repo = new PrismaPaymentsRepository();
    const useCase = new CreatePaymentUseCase(repo);

    const payment = await useCase.execute({
      userId: user.id,
      amount: parseAmount(body.amount),
      method: parseMethod(body.method),
      reference: assertString(body.reference, 6, 128),
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    const publicError = toPublicError(error);
    return NextResponse.json({ error: publicError.message }, { status: publicError.statusCode });
  }
}