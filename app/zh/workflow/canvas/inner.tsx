import WorkflowCanvasUI from '@/components/workflow/WorkflowCanvasUI';

export const metadata = {
  title: '自动化工作流画布 · Korelyy Flow',
  description: '蓝紫渐变差异化 SaaS 自动化工作台，拖拽构建工作流节点，步骤串联配置。',
};

export default function WorkflowCanvasPage() {
  return <WorkflowCanvasUI locale="zh" />;
}
