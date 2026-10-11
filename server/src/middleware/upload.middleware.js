import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine if it's an image or a PDF
    let folderName = "solace_novels";
    let resourceType = "auto"; // 'auto' handles images and raw files like PDFs

    if (file.mimetype === "application/pdf") {
      resourceType = "raw"; // Store PDFs as raw assets on Cloudinary
    }

    return {
      folder: folderName,
      resource_type: resourceType,
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

export const upload = multer({
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit for PDFs
});
