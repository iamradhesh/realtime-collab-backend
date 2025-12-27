import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { createServer } from "http";
import { Server } from "socket.io";
import { io as Client, Socket as ClientSocket } from "socket.io-client";
import { setupSocketHandlers } from "./socket.handler.js";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

describe("Collaboration WebSocket Integration", () => {
  let io: Server, serverSocket: any, clientSocket: ClientSocket;
  let port: number;

  beforeAll(() => {
    return new Promise((resolve) => {
      const httpServer = createServer();
      io = new Server(httpServer);
      setupSocketHandlers(io);
      httpServer.listen(() => {
        port = (httpServer.address() as any).port;
        resolve();
      });
    });
  });

  afterAll(() => {
    io.close();
  });

  it("should block connection without a valid token", (done) => {
    const badClient = Client(`http://localhost:${port}`, {
      auth: { token: "invalid-token" }
    });

    badClient.on("connect_error", (err) => {
      expect(err.message).toBe("Invalid token");
      badClient.disconnect();
      done();
    });
  });

  it("should allow connection and broadcast 'user-joined'", (done) => {
    const token = jwt.sign({ userId: "user_1" }, env.JWT_ACCESS_SECRET);
    const projectId = "project_123";

    // Client 1 (The observer)
    const client1 = Client(`http://localhost:${port}`, { auth: { token } });
    
    client1.on("connect", () => {
      client1.emit("join-project", projectId);

      // Client 2 joins later
      const client2 = Client(`http://localhost:${port}`, { auth: { token } });
      
      client1.on("user-joined", (data) => {
        expect(data.userId).toBe("user_1");
        client1.disconnect();
        client2.disconnect();
        done();
      });

      client2.on("connect", () => {
        client2.emit("join-project", projectId);
      });
    });
  });

  it("should broadcast 'file-updated' to others in the room", (done) => {
    const token = jwt.sign({ userId: "user_1" }, env.JWT_ACCESS_SECRET);
    const projectId = "project_123";
    const fileUpdate = { projectId, fileId: "file_1", content: "const x = 10;" };

    const client1 = Client(`http://localhost:${port}`, { auth: { token } });
    const client2 = Client(`http://localhost:${port}`, { auth: { token } });

    client1.on("connect", () => {
      client1.emit("join-project", projectId);
      
      client2.on("connect", () => {
        client2.emit("join-project", projectId);

        client2.on("file-updated", (data) => {
          expect(data.content).toBe(fileUpdate.content);
          client1.disconnect();
          client2.disconnect();
          done();
        });

        // Trigger the update from client 1
        setTimeout(() => {
          client1.emit("file-change", fileUpdate);
        }, 50);
      });
    });
  });
});