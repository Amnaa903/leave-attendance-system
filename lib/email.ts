/**
 * Email Service Stub
 * 
 * In a real application, this would connect to SendGrid, Resend, or AWS SES.
 * For now, we simulate sending by logging to the console.
 * This allows the system to be "Notification Ready" without requiring API keys.
 */

interface EmailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
}

export async function sendEmail({ to, subject, text }: EmailOptions): Promise<boolean> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    console.log(`
    ==================================================
    📧 MOCK EMAIL SENT
    --------------------------------------------------
    To: ${to}
    Subject: ${subject}
    Body:
    ${text}
    ==================================================
    `);

    return true;
}

export const EMAIL_TEMPLATES = {
    LEAVE_STATUS_UPDATE: (name: string, status: string, approvedBy: string) => ({
        subject: `Leave Request ${status.toUpperCase()}`,
        text: `Hello ${name},\n\nYour leave request has been ${status} by ${approvedBy}.\n\nPlease check your dashboard for more details.\n\nBest,\nLeaveSync Team`
    }),
    LEAVE_CREATED_MANAGER: (employeeName: string, type: string, days: number) => ({
        subject: `New Leave Request: ${employeeName}`,
        text: `${employeeName} has applied for ${days} days of ${type} leave.\n\nPlease review it in your dashboard.`
    })
};
