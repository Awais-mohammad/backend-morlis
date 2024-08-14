import { Router } from "express";
import adminMid from "../middlewares/admin.mid";
import multer from "multer";
import asyncHandler from "express-async-handler";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import { configCloudinary } from "../configs/cloudinary.config";
import path from 'path';
import fs from 'fs';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// const upload = multer();

router.post(
    "/",
    upload.single("image"),
    asyncHandler(async (req, res) => {
        const file = req.file;
        console.log("file received");
        if (!file) {
            res.status(HTTP_BAD_REQUEST).send("No File Uploaded!");
            return;
        }

        // Define the path to the uploads directory within the src folder
        const uploadDir = path.join(__dirname, '..', 'src', 'public', 'uploads');

        // Check if the uploads directory exists, if not, create it
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Define the path where you want to save the file
        const uploadPath = path.join(uploadDir, file.originalname);

        // Save the file locally
        fs.writeFile(uploadPath, file.buffer, (err) => {
            if (err) {
                res.status(500).send("File upload failed.");
                return;
            }

            // Send the file URL back to the client
            const imageUrl = `/uploads/${file.originalname}`;
            res.send({ imageUrl });
        });
    })
);

// router.post(
//     "/",
//     adminMid,
//     upload.single("image"),
//     asyncHandler(async (req, res) => {
//         const file = req.file;
//         if (!file) {
//             res.status(HTTP_BAD_REQUEST).send("No File Uploaded!");
//             return;
//         }

//         const imageUrl = await uploadImageToCloudinary(req.file?.buffer);
//         res.send({ imageUrl });
//     })
// );

const uploadImageToCloudinary = (imageBuffer: Buffer | undefined) => {
    const cloudinary = configCloudinary();

    return new Promise((resolve, reject) => {
        if (!imageBuffer) reject(null);

        cloudinary.uploader
            .upload_stream((error, result) => {
                if (error || !result) reject(error);
                else resolve(result.url);
            })
            .end(imageBuffer);
    });
};

export default router;
