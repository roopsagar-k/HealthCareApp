import { Collection } from "fireorm";

@Collection("patients")
export class Patient {
  id!: string; 
  name!: string;
  email!: string;
  passwordHash!: string; 
}
