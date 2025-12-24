"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Send, FileText, ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function ContactPage() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast({
                    title: "Message sent!",
                    description: "We'll get back to you as soon as possible.",
                });
                setFormData({ name: "", email: "", message: "" });
            } else {
                const data = await response.json();
                toast({
                    title: "Error",
                    description: data.error || "Failed to send message. Please try again.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send message. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900">
            {/* Contact Form Section */}
            <section className="py-10 sm:py-16 px-4 sm:px-6">
                <div className="container mx-auto max-w-2xl">
                    {/* Header */}
                    <div className="text-center mb-8 sm:mb-12">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
                            Contact Us
                        </h1>
                        <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400">
                            We are here to help you with any questions you may have.
                        </p>
                    </div>

                    {/* Contact Form */}
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-4 sm:p-6 md:p-8">
                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm sm:text-base text-slate-700 dark:text-slate-300">
                                        Name
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="h-10 sm:h-12"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm sm:text-base text-slate-700 dark:text-slate-300">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="your.email@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="h-10 sm:h-12"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message" className="text-sm sm:text-base text-slate-700 dark:text-slate-300">
                                        Message
                                    </Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        placeholder="How can we help you?"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="resize-none text-sm sm:text-base"
                                    />
                                </div>

                                <div className="flex justify-center pt-2 sm:pt-4">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base w-full sm:w-auto"
                                    >
                                        {isSubmitting ? (
                                            "Sending..."
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4 mr-2" />
                                                Send Message
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Get Started Section */}
            <section className="py-10 sm:py-16 lg:py-20 px-4 sm:px-6 bg-slate-50 dark:bg-slate-800">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
                        {/* Left Content */}
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 sm:mb-8">
                                Get started in 1 minute
                            </h2>

                            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 inline-block text-left">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                                    <span className="text-sm sm:text-base lg:text-lg text-slate-700 dark:text-slate-300">
                                        Choose a template
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                                    <span className="text-sm sm:text-base lg:text-lg text-slate-700 dark:text-slate-300">
                                        Add your information
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                                    <span className="text-sm sm:text-base lg:text-lg text-slate-700 dark:text-slate-300">
                                        Export it for use
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center md:justify-start">
                                <Link href="/receipt/generate/default">
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 w-full sm:w-auto">
                                        <FileText className="w-4 h-4 mr-2" />
                                        Generate Receipt
                                    </Button>
                                </Link>
                                <Link href="/templates">
                                    <Button variant="outline" className="rounded-full px-6 w-full sm:w-auto">
                                        View Templates
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Right Content - App Preview */}
                        <div className="flex justify-center lg:justify-end">
                            <div className="relative w-full max-w-md lg:max-w-none">
                                <Image
                                    src="/assets/img/Generate-Receipt-MakeReceipt-12-23-2025_10_30_PM.png"
                                    alt="Receipt Generator Interface"
                                    width={600}
                                    height={450}
                                    className="rounded-xl shadow-2xl w-full h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
