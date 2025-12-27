/**
 * @openapi
 * /api/project/create:
 *   post:
 *     summary: Create a new project
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Validation error
 */
/**
 * @openapi
 * /api/project/list:
 *   get:
 *     summary: Get all projects for the authenticated user
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user projects
 *       401:
 *         description: Unauthorized
 */
/**
 * @openapi
 * /api/project/{projectId}/invite:
 *   post:
 *     summary: Invite a collaborator to a project
 *     tags:
 *       - Projects
 *     description: |
 *       Only the **project OWNER** can invite collaborators.
 *       The invited user must already exist.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               role:
 *                 type: string
 *                 enum: [COLLABORATOR, VIEWER]
 *     responses:
 *       200:
 *         description: Collaborator invited successfully
 *       400:
 *         description: Validation error or user not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Only OWNER allowed)
 */




import { Router } from "express";
import { authenticate, requiredProjectRole } from "../../middleware/auth.middleware.js";
import * as projectCtrl from "./project.controller.js"

const router = Router();

router.use(authenticate);

//Create and LIST

router.post("/create",projectCtrl.handleCreateProject);

router.get("/list",projectCtrl.UserProjectList);

// Manage Collaborators - Only OWNER can invite
router.post(
    "/:projectId/invite",
    requiredProjectRole(['OWNER']),
    projectCtrl.handleInvite
);

export default router;