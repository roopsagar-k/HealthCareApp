import { Collection } from "fireorm";

@Collection("appointments")
export class Appointment {
  id!: string;

  patientId!: string; // FK to Patient
  session!: number; // 1, 2, or 3
  date!: string; // e.g., "2025-06-10"
  time!: string; // e.g., "10:00"

  createdAt!: Date;
  updatedAt!: Date;
}
