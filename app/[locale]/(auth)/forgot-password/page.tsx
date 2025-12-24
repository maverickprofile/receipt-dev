"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const { toast } = useToast();

    const handleForgotPassword = async () => {
        if (!email) {
            toast({
                title: "Error",
                description: "Please enter your email address",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/auth/forget-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    redirectTo: "/reset-password",
                }),
            });

            const result = await response.json();

            if (!response.ok || result.error) {
                toast({
                    title: "Error",
                    description: result.error?.message || result.message || "Failed to send reset email",
                    variant: "destructive",
                });
            } else {
                setEmailSent(true);
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to send reset email",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Show email sent confirmation
    if (emailSent) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                            <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <CardTitle className="text-2xl font-bold">
                            Check Your Email
                        </CardTitle>
                        <CardDescription className="mt-2">
                            We&apos;ve sent a password reset link to
                        </CardDescription>
                        <p className="font-medium text-foreground mt-1">{email}</p>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Click the link in your email to reset your password. The link will expire in 1 hour.
                        </p>
                        <div className="bg-muted/50 rounded-lg p-4 text-sm">
                            <p className="text-muted-foreground">
                                Didn&apos;t receive the email? Check your spam folder or{" "}
                                <button
                                    onClick={() => setEmailSent(false)}
                                    className="text-blue-600 hover:underline"
                                >
                                    try again
                                </button>
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Link href="/sign-in">
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Sign In
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        Forgot Password
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your email and we&apos;ll send you a link to reset your password
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button
                        className="w-full"
                        onClick={handleForgotPassword}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            "Send Reset Link"
                        )}
                    </Button>
                    <Link href="/sign-in" className="w-full">
                        <Button variant="ghost" className="w-full">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Sign In
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
