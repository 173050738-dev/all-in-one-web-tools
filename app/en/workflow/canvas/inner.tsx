import WorkflowCanvasUI from '@/components/workflow/WorkflowCanvasUI';

export const metadata = {
  title: 'Workflow Canvas · Korelyy Flow',
  description: 'Gradient SaaS automation studio with gradient purple/blue visual style. Drag nodes to build automation.',
};

export default function WorkflowCanvasPage() {
  return <WorkflowCanvasUI locale="en" />;
}
