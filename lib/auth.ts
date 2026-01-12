import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key-change-this-in-production-123456';

export function generateToken(user: any): string {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    employeeId: user.employee_id,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), // 7 days
  };

  return jwt.sign(payload, JWT_SECRET, {
    algorithm: 'HS256',
  });
}

export function verifyToken(token: string): any {
  try {
    // Debug logging to see exactly what we are verifying
    if (!token) throw new Error("Token is empty");

    // Check if token has quotes or whitespace
    const cleanToken = token.trim().replace(/^"|"$/g, '');

    console.log(`🔐 Verifying token (length: ${cleanToken.length}): ${cleanToken.substring(0, 10)}...`);

    const decoded = jwt.verify(cleanToken, JWT_SECRET);
    return decoded;
  } catch (error: any) {
    console.error('❌ Token verification failed:', error.message);
    console.error('🔍 Token that failed:', token.substring(0, 50) + '...');
    return null;
  }
}

// For development only - simple password comparison
export function verifyPassword(plainText: string, hashed: string): boolean {
  console.log(`🔐 Password check: ${plainText} vs ${hashed}`);
  return plainText === hashed; // Simple comparison for dev
}

import { cookies } from 'next/headers';

export async function getUser(request: Request) { // Request param kept for compatibility but unused for cookies
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) return null;
  return verifyToken(token);
}