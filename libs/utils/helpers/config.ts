const baseUrl = import.meta.env.VITE_PUBLIC_BASEURL;
const publicKey = import.meta.env.VITE_PUBLIC_KEY;
const secretKey = import.meta.env.VITE_SECRET_KEY;
const encryptKey = import.meta.env.VITE_ENCRYPT_KEY;
const enquiry = import.meta.env.VITE_ENQUIRY_KEY;
const paystackey = import.meta.env.VITE_PAYSTACK_API_KEY;
const cloudflarekey = import.meta.env.VITE_CLOUDFLARE_API_KEY;

const CONFIG = {
  BASE_URL: baseUrl,
  PUBLIC_KEY: publicKey,
  SECRET_KEY: secretKey,
  ENCRYPTKEY: encryptKey,
  ENQUIRY: enquiry,
  PAYSTACK: paystackey,
  CLOUDFLARE: cloudflarekey,
};

export default CONFIG;