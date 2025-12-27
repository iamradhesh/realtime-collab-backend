import { Router } from "express";
import { sql } from "../utils/db.js";
import authRoutes from "../modules/auth/auth.routes.js"
import projectRoutes from "../modules/projects/project.routes.js"
import jobRoutes from "../modules/jobs/job.routes.js"
const router = Router();

router.get("/health", async (_req, res) => {
  await sql`SELECT 1`;
  res.json({ status: "OK", db: "connected" });
});

router.use("/auth",authRoutes)
router.use("/project",projectRoutes)
router.use("/job",jobRoutes);
export default router;
