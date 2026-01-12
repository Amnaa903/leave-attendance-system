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

        // Map to activity format
        const activities = latestLeaves.map(leave => ({
            user: leave.employee.name,
            action: `applied for ${leave.leave_type} leave`,
            time: new Date(leave.created_at).toLocaleDateString(), // Simplification
            type: 'leave'
        }));

        // We can also fetch recent attendance (e.g. Check-ins) and merge, but for now just leaves

        return NextResponse.json({ activities });

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
