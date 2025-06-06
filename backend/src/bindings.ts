export type Bindings = {
  DATABASE_URL: string;
  ORIGIN: string;
  CLOUDINARY_URL: string;
  CLOUDINARY_NAME: string;
  CLOUDINARY_KEY: number;
  CLOUDINARY_SECRET: string;
  CLOUDINARY_PRESET: string;
  params: { id: string; categrory: string; sizes: string };
  TOKEN_SECRET: string;
  ENVIRONMENT: string;
  RESEND_API_KEY: string;
  EMAIL_FROM: string;
};
