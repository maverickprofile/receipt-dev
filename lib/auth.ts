import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { Resend } from "resend";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Email sender configuration
const FROM_EMAIL = "Receipt.dev <noreply@receipt.dev>";
const APP_NAME = "Receipt.dev";

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
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }) => {
            try {
                await resend.emails.send({
                    from: FROM_EMAIL,
                    to: user.email,
                    subject: `Reset your ${APP_NAME} password`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; text-align: center;">
                                <h1 style="color: white; margin: 0;">🧾 ${APP_NAME}</h1>
                            </div>
                            <div style="padding: 30px; background: #f9fafb;">
                                <h2 style="color: #1f2937;">Reset Your Password</h2>
                                <p style="color: #4b5563; line-height: 1.6;">
                                    Hi ${user.name || 'there'},
                                </p>
                                <p style="color: #4b5563; line-height: 1.6;">
                                    We received a request to reset your password. Click the button below to create a new password:
                                </p>
                                <div style="text-align: center; margin: 30px 0;">
                                    <a href="${url}" style="background: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                                        Reset Password
                                    </a>
                                </div>
                                <p style="color: #6b7280; font-size: 14px;">
                                    If you didn't request this, you can safely ignore this email.
                                </p>
                                <p style="color: #6b7280; font-size: 14px;">
                                    This link will expire in 1 hour.
                                </p>
                            </div>
                            <div style="padding: 20px; text-align: center; background: #e5e7eb;">
                                <p style="color: #6b7280; font-size: 12px; margin: 0;">
                                    © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
                                </p>
                            </div>
                        </div>
                    `,
                });
            } catch (error) {
                console.error("Error sending reset password email:", error);
            }
        },
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            try {
                await resend.emails.send({
                    from: FROM_EMAIL,
                    to: user.email,
                    subject: `Verify your ${APP_NAME} email`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; text-align: center;">
                                <h1 style="color: white; margin: 0;">🧾 ${APP_NAME}</h1>
                            </div>
                            <div style="padding: 30px; background: #f9fafb;">
                                <h2 style="color: #1f2937;">Welcome to ${APP_NAME}!</h2>
                                <p style="color: #4b5563; line-height: 1.6;">
                                    Hi ${user.name || 'there'},
                                </p>
                                <p style="color: #4b5563; line-height: 1.6;">
                                    Thanks for signing up! Please verify your email address to get started with creating professional receipts.
                                </p>
                                <div style="text-align: center; margin: 30px 0;">
                                    <a href="${url}" style="background: #3b82f6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                                        Verify Email Address
                                    </a>
                                </div>
                                <p style="color: #6b7280; font-size: 14px;">
                                    If you didn't create an account, you can safely ignore this email.
                                </p>
                            </div>
                            <div style="padding: 20px; text-align: center; background: #e5e7eb;">
                                <p style="color: #6b7280; font-size: 12px; margin: 0;">
                                    © ${new Date().getFullYear()} ${APP_NAME}. All rights reserved.
                                </p>
                            </div>
                        </div>
                    `,
                });
            } catch (error) {
                console.error("Error sending verification email:", error);
            }
        },
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        },
    },
});
