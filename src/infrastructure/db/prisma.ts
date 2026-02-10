import { randomUUID } from "node:crypto";
import { Payment } from "@/core/payments/payment.entity";

interface DbUser {
  id: string;
  email: string;
  passwordHash: string;
  role: "ADMIN" | "USER";
}

const users: DbUser[] = [];
const payments: Payment[] = [];

export const prisma = {
  user: {
    async findUnique({ where: { email } }: { where: { email: string } }) {
      return users.find((user) => user.email === email) ?? null;
    },
    async create({ data }: { data: Omit<DbUser, "id"> }) {
      const user: DbUser = { id: randomUUID(), ...data };
      users.push(user);
      return user;
    },
  },
  payment: {
    async create({ data }: { data: Omit<Payment, "id"> }) {
      const payment: Payment = { id: randomUUID(), ...data };
      payments.push(payment);
      return payment;
    },
  },
};