import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asynchandler.utils";
import ApiError from "../utils/api-error.utils";
import ApiResponse from "../utils/api-response.utils.";
import {
  bookAppointmentValidation,
  updateAppointmentValidation,
} from "../validators/appointment.validation";
import { AppointmentService } from "../services/appointment.service";

/**
 * Book an appointment (creates 3 sessions)
 */
export const bookAppointment = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { error } = bookAppointmentValidation.validate(req.body);
    if (error) {
      throw ApiError.badRequest(error.details[0].message);
    }

    const { patientId, selectedDate, selectedTime } = req.body;

    const appointmentsBooked = await AppointmentService.bookAppointment(
      patientId,
      selectedDate,
      selectedTime
    );

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          appointmentsBooked,
          "Appointment booked successfully"
        )
      );
  }
);

/**
 * Get all appointments by patient ID
 */
export const getAppointmentsByPatientId = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { patientId } = req.params;

    if (!patientId) {
      throw ApiError.badRequest("Patient ID is required.");
    }

    const appointments = await AppointmentService.getAppointmentsByPatientId(
      patientId
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, appointments, "Appointments fetched successfully")
      );
  }
);

/**
 * Update appointment by ID
 */
export const updateAppointmentById = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { error } = updateAppointmentValidation.validate(req.body);
    if (error) {
      throw ApiError.badRequest(error.details[0].message);
    }

    const { appointmentId } = req.params;
    const { newDate, newTime } = req.body;

    const updatedAppointment = await AppointmentService.updateAppointmentById(
      appointmentId,
      newDate,
      newTime
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedAppointment,
          "Appointment updated successfully"
        )
      );
  }
);

/**
 * Delete appointment by ID
 */
export const deleteAppointmentById = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { appointmentId } = req.params;

    if (!appointmentId) throw ApiError.badRequest("Appointment ID is required");

    await AppointmentService.deleteAppointmentById(appointmentId);

    res
      .status(200)
      .json(new ApiResponse(200, null, "Appointment deleted successfully"));
  }
);

/**
 * Delete appointment by Patient ID
 */
export const deleteAppointmentsByPatientId = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { patientId } = req.params;

    if (!patientId) throw ApiError.badRequest("Patient ID is required");

    await AppointmentService.deleteAppointmentsByPatientId(patientId);

    res
      .status(200)
      .json(new ApiResponse(200, null, "Appointment deleted successfully"));
  }
);
