/**
 * @openapi
 * tags:
 *   - name: Jobs
 *     description: Asynchronous code execution management
 */

/**
 * @openapi
 * /api/jobs/execute:
 *   post:
 *     summary: Queue a new code execution job
 *     tags:
 *       - Jobs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectId
 *               - code
 *             properties:
 *               projectId:
 *                 type: string
 *                 description: The UUID of the project
 *                 example: "550e8400-e29b-41d4-a716-446655440000"
 *               code:
 *                 type: string
 *                 description: The source code to be executed
 *                 example: "console.log('Hello from RabbitMQ');"
 *     responses:
 *       202:
 *         description: Job accepted and added to RabbitMQ queue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 jobId:
 *                   type: string
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       400:
 *         description: Validation error - Missing projectId or code
 */


import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware.js";
import { handleJobRequest } from "./job.controller.js";


const router = Router();

router.use(authenticate);

router.post("/execute",handleJobRequest);

export default router;