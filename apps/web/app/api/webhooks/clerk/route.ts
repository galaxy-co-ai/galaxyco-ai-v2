import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { db, users } from '@galaxyco/database';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  // Get webhook secret from environment (we'll add this later)
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET is not set');
    return new Response('Webhook secret not configured', { status: 500 });
  }

  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the webhook signature
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  // Handle the webhook event
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    try {
      // Create user in database
      await db.insert(users).values({
        clerkUserId: id,
        email: email_addresses[0]?.email_address || '',
        firstName: first_name || null,
        lastName: last_name || null,
        avatarUrl: image_url || null,
        lastLoginAt: new Date(),
      });

      console.log(`✅ User created in database: ${id}`);
    } catch (error) {
      console.error('Error creating user in database:', error);
      return new Response('Error creating user', { status: 500 });
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    try {
      // Update user in database
      await db
        .update(users)
        .set({
          email: email_addresses[0]?.email_address || '',
          firstName: first_name || null,
          lastName: last_name || null,
          avatarUrl: image_url || null,
          updatedAt: new Date(),
        })
        .where(eq(users.clerkUserId, id));

      console.log(`✅ User updated in database: ${id}`);
    } catch (error) {
      console.error('Error updating user in database:', error);
      return new Response('Error updating user', { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    try {
      // Soft delete or hard delete user from database
      // For now, we'll just log it (you can implement cascade deletes)
      await db.delete(users).where(eq(users.clerkUserId, id!));

      console.log(`✅ User deleted from database: ${id}`);
    } catch (error) {
      console.error('Error deleting user from database:', error);
      return new Response('Error deleting user', { status: 500 });
    }
  }

  return new Response('Webhook processed successfully', { status: 200 });
}
