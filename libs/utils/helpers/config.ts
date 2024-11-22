const baseUrl = import.meta.env.VITE_PUBLIC_BASEURL;
const publicKey = import.meta.env.VITE_PUBLIC_KEY;
const flutUrl = import.meta.env.VITE_FLUT_URL;
const secretKey = import.meta.env.VITE_SECRET_KEY;
const encryptKey = import.meta.env.VITE_ENCRYPT_KEY;
const enquiry = import.meta.env.VITE_ENQUIRY_KEY;
const paystackey = import.meta.env.VITE_PAYSTACK_API_KEY;

const isDevelopment = import.meta.env.DEV;

const CONFIG = {
  BASE_URL: isDevelopment ? baseUrl : baseUrl,
  PUBLIC_KEY: publicKey,
  SECRET_KEY: secretKey,
  FLUT_URL: flutUrl,
  ENCRYPTKEY: encryptKey,
  ENQUIRY: enquiry,
  PAYSTACK: paystackey,
};

export default CONFIG;