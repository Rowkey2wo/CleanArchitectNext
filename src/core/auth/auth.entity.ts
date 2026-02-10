export interface SessionUser {
    id: string;
    email: string;
    role: "ADMIN" | "USER";
  }