import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const user = await getUser(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch fresh data from DB to get latest balances
        const profile = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                employee_id: true,
                department: true,
                position: true,
                sick_leave_balance: true,
                casual_leave_balance: true,
                medical_leave_balance: true,
                join_date: true
            }
        });

        if (!profile) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Also fetch today's attendance status to show correct button (Check In vs Check Out)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todaysAttendance = await prisma.attendance.findUnique({
            where: {
                employee_id_date: {
                    employee_id: user.id,
                    date: today
                }
            }
        });

        return NextResponse.json({
            user: profile,
            attendance: todaysAttendance // null if not present, object if checked-in (checked_out might be null)
        });

    } catch (error) {
        console.error('User Me API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
