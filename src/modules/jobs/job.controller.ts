import { Request, Response } from "express";
import * as jobService from "./job.service.js"

export const handleJobRequest = async (req: Request, res: Response) => {
  const { type, payload } = req.body;
  const userId = req.user!.userId;
  
  const job = await jobService.queueNewJob(userId, type, payload);
  res.status(202).json({ message: "Job accepted", jobId: job.id });
};