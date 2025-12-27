import { sql } from "../../utils/db.js"


export const createJobRecord = async(userId:string,type:string)=>{
    const [job] = await sql`
        INSERT INTO jobs (user_id,type,status)
        VALUES (${userId},${type},'PENDING')
        RETURNING *
    `;
    return job;
};

export const updateJobStatus = async (jobId:string,status:string,result?:string)=>{
    return await sql`
    UPDATE jobs 
    SET status = ${status}, result = ${result || null}, updated_at = NOW()
    WHERE id = ${jobId}
  `;
}