export type UserRole = "customer" | "admin";

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
}