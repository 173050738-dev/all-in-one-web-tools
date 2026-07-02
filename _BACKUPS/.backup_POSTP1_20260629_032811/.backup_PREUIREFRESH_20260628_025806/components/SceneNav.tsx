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
  const translations: Record<string, Record<string, string>> = {
    zh: {
      'scene.all': '全部工具',
      'scene.content-creator': '内容创作',
      'scene.developer': '开发者',
      'scene.designer': '设计师',
      'scene.student': '学生学习',
      'scene.office-worker': '办公效率',
      'scene.video-creator': '视频创作',
    },
    en: {
      'scene.all': 'All Tools',
      'scene.content-creator': 'Content Creator',
      'scene.developer': 'Developer',
      'scene.designer': 'Designer',
      'scene.student': 'Student',
      'scene.office-worker': 'Office Work',
      'scene.video-creator': 'Video Creator',
    },
    hi: {
      'scene.all': 'सभी टूल्स',
      'scene.content-creator': 'कंटेंट क्रिएटर',
      'scene.developer': 'डेवलपर',
      'scene.designer': 'डिज़ाइनर',
      'scene.student': 'छात्र',
      'scene.office-worker': 'कार्यालय कार्य',
      'scene.video-creator': 'वीडियो क्रिएटर',
    },
    fr: {
      'scene.all': 'Tous les Outils',
      'scene.content-creator': 'Créateur de Contenu',
      'scene.developer': 'Développeur',
      'scene.designer': 'Designer',
      'scene.student': 'Étudiant',
      'scene.office-worker': 'Travail de Bureau',
      'scene.video-creator': 'Créateur Vidéo',
    },
    es: {
      'scene.all': 'Todas las Herramientas',
      'scene.content-creator': 'Creador de Contenido',
      'scene.developer': 'Desarrollador',
      'scene.designer': 'Diseñador',
      'scene.student': 'Estudiante',
      'scene.office-worker': 'Trabajo de Oficina',
      'scene.video-creator': 'Creador de Video',
    },
    ar: {
      'scene.all': 'جميع الأدوات',
      'scene.content-creator': 'منشئ المحتوى',
      'scene.developer': 'المطور',
      'scene.designer': 'المصمم',
      'scene.student': 'الطالب',
      'scene.office-worker': 'عمل المكتب',
      'scene.video-creator': 'منشئ الفيديو',
    },
  };

  const getT = (loc: string) => {
    const dict = translations[loc] || translations.zh;
    return (key: string) => dict[key] ?? translations.zh[key] ?? key;
  };
  const t = getT(locale);

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
          <span className='whitespace-nowrap'>{t('scene.all')}</span>
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
              <span className='whitespace-nowrap'>{t(`scene.${scene.id}`)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
