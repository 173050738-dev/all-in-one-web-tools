'use client';

import { Sparkles, Code, Palette, GraduationCap, Briefcase, Video } from 'lucide-react';
import { scenes } from '@/data/scenes';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Code,
  Palette,
  GraduationCap,
  Briefcase,
  Video,
};

interface SceneNavProps {
  activeScene: string | null;
  onSceneChange: (sceneId: string | null) => void;
  locale: string;
}

export default function SceneNav({ activeScene, onSceneChange, locale }: SceneNavProps) {
  const getSceneName = (id: string) => {
    const names: Record<string, Record<string, string>> = {
      'content-creator': {
        zh: '内容创作',
        en: 'Content Creator',
        es: 'Creador de Contenido',
        fr: 'Créateur de Contenu',
        hi: 'कंटेंट क्रिएटर',
        ar: 'منشئ المحتوى',
      },
      'developer': {
        zh: '开发者',
        en: 'Developer',
        es: 'Desarrollador',
        fr: 'Développeur',
        hi: 'डेवलपर',
        ar: 'المطور',
      },
      'designer': {
        zh: '设计师',
        en: 'Designer',
        es: 'Diseñador',
        fr: 'Designer',
        hi: 'डिज़ाइनर',
        ar: 'المصمم',
      },
      'student': {
        zh: '学生学习',
        en: 'Student',
        es: 'Estudiante',
        fr: 'Étudiant',
        hi: 'छात्र',
        ar: 'الطالب',
      },
      'office-worker': {
        zh: '办公效率',
        en: 'Office Work',
        es: 'Trabajo de Oficina',
        fr: 'Travail de Bureau',
        hi: 'कार्यालय कार्य',
        ar: 'عمل المكتب',
      },
      'video-creator': {
        zh: '视频创作',
        en: 'Video Creator',
        es: 'Creador de Video',
        fr: 'Créateur Vidéo',
        hi: 'वीडियो क्रिएटर',
        ar: 'منشئ الفيديو',
      },
    };
    return names[id]?.[locale] || names[id]?.['en'] || id;
  };

  return (
    <div className='mb-4 sm:mb-6'>
      <div className='flex items-center gap-2 overflow-x-auto pb-2 -mx-3 sm:-mx-4 px-3 sm:px-4 scene-scroll' style={{ scrollbarWidth: 'thin' }}>
        <button
          onClick={() => onSceneChange(null)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all active:scale-95 ${
            activeScene === null
              ? 'bg-primary-600 text-white shadow-sm'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          <span>✨</span>
          <span className='whitespace-nowrap'>全部工具</span>
        </button>
        {scenes.map((scene) => {
          const IconComponent = iconMap[scene.icon];
          return (
            <button
              key={scene.id}
              onClick={() => onSceneChange(scene.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all active:scale-95 ${
                activeScene === scene.id
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {IconComponent && <IconComponent className='w-4 h-4' />}
              <span className='whitespace-nowrap'>{getSceneName(scene.id)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
