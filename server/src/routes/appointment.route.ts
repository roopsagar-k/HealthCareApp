import express from "express";
import {
  bookAppointment,
  getAppointmentsByPatientId,
  updateAppointmentById,
  deleteAppointmentsByPatientId,
} from "../controller/appointment.controller";

const appointmentRouter = express.Router();

appointmentRouter
  .post("/book", bookAppointment)
  .get(":patientId", getAppointmentsByPatientId)
  .put("update/:appointmentId", updateAppointmentById)
  .delete(":patientId", deleteAppointmentsByPatientId);

export default appointmentRouter;
