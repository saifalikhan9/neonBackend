import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const adminAuth = asyncHandler( async (req, res ,next)=>{

    try {
        console.log(req.user);
        
        const admin = req.user.isAdmin
        if (!admin) {
            throw new ApiError(403 , "user not admin")
        }
        next();
    } catch (error) {
        next(error)
    }
}) 

export default adminAuth