import { workflows, getWorkflowBySlug } from '@/data/workflows';
import WorkflowDetailSimple from '@/components/WorkflowDetailSimple';

export function generateStaticParams() {
  return workflows.map((workflow) => ({
    slug: workflow.slug,
  }));
}

export default async function WorkflowPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const resolvedParams = await params;
  const workflow = getWorkflowBySlug(resolvedParams.slug);
  const locale = resolvedParams.locale || 'fr';

  return <WorkflowDetailSimple slug={resolvedParams.slug} locale={locale} workflow={workflow} />;
}
