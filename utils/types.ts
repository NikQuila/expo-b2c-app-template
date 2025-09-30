// Global types for the application
export interface User {
  id: string;
  auth_id: string;
  email: string;
  name?: string;
  last_name?: string;
  onboarding_completed?: boolean;
  birth_date?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
