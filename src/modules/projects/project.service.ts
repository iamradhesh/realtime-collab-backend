import { findUserByEmail } from "../auth/auth.repository.js";
import * as projectRepo from "./project.repository.js";
import { redis } from "../../utils/redis.js"; // Your Upstash client

export const createProject = async (name: string, description: string, userId: string) => {
  const project = await projectRepo.createProjectRecord(name, description, userId);
  
  // Invalidate the user's project list cache so they see the new project immediately
  await redis.del(`user_projects:${userId}`);
  
  return project;
};

export const listUserProjects = async (userId: string) => {
  const cacheKey = `user_projects:${userId}`;

  // 1. Check Upstash Redis Cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log("🚀 Cache Hit: listUserProjects");
    return JSON.parse(cached);
  }

  // 2. Cache Miss: Fetch from Neon PostgreSQL
  console.log("📦 Cache Miss: listUserProjects");
  const projects = await projectRepo.getProjectsForUser(userId);

  // 3. Store in Redis for 10 minutes (600 seconds)
  if (projects) {
    await redis.set(cacheKey, JSON.stringify(projects), "EX", 600);
  }

  return projects;
};

export const inviteCollaborator = async (projectId: string, email: string, role: 'COLLABORATOR' | 'VIEWER') => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }

  const membership = await projectRepo.addProjectMember(projectId, user.id, role);
  
  // Invalidate the invited user's cache so the project appears in their list
  await redis.del(`user_projects:${user.id}`);
  
  return membership;
};