import { Request, Response } from "express";
import * as projectService from "../projects/project.service.js";
import { createProjectSchema, inviteMemberSchema } from "./project.schema.js";
import { ZodError } from "zod";

export const handleCreateProject = async (req: Request, res: Response) => {
  try {
    // 1. Validate the body
    const validatedBody = createProjectSchema.parse(req.body);
    
    const userId = req.user!.userId;
    const project = await projectService.createProject(
      validatedBody.name,
      validatedBody.description || "",
      userId
    );

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      // FIX: Use .issues or .flatten() for a cleaner response
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.flatten().fieldErrors 
      });
    }
    res.status(500).json({ message: error.message });
  }
};

export const handleInvite = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    
    // 1. Validate the body
    const validatedBody = inviteMemberSchema.parse(req.body);

    const membership = await projectService.inviteCollaborator(
      projectId,
      validatedBody.email,
      validatedBody.role as 'COLLABORATOR' | 'VIEWER'
    );
    
    res.status(200).json({ message: "Collaborator invited", membership });
  } catch (error: any) {
    if (error instanceof ZodError) {
      // FIX: Use .issues or .flatten()
      return res.status(400).json({ 
        message: "Validation error", 
        errors: error.flatten().fieldErrors 
      });
    }
    res.status(400).json({ message: error.message });
  }
};

export const UserProjectList = async(req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const projects = await projectService.listUserProjects(userId);
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


