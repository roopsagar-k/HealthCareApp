import nodemailer from "nodemailer";
import { Patient } from "../models/patient.model";
import { Appointment } from "../models/appointment.model";
import { ENV } from "../config";

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: ENV.EMAIL_USER,
        pass: ENV.EMAIL_PASS,
      },
    });
  }

  protected async sendEmail(to: string, subject: string, text: string) {
    await this.transporter.sendMail({
      from: ENV.EMAIL_USER,
      to,
      subject,
      text,
    });
  }

  protected async sendAppointmentBookedEmail(
    patient: Patient,
    appointments: Appointment[]
  ) {
    const lines = appointments
      .map((appt) => `Session ${appt.session}: ${appt.date} at ${appt.time}`)
      .join("\n");

    const text = `Hello ${patient.name},\n\nYour appointments have been booked:\n\n${lines}\n\nThank you.`;

    await this.sendEmail(patient.email, "Appointment Booked", text);
  }

  protected async sendAppointmentUpdatedEmail(
    patient: Patient,
    updatedAppointment: Appointment
  ) {
    const text = `Hello ${patient.name},\n\nYour appointment (Session: ${updatedAppointment.session}) has been rescheduled to ${updatedAppointment.date} at ${updatedAppointment.time}.\n\nThank you.`;
    await this.sendEmail(patient.email, "Appointment Rescheduled", text);
  }

  protected async sendAppointmentCancelledEmail(
    patient: Patient,
    canceledAppointments: Appointment[]
  ) {
    const lines = canceledAppointments
      .map((appt) => `Session ${appt.session}: ${appt.date} at ${appt.time}`)
      .join("\n");

    const text = `Hello ${patient.name},\n\nThe following appointment(s) have been cancelled:\n\n${lines}\n\nThank you.`;

    await this.sendEmail(patient.email, "Appointment Cancelled", text);
  }
}
