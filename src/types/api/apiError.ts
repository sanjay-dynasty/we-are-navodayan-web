export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  timestamp?: string;
  path?: string;
}
