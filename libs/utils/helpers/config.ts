const baseUrl = import.meta.env.VITE_PUBLIC_BASEURL;
const enquiry = import.meta.env.VITE_ENQUIRY_KEY;
const paystackey = import.meta.env.VITE_PAYSTACK_API_KEY;
const cloudflarekey = import.meta.env.VITE_CLOUDFLARE_API_KEY;

const CONFIG = {
  BASE_URL: baseUrl,
  ENQUIRY: enquiry,
  PAYSTACK: paystackey,
  CLOUDFLARE: cloudflarekey,
};

export default CONFIG;