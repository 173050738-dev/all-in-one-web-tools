const fs = require('fs');
const path = require('path');

function updateTranslations(locale, translations) {
  const filePath = path.join(__dirname, '..', 'public', 'locales', locale, 'translation.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!data.tools) {
    data.tools = {};
  }
  
  Object.assign(data.tools, translations);
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Updated ${locale} translations`);
}

const enTranslations = {
  'task-breakdown': {
    name: 'Task Breaker',
    description: 'Break down vague goals into actionable steps with AI-powered analysis.',
    seo: {
      intro: 'Task Breaker is an intelligent task planning tool that automatically breaks down any vague goal or complex task into clear, actionable steps. Simply enter your goal, and AI will analyze various dimensions of the task, generating a structured execution plan to help you move from ideation to action.',
      scenarios: ['When facing a grand project goal and not knowing where to start, use it to quickly generate a step list', 'Before writing a thesis or report, break it down into small chapters and milestones', 'When collaborating in a team, break project goals into assignable specific tasks'],
      tutorial: ['Enter your goal or task description in the input box', 'Click the breakdown button, AI will automatically analyze and generate steps', 'View the generated step list and execute in order', 'Copy steps to your todo list or share with your team'],
      advantages: ['AI intelligent analysis automatically identifies key nodes and dependencies of tasks', 'Generated steps are clear and specific, ready for direct execution', 'Supports various types of tasks, from personal learning to team projects'],
      faqs: [
        { q: 'Can the steps be adjusted?', a: 'Yes, the generated steps are suggestions, and you can adjust the order or add/remove steps according to actual situations.' },
        { q: 'What types of tasks are supported?', a: 'Supports various types of tasks including study plans, project management, writing plans, travel arrangements, etc.' },
        { q: 'Is internet required?', a: 'Yes, this tool needs to call AI services for analysis and requires internet connection.' },
        { q: 'Will the generated steps be saved?', a: 'The tool does not automatically save your tasks. It is recommended to copy the steps to your todo tool for saving.' },
        { q: 'Does it support multilingual task descriptions?', a: 'Supports Chinese and English input, and generates steps in the corresponding language.' }
      ]
    }
  },
  'tone-changer': {
    name: 'Tone Shifter',
    description: 'Change text tone instantly, supports formal, friendly, concise, humorous tones.',
    seo: {
      intro: 'Tone Shifter is a text style adjustment tool that can instantly convert your text to different tone styles. Supports formal, friendly, concise, humorous, persuasive, professional and other tones, helping you convey appropriate emotions and attitudes on different occasions.',
      scenarios: ['When writing emails, adjust drafts from casual style to formal business style', 'When posting on social media, make copy more humorous or persuasive', 'When replying to customers, adjust tone to match the communication style'],
      tutorial: ['Paste the text that needs tone adjustment into the input box', 'Select the target tone style', 'Click the convert button to view the converted text', 'Copy the result or continue adjusting until satisfied'],
      advantages: ['Supports 6 commonly used tone styles, covering business, social, academic and other scenarios', 'AI intelligent conversion maintains original meaning while adjusting tone', 'Fast conversion speed, no waiting required'],
      faqs: [
        { q: 'Will the conversion change the original meaning?', a: 'No, the tool will try to maintain the original meaning and only adjust the tone and expression.' },
        { q: 'What languages are supported?', a: 'Mainly supports tone conversion for Chinese and English text.' },
        { q: 'Can I customize the tone style?', a: 'Currently provides 6 preset styles. Custom options will be considered in the future.' },
        { q: 'Is there a text length limit?', a: 'It is recommended not to exceed 1000 characters per conversion. Overly long text may affect conversion results.' },
        { q: 'Can the conversion result be edited?', a: 'Yes, the converted text can be directly edited and modified.' }
      ]
    }
  },
  'focus-timer': {
    name: 'Focus Timer',
    description: 'Pomodoro technique timer with customizable work/rest intervals for better focus.',
    seo: {
      intro: 'Focus Timer adopts the classic Pomodoro Technique to help you maintain efficient focus. Set work duration and rest duration, focus on work for 25 minutes, rest for 5 minutes, and repeat. This keeps your brain in optimal condition between focus and relaxation.',
      scenarios: ['Use the Pomodoro timer to stay focused when coding or writing documents', 'When preparing for exams, arrange study content by time periods', 'During meeting breaks, use short periods to focus on urgent tasks'],
      tutorial: ['Set work duration (default 25 minutes) and rest duration (default 5 minutes)', 'Click the start button and focus on work until the timer ends', 'After the break time ends, you will be automatically reminded to start the next round', 'You can pause or reset the timer at any time'],
      advantages: ['Runs purely locally, no internet required, does not leak your work content', 'Supports custom durations to adapt to different work rhythms', 'Simple interface design that does not distract attention'],
      faqs: [
        { q: 'What is the Pomodoro Technique?', a: 'The Pomodoro Technique is a time management method that divides work time into 25-minute pomodoro sessions, with a 5-minute break after each session, and a longer break after 4 sessions.' },
        { q: 'Will the timer make a sound when it ends?', a: 'Yes, there will be a notification sound when the timer ends to remind you to switch states.' },
        { q: 'Can it run in the background?', a: 'It can run in the background, but the timer will stop when the browser is closed.' },
        { q: 'Does it support loop mode?', a: 'Yes, it will automatically cycle through work and rest periods.' },
        { q: 'Will data be saved?', a: 'Timer data is only saved in the current session and will not be retained after closing the page.' }
      ]
    }
  },
  'concept-explain': {
    name: 'Concept Simplifier',
    description: 'Explain complex concepts in simple terms with analogies and examples.',
    seo: {
      intro: 'Concept Simplifier is a knowledge popularization tool that explains complex concepts in easy-to-understand language. Whether it is programming terminology, scientific theories or business concepts, after input, AI will use life analogies and practical examples to help you understand.',
      scenarios: ['When learning new technologies, use it to explain difficult professional terms', 'Explain concepts in your work to non-professionals', 'When tutoring children, simplify complex knowledge'],
      tutorial: ['Enter the complex concept or term you want to understand', 'Click the explain button, AI will generate an easy-to-understand explanation', 'Read the analogies and examples to deepen understanding', 'You can continue asking questions or try other concepts'],
      advantages: ['AI intelligently simplifies professional terminology into everyday language', 'Provides life analogies for easier understanding', 'Supports concept explanations in various fields'],
      faqs: [
        { q: 'What fields of concepts are supported?', a: 'Supports concept explanations in programming, science, business, law, medicine and other fields.' },
        { q: 'How is the accuracy of the explanation ensured?', a: 'Based on the knowledge reserve of the AI model, it will try its best to provide accurate explanations. However, it is recommended to refer to professional materials for important concepts.' },
        { q: 'Can Chinese concepts be explained?', a: 'Yes, supports explanation of Chinese and English concepts.' },
        { q: 'Will the explanation include examples?', a: 'Yes, it usually includes life analogies and practical examples.' },
        { q: 'Is internet required?', a: 'Yes, AI services need to be called for explanations, requiring internet connection.' }
      ]
    }
  },
  'idea-to-action': {
    name: 'Idea Activator',
    description: 'Turn ideas into actionable plans with priority-based action lists.',
    seo: {
      intro: 'Idea Activator helps you turn ideas in your mind into concrete action plans. Enter your creative idea, and AI will analyze feasibility, break it down into executable steps, and sort by priority, so your ideas no longer stay at the imagination stage.',
      scenarios: ['After brainstorming, organize scattered ideas into action plans', 'When startup ideas need to be concretized, generate implementation steps', 'When personal goals need to be broken down into executable tasks'],
      tutorial: ['Enter your creative idea or description', 'Click the convert button, AI will analyze and generate action steps', 'View the priority-sorted action list', 'Copy steps or start execution'],
      advantages: ['AI intelligently analyzes the feasibility and key steps of ideas', 'Automatically sorts by priority, do the most important things first', 'Supports various types of ideas and concepts'],
      faqs: [
        { q: 'Can the generated action steps be adjusted?', a: 'Yes, you can adjust the step order or add/remove steps according to actual situations.' },
        { q: 'How is priority determined?', a: 'Based on AI analysis of step importance and dependencies, it automatically sorts.' },
        { q: 'Does it support multi-person collaboration?', a: 'Currently it is a personal tool. It is recommended to copy steps to team collaboration tools for sharing.' },
        { q: 'Will ideas be saved?', a: 'They are not automatically saved. It is recommended to copy the results to your note-taking tool.' },
        { q: 'Can it handle complex startup projects?', a: 'It can handle them, but complex projects may require multiple breakdowns and adjustments.' }
      ]
    }
  },
  'time-estimator': {
    name: 'Time Estimator',
    description: 'Estimate task duration with optimistic, realistic, and pessimistic scenarios.',
    seo: {
      intro: 'Time Estimator helps you estimate task completion time more accurately. Based on the three-point estimation method, it provides optimistic, most likely, and pessimistic time estimates, and calculates a weighted average, helping you make more reasonable plans and expectations.',
      scenarios: ['When scheduling projects, estimate the duration of each task', 'When quoting clients, provide reasonable time estimates', 'When making personal plans, understand the time required to complete tasks'],
      tutorial: ['Enter task description', 'Enter optimistic time, most likely time, and pessimistic time respectively', 'Click the calculate button to view the estimation results', 'Use the weighted average time as reference'],
      advantages: ['Based on the classic three-point estimation method, more scientific and accurate', 'Provides three estimation scenarios to help you evaluate comprehensively', 'Pure local calculation, no internet required'],
      faqs: [
        { q: 'What is three-point estimation?', a: 'Three-point estimation is a commonly used time estimation method in project management. It calculates a weighted average time through three values: optimistic time, most likely time, and pessimistic time.' },
        { q: 'What is the time unit?', a: 'You can use any time unit (hours, days, etc.), but all three values need to use the same unit.' },
        { q: 'Is the result accurate?', a: 'The estimation result is based on the values you input. Accuracy depends on your experience and judgment.' },
        { q: 'Can estimation records be saved?', a: 'Currently not supported. It is recommended to take a screenshot or record in your project management tool.' },
        { q: 'Is internet required?', a: 'No, pure local calculation, data will not be uploaded.' }
      ]
    }
  }
};

updateTranslations('en', enTranslations);
console.log('English translations added');
