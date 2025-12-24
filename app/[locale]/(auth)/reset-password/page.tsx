"use client";

import { useState, useEffect } from "react";
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
import { Loader2, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            setError("Invalid or missing reset token. Please request a new password reset link.");
        }
    }, [token]);

    const handleResetPassword = async () => {
        if (!password || !confirmPassword) {
            toast({
                title: "Error",
                description: "Please fill in all fields",
                variant: "destructive",
            });
            return;
        }

        if (password.length < 8) {
            toast({
                title: "Error",
                description: "Password must be at least 8 characters",
                variant: "destructive",
            });
            return;
        }

        if (password !== confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match",
                variant: "destructive",
            });
            return;
        }

        if (!token) {
            toast({
                title: "Error",
                description: "Invalid reset token",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    newPassword: password,
                    token,
                }),
            });

            const result = await response.json();

            if (!response.ok || result.error) {
                toast({
                    title: "Error",
                    description: result.error?.message || result.message || "Failed to reset password",
                    variant: "destructive",
                });
            } else {
                setSuccess(true);
            }
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to reset password",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Show error if no token
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                            <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                        <CardTitle className="text-2xl font-bold">
                            Invalid Link
                        </CardTitle>
                        <CardDescription className="mt-2">
                            {error}
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center">
                        <Link href="/forgot-password">
                            <Button>
                                Request New Link
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    // Show success message
    if (success) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <CardTitle className="text-2xl font-bold">
                            Password Reset Successfully
                        </CardTitle>
                        <CardDescription className="mt-2">
                            Your password has been updated. You can now sign in with your new password.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center">
                        <Link href="/sign-in">
                            <Button>
                                Sign In
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
                        Reset Password
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your new password below
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Must be at least 8 characters
                        </p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button
                        className="w-full"
                        onClick={handleResetPassword}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Resetting...
                            </>
                        ) : (
                            "Reset Password"
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
