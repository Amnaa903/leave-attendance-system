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
            where: { role: 'employee' }
        });

        const todaysAttendance = await prisma.attendance.findMany({
            where: {
                date: {
                    gte: today,
                }
            }
        });

        const presentCount = todaysAttendance.filter(a => ['present', 'half_day', 'late'].includes(a.status)).length;
        const lateCount = todaysAttendance.filter(a => a.is_late).length;
        const attendancePercentage = activeEmployees > 0
            ? Math.round((presentCount / activeEmployees) * 100)
            : 0;

        // Active Issues (e.g. absent without leave or penalties)
        const activeIssues = await prisma.penalty.count({
            where: { status: 'active' }
        });

        // 3. Fetch Historical Data (Last 7 Days)
        const historicalData = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            d.setHours(0, 0, 0, 0);

            const nextDay = new Date(d);
            nextDay.setDate(d.getDate() + 1);

            const dayAttendanceCount = await prisma.attendance.count({
                where: {
                    date: {
                        gte: d,
                        lt: nextDay
                    },
                    status: { in: ['present', 'half_day', 'late'] }
                }
            });

            const dayPercentage = activeEmployees > 0
                ? Math.round((dayAttendanceCount / activeEmployees) * 100)
                : 0;

            historicalData.push({
                day: d.toLocaleDateString(undefined, { weekday: 'short' }),
                percentage: dayPercentage
            });
        }

        return NextResponse.json({
            stats: [
                { title: "Total Employees", value: totalEmployees.toString(), change: "+0", icon: "Users", color: "blue" },
                { title: "Pending Leaves", value: pendingLeaves.toString(), change: pendingLeaves > 0 ? `+${pendingLeaves}` : "0", icon: "Calendar", color: "orange" },
                { title: "Today's Attendance", value: `${attendancePercentage}%`, change: `${presentCount} Present`, icon: "Clock", color: "green" },
                { title: "Active Issues", value: activeIssues.toString(), change: "+0", icon: "AlertCircle", color: "pink" },
            ],
            breakdown: {
                present: presentCount,
                late: lateCount,
                absent: activeEmployees - presentCount,
                total: activeEmployees
            },
            historicalData
        });

    } catch (error) {
        console.error('Stats API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
