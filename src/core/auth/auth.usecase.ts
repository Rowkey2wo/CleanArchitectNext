export class LoginUseCase {
    constructor(private userRepo: any, private hasher: any) {}
  
    async execute(email: string, password: string) {
      const user = await this.userRepo.findByEmail(email);
      if (!user) throw new Error("Invalid credentials");
  
      const valid = await this.hasher.compare(password, user.passwordHash);
      if (!valid) throw new Error("Invalid credentials");
  
      return user;
    }
  }
  