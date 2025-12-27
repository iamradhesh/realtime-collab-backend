import { Request,Response } from "express";
import { loginUser, refreshAccessToken, registerUser } from "./auth.service.js";



export const register = async(req:Request,res:Response)=>{
    const {email,password,name} = req.body;

    if(!email || !password)
    {
        return res.status(400).json({
            message:"Email and Password required"
        });
    }

    const user = await registerUser(email,password,name);

    res.status(201).json({
        message:"User Registered Successfully",
        user
    });

};

export const login = async(req:Request,res:Response)=>{
    const {email,password} = req.body;

    if(!email || !password)
    {
        return res.status(400).json({ message: "Email and password required" });
    }

    const tokens = await loginUser(email,password);
    res.json(tokens);
};

export const handleRefreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const tokens = await refreshAccessToken(refreshToken);
    res.status(200).json(tokens);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};