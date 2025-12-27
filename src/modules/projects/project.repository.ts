import { sql } from "../../utils/db.js";

// Create a project and assign owner
export const createProjectRecord = async (name: string, description: string, ownerId: string) => {
  try {
    await sql`BEGIN`;

    const [project] = await sql`
      INSERT INTO projects (name, description, owner_id)
      VALUES (${name}, ${description}, ${ownerId})
      RETURNING *
    `;

    await sql`
      INSERT INTO project_members (user_id, project_id, role)
      VALUES (${ownerId}, ${project.id}, 'OWNER')
    `;

    await sql`COMMIT`;
    return project;
  } catch (error) {
    await sql`ROLLBACK`;
    throw error;
  }
};

// Get all projects for a user
export const getProjectsForUser = async (userId: string) => {
  try {
    const projects = await sql`
      SELECT p.*, pm.role
      FROM projects p
      JOIN project_members pm ON p.id = pm.project_id
      WHERE pm.user_id = ${userId}
    `;
    return projects;
  } catch (error) {
    throw error;
  }
};

// Add a member to a project
export const addProjectMember = async (projectId: string, userId: string, role: string) => {
  try {
    const [member] = await sql`
      INSERT INTO project_members (project_id, user_id, role)
      VALUES (${projectId}, ${userId}, ${role})
      RETURNING *
    `;
    return member;
  } catch (error) {
    throw error;
  }
};

// Delete a project record
export const deleteProjectRecord = async (projectId: string) => {
  try {
    await sql`BEGIN`;
    await sql`DELETE FROM projects WHERE id = ${projectId}`;
    await sql`COMMIT`;
  } catch (error) {
    await sql`ROLLBACK`;
    throw error;
  }
};
