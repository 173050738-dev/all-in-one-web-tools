import type { Metadata } from 'next';

const WORKFLOW_SLUGS: { slug: string }[] = [];

export function generateStaticParams() {
  if (WORKFLOW_SLUGS.length === 0) {
    const { workflows } = require('@/data/workflows');
    for (const w of workflows) WORKFLOW_SLUGS.push({ slug: w.slug });
  }
  return WORKFLOW_SLUGS;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `سير العمل: ${slug}`,
    description: `صفحة سير العمل لـ ${slug}`,
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
