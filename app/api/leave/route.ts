import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
import { checkSandwichRule, validateLeaveQuota } from '@/lib/rules';

export async function POST(request: Request) {
    try {
        const user = await getUser(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { leave_type, start_date, end_date, reason, is_sandwich, days, proof_url } = body;

        // 1. Basic Validation
        const start = new Date(start_date);
        const end = new Date(end_date);

        // Calculates days difference if not provided
        const oneDay = 24 * 60 * 60 * 1000;
        const diffDays = Math.round(Math.abs((end.getTime() - start.getTime()) / oneDay)) + 1;
        const totalDays = days || diffDays;

        // 2. Check Quota
        const hasQuota = await validateLeaveQuota(user.id, leave_type, totalDays);
        if (!hasQuota) {
            return NextResponse.json({ error: `Insufficient ${leave_type} leave balance.` }, { status: 400 });
        }

        // 3. Sandwich Rule
        if (is_sandwich) {
            const sandwichCheck = await checkSandwichRule(user.id, start);
            if (!sandwichCheck.allowed) {
                return NextResponse.json({ error: sandwichCheck.reason }, { status: 400 });
            }

            // Check 7 day notice
            const today = new Date();
            const daysNotice = (start.getTime() - today.getTime()) / oneDay;
            if (daysNotice < 7) {
                return NextResponse.json({ error: "Sandwich leaves require 7 days notice." }, { status: 400 });
            }
        }

        // 4. Medical Rule (Proof > 3 days)
        if (leave_type === 'medical' && totalDays > 3 && !proof_url) {
            return NextResponse.json({ error: "Medical leave > 3 days requires a doctor's note (proof_url)." }, { status: 400 });
        }

        // 5. Create Leave
        const leave = await prisma.leave.create({
            data: {
                employee_id: user.id,
                leave_type,
                start_date: start,
                end_date: end,
                total_days: totalDays,
                reason,
                is_sandwich: is_sandwich || false,
                proof_url,
                status: 'pending'
            }
        });

        return NextResponse.json({ success: true, leave });

    } catch (error) {
        console.error('Leave Apply Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const user = await getUser(request);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const leaves = await prisma.leave.findMany({
            where: {
                // If admin, fetch all (or filtered). If employee, fetch only theirs.
                ...(user.role !== 'admin' ? { employee_id: user.id } : {})
            },
            include: {
                employee: {
                    select: { name: true, employee_id: true }
                }
            },
            orderBy: { created_at: 'desc' }
        });

        return NextResponse.json({ leaves });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
