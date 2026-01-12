import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateToken, verifyPassword } from '@/lib/auth'; // Import helper
import { compare } from 'bcryptjs'; // Use bcrypt for real pw check

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. Find user in Real DB
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // 2. Check Password
    if (!user) {
      return NextResponse.json({ error: 'Wrong email or password' }, { status: 401 });
    }

    // Attempt bcrypt compare first, fallback to simple for seeded dev users if needed
    let pwMatch = false;
    try {
      pwMatch = await compare(password, user.password);
    } catch (e) {
      // Fallback for simple passwords if bcrypt fails (dev only)
      pwMatch = user.password === password;
    }

    if (!pwMatch) {
      return NextResponse.json({ error: 'Wrong email or password' }, { status: 401 });
    }

    // 3. Generate REAL JWT
    const token = generateToken(user);

    // 4. Create response
    const { password: _, ...userWithoutPassword } = user;
    const response = NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token: token
    });

    // 5. Set Cookie
    response.cookies.set('token', token, {
      httpOnly: false, // Keep false for dev convenience if needed, ideally true in prod
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;

  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json({
      error: 'Server error',
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}