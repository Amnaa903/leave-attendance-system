import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { token, password } = await request.json();

        if (!token || !password) {
            return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: {
                reset_token: token,
                reset_token_expiry: {
                    gt: new Date() // Must be in the future
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
        }

        const hashedPassword = await hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                reset_token: null,
                reset_token_expiry: null
            }
        });

        return NextResponse.json({ success: true, message: 'Password has been reset successfully.' });

    } catch (error) {
        console.error('Password Reset Confirm Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
