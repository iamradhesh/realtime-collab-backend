import { describe, it, expect, vi, beforeEach } from "vitest";
import * as projectService from "./project.service.js";
import * as projectRepo from "./project.repository.js";
import { redis } from "../../utils/redis.js";

// Mock the Repo and Redis
vi.mock("./project.repository.js");
vi.mock("../../utils/redis.js", () => ({
  redis: {
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
  },
}));

describe("Project Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("listUserProjects", () => {
    it("should return cached data from Upstash if it exists", async () => {
      const mockProjects = [{ id: "1", name: "Cached Project" }];
      (redis.get as any).mockResolvedValue(JSON.stringify(mockProjects));

      const result = await projectService.listUserProjects("user-1");

      expect(result).toEqual(mockProjects);
      expect(redis.get).toHaveBeenCalledWith(expect.stringContaining("user_projects"));
      expect(projectRepo.getProjectsForUser).not.toHaveBeenCalled(); // DB is skipped!
    });

    it("should fetch from DB and update Upstash on a cache miss", async () => {
      const mockProjects = [{ id: "2", name: "DB Project" }];
      (redis.get as any).mockResolvedValue(null); // Cache is empty
      (projectRepo.getProjectsForUser as any).mockResolvedValue(mockProjects);

      const result = await projectService.listUserProjects("user-1");

      expect(result).toEqual(mockProjects);
      expect(redis.set).toHaveBeenCalled(); // Ensure cache is populated
    });
  });
});