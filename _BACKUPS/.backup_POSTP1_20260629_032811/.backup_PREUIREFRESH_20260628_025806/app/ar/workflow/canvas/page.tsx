import WorkflowCanvasUI from '@/components/workflow/WorkflowCanvasUI';

export const metadata = {
  title: 'لوحة سير العمل · Korelyy Flow',
  description: 'استوديو أتمتة بأسلوب أزرق بنفسجي متدرج. اسحب العقد لإنشاء التدفقات.',
};

export default function WorkflowCanvasPage() {
  return <WorkflowCanvasUI locale="ar" />;
}
