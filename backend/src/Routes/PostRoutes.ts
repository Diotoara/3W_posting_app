import {Router} from "express"
import { createPost, getAllPost } from "../Controller/PostController.js";
import { authCheck } from "../middleware/authCheck.js";
import { addComment, toggleLike } from "../Controller/TouchPost.js";

const router = Router();

router.get("/",getAllPost);
router.post("/create",authCheck,createPost);
router.patch("/like/:postId", authCheck, toggleLike)
router.patch("/comment/:postId", authCheck, addComment)


export default router