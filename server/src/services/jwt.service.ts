import { ENV } from "../config";
import jwt from "jsonwebtoken";

export class JWT {
  private static AUTH_SECRET = ENV.JWT_SECRET;

  static generateToken(payload: object) {
    return jwt.sign(payload, this.AUTH_SECRET);
  }

  static verifyJWT(token: string) {
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET as string);
      return { valid: true, user };
    } catch (error) {
      return { valid: false, error };
    }
  }
}
