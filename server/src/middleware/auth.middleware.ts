import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/api-error.utils";
import { JWT } from "../services/jwt.service";

export const authenticateJWT = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return next(ApiError.unauthorized("No token provided"));
  }

  const { valid, user, error } = JWT.verifyJWT(token);

  if (!valid && error) {
    return next(ApiError.unauthorized("Token is not valid"));
  }

  req.user = user as {
    id: string;
    name: string;
    email: string;
  };

  next();
};
