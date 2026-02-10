import { PaymentsRepository } from "./payments.repository";
import { Payment } from "./payment.entity";

export class CreatePaymentUseCase {
  constructor(private paymentsRepo: PaymentsRepository) {}

  async execute(input: {
    userId: string;
    amount: number;
    method: "GCASH" | "BANK";
    reference: string;
  }): Promise<Payment> {
    if (input.amount <= 0) {
      throw new Error("Invalid amount");
    }

    return this.paymentsRepo.create({
      userId: input.userId,
      amount: input.amount,
      method: input.method,
      reference: input.reference,
    });
  }
}
