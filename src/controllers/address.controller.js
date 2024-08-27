import { Address } from '../models/address.model.js';
import { User } from '../models/user.model.js'; // Assuming you have a User model
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


// Create a new address
 const createAddress = async (req, res) => {
  try {
    const {  addressLine, city, state, postalCode, country } = req.body;

    // Create new address
    const newAddress = new Address({
      userId: req.user._id,
      addressLine,
      city,
      state,
      postalCode,
      country,
    });

    await newAddress.save();

    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { addresses: newAddress._id } }, // Push the new address ID to the user's addresses array
      { new: true }
    );

    return res.json(new ApiResponse(200, newAddress,"Address has been saved successfully"));
  } catch (error) {
    throw new ApiError(500, error, "server error");
    
  }
};

// Edit an existing address
 const editAddress = async (req, res) => {
  try {
    const { id } = req.params; // Assuming address ID is passed as a URL parameter
    const { addressLine, city, state, postalCode, country } = req.body;

    // Find the address by ID and update it
    const updatedAddress = await Address.findByIdAndUpdate(
      id,
      {
        addressLine,
        city,
        state,
        postalCode,
        country,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: updatedAddress,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error updating address',
      error: error.message,
    });
  }
};

// Get all addresses for a user
const getAllAddresses = asyncHandler(async (req, res) => {

const id=req.user.id

  const address = await Address.find({userId: id})
  if (address.length===0) {
    console.log("no address found please add new");
    
    
  }
  return res.json(new ApiResponse(200, address, " Current User"));
  
});


// Delete an address
 const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params; // Assuming address ID is passed as a URL parameter

    // Find and delete the address
    const deletedAddress = await Address.findByIdAndDelete(id);

    if (!deletedAddress) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error deleting address',
      error: error.message,
    });
  }
};

export {deleteAddress,getAllAddresses,editAddress,createAddress}