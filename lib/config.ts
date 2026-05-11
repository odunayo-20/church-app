export const config = {
  api: {
    timeout: parseInt(process.env.API_TIMEOUT ?? "15000"),
    maxPageSize: parseInt(process.env.MAX_PAGE_SIZE ?? "100"),
    defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE ?? "10"),
  },
  auth: {
    sessionCookieName: "__session",
  },
  storage: {
    bucketName: process.env.STORAGE_BUCKET_NAME ?? "blog-images",
    maxUploadSize: parseInt(process.env.MAX_UPLOAD_SIZE ?? "5242880"),
    cacheControl: process.env.STORAGE_CACHE_CONTROL ?? "3600",
  },
  donations: {
    maxAmount: parseFloat(process.env.MAX_DONATION_AMOUNT ?? "99999999.99"),
    currency: process.env.DONATION_CURRENCY ?? "NGN",
  },
  notifications: {
    batchSize: parseInt(process.env.NOTIFICATION_BATCH_SIZE ?? "50"),
  },
  email: {
    apiKey: process.env.BREVO_API_KEY ?? "",
    from: process.env.BREVO_FROM_EMAIL ?? "onboarding@brevo.com",
    admin: process.env.ADMIN_EMAIL ?? "",
  },
  env: {
    isDev: process.env.NODE_ENV === "development",
    isProd: process.env.NODE_ENV === "production",
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
    appName: process.env.NEXT_PUBLIC_APP_NAME ?? "Church App",
  },
} as const;

export type AppConfig = typeof config;
