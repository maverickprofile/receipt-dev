import { createAuthClient } from "better-auth/react";

const client = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
});

export const {
    signIn,
    signUp,
    useSession,
    signOut,
} = client;

// Export the full client for accessing other methods
export const authClient = client;
