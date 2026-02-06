import type { Request, Response } from "express";
import { Posts } from "../models/Post.js";

export const toggleLike = async(req:Request,res:Response)=>{
    try {
        const {postId} = req.params;
        const userId = (req as any).user.id;

        const post = await Posts.findById(postId);
        if(!post) return res.status(404).json({ message : "Post Not found" });

        const isLiked = post.likes.some((id:any)=> id.toString() === userId );
        if(isLiked){
            post.likes = post.likes.filter((id:any)=>id.toString() !== userId );
        } else {
            post.likes.push(userId);
        }

        await post.save();
        
        // FIX: Re-populate before sending response
        const populatedPost = await post.populate([
            { path: 'user', select: 'username' },
            { path: 'comments.user', select: 'username' }
        ]);

        res.status(200).json(populatedPost);
    } catch (error) {
        res.status(500).json({message:"Error toggling like."});
    }
}

export const addComment = async(req:Request, res:Response) => {
    try {
        const {postId} = req.params;
        const {text} = req.body;
        const userId = (req as any).user.id;

        const post = await Posts.findById(postId);
        if(!post) return res.status(404).json({message: "Post not found"});

        post.comments.push({ text, user: userId });
        await post.save();

        // FIX: Re-populate before sending response
        const populatedPost = await post.populate([
            { path: 'user', select: 'username' },
            { path: 'comments.user', select: 'username' }
        ]);

        res.status(201).json(populatedPost);
    } catch (error) {
        return res.status(500).json({ message : "Error adding comment" });
    }
}