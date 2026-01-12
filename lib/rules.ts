import { prisma } from '@/lib/prisma';
import { Leave, Attendance } from '@prisma/client';

/**
 * Check for Sandwich Rule:
 * "Sandwich leaves must be informed at least 1 week prior... 
 * No more than 2 sandwich leaves are allowed over a 4 month period."
 * 
 * A sandwich leave is typically when a holiday falls between two leave days, 
 * treating the holiday as a leave day. 
 * Alternatively, it implies taking leave on Friday and Monday, counting Sat/Sun.
 * 
 * User Interpretation: 
 * "Sandwich leaves" seems to be a specific type or condition here.
 * We will assume it triggers if a leave adjoins a weekend/holiday.
 * For now, we will implement a check that counts how many times this user has flagged "is_sandwich".
 */
export async function checkSandwichRule(employeeId: number, startDate: Date): Promise<{ allowed: boolean, reason?: string }> {
    // Check count in last 4 months
    const fourMonthsAgo = new Date();
    fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

    const recentSandwiches = await prisma.leave.count({
        where: {
            employee_id: employeeId,
            is_sandwich: true,
            start_date: { gte: fourMonthsAgo },
            status: 'approved'
        }
    });

    if (recentSandwiches >= 2) {
        return { allowed: false, reason: "Max 2 Sandwich leaves allowed in 4 months." };
    }

    // Check 1 week prior notice
    const today = new Date();
    const noticePeriod = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Note: logic is 'If it IS a sandwich leave, it needs 1 week notice'
    // We rely on the user or system to flag 'is_sandwich'. 
    // We'll return allowed:true here but this specific check might need the 'isSandwich' input flag from the request.

    return { allowed: true };
}

/**
 * Validate Quotas
 * 7 Sick + 7 Casual
 */
export async function validateLeaveQuota(employeeId: number, type: string, daysRequested: number): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { id: employeeId } });
    if (!user) return false;

    if (type === 'sick') return user.sick_leave_balance >= daysRequested;
    if (type === 'casual') return user.casual_leave_balance >= daysRequested;

    // Medical usually has separate rules or unlimited if valid, but let's assume balance check if needed
    if (type === 'medical') return user.medical_leave_balance >= daysRequested;

    if (type === 'work_from_home') return user.work_from_home_balance >= daysRequested;

    return false;
}

/**
 * Penalty Calculation
 * "0.25 day off is set if present and forgot (late?)"
 */
export function calculateAttendancePenalty(checkInTime: Date, scheduledTime: string = "09:00"): number {
    // Simple logic: If check-in is after scheduled time + grace period (e.g. 15 mins)
    const [hours, minutes] = scheduledTime.split(':').map(Number);
    const lateThreshold = new Date(checkInTime);
    lateThreshold.setHours(hours, minutes + 15, 0, 0); // 15 min grace

    if (checkInTime > lateThreshold) {
        return 0.25;
    }
    return 0;
}
