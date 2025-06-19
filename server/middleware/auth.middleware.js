import jwt from 'jsonwebtoken'


export const userAuth = async (req,res,next)=>{
    const {token} = req.cookies;
    

    if(!token){
        return res
        .status(401)
        .json({
            success:true,
            message:"Not Authirzed. Login Again"
        })
    }

    try {
        const tokenDecode = jwt.verify(token,process.env.JWT_SECRET)
        

        if (tokenDecode.id) {
            req.body.userId = tokenDecode.id
            
        } else{
            return res
        .status(401)
        .json({success:false,message:"api error"})
        }
        next()
        
    } catch (error) {
        return res
        .status(401)
        .json({success:false,message:error.message})
    }
}