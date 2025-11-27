// Type definitions for the application

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  image?: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  userId: string;
  images?: string[];

  createdAt: Date;
  updatedAt: Date;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserFilters {
  name?: string;
  email?: string;
  status?: "active" | "inactive";
  dateFrom?: Date;
  dateTo?: Date;
}

export interface PostFilters {
  createdBy?: string;
  title?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface UserDropdown {
  id: string;
  firstName: string;
  lastName: string;
}
