import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
import { calculateAttendancePenalty } from '@/lib/rules';

export async function POST(request: Request) {
    try {
        const user = await getUser(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { action, notes } = await request.json(); // action: "check_in" | "check_out"
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find existing record for today
        let attendance = await prisma.attendance.findUnique({
            where: {
                employee_id_date: {
                    employee_id: user.id,
                    date: today
                }
            }
        });

        if (action === 'check_in') {
            if (attendance) {
                return NextResponse.json({ error: 'Already checked in today.' }, { status: 400 });
            }

            const now = new Date();
            // Calculate Late Status (Default 9:00 AM)
            // We can also use 'calculateAttendancePenalty' here or just set the flag
            // Let's set the flag and simple penalty calc
            const scheduledTime = "09:00";
            const penalty = calculateAttendancePenalty(now, scheduledTime);
            const isLate = penalty > 0;

            attendance = await prisma.attendance.create({
                data: {
                    employee_id: user.id,
                    date: today,
                    check_in: now,
                    status: 'present',
                    is_late: isLate,
                    notes
                }
            });

            // Note: If penalty > 0, we should probably record it in the Penalty table too?
            // User requirement: "0.25 day off is set if present and forgot and reported later" 
            // User also says: "Attendance check in... automatically marks timestamp"
            // Let's just mark is_late for now. The penalty system might be a separate job.
        }

        else if (action === 'check_out') {
            if (!attendance) {
                return NextResponse.json({ error: 'Cannot check out without checking in.' }, { status: 400 });
            }

            const now = new Date();
            // Calculate hours worked
            const checkInTime = new Date(attendance.check_in!);
            const hoursWorked = (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

            attendance = await prisma.attendance.update({
                where: { id: attendance.id },
                data: {
                    check_out: now,
                    hours_worked: hoursWorked,
                    // Update status if needed (e.g., half day if < 4 hours?)
                    status: hoursWorked < 4 ? 'half_day' : 'present'
                }
            });
        }

        return NextResponse.json({ success: true, attendance });

    } catch (error: any) {
        console.error('Attendance API Error:', error);
        return NextResponse.json({
            error: 'Server error',
            details: error.message
        }, { status: 500 });
    }
}

export async function GET(request: Request) {
    // Get user's attendance history
    try {
        const user = await getUser(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const attendance = await prisma.attendance.findMany({
            where: { employee_id: user.id },
            orderBy: { date: 'desc' },
            take: 30
        });

        return NextResponse.json({ attendance });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
