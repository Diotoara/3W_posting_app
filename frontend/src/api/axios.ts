import axios from "axios";

const APP_URI = import.meta.env.VITE_BACKEND_SERVER

const API = axios.create({baseURL:APP_URI})

API.interceptors.request.use( (req) => {
    const token = localStorage.getItem("token");
    if(token){
         req.headers.Authorization = `Bearer ${token}`
    }
    return req;
} )

export const signUp = (data:any) => API.post("/auth/register", data)
export const signIn = (data:any) => API.post("/auth/login", data)

export const getPosts = (page: number, limit: number) => API.get(`/posts?page=${page}&limit=${limit}`);
export const createPost = (data:any) => API.post("/posts/create",data);
export const like = (id:String) => API.patch(`/posts/like/${id}`)
export const comment = (id:String, text:String) => API.patch(`/posts/comment/${id}`, {text})