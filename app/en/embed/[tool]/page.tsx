import EmbedClient from '@/components/EmbedToolClient';

export const dynamic = 'force-dynamic';

export default function EmbedPage({ params }: { params: { tool: string } }) {
  return <EmbedClient toolSlug={params.tool} />;
}
