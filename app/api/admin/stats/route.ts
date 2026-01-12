import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        // 1. Check Auth (Admin Only)
        const user = await getUser(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Fetch Real Stats
        const totalEmployees = await prisma.user.count({
            where: { role: 'employee' }
        });

        const pendingLeaves = await prisma.leave.count({
            where: { status: 'pending' }
        });

        // Calculate today's attendance %
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const activeEmployees = await prisma.user.count({
            where: { role: 'employee' } // Simple assumption: all employees are active
        });

        const todaysAttendance = await prisma.attendance.count({
            where: {
                date: {
                    gte: today,
                },
                status: { in: ['present', 'half_day', 'late'] }
            }
        });

        const attendancePercentage = activeEmployees > 0
            ? Math.round((todaysAttendance / activeEmployees) * 100)
            : 0;

        // Active Issues (e.g. absent without leave or penalties - stub for now)
        const activeIssues = await prisma.penalty.count({
            where: { status: 'active' }
        });

        return NextResponse.json({
            stats: [
                { title: "Total Employees", value: totalEmployees.toString(), change: "+0", icon: "Users", color: "blue" },
                { title: "Pending Leaves", value: pendingLeaves.toString(), change: pendingLeaves > 0 ? `+${pendingLeaves}` : "0", icon: "Calendar", color: "orange" },
                { title: "Today's Attendance", value: `${attendancePercentage}%`, change: "+0%", icon: "Clock", color: "green" },
                { title: "Active Issues", value: activeIssues.toString(), change: "+0", icon: "AlertCircle", color: "pink" },
            ]
        });

    } catch (error) {
        console.error('Stats API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
