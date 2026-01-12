import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const user = await getUser(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Allow Admins and Managers
        if (user.role !== 'admin' && user.role !== 'manager') {
            return NextResponse.json({ error: 'Access denied. Managers only.' }, { status: 403 });
        }

        const attendance = await prisma.attendance.findMany({
            include: {
                employee: {
                    select: {
                        name: true,
                        department: true,
                        employee_id: true
                    }
                }
            },
            orderBy: { date: 'desc' },
            take: 100 // Limit to last 100 records for performance, maybe add pagination later
        });

        return NextResponse.json({ attendance });

    } catch (error) {
        console.error('Manager Attendance API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
