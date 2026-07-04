'use client';
import WorkflowCanvasUI, { type WorkflowCanvasUIProps } from './WorkflowCanvasUI';

/**
 * 工作流画布组件（统一入口）
 * -----------------------------------
 * 历史说明：
 * 1. 旧版本：基于 @xyflow/react (ReactFlow)，路径 components/workflow/WorkflowCanvas.tsx
 * 2. 新版本（当前）：自主实现的三栏布局画布（WorkflowCanvasUI.tsx）
 *    - 默认折叠两侧面板 + 画布边缘悬浮展开按钮
 *    - 小视口(<1024px)拦截并提示使用桌面端
 *    - 所有按钮已补充功能：保存/运行/会员/搜索/设备切换/菜单/撤销重做/注释/分组/导出/测试步骤/复制删除/外链打开/密钥库
 * 为保持向后兼容，此文件统一转发至新版 WorkflowCanvasUI。
 */
export type WorkflowCanvasProps = WorkflowCanvasUIProps;

export default function WorkflowCanvas(props: WorkflowCanvasProps) {
  return <WorkflowCanvasUI {...props} />;
}
