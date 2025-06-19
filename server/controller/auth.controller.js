import userModel from "../models/user.model.js"Add commentMore actions
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { transpoter } from "../config/nodemailer.js"


//            -------------------------------- user register controller function ----------------------------------
const register = async (req,res)=>{
    
    
    const {name,email,password} = req.body

    if(!name || !email || !password){
        return res
        .status(401)
        .json({
            success:false,
            message:"Missing Details"
        })
    }
    try {
        const existingUser = await userModel.findOne({
            $or:[{ email }, { name } ]
        })
        if (existingUser) {
            return res
            .status(401)
            .json({success:false,message:"User already exists"})
        }

        const hashPassword = await bcrypt.hash(password,10);
        const user = new userModel({name,email,password:hashPassword});
        await user.save();
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})
        res.cookie('token',token,{
            httpOnly:true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === "production",
            sameSite:process.env.NODE_ENV === "production" ? "none" : "strict"
        })
        // sending welcome email 

        const emailOptions = {
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:"Welcome to Our Websits",
            text:`welcome to our websits. Your account has been created with email id:${email}`
        }
        await transpoter.sendMail(emailOptions);        
        return res.json({success:true});

    } catch (error) {
        res
        .status(401)
        .json({success:false,message:error.message})
        
    }
}
const login = async (req,res)=>{
    const {email,password} = req.body
    try {
        if (!email || !password) {
            return res
            .status(401)
            .json({
                success:false,
                message:"email and password are required"
            })
        }
        const user = await  userModel.findOne({email})
        if (!user) {
            return res
            .status(401)
            .json({
                success:false,
                message:"invalid email"
            })
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if (!isMatch) {
            return res
            .status(401)
            .json({
                success:false,
                message:"wrong password"
            })
            
        }

        const token =   jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})
        res.cookie('token',token,{
            httpOnly:true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === "production",
            sameSite:process.env.NODE_ENV === "production" ? "none" : "strict"
        })
        return res.json({success:true})
        
    } catch (error) {
        return res
        .status(400)
        .json({
            success:false,
            message:"ok",
        })
        
    }
}

const logout = async (req,res)=>{
    try {
        res.clearCookie("token",{
            httpOnly:true,
            secure: process.env.NODE_ENV === "production",
            sameSite:process.env.NODE_ENV === "production" ? "none" : "strict"
        })
        return res.json({
            success:true,
            message:"user is logout"
        })
        
    } catch (error) {
        return res
        .status(401)
        .json({success:false,message:error.message})
    }
}

const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body; 

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required"
            });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isAccountVerified) {
            return res.json({
                success: false,
                message: "Account already verified"
            });
        }

        const otp = String(Math.floor(100000 + Math.random() * 90000));
        

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 60 * 60 * 1000;
        await user.save();

        const emailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP",
            text: `Your OTP is ${otp}. Verify your account using this OTP.`,
            
        };
        await transpoter.sendMail(emailOptions);

        return res.json({
            success: true,
            message: "OTP sent to your email."
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const verifyEmail = async (req,res)=>{
    const {userId,otp} = req.body

    if (!userId || !otp ) {
        return res
        .status(401)
        .json({
            success:false,
            message:"missing deatils"
        })
    }
    try {
        const user = await userModel.findById(userId)

        if (!user) {
            return res
            .status(401)
            .json({
                success:false,
                message:"User not found"
            })
        }
        if (user.verifyOtp === "" ||user.verifyOtp !== otp ){
            return res
            .status(401)
            .json({
                success:false,
                message:"Invalid OTP"
            })
        }
        if (user.verifyOtpExpireAt< Date.now()) {
            return res.json({
                success:false,
                message:"OTP Expired"
            })
        }
        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpireAt = 0;
        await user.save()
        return res.json({
            success:true,
            message:"email verified Successfully"
        })
        } 
        catch (error) {
            return res
        .status(401)
        .json({success:false,message:error.message})
        }

}

const isAuthenticated = async (req,res)=>{
    try {
        return res.json({
            success:true
        })
        
    } catch (error) {
        return res
        .status(401)
        .json({success:false,message:"user not login"})
    }
}

const sendResetOtp = async (req,res)=>{
    const { email } = req.body
    if(!email){
        return res.status(400).json({
            success:false,
            message:"email is requried"
        })
    }
    try {
        const user = await userModel.findOne({email})
        if (!user) {
            return res.status(401).json({
                success:false,
                message:"user not found"
            })
        }

        const otp = String(Math.floor(100000 + Math.random() * 90000));
        

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 5 *60 * 1000;
        await user.save();

        const emailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            text: `Your OTP is ${otp}. Reset your password using this OTP.`
        };
        await transpoter.sendMail(emailOptions);
        return res.json({
            success:true,
            message:"OTP send to your email"
        })
        
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error.message
        })
        
    }
}

const resetPassword = async (req,res)=>{
    const { email ,otp , newPassword} = req.body
    if (!email || !otp || !newPassword) {
        return res.status(400).json({
            success:false,
            message:"Email Otp and new password are required  "
        })
    }
    try {
            const user = await userModel.findOne({email})
            
            
            if (!user) {
                return res.status(401).json({
                    success:false,
                    message:"user not found"
                })
            }
            if(user.resetOtp === "" || user.resetOtp !== otp){
                return res.status(401).json({
                    success:false,
                    message:"Invalid OTP"
                })
            }

            if(user.resetOtpExpireAt < Date.now()){
                return res.status(401).json({
                    success:false,
                    message:"Expired OTP"
                })
            }
            const hashPassword = await bcrypt.hash(newPassword,10)
            
            
            user.password = hashPassword;
            user.resetOtp = "";
            user.resetOtpExpireAt = 0;
            user.save();
            return res.json({
                success:true,
                message:"Password has been reset successfully"
            })
        } catch (error) {
            return res.status(400).json({
                success:false,
                message:"Failed to reset password"
                
            })
            
        }

}
export {
    register,
    login,
    logout,
    sendVerifyOtp,
    verifyEmail,
    isAuthenticated,
    sendResetOtp,
    resetPassword
}