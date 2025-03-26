type Role = "User" | "Admin";

export interface User {
  _id: string;
  roles: Role[];
  email: string;
  name?: string;
  date_of_birth?: string; //ISO 8601
  avatar?: string;
  address?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserRes {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  loyaltyPoints: number;
  accountStatus: string;
  role: string;
  gender: string;
}
