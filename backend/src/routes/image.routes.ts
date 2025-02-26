import { Hono } from "hono";
import { encodeBase64 } from "hono/utils/encode";
import { Bindings } from "../bindings";
import { getCookie } from "hono/cookie";

const imageRouter = new Hono<{ Bindings: Bindings }>();

const ALLOWED_FORMATS = ["jpg", "png", "webm", "jpeg", "gif", "heic", "webp"];
// Universal Upload-Handler
imageRouter.post("/upload/image/:folder", async (c) => {
  try {
    const body = await c.req.parseBody();
    const image = body["image"] as File;
    const folder = c.req.param("folder");

    if (!image) {
      return c.json({ message: "No image provided" }, 400);
    }

    // Check format
    const extension = image.name.split(".").pop()?.toLowerCase();
    if (!extension || !ALLOWED_FORMATS.includes(extension)) {
      return c.json({ message: `Invalid file format: ${extension}` }, 400);
    }

    // Check foldername
    if (!["avatar", "pattern"].includes(folder)) {
      return c.json({ message: "Invalid folder" }, 400);
    }

    // Convert to Base64 & upload to Cloudinary via fetch
    const byteArrayBuffer = await image.arrayBuffer();
    const base64 = encodeBase64(byteArrayBuffer);

    // Prepare FormData for the upload
    const formData = new FormData();
    formData.append("file", `data:image/${extension};base64,${base64}`);
    formData.append(
      "upload_preset",
      c.env.CLOUDINARY_PRESET || "default_preset" // Ensure this variable is correct
    );
    formData.append(
      "folder",
      folder === "avatar" ? "SewDB/avatar" : "SewDB/pattern" // ⬅️ Choose folder
    );

    // Use fetch for Cloudinary upload
    const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${c.env.CLOUDINARY_NAME}/image/upload`;
    const response = await fetch(cloudinaryUploadUrl, {
      method: "POST",
      body: formData,
    });

    const uploadResponse = (await response.json()) as any;

    console.error("Cloudinary Upload Error:", uploadResponse);
    if (!response.ok) {
      throw new Error(
        uploadResponse.error?.message || "Unknown Cloudinary error"
      );
    }

    return c.json({ url: uploadResponse.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    return c.json({ message: "Upload failed", error: errorMessage }, 500);
  }
});

export default imageRouter;
