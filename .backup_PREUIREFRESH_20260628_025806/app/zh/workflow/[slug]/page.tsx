import { workflows, getWorkflowBySlug } from '@/data/workflows';
import WorkflowDetail from '@/components/WorkflowDetail';

export function generateStaticParams() {
  return workflows.map((workflow) => ({
    slug: workflow.slug,
  }));
}

export default async function WorkflowPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const resolvedParams = await params;
  const workflow = getWorkflowBySlug(resolvedParams.slug);
  const locale = resolvedParams.locale || 'zh';

  return <WorkflowDetail slug={resolvedParams.slug} locale={locale} workflow={workflow} />;
}
