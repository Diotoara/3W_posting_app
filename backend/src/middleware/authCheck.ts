//checks jwt
//attach user verification to jwt
//sends back user.

import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

export const authCheck = (req:Request,res:Response,next:NextFunction) => {
    const jwtToken = req.headers.authorization?.split(" ")[1]
    if(!jwtToken){
        return res.status(401).json({
            message : "You are not Authorized"
        });
    }
    try {
        const decoded = jwt.verify(jwtToken,process.env.JWT_PASSWORD!)
        //@ts-ignore
        req.user = decoded; 
        next();
    } catch (error) {
        console.log("error in authcheck middleware \n", error)
        return res.status(500).json({
            message : "Token failed"
        })
    }
}