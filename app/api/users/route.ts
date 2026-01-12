import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
import { hash } from 'bcryptjs';

export async function POST(request: Request) {
    try {
        // 1. Check Auth (Admin Only)
        const currentUser = await getUser(request);
        if (!currentUser || currentUser.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
        }

        const body = await request.json();
        const { name, email, password, role, employee_id, department, position, sick_leave_balance, casual_leave_balance } = body;

        // 2. Validate Input
        if (!name || !email || !password || !employee_id) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 3. Check Duplicates
        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ email }, { employee_id }] }
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User with this Email or Employee ID already exists.' }, { status: 409 });
        }

        // 4. Create User
        const hashedPassword = await hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'employee',
                employee_id,
                department,
                position,
                join_date: new Date(),
                sick_leave_balance: sick_leave_balance || 7,
                casual_leave_balance: casual_leave_balance || 7
            }
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = newUser;

        return NextResponse.json({ success: true, user: userWithoutPassword }, { status: 201 });

    } catch (error) {
        console.error('Create User Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const currentUser = await getUser(request);
        if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'manager')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                employee_id: true,
                role: true,
                department: true,
                join_date: true
            }
        });

        return NextResponse.json({ users });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
