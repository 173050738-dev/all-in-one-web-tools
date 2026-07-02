export interface Category {
  id: string;
  name: string;
  icon: string;
}

import { tools } from './tools';

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
];

export const getCategoryById = (id: string): Category | undefined => {
  return categories.find((cat) => cat.id === id);
};

export const getCategoryCount = (categoryId: string): number => {
  return tools.filter((tool) => tool.category === categoryId).length;
};
