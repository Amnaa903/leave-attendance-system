import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';
import { sendEmail, EMAIL_TEMPLATES } from '@/lib/email';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getUser(request);
        if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const leaveId = parseInt(params.id);
        const body = await request.json();
        const { status, rejection_reason } = body; // status: 'approved' | 'rejected'

        if (!['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        // 1. Transaction to update Leave AND User Balance (if approved)
        // We use a transaction to ensure data integrity
        const result = await prisma.$transaction(async (tx) => {

            // Get the leave first
            const leave = await tx.leave.findUnique({
                where: { id: leaveId }
            });

            if (!leave) throw new Error('Leave not found');
            if (leave.status !== 'pending') throw new Error('Leave is already processed');

            // Update Leave Status
            const updatedLeave = await tx.leave.update({
                where: { id: leaveId },
                data: {
                    status,
                    approved_by: user.id,
                    approved_at: new Date(),
                    rejection_reason: status === 'rejected' ? rejection_reason : null
                }
            });

            // 2. Deduct Balance if Approved
            if (status === 'approved') {
                const leaveType = leave.leave_type; // sick, casual, etc.
                const employeeId = leave.employee_id;
                const days = leave.total_days;

                if (leaveType === 'sick') {
                    await tx.user.update({
                        where: { id: employeeId },
                        data: { sick_leave_balance: { decrement: days } }
                    });
                } else if (leaveType === 'casual') {
                    await tx.user.update({
                        where: { id: employeeId },
                        data: { casual_leave_balance: { decrement: days } }
                    });
                } else if (leaveType === 'medical') {
                    await tx.user.update({
                        where: { id: employeeId },
                        data: { medical_leave_balance: { increment: days } } // Usually medical doesn't deduct from a fixed quota, just tracks total usage? 
                        // Or if it has balance, we decrement. User model says 'medical_leave_balance' default 0. 
                        // Let's assume it tracks usage (increments) OR deducts if balance is given.
                        // Given default is 0, let's Increment usage for now, or assume this field meant 'Quota'.
                        // "Medical Leaves longer than 3 days... max of 2 medical leaves Or equivalent salary days"
                        // Let's increment usage for tracking.
                    });
                }
            }

            return { updatedLeave, user };
        });

        // 3. Send Notification (Async, don't block response)
        const { updatedLeave } = result;
        const employee = await prisma.user.findUnique({ where: { id: updatedLeave.employee_id } });

        if (employee) {
            const emailContent = EMAIL_TEMPLATES.LEAVE_STATUS_UPDATE(
                employee.name,
                status,
                user.name // The manager/admin who approved it
            );
            // Fire and forget
            sendEmail({ to: employee.email, ...emailContent }).catch(console.error);
        }

        return NextResponse.json({ success: true, leave: updatedLeave });

    } catch (error: any) {
        console.error('Leave Patch Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
