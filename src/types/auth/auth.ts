export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken: string;
  refreshTokenExpiresIn: number;
  user: AuthenticatedUser;
}

export interface RegistrationRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface RegisteredUserResponse {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken: string;
  refreshTokenExpiresIn: number;
  user: AuthenticatedUser;
}

export interface CurrentUserResponse {
  userId: string;
  role: string;
}
