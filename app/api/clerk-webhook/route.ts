import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Clerk sends user.created event when a user registers
export async function POST(req: NextRequest) {
  const payload = await req.json();

  // Clerk event type
  const eventType = payload.type;

  console.log("eventType:", eventType);
  if (eventType === 'user.created') {
    const email = payload.data.email_addresses?.[0]?.email_address;
    const externalId = payload.data.id; // Clerk's user id
    if (!email) {
      return NextResponse.json({ error: 'No email found in Clerk webhook' }, { status: 400 });
    }
    // Create user in DB if not exists
    try {
      await prisma.user.upsert({
        where: { email },
        update: { clerkId: externalId },
        create: {
          email,
          clerkId: externalId, // Store Clerk's user ID
          role: 'DOCTOR',      // Default role, adjust as needed
        },
      });
      console.log(`User created or updated: ${email}`);
    } catch (error) {
      console.error('Error creating user:', error);
      // Log more details about the error
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      return NextResponse.json({ error: 'Failed to create user', details: error instanceof Error ? error.message : String(error) }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ received: true });
}
