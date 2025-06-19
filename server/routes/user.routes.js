import { Router } from "express";
import { register,login,logout,verifyEmail,sendVerifyOtp,isAuthenticated,
resetPassword,sendResetOtp} 
from "../controller/auth.controller.js";
import { userAuth } from "../middleware/auth.middleware.js";
import { userDataAuth } from "../middleware/user.middleware.js";

const router = Router()
router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").post(logout)
router.route("/send-verify-otp").post(userAuth,sendVerifyOtp)
router.route("/verify-account").post(userAuth,verifyEmail)
router.route("/is-auth").get(userDataAuth,isAuthenticated)
router.route("/reset-password").post(userAuth,resetPassword)
router.route("/send-reset-otp").post(userAuth,sendResetOtp)

export default router