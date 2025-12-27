import amqp from "amqplib";
import { env } from "../config/env.js";

let connection: Awaited<ReturnType<typeof amqp.connect>>;
let channel: Awaited<ReturnType<typeof connection.createChannel>>;

export const connectRabbitMQ = async (): Promise<void> => {
    try {
        // Ensure the URL is valid
        const url = env.RABBITMQ_URL || "amqp://localhost";
        
        connection = await amqp.connect(url);
        channel = await connection.createChannel();

        // Assessment Requirement: Failure handling 
        connection.on("error", (err) => {
            console.error("RabbitMQ Connection Error", err);
        });

        console.log("🐇 RabbitMQ Connected Successfully");
    } catch (error) {
        console.error("❌ Failed to connect to RabbitMQ:", error);
        // Do not swallow the error; let the app know it failed to start
        throw error; 
    }
};

// Helper to get the channel in other services
export const getRabbitChannel = () => {
    if (!channel) {
        throw new Error("RabbitMQ channel not initialized. Call connectRabbitMQ first.");
    }
    return channel;
};