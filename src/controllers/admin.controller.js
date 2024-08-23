import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import{ User} from "../models/user.model.js"

const getAllUsers = asyncHandler ( async (req,res) => {

    try {
        const users = await User.find({},{password:0})
    
        if (!users || users.length ===0 ) {
            throw new ApiError(200 , "User not found")
        }
    
        return res.status(200).json(new ApiResponse(200, [users] , "success"))
    } catch (error) {
        throw new ApiError(500,[error] ,"success" )
    }
} )

export {getAllUsers}