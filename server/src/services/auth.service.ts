import { getRepository } from "fireorm";
import bcrypt from "bcryptjs";
import { JWT } from "./jwt.service";
import ApiError from "../utils/api-error.utils";
import { Patient } from "../models/patient.model";

export class AuthService {
  private static SALT_ROUND = 10;

  /**
   * Registers a new patient user.
   *
   * @param name - Full name of the patient
   * @param password - Plaintext password to be hashed
   * @param email - Patient's email address (must be valid and unique)
   *
   * @returns A newly created Patient document
   *
   * @throws {ApiError} If email is invalid or already exists
   */
  static async registerUser(
    name: string,
    password: string,
    email: string,
  ): Promise<Patient> {
    const validEmail = this.validateEmail(email);
    if (!validEmail) {
      throw ApiError.badRequest("Email not valid, Please enter proper email.");
    }

    const patientRepo = getRepository(Patient);
    const existingPatients = await patientRepo
      .whereEqualTo("email", email)
      .find();

    if (existingPatients.length > 0) {
      throw ApiError.conflict("User already exists with the provided email.");
    }

    const hashedPassword = await bcrypt.hash(password, this.SALT_ROUND);

    const newPatient = new Patient();
    newPatient.name = name;
    newPatient.email = email;
    newPatient.passwordHash = hashedPassword;

    const savedPatient = await patientRepo.create(newPatient);
    return savedPatient;
  }

  /**
   * Logs in an existing patient and returns a signed JWT token.
   *
   * @param email - Email of the patient
   * @param password - Plaintext password to be verified
   *
   * @returns A JWT token string with user info payload
   *
   * @throws {ApiError} If email is invalid, user not found, or password is incorrect
   */
  static async loginUser(email: string, password: string): Promise<string> {
    const validEmail = this.validateEmail(email);
    if (!validEmail) {
      throw ApiError.badRequest("Enter the proper email to login.");
    }

    const patientRepo = getRepository(Patient);
    const patients = await patientRepo.whereEqualTo("email", email).find();

    if (patients.length === 0) {
      throw ApiError.notFound(
        "User not found, Please try again with the correct email."
      );
    }

    const user = patients[0];
    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      throw ApiError.unauthorized("Password mismatch.");
    }

    const token = JWT.generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    return token;
  }

  /**
   * Validates whether the provided email has proper format.
   *
   * @param email - Email string to validate
   * @returns `true` if the email is valid, otherwise `false`
   */
  private static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
