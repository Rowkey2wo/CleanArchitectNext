import { prisma } from "../db/prisma";
import { PaymentsRepository } from "@/core/payments/payments.repository";
import { Payment } from "@/core/payments/payment.entity";

export class PrismaPaymentsRepository implements PaymentsRepository {
    async create(data: Omit<Payment, "id" | "status">) {
        return prisma.payment.create({
          data: {
            ...data,
            status: "PENDING",
          },
        });
    }
}
