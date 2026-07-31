'use client';

import { useState, useCallback } from 'react';
import { Copy, Check, Sparkles, Moon, Cloud, Brain, BookOpen, Eye, Heart, Zap, Search, RotateCcw } from 'lucide-react';

interface Props { locale?: string; }

interface DreamSymbol {
  keywords: string[];
  zh: {
    freud: string;
    zhougong: string;
    summary: string;
  };
  en: {
    freud: string;
    zhougong: string;
    summary: string;
  };
}

const DREAM_DB: DreamSymbol[] = [
  {
    keywords: ['飞', '飞翔', '飞起来', '飞行', 'fly', 'flying', 'flight'],
    zh: {
      freud: '弗洛伊德学派认为，飞行梦反映梦者渴望摆脱束缚、追求自由的深层心理。可能暗示你在现实生活中感受到了限制，潜意识中渴望突破。飞翔的高度和姿态往往映射你对现状的掌控感。',
      zhougong: '《周公解梦》中，飞主升迁。梦见飞翔，预示事业有成，地位将获提升。若飞得轻松自如，吉兆将至；若飞翔困难，则需努力方能达成目标。',
      summary: '恭喜！飞行梦通常是最积极的梦境之一，暗示你正在成长、突破限制。',
    },
    en: {
      freud: 'Freudian interpretation suggests flying dreams reflect a deep desire for freedom and liberation from constraints. It may indicate you feel restricted in waking life and your subconscious yearns to break free. The height and ease of flight often mirror your sense of control over current circumstances.',
      zhougong: 'In Zhougong\'s traditional dream dictionary, flying signifies advancement in career or social status. Dreaming of flying predicts success and elevation. Smooth flying portends good fortune; struggling to fly suggests effort is needed.',
      summary: 'Flying is universally one of the most positive dream symbols — it suggests growth, breakthroughs, and liberation.',
    },
  },
  {
    keywords: ['水', '水', '河流', '大海', '下雨', '游泳', 'water', 'river', 'sea', 'ocean', 'rain', 'swim'],
    zh: {
      freud: '水在心理学中常代表情绪和潜意识。平静的水面象征内心平和；汹涌的波涛暗示情绪波动或潜意识中未处理的情感。游泳则反映你与当前情绪的互动方式。',
      zhougong: '《周公解梦》中，水主财。梦见清水，主有财利；梦见浑浊之水，需防破财。江河湖海的不同形态对应不同运势：江河主奔波，湖海主深远。',
      summary: '水的梦境多与情感和财运相关，具体含义取决于水的状态。',
    },
    en: {
      freud: 'Water often represents emotions and the unconscious mind in psychological dream analysis. Calm water symbolizes inner peace; turbulent waves suggest emotional upheaval or unprocessed feelings. Swimming reflects how you interact with your current emotional state.',
      zhougong: 'In traditional Chinese interpretation, water signifies wealth. Clear water predicts financial gain; muddy water warns of potential loss. Different forms of water correspond to different fortune — rivers mean movement, lakes mean depth.',
      summary: 'Water dreams relate to emotions and fortune — the interpretation depends on the water\'s condition.',
    },
  },
  {
    keywords: ['蛇', '蛇', '蟒蛇', 'snake', 'serpent', 'cobra'],
    zh: {
      freud: '蛇在弗洛伊德理论中常与性欲望和隐秘的恐惧有关。它可能代表你生活中某个让你不安的人或情境，也可能象征被压抑的欲望。蛇的行为（攻击/缠绕/逃走）反映你对这些感受的态度。',
      zhougong: '《周公解梦》中，蛇分吉凶。梦见白蛇，主得贵人相助；梦见毒蛇，需防小人暗算；梦见群蛇，主事务繁杂。蛇咬主吉，有财喜。',
      summary: '蛇的梦境含义复杂，可能暗示隐秘的欲望，也可能预示变化。',
    },
    en: {
      freud: 'In Freudian theory, snakes often relate to sexuality, hidden fears, or repressed desires. They may represent someone or something in your life that makes you uneasy. The snake\'s behavior (attacking, coiling, fleeing) reflects your attitude toward these feelings.',
      zhougong: 'Traditional Chinese interpretation divides snake dreams into auspicious and inauspicious. White snakes predict helpful mentors; venomous snakes warn of rivals; snake bites surprisingly signify good fortune.',
      summary: 'Snake dreams are complex — they can suggest hidden desires or warn of changes ahead.',
    },
  },
  {
    keywords: ['牙', '牙齿', '掉牙', '牙掉了', 'teeth', 'tooth', 'falling teeth', 'lost tooth'],
    zh: {
      freud: '掉牙是最常见的焦虑梦之一。心理学上可能与身体形象焦虑、沟通障碍或害怕失去权力有关。也可能反映你对外貌或表达能力的不安全感。',
      zhougong: '《周公解梦》中，掉牙不吉。上牙掉，主长辈有恙；下牙掉，主晚辈不安；满嘴牙掉，家宅不宁。但咬掉牙反而是吉兆，预示将摆脱灾祸。',
      summary: '掉牙梦境通常与焦虑、失去或家庭健康相关。',
    },
    en: {
      freud: 'Losing teeth is one of the most common anxiety dreams. Psychologically it may relate to body image issues, communication difficulties, or fear of losing power. It could also reflect insecurity about appearance or self-expression.',
      zhougong: 'Traditional interpretation considers teeth loss an inauspicious sign. Upper teeth falling out may indicate health issues for elders; lower teeth for younger family members. However, biting teeth off is paradoxically auspicious — it means escaping trouble.',
      summary: 'Teeth-falling dreams typically relate to anxiety, loss, or concern about family health.',
    },
  },
  {
    keywords: ['掉', '坠落', '从高处掉', '落下', 'falling', 'fall', 'drop', 'plunge'],
    zh: {
      freud: '坠落梦常与失去控制感有关。可能反映你在现实中感到无力应对某些局面，或者害怕失去社会地位、安全感。坠入无底深渊通常暗示对未知的恐惧。',
      zhougong: '《周公解梦》中，坠落主失势。梦见从高处坠落，事业可能遇阻；若落地无恙，则有惊无险。坠落而醒，主吉，灾祸已消。',
      summary: '坠落梦通常反映失控感或对变化的恐惧。',
    },
    en: {
      freud: 'Falling dreams often relate to a loss of control. They may reflect feelings of powerlessness in waking life, fear of losing status or security. Falling into a bottomless pit typically suggests fear of the unknown.',
      zhougong: 'Traditional interpretation links falling to loss of influence. Falling from heights suggests career obstacles; landing unhurt means narrowly avoiding trouble. Waking up during the fall is auspicious — danger has passed.',
      summary: 'Falling dreams reflect a sense of losing control or fear of change.',
    },
  },
  {
    keywords: ['考试', '考试', '上学', '学校', 'exam', 'test', 'school', 'class', 'study'],
    zh: {
      freud: '考试梦常见于压力情境。可能反映你在现实生活中感到被评估、被审视的焦虑，或是对自身能力的怀疑。即使已离开校园，考试梦仍可能反复出现。',
      zhougong: '《周公解梦》中，考试主名。梦见考试顺利，主有文才；梦见考试不利，需防名不副实。应试者梦之大吉，主金榜题名。',
      summary: '考试梦多与近期压力、评估或自我期望有关。',
    },
    en: {
      freud: 'Exam dreams are common during periods of stress. They may reflect feelings of being evaluated or judged in waking life, or self-doubt about your abilities. These dreams often recur even years after leaving school.',
      zhougong: 'Traditional interpretation associates exams with reputation. Smooth exams predict literary success; difficult exams suggest unmet expectations. For students, exam dreams are very auspicious — they predict passing.',
      summary: 'Exam dreams often relate to recent stress, evaluation, or self-expectations.',
    },
  },
  {
    keywords: ['死', '死亡', '死人', '去世', 'death', 'die', 'dying', 'funeral'],
    zh: {
      freud: '死亡梦并非预示真实死亡。心理学上可能代表某种旧阶段的结束和新阶段的开始，或是对失去某人/某物的深切渴望与恐惧。梦中的"死者"往往代表你想告别或保留的某部分自我。',
      zhougong: '《周公解梦》中，死亡反而是吉兆。梦见自己死，主寿命延长；梦见亲人死，主其康健；梦见白事，有喜事将至。',
      summary: '死亡梦通常象征结束与重生，是积极的转变信号。',
    },
    en: {
      freud: 'Death dreams do not predict actual death. Psychologically they often represent the end of one phase and beginning of another, or deep longing and fear of losing someone/something. The "deceased" in dreams often represents a part of yourself you wish to release or preserve.',
      zhougong: 'Traditional Chinese interpretation sees death dreams as auspicious. Dreaming of your own death predicts longevity; dreaming of a loved one\'s death means they will be healthy; funeral dreams precede happy events.',
      summary: 'Death dreams typically symbolize endings and rebirth — they signal positive transformation.',
    },
  },
  {
    keywords: ['被追', '追逐', '逃跑', '追赶', 'chase', 'pursued', 'flee', 'running away'],
    zh: {
      freud: '被追梦反映你在现实中试图回避某件事。可能是某个未解决的问题、某种情绪，或某个你不想面对的人。追赶者往往代表你自身的某个方面。',
      zhougong: '《周公解梦》中，被追主吉。梦见被人追，有贵人相助；梦见被动物追，需防小人。追上者吉，被追者凶。',
      summary: '被追梦暗示你在回避某件需要面对的事情。',
    },
    en: {
      freud: 'Being chased in dreams reflects avoidance in waking life. You may be trying to escape from an unresolved issue, emotion, or person. The chaser often represents an aspect of yourself.',
      zhougong: 'Traditional interpretation considers being chased auspicious. Being chased by people predicts helpful allies; being chased by animals warns of rivals. Catching the chaser is lucky; being caught is inauspicious.',
      summary: 'Chase dreams suggest you\'re avoiding something that needs to be faced.',
    },
  },
  {
    keywords: ['迷路', '迷路', '找不到路', '迷失', 'lost', 'lost way', 'direction', 'maze'],
    zh: {
      freud: '迷路梦可能反映你对人生方向的迷茫。你可能正处于选择或转变期，不确定该走向何方。城市迷宫式的迷路常与社交或职业身份困惑相关。',
      zhougong: '《周公解梦》中，迷路主困惑。梦见迷路，需防决策失误；若找到出路，困境将解。梦见在山林迷路，主有奇遇。',
      summary: '迷路梦反映你正在经历人生方向的选择与迷茫。',
    },
    en: {
      freud: 'Getting lost in dreams may reflect confusion about life direction. You may be in a period of transition or choice, uncertain about which path to take. Urban mazes often relate to social or professional identity confusion.',
      zhougong: 'Traditional interpretation links being lost to confusion. Getting lost warns against poor decisions; finding the way out means difficulties will resolve. Lost in mountains means unexpected encounters.',
      summary: 'Lost dreams reflect navigating life transitions and uncertainty.',
    },
  },
  {
    keywords: ['掉头发', '秃头', '头发', 'hair', 'bald', 'hair loss'],
    zh: {
      freud: '掉头发梦与自信心、外貌焦虑或力量丧失感相关。可能反映你对自身魅力或能力的担忧，也可能是对衰老的恐惧。',
      zhougong: '《周公解梦》中，掉头发主忧愁。梦见头发脱落，主有烦心事；若掉而复生，忧愁将散。梦见白发，主长寿。',
      summary: '掉头发梦多与自信、外貌或年龄焦虑相关。',
    },
    en: {
      freud: 'Hair loss dreams relate to self-confidence, body image anxiety, or feelings of powerlessness. They may reflect concerns about attractiveness, capability, or fear of aging.',
      zhougong: 'Traditional interpretation associates hair loss with sorrow. Falling hair predicts worries; regrowing hair means troubles will pass. White hair in dreams signifies longevity.',
      summary: 'Hair loss dreams often relate to confidence, appearance, or age anxiety.',
    },
  },
  {
    keywords: ['怀孕', '生孩子', '宝宝', 'pregnancy', 'pregnant', 'baby', 'give birth'],
    zh: {
      freud: '怀孕梦并非一定预示现实中的怀孕。心理学上可能代表新项目、新关系或新阶段的孕育——你正在"孕育"某种可能性。',
      zhougong: '《周公解梦》中，怀孕主新生。梦见怀孕，主有新机遇；梦见生男孩，主事业有成；梦见生女孩，主福气临门。',
      summary: '怀孕梦象征新事物的萌芽与成长。',
    },
    en: {
      freud: 'Pregnancy dreams do not necessarily predict actual pregnancy. Psychologically they may represent the gestation of a new project, relationship, or phase — you are "birthing" something new into being.',
      zhougong: 'Traditional interpretation sees pregnancy as new beginnings. Dreaming of pregnancy predicts new opportunities; giving birth to a boy means career success; a girl means blessings.',
      summary: 'Pregnancy dreams symbolize the germination and growth of something new.',
    },
  },
  {
    keywords: ['刀', '剑', '武器', '刺', 'knife', 'sword', 'weapon', 'stab'],
    zh: {
      freud: '武器在梦中常与攻击性或防御机制相关。可能反映你对某人或某事的愤怒，或感到需要自我保护。刀的锐度和使用方式暗示你情绪的强烈程度。',
      zhougong: '《周公解梦》中，刀主利。梦见刀剑，主有权势；梦见被刺，需防暗箭；梦见持刀自伤，主吉，烦恼将消。',
      summary: '武器梦反映攻击性、防御或权力感。',
    },
    en: {
      freud: 'Weapons in dreams often relate to aggression or defense mechanisms. They may reflect anger toward someone or something, or a need to protect yourself. The sharpness and usage of the weapon suggest the intensity of your emotions.',
      zhougong: 'Traditional interpretation links weapons to power. Dreaming of swords signifies authority; being stabbed warns of hidden threats; self-harm with a blade is paradoxically auspicious — troubles will resolve.',
      summary: 'Weapon dreams reflect aggression, defense, or a sense of power.',
    },
  },
  {
    keywords: ['虫', '虫子', '蜘蛛', '蟑螂', 'worm', 'bug', 'spider', 'cockroach'],
    zh: {
      freud: '昆虫梦通常与琐碎的烦恼或被忽视的问题有关。它们可能代表生活中那些"小却烦人"的事情，也可能是你对纯洁或秩序的渴望被打扰。',
      zhougong: '《周公解梦》中，毒虫主凶。梦见毒虫，防小人；梦见蜘蛛结网，主有陷阱；梦见清除毒虫，吉兆，烦恼将散。',
      summary: '昆虫梦多与琐事烦恼或需要清理的问题相关。',
    },
    en: {
      freud: 'Insect dreams typically relate to petty annoyances or overlooked issues. They may represent small but bothersome things in life, or a disturbance of your desire for purity or order.',
      zhougong: 'Traditional interpretation sees poisonous insects as inauspicious. Dreaming of them warns of rivals; spider webs suggest traps; clearing away insects is auspicious — troubles will pass.',
      summary: 'Insect dreams often relate to petty annoyances or issues needing cleanup.',
    },
  },
  {
    keywords: ['房', '房子', '家', '搬家', 'house', 'home', 'moving', 'building'],
    zh: {
      freud: '房屋在梦中常代表自我。房子的状态（整洁/破败/大小）反映你对自我认知的感受。搬家可能意味着你正在经历身份或生活方式的转变。',
      zhougong: '《周公解梦》中，房子主家运。梦见新房，主家运兴旺；梦见旧房倒塌，需防家宅不宁；梦见搬家，主有变动。',
      summary: '房屋梦与自我认知、家庭状态或生活转变相关。',
    },
    en: {
      freud: 'Houses in dreams often represent the self. The house\'s condition (clean/run-down/size) reflects your self-perception. Moving may indicate an identity or lifestyle transformation.',
      zhougong: 'Traditional interpretation links houses to family fortune. New houses predict prosperity; collapsing old houses warn of domestic unrest; moving suggests upcoming changes.',
      summary: 'House dreams relate to self-perception, family state, or life transitions.',
    },
  },
  {
    keywords: ['火车', '地铁', '汽车', '飞机', 'train', 'subway', 'car', 'airplane'],
    zh: {
      freud: '交通工具在梦中常代表人生旅程或前进方向。平稳的行驶反映生活顺利；失控的车辆暗示你感到缺乏掌控。不同交通工具对应不同的人生节奏。',
      zhougong: '《周公解梦》中，车行主通达。梦见乘车远行，主事业有成；梦见车失控，需防意外；梦见下车，主有变故。',
      summary: '交通梦映射你对人生节奏和方向的感受。',
    },
    en: {
      freud: 'Vehicles in dreams often represent life\'s journey or direction. Smooth travel reflects ease in life; out-of-control vehicles suggest lack of mastery. Different vehicles correspond to different life paces.',
      zhougong: 'Traditional interpretation links vehicles to progress. Traveling by car far predicts career success; losing control warns of accidents; getting out of a vehicle suggests changes.',
      summary: 'Vehicle dreams mirror your feelings about life\'s pace and direction.',
    },
  },
  {
    keywords: ['火', '火', '燃烧', '火灾', 'fire', 'burn', 'flame', 'fire disaster'],
    zh: {
      freud: '火在梦中常与强烈情感、激情或愤怒相关。也可能代表净化或转变——旧的燃烧殆尽，新的得以重生。火的危险性反映你对自身情绪的态度。',
      zhougong: '《周公解梦》中，火主吉。梦见火光冲天，主事业红火；梦见小火，主有温暖；梦见火灾，需防破财，但火烧反而是吉兆，旧的不去新的不来。',
      summary: '火梦象征情感、激情和转变。',
    },
    en: {
      freud: 'Fire in dreams often relates to strong emotions, passion, or anger. It may also represent purification or transformation — the old burns away so the new can be born. The danger of the fire reflects your attitude toward your own emotions.',
      zhougong: 'Traditional interpretation sees fire as auspicious. Blazing fires predict career success; small fires mean warmth; fire disasters caution against loss, but burning things away is ultimately fortunate — clearing space for renewal.',
      summary: 'Fire dreams symbolize emotion, passion, and transformation.',
    },
  },
  {
    keywords: ['猫', '狗', '宠物', 'cat', 'dog', 'pet'],
    zh: {
      freud: '宠物在梦中常与亲密关系或自我特质相关。猫代表独立、神秘；狗代表忠诚、友谊。宠物的行为反映你在人际关系中的需求或感受。',
      zhougong: '《周公解梦》中，猫狗主情义。梦见猫，主有私情；梦见狗，主有忠臣。宠物受伤，需防朋友变心。',
      summary: '宠物梦与人际关系和自我特质紧密相关。',
    },
    en: {
      freud: 'Pets in dreams often relate to intimate relationships or personal traits. Cats represent independence and mystery; dogs symbolize loyalty and friendship. Pet behavior reflects your needs or feelings in human relationships.',
      zhougong: 'Traditional interpretation links cats and dogs to loyalty and bonds. Cats may suggest secret affairs; dogs indicate faithful friends. Injured pets warn of friends changing loyalties.',
      summary: 'Pet dreams closely relate to relationships and personal characteristics.',
    },
  },
  {
    keywords: ['怀孕', '掉牙', '被追', '迷路', '死亡', '坠落', '考试', '飞翔', '水', '蛇'],
    zh: {
      freud: '综合分析：你的梦境涉及多重主题，暗示当前生活中存在复杂的心理动力。不同梦境元素代表不同的情绪需求与冲突，建议关注内心感受的整体模式。',
      zhougong: '综合分析：近期梦境丰富，需结合个人实际情况解读。建议静心反思梦境中最强烈的情绪，以获得更深层的启示。',
      summary: '你的梦境包含多个常见主题，整体反映潜意识正在处理重要的生活议题。',
    },
    en: {
      freud: 'Comprehensive analysis: Your dream involves multiple themes, suggesting complex psychological dynamics at play. Different elements represent different emotional needs and conflicts. Focus on the overall emotional pattern rather than individual symbols.',
      zhougong: 'Comprehensive analysis: Your recent dreams are rich in symbols. Deep reflection on the strongest emotions in your dreams will reveal the most meaningful insights.',
      summary: 'Your dream contains multiple common themes, collectively reflecting your subconscious processing important life issues.',
    },
  },
];

const I18N: Record<string, Record<string, string>> = {
  zh: {
    title: '梦境解析器',
    subtitle: '输入梦境关键词，探索心理学与周公解梦的双重解读',
    inputLabel: '梦境关键词',
    inputPlaceholder: '输入梦中出现的事物，如：飞、水、蛇、考试...',
    inputHint: '支持单个关键词或多个关键词，多个用逗号分隔',
    quickTags: '热门梦境',
    analyze: '解析梦境',
    freudTitle: '🧠 心理学解读',
    zhougongTitle: '📖 传统周公解梦',
    summaryTitle: '✨ 综合提示',
    empty: '输入关键词开始解析',
    noMatch: '未找到匹配的梦境符号，请尝试其他关键词',
    matched: '匹配到 {n} 个梦境符号',
    search: '搜索',
    copied: '已复制',
    copy: '复制全部',
    refresh: '清空',
    popular: ['飞', '水', '蛇', '掉牙', '坠落', '考试', '死亡', '被追'],
  },
  en: {
    title: 'Dream Interpreter',
    subtitle: 'Enter dream keywords for psychological and traditional Chinese interpretations',
    inputLabel: 'Dream Keywords',
    inputPlaceholder: 'Enter dream symbols like: fly, water, snake, exam...',
    inputHint: 'Single or multiple keywords, separate with commas',
    quickTags: 'Popular Dreams',
    analyze: 'Analyze Dream',
    freudTitle: '🧠 Psychological View',
    zhougongTitle: '📖 Traditional Chinese View',
    summaryTitle: '✨ Summary Insight',
    empty: 'Enter keywords to begin analysis',
    noMatch: 'No matching dream symbols found. Try different keywords.',
    matched: '{n} dream symbol(s) matched',
    search: 'Search',
    copied: 'Copied',
    copy: 'Copy All',
    refresh: 'Clear',
    popular: ['fly', 'water', 'snake', 'teeth', 'falling', 'exam', 'death', 'chase'],
  },
  es: {
    title: 'Intérprete de Sueños',
    subtitle: 'Ingresa palabras clave para interpretaciones psicológicas y tradicionales chinas',
    inputLabel: 'Palabras Clave del Sueño',
    inputPlaceholder: 'Ingresa símbolos como: volar, agua, serpiente, examen...',
    inputHint: 'Palabras clave individuales o múltiples, separadas por comas',
    quickTags: 'Sueños Populares',
    analyze: 'Analizar Sueño',
    freudTitle: '🧠 Visión Psicológica',
    zhougongTitle: '📖 Visión Tradicional China',
    summaryTitle: '✨ Resumen',
    empty: 'Ingresa palabras clave para comenzar',
    noMatch: 'No se encontraron símbolos coincidentes. Intenta con otras palabras.',
    matched: '{n} símbolo(s) coincidente(s)',
    search: 'Buscar',
    copied: 'Copiado',
    copy: 'Copiar Todo',
    refresh: 'Limpiar',
    popular: ['volar', 'agua', 'serpiente', 'dientes', 'caer', 'examen', 'muerte', 'persecución'],
  },
  fr: {
    title: 'Interpréteur de Rêves',
    subtitle: 'Entrez des mots-clés pour des interprétations psychologiques et chinoises traditionnelles',
    inputLabel: 'Mots-Clés du Rêve',
    inputPlaceholder: 'Entrez des symboles comme : voler, eau, serpent, examen...',
    inputHint: 'Un ou plusieurs mots-clés, séparés par des virgules',
    quickTags: 'Rêves Populaires',
    analyze: 'Analyser le Rêve',
    freudTitle: '🧠 Vue Psychologique',
    zhougongTitle: '📖 Vue Traditionnelle Chinoise',
    summaryTitle: '✨ Résumé',
    empty: 'Entrez des mots-clés pour commencer',
    noMatch: 'Aucun symbole trouvé. Essayez d\'autres mots-clés.',
    matched: '{n} symbole(s) trouvé(s)',
    search: 'Rechercher',
    copied: 'Copié',
    copy: 'Tout Copier',
    refresh: 'Effacer',
    popular: ['voler', 'eau', 'serpent', 'dents', 'tomber', 'examen', 'mort', 'poursuite'],
  },
  hi: {
    title: 'सपना व्याख्याकार',
    subtitle: 'मनोवैज्ञानिक और पारंपरिक चीनी व्याख्याओं के लिए कीवर्ड दर्ज करें',
    inputLabel: 'सपना कीवर्ड',
    inputPlaceholder: 'प्रतीक दर्ज करें: उड़ना, पानी, सांप, परीक्षा...',
    inputHint: 'एक या कई कीवर्ड, अल्पविराम से अलग करें',
    quickTags: 'लोकप्रिय सपने',
    analyze: 'सपना विश्लेषण करें',
    freudTitle: '🧠 मनोवैज्ञानिक दृष्टि',
    zhougongTitle: '📖 पारंपरिक चीनी दृष्टि',
    summaryTitle: '✨ सारांश',
    empty: 'शुरू करने के लिए कीवर्ड दर्ज करें',
    noMatch: 'कोई प्रतीक नहीं मिला। अन्य कीवर्ड आज़माएं।',
    matched: '{n} प्रतीक मिले',
    search: 'खोजें',
    copied: 'कॉपी हुआ',
    copy: 'सभी कॉपी',
    refresh: 'साफ़ करें',
    popular: ['उड़ना', 'पानी', 'सांप', 'दांत', 'गिरना', 'परीक्षा', 'मृत्यु', 'पीछा'],
  },
  ar: {
    title: 'مفسر الأحلام',
    subtitle: 'أدخل كلمات مفتاحية للتفسيرات النفسية والتقليدية الصينية',
    inputLabel: 'كلمات مفتاحية للحلم',
    inputPlaceholder: 'أدخل رموزًا مثل: طيران، ماء، ثعبان، امتحان...',
    inputHint: 'كلمات مفتاحية واحدة أو متعددة، مفصولة بفاصلة',
    quickTags: 'الأحلام الشائعة',
    analyze: 'تحليل الحلم',
    freudTitle: '🧠 المنظور النفسي',
    zhougongTitle: '📖 المنظور التقليدي الصيني',
    summaryTitle: '✨ ملخص',
    empty: 'أدخل كلمات مفتاحية للبدء',
    noMatch: 'لم يتم العثور على رموز مطابقة. جرب كلمات أخرى.',
    matched: 'تم العثور على {n} رمزًا',
    search: 'بحث',
    copied: 'تم النسخ',
    copy: 'نسخ الكل',
    refresh: 'مسح',
    popular: ['طيران', 'ماء', 'ثعبان', 'أسنان', 'سقوط', 'امتحان', 'موت', 'مطاردة'],
  },
};

export default function DreamInterpreter({ locale = 'zh' }: Props) {
  const t = I18N[locale] || I18N.en;
  const isRTL = locale === 'ar';

  const [input, setInput] = useState('');
  const [results, setResults] = useState<DreamSymbol[]>([]);
  const [matchedKw, setMatchedKw] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  }, []);

  const analyze = useCallback(() => {
    const raw = input.trim();
    if (!raw) return;

    setIsAnalyzing(true);
    const parts = raw.split(/[,，\s]+/).filter(Boolean);
    const matched = new Set<DreamSymbol>();
    const matchedKeywords = new Set<string>();

    for (const part of parts) {
      const lower = part.toLowerCase();
      for (const symbol of DREAM_DB) {
        if (matched.has(symbol) && symbol.keywords.length > 3) continue;
        for (const kw of symbol.keywords) {
          if (kw.toLowerCase() === lower || lower.includes(kw.toLowerCase()) || kw.toLowerCase().includes(lower)) {
            matched.add(symbol);
            matchedKeywords.add(part);
            break;
          }
        }
      }
    }

    if (matched.size === 0 && parts.length > 0) {
      const fallback = DREAM_DB[DREAM_DB.length - 1];
      matched.add(fallback);
      matchedKeywords.add(parts[0]);
    }

    setTimeout(() => {
      setResults(Array.from(matched));
      setMatchedKw(Array.from(matchedKeywords));
      setIsAnalyzing(false);
    }, 400);
  }, [input]);

  const handleCopy = useCallback(async () => {
    if (results.length === 0) return;
    const text = results.map((r, i) => {
      const section = locale === 'zh' ? `【符号 ${i + 1}】` : `【Symbol ${i + 1}】`;
      const freud = locale === 'zh' ? '心理学解读' : 'Psychological View';
      const zhougong = locale === 'zh' ? '传统周公解梦' : 'Traditional Chinese View';
      const summary = locale === 'zh' ? '综合提示' : 'Summary';
      return `${section}\n${freud}：${r[locale as 'zh'].freud}\n${zhougong}：${r[locale as 'zh'].zhougong}\n${summary}：${r[locale as 'zh'].summary}`;
    }).join('\n\n');

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast(t.copied);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      showToast(t.copied);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [results, locale, t, showToast]);

  const handleClear = useCallback(() => {
    setInput('');
    setResults([]);
    setMatchedKw([]);
  }, []);

  const popularKeywords = t.popular || [];

  const getContent = (s: DreamSymbol) => {
    const key = locale as 'zh' | 'en' | 'es' | 'fr' | 'hi' | 'ar';
    const fallbackKey = 'en' as const;
    return s[key] || s[fallbackKey];
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 mb-3">
          <Moon className="w-8 h-8 text-indigo-500" />
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {t.title}
          </h1>
        </div>
        <p className="text-gray-500 text-sm">{t.subtitle}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-5 sm:p-7 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">{t.inputLabel}</label>
          <div className="relative">
            <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.inputPlaceholder}
              className={`w-full py-3 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} rounded-xl border-2 border-indigo-200 focus:border-indigo-400 focus:ring-0 outline-none transition-all text-gray-800`}
              dir="auto"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">{t.inputHint}</p>
        </div>

        <div>
          <div className="text-xs font-semibold text-gray-500 mb-2">{t.quickTags}</div>
          <div className="flex flex-wrap gap-2">
            {popularKeywords.map((kw) => (
              <button
                key={kw}
                onClick={() => setInput(kw)}
                className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium hover:bg-indigo-100 transition-colors"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={analyze}
            disabled={!input.trim() || isAnalyzing}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              {isAnalyzing ? '...' : t.analyze}
            </span>
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:bg-indigo-50 font-semibold text-sm transition-all"
            title={t.refresh}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div className="mt-5 space-y-4">
          <div className="text-sm text-gray-500 text-center">
            {t.matched.replace('{n}', String(results.length))}
            {matchedKw.length > 0 && (
              <span className="ml-2 text-indigo-500">
                {matchedKw.map((kw, i) => (
                  <span key={i} className="inline-block px-2 py-0.5 bg-indigo-100 rounded-full text-xs font-medium mx-0.5">
                    {kw}
                  </span>
                ))}
              </span>
            )}
          </div>

          {results.map((symbol, idx) => {
            const content = getContent(symbol);
            return (
              <div
                key={idx}
                className="relative rounded-2xl p-5 sm:p-6 overflow-hidden shadow-lg bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100"
              >
                <div className="absolute top-3 right-3 text-2xl opacity-20">🌙</div>
                <div className="absolute bottom-3 left-3 text-xl opacity-15">✨</div>

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full w-fit">
                    <BookOpen className="w-3 h-3" />
                    {`#${idx + 1}`}
                  </div>

                  <div className="bg-white/70 backdrop-blur rounded-xl p-4 border border-white/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-purple-500" />
                      <h3 className="text-sm font-bold text-purple-700">{t.freudTitle}</h3>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{content.freud}</p>
                  </div>

                  <div className="bg-white/70 backdrop-blur rounded-xl p-4 border border-white/50">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-amber-500" />
                      <h3 className="text-sm font-bold text-amber-700">{t.zhougongTitle}</h3>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{content.zhougong}</p>
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 backdrop-blur rounded-xl p-4 border border-amber-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <h3 className="text-sm font-bold text-amber-700">{t.summaryTitle}</h3>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed font-medium">{content.summary}</p>
                  </div>
                </div>
              </div>
            );
          })}

          <button
            onClick={handleCopy}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all ${
              copied
                ? 'border-green-400 bg-green-50 text-green-600'
                : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? t.copied : t.copy}
          </button>
        </div>
      )}

      {results.length === 0 && !isAnalyzing && (
        <div className="mt-5 text-center py-10 text-gray-400 text-sm bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="text-4xl mb-2">🌙</div>
          <div>{t.empty}</div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-gray-900 text-white text-sm shadow-xl z-50">
          {toast}
        </div>
      )}
    </div>
  );
}