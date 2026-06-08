import { Role } from "./role";

export interface Profile {
  id: string;
  full_name: string | null;
  role: Role;
  created_at: string;
}