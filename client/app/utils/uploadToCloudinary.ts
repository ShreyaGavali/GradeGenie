export const uploadToCloudinary = async (file: File) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);  // 👈 Your preset name
  
    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, {
      method: "POST",
      body: data,
    });
  
    const result = await res.json();
    return result.secure_url; // 👈 This is the file URL you want
  };