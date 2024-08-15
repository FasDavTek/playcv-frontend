import axios from 'axios';

interface CloudinaryUploadOptions {
  cloudName: string;
  uploadPreset: string;
  file: File;
  resourceType: 'image' | 'video';
}

const index = async ({
  cloudName,
  uploadPreset,
  file,
  resourceType,
}: CloudinaryUploadOptions): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', resourceType === 'image' ? 'images_folder' : 'videosCVs'); // Specify folder based on resourceType
  formData.append('resource_type', resourceType);

  try {
    const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, formData);
    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

export default index
