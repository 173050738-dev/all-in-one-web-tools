const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'tools-index.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const newTools = [
  {
    "id": "task-breakdown",
    "slug": "task-breakdown",
    "name": "任务拆解器",
    "description": "将模糊目标拆解为可执行步骤，智能分析任务并生成详细执行计划。",
    "category": "productivity",
    "tags": ["任务", "拆解", "计划", "生产力", "AI"],
    "nameEn": "Task Breaker",
    "descriptionEn": "Break down vague goals into actionable steps with AI-powered analysis.",
    "tagsEn": ["Task", "Breakdown", "Planning", "Productivity", "AI"],
    "isFree": true,
    "icon": "ListTodo",
    "likes": 0,
    "difficulty": "easy",
    "complianceLevel": "green",
    "accessTag": "direct",
    "localProcessing": false
  },
  {
    "id": "tone-changer",
    "slug": "tone-changer",
    "name": "语气转换器",
    "description": "一键改变文本语气风格，支持正式、友好、简洁、幽默、说服等多种语气。",
    "category": "writing-tools",
    "tags": ["语气", "写作", "文案", "AI", "转换"],
    "nameEn": "Tone Shifter",
    "descriptionEn": "Change text tone instantly, supports formal, friendly, concise, humorous tones.",
    "tagsEn": ["Tone", "Writing", "Copywriting", "AI", "Transform"],
    "isFree": true,
    "icon": "MessageSquare",
    "likes": 0,
    "difficulty": "easy",
    "complianceLevel": "green",
    "accessTag": "direct",
    "localProcessing": false
  },
  {
    "id": "focus-timer",
    "slug": "focus-timer",
    "name": "专注计时器",
    "description": "番茄工作法计时器，支持自定义工作/休息时长，帮助提升专注力和工作效率。",
    "category": "productivity",
    "tags": ["专注", "番茄钟", "计时器", "效率", "工作"],
    "nameEn": "Focus Timer",
    "descriptionEn": "Pomodoro technique timer with customizable work/rest intervals for better focus.",
    "tagsEn": ["Focus", "Pomodoro", "Timer", "Productivity", "Work"],
    "isFree": true,
    "icon": "Clock",
    "likes": 0,
    "difficulty": "easy",
    "complianceLevel": "green",
    "accessTag": "direct",
    "localProcessing": true
  },
  {
    "id": "concept-explain",
    "slug": "concept-explain",
    "name": "概念易懂器",
    "description": "用简单语言解释复杂概念，提供生活化类比和实际例子帮助理解。",
    "category": "education",
    "tags": ["概念", "学习", "解释", "教育", "AI"],
    "nameEn": "Concept Simplifier",
    "descriptionEn": "Explain complex concepts in simple terms with analogies and examples.",
    "tagsEn": ["Concept", "Learning", "Explain", "Education", "AI"],
    "isFree": true,
    "icon": "Lightbulb",
    "likes": 0,
    "difficulty": "easy",
    "complianceLevel": "green",
    "accessTag": "direct",
    "localProcessing": false
  },
  {
    "id": "idea-to-action",
    "slug": "idea-to-action",
    "name": "创意行动器",
    "description": "将想法转化为行动清单，智能拆解创意并生成优先级行动方案。",
    "category": "productivity",
    "tags": ["创意", "想法", "行动", "计划", "AI"],
    "nameEn": "Idea Activator",
    "descriptionEn": "Turn ideas into actionable plans with priority-based action lists.",
    "tagsEn": ["Idea", "Creative", "Action", "Planning", "AI"],
    "isFree": true,
    "icon": "Rocket",
    "likes": 0,
    "difficulty": "easy",
    "complianceLevel": "green",
    "accessTag": "direct",
    "localProcessing": false
  },
  {
    "id": "time-estimator",
    "slug": "time-estimator",
    "name": "工时预估器",
    "description": "基于经验估算任务耗时，提供乐观、实际、悲观三种估算方案。",
    "category": "productivity",
    "tags": ["时间", "预估", "工时", "计划", "效率"],
    "nameEn": "Time Estimator",
    "descriptionEn": "Estimate task duration with optimistic, realistic, and pessimistic scenarios.",
    "tagsEn": ["Time", "Estimation", "Planning", "Productivity", "Efficiency"],
    "isFree": true,
    "icon": "Calculator",
    "likes": 0,
    "difficulty": "easy",
    "complianceLevel": "green",
    "accessTag": "direct",
    "localProcessing": true
  }
];

data.push(...newTools);

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log('Added', newTools.length, 'new tools to tools-index.json');
