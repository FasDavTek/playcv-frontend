const baseUrl = import.meta.env.VITE_PUBLIC_BASEURL;
const paystackey = import.meta.env.VITE_PAYSTACK_API_KEY;
const cloudflarekey = import.meta.env.VITE_CLOUDFLARE_API_TOKEN_KEY;

const CONFIG = {
  BASE_URL: baseUrl,
  PAYSTACK: paystackey,
  CLOUDFLARE: cloudflarekey,
  IS_PRODUCTION: import.meta.env.PROD,
};

export default CONFIG;