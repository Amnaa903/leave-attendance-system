import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUser } from '@/lib/auth';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getUser(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const id = parseInt(params.id);
        const { status } = await request.json();

        const penalty = await prisma.penalty.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json({ success: true, penalty });

    } catch (error) {
        console.error('Update Penalty Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getUser(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const id = parseInt(params.id);

        // Optional: Should we restore balance on delete? 
        // For simplicity, let's just delete the record for now.
        await prisma.penalty.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Delete Penalty Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
