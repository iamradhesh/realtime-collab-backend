import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
  REDIS_URL:process.env.REDIS_URL as string,
  RABBITMQ_URL:process.env.RABBITMQ_URL,
  DATABASE_URL:process.env.DATABASE_URL 
};
