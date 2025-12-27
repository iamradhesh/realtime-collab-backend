import { createUser, findUserByEmail } from "./auth.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

//RegisterUSer Service
export const registerUser = async (
  email: string,
  password: string,
  name?: string
) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("User already Exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser(email, hashedPassword, name);
  return user;
};

//LoginUser Service
export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or Password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid Email or Password");
  }

  const accessToken = jwt.sign(
    {
      userId: user.id,
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
    }
  );
  const refreshToken = jwt.sign({ userId: user.id }, env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

// Refresh Token Service
export const refreshAccessToken = async (refreshToken: string) => {
  try {
    // 1. Verify the refresh token
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as { userId: string };

    // 2. Generate a new short-lived access token
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    return { accessToken };
  } catch (error) {
    throw new Error("Invalid or expired refresh token");
  }
};


