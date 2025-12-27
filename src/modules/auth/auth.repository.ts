import { sql } from "../../utils/db.js";

export const findUserByEmail = async (email: string) => {
  const rows = await sql`
    SELECT id, email, password, name
    FROM users
    WHERE email = ${email}
  `;
  return rows[0];
};

export const createUser = async (
  email: string,
  password: string,
  name?: string
) => {
  const rows = await sql`
    INSERT INTO users (email, password, name)
    VALUES (${email}, ${password}, ${name})
    RETURNING id, email, name
  `;
  return rows[0];
};
