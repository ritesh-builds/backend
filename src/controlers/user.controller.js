import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { user } from "../models/user.model.js"; // Changed User to user
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // 1. Get user details from frontend
    const { fullName, email, userName, password } = req.body

    // 2. Validation - not empty
    if (
        [fullName, email, userName, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are compulsory or required.")
    }

    // 3. Check if user already exists (Added await here)
    const existedUser = await user.findOne({
        $or: [{ userName }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or userName already exists.")
    }

    // 4. Check for images, check for avatar
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverimageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required.")
    }

    // 5. Upload them to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverimageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required.")
    }

    // 6. Create user object - create entry in db
    const newUser = await user.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        userName: userName.toLowerCase()
    })

    // 7. Remove password and refresh token field from response
    const createdUser = await user.findById(newUser._id).select(
        "-password -refreshToken"
    )

    // 8. Check for user creation
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    // 9. Return response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully.")
    )
})

export { registerUser }


 // 1. Get user details from frontend
// 2. Validation - not empty
// 3. Check if user already exists (Added await here)
// 4. Check for images, check for avatar
// 5. Upload them to cloudinary
// 6. Create user object - create entry in db
// 6. Create user object - create entry in db
// 7. Remove password and refresh token field from response
// 8. Check for user creation
// 9. Return response