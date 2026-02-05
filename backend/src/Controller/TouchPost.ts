import type { Request, Response } from "express";
import { Posts } from "../models/Post.js";


export const toggleLike = async(req:Request,res:Response)=>{
    try {
        const {postId} = req.params;
        //@ts-ignore
        const userId = req.user.id

        const post = await Posts.findById(postId);
        if(!post){
            return res.status(404).json({
                message : "Post Not found"
            })
        }

        const isLiked = post.likes.some((id:any)=> id.toString()  === userId )

        if(isLiked){
            post.likes = post.likes.filter((id:any)=>id.toString() !== userId );
        } else{
            post.likes.push(userId)
        }

        await post.save();
        res.status(200).json(post)

    } catch (error) {
        res.status(500).json({message:"Error toggling like."})
    }
}

export const addComment = async(req:Request, res:Response) => {
    try {
        const {postId} = req.params;
        const {text} = req.body;
        //@ts-ignore
        const userId = req.user.id;

        const post = await Posts.findById(postId);
        if(!post){
            return res.status(404).json({message: "Post not found"})
        }

        post.comments.push({
            text,
            user:userId
        })
        await post.save()
        res.status(201).json(post);

    } catch (error) {
        console.log("Eror in commen addin\n",error)
        return res.status(500).json({
            message : "Error adding comment"
        })
    }
}