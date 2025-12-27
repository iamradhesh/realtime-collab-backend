import { z } from "zod";

// Validates the Create Project request
export const createProjectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters").max(100),
  description: z.string().max(500).optional().default(""),
});

// Validates the Invite Collaborator request
export const inviteMemberSchema = z.object({
  email: z.string().email("Invalid email format"),
  role: z.enum(["OWNER", "COLLABORATOR", "VIEWER"], {
    message: "Role must be OWNER, COLLABORATOR, or VIEWER",
  }),
});

