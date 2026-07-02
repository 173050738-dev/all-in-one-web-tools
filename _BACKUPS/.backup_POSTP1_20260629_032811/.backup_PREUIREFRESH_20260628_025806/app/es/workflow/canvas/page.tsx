import WorkflowCanvasUI from '@/components/workflow/WorkflowCanvasUI';

export const metadata = {
  title: 'Lienzo de Workflow · Korelyy Flow',
  description: 'Estudio de automatización degradado azul/morado. Arrastra nodos para construir flujos.',
};

export default function WorkflowCanvasPage() {
  return <WorkflowCanvasUI locale="es" />;
}
