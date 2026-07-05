import type { Metadata } from 'next';
import { TOP_WORKFLOW_SLUGS } from '@/lib/topSlugs';

export function generateStaticParams() {
  return TOP_WORKFLOW_SLUGS.map(slug => ({ slug }));
}

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Workflow : ${slug}`,
    description: `Page de workflow pour ${slug}`,
  };
}

export default async function WorkflowPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const p = await params;
  const { workflows } = await import('@/data/workflows');
  const workflow = workflows.find(w => w.slug === p.slug);
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold">{workflow?.title || p.slug}</h1>
      <p className="text-gray-600 mb-4">{workflow?.description}</p>
      <p>Locale: {p.locale}</p>
      <p>Steps: {workflow?.steps.length || 0}</p>
    </div>
  );
}
