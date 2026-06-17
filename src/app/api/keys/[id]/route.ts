import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '../../../../lib/prisma';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: keyId } = await params;

    // Verify ownership before deleting
    const existingKey = await prisma.apiKey.findUnique({ where: { id: keyId } });
    if (!existingKey || existingKey.userId !== userId) {
      return NextResponse.json({ error: 'Key not found or unauthorized' }, { status: 404 });
    }

    await prisma.apiKey.delete({
      where: { id: keyId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API /keys/[id] DELETE Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: keyId } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    // Verify ownership
    const existingKey = await prisma.apiKey.findUnique({ where: { id: keyId } });
    if (!existingKey || existingKey.userId !== userId) {
      return NextResponse.json({ error: 'Key not found or unauthorized' }, { status: 404 });
    }

    const updatedKey = await prisma.apiKey.update({
      where: { id: keyId },
      data: { status },
      include: {
        accessScopes: true
      }
    });

    const safeKey = {
      id: updatedKey.id,
      label: updatedKey.label,
      provider: updatedKey.provider,
      mask: updatedKey.mask,
      status: updatedKey.status,
      lastUsed: updatedKey.lastUsed,
      accessProfile: updatedKey.accessScopes.map(s => s.scope),
    };

    return NextResponse.json({ key: safeKey });
  } catch (error) {
    console.error('API /keys/[id] PATCH Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
