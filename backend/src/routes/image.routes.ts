import { Hono } from "hono";
import { Bindings } from "../bindings";
import { eq } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { patterns } from "../db/schema";
import crypto from "crypto";

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

    // Signature for cloudinary
    const timestamp = Math.floor(Date.now() / 1000);
    const folderPath = `SewDB/${folder}`;
    const stringToSign = `folder=${folderPath}&timestamp=${timestamp}${c.env.CLOUDINARY_SECRET}`;
    const signature = crypto
      .createHash("sha1")
      .update(stringToSign)
      .digest("hex");

    // Prepare formData for the upload
    const formData = new FormData();
    formData.append("file", image); // Direkt die Datei senden (kein Base64 notwendig)
    formData.append("timestamp", String(timestamp));
    formData.append("api_key", String(c.env.CLOUDINARY_KEY));
    formData.append("signature", signature);
    formData.append("folder", folderPath);

    // Use Cloudinary-Upload-URL
    const cloudinaryUploadUrl = `https://api.cloudinary.com/v1_1/${c.env.CLOUDINARY_NAME}/image/upload`;
    const response = await fetch(cloudinaryUploadUrl, {
      method: "POST",
      body: formData,
    });

    const uploadResponse = (await response.json()) as any;

    if (!response.ok) {
      console.error("Cloudinary Upload Error:", uploadResponse);
      throw new Error(
        uploadResponse.error?.message || "Unknown Cloudinary error"
      );
    }

    return c.json({ url: uploadResponse.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    return c.json(
      {
        message: "Upload failed",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      500
    );
  }
});

// Delete-Handler
imageRouter.delete("/delete/image/:folder/:imageId", async (c) => {
  try {
    const sql = neon(c.env.DATABASE_URL);
    const db = drizzle(sql);
    const folder = c.req.param("folder");
    const imageId = `SewDB/${folder}/${c.req.param("imageId")}`;
    const id = Number(c.req.param("id"));

    // Signature for cloudinary
    const timestamp = Math.floor(Date.now() / 1000);
    const stringToSign = `public_id=${imageId}&timestamp=${timestamp}${c.env.CLOUDINARY_SECRET}`;
    const signature = crypto
      .createHash("sha1")
      .update(stringToSign)
      .digest("hex");

    // Cloudinary DELETE via POST-Request
    const formData = new FormData();
    formData.append("public_id", imageId);
    formData.append("timestamp", String(timestamp));
    formData.append("api_key", String(c.env.CLOUDINARY_KEY));
    formData.append("signature", signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${c.env.CLOUDINARY_NAME}/image/destroy`,
      {
        method: "POST", // Cloudinary requires POST for deletion
        body: formData,
      }
    );

    const deleteResponse = (await response.json()) as any;
    if (!response.ok) {
      throw new Error(
        deleteResponse.error?.message || "Unknown Cloudinary error"
      );
    }

    if (deleteResponse.result === "not found") {
      return c.json({ message: "Image not found or already deleted" }, 404);
    }

    return c.json({
      message: "Image deleted successfully",
      updatePattern: "Pattern successfully updated",
    });
  } catch (err) {
    console.error("Error deleting image:", err);
    return c.json({ message: "Delete failed", error: err }, 500);
  }
});

export default imageRouter;
