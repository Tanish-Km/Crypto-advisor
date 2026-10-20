import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { mockDb } from '@/lib/db/mockDb';
import { Message } from '@/types';

const messageSchema = z.object({
  recommendationId: z.string().optional(),
  fromUserId: z.string().min(1),
  toUserId: z.string().min(1),
  body: z.string().min(1, 'Message cannot be empty'),
  fromName: z.string().optional(),
  fromRole: z.enum(['investor', 'advisor']).optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const recId = searchParams.get('recommendationId');

  let list = mockDb.messages;
  if (recId) {
    list = list.filter((m) => m.recommendationId === recId);
  }

  return NextResponse.json({ success: true, messages: list });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = messageSchema.parse(body);

    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      recommendationId: parsed.recommendationId,
      fromUserId: parsed.fromUserId,
      toUserId: parsed.toUserId,
      body: parsed.body,
      createdAt: new Date().toISOString(),
      fromName: parsed.fromName,
      fromRole: parsed.fromRole,
    };

    mockDb.messages.push(newMessage);

    return NextResponse.json({ success: true, message: newMessage });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 });
  }
}
