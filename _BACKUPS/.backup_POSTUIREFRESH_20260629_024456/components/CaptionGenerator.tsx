'use client';

import { useState, useCallback } from 'react';
import { Copy, Check, RotateCcw, RefreshCw, MessageCircle, Coffee, Briefcase, Heart, Plane, Camera, PartyPopper, BookOpen } from 'lucide-react';

const categories = [
  { id: 'travel', name: '旅行', icon: Plane, color: 'from-blue-400 to-cyan-400' },
  { id: 'food', name: '美食', icon: Coffee, color: 'from-orange-400 to-red-400' },
  { id: 'love', name: '恋爱', icon: Heart, color: 'from-pink-400 to-rose-400' },
  { id: 'work', name: '工作', icon: Briefcase, color: 'from-purple-400 to-indigo-400' },
  { id: 'daily', name: '日常', icon: Camera, color: 'from-green-400 to-emerald-400' },
  { id: 'holiday', name: '节日', icon: PartyPopper, color: 'from-yellow-400 to-orange-400' },
  { id: 'emo', name: 'emo', icon: BookOpen, color: 'from-gray-400 to-slate-500' },
  { id: 'selfie', name: '自拍', icon: Camera, color: 'from-pink-400 to-purple-400' },
];

const captions: Record<string, string[]> = {
  travel: [
    '风吹又日晒，自由又自在 🌿',
    '把自己流放到世界的某个角落 🗺️',
    '别处生活的烟火气 ✨',
    '揣着一口袋的开心满载而归 💕',
    '开始收藏世界 🌍',
    '最好的时光在路上 ☀️',
    '去不同的城市，闻不一样的味道 🏙️',
    '人生至少要有两次冲动，一为奋不顾身的爱情，一为说走就走的旅行 ✈️',
    '用脚步去丈量世界，用眼睛去记录风景 👣',
    '旅行的意义不在其他，而在自己身体和心灵，必须有一个在旅行的路上 🌈',
  ],
  food: [
    '好吃的东西要吃进肚子里，可爱的人要放进心里 🍜',
    '人生苦短，再来一碗 🍚',
    '今天也是碌碌无为的知食份子 🍱',
    '干饭不积极，思想有问题 🥘',
    '卡路里充值成功！🍔',
    '美食带来的快乐，有很香很香的味道 🍕',
    '恋爱可以慢慢谈，肉必须趁热吃 🥩',
    '吃货的最高境界：眼见为食 👀',
    '吃喜欢的东西，过可爱的人生 🍰',
    '天下没有不散的宴席，但如果你请客，我可以陪你多吃一会 🍻',
  ],
  love: [
    '入目无别人，四下皆是你 💕',
    '喜欢你，是藏不住的心动 💓',
    '你是我藏在微风里的欢喜 🍃',
    '和你有关的日子，都很浪漫 🌹',
    '喜欢是乍见之欢，爱是久处不厌 ❤️',
    '你是我疲惫生活里的英雄梦想 ✨',
    '你在身边，在你身边 👫',
    '从你的全世界路过，才发现你就是我的全世界 🌍',
    '我喜欢你，像风走了八千里，不问归期 🌬️',
    '月亮不会奔向你，但我会 🌙',
  ],
  work: [
    '打工人，打工魂，打工都是人上人 💪',
    '今日份营业 📸',
    '工作再忙，也要记得喝水 ☕',
    '摸鱼也是一种工作态度 🐟',
    '今天也是努力搬砖的一天 🧱',
    '工资不涨，体重涨 📈',
    '上班如上坟，下班如超生 ⚰️',
    '甲方虐我千百遍，我待甲方如初恋 💼',
    '梦想还是要有的，万一实现了呢 🌟',
    '你拼命挣钱的样子虽然有些狼狈，但你自己靠自己的样子真的很美 🌸',
  ],
  daily: [
    '平凡的一天，也要活得热气腾腾 ☀️',
    '日子渺小重复，却都是幸福 🏠',
    '把烦心事都丢进垃圾桶里 🗑️',
    '生活原本沉闷，但跑起来就有风 🍃',
    '今天也是好天气，适合出门搞事情 🎈',
    '慵懒的午后，短暂的放空 ☕',
    '记录生活里的小确幸 🌸',
    '生活不止眼前的苟且，还有读不懂的诗和到不了的远方 📖',
    '每天都要开心鸭 🦆',
    '愿你每天醒来，阳光和热爱都在 ☀️',
  ],
  holiday: [
    '节日快乐，永远快乐 🎉',
    '愿所有的美好都如约而至 🌸',
    '新的一年，愿日子如熹光，温柔又安详 🎊',
    '岁岁常欢愉，万事皆胜意 🎆',
    '祝你快乐，不止节日 🎁',
    '灯火长明，喜乐安宁 🏮',
    '愿新的一年，仍有阳光满路，温暖如初 ☀️',
    '所有的欢喜和遇见，都会在春天抵达 🌸',
    '祝你拥有全世界最好的答案 🌟',
    '愿你走出半生，归来仍是少年 🚶',
  ],
  emo: [
    '有些事，我能想通，也能接受，但我还是很难过 🌧️',
    '我没有很难过，只是很不开心 💔',
    '成年人的崩溃，往往都是静音模式 🤫',
    '后来我什么都有了，就是没有了我们 🕯️',
    '最难过的，不是不曾遇见，而是遇见了，得到了，又被夺走了 💭',
    '我在很认真的考虑要不要放弃你 🥀',
    '你是我勇敢的原因，也是我退缩的理由 🌙',
    '有些话藏在心里是莫大的委屈，话到嘴边又觉得无足挂齿 😔',
    '我喝过最烈的酒，也放弃过最爱的人 🍷',
    '故事不长，也不难讲，只不过是，相识一场，爱而不得 📖',
  ],
  selfie: [
    '今天长这样 📸',
    '自拍是一种生活态度 ✨',
    '美女出门了 💃',
    '今日份的可爱已送达 🎀',
    '生活很好，我也是 🌸',
    '发张照片证明我还活着 😜',
    '不美但真实 🤳',
    '普通的人，普通的生活 🌈',
    '心有山海，静而无边 🌊',
    '做自己的太阳，不需要借谁的光 ☀️',
  ],
};

const emojisByCategory: Record<string, string[]> = {
  travel: ['✈️', '🗺️', '🌍', '🏖️', '🏔️', '🚗', '🎒', '📸'],
  food: ['🍜', '🍔', '🍕', '🍰', '🍣', '🍱', '🥘', '🍻'],
  love: ['💕', '❤️', '🌹', '💓', '✨', '🌸', '💗', '💖'],
  work: ['💼', '☕', '💪', '📊', '🖥️', '📝', '🚀', '💡'],
  daily: ['☀️', '🌸', '🎈', '☕', '📚', '🎵', '🌿', '🌈'],
  holiday: ['🎉', '🎊', '🎁', '🏮', '🎆', '🎇', '🌟', '🥳'],
  emo: ['🌧️', '💔', '🕯️', '🌙', '🥀', '💭', '😔', '🍷'],
  selfie: ['📸', '✨', '🌸', '💄', '🎀', '😎', '🤳', '💃'],
};

export default function CaptionGenerator() {
  const [selectedCategory, setSelectedCategory] = useState<string>('daily');
  const [currentCaption, setCurrentCaption] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const generateCaption = useCallback(() => {
    const categoryCaptions = captions[selectedCategory] || captions.daily;
    const randomIndex = Math.floor(Math.random() * categoryCaptions.length);
    const caption = categoryCaptions[randomIndex];
    setCurrentCaption(caption);
    setCopied(false);
    
    setHistory((prev) => {
      const newHistory = [caption, ...prev.filter(c => c !== caption)];
      return newHistory.slice(0, 10);
    });
  }, [selectedCategory]);

  const copyCaption = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const addEmoji = useCallback((count: number = 3) => {
    const categoryEmojis = emojisByCategory[selectedCategory] || emojisByCategory.daily;
    let emojiText = '';
    for (let i = 0; i < count; i++) {
      emojiText += categoryEmojis[Math.floor(Math.random() * categoryEmojis.length)];
    }
    return emojiText;
  }, [selectedCategory]);

  const copyWithEmojis = useCallback(() => {
    const text = currentCaption + ' ' + addEmoji();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [currentCaption, addEmoji]);

  const selectedCat = categories.find(c => c.id === selectedCategory);

  return (
    <div className='max-w-4xl mx-auto px-4 py-6'>
      <div className='mb-6'>
        <button
          onClick={() => window.history.back()}
          className='flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-4'
        >
          <RotateCcw className='h-4 w-4' />
          <span>返回</span>
        </button>
        <div className='flex items-center gap-3'>
          <div className='p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl text-white'>
            <MessageCircle className='h-6 w-6' />
          </div>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>朋友圈文案</h1>
            <p className='text-gray-600 dark:text-gray-400 text-sm'>一键生成，拯救文案焦虑</p>
          </div>
        </div>
      </div>

      <div className='space-y-6'>
        <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
          <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3'>选择分类</h3>
          <div className='grid grid-cols-4 gap-2'>
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setCurrentCaption('');
                  }}
                  className={`p-3 rounded-xl transition-all ${
                    isSelected
                      ? `bg-gradient-to-br ${cat.color} text-white shadow-lg scale-105`
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className={`h-5 w-5 mx-auto mb-1 ${isSelected ? '' : 'text-gray-500 dark:text-gray-400'}`} />
                  <p className={`text-xs font-medium ${isSelected ? '' : 'text-gray-600 dark:text-gray-400'}`}>{cat.name}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100'>
              {selectedCat?.name || '日常'}文案
            </h3>
          </div>

          {currentCaption ? (
            <div
              className={`p-5 rounded-xl bg-gradient-to-br ${selectedCat?.color || 'from-gray-100 to-gray-200'} text-white mb-4`}
            >
              <p className='text-lg leading-relaxed'>{currentCaption}</p>
            </div>
          ) : (
            <div className='p-8 rounded-xl bg-gray-50 dark:bg-gray-700 text-center mb-4'>
              <p className='text-gray-400 dark:text-gray-500'>点击下方按钮生成文案 ✨</p>
            </div>
          )}

          <div className='flex gap-3'>
            <button
              onClick={generateCaption}
              className={`flex-1 py-3 bg-gradient-to-r ${selectedCat?.color || 'from-pink-500 to-rose-500'} text-white font-medium rounded-xl hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2`}
            >
              <RefreshCw className='h-5 w-5' />
              换一条
            </button>
            {currentCaption && (
              <>
                <button
                  onClick={() => copyCaption(currentCaption)}
                  className='px-5 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2'
                >
                  {copied ? <Check className='h-5 w-5 text-green-500' /> : <Copy className='h-5 w-5' />}
                  复制
                </button>
                <button
                  onClick={copyWithEmojis}
                  className='px-5 py-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-medium rounded-xl hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors flex items-center gap-2'
                >
                  ✨ 加表情
                </button>
              </>
            )}
          </div>
        </div>

        {history.length > 0 && (
          <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3'>📝 历史记录</h3>
            <div className='space-y-2 max-h-64 overflow-y-auto'>
              {history.map((item, index) => (
                <div
                  key={index}
                  className='p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-start justify-between gap-3 group'
                >
                  <p className='text-sm text-gray-700 dark:text-gray-300 flex-1'>{item}</p>
                  <button
                    onClick={() => copyCaption(item)}
                    className='p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex-shrink-0'
                  >
                    <Copy className='h-4 w-4' />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className='bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl p-4 border border-pink-100 dark:border-pink-900/30'>
          <p className='text-sm text-pink-600 dark:text-pink-400 text-center'>
            💡 小提示：点击"加表情"可以自动添加适配的emoji哦～
          </p>
        </div>
      </div>
    </div>
  );
}
