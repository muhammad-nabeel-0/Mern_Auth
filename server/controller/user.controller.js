import userModel from "../models/user.model.js";


export const getUserData = async(req,res)=>{
    try {
        const userId = req.user.id

        
        
        

        const user = await userModel.findById(userId)
        
        
        if (!user) {
            return res
        .status(400)
        .json({
            success:false,
            message:"user not found"
        })
        }
        return res.json({
            success:true,
            userData:{
                name:user.name,
                isAccountVerified:user.isAccountVerified
            }
        })
        
    } catch (error) {
        return res
        .status(400)
        .json({
            success:false,
            message:"Error is here"
        })
        
    }
}