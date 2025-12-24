import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const SUPPORT_EMAIL = "support@receipt.dev";
const FROM_EMAIL = "Receipt.dev <noreply@receipt.dev>";

export async function POST(request: NextRequest) {
    try {
        const { name, email, message } = await request.json();

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "Name, email, and message are required" },
                { status: 400 }
            );
        }

        // Send email to support
        await resend.emails.send({
            from: FROM_EMAIL,
            to: SUPPORT_EMAIL,
            replyTo: email,
            subject: `[Contact Form] New message from ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; text-align: center;">
                        <h1 style="color: white; margin: 0;">📬 New Contact Form Submission</h1>
                    </div>
                    <div style="padding: 30px; background: #f9fafb;">
                        <h2 style="color: #1f2937; margin-top: 0;">Contact Details</h2>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #e5e7eb;"><strong>Name:</strong></td>
                                <td style="padding: 10px 0; color: #1f2937; border-bottom: 1px solid #e5e7eb;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td>
                                <td style="padding: 10px 0; color: #1f2937; border-bottom: 1px solid #e5e7eb;">
                                    <a href="mailto:${email}" style="color: #3b82f6;">${email}</a>
                                </td>
                            </tr>
                        </table>

                        <h3 style="color: #1f2937; margin-top: 24px;">Message</h3>
                        <div style="background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
                            <p style="color: #4b5563; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
                        </div>

                        <div style="margin-top: 24px; padding: 16px; background: #dbeafe; border-radius: 8px;">
                            <p style="color: #1e40af; margin: 0; font-size: 14px;">
                                💡 You can reply directly to this email to respond to ${name}.
                            </p>
                        </div>
                    </div>
                    <div style="padding: 20px; text-align: center; background: #e5e7eb;">
                        <p style="color: #6b7280; font-size: 12px; margin: 0;">
                            This email was sent from the Receipt.dev contact form.
                        </p>
                    </div>
                </div>
            `,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error sending contact email:", error);
        return NextResponse.json(
            { error: "Failed to send message" },
            { status: 500 }
        );
    }
}
