/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PUBLIC_BASEURL: string
    readonly VITE_PUBLIC_KEY: string
    readonly VITE_PAYSTACK_API_KEY: string
    readonly VITE_CLOUDFLARE_API_KEY: string
    readonly VITE_FLUT_URL: string
    readonly VITE_SECRET_KEY: string
    readonly VITE_ENCRYPT_KEY: string
    readonly VITE_ENQUIRY_KEY: string
}
  
interface ImportMeta {
    readonly env: ImportMetaEnv
}