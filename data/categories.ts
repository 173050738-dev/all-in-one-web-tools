export interface Category {
  id: string;
  name: string;
  icon: string;
}

import { getStaticCategoryCount, getStaticTotalTools } from './_static-counts.generated';

export const categories: Category[] = [
  {
    id: 'dev-tools',
    name: 'Dev Tools',
    icon: 'Terminal',
  },
  {
    id: 'ai-tools',
    name: 'AI Tools',
    icon: 'Zap',
  },
  {
    id: 'image-tools',
    name: 'Image Tools',
    icon: 'Image',
  },
  {
    id: 'pdf-tools',
    name: 'PDF Tools',
    icon: 'FileText',
  },
  {
    id: 'media-tools',
    name: 'Media Tools',
    icon: 'Video',
  },
  {
    id: 'productivity',
    name: 'Productivity',
    icon: 'Zap',
  },
  {
    id: 'design-tools',
    name: 'Design Tools',
    icon: 'Palette',
  },
  {
    id: 'ecommerce',
    name: 'E-commerce',
    icon: 'ShoppingCart',
  },
  {
    id: 'content-tools',
    name: 'Content Tools',
    icon: 'PenTool',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: 'TrendingUp',
  },
  {
    id: 'seo-tools',
    name: 'SEO Tools',
    icon: 'Search',
  },
  {
    id: 'social-media',
    name: 'Social Media',
    icon: 'Share2',
  },
  {
    id: 'customer-service',
    name: 'Customer Service',
    icon: 'Headphones',
  },
  {
    id: 'finance-tools',
    name: 'Finance',
    icon: 'DollarSign',
  },
  {
    id: 'hr-tools',
    name: 'HR Tools',
    icon: 'Users',
  },
  {
    id: 'education',
    name: 'Education',
    icon: 'GraduationCap',
  },
  {
    id: 'health',
    name: 'Health',
    icon: 'Heart',
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    icon: 'Home',
  },
  {
    id: 'video-editing',
    name: 'Video Editing',
    icon: 'Video',
  },
  {
    id: 'audio-tools',
    name: 'Audio Tools',
    icon: 'Music',
  },
  {
    id: '3d-tools',
    name: '3D Tools',
    icon: 'Box',
  },
  {
    id: 'data-viz',
    name: 'Data Visualization',
    icon: 'BarChart',
  },
  {
    id: 'security',
    name: 'Security',
    icon: 'Shield',
  },
  {
    id: 'collaboration',
    name: 'Collaboration',
    icon: 'Users',
  },
  {
    id: 'file-tools',
    name: 'File Tools',
    icon: 'Folder',
  },
  {
    id: 'api-tools',
    name: 'API Tools',
    icon: 'Code',
  },
  {
    id: 'game-tools',
    name: 'Gaming Tools',
    icon: 'Gamepad2',
  },
];

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find((cat) => cat.id === id);
};

let _dynamicCategoryCountTable: Record<string, number> | null = null;

export function setDynamicCategoryCounts(table: Record<string, number>): void {
  _dynamicCategoryCountTable = table;
}

export const getCategoryCount = (categoryId: string): number => {
  if (_dynamicCategoryCountTable) {
    const v = _dynamicCategoryCountTable[categoryId];
    if (typeof v === 'number') return v;
  }
  // 兜底：构建阶段预计算的静态常量（≈1054条真实工具），保证 categories.ts 不必顶层 import tools
  return getStaticCategoryCount(categoryId);
};

export const getTotalToolsCount = (): number => {
  return getStaticTotalTools();
};
