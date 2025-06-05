import { Collection } from "fireorm";

@Collection("slots")
export class Slot {
  id!: string; // `${date}_${time}` (e.g., "2025-06-10_10:00")
  date!: string; // "2025-06-10"
  time!: string; // "10:00"
  isBooked!: boolean; // true if blocked
  bookedBy?: string; // patientId
}
