import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Request, Response, NextFunction } from "express";
import ApiError from "./utils/api-error.utils";
import routes from "./routes";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
      };
    }
  }
}


export const app = express();

app.use(
  cors({
    origin: "*", // Allowed(*) since the deployed application will be tested
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

//routes
app.use("/api", routes);
app.get("/", (_req, res) => {
  res.send("<h1>Sageware Assessment Healthy Server...</h1>");
});

//Error handling
app.use((err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message,
    errors: err.errors || [],
  });
});