import { AuthRepository } from "./auth.repository";
import { User } from "@/core/users/user.entity";

interface PasswordHasher {
  compare(plain: string, hash: string): Promise<boolean> | boolean;
}

export class LoginUseCase {
  constructor(
    private userRepo: AuthRepository,
    private hasher: PasswordHasher,
  ) {}

  async execute(email: string, password: string): Promise<User & { passwordHash: string }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const valid = await this.hasher.compare(password, user.passwordHash);
    if (!valid) throw new Error("Invalid credentials");

    return user;
  }
}