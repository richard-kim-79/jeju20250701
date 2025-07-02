import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(filePath: string) {
  return await cloudinary.uploader.upload(filePath, {
    folder: 'jeju',
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  });
} 