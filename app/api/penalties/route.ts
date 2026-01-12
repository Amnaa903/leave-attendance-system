import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const user = await getUser(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        let employeeId = searchParams.get('employee_id');

        // If employee, they can ONLY see their own
        if (user.role === 'employee') {
            employeeId = user.id.toString();
        }

        const penalties = await prisma.penalty.findMany({
            where: {
                ...(employeeId ? { employee_id: parseInt(employeeId) } : {})
            },
            include: {
                employee: {
                    select: {
                        name: true,
                        employee_id: true,
                        department: true
                    }
                }
            },
            orderBy: {
                applied_date: 'desc'
            }
        });

        return NextResponse.json({ penalties });

    } catch (error) {
        console.error('List Penalties Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const user = await getUser(request);
        if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { employee_id, penalty_type, description, penalty_days } = await request.json();

        if (!employee_id || !penalty_type || penalty_days === undefined) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create penalty and deduct from balance in a transaction
        const result = await prisma.$transaction(async (tx) => {
            const penalty = await tx.penalty.create({
                data: {
                    employee_id: parseInt(employee_id),
                    penalty_type,
                    description,
                    penalty_days: parseFloat(penalty_days),
                    applied_date: new Date(),
                    status: 'active'
                }
            });

            // For now, we deduct from casual leave by default
            // In a more complex system, this might be a separate flag
            await tx.user.update({
                where: { id: parseInt(employee_id) },
                data: {
                    casual_leave_balance: {
                        decrement: parseFloat(penalty_days)
                    }
                }
            });

            return penalty;
        });

        return NextResponse.json({ success: true, penalty: result });

    } catch (error) {
        console.error('Create Penalty Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
