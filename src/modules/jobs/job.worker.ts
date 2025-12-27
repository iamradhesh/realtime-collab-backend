//THIS IS CONSUMER:-

import { getRabbitChannel } from "../../utils/rabbitmq.js";
import * as jobRepo from "./job.repository.js";

export const startWorker = async () => {
  const channel = getRabbitChannel();
  const queue = "job_queue";

  // FIX: Ensure the queue exists before trying to consume from it
  await channel.assertQueue(queue, { 
    durable: true 
  });

  // Optional: Set prefetch to 1 so the worker only handles one job at a time
  // This is a standard "Fair Dispatch" practice in RabbitMQ
  channel.prefetch(1);

  console.log("👷 Worker started, waiting for jobs...");

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      try {
        const content = JSON.parse(msg.content.toString());
        const { jobId } = content;

        await jobRepo.updateJobStatus(jobId, 'PROCESSING');
        
        // Simulate task
        console.log(`Processing job: ${jobId}`);
        await new Promise(resolve => setTimeout(resolve, 3000)); 

        await jobRepo.updateJobStatus(jobId, 'COMPLETED', "Execution successful");
        
        channel.ack(msg); 
      } catch (error) {
        console.error("Job processing failed:", error);
        // nack(message, allUpTo, requeue)
        channel.nack(msg, false, true); 
      }
    }
  });
};