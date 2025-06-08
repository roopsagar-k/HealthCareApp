import { getRepository } from "fireorm";
import { Appointment } from "../models/appointment.model";
import { Patient } from "../models/patient.model";
import ApiError from "../utils/api-error.utils";
import { addDays, format, isSameDay, parse } from "date-fns";
import { EmailService } from "./email.service";

const ALLOWED_DAYS = [2, 3, 5]; // Tuesday, Wednesday, Friday

export class AppointmentService extends EmailService {
  /**
   * Book a new appointment and auto-generate 2 follow-ups (sessions 2 and 3).
   *
   * @param patientId - Patient's ID
   * @param date - First session date (format: YYYY-MM-DD)
   * @param time - Time slot (format: HH:mm)
   * @returns Array of 3 Appointment objects (sessions 1–3)
   */
  static async bookAppointment(
    patientId: string,
    date: string,
    time: string
  ): Promise<Appointment[]> {
    const patientRepo = getRepository(Patient);
    const patient = await patientRepo.findById(patientId);
    if (!patient) throw ApiError.notFound("Patient not found.");

    const firstDate = parse(`${date} ${time}`, "yyyy-MM-dd HH:mm", new Date());
    if (!this.isAllowedDay(firstDate)) {
      throw ApiError.badRequest("First session must be on Tue/Wed/Fri.");
    }

    const slotAvailable = await this.isSlotFree(date, time);
    if (!slotAvailable) {
      throw ApiError.conflict("This time slot is already booked.");
    }

    const appointmentRepo = getRepository(Appointment);
    const now = new Date();

    const appointments: Appointment[] = [];

    // Session 1
    const session1 = await appointmentRepo.create({
      patientId,
      session: 1,
      date,
      time,
      createdAt: now,
      updatedAt: now,
    });
    appointments.push(session1);

    // Sessions 2 and 3
    let lastDate = firstDate;
    for (let i = 2; i <= 3; i++) {
      let nextDate = addDays(lastDate, 14);
      while (!this.isAllowedDay(nextDate)) {
        nextDate = addDays(nextDate, 1);
      }

      const dateStr = format(nextDate, "yyyy-MM-dd");
      const slotAvailable = await this.isSlotFree(dateStr, time);
      if (!slotAvailable) {
        throw ApiError.conflict(
          `Follow-up session ${i} slot already booked on ${dateStr} at ${time}`
        );
      }

      const session = await appointmentRepo.create({
        patientId,
        session: i,
        date: dateStr,
        time,
        createdAt: now,
        updatedAt: now,
      });

      appointments.push(session);
      lastDate = nextDate;
    }

    const service = new AppointmentService();
    await service.sendAppointmentBookedEmail(patient, appointments);

    return appointments;
  }

  /**
   * Get all appointments for a specific patient.
   *
   * @param patientId - ID of the patient
   * @returns Appointment[]
   */
  static async getAppointmentsByPatientId(
    patientId: string
  ): Promise<Appointment[]> {
    const appointmentRepo = getRepository(Appointment);
    return await appointmentRepo.whereEqualTo("patientId", patientId).find();
  }

  /**
   * Update a specific appointment's date & time.
   *
   * @param appointmentId - ID of the appointment to update
   * @param date - New date (YYYY-MM-DD)
   * @param time - New time (HH:mm)
   * @returns Updated Appointment
   */
  static async updateAppointmentById(
    appointmentId: string,
    date: string,
    time: string
  ): Promise<Appointment> {
    const appointmentRepo = getRepository(Appointment);
    const patientRepo = getRepository(Patient);
    const appointment = await appointmentRepo.findById(appointmentId);
    const patient = await patientRepo.findById(appointment.patientId);
    const service = new AppointmentService();
    if (!appointment) throw ApiError.notFound("Appointment not found.");

    const newDate = parse(`${date} ${time}`, "yyyy-MM-dd HH:mm", new Date());
    console.log("Raw:", `${date} ${time}`);
    console.log(newDate);
    if (!this.isAllowedDay(newDate)) {
      throw ApiError.badRequest("Appointments must be on Tue/Wed/Fri.");
    }

    const isAvailable = await this.isSlotFree(date, time, appointmentId);
    if (!isAvailable) {
      throw ApiError.conflict("This slot is already taken.");
    }

    appointment.date = date;
    appointment.time = time;
    appointment.updatedAt = new Date();
    const updatedAppointment = await appointmentRepo.update(appointment);
    await service.sendAppointmentUpdatedEmail(patient, updatedAppointment);
    return updatedAppointment;
  }

  /**
   * Delete a single appointment by ID.
   *
   * @param appointmentId - Appointment ID
   */
  static async deleteAppointmentById(appointmentId: string): Promise<void> {
    const appointmentRepo = getRepository(Appointment);
    await appointmentRepo.delete(appointmentId);
  }

  /**
   * Check if a given date is an allowed appointment day.
   *
   * @param date - Date object
   * @returns true if allowed
   */
  private static isAllowedDay(date: Date): boolean {
    return ALLOWED_DAYS.includes(date.getDay());
  }

  /**
   * Check if a given date+time slot is free.
   *
   * @param date - Date (YYYY-MM-DD)
   * @param time - Time (HH:mm)
   * @param excludeId - Optional appointment ID to exclude from check
   * @returns true if slot is not booked
   */
  private static async isSlotFree(
    date: string,
    time: string,
    excludeId?: string
  ): Promise<boolean> {
    const appointmentRepo = getRepository(Appointment);
    const appointments = await appointmentRepo
      .whereEqualTo("date", date)
      .find();

    return !appointments.some((appt) => {
      return appt.time === time && appt.id !== excludeId;
    });
  }

  /**
   * Delete all appointments for a specific patient (all 3 sessions).
   *
   * @param patientId - ID of the patient whose appointments should be deleted
   */
  static async deleteAppointmentsByPatientId(patientId: string): Promise<void> {
    const appointmentRepo = getRepository(Appointment);
    const patientRepo = getRepository(Patient);

    const [appointments, patient] = await Promise.all([
      appointmentRepo.whereEqualTo("patientId", patientId).find(),
      patientRepo.findById(patientId),
    ]);

    if (appointments.length === 0) {
      throw ApiError.notFound("No appointments found for this patient.");
    }

    const service = new AppointmentService();

    await Promise.all([
      appointments.map((appt) => appointmentRepo.delete(appt.id)),
      service.sendAppointmentCancelledEmail(patient, appointments),
    ]);
  }
}
