import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const user = await getUser(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch latest leaves as activity
        const latestLeaves = await prisma.leave.findMany({
            take: 5,
            orderBy: { created_at: 'desc' },
            include: { employee: true }
        });

        // Fetch latest attendance as activity
        const latestAttendance = await prisma.attendance.findMany({
            take: 5,
            orderBy: { check_in: 'desc' },
            include: { employee: true },
            where: { check_in: { not: null } }
        });

        // Map to activity format
        const leaveActivities = latestLeaves.map(leave => ({
            user: leave.employee.name,
            action: `applied for ${leave.leave_type} leave`,
            time: new Date(leave.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: new Date(leave.created_at).toLocaleDateString(),
            type: 'leave',
            timestamp: new Date(leave.created_at).getTime()
        }));

        const attendanceActivities = latestAttendance.map(att => ({
            user: att.employee.name,
            action: att.check_out ? 'checked out' : 'checked in',
            time: new Date(att.check_out || att.check_in!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: new Date(att.date).toLocaleDateString(),
            type: 'attendance',
            timestamp: new Date(att.check_out || att.check_in!).getTime()
        }));

        // Merge and sort
        const activities = [...leaveActivities, ...attendanceActivities]
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 8);

        return NextResponse.json({ activities });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
