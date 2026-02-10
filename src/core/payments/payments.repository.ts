import { Payment } from "./payment.entity";

export interface PaymentsRepository {
  create(payment: Omit<Payment, "id" | "status">): Promise<Payment>;
}
