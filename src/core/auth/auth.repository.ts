import { User } from "@/core/users/user.entity";

export interface AuthRepository {
  findByEmail(email: string): Promise<(User & { passwordHash: string }) | null>;
}