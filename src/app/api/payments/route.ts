import { NextResponse } from "next/server";
import { z } from "zod";
import { PrismaPaymentsRepository } from "@/infrastructure/payments/payment.prisma.repo";
import { CreatePaymentUseCase } from "@/core/payments/payments.usecase";
import { requireAuth } from "@/infrastructure/auth/session.provider";

const schema = z.object({
  amount: z.number().positive(),
  method: z.enum(["GCASH", "BANK"]),
  reference: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const user = await requireAuth();
    const body = schema.parse(await req.json());

    const repo = new PrismaPaymentsRepository();
    const useCase = new CreatePaymentUseCase(repo);

    const payment = await useCase.execute({
      userId: user.id,
      ...body,
    });

    return NextResponse.json(payment, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
