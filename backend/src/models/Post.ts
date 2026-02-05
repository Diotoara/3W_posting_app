import  { model, Schema } from "mongoose";

export interface commentInt{
    user : Schema.Types.ObjectId,
    text: string,
}

export interface PostInterface { 
    user : Schema.Types.ObjectId,
    text? : string,
    image? : string,
    likes : Schema.Types.ObjectId[],
    comments : commentInt[],
    createdAt? : Date
}


const PostSchema = new Schema<PostInterface>({
    user : {
        type : Schema.Types.ObjectId,
        ref : 'Users',
        required:true
    },
    text : String,
    image : String,
    likes : [
        {
            type : Schema.Types.ObjectId,
            ref:'Users'
        
        }
    ],
    comments : [
        {
            user : {
                type : Schema.Types.ObjectId,
                ref:'Users',
                required:true,
            },
            text : {
                type:String,
                required:true,
            }
        }
    ]
},{timestamps:true})

export const Posts = model('Posts',PostSchema)