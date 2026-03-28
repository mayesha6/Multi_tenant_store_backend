interface EnvConfig {
    PORT: string;
    DATABASE_URL: string;
    NODE_ENV: "development" | "production";
    BCRYPT_SALT_ROUND: string;
    JWT_ACCESS_SECRET: string;
    JWT_ACCESS_EXPIRES: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRES: string;
    SUPER_ADMIN_EMAIL: string;
    SUPER_ADMIN_PASSWORD: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CALLBACK_URL: string;
    EXPRESS_SESSION_SECRET: string;
    FRONTEND_URL: string;
    CLOUDINARY: {
        CLOUDINARY_CLOUD_NAME: string;
        CLOUDINARY_API_KEY: string;
        CLOUDINARY_API_SECRET: string;
    };
    EMAIL_SENDER: {
        SMTP_USER: string;
        SMTP_PASS: string;
        SMTP_PORT: string;
        SMTP_HOST: string;
        SMTP_FROM: string;
    };
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_USERNAME: string;
    REDIS_PASSWORD: string;
    STRIPE_SECRET_KEY: string;
    STRIPE_PUBLISHABLE_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
}
export declare const envVars: EnvConfig;
export {};
//# sourceMappingURL=env.d.ts.map