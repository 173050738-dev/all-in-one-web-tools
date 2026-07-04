'use client';

import { useState, useCallback } from 'react';
import { Copy, Check, RotateCcw, RefreshCw, MessageCircle, Coffee, Briefcase, Heart, Plane, Camera, PartyPopper, BookOpen } from 'lucide-react';

interface CaptionGeneratorProps {
  locale?: string;
}

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

export default function CaptionGenerator({ locale = 'zh' }: CaptionGeneratorProps) {
  const translations: Record<string, Record<string, string>> = {
    zh: {
      'action.back': '返回',
      'title': '朋友圈文案',
      'subtitle': '一键生成，拯救文案焦虑',
      'category.title': '选择分类',
      'category.travel': '旅行',
      'category.food': '美食',
      'category.love': '恋爱',
      'category.work': '工作',
      'category.daily': '日常',
      'category.holiday': '节日',
      'category.emo': 'emo',
      'category.selfie': '自拍',
      'caption.title': '{name}文案',
      'caption.placeholder': '点击下方按钮生成文案 ✨',
      'action.refresh': '换一条',
      'action.copy': '复制',
      'action.copyWithEmoji': '✨ 加表情',
      'history.title': '📝 历史记录',
      'tip': '💡 小提示：点击"加表情"可以自动添加适配的emoji哦～',
      'caption.travel.0': '风吹又日晒，自由又自在 🌿',
      'caption.travel.1': '把自己流放到世界的某个角落 🗺️',
      'caption.travel.2': '别处生活的烟火气 ✨',
      'caption.travel.3': '揣着一口袋的开心满载而归 💕',
      'caption.travel.4': '开始收藏世界 🌍',
      'caption.travel.5': '最好的时光在路上 ☀️',
      'caption.travel.6': '去不同的城市，闻不一样的味道 🏙️',
      'caption.travel.7': '人生至少要有两次冲动，一为奋不顾身的爱情，一为说走就走的旅行 ✈️',
      'caption.travel.8': '用脚步去丈量世界，用眼睛去记录风景 👣',
      'caption.travel.9': '旅行的意义不在其他，而在自己身体和心灵，必须有一个在旅行的路上 🌈',
      'caption.food.0': '好吃的东西要吃进肚子里，可爱的人要放进心里 🍜',
      'caption.food.1': '人生苦短，再来一碗 🍚',
      'caption.food.2': '今天也是碌碌无为的知食份子 🍱',
      'caption.food.3': '干饭不积极，思想有问题 🥘',
      'caption.food.4': '卡路里充值成功！🍔',
      'caption.food.5': '美食带来的快乐，有很香很香的味道 🍕',
      'caption.food.6': '恋爱可以慢慢谈，肉必须趁热吃 🥩',
      'caption.food.7': '吃货的最高境界：眼见为食 👀',
      'caption.food.8': '吃喜欢的东西，过可爱的人生 🍰',
      'caption.food.9': '天下没有不散的宴席，但如果你请客，我可以陪你多吃一会 🍻',
      'caption.love.0': '入目无别人，四下皆是你 💕',
      'caption.love.1': '喜欢你，是藏不住的心动 💓',
      'caption.love.2': '你是我藏在微风里的欢喜 🍃',
      'caption.love.3': '和你有关的日子，都很浪漫 🌹',
      'caption.love.4': '喜欢是乍见之欢，爱是久处不厌 ❤️',
      'caption.love.5': '你是我疲惫生活里的英雄梦想 ✨',
      'caption.love.6': '你在身边，在你身边 👫',
      'caption.love.7': '从你的全世界路过，才发现你就是我的全世界 🌍',
      'caption.love.8': '我喜欢你，像风走了八千里，不问归期 🌬️',
      'caption.love.9': '月亮不会奔向你，但我会 🌙',
      'caption.work.0': '打工人，打工魂，打工都是人上人 💪',
      'caption.work.1': '今日份营业 📸',
      'caption.work.2': '工作再忙，也要记得喝水 ☕',
      'caption.work.3': '摸鱼也是一种工作态度 🐟',
      'caption.work.4': '今天也是努力搬砖的一天 🧱',
      'caption.work.5': '工资不涨，体重涨 📈',
      'caption.work.6': '上班如上坟，下班如超生 ⚰️',
      'caption.work.7': '甲方虐我千百遍，我待甲方如初恋 💼',
      'caption.work.8': '梦想还是要有的，万一实现了呢 🌟',
      'caption.work.9': '你拼命挣钱的样子虽然有些狼狈，但你自己靠自己的样子真的很美 🌸',
      'caption.daily.0': '平凡的一天，也要活得热气腾腾 ☀️',
      'caption.daily.1': '日子渺小重复，却都是幸福 🏠',
      'caption.daily.2': '把烦心事都丢进垃圾桶里 🗑️',
      'caption.daily.3': '生活原本沉闷，但跑起来就有风 🍃',
      'caption.daily.4': '今天也是好天气，适合出门搞事情 🎈',
      'caption.daily.5': '慵懒的午后，短暂的放空 ☕',
      'caption.daily.6': '记录生活里的小确幸 🌸',
      'caption.daily.7': '生活不止眼前的苟且，还有读不懂的诗和到不了的远方 📖',
      'caption.daily.8': '每天都要开心鸭 🦆',
      'caption.daily.9': '愿你每天醒来，阳光和热爱都在 ☀️',
      'caption.holiday.0': '节日快乐，永远快乐 🎉',
      'caption.holiday.1': '愿所有的美好都如约而至 🌸',
      'caption.holiday.2': '新的一年，愿日子如熹光，温柔又安详 🎊',
      'caption.holiday.3': '岁岁常欢愉，万事皆胜意 🎆',
      'caption.holiday.4': '祝你快乐，不止节日 🎁',
      'caption.holiday.5': '灯火长明，喜乐安宁 🏮',
      'caption.holiday.6': '愿新的一年，仍有阳光满路，温暖如初 ☀️',
      'caption.holiday.7': '所有的欢喜和遇见，都会在春天抵达 🌸',
      'caption.holiday.8': '祝你拥有全世界最好的答案 🌟',
      'caption.holiday.9': '愿你走出半生，归来仍是少年 🚶',
      'caption.emo.0': '有些事，我能想通，也能接受，但我还是很难过 🌧️',
      'caption.emo.1': '我没有很难过，只是很不开心 💔',
      'caption.emo.2': '成年人的崩溃，往往都是静音模式 🤫',
      'caption.emo.3': '后来我什么都有了，就是没有了我们 🕯️',
      'caption.emo.4': '最难过的，不是不曾遇见，而是遇见了，得到了，又被夺走了 💭',
      'caption.emo.5': '我在很认真的考虑要不要放弃你 🥀',
      'caption.emo.6': '你是我勇敢的原因，也是我退缩的理由 🌙',
      'caption.emo.7': '有些话藏在心里是莫大的委屈，话到嘴边又觉得无足挂齿 😔',
      'caption.emo.8': '我喝过最烈的酒，也放弃过最爱的人 🍷',
      'caption.emo.9': '故事不长，也不难讲，只不过是，相识一场，爱而不得 📖',
      'caption.selfie.0': '今天长这样 📸',
      'caption.selfie.1': '自拍是一种生活态度 ✨',
      'caption.selfie.2': '美女出门了 💃',
      'caption.selfie.3': '今日份的可爱已送达 🎀',
      'caption.selfie.4': '生活很好，我也是 🌸',
      'caption.selfie.5': '发张照片证明我还活着 😜',
      'caption.selfie.6': '不美但真实 🤳',
      'caption.selfie.7': '普通的人，普通的生活 🌈',
      'caption.selfie.8': '心有山海，静而无边 🌊',
      'caption.selfie.9': '做自己的太阳，不需要借谁的光 ☀️',
    },
    en: {
      'action.back': 'Back',
      'title': 'Social Captions',
      'subtitle': 'Generate captions instantly, beat writer\'s block',
      'category.title': 'Select Category',
      'category.travel': 'Travel',
      'category.food': 'Food',
      'category.love': 'Love',
      'category.work': 'Work',
      'category.daily': 'Daily',
      'category.holiday': 'Holiday',
      'category.emo': 'Emo',
      'category.selfie': 'Selfie',
      'caption.title': '{name} Captions',
      'caption.placeholder': 'Click the button below to generate ✨',
      'action.refresh': 'Refresh',
      'action.copy': 'Copy',
      'action.copyWithEmoji': '✨ Add Emoji',
      'history.title': '📝 History',
      'tip': '💡 Tip: Click "Add Emoji" to auto-append matching emojis!',
      'caption.travel.0': 'Free spirit under the sun and wind 🌿',
      'caption.travel.1': 'Exile myself to a corner of the world 🗺️',
      'caption.travel.2': 'The sparks of a different life ✨',
      'caption.travel.3': 'Coming back with a pocket full of joy 💕',
      'caption.travel.4': 'Starting to collect the world 🌍',
      'caption.travel.5': 'The best moments are on the road ☀️',
      'caption.travel.6': 'Different cities, different scents 🏙️',
      'caption.travel.7': 'Two impulses in life: reckless love and impromptu travel ✈️',
      'caption.travel.8': 'Measure the world with steps, capture scenery with eyes 👣',
      'caption.travel.9': 'Travel meaning: body or soul, one must be on the way 🌈',
      'caption.food.0': 'Good food in tummy, lovely person in heart 🍜',
      'caption.food.1': 'Life is short, one more bowl 🍚',
      'caption.food.2': 'Proud member of the food appreciation society 🍱',
      'caption.food.3': 'If eating is slow, something is wrong 🥘',
      'caption.food.4': 'Calorie refill successful! 🍔',
      'caption.food.5': 'The aroma of happiness from good food 🍕',
      'caption.food.6': 'Love can wait, meat must be eaten hot 🥩',
      'caption.food.7': 'Ultimate foodie: I eat, therefore I am 👀',
      'caption.food.8': 'Eat what you love, live a cute life 🍰',
      'caption.food.9': 'All good things end, but if you treat I\'ll stay longer 🍻',
      'caption.love.0': 'No one else in sight, only you everywhere 💕',
      'caption.love.1': 'Liking you is a heartbeat I can\'t hide 💓',
      'caption.love.2': 'You are my joy hidden in the breeze 🍃',
      'caption.love.3': 'Days with you are all romantic 🌹',
      'caption.love.4': 'Like is first sight, love is never tired ❤️',
      'caption.love.5': 'You are my hero dream in a tiring life ✨',
      'caption.love.6': 'You by my side, me by yours 👫',
      'caption.love.7': 'Passed through your world, found you are my world 🌍',
      'caption.love.8': 'I like you, like wind traveling 8000 miles 🌬️',
      'caption.love.9': 'Moon won\'t run to you, but I will 🌙',
      'caption.work.0': 'Grinding, grinding hard, grinders are champions 💪',
      'caption.work.1': 'Open for business today 📸',
      'caption.work.2': 'No matter how busy, remember to drink water ☕',
      'caption.work.3': 'Slacking is also a work attitude 🐟',
      'caption.work.4': 'Another day of moving bricks 🧱',
      'caption.work.5': 'Salary not growing, but my waistline is 📈',
      'caption.work.6': 'Work like funeral, off like rebirth ⚰️',
      'caption.work.7': 'Client tortures me 1000x, I treat like first love 💼',
      'caption.work.8': 'Still need dreams, just in case 🌟',
      'caption.work.9': 'Messy hustle but gorgeous self-reliance 🌸',
      'caption.daily.0': 'Ordinary day, live it steaming hot ☀️',
      'caption.daily.1': 'Tiny repeated days, all happiness 🏠',
      'caption.daily.2': 'Throw worries into the trash bin 🗑️',
      'caption.daily.3': 'Life was dull, running brings wind 🍃',
      'caption.daily.4': 'Good weather today, good time for mischief 🎈',
      'caption.daily.5': 'Lazy afternoon, brief escape ☕',
      'caption.daily.6': 'Recording little moments of joy 🌸',
      'caption.daily.7': 'Beyond survival: poetry and unreachable distance 📖',
      'caption.daily.8': 'Stay happy every day 🦆',
      'caption.daily.9': 'Wake up to sunshine and passion ☀️',
      'caption.holiday.0': 'Happy holidays, happy always 🎉',
      'caption.holiday.1': 'May all good things come as promised 🌸',
      'caption.holiday.2': 'New year: gentle and warm like dawn 🎊',
      'caption.holiday.3': 'Yearly joy, everything wins 🎆',
      'caption.holiday.4': 'Wishing you joy, beyond holidays 🎁',
      'caption.holiday.5': 'Lights shining, peace and joy 🏮',
      'caption.holiday.6': 'New year: sunny road, warm as ever ☀️',
      'caption.holiday.7': 'All joys and meetings arrive in spring 🌸',
      'caption.holiday.8': 'Wishing you the world\'s best answers 🌟',
      'caption.holiday.9': 'Return still young after half a life 🚶',
      'caption.emo.0': 'I understand, I accept, but still hurt 🌧️',
      'caption.emo.1': 'Not super sad, just very unhappy 💔',
      'caption.emo.2': 'Adult breakdowns are on mute 🤫',
      'caption.emo.3': 'I have everything now, except us 🕯️',
      'caption.emo.4': 'Hardest: met, earned, then taken 💭',
      'caption.emo.5': 'Seriously considering giving up on you 🥀',
      'caption.emo.6': 'You make me brave, you make me retreat 🌙',
      'caption.emo.7': 'Words trapped, too heavy to speak 😔',
      'caption.emo.8': 'Drunk strongest wine, let go dearest love 🍷',
      'caption.emo.9': 'Short story: we met, we loved, we lost 📖',
      'caption.selfie.0': 'This is me today 📸',
      'caption.selfie.1': 'Selfie is a lifestyle ✨',
      'caption.selfie.2': 'Beauty heading out 💃',
      'caption.selfie.3': 'Today\'s cuteness delivered 🎀',
      'caption.selfie.4': 'Life is good, so am I 🌸',
      'caption.selfie.5': 'Proof I\'m still alive 😜',
      'caption.selfie.6': 'Not perfect but real 🤳',
      'caption.selfie.7': 'Ordinary person, ordinary life 🌈',
      'caption.selfie.8': 'Heart like ocean, calm and vast 🌊',
      'caption.selfie.9': 'Be your own sun ☀️',
    },
    hi: {
      'action.back': 'वापस',
      'title': 'सोशल कैप्शन',
      'subtitle': 'तुरंत कैप्शन बनाएं, लेखक की ब्लॉक को हराएं',
      'category.title': 'श्रेणी चुनें',
      'category.travel': 'यात्रा',
      'category.food': 'खाना',
      'category.love': 'प्यार',
      'category.work': 'काम',
      'category.daily': 'दैनिक',
      'category.holiday': 'छुट्टी',
      'category.emo': 'उदास',
      'category.selfie': 'सेल्फी',
      'caption.title': '{name} कैप्शन',
      'caption.placeholder': 'बनाने के लिए नीचे बटन पर क्लिक करें ✨',
      'action.refresh': 'नया',
      'action.copy': 'कॉपी',
      'action.copyWithEmoji': '✨ इमोजी जोड़ें',
      'history.title': '📝 इतिहास',
      'tip': '💡 सुझाव: "इमोजी जोड़ें" पर क्लिक करें स्वचालित रूप से इमोजी जोड़ने के लिए!',
      'caption.travel.0': 'धूप और हवा में स्वतंत्र आत्मा 🌿',
      'caption.travel.1': 'खुद को दुनिया के कोने में निकालना 🗺️',
      'caption.travel.2': 'अलग जीवन की चमक ✨',
      'caption.travel.3': 'खुशियों से भरी जेब लेकर वापसी 💕',
      'caption.travel.4': 'दुनिया इकट्ठी करना शुरू 🌍',
      'caption.travel.5': 'सबसे अच्छे क्षण सड़क पर ☀️',
      'caption.travel.6': 'अलग शहर, अलग खुशबू 🏙️',
      'caption.travel.7': 'दो आवेग: प्यार और अचानक यात्रा ✈️',
      'caption.travel.8': 'कदमों से दुनिया नापें, आंखों से यादें 👣',
      'caption.travel.9': 'यात्रा का मतलब: शरीर या आत्मा, एक जरूर जाए 🌈',
      'caption.food.0': 'अच्छा खाना पेट में, प्यारा इंसान दिल में 🍜',
      'caption.food.1': 'जिंदगी छोटी है, एक और कटोरा 🍚',
      'caption.food.2': 'खाने का सम्मान करने वाला सदस्य 🍱',
      'caption.food.3': 'खाना धीमा तो समस्या है 🥘',
      'caption.food.4': 'कैलोरी रिचार्ज सफल! 🍔',
      'caption.food.5': 'अच्छे खाने की खुशबू 🍕',
      'caption.food.6': 'प्यार धीरे हो सकता है, मांस गरम खाना होगा 🥩',
      'caption.food.7': 'अंतिम खाने वाला: मैं खाता हूं इसलिए मैं हूं 👀',
      'caption.food.8': 'पसंद का खाना, प्यारी जिंदगी 🍰',
      'caption.food.9': 'सभी भोज समाप्त, पर आप बुलाएं तो और रहूं 🍻',
      'caption.love.0': 'कोई और नहीं, सिर्फ आप सब जगह 💕',
      'caption.love.1': 'आपको पसंद करना दिल की धड़कन है 💓',
      'caption.love.2': 'आप मेरी हवा में छुपी खुशी हैं 🍃',
      'caption.love.3': 'आपके साथ के दिन रोमांटिक हैं 🌹',
      'caption.love.4': 'पहली नजर पसंद, हमेशा के लिए प्यार ❤️',
      'caption.love.5': 'आप मेरी थकी जिंदगी में सपने हैं ✨',
      'caption.love.6': 'आप मेरे पास, मैं आपके पास 👫',
      'caption.love.7': 'आपकी दुनिया से गुजरा, आप मेरी दुनिया हैं 🌍',
      'caption.love.8': 'मैं आपको पसंद करता हूं, 8000 मील की हवा की तरह 🌬️',
      'caption.love.9': 'चंद्रमा आप तक नहीं भागेगा, पर मैं करूंगा 🌙',
      'caption.work.0': 'काम कर रहे हैं, मेहनत कर रहे हैं 💪',
      'caption.work.1': 'आज का व्यवसाय खुला है 📸',
      'caption.work.2': 'कितना भी व्यस्त, पानी पीना न भूलें ☕',
      'caption.work.3': 'आराम भी काम का रवैया है 🐟',
      'caption.work.4': 'ईंटें उठाने का एक और दिन 🧱',
      'caption.work.5': 'वेतन नहीं बढ़ा, कमर बढ़ गई 📈',
      'caption.work.6': 'काम अंतिम संस्कार जैसा, छुट्टी पुनर्जन्म ⚰️',
      'caption.work.7': 'ग्राहक 1000 बार सताता है, मैं पहली मोहब्बत जैसा व्यवहार करता हूं 💼',
      'caption.work.8': 'सपने होने चाहिए, कभी-कभी पूरे होते हैं 🌟',
      'caption.work.9': 'गन्दी मेहनत पर खुद पर भरोसा सुंदर 🌸',
      'caption.daily.0': 'साधारण दिन, गरमा गरम जियो ☀️',
      'caption.daily.1': 'छोटे दोहराए दिन, सब खुशी 🏠',
      'caption.daily.2': 'चिंताओं को कूड़ेदान में फेंको 🗑️',
      'caption.daily.3': 'जीवन नीरस था, दौड़ने से हवा आती है 🍃',
      'caption.daily.4': 'आज अच्छा मौसम, मस्ती का समय 🎈',
      'caption.daily.5': 'सुस्त दोपहर, थोड़ा आराम ☕',
      'caption.daily.6': 'छोटी खुशियों को याद रखना 🌸',
      'caption.daily.7': 'जीवन में कविता और दूर की जगहें भी हैं 📖',
      'caption.daily.8': 'हर दिन खुश रहो 🦆',
      'caption.daily.9': 'धूप और जुनून से जागो ☀️',
      'caption.holiday.0': 'त्योहार मुबारक, हमेशा खुश रहो 🎉',
      'caption.holiday.1': 'सभी अच्छी चीजें वादे के अनुसार आएं 🌸',
      'caption.holiday.2': 'नया साल: कोमल और गरम भोर जैसा 🎊',
      'caption.holiday.3': 'साल भर खुशी, सब कुछ सफल 🎆',
      'caption.holiday.4': 'त्योहारों से परे खुशी 🎁',
      'caption.holiday.5': 'दीपक जलते रहें, शांति और खुशी 🏮',
      'caption.holiday.6': 'नया साल: धूप वाला रास्ता, हमेशा गरम ☀️',
      'caption.holiday.7': 'सभी खुशियां और मुलाकातें वसंत में पहुंचें 🌸',
      'caption.holiday.8': 'दुनिया का सबसे अच्छा जवाब मिले 🌟',
      'caption.holiday.9': 'आधी जिंदगी के बाद भी युवा लौटें 🚶',
      'caption.emo.0': 'मैं समझता हूं, स्वीकार करता हूं, पर अभी भी दुखी हूं 🌧️',
      'caption.emo.1': 'बहुत उदास नहीं, बस बहुत नाखुश 💔',
      'caption.emo.2': 'बड़ों का टूटना मौन रहता है 🤫',
      'caption.emo.3': 'मेरे पास सब कुछ है, सिवाय हमारे 🕯️',
      'caption.emo.4': 'सबसे कठिन: मिला, पाया, फिर छीन लिया 💭',
      'caption.emo.5': 'गंभीरता से त्यागने का विचार 🥀',
      'caption.emo.6': 'आप मुझे बहादुर बनाते हैं, आप मुझे पीछे हटाते हैं 🌙',
      'caption.emo.7': 'शब्द दिल में फंसे, बोलना भारी 😔',
      'caption.emo.8': 'सबसे तेज शराब पी, सबसे प्यारे को छोड़ा 🍷',
      'caption.emo.9': 'छोटी कहानी: मिले, प्यार किया, खो दिया 📖',
      'caption.selfie.0': 'आज मैं ऐसा हूं 📸',
      'caption.selfie.1': 'सेल्फी एक जीवन शैली है ✨',
      'caption.selfie.2': 'सुंदरी निकल रही है 💃',
      'caption.selfie.3': 'आज का प्यार पहुंचा दिया 🎀',
      'caption.selfie.4': 'जिंदगी अच्छी है, मैं भी 🌸',
      'caption.selfie.5': 'सबूत हूं कि मैं जीवित हूं 😜',
      'caption.selfie.6': 'परफेक्ट नहीं पर असली 🤳',
      'caption.selfie.7': 'साधारण इंसान, साधारण जीवन 🌈',
      'caption.selfie.8': 'दिल समुद्र जैसा, शांत और विशाल 🌊',
      'caption.selfie.9': 'अपना स्वयं का सूरज बनो ☀️',
    },
    fr: {
      'action.back': 'Retour',
      'title': 'Légendes Sociales',
      'subtitle': 'Générez des légendes instantanément, vainquez le blocage de l\'écrivain',
      'category.title': 'Sélectionner une catégorie',
      'category.travel': 'Voyage',
      'category.food': 'Nourriture',
      'category.love': 'Amour',
      'category.work': 'Travail',
      'category.daily': 'Quotidien',
      'category.holiday': 'Vacances',
      'category.emo': 'Émouvant',
      'category.selfie': 'Selfie',
      'caption.title': 'Légendes {name}',
      'caption.placeholder': 'Cliquez sur le bouton ci-dessous pour générer ✨',
      'action.refresh': 'Rafraîchir',
      'action.copy': 'Copier',
      'action.copyWithEmoji': '✨ Ajouter emoji',
      'history.title': '📝 Historique',
      'tip': '💡 Astuce : Cliquez sur "Ajouter emoji" pour ajouter automatiquement des emojis adaptés !',
      'caption.travel.0': 'Esprit libre sous le soleil et le vent 🌿',
      'caption.travel.1': 'M\'exiler dans un coin du monde 🗺️',
      'caption.travel.2': 'Les étincelles d\'une vie différente ✨',
      'caption.travel.3': 'Revenir avec la poche pleine de joie 💕',
      'caption.travel.4': 'Commencer à collectionner le monde 🌍',
      'caption.travel.5': 'Les meilleurs moments sont sur la route ☀️',
      'caption.travel.6': 'Différentes villes, différents parfums 🏙️',
      'caption.travel.7': 'Deux impulsions : amour fou et voyage impromptu ✈️',
      'caption.travel.8': 'Mesurer le monde en pas, capturer le paysage en yeux 👣',
      'caption.travel.9': 'Sens du voyage : corps ou âme, l\'un doit être en chemin 🌈',
      'caption.food.0': 'Bonne nourriture au ventre, personne chère au coeur 🍜',
      'caption.food.1': 'La vie est courte, un bol de plus 🍚',
      'caption.food.2': 'Fier membre de l\'appréciation culinaire 🍱',
      'caption.food.3': 'Si manger est lent, il y a problème 🥘',
      'caption.food.4': 'Recharge calories réussie ! 🍔',
      'caption.food.5': 'L\'arôme du bonheur de la bonne cuisine 🍕',
      'caption.food.6': 'L\'amour peut attendre, la viande se mange chaude 🥩',
      'caption.food.7': 'Niveau ultime : je mange donc je suis 👀',
      'caption.food.8': 'Manger ce qu\'on aime, vivre une vie mignonne 🍰',
      'caption.food.9': 'Tout se termine, mais si vous invitez je reste 🍻',
      'caption.love.0': 'Personne d\'autre en vue, seulement vous partout 💕',
      'caption.love.1': 'Vous aimer est un coeur qui bat trop fort 💓',
      'caption.love.2': 'Vous êtes ma joie cachée dans la brise 🍃',
      'caption.love.3': 'Les jours avec vous sont tous romantiques 🌹',
      'caption.love.4': 'Aimer de prime abord, aimer sans se lasser ❤️',
      'caption.love.5': 'Vous êtes mon rêve héroïque dans une vie fatigante ✨',
      'caption.love.6': 'Vous à mes côtés, moi à vos côtés 👫',
      'caption.love.7': 'Traversé votre monde, vous êtes mon monde 🌍',
      'caption.love.8': 'Je vous aime comme le vent qui parcourt 8000 lieues 🌬️',
      'caption.love.9': 'La lune ne court pas vers vous, mais moi oui 🌙',
      'caption.work.0': 'Travail dur, travail très dur 💪',
      'caption.work.1': 'Ouvert aux affaires aujourd\'hui 📸',
      'caption.work.2': 'Quel que soit l\'occupation, boire de l\'eau ☕',
      'caption.work.3': 'La paresse est aussi une attitude 🐟',
      'caption.work.4': 'Encore un jour de briques 🧱',
      'caption.work.5': 'Salaire pas grandi, mais ma taille oui 📈',
      'caption.work.6': 'Travail comme enterrement, congé comme renaissance ⚰️',
      'caption.work.7': 'Client me torture 1000x, je le traite comme premier amour 💼',
      'caption.work.8': 'Il faut des rêves, au cas où 🌟',
      'caption.work.9': 'Bazar beau mais autonomie magnifique 🌸',
      'caption.daily.0': 'Jour ordinaire, vivez-le chaudement ☀️',
      'caption.daily.1': 'Petits jours répétés, tout bonheur 🏠',
      'caption.daily.2': 'Jetez les soucis à la poubelle 🗑️',
      'caption.daily.3': 'La vie était terne, courir apporte du vent 🍃',
      'caption.daily.4': 'Beau temps aujourd\'hui, bon moment pour malice 🎈',
      'caption.daily.5': 'Après-midi paresseux, courte évasion ☕',
      'caption.daily.6': 'Enregistrer petits moments de joie 🌸',
      'caption.daily.7': 'Au-delà : poésie et lointain inaccessible 📖',
      'caption.daily.8': 'Restez heureux chaque jour 🦆',
      'caption.daily.9': 'Réveillez-vous au soleil et à la passion ☀️',
      'caption.holiday.0': 'Joyeuses fêtes, toujours heureux 🎉',
      'caption.holiday.1': 'Que toutes choses bonnes arrivent comme prévu 🌸',
      'caption.holiday.2': 'Nouvel an : doux et chaud comme l\'aube 🎊',
      'caption.holiday.3': 'Joie annuelle, tout succès 🎆',
      'caption.holiday.4': 'Bonheur au-delà des fêtes 🎁',
      'caption.holiday.5': 'Lumières brillantes, paix et joie 🏮',
      'caption.holiday.6': 'Nouvel an : chemin ensoleillé, chaud comme toujours ☀️',
      'caption.holiday.7': 'Toutes joies et rencontres arrivent au printemps 🌸',
      'caption.holiday.8': 'Les meilleures réponses du monde pour vous 🌟',
      'caption.holiday.9': 'Revenir jeune après demi-vie 🚶',
      'caption.emo.0': 'Je comprends, j\'accepte, mais ça fait mal 🌧️',
      'caption.emo.1': 'Pas trop triste, juste très malheureux 💔',
      'caption.emo.2': 'Les effondrements adultes sont en mode silencieux 🤫',
      'caption.emo.3': 'J\'ai tout maintenant, sauf nous 🕯️',
      'caption.emo.4': 'Plus dur : rencontré, gagné, puis enlevé 💭',
      'caption.emo.5': 'Envisage sérieusement de vous abandonner 🥀',
      'caption.emo.6': 'Vous me rendez courageux, vous me faites reculer 🌙',
      'caption.emo.7': 'Mots pris dans le coeur, trop lourds à dire 😔',
      'caption.emo.8': 'Vin le plus fort bu, amour le plus cher lâché 🍷',
      'caption.emo.9': 'Petite histoire : nous nous sommes rencontrés, aimés, perdus 📖',
      'caption.selfie.0': 'Voici à quoi je ressemble aujourd\'hui 📸',
      'caption.selfie.1': 'Le selfie est un style de vie ✨',
      'caption.selfie.2': 'Beauté en sortie 💃',
      'caption.selfie.3': 'Mignonnerie d\'aujourd\'hui livrée 🎀',
      'caption.selfie.4': 'La vie est bonne, moi aussi 🌸',
      'caption.selfie.5': 'Preuve que je suis vivant 😜',
      'caption.selfie.6': 'Pas parfait mais réel 🤳',
      'caption.selfie.7': 'Personne ordinaire, vie ordinaire 🌈',
      'caption.selfie.8': 'Coeur comme océan, calme et vaste 🌊',
      'caption.selfie.9': 'Soyez votre propre soleil ☀️',
    },
    es: {
      'action.back': 'Volver',
      'title': 'Leyendas Sociales',
      'subtitle': 'Genera leyendas al instante, supera el bloqueo del escritor',
      'category.title': 'Seleccionar categoría',
      'category.travel': 'Viaje',
      'category.food': 'Comida',
      'category.love': 'Amor',
      'category.work': 'Trabajo',
      'category.daily': 'Diario',
      'category.holiday': 'Fiesta',
      'category.emo': 'Emocional',
      'category.selfie': 'Selfie',
      'caption.title': 'Leyendas de {name}',
      'caption.placeholder': 'Haz clic en el botón de abajo para generar ✨',
      'action.refresh': 'Actualizar',
      'action.copy': 'Copiar',
      'action.copyWithEmoji': '✨ Añadir emoji',
      'history.title': '📝 Historial',
      'tip': '💡 Consejo: ¡Haz clic en "Añadir emoji" para agregar emojis automáticamente!',
      'caption.travel.0': 'Espíritu libre bajo el sol y el viento 🌿',
      'caption.travel.1': 'Exiliarme a un rincón del mundo 🗺️',
      'caption.travel.2': 'Las chispas de una vida diferente ✨',
      'caption.travel.3': 'Volver con el bolsillo lleno de alegría 💕',
      'caption.travel.4': 'Empezar a coleccionar el mundo 🌍',
      'caption.travel.5': 'Los mejores momentos están en el camino ☀️',
      'caption.travel.6': 'Diferentes ciudades, diferentes aromas 🏙️',
      'caption.travel.7': 'Dos impulsos: amor imprudente y viaje improvisado ✈️',
      'caption.travel.8': 'Medir el mundo a pasos, capturar paisaje con ojos 👣',
      'caption.travel.9': 'Sentido viaje: cuerpo o alma, uno debe estar en camino 🌈',
      'caption.food.0': 'Buena comida en barriga, persona amada en corazón 🍜',
      'caption.food.1': 'La vida es corta, un tazón más 🍚',
      'caption.food.2': 'Orgulloso miembro de la apreciación culinaria 🍱',
      'caption.food.3': 'Si comer es lento, hay problema 🥘',
      'caption.food.4': '¡Recarga de calorías exitosa! 🍔',
      'caption.food.5': 'El aroma de la felicidad de la buena comida 🍕',
      'caption.food.6': 'El amor puede esperar, la carne se come caliente 🥩',
      'caption.food.7': 'Nivel máximo: como luego existo 👀',
      'caption.food.8': 'Comer lo que amas, vivir una vida linda 🍰',
      'caption.food.9': 'Todo termina, pero si invitas me quedo 🍻',
      'caption.love.0': 'Nadie más a la vista, solo tú en todas partes 💕',
      'caption.love.1': 'Gustarte es un latido que no puedo ocultar 💓',
      'caption.love.2': 'Eres mi alegría escondida en la brisa 🍃',
      'caption.love.3': 'Los días contigo son todos románticos 🌹',
      'caption.love.4': 'Gustar es primera vista, amar es no cansarse ❤️',
      'caption.love.5': 'Eres mi sueño héroe en vida agotadora ✨',
      'caption.love.6': 'Tú a mi lado, yo a tu lado 👫',
      'caption.love.7': 'Atravesé tu mundo, descubrí que eres mi mundo 🌍',
      'caption.love.8': 'Te amo como el viento que recorre 8000 kilómetros 🌬️',
      'caption.love.9': 'La luna no correrá a ti, pero yo sí 🌙',
      'caption.work.0': 'Trabajando, trabajando duro, trabajadores son campeones 💪',
      'caption.work.1': 'Abierto al negocio hoy 📸',
      'caption.work.2': 'Sin importar qué tan ocupado, recuerda beber agua ☕',
      'caption.work.3': 'La pereza también es una actitud laboral 🐟',
      'caption.work.4': 'Otro día de mover ladrillos 🧱',
      'caption.work.5': 'Salario no creció, pero mi cintura sí 📈',
      'caption.work.6': 'Trabajar como funeral, salir como renacimiento ⚰️',
      'caption.work.7': 'Cliente me tortura 1000x, lo trato como primer amor 💼',
      'caption.work.8': 'Aún se necesitan sueños, por si acaso 🌟',
      'caption.work.9': 'Lucha desordenada pero hermosa autonomía 🌸',
      'caption.daily.0': 'Día ordinario, vívalo caliente ☀️',
      'caption.daily.1': 'Días pequeños repetidos, toda felicidad 🏠',
      'caption.daily.2': 'Tiren las preocupaciones al bote de basura 🗑️',
      'caption.daily.3': 'La vida era opaca, correr trae viento 🍃',
      'caption.daily.4': 'Buen clima hoy, buen momento para travesuras 🎈',
      'caption.daily.5': 'Tarde perezosa, breve escape ☕',
      'caption.daily.6': 'Grabar pequeños momentos de alegría 🌸',
      'caption.daily.7': 'Más allá: poesía y distancia inalcanzable 📖',
      'caption.daily.8': 'Mantente feliz cada día 🦆',
      'caption.daily.9': 'Despierta con sol y pasión ☀️',
      'caption.holiday.0': 'Felices fiestas, siempre feliz 🎉',
      'caption.holiday.1': 'Que todas las cosas buenas lleguen como se prometió 🌸',
      'caption.holiday.2': 'Año nuevo: suave y cálido como el amanecer 🎊',
      'caption.holiday.3': 'Alegría anual, todo éxito 🎆',
      'caption.holiday.4': 'Felicidad más allá de las fiestas 🎁',
      'caption.holiday.5': 'Luces brillantes, paz y alegría 🏮',
      'caption.holiday.6': 'Año nuevo: camino soleado, cálido como siempre ☀️',
      'caption.holiday.7': 'Todas alegrías y encuentros llegan en primavera 🌸',
      'caption.holiday.8': 'Las mejores respuestas del mundo para ti 🌟',
      'caption.holiday.9': 'Volver joven después de media vida 🚶',
      'caption.emo.0': 'Entiendo, acepto, pero aún duele 🌧️',
      'caption.emo.1': 'No muy triste, solo muy infeliz 💔',
      'caption.emo.2': 'Los colapsos adultos son en modo silencioso 🤫',
      'caption.emo.3': 'Lo tengo todo ahora, excepto nosotros 🕯️',
      'caption.emo.4': 'Lo más duro: conocido, ganado, luego quitado 💭',
      'caption.emo.5': 'Considero seriamente abandonarte 🥀',
      'caption.emo.6': 'Tú me haces valiente, tú me haces retroceder 🌙',
      'caption.emo.7': 'Palabras atrapadas en corazón, muy pesadas para hablar 😔',
      'caption.emo.8': 'Bebí el vino más fuerte, solté el amor más querido 🍷',
      'caption.emo.9': 'Historia corta: nos conocimos, amamos, perdimos 📖',
      'caption.selfie.0': 'Así me veo hoy 📸',
      'caption.selfie.1': 'Selfie es un estilo de vida ✨',
      'caption.selfie.2': 'Belleza saliendo 💃',
      'caption.selfie.3': 'Lindura de hoy entregada 🎀',
      'caption.selfie.4': 'La vida es buena, yo también 🌸',
      'caption.selfie.5': 'Prueba de que estoy vivo 😜',
      'caption.selfie.6': 'No perfecto pero real 🤳',
      'caption.selfie.7': 'Persona ordinaria, vida ordinaria 🌈',
      'caption.selfie.8': 'Corazón como océano, tranquilo y vasto 🌊',
      'caption.selfie.9': 'Sé tu propio sol ☀️',
    },
    ar: {
      'action.back': 'رجوع',
      'title': 'تسميات التواصل الاجتماعي',
      'subtitle': 'أنشئ تسميات فوراً، تغلب على حصار الكتابة',
      'category.title': 'اختر الفئة',
      'category.travel': 'سفر',
      'category.food': 'طعام',
      'category.love': 'حب',
      'category.work': 'عمل',
      'category.daily': 'يومي',
      'category.holiday': 'عطلة',
      'category.emo': 'عاطفي',
      'category.selfie': 'سيلفي',
      'caption.title': 'تسميات {name}',
      'caption.placeholder': 'انقر على الزر أدناه للإنشاء ✨',
      'action.refresh': 'تحديث',
      'action.copy': 'نسخ',
      'action.copyWithEmoji': '✨ إضافة إيموجي',
      'history.title': '📝 السجل',
      'tip': '💡 نصيحة: انقر على "إضافة إيموجي" لإضافة إيموجيات مناسبة تلقائياً!',
      'caption.travel.0': 'روح حرة تحت الشمس والريح 🌿',
      'caption.travel.1': 'أبعِد نفسي إلى زاوية من العالم 🗺️',
      'caption.travel.2': 'شرارات حياة مختلفة ✨',
      'caption.travel.3': 'العودة وجيب مليء بالفرح 💕',
      'caption.travel.4': 'بداية جمع العالم 🌍',
      'caption.travel.5': 'أفضل اللحظات على الطريق ☀️',
      'caption.travel.6': 'مدن مختلفة، روائح مختلفة 🏙️',
      'caption.travel.7': 'اندفاعان: حب مجنون وسفر مفاجئ ✈️',
      'caption.travel.8': 'اقيس العالم بخطوات، التقط المنظر بالعيون 👣',
      'caption.travel.9': 'معنى السفر: الجسد أو الروح، واحد يجب أن يكون في الطريق 🌈',
      'caption.food.0': 'طعام لذيذ في البطن، شخص عزيز في القلب 🍜',
      'caption.food.1': 'الحياة قصيرة، وعاء آخر 🍚',
      'caption.food.2': 'عضو فخور بتذوق الطعام 🍱',
      'caption.food.3': 'إذا كان الأكل بطيئاً، هناك مشكلة 🥘',
      'caption.food.4': '!تمت إعادة شحن السعرات بنجاح 🍔',
      'caption.food.5': 'رائحة السعادة من الطعام اللذيذ 🍕',
      'caption.food.6': 'الحب ينتظر، اللحم يؤكل ساخناً 🥩',
      'caption.food.7': 'المستوى النهائي: آكل إذن أنا موجود 👀',
      'caption.food.8': 'كل ما تحب، عش حياة لطيفة 🍰',
      'caption.food.9': 'كل شيء ينتهي، لكن إذا دعوت سأبقى 🍻',
      'caption.love.0': 'لا أحد آخر في الأفق، فقط أنت في كل مكان 💕',
      'caption.love.1': 'إعجابي بك هو خفقان لا أستطيع إخفاؤه 💓',
      'caption.love.2': 'أنت فرحي المختبئ في النسيم 🍃',
      'caption.love.3': 'الأيام معك كلها رومانسية 🌹',
      'caption.love.4': 'الإعجاب أول نظرة، الحب لا يمل ❤️',
      'caption.love.5': 'أنت حلم البطل في حياة مرهقة ✨',
      'caption.love.6': 'أنت بجانبي، أنا بجانبك 👫',
      'caption.love.7': 'عبورت عالمك، اكتشفت أنك عالمي 🌍',
      'caption.love.8': 'أحبك مثل الريح التي تسير 8000 كيلومتر 🌬️',
      'caption.love.9': 'القمر لن يركض إليك، لكني سأفعل 🌙',
      'caption.work.0': 'العمل، العمل بجد، العمال أبطال 💪',
      'caption.work.1': 'مفتوح للأعمال اليوم 📸',
      'caption.work.2': 'مهما كان الانشغال، تذكر شرب الماء ☕',
      'caption.work.3': 'التسكين أيضاً موقف عمل 🐟',
      'caption.work.4': 'يوم آخر من نقل الطوب 🧱',
      'caption.work.5': 'الراتب لم يرتفع، لكن خصري نعم 📈',
      'caption.work.6': 'العمل مثل الجنازة، الخروج مثل الولادة ⚰️',
      'caption.work.7': 'العميل يعذبني 1000 مرة، أعامله كحب أول 💼',
      'caption.work.8': 'لا نزال نحتاج أحلاماً، لعلها تتحقق 🌟',
      'caption.work.9': 'كفاح متعب لكن اعتماد ذاتي رائع 🌸',
      'caption.daily.0': 'يوم عادي، عش به سخونة ☀️',
      'caption.daily.1': 'أيام صغيرة متكررة، كلها سعادة 🏠',
      'caption.daily.2': 'ارمي الهموم في سلة المهملات 🗑️',
      'caption.daily.3': 'الحياة كانت باهتة، الجري يجلب الريح 🍃',
      'caption.daily.4': 'طقس جيد اليوم، وقت للمرح 🎈',
      'caption.daily.5': 'ظهر كسول، هروب قصير ☕',
      'caption.daily.6': 'تسجيل لحظات صغيرة من الفرح 🌸',
      'caption.daily.7': 'أبعد من ذلك: الشعر والمكان البعيد الذي لا يصل 📖',
      'caption.daily.8': 'ابق سعيداً كل يوم 🦆',
      'caption.daily.9': 'استيقظ على الشمس والشغف ☀️',
      'caption.holiday.0': 'أعياد سعيدة، سعيد دائماً 🎉',
      'caption.holiday.1': 'لتحقق كل الأشياء الجيدة كما وُعدت 🌸',
      'caption.holiday.2': 'عام جديد: لطيف ودافئ مثل الفجر 🎊',
      'caption.holiday.3': 'فرح سنوي، كل شيء ناجح 🎆',
      'caption.holiday.4': 'سعادة تتجاوز الأعياد 🎁',
      'caption.holiday.5': 'أضواء ساطعة، سلام وفرح 🏮',
      'caption.holiday.6': 'عام جديد: طريق مشمس، دافئ كالمعتاد ☀️',
      'caption.holiday.7': 'كل الأفراح واللقاءات تصل في الربيع 🌸',
      'caption.holiday.8': 'أفضل إجابات العالم لك 🌟',
      'caption.holiday.9': 'العودة شاباً بعد نصف الحياة 🚶',
      'caption.emo.0': 'أفهم، أقبل، لكن ما زال يؤلمني 🌧️',
      'caption.emo.1': 'لست حزيناً جداً، فقط غير سعيد جداً 💔',
      'caption.emo.2': 'انهيارات البالغين تكون في وضع الصامت 🤫',
      'caption.emo.3': 'لدي كل شيء الآن، ماعدا نحن 🕯️',
      'caption.emo.4': 'الأصعب: التقينا، فزنا، ثم سُلبنا 💭',
      'caption.emo.5': 'أفكر بجدية في التخلي عنك 🥀',
      'caption.emo.6': 'أنت تجعلني شجاعاً، أنت تجعلني أتراجع 🌙',
      'caption.emo.7': 'كلمات محتبسة في القلب، ثقيلة جداً لنطقها 😔',
      'caption.emo.8': 'شربت أقوى خمر، تركت أحب شخص 🍷',
      'caption.emo.9': 'قصة قصيرة: تقابلنا، أحببنا، فقدنا 📖',
      'caption.selfie.0': 'هذا هو مظهري اليوم 📸',
      'caption.selfie.1': 'السيلفي نمط حياة ✨',
      'caption.selfie.2': 'جميلة تخرج 💃',
      'caption.selfie.3': 'لطافة اليوم مسلمة 🎀',
      'caption.selfie.4': 'الحياة جيدة، وأنا كذلك 🌸',
      'caption.selfie.5': 'دليل على أنني على قيد الحياة 😜',
      'caption.selfie.6': 'ليس مثالياً لكن حقيقياً 🤳',
      'caption.selfie.7': 'شخص عادي، حياة عادية 🌈',
      'caption.selfie.8': 'قلب مثل المحيط، هادئ وواسع 🌊',
      'caption.selfie.9': 'كن شمسك الخاصة ☀️',
    },
  };

  const getT = (loc: string) => {
    const dict = translations[loc] || translations.zh;
    return (key: string, vars?: Record<string, string | number>) => {
      let str = dict[key] ?? translations.zh[key] ?? key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replace(`{${k}}`, String(v));
        });
      }
      return str;
    };
  };
  const t = getT(locale);

  const categories = [
    { id: 'travel', nameKey: 'category.travel' as const, icon: Plane, color: 'from-blue-400 to-cyan-400' },
    { id: 'food', nameKey: 'category.food' as const, icon: Coffee, color: 'from-orange-400 to-red-400' },
    { id: 'love', nameKey: 'category.love' as const, icon: Heart, color: 'from-pink-400 to-rose-400' },
    { id: 'work', nameKey: 'category.work' as const, icon: Briefcase, color: 'from-purple-400 to-indigo-400' },
    { id: 'daily', nameKey: 'category.daily' as const, icon: Camera, color: 'from-green-400 to-emerald-400' },
    { id: 'holiday', nameKey: 'category.holiday' as const, icon: PartyPopper, color: 'from-yellow-400 to-orange-400' },
    { id: 'emo', nameKey: 'category.emo' as const, icon: BookOpen, color: 'from-gray-400 to-slate-500' },
    { id: 'selfie', nameKey: 'category.selfie' as const, icon: Camera, color: 'from-pink-400 to-purple-400' },
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>('daily');
  const [currentCaption, setCurrentCaption] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const generateCaption = useCallback(() => {
    const categoryCaptions = Array.from({ length: 10 }, (_, i) => t(`caption.${selectedCategory}.${i}`));
    const randomIndex = Math.floor(Math.random() * categoryCaptions.length);
    const caption = categoryCaptions[randomIndex];
    setCurrentCaption(caption);
    setCopied(false);
    
    setHistory((prev) => {
      const newHistory = [caption, ...prev.filter(c => c !== caption)];
      return newHistory.slice(0, 10);
    });
  }, [selectedCategory, t]);

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
          <span>{t('action.back')}</span>
        </button>
        <div className='flex items-center gap-3'>
          <div className='p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl text-white'>
            <MessageCircle className='h-6 w-6' />
          </div>
          <div>
            <h1 className='text-xl font-bold text-gray-900 dark:text-gray-100'>{t('title')}</h1>
            <p className='text-gray-600 dark:text-gray-400 text-sm'>{t('subtitle')}</p>
          </div>
        </div>
      </div>

      <div className='space-y-6'>
        <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
          <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3'>{t('category.title')}</h3>
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
                  <p className={`text-xs font-medium ${isSelected ? '' : 'text-gray-600 dark:text-gray-400'}`}>{t(cat.nameKey)}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100'>
              {t('caption.title', { name: selectedCat ? t(selectedCat.nameKey) : t('category.daily') })}
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
              <p className='text-gray-400 dark:text-gray-500'>{t('caption.placeholder')}</p>
            </div>
          )}

          <div className='flex gap-3'>
            <button
              onClick={generateCaption}
              className={`flex-1 py-3 bg-gradient-to-r ${selectedCat?.color || 'from-pink-500 to-rose-500'} text-white font-medium rounded-xl hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2`}
            >
              <RefreshCw className='h-5 w-5' />
              {t('action.refresh')}
            </button>
            {currentCaption && (
              <>
                <button
                  onClick={() => copyCaption(currentCaption)}
                  className='px-5 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2'
                >
                  {copied ? <Check className='h-5 w-5 text-green-500' /> : <Copy className='h-5 w-5' />}
                  {t('action.copy')}
                </button>
                <button
                  onClick={copyWithEmojis}
                  className='px-5 py-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-medium rounded-xl hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors flex items-center gap-2'
                >
                  {t('action.copyWithEmoji')}
                </button>
              </>
            )}
          </div>
        </div>

        {history.length > 0 && (
          <div className='bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700'>
            <h3 className='font-semibold text-gray-900 dark:text-gray-100 mb-3'>{t('history.title')}</h3>
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
            {t('tip')}
          </p>
        </div>
      </div>
    </div>
  );
}
