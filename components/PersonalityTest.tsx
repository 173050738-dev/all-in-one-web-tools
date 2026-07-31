'use client';

import { useState, useMemo } from 'react';
import { ChevronRight, RotateCcw, Share2, Copy, Check, Sparkles, Brain, Heart, Briefcase } from 'lucide-react';

interface PersonalityTestProps {
  locale?: string;
}

type Axis = 'EI' | 'SN' | 'TF' | 'JP';
type Letter = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';

interface Question {
  axis: Axis;
  optionA: { text: string; letter: Letter };
  optionB: { text: string; letter: Letter };
}

interface PersonalityType {
  code: string;
  nickname: { zh: string; en: string };
  description: { zh: string; en: string };
  strengths: { zh: string[]; en: string[] };
  weaknesses: { zh: string[]; en: string[] };
  careers: { zh: string[]; en: string[] };
  famous: string[];
  gradient: string;
}

const i18n: Record<string, Record<string, string>> = {
  zh: {
    title: '性格测试',
    subtitle: 'MBTI 风格 16 型人格测试',
    start: '开始测试',
    next: '下一题',
    retake: '重新测试',
    progress: '进度',
    yourType: '你的性格类型',
    copyResult: '复制结果',
    copied: '已复制',
    shareResult: '分享结果',
    question: '问题',
    of: '/',
    result: '测试结果',
    strengths: '优势',
    weaknesses: '劣势',
    careers: '适合职业',
    famous: '代表人物',
    close: '关闭',
    chooseA: 'A',
    chooseB: 'B',
    tip: '提示：凭第一直觉选择，不要过度思考',
    axis: '维度',
    axisEI: '外向 / 内向',
    axisSN: '感觉 / 直觉',
    axisTF: '思考 / 情感',
    axisJP: '判断 / 感知',
    percentComplete: '已完成',
    shareText: '我在Korelyy性格测试中是 {type} {nickname}！',
  },
  en: {
    title: 'Personality Test',
    subtitle: 'MBTI-style 16 personality type test',
    start: 'Start Test',
    next: 'Next',
    retake: 'Retake Test',
    progress: 'Progress',
    yourType: 'Your Personality Type',
    copyResult: 'Copy Result',
    copied: 'Copied',
    shareResult: 'Share Result',
    question: 'Question',
    of: 'of',
    result: 'Your Result',
    strengths: 'Strengths',
    weaknesses: 'Weaknesses',
    careers: 'Career Suggestions',
    famous: 'Famous People',
    close: 'Close',
    chooseA: 'A',
    chooseB: 'B',
    tip: 'Tip: Go with your first impression, don\'t overthink',
    axis: 'Axis',
    axisEI: 'Extraversion / Introversion',
    axisSN: 'Sensing / Intuition',
    axisTF: 'Thinking / Feeling',
    axisJP: 'Judging / Perceiving',
    percentComplete: 'Complete',
    shareText: 'I got {type} {nickname} on the Korelyy Personality Test!',
  },
  es: {
    title: 'Prueba de Personalidad',
    subtitle: 'Prueba de 16 tipos de personalidad estilo MBTI',
    start: 'Empezar',
    next: 'Siguiente',
    retake: 'Reintentar',
    progress: 'Progreso',
    yourType: 'Tu Tipo de Personalidad',
    copyResult: 'Copiar Resultado',
    copied: 'Copiado',
    shareResult: 'Compartir',
    question: 'Pregunta',
    of: 'de',
    result: 'Tu Resultado',
    strengths: 'Fortalezas',
    weaknesses: 'Debilidades',
    careers: 'Carreras Sugeridas',
    famous: 'Personas Famosas',
    close: 'Cerrar',
    chooseA: 'A',
    chooseB: 'B',
    tip: 'Consejo: Elige tu primera impresión',
    axis: 'Eje',
    axisEI: 'Extraversión / Introversión',
    axisSN: 'Sensación / Intuición',
    axisTF: 'Pensamiento / Sentimiento',
    axisJP: 'Juicio / Percepción',
    percentComplete: 'Completado',
    shareText: 'Soy {type} {nickname} en la prueba de personalidad de Korelyy!',
  },
  fr: {
    title: 'Test de Personnalité',
    subtitle: 'Test de 16 types de personnalité style MBTI',
    start: 'Commencer',
    next: 'Suivant',
    retake: 'Refaire',
    progress: 'Progrès',
    yourType: 'Votre Type',
    copyResult: 'Copier',
    copied: 'Copié',
    shareResult: 'Partager',
    question: 'Question',
    of: 'sur',
    result: 'Votre Résultat',
    strengths: 'Forces',
    weaknesses: 'Faiblesses',
    careers: 'Carrières Conseillées',
    famous: 'Personnes Célèbres',
    close: 'Fermer',
    chooseA: 'A',
    chooseB: 'B',
    tip: 'Conseil : Suivez votre première impression',
    axis: 'Axe',
    axisEI: 'Extraversion / Introversion',
    axisSN: 'Sensation / Intuition',
    axisTF: 'Pensée / Sentiment',
    axisJP: 'Jugement / Perception',
    percentComplete: 'Complété',
    shareText: 'Je suis {type} {nickname} au test de personnalité Korelyy!',
  },
  hi: {
    title: 'व्यक्तित्व परीक्षण',
    subtitle: 'MBTI-शैली 16 व्यक्तित्व प्रकार परीक्षण',
    start: 'शुरू करें',
    next: 'अगला',
    retake: 'पुनः लें',
    progress: 'प्रगति',
    yourType: 'आपका व्यक्तित्व प्रकार',
    copyResult: 'परिणाम कॉपी करें',
    copied: 'कॉपी हुआ',
    shareResult: 'साझा करें',
    question: 'प्रश्न',
    of: '/',
    result: 'आपका परिणाम',
    strengths: 'ताकत',
    weaknesses: 'कमजोरियाँ',
    careers: 'करियर सुझाव',
    famous: 'प्रसिद्ध व्यक्ति',
    close: 'बंद करें',
    chooseA: 'A',
    chooseB: 'B',
    tip: 'सुझाव: अपनी पहली छाप पर चुनें',
    axis: 'अक्ष',
    axisEI: 'बहिर्मुखता / अंतर्मुखता',
    axisSN: 'संवेदना / अंतर्ज्ञान',
    axisTF: 'सोच / भावना',
    axisJP: 'निर्णय / धारणा',
    percentComplete: 'पूर्ण',
    shareText: 'मैं Korelyy व्यक्तित्व परीक्षण में {type} {nickname} हूँ!',
  },
  ar: {
    title: 'اختبار الشخصية',
    subtitle: 'اختبار 16 نوعاً من الشخصية بأسلوب MBTI',
    start: 'ابدأ',
    next: 'التالي',
    retake: 'إعادة',
    progress: 'التقدم',
    yourType: 'نوع شخصيتك',
    copyResult: 'نسخ النتيجة',
    copied: 'تم النسخ',
    shareResult: 'مشاركة',
    question: 'سؤال',
    of: 'من',
    result: 'نتيجتك',
    strengths: 'المقويات',
    weaknesses: 'الضعفاء',
    careers: 'الوظائف المقترحة',
    famous: 'أشخاص مشهورون',
    close: 'إغلاق',
    chooseA: 'A',
    chooseB: 'B',
    tip: 'نصيحة: اختر انطباعك الأول',
    axis: 'المحور',
    axisEI: 'انفتاح / انطواء',
    axisSN: 'حسية / حدسية',
    axisTF: 'تفكير / شعور',
    axisJP: 'حكم / إدراك',
    percentComplete: 'مكتمل',
    shareText: 'أنا {type} {nickname} في اختبار Korelyy للشخصية!',
  },
};

const QUESTIONS: Question[] = [
  {
    axis: 'EI',
    optionA: { text: '在聚会上，你总是充满活力，主动和很多人交谈', letter: 'E' },
    optionB: { text: '在聚会上，你更愿意和几个亲密的朋友深入交谈', letter: 'I' },
  },
  {
    axis: 'EI',
    optionA: { text: '经过一整天的社交活动后，你感到精力充沛', letter: 'E' },
    optionB: { text: '经过一整天的社交活动后，你需要独处来恢复精力', letter: 'I' },
  },
  {
    axis: 'SN',
    optionA: { text: '你更关注眼前的事实和具体的细节', letter: 'S' },
    optionB: { text: '你更关注未来的可能性和整体的趋势', letter: 'N' },
  },
  {
    axis: 'SN',
    optionA: { text: '你喜欢按照既定的方法做事，注重实际经验', letter: 'S' },
    optionB: { text: '你喜欢尝试新的方法，富有想象力和创造力', letter: 'N' },
  },
  {
    axis: 'TF',
    optionA: { text: '做决定时，你主要依靠逻辑和客观分析', letter: 'T' },
    optionB: { text: '做决定时，你主要依靠内心感受和他人情感', letter: 'F' },
  },
  {
    axis: 'TF',
    optionA: { text: '你认为批评应该直接坦诚，即使可能伤害感情', letter: 'T' },
    optionB: { text: '你认为批评应该委婉温和，照顾他人感受', letter: 'F' },
  },
  {
    axis: 'JP',
    optionA: { text: '你喜欢提前计划好事情，按部就班', letter: 'J' },
    optionB: { text: '你喜欢灵活应变，随机而动', letter: 'P' },
  },
  {
    axis: 'JP',
    optionA: { text: '你倾向于尽快做决定，避免拖延', letter: 'J' },
    optionB: { text: '你倾向于保持开放的选择，延后决定', letter: 'P' },
  },
  {
    axis: 'EI',
    optionA: { text: '在团队中，你喜欢成为关注的焦点', letter: 'E' },
    optionB: { text: '在团队中，你更愿意做幕后的贡献者', letter: 'I' },
  },
  {
    axis: 'SN',
    optionA: { text: '你相信眼见为实，不喜欢空想', letter: 'S' },
    optionB: { text: '你相信直觉，经常有灵光乍现的想法', letter: 'N' },
  },
];

const QUESTIONS_EN: Question[] = [
  {
    axis: 'EI',
    optionA: { text: 'At a party, you\'re energetic and talk to many people', letter: 'E' },
    optionB: { text: 'At a party, you prefer deep talks with a few close friends', letter: 'I' },
  },
  {
    axis: 'EI',
    optionA: { text: 'After a full day of socializing, you feel energized', letter: 'E' },
    optionB: { text: 'After a full day of socializing, you need alone time to recharge', letter: 'I' },
  },
  {
    axis: 'SN',
    optionA: { text: 'You focus on concrete facts and specific details', letter: 'S' },
    optionB: { text: 'You focus on future possibilities and the big picture', letter: 'N' },
  },
  {
    axis: 'SN',
    optionA: { text: 'You prefer proven methods and practical experience', letter: 'S' },
    optionB: { text: 'You love trying new approaches and being imaginative', letter: 'N' },
  },
  {
    axis: 'TF',
    optionA: { text: 'When deciding, you rely on logic and objective analysis', letter: 'T' },
    optionB: { text: 'When deciding, you rely on feelings and consider others\' emotions', letter: 'F' },
  },
  {
    axis: 'TF',
    optionA: { text: 'You believe criticism should be direct, even if it hurts', letter: 'T' },
    optionB: { text: 'You believe criticism should be gentle and considerate', letter: 'F' },
  },
  {
    axis: 'JP',
    optionA: { text: 'You like planning ahead and following a schedule', letter: 'J' },
    optionB: { text: 'You like being spontaneous and flexible', letter: 'P' },
  },
  {
    axis: 'JP',
    optionA: { text: 'You tend to decide quickly and avoid procrastination', letter: 'J' },
    optionB: { text: 'You prefer keeping options open and delaying decisions', letter: 'P' },
  },
  {
    axis: 'EI',
    optionA: { text: 'In a group, you like being the center of attention', letter: 'E' },
    optionB: { text: 'In a group, you prefer contributing from the background', letter: 'I' },
  },
  {
    axis: 'SN',
    optionA: { text: 'You trust what you can see, not abstract ideas', letter: 'S' },
    optionB: { text: 'You trust your intuition and get sudden insights', letter: 'N' },
  },
];

const PERSONALITY_TYPES: Record<string, PersonalityType> = {
  INTJ: {
    code: 'INTJ',
    nickname: { zh: '建筑师', en: 'The Architect' },
    description: {
      zh: '富有想象力和战略性的思考者，一切皆在掌握之中。你是独立的战略家，善于分析复杂问题，制定长远规划。',
      en: 'Imaginative and strategic thinker with everything under control. You are an independent strategist who excels at analyzing complex problems and planning for the long term.',
    },
    strengths: {
      zh: ['战略思维强', '独立自主', '果断决策', '高效执行'],
      en: ['Strategic thinker', 'Independent', 'Decisive', 'Efficient'],
    },
    weaknesses: {
      zh: ['过于自信', '对情感迟钝', '完美主义', '难以放松'],
      en: ['Overconfident', 'Insensitive to emotions', 'Perfectionist', 'Difficulty relaxing'],
    },
    careers: {
      zh: ['战略咨询顾问', '投资分析师', '科学研究员', '企业高管'],
      en: ['Strategy Consultant', 'Investment Analyst', 'Scientific Researcher', 'Corporate Executive'],
    },
    famous: ['Elon Musk', 'Friedrich Nietzsche', 'Catherine the Great'],
    gradient: 'from-indigo-500 to-purple-600',
  },
  INTP: {
    code: 'INTP',
    nickname: { zh: '逻辑学家', en: 'The Logician' },
    description: {
      zh: '富有创造力的发明家，对知识有着止不住的渴望。你是理论思想家，热衷于探索世界的原理和逻辑。',
      en: 'Innovative inventor with an unquenchable thirst for knowledge. You are a theoretical thinker passionate about exploring the principles and logic of the world.',
    },
    strengths: {
      zh: ['逻辑分析能力强', '求知欲旺盛', '富有创新', '客观理性'],
      en: ['Strong analytical skills', 'Insatiable curiosity', 'Innovative', 'Objective'],
    },
    weaknesses: {
      zh: ['易走神', '不切实际', '社交困难', '情绪化'],
      en: ['Easily distracted', 'Impractical', 'Social difficulties', 'Emotional outbursts'],
    },
    careers: {
      zh: ['哲学教授', '数学研究员', '软件架构师', '科学编辑'],
      en: ['Philosophy Professor', 'Math Researcher', 'Software Architect', 'Science Editor'],
    },
    famous: ['Albert Einstein', 'Charles Darwin', 'Bill Gates'],
    gradient: 'from-violet-500 to-fuchsia-500',
  },
  ENTJ: {
    code: 'ENTJ',
    nickname: { zh: '指挥官', en: 'The Commander' },
    description: {
      zh: '大胆、富有想象力的强势领导者，总能找到或创造解决方法。你天生具有领导魅力，善于组织和指挥他人。',
      en: 'Bold, imaginative and strong-willed leader who always finds or creates solutions. You are a natural leader with charisma who excels at organizing and directing others.',
    },
    strengths: {
      zh: ['天生领导者', '高效果断', '战略思维', '直接坦诚'],
      en: ['Natural leader', 'Efficient and decisive', 'Strategic mindset', 'Direct and honest'],
    },
    weaknesses: {
      zh: ['固执己见', '缺乏耐心', '情感迟钝', '傲慢自大'],
      en: ['Stubborn', 'Impatient', 'Insensitive', 'Arrogant'],
    },
    careers: {
      zh: ['企业CEO', '律师', '管理顾问', '政治家'],
      en: ['CEO', 'Lawyer', 'Management Consultant', 'Politician'],
    },
    famous: ['Steve Jobs', 'Margaret Thatcher', 'Napoleon Bonaparte'],
    gradient: 'from-red-500 to-orange-500',
  },
  ENTP: {
    code: 'ENTP',
    nickname: { zh: '辩论家', en: 'The Debater' },
    description: {
      zh: '聪明好奇的思想家，无法拒绝智力挑战。你机敏过人，善于辩论，喜欢探索新想法。',
      en: 'Smart and curious thinker who can\'t resist an intellectual challenge. You are quick-witted, love debating, and enjoy exploring new ideas.',
    },
    strengths: {
      zh: ['思维敏捷', '善于辩论', '富有创造力', '适应力强'],
      en: ['Quick thinker', 'Skilled debater', 'Creative', 'Adaptable'],
    },
    weaknesses: {
      zh: ['难以集中注意力', '好争论', '不敏感', '难以完成任务'],
      en: ['Difficulty focusing', 'Argumentative', 'Insensitive', 'Task completion issues'],
    },
    careers: {
      zh: ['律师', '企业家', '产品经理', '创意总监'],
      en: ['Lawyer', 'Entrepreneur', 'Product Manager', 'Creative Director'],
    },
    famous: ['Leonardo da Vinci', 'Mark Twain', 'Robert Downey Jr.'],
    gradient: 'from-amber-500 to-yellow-500',
  },
  INFJ: {
    code: 'INFJ',
    nickname: { zh: '提倡者', en: 'The Advocate' },
    description: {
      zh: '安静而神秘，同时鼓舞他人的理想主义者。你富有洞察力，关注人类福祉，有强烈的使命感。',
      en: 'Quiet and mysterious, yet inspiring idealist. You are insightful, concerned about human welfare, and have a strong sense of purpose.',
    },
    strengths: {
      zh: ['富有洞察力', '有使命感', '富有同情心', '富有创造力'],
      en: ['Insightful', 'Purpose-driven', 'Compassionate', 'Creative'],
    },
    weaknesses: {
      zh: ['易精神耗竭', '过分追求完美', '难以表达情感', '容易受伤'],
      en: ['Prone to burnout', 'Perfectionistic', 'Difficulty expressing feelings', 'Easily hurt'],
    },
    careers: {
      zh: ['心理咨询师', '作家', '人力资源', '非营利组织领导'],
      en: ['Counselor', 'Writer', 'HR Professional', 'Nonprofit Leader'],
    },
    famous: ['Carl Jung', 'Martin Luther King Jr.', 'Plato'],
    gradient: 'from-teal-500 to-emerald-500',
  },
  INFP: {
    code: 'INFP',
    nickname: { zh: '调停者', en: 'The Mediator' },
    description: {
      zh: '诗意、善良的利他主义者，总是热情地为正义事业提供支持。你内心丰富，富有想象力，追求真实与和谐。',
      en: 'Poetic, kind and altruistic, always eager to support good causes. You have a rich inner world, are imaginative, and value authenticity and harmony.',
    },
    strengths: {
      zh: ['富有同情心', '富有想象力', '忠诚执着', '开放包容'],
      en: ['Compassionate', 'Imaginative', 'Loyal', 'Open-minded'],
    },
    weaknesses: {
      zh: ['过度理想化', '易情绪化', '难以相处', '容易压力过大'],
      en: ['Overly idealistic', 'Emotional', 'Difficult to get along with', 'Easily stressed'],
    },
    careers: {
      zh: ['心理咨询师', '作家/诗人', '社会工作者', '艺术治疗师'],
      en: ['Counselor', 'Writer/Poet', 'Social Worker', 'Art Therapist'],
    },
    famous: ['William Shakespeare', 'J.K. Rowling', 'Vincent van Gogh'],
    gradient: 'from-pink-500 to-rose-500',
  },
  ENFJ: {
    code: 'ENFJ',
    nickname: { zh: '主人公', en: 'The Protagonist' },
    description: {
      zh: '富有魅力、鼓舞人心的领导者，有使听众着迷的能力。你温暖真诚，善于激励他人成长。',
      en: 'Charismatic and inspiring leader with the ability to captivate listeners. You are warm, genuine, and excel at motivating others to grow.',
    },
    strengths: {
      zh: ['富有魅力', '善于激励', '利他主义', '组织协调'],
      en: ['Charismatic', 'Motivational', 'Altruistic', 'Organizational'],
    },
    weaknesses: {
      zh: ['过度理想化', '容易过度投入', '难以拒绝', '自责倾向'],
      en: ['Overly idealistic', 'Overly invested', 'Difficulty saying no', 'Self-blame tendency'],
    },
    careers: {
      zh: ['教育工作者', '培训师', '人力资源经理', '公关专家'],
      en: ['Educator', 'Trainer', 'HR Manager', 'PR Specialist'],
    },
    famous: ['Barack Obama', 'Oprah Winfrey', 'Martin Luther King Jr.'],
    gradient: 'from-blue-500 to-cyan-500',
  },
  ENFP: {
    code: 'ENFP',
    nickname: { zh: '竞选者', en: 'The Campaigner' },
    description: {
      zh: '热情、有创造力、社交能力强的自由精神，总能找到理由微笑。你充满激情，善于发现生活的可能。',
      en: 'Enthusiastic, creative and sociable free spirit who always finds a reason to smile. You are passionate and excel at discovering life\'s possibilities.',
    },
    strengths: {
      zh: ['热情洋溢', '富有创造力', '善于交际', '乐观积极'],
      en: ['Enthusiastic', 'Creative', 'Sociable', 'Optimistic'],
    },
    weaknesses: {
      zh: ['难以专注', '情绪化', '压力管理差', '容易过度思考'],
      en: ['Difficulty focusing', 'Emotional', 'Poor stress management', 'Overthinking'],
    },
    careers: {
      zh: ['记者', '营销经理', '心理咨询师', '品牌策略师'],
      en: ['Journalist', 'Marketing Manager', 'Counselor', 'Brand Strategist'],
    },
    famous: ['Robin Williams', 'Walt Disney', 'Dalai Lama'],
    gradient: 'from-orange-500 to-pink-500',
  },
  ISTJ: {
    code: 'ISTJ',
    nickname: { zh: '物流师', en: 'The Logistician' },
    description: {
      zh: '实际且注重事实的个人，可靠性毋庸置疑。你是负责任的执行者，尊重传统，追求精确。',
      en: 'Practical and fact-minded individual, reliability beyond doubt. You are a responsible executor who respects traditions and values precision.',
    },
    strengths: {
      zh: ['可靠稳重', '注重细节', '责任心强', '忠诚执着'],
      en: ['Reliable', 'Detail-oriented', 'Responsible', 'Loyal'],
    },
    weaknesses: {
      zh: ['固执守旧', '情感表达少', '缺乏变通', '过于严肃'],
      en: ['Rigid', 'Limited emotional expression', 'Inflexible', 'Too serious'],
    },
    careers: {
      zh: ['会计师', '审计师', '数据库管理员', '项目经理'],
      en: ['Accountant', 'Auditor', 'Database Administrator', 'Project Manager'],
    },
    famous: ['George Washington', 'Warren Buffett', 'Angela Merkel'],
    gradient: 'from-slate-500 to-gray-600',
  },
  ISFJ: {
    code: 'ISFJ',
    nickname: { zh: '守卫者', en: 'The Defender' },
    description: {
      zh: '非常专注、温暖的守护者，时刻准备着保护需要帮助的人。你默默奉献，细心体贴。',
      en: 'Very dedicated and warm protector, always ready to defend those in need. You give quietly and are attentive and considerate.',
    },
    strengths: {
      zh: ['体贴关怀', '可靠奉献', '注重细节', '有耐心'],
      en: ['Caring', 'Reliable', 'Detail-oriented', 'Patient'],
    },
    weaknesses: {
      zh: ['压抑自我', '难以表达', '过于担心', '容易妥协'],
      en: ['Self-suppressing', 'Difficulty expressing', 'Worried', 'Easily compromised'],
    },
    careers: {
      zh: ['护士/助产士', '教师', '图书管理员', '人力资源'],
      en: ['Nurse/Midwife', 'Teacher', 'Librarian', 'HR Professional'],
    },
    famous: ['Mother Teresa', 'Kate Middleton', 'Beyoncé'],
    gradient: 'from-green-500 to-teal-500',
  },
  ESTJ: {
    code: 'ESTJ',
    nickname: { zh: '总经理', en: 'The Executive' },
    description: {
      zh: '出色的管理者，在管理事情或人员方面无与伦比。你组织有序，务实高效，是天生的执行者。',
      en: 'Excellent administrator, unmatched at managing things or people. You are organized, pragmatic, and a natural executor.',
    },
    strengths: {
      zh: ['组织能力强', '务实高效', '果断坚定', '忠诚正直'],
      en: ['Strong organizer', 'Practical', 'Decisive', 'Loyal and honest'],
    },
    weaknesses: {
      zh: ['固执己见', '缺乏灵活', '情感迟钝', '难以放松'],
      en: ['Stubborn', 'Inflexible', 'Insensitive', 'Difficulty relaxing'],
    },
    careers: {
      zh: ['运营总监', '审计师', '军官', '法官'],
      en: ['COO', 'Auditor', 'Military Officer', 'Judge'],
    },
    famous: ['Frank Sinatra', 'Michelle Obama', 'Henry Ford'],
    gradient: 'from-red-600 to-rose-600',
  },
  ESFJ: {
    code: 'ESFJ',
    nickname: { zh: '执政官', en: 'The Consul' },
    description: {
      zh: '极有同情心、受欢迎的人，总是热心帮助他人。你善于照顾他人，是群体中的核心人物。',
      en: 'Extraordinarily caring and popular, always eager to help. You excel at looking after others and are the core of any group.',
    },
    strengths: {
      zh: ['富有同情心', '善于交际', '负责任', '忠诚执着'],
      en: ['Compassionate', 'Sociable', 'Responsible', 'Loyal'],
    },
    weaknesses: {
      zh: ['过度在意他人评价', '难以独处', '容易被操纵', '回避冲突'],
      en: ['Overly concerned with others\' opinions', 'Difficulty being alone', 'Easily manipulated', 'Avoids conflict'],
    },
    careers: {
      zh: ['人力资源经理', '活动策划', '护理管理', '公关经理'],
      en: ['HR Manager', 'Event Planner', 'Nursing Manager', 'PR Manager'],
    },
    famous: ['Taylor Swift', 'Bill Clinton', 'Jennifer Garner'],
    gradient: 'from-pink-400 to-rose-400',
  },
  ISTP: {
    code: 'ISTP',
    nickname: { zh: '鉴赏家', en: 'The Virtuoso' },
    description: {
      zh: '大胆而实际的实验家，擅长使用任何形式的工具。你冷静理性，善于动手解决问题。',
      en: 'Bold and practical experimenter, master of all kinds of tools. You are calm, rational, and excel at hands-on problem solving.',
    },
    strengths: {
      zh: ['动手能力强', '冷静理性', '适应力强', '观察力敏锐'],
      en: ['Hands-on', 'Calm and rational', 'Adaptable', 'Keen observer'],
    },
    weaknesses: {
      zh: ['情感表达少', '难以承诺', '易冲动', '回避长期计划'],
      en: ['Limited emotional expression', 'Difficulty committing', 'Impulsive', 'Avoids long-term plans'],
    },
    careers: {
      zh: ['机械工程师', '飞行员', '侦探', '急救医护'],
      en: ['Mechanical Engineer', 'Pilot', 'Detective', 'Paramedic'],
    },
    famous: ['Clint Eastwood', 'Michael Jordan', 'Tom Cruise'],
    gradient: 'from-stone-500 to-neutral-600',
  },
  ISFP: {
    code: 'ISFP',
    nickname: { zh: '探险家', en: 'The Adventurer' },
    description: {
      zh: '灵活、迷人的艺术家，时刻准备着探索新的可能性。你温柔体贴，热爱自由，用感官体验世界。',
      en: 'Flexible and charming artist, always ready to explore new possibilities. You are gentle, love freedom, and experience the world through your senses.',
    },
    strengths: {
      zh: ['温柔体贴', '富有艺术气质', '灵活适应', '富有同情心'],
      en: ['Gentle', 'Artistic', 'Flexible', 'Compassionate'],
    },
    weaknesses: {
      zh: ['压力承受弱', '难以拒绝', '回避冲突', '缺乏自信'],
      en: ['Poor stress tolerance', 'Difficulty saying no', 'Avoids conflict', 'Lack of confidence'],
    },
    careers: {
      zh: ['艺术家/设计师', '心理咨询师', '兽医', '音乐治疗师'],
      en: ['Artist/Designer', 'Counselor', 'Veterinarian', 'Music Therapist'],
    },
    famous: ['Michael Jackson', 'Bob Dylan', 'Britney Spears'],
    gradient: 'from-lime-500 to-green-500',
  },
  ESTP: {
    code: 'ESTP',
    nickname: { zh: '企业家', en: 'The Entrepreneur' },
    description: {
      zh: '聪明、精力充沛、善于感知的人，真心享受生活在边缘。你充满行动力，善于抓住机遇。',
      en: 'Smart, energetic and perceptive, truly enjoys living on the edge. You are full of drive and excel at seizing opportunities.',
    },
    strengths: {
      zh: ['行动力强', '善于交际', '观察敏锐', '大胆无畏'],
      en: ['Energetic', 'Sociable', 'Perceptive', 'Bold'],
    },
    weaknesses: {
      zh: ['缺乏耐心', '回避长期规划', '易冲动', '对他人感受迟钝'],
      en: ['Impatient', 'Avoids long-term planning', 'Impulsive', 'Insensitive to others'],
    },
    careers: {
      zh: ['销售总监', '应急响应', '警察/侦探', '企业家'],
      en: ['Sales Director', 'First Responder', 'Police/Detective', 'Entrepreneur'],
    },
    famous: ['Madonna', 'Bruce Willis', 'Donald Trump'],
    gradient: 'from-red-500 to-orange-400',
  },
  ESFP: {
    code: 'ESFP',
    nickname: { zh: '表演者', en: 'The Entertainer' },
    description: {
      zh: '自发的、精力充沛而热情的表演者——生活在他们周围永远不会无聊。你是人群中的明星。',
      en: 'Spontaneous, energetic and enthusiastic entertainer — life is never boring around them. You are the star of any gathering.',
    },
    strengths: {
      zh: ['热情洋溢', '善于交际', '乐观积极', '实用灵活'],
      en: ['Enthusiastic', 'Sociable', 'Optimistic', 'Practical and flexible'],
    },
    weaknesses: {
      zh: ['缺乏计划性', '回避严肃话题', '容易冲动', '对长期承诺不适'],
      en: ['Lacks planning', 'Avoids serious topics', 'Impulsive', 'Uncomfortable with long-term commitments'],
    },
    careers: {
      zh: ['活动策划', '演员/表演', '导游', '健身教练'],
      en: ['Event Planner', 'Actor/Performer', 'Tour Guide', 'Fitness Coach'],
    },
    famous: ['Marilyn Monroe', 'Elvis Presley', 'Adele'],
    gradient: 'from-yellow-400 to-orange-400',
  },
};

export default function PersonalityTest({ locale = 'zh' }: PersonalityTestProps) {
  const t = i18n[locale] || i18n.zh;
  const isRTL = locale === 'ar';
  const questions = locale === 'en' ? QUESTIONS_EN : QUESTIONS;

  const [phase, setPhase] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Letter[]>([]);
  const [copied, setCopied] = useState(false);

  const progress = phase === 'quiz' ? (currentIdx / questions.length) * 100 : phase === 'result' ? 100 : 0;

  const result = useMemo(() => {
    if (phase !== 'result' || answers.length < questions.length) return null;
    const scores: Record<Letter, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    answers.forEach((letter) => {
      scores[letter]++;
    });
    const code =
      (scores.E >= scores.I ? 'E' : 'I') +
      (scores.S >= scores.N ? 'S' : 'N') +
      (scores.T >= scores.F ? 'T' : 'F') +
      (scores.J >= scores.P ? 'J' : 'P');
    return PERSONALITY_TYPES[code] || PERSONALITY_TYPES['INTJ'];
  }, [phase, answers, questions.length]);

  const handleAnswer = (letter: Letter) => {
    const newAnswers = [...answers, letter];
    setAnswers(newAnswers);
    if (currentIdx + 1 >= questions.length) {
      setPhase('result');
    } else {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handleRestart = () => {
    setPhase('intro');
    setCurrentIdx(0);
    setAnswers([]);
  };

  const handleCopyResult = async () => {
    if (!result) return;
    const nickname = locale === 'en' ? result.nickname.en : result.nickname.zh;
    const text = t.shareText
      .replace('{type}', result.code)
      .replace('{nickname}', nickname);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const currentQ = questions[currentIdx];

  return (
    <div className="max-w-3xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{t.title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{t.subtitle}</p>
      </div>

      {phase === 'intro' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {questions.length} {t.question.toLowerCase()}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 text-xs">
            <div className="rounded-lg bg-gray-50 dark:bg-gray-700 p-3">
              <div className="font-semibold text-gray-700 dark:text-gray-200">E/I</div>
              <div className="text-gray-500 dark:text-gray-400">{t.axisEI}</div>
            </div>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-700 p-3">
              <div className="font-semibold text-gray-700 dark:text-gray-200">S/N</div>
              <div className="text-gray-500 dark:text-gray-400">{t.axisSN}</div>
            </div>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-700 p-3">
              <div className="font-semibold text-gray-700 dark:text-gray-200">T/F</div>
              <div className="text-gray-500 dark:text-gray-400">{t.axisTF}</div>
            </div>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-700 p-3">
              <div className="font-semibold text-gray-700 dark:text-gray-200">J/P</div>
              <div className="text-gray-500 dark:text-gray-400">{t.axisJP}</div>
            </div>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4 italic">{t.tip}</p>
          <button
            onClick={() => setPhase('quiz')}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium rounded-xl hover:from-violet-600 hover:to-purple-700 transition shadow-lg shadow-purple-500/25"
          >
            {t.start}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {phase === 'quiz' && currentQ && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {t.question} {currentIdx + 1} {t.of} {questions.length}
              </span>
              <span className="text-sm font-medium text-violet-600 dark:text-violet-400">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="min-h-[120px] flex items-center justify-center mb-6">
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100 text-center leading-relaxed">
              {currentQ.optionA.text.replace(/^./, '')}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handleAnswer(currentQ.optionA.letter)}
              className="w-full group flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-violet-400 dark:hover:border-violet-500 bg-white dark:bg-gray-900 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition text-left"
            >
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white font-bold flex items-center justify-center">
                {t.chooseA}
              </span>
              <span className="flex-1 text-gray-800 dark:text-gray-200">{currentQ.optionA.text}</span>
            </button>

            <button
              onClick={() => handleAnswer(currentQ.optionB.letter)}
              className="w-full group flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-violet-400 dark:hover:border-violet-500 bg-white dark:bg-gray-900 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition text-left"
            >
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white font-bold flex items-center justify-center">
                {t.chooseB}
              </span>
              <span className="flex-1 text-gray-800 dark:text-gray-200">{currentQ.optionB.text}</span>
            </button>
          </div>
        </div>
      )}

      {phase === 'result' && result && (
        <div className="space-y-4">
          <div className={`rounded-2xl bg-gradient-to-br ${result.gradient} p-6 text-white shadow-lg`}>
            <div className="text-center">
              <p className="text-sm opacity-80 mb-1">{t.yourType}</p>
              <h3 className="text-5xl font-bold mb-2 tracking-wider">{result.code}</h3>
              <p className="text-xl font-medium opacity-90">
                {locale === 'en' ? result.nickname.en : result.nickname.zh}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
              <Sparkles size={16} className="text-violet-500" />
              {t.result}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {locale === 'en' ? result.description.en : result.description.zh}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-3">
                <Heart size={16} />
                {t.strengths}
              </h4>
              <ul className="space-y-1.5">
                {(locale === 'en' ? result.strengths.en : result.strengths.zh).map((s, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400 mb-3">
                <Sparkles size={16} />
                {t.weaknesses}
              </h4>
              <ul className="space-y-1.5">
                {(locale === 'en' ? result.weaknesses.en : result.weaknesses.zh).map((s, i) => (
                  <li key={i} className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-sky-600 dark:text-sky-400 mb-3">
                <Briefcase size={16} />
                {t.careers}
              </h4>
              <div className="flex flex-wrap gap-2">
                {(locale === 'en' ? result.careers.en : result.careers.zh).map((c, i) => (
                  <span key={i} className="px-2.5 py-1 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 rounded-lg text-xs">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm">
              <h4 className="flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-400 mb-3">
                <Sparkles size={16} />
                {t.famous}
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.famous.map((f, i) => (
                  <span key={i} className="px-2.5 py-1 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 rounded-lg text-xs">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={handleRestart}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition min-h-[44px] font-medium"
            >
              <RotateCcw size={18} />
              {t.retake}
            </button>
            <button
              onClick={handleCopyResult}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-500 text-white hover:bg-violet-600 transition min-h-[44px] font-medium shadow-md"
            >
              {copied ? <Check size={18} /> : <Share2 size={18} />}
              {copied ? t.copied : t.shareResult}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}