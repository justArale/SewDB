import { v2 as cloudinary, ConfigOptions } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer, { Multer } from "multer";

// Ensure environment variables are set
if (
  !process.env.CLOUDINARY_NAME ||
  !process.env.CLOUDINARY_KEY ||
  !process.env.CLOUDINARY_SECRET
) {
  throw new Error("Cloudinary environment variables are not set");
}

// Cloudinary-Konfiguration
const cloudinaryConfig: ConfigOptions = {
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
};

cloudinary.config(cloudinaryConfig);

// Pattern Storage für Cloudinary
const patternStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    allowed_formats: ["jpg", "png", "webm", "jpeg", "gif", "heic", "webp"],
    folder: "SewDB/pattern",
  },
});

// Avatar Storage für Cloudinary
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    allowed_formats: ["jpg", "png", "webm", "jpeg", "gif", "heic", "webp"],
    folder: "SewDB/avatar",
  },
});

// Multer-Instanzen für Uploads
const patternUploader: Multer = multer({ storage: patternStorage });
const avatarUploader: Multer = multer({ storage: avatarStorage });

export default {
  patternUploader,
  avatarUploader,
};
