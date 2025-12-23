import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    trustedOrigins: [
        "http://localhost:3000",
        "https://receipt.dev",
        "https://www.receipt.dev",
        "https://makereceipt.com",
        "https://www.makereceipt.com",
        "https://make-receipt.vercel.app",
    ],
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
    }),
    // Use custom table names with makeReceipt suffix
    user: {
        modelName: "user_makereceipt",
    },
    session: {
        modelName: "session_makereceipt",
    },
    account: {
        modelName: "account_makereceipt",
    },
    verification: {
        modelName: "verification_makereceipt",
    },
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        },
    },
});
