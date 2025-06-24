import axios from 'axios';

interface CloudinaryUploadOptions {
  file: File;
  resourceType: 'image' | 'video';
  context: {
    videoType?: string;
    price?: string;
    description?: string;
    advertType?: string;
    adRedirectURL?: string;
    startDate?: any;
    endDate?: any;
    adName?: string;
    videoName?: string;
    videoTranscript?: string;
    videoCategory?: string;
  };
}

const cloudName = 'dht1fkhxb';
const uploadPreset = 'ml_default';

const index = async ({
  file,
  resourceType,
  context,
}: CloudinaryUploadOptions): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', resourceType === 'image' ? 'images_folder' : 'videos_folder');
  formData.append('resource_type', resourceType);

  // Adding context data
  for (const [key, value] of Object.entries(context)) {
    if (value) {
      formData.append(`context[${key}]`, value);
    }
  }

  try {
    const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, formData, {
      params: {
        context: JSON.stringify(context),
      },
    });
    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

export default index
