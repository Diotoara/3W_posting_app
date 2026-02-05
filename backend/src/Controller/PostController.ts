import type { Request, Response } from "express";
import { Posts } from "../models/Post.js";

export const getAllPost = async(req:Request, res:Response) => {
    try {
        const allPosts = await Posts.find()
            .populate("user","username")
            .populate("comments.user","username")
            .sort({ createdAt:-1 })
        
        res.status(201).json(allPosts)
    } catch (error) {
        console.log("error while fetching allposts", error)
        res.status(500).json({
            message : "Error while fetching posts"
        })
    }
}

export const createPost = async(req:Request,res:Response) => {
    try {
        const {text,image} = req.body;
        if(!text && !image){
            return res.status(400).json({
                message : "post can not be empty"
            });
        }
        const newPost = await Posts.create({
            //@ts-ignore
            user: req.user.id,
            text,
            image
        });
        
        res.status(200).json({newPost})
    } catch (error) {
        console.log("eror in creting post \n", error)
        return res.status(500).json({
            message : "error while creating post"
        })
    }
}

