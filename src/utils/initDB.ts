import { sql } from "./db.js";

export const initDB = async (): Promise<void> => {
  try {
    console.log("📦 Initializing PostgreSQL (Neon)...");

    /* ---------------------------- Extensions ---------------------------- */
    await sql`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `;

    /* ---------------------------- ENUM Types ---------------------------- */
    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_role') THEN
          CREATE TYPE project_role AS ENUM ('OWNER', 'COLLABORATOR', 'VIEWER');
        END IF;
      END$$;
    `;

    await sql`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_status') THEN
          CREATE TYPE job_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');
        END IF;
      END$$;
    `;

    /* ---------------------------- Users ---------------------------- */
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    /* ---------------------------- Projects ---------------------------- */
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    /* ---------------------------- Project Members (RBAC) ---------------------------- */
    await sql`
      CREATE TABLE IF NOT EXISTS project_members (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
        role project_role NOT NULL,
        joined_at TIMESTAMP DEFAULT NOW(),
        UNIQUE (user_id, project_id)
      );
    `;

    /* ---------------------------- Jobs ---------------------------- */
    await sql`
      CREATE TABLE IF NOT EXISTS jobs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE SET NULL,
        type VARCHAR(50),
        status job_status DEFAULT 'PENDING',
        result TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `;

    /* ---------------------------- Indexes ---------------------------- */
    await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_project_members_user ON project_members(user_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);`;

    console.log("✅ PostgreSQL schema initialized successfully");
  } catch (error) {
    console.error("❌ Database initialization failed", error);
    throw error;
  }
};
