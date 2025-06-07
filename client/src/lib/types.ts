export interface User {
  id: string;
  name: string;
  email: string;
  iat?: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  session: number;
  date: string;
  time: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
  errors?: string[];
}

export interface BookAppointmentPayload {
  patientId: string;
  selectedDate: string;
  selectedTime: string;
}

export interface UpdateAppointmentPayload {
  newDate?: string;
  newTime?: string;
}
export type AuthResult = {
  success: boolean;
  error?: string;
  data?: any;
};

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<AuthResult>;
  logout: () => Promise<AuthResult>;
  refreshUser: () => Promise<AuthResult>;
}