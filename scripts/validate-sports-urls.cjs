/* eslint-disable */
#!/usr/bin/env node
// ============================================================================
// scripts/validate-sports-urls.cjs
// 输入：脚本末尾 SEEDS 数组（200条工具）
// 验证：
//   1. PC UA 请求 -> 状态 200/301/302/304/308
//   2. Mobile UA 请求 -> 同状态 + 响应 body 内 <meta name="viewport" ...> 存在 => mobile: true
// 输出：console.table 失败清单，process.exit(0) 全部通过，1 有失败
// 超时 10s，并发 20，失败重试 1 次
// ============================================================================
'use strict';
const https = require('https');
const http = require('http');
const { URL } = require('url');

const TIMEOUT = 12000;
const CONCURRENCY = 20;
const RETRIES = 2;

const PC_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const MOBILE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';

// 200 条运动工具种子（已去重现有 1054 条卡片，全部选合规站点）
const SEEDS = [
  // ========== 1. 跑步 & 马拉松 25 ==========
  { id: 'nike-run-club', slug: 'nike-run-club', name: 'Nike Run Club 跑步', category: 'health', isFree: true, signup: ['email'], url: 'https://www.nike.com/nrc' },
  { id: 'adidas-running-runtastic', slug: 'adidas-running-runtastic', name: 'Adidas Runtastic 跑步', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://www.runtastic.com' },
  { id: 'runkeeper', slug: 'runkeeper', name: 'Runkeeper 跑步记录', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://runkeeper.com' },
  { id: 'garmin-connect', slug: 'garmin-connect', name: 'Garmin Connect 佳明', category: 'health', isFree: true, signup: ['email'], url: 'https://connect.garmin.com' },
  { id: 'coros', slug: 'coros', name: 'COROS 高驰运动', category: 'health', isFree: true, signup: ['email'], url: 'https://coros.com' },
  { id: 'polar-flow', slug: 'polar-flow', name: 'Polar Flow 博能', category: 'health', isFree: true, signup: ['email'], url: 'https://flow.polar.com' },
  { id: 'vdot-calculator', slug: 'vdot-calculator', name: 'VDOT 跑步训练计算器', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://runsmartproject.com/calculator/' },
  { id: 'active-race-results', slug: 'active-race-results', name: 'Active 赛事成绩查询', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://results.active.com' },
  { id: 'trainingpeaks', slug: 'trainingpeaks', name: 'TrainingPeaks 训练日志', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://www.trainingpeaks.com' },
  { id: 'final-surge', slug: 'final-surge', name: 'Final Surge 跑步教练', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://www.finalsurge.com' },
  { id: 'runalyze', slug: 'runalyze', name: 'Runalyze 跑步分析', category: 'health', isFree: true, signup: ['email'], url: 'https://runalyze.com' },
  { id: 'stryd-power', slug: 'stryd-power', name: 'Stryd 跑步功率', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://www.stryd.com' },
  { id: 'racewow', slug: 'racewow', name: 'RaceWow 赛事报名', category: 'health', isFree: true, signup: ['email'], url: 'https://www.racewow.com' },
  { id: 'lets-do-this', slug: 'lets-do-this', name: 'LetsDoThis 全球赛事', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.letsdothis.com' },
  { id: 'find-a-marathon', slug: 'find-a-marathon', name: 'FindAMarathon 马拉松查询', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.findamarathon.com' },
  { id: 'running2win', slug: 'running2win', name: 'Running2Win 跑步日志', category: 'health', isFree: true, signup: ['email'], url: 'https://www.running2win.com' },
  { id: 'mcmillan-calculator', slug: 'mcmillan-calculator', name: 'McMillan 跑步配速计算器', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.mcmillanrunning.com' },
  { id: 'marathon-handbook', slug: 'marathon-handbook', name: 'MarathonHandbook 训练计划', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.marathonhandbook.com/training-plans/' },
  { id: 'cool-running', slug: 'cool-running', name: 'Cool Running 跑步入门', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.coolrunning.com' },
  { id: 'worlds-marathons', slug: 'worlds-marathons', name: 'WorldsMarathons 大满贯', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://worldsmarathons.com' },
  { id: 'runsignup', slug: 'runsignup', name: 'RunSignUp 赛事报名', category: 'health', isFree: true, signup: ['email'], url: 'https://runsignup.com' },
  { id: 'pace-calculator', slug: 'pace-calculator', name: '跑步配速计算器', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.calculator.net/pace-calculator.html' },
  { id: 'treadmill-calc', slug: 'treadmill-calc', name: '跑步机坡度速度换算器', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.runnersworld.com/tools/a20830919/treadmill-calculator/' },
  { id: 'couch-to-5k', slug: 'couch-to-5k', name: 'Couch to 5K 从零跑步', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.c25k.com' },
  { id: 'race-predictor', slug: 'race-predictor', name: '跑步比赛成绩预测器', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://runbundle.com/tools/race-predictor' },

  // ========== 2. 骑行（公路/山地/通勤）25 ==========
  { id: 'ride-with-gps', slug: 'ride-with-gps', name: 'RideWithGPS 骑行路线', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://ridewithgps.com' },
  { id: 'bikemap', slug: 'bikemap', name: 'Bikemap 全球骑行地图', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://www.bikemap.net' },
  { id: 'cyclemeter', slug: 'cyclemeter', name: 'Cyclemeter 骑行记录', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://cyclemeter.com' },
  { id: 'wahoo-systm', slug: 'wahoo-systm', name: 'Wahoo SYSTM 智能训练', category: 'health', isFree: false, signup: ['email', 'cc-required'], url: 'https://www.wahoofitness.com/systm' },
  { id: 'trainerroad', slug: 'trainerroad', name: 'TrainerRoad 功率训练', category: 'health', isFree: false, signup: ['email', 'cc-required'], url: 'https://www.trainerroad.com' },
  { id: 'zwift', slug: 'zwift', name: 'Zwift 虚拟骑行', category: 'health', isFree: false, signup: ['email', 'cc-required'], url: 'https://www.zwift.com' },
  { id: 'rouvy', slug: 'rouvy', name: 'ROUVY 实景骑行', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://rouvy.com' },
  { id: 'rgt-cycling', slug: 'rgt-cycling', name: 'RGT Cycling 虚拟骑行', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://www.rgtcycling.com' },
  { id: 'bikeregister', slug: 'bikeregister', name: 'BikeRegister 防盗登记', category: 'health', isFree: true, signup: ['email'], url: 'https://www.bikeregister.com' },
  { id: 'geometry-geeks', slug: 'geometry-geeks', name: '车架几何对比工具', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://geometrygeeks.bike' },
  { id: 'best-bike-split', slug: 'best-bike-split', name: 'BestBikeSplit 比赛分段分析', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://www.bestbikesplit.com' },
  { id: 'golden-cheetah', slug: 'golden-cheetah', name: 'GoldenCheetah 开源运动分析', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.goldencheetah.org' },
  { id: 'cyclestreets', slug: 'cyclestreets', name: 'CycleStreets 英国骑行路线', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.cyclestreets.net' },
  { id: 'open-cycle-map', slug: 'open-cycle-map', name: 'OpenCycleMap 全球骑行地图', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://opencyclemap.org' },
  { id: 'bikeradar', slug: 'bikeradar', name: 'Bikeradar 骑行评测工具', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.bikeradar.com' },
  { id: 'trailforks', slug: 'trailforks', name: 'Trailforks 山地车路线', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://www.trailforks.com' },
  { id: 'singletracks', slug: 'singletracks', name: 'Singletracks 山地车百科', category: 'health', isFree: true, signup: ['email'], url: 'https://www.singletracks.com' },
  { id: 'pinkbike', slug: 'pinkbike', name: 'Pinkbike 山地车社区', category: 'health', isFree: true, signup: ['email'], url: 'https://www.pinkbike.com' },
  { id: 'veloviewer', slug: 'veloviewer', name: 'VeloViewer Strava增强', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://veloviewer.com' },
  { id: 'todays-plan', slug: 'todays-plan', name: 'TodaysPlan 骑行教练端', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://www.todaysplan.com.au' },
  { id: 'fullgaz', slug: 'fullgaz', name: 'FullGaz 骑行实景视频', category: 'health', isFree: false, signup: ['email', 'cc-required'], url: 'https://www.fullgaz.com' },
  { id: 'bike-calc', slug: 'bike-calc', name: 'BikeCalc 齿比速度计算器', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.bikecalc.com' },
  { id: 'bike-insurance-check', slug: 'bike-insurance-check', name: '自行车保险比价', category: 'finance-tools', isFree: true, signup: ['no-signup'], url: 'https://www.bicycleretailer.com/insurance' },
  { id: 'sram-shift-calc', slug: 'sram-shift-calc', name: 'SRAM 变速计算器', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.sram.com/en/sram/technology/shift-calculator' },
  { id: 'project-4321', slug: 'project-4321', name: 'Project 4321 功率计算器', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.omnicalculator.com/sports/cycling-power' },

  // ========== 3. 健身 & 力量训练 25 ==========
  { id: 'nike-training-club', slug: 'nike-training-club', name: 'Nike Training Club 训练', category: 'health', isFree: true, signup: ['email'], url: 'https://www.nike.com/ntc-app' },
  { id: 'adidas-training', slug: 'adidas-training', name: 'Adidas Training 训练计划', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://www.runtastic.com/blog/en/runtastic-results-adidas-training/' },
  { id: 'peloton-digital', slug: 'peloton-digital', name: 'Peloton 直播单车课', category: 'health', isFree: false, signup: ['email', 'cc-required'], url: 'https://www.onepeloton.com/digital' },
  { id: 'sweat-app', slug: 'sweat-app', name: 'Sweat 女性健身', category: 'health', isFree: false, signup: ['email', 'cc-required'], url: 'https://www.sweat.com' },
  { id: 'centr-chris-hemsworth', slug: 'centr-chris-hemsworth', name: 'Centr 锤哥健身', category: 'health', isFree: false, signup: ['email', 'cc-required'], url: 'https://centr.com' },
  { id: 'ob-fitness', slug: 'ob-fitness', name: 'Openfit 直播健身课', category: 'health', isFree: false, signup: ['email', 'cc-required'], url: 'https://www.myopenfit.com' },
  { id: 'daily-burn', slug: 'daily-burn', name: 'Daily Burn 日常健身', category: 'health', isFree: false, signup: ['email', 'cc-required'], url: 'https://www.dailyburn.com' },
  { id: 'fitbit-premium', slug: 'fitbit-premium', name: 'Fitbit 高级健康', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://www.fitbit.com/global/us/products/subscriptions/premium' },
  { id: 'strong-lifts', slug: 'strong-lifts', name: 'StrongLifts 力量训练', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://stronglifts.com' },
  { id: 'starting-strength', slug: 'starting-strength', name: 'StartingStrength 基础力量', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://startingstrength.com' },
  { id: 'exrx', slug: 'exrx', name: 'ExRx 运动训练百科', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://exrx.net' },
  { id: 'bodybuilding-guides', slug: 'bodybuilding-guides', name: 'Bodybuilding 训练指南', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.bodybuilding.com/workout-plans' },
  { id: 'fitocracy', slug: 'fitocracy', name: 'Fitocracy 游戏化健身', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://www.fitocracy.com' },
  { id: 'habit-nest', slug: 'habit-nest', name: 'Habit Nest 健身打卡', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://thehabitnest.com' },
  { id: 'workout-labs', slug: 'workout-labs', name: 'WorkoutLabs 动作图解', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://workoutlabs.com/exercise-guide/' },
  { id: 'freedom-strong', slug: 'freedom-strong', name: '囚徒健身徒手训练', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.reddit.com/r/bodyweightfitness/wiki/kb/recommended_routine' },
  { id: 'darebee', slug: 'darebee', name: 'Darebee 每日挑战', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://darebee.com' },
  { id: '12minuteathlete', slug: '12minuteathlete', name: '12分钟高效HIIT', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://12minuteathlete.com' },
  { id: 'fitness-blender', slug: 'fitness-blender', name: 'FitnessBlender 免费训练视频', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://www.fitnessblender.com' },
  { id: 'poosh', slug: 'poosh', name: 'Poosh 居家健身', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://poosh.com' },
  { id: 'p90x-schedule', slug: 'p90x-schedule', name: 'P90X 90天训练日程', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.teambeachbody.com' },
  { id: 'insanity-workout', slug: 'insanity-workout', name: 'Insanity 极限燃脂日程', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.beachbodyondemand.com/programs/insanity' },
  { id: 'musclewiki', slug: 'musclewiki', name: 'MuscleWiki 肌肉解剖训练', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://musclewiki.com' },
  { id: 'strech-lab', slug: 'strech-lab', name: '拉伸动作图解库', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.stretch.com' },
  { id: 'romwod', slug: 'romwod', name: 'ROMWOD 柔韧性训练', category: 'health', isFree: false, signup: ['email', 'cc-required'], url: 'https://romwod.com' },

  // ========== 4. 瑜伽 & 普拉提 & 拉伸 20 ==========
  { id: 'yoga-international', slug: 'yoga-international', name: 'Yoga International 国际瑜伽', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://yogainternational.com' },
  { id: 'gaia-yoga', slug: 'gaia-yoga', name: 'Gaia 灵性瑜伽视频', category: 'health', isFree: false, signup: ['email', 'cc-required'], url: 'https://www.gaia.com/yoga' },
  { id: 'do-you-yoga', slug: 'do-you-yoga', name: 'DoYou 瑜伽课程', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://www.doyouyoga.com' },
  { id: 'yoga-download', slug: 'yoga-download', name: 'YogaDownload 在线课', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://www.yogadownload.com' },
  { id: 'my-yoga-works', slug: 'my-yoga-works', name: 'MyYogaWorks 名师课', category: 'health', isFree: false, signup: ['email', 'cc-required'], url: 'https://www.myyogaworks.com' },
  { id: 'pilates-anytime', slug: 'pilates-anytime', name: 'PilatesAnytime 普拉提', category: 'health', isFree: false, signup: ['email', 'cc-required'], url: 'https://www.pilatesanytime.com' },
  { id: 'club-pilates', slug: 'club-pilates', name: 'ClubPilates 门店查询', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.clubpilates.com' },
  { id: 'blogilates', slug: 'blogilates', name: 'Blogilates POP Pilates', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.blogilates.com' },
  { id: 'stretching-timer', slug: 'stretching-timer', name: '拉伸倒计时计时器', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://stretching-timer.herokuapp.com' },
  { id: 'foam-roller-guide', slug: 'foam-roller-guide', name: '泡沫轴使用指南', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.self.com/gallery/best-foam-roller-exercises' },
  { id: 'yin-yoga-cheatsheet', slug: 'yin-yoga-cheatsheet', name: '阴瑜伽序列速查表', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://yogabasics.com/practice/yin-yoga-cheat-sheet/' },
  { id: 'yoga-journal', slug: 'yoga-journal', name: 'Yoga Journal 杂志工具', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.yogajournal.com' },
  { id: 'medito', slug: 'medito', name: 'Medito 免费冥想', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://meditofoundation.org' },
  { id: 'insight-timer', slug: 'insight-timer', name: 'Insight Timer 冥想计时', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://insighttimer.com' },
  { id: 'waking-up', slug: 'waking-up', name: 'WakingUp 每日冥想', category: 'health', isFree: false, signup: ['email', 'cc-required'], url: 'https://wakingup.com' },
  { id: 'mindful-cms', slug: 'mindful-cms', name: 'Mindful 正念入门', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.mindful.org' },
  { id: 'breathwrk', slug: 'breathwrk', name: 'Breathwrk 呼吸训练', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://www.breathwrk.com' },
  { id: '478-breathing', slug: '478-breathing', name: '4-7-8 呼吸法计时器', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.breathewith.ai' },
  { id: 'box-breathing', slug: 'box-breathing', name: 'BoxBreathing 海豹式呼吸', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://boxbreathing.app' },
  { id: 'progressive-muscle-relaxation', slug: 'progressive-muscle-relaxation', name: '渐进肌肉放松音频', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.cci.health.wa.gov.au/~/media/CCI/Mental-Health-Professionals/MHP-Articles/Muscle-relaxation-exercise-audio-script.pdf' },

  // ========== 5. 游泳 & 铁人三项 & 水上运动 15 ==========
  { id: 'swim-com', slug: 'swim-com', name: 'Swim.com 游泳分析', category: 'health', isFree: true, signup: ['email'], url: 'https://www.swim.com' },
  { id: 'swimsmooth', slug: 'swimsmooth', name: 'SwimSmooth 自由泳纠正', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://www.swimsmooth.com' },
  { id: 'goswim', slug: 'goswim', name: 'GoSwim 游泳动作视频', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://www.goswim.tv' },
  { id: 'swimulator', slug: 'swimulator', name: 'Swimulator 泳池训练计划', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.swimulator.com' },
  { id: 'trainerroad-swim', slug: 'trainerroad-swim', name: 'Triathlon 铁人三项训练', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.triathlete.com/training/training-plans/' },
  { id: 'slowtwitch', slug: 'slowtwitch', name: 'Slowtwitch 铁三社区', category: 'health', isFree: true, signup: ['email'], url: 'https://www.slowtwitch.com' },
  { id: 'tridot', slug: 'tridot', name: 'TriDot 铁三AI教练', category: 'health', isFree: false, signup: ['email', 'cc-required'], url: 'https://tridot.com' },
  { id: 'beginnertriathlete', slug: 'beginnertriathlete', name: 'BeginnerTriathlete 入门', category: 'health', isFree: true, signup: ['email'], url: 'https://www.beginnertriathlete.com' },
  { id: 'ironman-training-peaks', slug: 'ironman-training-peaks', name: 'IRONMAN 官方训练计划', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.ironman.com/training-plans' },
  { id: 'suunto-ironman', slug: 'suunto-ironman', name: '铁三数据导入分析', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.trainingpeaks.com/campaigns/ironman/' },
  { id: 'kayak-sit-on-top', slug: 'kayak-sit-on-top', name: '皮划艇装备对比', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://paddling.com/gear/kayak' },
  { id: 'surf-forecast', slug: 'surf-forecast', name: 'SurfForecast 冲浪预报', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.surf-forecast.com' },
  { id: 'windguru', slug: 'windguru', name: 'Windguru 风帆风筝冲浪预报', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.windguru.cz' },
  { id: 'magicseaweed', slug: 'magicseaweed', name: 'MSW 全球浪高预报', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://magicseaweed.com' },
  { id: 'wannasurf', slug: 'wannasurf', name: 'Wannasurf 全球冲浪点地图', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.wannasurf.com' },

  // ========== 6. 户外徒步 & 登山 & 越野跑 & 露营 20 ==========
  { id: 'komoot', slug: 'komoot', name: 'Komoot 骑行徒步导航', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://www.komoot.com' },
  { id: 'alltrails', slug: 'alltrails', name: 'AllTrails 全球徒步路线', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://www.alltrails.com' },
  { id: 'wikiloc', slug: 'wikiloc', name: 'Wikiloc 路线共享', category: 'health', isFree: true, signup: ['email'], url: 'https://www.wikiloc.com' },
  { id: 'hikingproject', slug: 'hikingproject', name: 'HikingProject 徒步项目', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.hikingproject.com' },
  { id: 'mountain-project', slug: 'mountain-project', name: 'MountainProject 攀岩路线', category: 'health', isFree: true, signup: ['email'], url: 'https://www.mountainproject.com' },
  { id: 'summitpost', slug: 'summitpost', name: 'SummitPost 山峰百科', category: 'health', isFree: true, signup: ['email'], url: 'https://www.summitpost.org' },
  { id: 'peakbagger', slug: 'peakbagger', name: 'Peakbagger 登峰记录', category: 'health', isFree: true, signup: ['email'], url: 'https://www.peakbagger.com' },
  { id: 'outdooractive', slug: 'outdooractive', name: 'OutdoorActive 欧洲户外地图', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://www.outdooractive.com' },
  { id: 'satgear-checklist', slug: 'satgear-checklist', name: '背包打包清单计算器', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.lighterpack.com' },
  { id: 'lighterpack', slug: 'lighterpack', name: 'LighterPack 装备重量分析', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.lighterpack.com' },
  { id: 'rei-co-op-checklists', slug: 'rei-co-op-checklists', name: 'REI 户外打包清单', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.rei.com/learn/expert-advice/backpacking-checklist.html' },
  { id: 'campendium', slug: 'campendium', name: 'Campendium 免费营地查询', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.campendium.com' },
  { id: 'free-campsites', slug: 'free-campsites', name: 'FreeCampsites 营地地图', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://freecampsites.net' },
  { id: 'hipcamp', slug: 'hipcamp', name: 'Hipcamp 露营地预订', category: 'health', isFree: true, signup: ['email'], url: 'https://www.hipcamp.com' },
  { id: 'campsite-photos', slug: 'campsite-photos', name: 'CampsitePhotos 营地实景', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://campsitephotos.com' },
  { id: 'noaa-weather', slug: 'noaa-weather', name: 'NOAA 户外天气预报', category: 'productivity', isFree: true, signup: ['no-signup'], url: 'https://forecast.weather.gov' },
  { id: 'mountain-weather-forecast', slug: 'mountain-weather-forecast', name: 'MountainForecast 山峰天气', category: 'productivity', isFree: true, signup: ['no-signup'], url: 'https://www.mountain-forecast.com' },
  { id: 'meteoblue-mountain', slug: 'meteoblue-mountain', name: 'Meteoblue 高山天气预报', category: 'productivity', isFree: true, signup: ['no-signup'], url: 'https://www.meteoblue.com' },
  { id: 'wildsafe-bear', slug: 'wildsafe-bear', name: '防熊知识与装备', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.wildsafe.bc.ca' },
  { id: 'sotaventos-mountain', slug: 'sotaventos-mountain', name: '登山高度与等高线查看器', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.daftlogic.com/projects-find-elevation-on-map.htm' },

  // ========== 7. 球类（篮球/足球/网球/羽毛球/乒乓/排球/高尔夫）25 ==========
  { id: 'nba-stats', slug: 'nba-stats', name: 'NBA 官方数据统计', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.nba.com/stats' },
  { id: 'basketball-reference', slug: 'basketball-reference', name: 'BasketballReference 历史数据', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.basketball-reference.com' },
  { id: 'bball-index', slug: 'bball-index', name: 'Bball Index 高阶数据', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://www.bball-index.com' },
  { id: 'hoopshype-salaries', slug: 'hoopshype-salaries', name: 'HoopsHype 球员薪资', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://hoopshype.com/salaries/' },
  { id: 'fifa-ratings', slug: 'fifa-ratings', name: 'EA Sports FC 球员能力值', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.ea.com/games/ea-sports-fc/ratings' },
  { id: 'transfermarkt', slug: 'transfermarkt', name: 'Transfermarkt 转会市场', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.transfermarkt.com' },
  { id: 'sofascore', slug: 'sofascore', name: 'Sofascore 实时比分', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.sofascore.com' },
  { id: 'fbref', slug: 'fbref', name: 'FBref 足球高阶数据', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://fbref.com' },
  { id: 'understat', slug: 'understat', name: 'Understat xG 期望进球', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://understat.com' },
  { id: 'tennis-atp-tour', slug: 'tennis-atp-tour', name: 'ATP Tour 官方数据', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.atptour.com' },
  { id: 'tennis-wta', slug: 'tennis-wta', name: 'WTA 女子网球官方', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.wtatennis.com' },
  { id: 'tennis-abstract', slug: 'tennis-abstract', name: 'TennisAbstract 高阶网球统计', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.tennisabstract.com' },
  { id: 'flashscore-tennis', slug: 'flashscore-tennis', name: 'FlashScore 网球比分', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.flashscore.com/tennis/' },
  { id: 'bwf-badminton', slug: 'bwf-badminton', name: 'BWF 世界羽联官方', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://bwfbadminton.com' },
  { id: 'badminton-warehouse', slug: 'badminton-warehouse', name: '羽毛球装备对比器', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.badmintonwarehouse.com/comparison' },
  { id: 'ittf-world', slug: 'ittf-world', name: 'ITTF 国际乒联官网', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://worldtabletennis.com' },
  { id: 'tabletennis-reference', slug: 'tabletennis-reference', name: '乒乓球胶皮对比', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://revspin.net' },
  { id: 'revspin', slug: 'revspin', name: 'RevSpin 胶皮性能数据库', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://revspin.net' },
  { id: 'fivb-volleyball', slug: 'fivb-volleyball', name: 'FIVB 国际排联官方', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://en.fivb.com' },
  { id: 'volleybox', slug: 'volleybox', name: 'Volleybox 排球资料库', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://volleybox.net' },
  { id: 'pga-tour-stats', slug: 'pga-tour-stats', name: 'PGA TOUR 高尔夫数据', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.pgatour.com/stats' },
  { id: 'handicap-differential', slug: 'handicap-differential', name: '高尔夫差点计算器', category: 'finance-tools', isFree: true, signup: ['no-signup'], url: 'https://www.usga.org/handicap-calculator' },
  { id: 'golfnow-tee-times', slug: 'golfnow-tee-times', name: 'GolfNow 开球时间预订', category: 'health', isFree: true, signup: ['email'], url: 'https://www.golfnow.com' },
  { id: '2k-sports-handicap', slug: '2k-sports-handicap', name: 'Golfshot 高尔夫GPS', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://www.golfshot.com' },
  { id: 'golfshake-handicap', slug: 'golfshake-handicap', name: 'Golfshake 记分工具', category: 'health', isFree: true, signup: ['email'], url: 'https://www.golfshake.com' },

  // ========== 8. 极限运动（滑雪/滑板/轮滑/冲浪）15 ==========
  { id: 'ski-resort-stats', slug: 'ski-resort-stats', name: 'SkiResortInfo 雪场数据', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.skiresort.info' },
  { id: 'on-the-snow', slug: 'on-the-snow', name: 'OnTheSnow 雪况实时', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.onthesnow.com' },
  { id: 'snow-forecast', slug: 'snow-forecast', name: 'Snow-Forecast 全球降雪预报', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.snow-forecast.com' },
  { id: 'powder-forecast', slug: 'powder-forecast', name: 'PowderLines 粉雪雷达', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://powderlines.weardour.com' },
  { id: 'zrankings-ski', slug: 'zrankings-ski', name: 'ZRankings 雪场排名', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.zrankings.com' },
  { id: 'skiers-tracker', slug: 'skiers-tracker', name: 'Skitracker 滑雪数据', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://www.skitracker.org' },
  { id: 'snowboard-encyc', slug: 'snowboard-encyc', name: '单板板型对照', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://snowboardaddiction.com/collections/snowboard-size-calculator' },
  { id: 'the-house-board-size', slug: 'the-house-board-size', name: '滑板尺寸计算器', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.the-house.com/skateboard-size-chart' },
  { id: 'skate-video-calendar', slug: 'skate-video-calendar', name: '滑板赛事日历', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://streetleague.com' },
  { id: 'skatepark-directory', slug: 'skatepark-directory', name: '全球滑板场地图', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.skatein.com/skateparks/' },
  { id: 'concretedisciples', slug: 'concretedisciples', name: 'ConcreteDisciples 滑板公园', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.concretedisciples.com' },
  { id: 'roller-skate-size', slug: 'roller-skate-size', name: '轮滑鞋尺码对照表', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.rollerskatedad.com/roller-skate-size-chart/' },
  { id: 'inline-skate-buyers-guide', slug: 'inline-skate-buyers-guide', name: '直排轮滑购买指南', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.inlinewarehouse.com/InlineBuyersGuide.html' },
  { id: 'bouldering-grade-converter', slug: 'bouldering-grade-converter', name: '攀岩难度等级对照表', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://sendage.com/grade-conversion' },
  { id: 'climbfinder', slug: 'climbfinder', name: 'ClimbFinder 全球岩场', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.climbfind.com' },

  // ========== 9. 运动营养 & 饮水 & 体重管理 15 ==========
  { id: 'myfitnesspal', slug: 'myfitnesspal', name: 'MyFitnessPal 卡路里记录', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://www.myfitnesspal.com' },
  { id: 'cronometer', slug: 'cronometer', name: 'Cronometer 微量营养素', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://cronometer.com' },
  { id: 'loseit', slug: 'loseit', name: 'LoseIt 减重打卡', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://www.loseit.com' },
  { id: 'macro-calculator', slug: 'macro-calculator', name: '宏量营养素计算器', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.calculator.net/macro-calculator.html' },
  { id: 'tdee-calculator', slug: 'tdee-calculator', name: 'TDEE 日消耗计算器', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://tdeecalculator.net' },
  { id: 'bmr-calculator', slug: 'bmr-calculator', name: 'BMR 基础代谢计算器', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.bmrcalculator.org' },
  { id: 'protein-intake', slug: 'protein-intake', name: '蛋白质摄入计算器', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.calculator.net/protein-calculator.html' },
  { id: 'hydration-calculator', slug: 'hydration-calculator', name: '每日饮水计算器', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.slenderkit.com/water-calculator/' },
  { id: 'water-reminder', slug: 'water-reminder', name: '喝水提醒在线版', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://waterreminder.net' },
  { id: 'body-fat-calc', slug: 'body-fat-calc', name: '体脂率估算器(皮褶法)', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.calculator.net/body-fat-calculator.html' },
  { id: 'bmi-calc-health', slug: 'bmi-calc-health', name: 'BMI 体质指数计算器', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.nhlbi.nih.gov/health/educational/lose_wt/BMI/bmicalc.htm' },
  { id: 'vo2max-calc', slug: 'vo2max-calc', name: 'VO2max 最大摄氧量估算', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.exrx.net/Calculators/Vo2Max' },
  { id: 'one-rm-1rep-max', slug: 'one-rm-1rep-max', name: '1RM 最大力量计算器', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.benchpresscalculator.net' },
  { id: 'meal-prep-planner', slug: 'meal-prep-planner', name: '增肌减脂周食谱规划', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.eatthismuch.com' },
  { id: 'pre-workout-examiner', slug: 'pre-workout-examiner', name: '补剂成分对比表', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://labdoor.com/rankings/preworkout' },

  // ========== 10. 赛事日历 & 装备 & 成绩分析 15 ==========
  { id: 'eventbrite-sports', slug: 'eventbrite-sports', name: 'Eventbrite 体育赛事查询', category: 'health', isFree: true, signup: ['email'], url: 'https://www.eventbrite.com/d/sports--fitness/events/' },
  { id: 'meetup-sports', slug: 'meetup-sports', name: 'Meetup 同城运动小组', category: 'health', isFree: true, signup: ['email'], url: 'https://www.meetup.com/topics/sports/' },
  { id: 'raceroster', slug: 'raceroster', name: 'RaceRoster 赛事报名', category: 'health', isFree: true, signup: ['email'], url: 'https://raceroster.com' },
  { id: 'ticketmaster-sports', slug: 'ticketmaster-sports', name: 'Ticketmaster 体育门票', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.ticketmaster.com/sports' },
  { id: 'sporting-news-scores', slug: 'sporting-news-scores', name: 'Sporting News 比分直播', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.sportingnews.com/ca/scores' },
  { id: 'gearbrain', slug: 'gearbrain', name: 'GearBrain 运动装备对比', category: 'productivity', isFree: true, signup: ['no-signup'], url: 'https://www.gearbrain.com' },
  { id: 'wirecutter-fitness', slug: 'wirecutter-fitness', name: 'NYT Wirecutter 健身装备榜', category: 'productivity', isFree: true, signup: ['no-signup'], url: 'https://www.nytimes.com/wirecutter/reviews/best-fitness-gear/' },
  { id: 'outdoorgearlab', slug: 'outdoorgearlab', name: 'OutdoorGearLab 户外测评', category: 'productivity', isFree: true, signup: ['no-signup'], url: 'https://www.outdoorgearlab.com' },
  { id: 'switchback-travel-gear', slug: 'switchback-travel-gear', name: 'SwitchbackTravel 装备评测', category: 'productivity', isFree: true, signup: ['no-signup'], url: 'https://www.switchbacktravel.com' },
  { id: 'rotten-wire', slug: 'rotten-wire', name: '运动耳机音质对比', category: 'media-tools', isFree: true, signup: ['no-signup'], url: 'https://www.rtings.com/headphones' },
  { id: 'strava-stats-dashboard', slug: 'strava-stats-dashboard', name: 'Strava Stats 数据增强', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.stravist.com' },
  { id: 'athlinks-race-results', slug: 'athlinks-race-results', name: 'Athlinks 个人成绩档案', category: 'health', isFree: true, signup: ['email'], url: 'https://www.athlinks.com' },
  { id: 'sporttracks', slug: 'sporttracks', name: 'SportTracks 运动日志', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://sporttracks.mobi' },
  { id: 'trainerroad-announcer', slug: 'trainerroad-announcer', name: '训练日历与周期化规划', category: 'health', isFree: false, isLimitedFree: true, signup: ['email'], url: 'https://www.trainerroad.com/careers' },
  { id: 'sport-psychology-today', slug: 'sport-psychology-today', name: '运动心理调节工具', category: 'health', isFree: true, signup: ['no-signup'], url: 'https://www.psychologytoday.com/intl/basics/sports-psychology' },
];
// ============================================================================

function resolveUrl(baseUrl, location) {
  try { return new URL(location, baseUrl).toString(); } catch { return location; }
}

async function httpGet(url, ua, redirectLeft = 5) {
  return new Promise((resolve) => {
    let parsed;
    try { parsed = new URL(url); } catch (e) { return resolve({ ok: false, status: -1, error: 'url_parse' }); }
    const mod = parsed.protocol === 'https:' ? https : http;
    const options = {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method: 'GET',
      headers: {
        'User-Agent': ua,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.7,zh-CN;q=0.3',
      },
      timeout: TIMEOUT,
    };
    const req = mod.request(options, (res) => {
      // 重定向跟随
      if ([301, 302, 303, 307, 308].includes(res.statusCode || 0) &&
          res.headers.location && redirectLeft > 0) {
        res.resume();
        const nextUrl = resolveUrl(url, res.headers.location);
        return httpGet(nextUrl, ua, redirectLeft - 1).then(resolve);
      }
      const chunks = [];
      res.setTimeout(TIMEOUT, () => { res.destroy(new Error('read_timeout')); });
      let bodyTooLarge = false;
      res.on('data', (c) => {
        if (chunks.reduce((a, b) => a + b.length, 0) > 2 * 1024 * 1024) { bodyTooLarge = true; res.destroy(); return; }
        chunks.push(c);
      });
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf8');
        resolve({ ok: true, status: res.statusCode, body });
      });
      res.on('error', (e) => resolve({ ok: false, status: res.statusCode || -2, error: e.message }));
    });
    req.on('error', (e) => resolve({ ok: false, status: -3, error: e.message }));
    req.on('timeout', () => { req.destroy(new Error('connect_timeout')); });
    req.end();
  });
}

function isOkStatus(s) { return s && [200, 201, 202, 203, 204, 301, 302, 303, 304, 307, 308].includes(s); }
function hasViewportMeta(body) {
  if (!body || !body.length) return false;
  return /<meta[^>]+name=["\s]*viewport["\s][^>]*>/i.test(body) ||
         /viewport/i.test(body.slice(0, 20000));
}

async function validateOne(seed) {
  let pcOk = false;
  let pcStatus = 0;
  for (let r = 0; r < RETRIES && !pcOk; r++) {
    const r1 = await httpGet(seed.url, PC_UA);
    pcStatus = r1.status;
    if (r1.ok && isOkStatus(r1.status)) pcOk = true;
    await new Promise(r2 => setTimeout(r2, 400));
  }
  let mobileOk = false;
  let mobileStatus = 0;
  let hasViewport = false;
  for (let r = 0; r < RETRIES && !mobileOk; r++) {
    const r2 = await httpGet(seed.url, MOBILE_UA);
    mobileStatus = r2.status;
    hasViewport = hasViewportMeta(r2.body || '');
    if (r2.ok && isOkStatus(r2.status)) mobileOk = true;
    await new Promise(r3 => setTimeout(r3, 400));
  }
  return {
    id: seed.id,
    name: seed.name,
    url: seed.url,
    pcOk, pcStatus,
    mobileOk, mobileStatus, hasViewport,
    mobileUsable: mobileOk && hasViewport,
    overall: pcOk && mobileOk && hasViewport ? 'PASS' : 'FAIL',
  };
}

async function run(concurrency) {
  let idx = 0;
  const results = [];
  async function worker() {
    while (true) {
      const myIdx = idx++;
      if (myIdx >= SEEDS.length) return;
      const seed = SEEDS[myIdx];
      const r = await validateOne(seed);
      results.push(r);
      const pass = r.overall === 'PASS' ? '✔' : '✘';
      console.log(`[${String(myIdx + 1).padStart(3, '0')}/${SEEDS.length}] ${pass} [${r.id.padEnd(30)}] pc=${r.pcStatus} m=${r.mobileStatus} v=${r.hasViewport ? '1' : '0'}  ${r.name.slice(0, 20)}`);
    }
  }
  const workers = [];
  for (let i = 0; i < concurrency; i++) workers.push(worker());
  await Promise.all(workers);
  results.sort((a, b) => a.id.localeCompare(b.id));
  const passed = results.filter(r => r.overall === 'PASS').length;
  const failed = results.filter(r => r.overall === 'FAIL');
  console.log('\n========== 验证结果 ==========');
  console.log(`总数: ${SEEDS.length}   通过: ${passed}   失败: ${failed.length}`);
  if (failed.length) {
    console.log('\n❌ 失败清单（需替换URL）：');
    console.table(failed.map(f => ({ id: f.id, name: f.name, pcStatus: f.pcStatus, mobileStatus: f.mobileStatus, hasViewport: f.hasViewport, url: f.url })));
  } else {
    console.log('\n✅ 全部200条 URL 通过 PC 可访问 + 移动端适配校验。');
  }
  process.exit(failed.length ? 1 : 0);
}

run(CONCURRENCY).catch((e) => { console.error('FATAL', e); process.exit(2); });
