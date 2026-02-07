import type { Request, Response } from "express"
import bcrypt from 'bcrypt';
import { users } from "../models/User.js";
import jwt from "jsonwebtoken"

export const register = async(req:Request,res:Response) => {
    try {
        
        
        const {username,email,password} = req.body;
        if(!username || !email || !password){
            return res.status(400).json({
                message : "Please fill all fields"
            })
        }

        const existingUser = await users.findOne({
            $or : [{email},{username}]
        })
        if(existingUser){
            return res.status(409).json({
                message : "Account already registered"
            })
        }

        const hashedPassword = await bcrypt.hash(password,12)

        const newUser = await users.create({
            email,
            username,
            password:hashedPassword
        });
        
        return res.status(200).json({
            message : "you have successfully registered.",
            UserId : newUser._id,
            Username : newUser.username
        })
    } catch (error) {
        console.log("Error while registering user : ", error)
        return res.status(500).json({
            message : "something went wrong"
        });
    }
}

export const login = async(req:Request,res:Response) => {
    try {
        const { username, password } = req.body;
        const user = await users.findOne({
            $or : [{email:username},{username:username}]
        })
        if(!user){
            return res.status(401).json({
                messasge : "Invalid creds"
            })
        }
        if(!(user && await bcrypt.compare(password, user.password) )){
            return res.status(401).json({
                message : "Invalid creds"
            })
        }

        const token = jwt.sign({id:user._id},process.env.JWT_PASSWORD!)

        return res.status(200).json({
            message : "you are logged in succesfully",
            token,
            user,
        })
    } catch (error) {
        console.log("error while logging in : ", error)
        return res.status(401).json({
            message : "something went wrong"
        });
    }
}