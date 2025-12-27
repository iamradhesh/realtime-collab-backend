import { describe, it, expect, vi, beforeEach } from "vitest";
import * as authService from "./auth.service.js";
import * as authRepo from "./auth.repository.js";
import bcrypt from "bcrypt";

// 1. Mock the repository and bcrypt
vi.mock("./auth.repository.js");
vi.mock("bcrypt");

describe("Auth Service - Register", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Reset mocks before each test
  });

  it("should throw an error if user already exists", async () => {
    // Arrange: Simulate repo finding an existing user
    (authRepo.findUserByEmail as any).mockResolvedValue({ id: "1", email: "test@test.com" });

    // Act & Assert
    await expect(authService.registerUser("test@test.com", "password123", "User"))
      .rejects.toThrow(/User already exists/i);
    
    expect(authRepo.createUser).not.toHaveBeenCalled();
  });

  it("should hash password and create user if email is unique", async () => {
    // Arrange
    (authRepo.findUserByEmail as any).mockResolvedValue(null);
    (bcrypt.hash as any).mockResolvedValue("hashed_pass");
    (authRepo.createUser as any).mockResolvedValue({ id: "2", email: "new@test.com" });

    // Act
    const result = await authService.registerUser("new@test.com", "password123", "New User");

    // Assert
    expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
    expect(authRepo.createUser).toHaveBeenCalledWith("new@test.com", "hashed_pass", "New User");
    expect(result).toHaveProperty("id", "2");
  });
});