import { prisma } from "../db/prisma";
import { PaymentsRepository } from "@/core/payments/payments.repository";

export class PrismaPaymentsRepository implements PaymentsRepository {
  async create(data: any) {
    return prisma.payment.create({
      data: {
        ...data,
        status: "PENDING",
      },
    });
  }
}
