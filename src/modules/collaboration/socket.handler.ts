import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

export const setupSocketHandlers = (io: Server) => {
  // Middleware: Verify JWT before allowing connection [cite: 31, 100]
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));

    try {
      const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as { userId: string };
      (socket as any).userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = (socket as any).userId;
    console.log(`👤 User connected: ${userId}`);

    // Join a Project Room 
    socket.on("join-project", (projectId: string) => {
      socket.join(projectId);
      // Broadcast to others that a user joined
      socket.to(projectId).emit("user-joined", { userId });
      console.log(`📂 User ${userId} joined project: ${projectId}`);
    });

    // File Change Events (Mocked Payload) 
    socket.on("file-change", (data: { projectId: string; fileId: string; content: string }) => {
      // Broadcast file updates to everyone in the project room except the sender
      socket.to(data.projectId).emit("file-updated", {
        fileId: data.fileId,
        content: data.content,
        updatedBy: userId
      });
    });

    socket.on("disconnect", () => {
      console.log(`👤 User disconnected: ${userId}`);
    });
  });
};