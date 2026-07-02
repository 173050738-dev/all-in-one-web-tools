import WorkflowCanvasUI from '@/components/workflow/WorkflowCanvasUI';

export const metadata = {
  title: 'Canevas Workflow · Korelyy Flow',
  description: 'Studio automation avec dégradé bleu/violet. Glissez les nœuds.',
};

export default function WorkflowCanvasPage() {
  return <WorkflowCanvasUI locale="fr" />;
}
