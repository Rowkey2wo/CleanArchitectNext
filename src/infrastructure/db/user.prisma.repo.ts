import { User } from "@/core/users/user.entity";
import { prisma } from "./prisma";

interface DbUser extends User {
  passwordHash: string;
}

export class PrismaUserRepository {
  async findByEmail(email: string): Promise<DbUser | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(input: { email: string; passwordHash: string; role?: "ADMIN" | "USER" }): Promise<User> {
    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash: input.passwordHash,
        role: input.role ?? "USER",
      },
    });

    return { id: user.id, email: user.email, role: user.role };
  }
}