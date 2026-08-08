export interface User {
  id: string;
  email: string;
  roleNames: Array<RoleName>;
  lastLoggedIn: string;
}

export interface UserResponse {
  user: {
    lastLoggedIn: string;
    studentUsers: unknown;
    teacherUsers: unknown;
    adminUsers: unknown;
    id: string;
    email: string;
  };
  roles: Array<RoleName>;
  accessToken: string;
  refreshToken: string;
}

export interface UserToken {
  accessToken: string;
  refreshToken: string;
}

export interface RoleName {
  role: Role;
  name?: string;
  role_id?: string;
}

export type Role = "student" | "teacher" | "admin";
