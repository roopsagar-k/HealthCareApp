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
  date?: string;
  time?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
