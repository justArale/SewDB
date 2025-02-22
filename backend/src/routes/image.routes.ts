import { Hono } from "hono";
import { Bindings } from "../bindings";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import patternUploader from "../cloudinary/cloudinary";
import avatarUploader from "../cloudinary/cloudinary";
import { isAuthenticated } from "../../middleware/jwt.middleware";
import { users, patterns } from "../db/schema";
//import { Multer } from "multer";

const imageRouter = new Hono<{ Bindings: Bindings }>();

// Middleware für `multer` in Hono umwandeln
// const multerMiddleware = (uploader: Multer) => {
//   return async (c, next) => {
//     await new Promise<void>((resolve, reject) => {
//       uploader.single("file")(c.req.raw, {} as any, (err) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve();
//         }
//       });
//     });
//     await next();
//   };
// };

// Upload-Route für Patterns
imageRouter.post(
  "/upload-pattern-image",
  patternUploader.single("file"),
  async (c) => {
    const file = (c.req.raw as any).file;

    if (!file) {
      return c.json({ error: "No file uploaded!" }, 400);
    }

    return c.json({ fileUrl: file.path });
  }
);

// // Route for uploading pattern image
// imageRouter.post(
//   "/upload-pattern-image",
//   isAuthenticated,
//   patternUploader.single("file"),
//   (c) => {
//     console.log("file is: ", req.file);

//     if (!req.file) {
//       next(new Error("No file uploaded!"));
//       return;
//     }

//     res.json({ fileUrl: req.file.path });
//   }
// );

// imageRouter.post(
//   "/upload-avatar",
//   isAuthenticated,
//   avatarUploader.single("file"),
//   (c) => {
//     console.log("file is: ", req.file);

//     if (!req.file) {
//       next(new Error("No file uploaded!"));
//       return;
//     }

//     res.json({ fileUrl: req.file.path });
//   }
// );

// // Route for deleting a recipe image
// imageRouter.delete(
//   "/delete-pattern-image/:publicId/:patternId",
//   isAuthenticated,
//   async (c) => {
//     const { publicId, patternId } = c.params;

//     try {
//       // Delete image from cloudinary
//       await cloudinary.uploader.destroy(`SewDB/pattern/${publicId}`);

//       // Update the user document in the database to remove the reference to the avatar
//       const updatedPattern = await Pattern.findByIdAndUpdate(
//         patternId,
//         { image: "" },
//         { new: true }
//       );

//       if (!updatedPattern) {
//         return res.status(404).json({ error: "Pattern not found" });
//       }

//       res
//         .status(200)
//         .json({ message: "Pattern image deleted", updatedPattern });
//     } catch (error) {
//       console.error("Error deleting pattern image:", error);
//       res.status(500).json({ error: "Failed to delete the pattern image" });
//     }
//   }
// );

// // Route for deleting an avatar image
// imageRouter.delete("/delete-avatar/:publicId", isAuthenticated, async (c) => {
//   const { publicId } = req.params;

//   try {
//     // Delete image from cloudinary
//     await cloudinary.uploader.destroy(`SewDB/avatar/${publicId}`);

//     // Update the user document in the database to remove the reference to the avatar
//     const updatedUser = await User.findByIdAndUpdate(
//       req.payload._id,
//       { avatar: "" },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.status(200).json({ message: "Avatar image deleted", updatedUser });
//   } catch (error) {
//     console.error("Error deleting avatar image:", error);
//     res.status(500).json({ error: "Failed to delete the avatar image" });
//   }
// });

export default imageRouter;
