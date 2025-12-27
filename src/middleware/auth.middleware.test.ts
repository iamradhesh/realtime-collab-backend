import { describe, it, expect, vi } from "vitest";
import { authenticate } from "./auth.middleware.js";
import jwt from "jsonwebtoken";

describe("Auth Middleware", () => {
  it("should return 401 if no Token is provided", () => {
    const req = { headers: {} } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
    const next = vi.fn();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});