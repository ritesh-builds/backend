import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async function (localFilePath) {
    if (!localFilePath) return null;

    try {
        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });

        // file has been uploaded successfully.
        console.log("File is uploaded successfully on cloudinary.", uploadResult.url);
        return uploadResult;
    } catch (error) {
        return null;
    } finally {
        // remove the locally saved temporary file if it exists
        try {
            if (fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
            }
        } catch (cleanupError) {
            // Best-effort cleanup; ignore errors here
        }
    }
};



export { uploadOnCloudinary };
    
    
