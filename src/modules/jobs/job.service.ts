//THIS IS PRODUCER:-


import { getRabbitChannel } from "../../utils/rabbitmq.js";
import * as jobRepo from "./job.repository.js"

export const queueNewJob = async(userId:string,type:string,payload:any)=>{
    // 1. Create entry in PostgreSQL
    const job = await jobRepo.createJobRecord(userId,type);

    // 2. Push to RabbitMQ:-
    const channel = getRabbitChannel();
    const queue = "job_queue";

    const message = JSON.stringify({
        jobId:job.id,
        userId,
        payload
    });

    channel.sendToQueue(queue,Buffer.from(message),{
        persistent:true // Mark messages as persistent for reliability
    });
    return job;
}