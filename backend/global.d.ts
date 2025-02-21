// declare module "multer-storage-cloudinary" {
//   import { StorageEngine } from "multer";
//   import {
//     UploadApiOptions,
//     UploadApiResponse,
//     v2 as Cloudinary,
//   } from "cloudinary";

//   interface CloudinaryStorageOptions {
//     cloudinary: typeof Cloudinary;
//     params:
//       | UploadApiOptions
//       | ((
//           req: Express.Request,
//           file: Express.Multer.File
//         ) => UploadApiOptions | Promise<UploadApiOptions>);
//   }

//   class CloudinaryStorage implements StorageEngine {
//     constructor(options: CloudinaryStorageOptions);
//   }

//   export { CloudinaryStorage };
// }
declare module "multer-storage-cloudinary" {
  import { StorageEngine } from "multer";
  import { UploadApiOptions, v2 as Cloudinary } from "cloudinary";

  interface CloudinaryStorageOptions {
    cloudinary: typeof Cloudinary;
    params:
      | UploadApiOptions
      | ((
          req: Express.Request,
          file: Express.Multer.File
        ) => UploadApiOptions | Promise<UploadApiOptions>);
  }

  class CloudinaryStorage implements StorageEngine {
    constructor(options: CloudinaryStorageOptions);
    _handleFile(
      req: Express.Request,
      file: Express.Multer.File,
      callback: (error?: any, info?: Express.Multer.File) => void
    ): void;
    _removeFile(
      req: Express.Request,
      file: Express.Multer.File,
      callback: (error: Error | null) => void
    ): void;
  }

  export { CloudinaryStorage };
}
