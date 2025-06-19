import { Router } from "express";
import { userAuth } from "../middleware/auth.middleware.js";
import { getUserData } from "../controller/user.controller.js";
import { userDataAuth } from "../middleware/user.middleware.js";


const userDataRouter = Router()

userDataRouter.route("/data").get(userDataAuth,getUserData)

export  {
    userDataRouter
} 