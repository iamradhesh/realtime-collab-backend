import { createServer } from "http"; // Required for Socket.io
import { Server } from "socket.io";
import app from "./app.js";
import { env } from "./config/env.js";
import { initDB } from "./utils/initDB.js";
import { connectRabbitMQ } from "./utils/rabbitmq.js"; // Your RabbitMQ helper
import { setupSocketHandlers } from "./modules/collaboration/socket.handler.js";
import { startWorker } from "./modules/jobs/job.worker.js"; // Your RabbitMQ worker

const startServer = async () => {
  try {
    // 1. Initialize Databases (PostgreSQL)
    await initDB();

    // 2. Initialize Message Broker (RabbitMQ)
    await connectRabbitMQ();
    
    // 3. Start the Background Worker (Consumes jobs from RabbitMQ)
    await startWorker();

    // 4. Create HTTP Server & Attach Socket.io
    const httpServer = createServer(app);
    const io = new Server(httpServer, {
      cors: {
        origin: "*", // Adjust this based on your frontend URL
        methods: ["GET", "POST"]
      }
    });

    // 5. Initialize Real-Time Collaboration Handlers
    setupSocketHandlers(io);

    // 6. Start listening on the HTTP Server (not app.listen)
    httpServer.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT}`);
      console.log(`📡 WebSocket server initialized`);
      console.log(`👷 RabbitMQ Worker active`);
    });

  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
};

startServer();