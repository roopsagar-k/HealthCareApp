import Joi from "joi";
import dayjs from "dayjs";

const allowedDays = ["Tuesday", "Wednesday", "Friday"];

/**
 * Joi validation for booking a appointment
 */
export const bookAppointmentValidation = Joi.object({
  patientId: Joi.string().required().messages({
    "string.empty": "Patient ID is required.",
  }),

  selectedDate: Joi.string()
    .required()
    .custom((value, helpers) => {
      const date = dayjs(value);
      if (!date.isValid()) {
        return helpers.error("any.invalid", {
          message: "Invalid date format. Use YYYY-MM-DD.",
        });
      }

      const dayName = date.format("dddd");
      if (!allowedDays.includes(dayName)) {
        return helpers.error("any.invalid", {
          message:
            "Appointments can only be booked on Tuesday, Wednesday, or Friday.",
        });
      }

      return value;
    }),

  selectedTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):00$/)
    .required()
    .messages({
      "string.pattern.base": "Time must be in HH:00 format (1-hour slots).",
      "string.empty": "Selected time is required.",
    }),
});

/**
 * Joi validation for updating a appointment
 */
export const updateAppointmentValidation = Joi.object({
  newDate: Joi.string()
    .required()
    .custom((value, helpers) => {
      const date = dayjs(value);
      if (!date.isValid()) {
        return helpers.error("any.invalid", {
          message: "Invalid date format. Use YYYY-MM-DD.",
        });
      }

      const dayName = date.format("dddd");
      if (!allowedDays.includes(dayName)) {
        return helpers.error("any.invalid", {
          message:
            "Appointments can only be rescheduled to Tuesday, Wednesday, or Friday.",
        });
      }

      return value;
    }),

  newTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):00$/)
    .required()
    .messages({
      "string.pattern.base": "Time must be in HH:00 format (1-hour slots).",
      "string.empty": "New time is required.",
    }),
});