import { NextResponse } from 'next/server';

// Simple user database
const users = [
  { id: 1, email: 'admin@company.com', name: 'Admin', password: 'admin123', role: 'ADMIN', employee_id: 'ADM001' },
  { id: 2, email: 'manager@company.com', name: 'Manager', password: 'manager123', role: 'MANAGER', employee_id: 'MGR001' },
  { id: 3, email: 'employee@company.com', name: 'Employee', password: 'employee123', role: 'EMPLOYEE', employee_id: 'EMP001' },
];

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return NextResponse.json({ error: 'Wrong email or password' }, { status: 401 });
    }

    // Simple token (just user info encoded)
    const token = Buffer.from(JSON.stringify(user)).toString('base64');
    
    // Create response
    const response = NextResponse.json({
      success: true,
      user: user,
      token: token
    });

    // Set cookie - SIMPLE VERSION
    response.cookies.set('token', token, {
      httpOnly: false, // false kar do
      secure: false, // false for localhost
      sameSite: 'lax', // lax use karo
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
    
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}