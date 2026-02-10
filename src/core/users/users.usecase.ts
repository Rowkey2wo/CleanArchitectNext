import { User } from "./user.entity";

interface UsersRepository {
  findByEmail(email: string): Promise<User | null>;
  create(input: { email: string; passwordHash: string; role?: "ADMIN" | "USER" }): Promise<User>;
}

export class RegisterUserUseCase {
  constructor(private usersRepo: UsersRepository) {}

  async execute(input: { email: string; passwordHash: string }): Promise<User> {
    const existing = await this.usersRepo.findByEmail(input.email);
    if (existing) {
      throw new Error("User already exists");
    }

    return this.usersRepo.create({
      email: input.email,
      passwordHash: input.passwordHash,
      role: "USER",
    });
  }
}