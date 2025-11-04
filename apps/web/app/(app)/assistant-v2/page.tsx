import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { ChatContainer } from './components/ChatContainer';

export const metadata = {
  title: 'AI Assistant V2 | GalaxyCo',
  description: 'Your intelligent workspace assistant powered by GPT-4',
};

export default async function AssistantV2Page() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // TODO: Get actual workspace ID from user context
  // For now, using a placeholder
  const workspaceId = '00000000-0000-0000-0000-000000000000';

  return <ChatContainer workspaceId={workspaceId} />;
}
