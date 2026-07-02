'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { workflows } from '@/data/workflows';
import { Zap, Clock, Play, ChevronRight } from 'lucide-react';

export default function WorkflowsPage() {
  const params = useParams();
  const locale = (params.locale as string) || 'es';
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categoryNames: Record<string, string> = {
    all: 'All',
    'content-creator': 'Content Creator',
    developer: 'Developer',
    designer: 'Designer',
    student: 'Student',
    'office-worker': 'Office Work',
    'video-creator': 'Video Creator',
  };

  const filteredWorkflows = selectedCategory === 'all'
    ? workflows
    : workflows.filter(w => w.category === selectedCategory);

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'advanced':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Easy';
      case 'medium': return 'Medium';
      case 'advanced': return 'Advanced';
      default: return '';
    }
  };

  return (
    <div className='max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8'>
      <div className='mb-4 sm:mb-6 lg:mb-8'>
        <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2'>
          Tool Workflows
        </h1>
        <p className='text-sm sm:text-base text-gray-600 dark:text-gray-400'>
          Curated tool combinations, step-by-step efficiency
        </p>
      </div>

      <div className='flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8'>
        <Sidebar locale={locale} activePage='workflows' />

        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 -mx-3 px-3 sm:-mx-4 sm:px-4 mb-4 sm:mb-6'>
            {Object.entries(categoryNames).map(([key, name]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all active:scale-95 ${
                  selectedCategory === key
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
            {filteredWorkflows.map((workflow) => (
              <a
                key={workflow.id}
                href={`/${locale}/workflow/${workflow.slug}`}
                className='group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300'
              >
                <div className='flex items-start justify-between mb-3'>
                  <div className='flex items-center gap-3'>
                    <div className='p-2.5 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 text-primary-600 dark:text-primary-400'>
                      <Zap className='w-5 h-5 sm:w-6 sm:h-6' />
                    </div>
                    <div>
                      <h3 className='font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors'>
                        {workflow.title}
                      </h3>
                    </div>
                  </div>
                  <ChevronRight className='w-4 h-4 sm:w-5 sm:h-5 text-gray-300 dark:text-gray-600 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1' />
                </div>
                <p className='text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2'>
                  {workflow.description}
                </p>
                <div className='flex items-center gap-2 flex-wrap'>
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${getDifficultyStyle(workflow.difficulty)}`}>
                    {getDifficultyText(workflow.difficulty)}
                  </div>
                  <div className='flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'>
                    <Clock className='w-3 h-3' />
                    {workflow.estimatedTime}
                  </div>
                  <div className='flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'>
                    <Play className='w-3 h-3' />
                    {workflow.steps.length} steps
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
