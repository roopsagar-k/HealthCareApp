import { Router } from "express";
import authRouter from "./auth.route";
import appointmentRouter from "./appointment.route";

export const router = Router();

router.use("/auth", authRouter);
router.use("/appointments", appointmentRouter);

export default router