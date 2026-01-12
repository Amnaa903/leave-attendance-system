import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail, EMAIL_TEMPLATES } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            // We return a success message even if the user doesn't exist
            // for security reasons (avoiding email enumeration).
            return NextResponse.json({ success: true, message: 'If an account exists with this email, a reset link has been sent.' });
        }

        // Generate a secure token
        const token = crypto.randomBytes(32).toString('hex');
        const expiry = new Date(Date.now() + 3600000); // 1 hour from now

        await prisma.user.update({
            where: { id: user.id },
            data: {
                reset_token: token,
                reset_token_expiry: expiry
            }
        });

        // Send Email
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const resetLink = `${baseUrl}/reset-password/${token}`;

        const template = EMAIL_TEMPLATES.PASSWORD_RESET(user.name, resetLink);
        await sendEmail({
            to: user.email,
            subject: template.subject,
            text: template.text
        });

        return NextResponse.json({ success: true, message: 'If an account exists with this email, a reset link has been sent.' });

    } catch (error) {
        console.error('Password Reset Request Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
