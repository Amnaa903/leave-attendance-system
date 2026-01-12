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

        // In a real app, Managers might only see their own department or direct reports.
        // For MVP Phase 6, we'll allow Managers to see ALL pending leaves or filter by department if data exists.
        // Let's assume Managers see all leaves for now, or we can filter by 'department' if user has one.

        const whereClause: any = {};

        // If manager has a department, maybe filter by it? 
        // For now, let's keep it simple: Managers see ALL pending leaves to approve.
        // Ideally: where: { employee: { department: user.department } }

        const leaves = await prisma.leave.findMany({
            where: {
                status: 'pending' // Managers primarily care about pending ones
                // Can remove this filter to see history too, but let's prioritize pending
            },
            include: {
                employee: {
                    select: {
                        name: true,
                        employee_id: true,
                        department: true,
                        sick_leave_balance: true,
                        casual_leave_balance: true
                    }
                }
            },
            orderBy: { created_at: 'asc' } // Oldest first
        });

        return NextResponse.json({ leaves });

    } catch (error) {
        console.error('Manager Leaves API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
