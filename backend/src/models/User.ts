import { model, Schema } from "mongoose"

export interface UserInter{
    username : string,
    email:string,
    password:string
}

const userSchema = new Schema<UserInter>({
    username : {
        type : String,
        required:true,
        unique:true,
        minLength:3,
    },
    email : {
        type : String,
        required:true,
        unique:true,
    },
    password : {
        type : String,
        required:true,
    }
})

export const users = model('Users', userSchema)