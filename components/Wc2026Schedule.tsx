'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, MapPin, Star, StarOff, Search, X, ChevronRight, Trophy, Swords, Clock, Users, Filter, Globe, ChevronDown } from 'lucide-react';

type Locale = 'zh' | 'en' | 'fr' | 'es' | 'hi' | 'ar';

const LOCALE_STRINGS: Record<Locale, Record<string, string>> = {
  zh: {
    subtitle: '2026 美加墨世界杯 · 48队12小组 · 104场完整赛程 · 离线可用',
    timezoneLabel: '显示时区',
    usEastern: '美东 (UTC-5)',
    usPacific: '美西 (UTC-8)',
    usCentral: '中部 (UTC-6)',
    usMountain: '山地 (UTC-7)',
    mexicoCity: '墨西哥城 (UTC-6)',
    vancouver: '温哥华 (UTC-8)',
    toronto: '多伦多 (UTC-5)',
    beijing: '北京时间 (UTC+8)',
    userLocal: '本地时区',
    filterLabel: '比赛筛选',
    all: '全部',
    today: '今日',
    tomorrow: '明日',
    groupStage: '小组赛',
    knockout: '淘汰赛',
    r32: '32强',
    r16: '16强',
    qf: '8强',
    sf: '半决赛',
    final: '决赛',
    thirdPlace: '三四名',
    groupLabel: '小组',
    teamLabel: '球队',
    searchPlaceholder: '搜索球队、城市、场馆…',
    favOnly: '只看收藏',
    clearFav: '清空收藏',
    matchDetail: '比赛详情',
    kickoff: '开球时间',
    venue: '场馆',
    city: '城市',
    stage: '阶段',
    h2h: '历史交锋（模拟数据）',
    addFav: '☆ 收藏',
    rmFav: '★ 已收藏',
    capacity: '容量',
    offline: '✅ 纯前端 · 完全离线可用',
    matchesFound: '找到比赛：',
    selectTeam: '选择球队',
    close: '关闭',
  },
  en: {
    subtitle: 'World Cup 2026 · 48 teams / 12 groups · 104 matches · Offline-ready',
    timezoneLabel: 'Timezone',
    usEastern: 'ET (UTC-5)',
    usPacific: 'PT (UTC-8)',
    usCentral: 'CT (UTC-6)',
    usMountain: 'MT (UTC-7)',
    mexicoCity: 'Mexico City (UTC-6)',
    vancouver: 'Vancouver (UTC-8)',
    toronto: 'Toronto (UTC-5)',
    beijing: 'Beijing (UTC+8)',
    userLocal: 'Your local',
    filterLabel: 'Filters',
    all: 'All',
    today: 'Today',
    tomorrow: 'Tomorrow',
    groupStage: 'Groups',
    knockout: 'Knockout',
    r32: 'R32',
    r16: 'R16',
    qf: 'Quarters',
    sf: 'Semis',
    final: 'Final',
    thirdPlace: '3rd Place',
    groupLabel: 'Group',
    teamLabel: 'Team',
    searchPlaceholder: 'Search team, city, venue…',
    favOnly: 'Favourites',
    clearFav: 'Clear favs',
    matchDetail: 'Match details',
    kickoff: 'Kick-off',
    venue: 'Venue',
    city: 'City',
    stage: 'Stage',
    h2h: 'Head to head (simulated)',
    addFav: '☆ Favourite',
    rmFav: '★ Favourited',
    capacity: 'Capacity',
    offline: '✅ Pure frontend · 100% offline',
    matchesFound: 'Matches:',
    selectTeam: 'Select team',
    close: 'Close',
  },
  fr: {
    subtitle: 'Coupe du Monde 2026 · 48 équipes · 12 groupes · 104 matchs · Hors ligne',
    timezoneLabel: 'Fuseau',
    usEastern: 'ET (UTC-5)',
    usPacific: 'PT (UTC-8)',
    usCentral: 'CT (UTC-6)',
    usMountain: 'MT (UTC-7)',
    mexicoCity: 'Mexico (UTC-6)',
    vancouver: 'Vancouver (UTC-8)',
    toronto: 'Toronto (UTC-5)',
    beijing: 'Pékin (UTC+8)',
    userLocal: 'Local',
    filterLabel: 'Filtres',
    all: 'Tous',
    today: "Aujourd'hui",
    tomorrow: 'Demain',
    groupStage: 'Groupes',
    knockout: 'Élim. directes',
    r32: '32es',
    r16: '16es',
    qf: 'Quarts',
    sf: 'Demis',
    final: 'Finale',
    thirdPlace: '3e place',
    groupLabel: 'Groupe',
    teamLabel: 'Équipe',
    searchPlaceholder: 'Chercher équipe, ville, stade…',
    favOnly: 'Favoris',
    clearFav: 'Effacer',
    matchDetail: 'Détails du match',
    kickoff: 'Coup d\'envoi',
    venue: 'Stade',
    city: 'Ville',
    stage: 'Phase',
    h2h: 'Face-à-face (simulé)',
    addFav: '☆ Favori',
    rmFav: '★ Favori',
    capacity: 'Capacité',
    offline: '✅ Frontend pur · 100% hors ligne',
    matchesFound: 'Matchs :',
    selectTeam: 'Choisir équipe',
    close: 'Fermer',
  },
  es: {
    subtitle: 'Mundial 2026 · 48 selecciones · 12 grupos · 104 partidos · Sin conexión',
    timezoneLabel: 'Zona horaria',
    usEastern: 'ET (UTC-5)',
    usPacific: 'PT (UTC-8)',
    usCentral: 'CT (UTC-6)',
    usMountain: 'MT (UTC-7)',
    mexicoCity: 'CDMX (UTC-6)',
    vancouver: 'Vancouver (UTC-8)',
    toronto: 'Toronto (UTC-5)',
    beijing: 'Pekín (UTC+8)',
    userLocal: 'Tu zona',
    filterLabel: 'Filtros',
    all: 'Todos',
    today: 'Hoy',
    tomorrow: 'Mañana',
    groupStage: 'Grupos',
    knockout: 'Eliminatoria',
    r32: '32avos',
    r16: '16avos',
    qf: 'Cuartos',
    sf: 'Semis',
    final: 'Final',
    thirdPlace: '3er puesto',
    groupLabel: 'Grupo',
    teamLabel: 'Selección',
    searchPlaceholder: 'Buscar equipo, ciudad, estadio…',
    favOnly: 'Favoritos',
    clearFav: 'Borrar',
    matchDetail: 'Detalles',
    kickoff: 'Inicio',
    venue: 'Estadio',
    city: 'Ciudad',
    stage: 'Fase',
    h2h: 'Antecedentes (simulados)',
    addFav: '☆ Favorito',
    rmFav: '★ Favorito',
    capacity: 'Capacidad',
    offline: '✅ Frontend puro · 100% offline',
    matchesFound: 'Partidos:',
    selectTeam: 'Elegir selección',
    close: 'Cerrar',
  },
  hi: {
    subtitle: 'विश्व कप 2026 · 48 टीमें · 12 ग्रुप · 104 मैच · ऑफलाइन',
    timezoneLabel: 'समय क्षेत्र',
    usEastern: 'ET (UTC-5)',
    usPacific: 'PT (UTC-8)',
    usCentral: 'CT (UTC-6)',
    usMountain: 'MT (UTC-7)',
    mexicoCity: 'मेक्सिको (UTC-6)',
    vancouver: 'वैंकूवर (UTC-8)',
    toronto: 'टोरोंटो (UTC-5)',
    beijing: 'बीजिंग (UTC+8)',
    userLocal: 'स्थानीय',
    filterLabel: 'फ़िल्टर',
    all: 'सभी',
    today: 'आज',
    tomorrow: 'कल',
    groupStage: 'ग्रुप स्टेज',
    knockout: 'नॉकआउट',
    r32: '32 का दौर',
    r16: '16 का दौर',
    qf: 'क्वार्टर',
    sf: 'सेमी',
    final: 'फाइनल',
    thirdPlace: 'तीसरा',
    groupLabel: 'ग्रुप',
    teamLabel: 'टीम',
    searchPlaceholder: 'टीम / शहर / स्टेडियम खोजें…',
    favOnly: 'पसंदीदा',
    clearFav: 'हटाएँ',
    matchDetail: 'मैच विवरण',
    kickoff: 'किक-ऑफ',
    venue: 'स्टेडियम',
    city: 'शहर',
    stage: 'स्टेज',
    h2h: 'आमने-सामने (अनुमान)',
    addFav: '☆ फेवरेट',
    rmFav: '★ फेवरेट',
    capacity: 'क्षमता',
    offline: '✅ फ्रंटएंड · ऑफलाइन',
    matchesFound: 'मैच मिले:',
    selectTeam: 'टीम चुनें',
    close: 'बंद करें',
  },
  ar: {
    subtitle: 'كأس العالم 2026 · 48 منتخباً · 12 مجموعة · 104 مباراة · بدون اتصال',
    timezoneLabel: 'المنطقة الزمنية',
    usEastern: 'ET (UTC-5)',
    usPacific: 'PT (UTC-8)',
    usCentral: 'CT (UTC-6)',
    usMountain: 'MT (UTC-7)',
    mexicoCity: 'مكسيكو (UTC-6)',
    vancouver: 'فانكوفر (UTC-8)',
    toronto: 'تورونتو (UTC-5)',
    beijing: 'بكين (UTC+8)',
    userLocal: 'المنطقة المحلية',
    filterLabel: 'الفلاتر',
    all: 'الكل',
    today: 'اليوم',
    tomorrow: 'غداً',
    groupStage: 'دور المجموعات',
    knockout: 'الخروج بمباراة',
    r32: 'دور 32',
    r16: 'دور 16',
    qf: 'الربع نهائي',
    sf: 'نصف نهائي',
    final: 'النهائي',
    thirdPlace: 'المركز الثالث',
    groupLabel: 'المجموعة',
    teamLabel: 'المنتخب',
    searchPlaceholder: 'ابحث عن منتخب / مدينة / ملعب…',
    favOnly: 'المفضلة',
    clearFav: 'مسح',
    matchDetail: 'تفاصيل المباراة',
    kickoff: 'وقت البدء',
    venue: 'الملعب',
    city: 'المدينة',
    stage: 'المرحلة',
    h2h: 'سابقة المواجهات (محاكاة)',
    addFav: '☆ مفضل',
    rmFav: '★ مفضل',
    capacity: 'السعة',
    offline: '✅ واجهة أمامية · بدون إنترنت',
    matchesFound: 'عدد المباريات:',
    selectTeam: 'اختر منتخباً',
    close: 'إغلاق',
  },
};

type TZKey = 'usEastern' | 'usPacific' | 'usCentral' | 'usMountain' | 'mexicoCity' | 'vancouver' | 'toronto' | 'beijing' | 'userLocal';

const TIMEZONES: { key: TZKey; iana: string; offset: number; }[] = [
  { key: 'usEastern', iana: 'America/New_York', offset: -5 },
  { key: 'usPacific', iana: 'America/Los_Angeles', offset: -8 },
  { key: 'usCentral', iana: 'America/Chicago', offset: -6 },
  { key: 'usMountain', iana: 'America/Denver', offset: -7 },
  { key: 'mexicoCity', iana: 'America/Mexico_City', offset: -6 },
  { key: 'vancouver', iana: 'America/Vancouver', offset: -8 },
  { key: 'toronto', iana: 'America/Toronto', offset: -5 },
  { key: 'beijing', iana: 'Asia/Shanghai', offset: 8 },
  { key: 'userLocal', iana: '', offset: 0 },
];

const GROUPS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'] as const;
type GroupKey = typeof GROUPS[number];

interface Team {
  key: string;
  label: string;
  en: string;
  colors: [string, string, string?];
  accent: string;
  isHypothetical?: boolean;
}

const TEAMS_REAL: Team[] = [
  { key: 'ARG', label: '阿根廷', en: 'Argentina', colors: ['#75AADB', '#FFFFFF', '#FCBF49'], accent: '#F6B400' },
  { key: 'FRA', label: '法国', en: 'France', colors: ['#002395', '#FFFFFF', '#ED2939'], accent: '#ED2939' },
  { key: 'BRA', label: '巴西', en: 'Brazil', colors: ['#009739', '#FEDD00', '#002776'], accent: '#FEDD00' },
  { key: 'ENG', label: '英格兰', en: 'England', colors: ['#FFFFFF', '#CF142B'], accent: '#0F2243' },
  { key: 'ESP', label: '西班牙', en: 'Spain', colors: ['#AA151B', '#F1BF00'], accent: '#001E62' },
  { key: 'GER', label: '德国', en: 'Germany', colors: ['#000000', '#DD0000', '#FFCE00'], accent: '#FFCE00' },
  { key: 'POR', label: '葡萄牙', en: 'Portugal', colors: ['#006600', '#FF0000'], accent: '#FFD700' },
  { key: 'NED', label: '荷兰', en: 'Netherlands', colors: ['#FF6600', '#21468B'], accent: '#FFB800' },
  { key: 'ITA', label: '意大利', en: 'Italy', colors: ['#008C45', '#F4F5F0', '#CD212A'], accent: '#0056A4' },
  { key: 'USA', label: '美国', en: 'USA', colors: ['#B31942', '#FFFFFF', '#0A3161'], accent: '#0A3161' },
  { key: 'MEX', label: '墨西哥', en: 'Mexico', colors: ['#006847', '#FFFFFF', '#CE1126'], accent: '#D4AF37' },
  { key: 'CAN', label: '加拿大', en: 'Canada', colors: ['#FF0000', '#FFFFFF'], accent: '#C8102E' },
  { key: 'BEL', label: '比利时', en: 'Belgium', colors: ['#000000', '#FAE042', '#ED2939'], accent: '#ED2939' },
  { key: 'URU', label: '乌拉圭', en: 'Uruguay', colors: ['#0038A8', '#FFFFFF'], accent: '#FCD116' },
  { key: 'CRO', label: '克罗地亚', en: 'Croatia', colors: ['#00296B', '#FFFFFF', '#C71F37'], accent: '#C71F37' },
  { key: 'JPN', label: '日本', en: 'Japan', colors: ['#FFFFFF', '#BC002D'], accent: '#00008B' },
  { key: 'KOR', label: '韩国', en: 'South Korea', colors: ['#FFFFFF', '#C60C30', '#003478'], accent: '#003478' },
  { key: 'MAR', label: '摩洛哥', en: 'Morocco', colors: ['#C1272D', '#006233'], accent: '#006233' },
  { key: 'SAU', label: '沙特', en: 'Saudi Arabia', colors: ['#006C35', '#FFFFFF'], accent: '#CF142B' },
  { key: 'AUS', label: '澳大利亚', en: 'Australia', colors: ['#00843D', '#FFCD00', '#00008B'], accent: '#FFCD00' },
  { key: 'DEN', label: '丹麦', en: 'Denmark', colors: ['#C8102E', '#FFFFFF'], accent: '#C8102E' },
  { key: 'SUI', label: '瑞士', en: 'Switzerland', colors: ['#FF0000', '#FFFFFF'], accent: '#D52B1E' },
  { key: 'SRB', label: '塞尔维亚', en: 'Serbia', colors: ['#0C4076', '#C6363C', '#FFFFFF'], accent: '#C6363C' },
  { key: 'CMR', label: '喀麦隆', en: 'Cameroon', colors: ['#007A5E', '#CE1126', '#FCD116'], accent: '#FCD116' },
  { key: 'SEN', label: '塞内加尔', en: 'Senegal', colors: ['#00853F', '#FDEF42', '#E31B23'], accent: '#E31B23' },
  { key: 'GHA', label: '加纳', en: 'Ghana', colors: ['#CE1126', '#FCD116', '#006B3F'], accent: '#000000' },
  { key: 'ECU', label: '厄瓜多尔', en: 'Ecuador', colors: ['#FFDD00', '#00205B', '#EF3340'], accent: '#00205B' },
  { key: 'QAT', label: '卡塔尔', en: 'Qatar', colors: ['#8A1538', '#FFFFFF'], accent: '#8A1538' },
  { key: 'IRN', label: '伊朗', en: 'Iran', colors: ['#239F40', '#FFFFFF', '#DA0000'], accent: '#239F40' },
  { key: 'POL', label: '波兰', en: 'Poland', colors: ['#FFFFFF', '#DC143C'], accent: '#DC143C' },
  { key: 'COL', label: '哥伦比亚', en: 'Colombia', colors: ['#FCD116', '#003893', '#CE1126'], accent: '#FCD116' },
  { key: 'CRC', label: '哥斯达黎加', en: 'Costa Rica', colors: ['#002B7F', '#FFFFFF', '#CE1126'], accent: '#CE1126' },
];

const TEAMS_HYPOTHETICAL: Team[] = [
  { key: 'EGY', label: '埃及', en: 'Egypt', colors: ['#CE1126', '#FFFFFF', '#000000'], accent: '#FCD116', isHypothetical: true },
  { key: 'NGA', label: '尼日利亚', en: 'Nigeria', colors: ['#008751', '#FFFFFF', '#008751'], accent: '#006B3F', isHypothetical: true },
  { key: 'SWE', label: '瑞典', en: 'Sweden', colors: ['#006AA7', '#FECC00'], accent: '#FECC00', isHypothetical: true },
  { key: 'PER', label: '秘鲁', en: 'Peru', colors: ['#D91023', '#FFFFFF', '#D91023'], accent: '#D91023', isHypothetical: true },
  { key: 'AUT', label: '奥地利', en: 'Austria', colors: ['#ED2939', '#FFFFFF', '#ED2939'], accent: '#ED2939', isHypothetical: true },
  { key: 'UKR', label: '乌克兰', en: 'Ukraine', colors: ['#0057B8', '#FFD700'], accent: '#FFD700', isHypothetical: true },
  { key: 'JAM', label: '牙买加', en: 'Jamaica', colors: ['#009B3A', '#000000', '#FEDD00'], accent: '#FEDD00', isHypothetical: true },
  { key: 'CHI', label: '智利', en: 'Chile', colors: ['#0039A6', '#FFFFFF', '#D52B1E'], accent: '#D52B1E', isHypothetical: true },
  { key: 'HUN', label: '匈牙利', en: 'Hungary', colors: ['#CD2A3E', '#FFFFFF', '#477050'], accent: '#CD2A3E', isHypothetical: true },
  { key: 'ALG', label: '阿尔及利亚', en: 'Algeria', colors: ['#006233', '#FFFFFF', '#CE1126'], accent: '#CE1126', isHypothetical: true },
  { key: 'CZE', label: '捷克', en: 'Czechia', colors: ['#D7141A', '#FFFFFF', '#11457E'], accent: '#D7141A', isHypothetical: true },
  { key: 'NOR', label: '挪威', en: 'Norway', colors: ['#EF2B2D', '#FFFFFF', '#002868'], accent: '#002868', isHypothetical: true },
  { key: 'UZB', label: '乌兹别克', en: 'Uzbekistan', colors: ['#1EB53A', '#0099B5', '#CE1126'], accent: '#1EB53A', isHypothetical: true },
  { key: 'VEN', label: '委内瑞拉', en: 'Venezuela', colors: ['#CE1126', '#FCD116', '#00247D'], accent: '#FCD116', isHypothetical: true },
  { key: 'PAN', label: '巴拿马', en: 'Panama', colors: ['#CE1126', '#FFFFFF', '#005293'], accent: '#CE1126', isHypothetical: true },
  { key: 'TUN', label: '突尼斯', en: 'Tunisia', colors: ['#CE1126', '#FFFFFF'], accent: '#CE1126', isHypothetical: true },
];

const ALL_TEAMS: Team[] = [...TEAMS_REAL, ...TEAMS_HYPOTHETICAL];

const TEAM_BY_KEY: Record<string, Team> = ALL_TEAMS.reduce((acc, t) => {
  acc[t.key] = t;
  return acc;
}, {} as Record<string, Team>);

const GROUP_ASSIGNMENT: Record<GroupKey, [string, string, string, string]> = {
  A: ['MEX', 'CAN', 'KOR', 'GHA'],
  B: ['USA', 'NED', 'AUS', 'CMR'],
  C: ['ARG', 'URU', 'SRB', 'ECU'],
  D: ['FRA', 'DEN', 'JPN', 'TUN'],
  E: ['BRA', 'POR', 'MAR', 'PAN'],
  F: ['ENG', 'CRO', 'SUI', 'SAU'],
  G: ['GER', 'BEL', 'COL', 'CRC'],
  H: ['ESP', 'ITA', 'EGY', 'NGA'],
  I: ['POL', 'SWE', 'IRN', 'PER'],
  J: ['SEN', 'AUT', 'UKR', 'JAM'],
  K: ['CHI', 'HUN', 'QAT', 'ALG'],
  L: ['CZE', 'NOR', 'UZB', 'VEN'],
};

const VENUES: { city: string; stadium: string; cap: string; }[] = [
  { city: 'New York', stadium: 'MetLife Stadium', cap: '82,500' },
  { city: 'Los Angeles', stadium: 'SoFi Stadium', cap: '70,240' },
  { city: 'Seattle', stadium: 'Lumen Field', cap: '69,000' },
  { city: 'Miami', stadium: 'Hard Rock Stadium', cap: '64,767' },
  { city: 'Dallas', stadium: 'AT&T Stadium', cap: '80,000' },
  { city: 'Houston', stadium: 'NRG Stadium', cap: '71,795' },
  { city: 'Atlanta', stadium: 'Mercedes-Benz Stadium', cap: '71,000' },
  { city: 'Boston', stadium: 'Gillette Stadium', cap: '65,878' },
  { city: 'Philadelphia', stadium: 'Lincoln Financial Field', cap: '69,176' },
  { city: 'Chicago', stadium: 'Soldier Field', cap: '61,500' },
  { city: 'Toronto', stadium: 'BMO Field', cap: '45,736' },
  { city: 'Vancouver', stadium: 'BC Place', cap: '54,320' },
  { city: 'Montréal', stadium: 'Olympic Stadium', cap: '61,004' },
  { city: 'Mexico City', stadium: 'Estadio Azteca', cap: '87,523' },
  { city: 'Guadalajara', stadium: 'Estadio Akron', cap: '48,071' },
  { city: 'Monterrey', stadium: 'Estadio BBVA', cap: '53,500' },
];

type StageKey = 'group' | 'r32' | 'r16' | 'qf' | 'sf' | 'tp' | 'final';

const STAGE_LABEL: Record<StageKey, string> = {
  group: '小组赛 / Group Stage',
  r32: '32强 / Round of 32',
  r16: '16强 / Round of 16',
  qf: '8强 / Quarter-Finals',
  sf: '半决赛 / Semi-Finals',
  tp: '三四名 / 3rd Place',
  final: '决赛 / Final',
};

interface Fixture {
  id: string;
  stage: StageKey;
  group?: GroupKey;
  homeKey: string;
  awayKey: string;
  city: string;
  venue: string;
  cap: string;
  kickoffUTC: number;
  scoreH?: number;
  scoreA?: number;
  result?: 'H' | 'D' | 'A';
}

const OPENER_UTC_MS = Date.UTC(2026, 5, 11, 22, 0);

const FIXTURES = ((): Fixture[] => {
  const fixtures: Fixture[] = [];
  let vIdx = 0;
  const nextVenue = () => VENUES[vIdx++ % VENUES.length]!;
  let t = OPENER_UTC_MS;
  const addHours = (h: number) => { t += h * 3600_000; return t; };
  const seeds = [2, 1, 0, 2, 0, 1, 1, 2, 0, 2, 1, 0, 1, 2, 0, 1, 2, 2, 0, 1, 2, 0, 2, 1, 0, 1, 2, 2, 1, 0, 1, 2, 0, 2, 1, 2, 0, 1, 0, 2, 1, 0, 2, 1, 2, 0, 1, 2, 0, 2, 1, 0, 1, 2, 1, 0, 2, 0, 1, 2, 1, 0, 2, 1, 2, 0, 2, 1, 0, 1, 2, 0];
  let s = 0;

  GROUPS.forEach((g, gi) => {
    const teams = GROUP_ASSIGNMENT[g];
    const baseGiHr = gi === 0 ? 0 : (gi % 4) * 5;

    let md1 = addHours(baseGiHr);
    const v1 = nextVenue();
    fixtures.push(makeMatch(`G${g}-1`, 'group', g, teams[0], teams[1], v1, md1, seeds[s++]));
    const v2 = nextVenue();
    fixtures.push(makeMatch(`G${g}-2`, 'group', g, teams[2], teams[3], v2, md1 + 1.5 * 3600_000, seeds[s++]));

    let md2 = addHours(48 + (gi % 3) * 2);
    const v3 = nextVenue();
    fixtures.push(makeMatch(`G${g}-3`, 'group', g, teams[0], teams[2], v3, md2, seeds[s++]));
    const v4 = nextVenue();
    fixtures.push(makeMatch(`G${g}-4`, 'group', g, teams[1], teams[3], v4, md2 + 1.5 * 3600_000, seeds[s++]));

    let md3 = addHours(46 + (gi % 2) * 2);
    const v5 = nextVenue();
    fixtures.push(makeMatch(`G${g}-5`, 'group', g, teams[0], teams[3], v5, md3, seeds[s++]));
    const v6 = nextVenue();
    fixtures.push(makeMatch(`G${g}-6`, 'group', g, teams[1], teams[2], v6, md3 + 1.5 * 3600_000, seeds[s++]));
  });

  const top2: string[] = [];
  GROUPS.forEach((g) => {
    top2.push(GROUP_ASSIGNMENT[g][0]!);
    top2.push(GROUP_ASSIGNMENT[g][1]!);
  });
  const best3rd = ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map((g) => GROUP_ASSIGNMENT[g as GroupKey][2]!);
  const r32Pool = [...top2, ...best3rd];

  const r16Winners: string[] = [];
  let ko = addHours(72);
  for (let r = 0; r < 16; r++) {
    const v = nextVenue();
    const h = r32Pool[(r * 2) % r32Pool.length]!;
    const a = r32Pool[(r * 2 + 7) % r32Pool.length]!;
    const seed = seeds[(s++) % seeds.length]!;
    const res = seed === 0 ? ['H', 2, 1] : seed === 1 ? ['A', 1, 2] : ['H', 3, 2];
    fixtures.push({
      id: `R32-${r + 1}`, stage: 'r32',
      homeKey: h, awayKey: a, city: v.city, venue: v.stadium, cap: v.cap,
      kickoffUTC: ko + r * 6 * 3600_000,
      scoreH: res[1] as number, scoreA: res[2] as number, result: res[0] as any,
    });
    r16Winners.push(res[0] === 'H' ? h : a);
  }

  const qfWinners: string[] = [];
  ko = addHours(72);
  for (let r = 0; r < 8; r++) {
    const v = nextVenue();
    const h = r16Winners[r * 2]!;
    const a = r16Winners[r * 2 + 1]!;
    const seed = seeds[(s++) % seeds.length]!;
    const res = seed === 0 ? ['H', 1, 0] : seed === 1 ? ['A', 0, 1] : ['H', 2, 1];
    fixtures.push({
      id: `R16-${r + 1}`, stage: 'r16',
      homeKey: h, awayKey: a, city: v.city, venue: v.stadium, cap: v.cap,
      kickoffUTC: ko + r * 10 * 3600_000,
      scoreH: res[1] as number, scoreA: res[2] as number, result: res[0] as any,
    });
    qfWinners.push(res[0] === 'H' ? h : a);
  }

  const sfWinners: string[] = [];
  ko = addHours(72);
  for (let r = 0; r < 4; r++) {
    const v = nextVenue();
    const h = qfWinners[r * 2]!;
    const a = qfWinners[r * 2 + 1]!;
    const seed = seeds[(s++) % seeds.length]!;
    const res = seed === 0 ? ['H', 2, 1] : seed === 1 ? ['A', 1, 2] : ['H', 1, 0];
    fixtures.push({
      id: `QF-${r + 1}`, stage: 'qf',
      homeKey: h, awayKey: a, city: v.city, venue: v.stadium, cap: v.cap,
      kickoffUTC: ko + r * 18 * 3600_000,
      scoreH: res[1] as number, scoreA: res[2] as number, result: res[0] as any,
    });
    sfWinners.push(res[0] === 'H' ? h : a);
  }

  const finalists: string[] = [];
  const losers: string[] = [];
  ko = addHours(72);
  for (let r = 0; r < 2; r++) {
    const v = nextVenue();
    const h = sfWinners[r * 2]!;
    const a = sfWinners[r * 2 + 1]!;
    const seed = seeds[(s++) % seeds.length]!;
    const res = seed % 2 === 0 ? ['H', 2, 1] : ['A', 1, 2];
    fixtures.push({
      id: `SF-${r + 1}`, stage: 'sf',
      homeKey: h, awayKey: a, city: v.city, venue: v.stadium, cap: v.cap,
      kickoffUTC: ko + r * 22 * 3600_000,
      scoreH: res[1] as number, scoreA: res[2] as number, result: res[0] as any,
    });
    finalists.push(res[0] === 'H' ? h : a);
    losers.push(res[0] === 'H' ? a : h);
  }

  const tpV = VENUES[13]!;
  fixtures.push({
    id: 'TP', stage: 'tp',
    homeKey: losers[0]!, awayKey: losers[1]!, city: tpV.city, venue: tpV.stadium, cap: tpV.cap,
    kickoffUTC: addHours(48),
    scoreH: 2, scoreA: 1, result: 'H',
  });

  const fV = VENUES[VENUES.length - 1]!;
  fixtures.push({
    id: 'FINAL', stage: 'final',
    homeKey: finalists[0]!, awayKey: finalists[1]!, city: fV.city, venue: fV.stadium, cap: fV.cap,
    kickoffUTC: addHours(24),
    scoreH: 2, scoreA: 1, result: 'H',
  });

  return fixtures;

  function makeMatch(id: string, stage: StageKey, group: GroupKey, hk: string, ak: string, v: typeof VENUES[0], utc: number, seed: number): Fixture {
    const r = seed === 0 ? { r: 'H', h: 2, a: 1 } : seed === 1 ? { r: 'D', h: 1, a: 1 } : { r: 'A', h: 1, a: 2 };
    return {
      id, stage, group, homeKey: hk, awayKey: ak,
      city: v.city, venue: v.stadium, cap: v.cap,
      kickoffUTC: utc,
      scoreH: r.h, scoreA: r.a, result: r.r as any,
    };
  }
})();

interface H2HEntry {
  played: string;
  wdl: string;
  last: string;
}
const H2H: Record<string, H2HEntry> = {
  'ARG-FRA': { played: '13', wdl: '6W 3D 4L', last: '2022 Final · ARG 3-3 FRA (4-2p)' },
  'BRA-ARG': { played: '110', wdl: '43W 25D 42L', last: '2025 Qualifiers · ARG 1-0 BRA' },
  'ENG-FRA': { played: '32', wdl: '17W 5D 10L', last: '2022 QF · FRA 2-1 ENG' },
  'GER-ESP': { played: '27', wdl: '9W 9D 9L', last: '2022 Group · ESP 1-1 GER' },
  'POR-URU': { played: '5', wdl: '3W 0D 2L', last: '2022 Group · POR 2-0 URU' },
  'ESP-ITA': { played: '40', wdl: '13W 16D 11L', last: '2023 Nations · ESP 2-1 ITA' },
  'BRA-POR': { played: '20', wdl: '10W 5D 5L', last: '2014 Friendly · BRA 1-0 POR' },
  'FRA-DEN': { played: '17', wdl: '9W 3D 5L', last: '2022 Group · FRA 0-0 DEN' },
};
const getH2H = (a: string, b: string): H2HEntry | undefined => H2H[`${a}-${b}`] ?? H2H[`${b}-${a}`];

type FilterTab = 'all' | 'today' | 'tomorrow' | 'group' | 'knockout' | 'r32' | 'r16' | 'qf' | 'sf' | 'final';
const FAV_KEY = 'wc2026_fav_teams';

interface Props { locale?: Locale; }

const Wc2026Schedule: React.FC<Props> = ({ locale = 'zh' }) => {
  const t = LOCALE_STRINGS[locale] ?? LOCALE_STRINGS.en;

  const [tz, setTz] = useState<TZKey>('beijing');
  const [filter, setFilter] = useState<FilterTab>('all');
  const [group, setGroup] = useState<GroupKey | ''>('');
  const [teamKey, setTeamKey] = useState<string>('');
  const [search, setSearch] = useState('');
  const [favOnly, setFavOnly] = useState(false);
  const [favs, setFavs] = useState<string[]>([]);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [teamOpen, setTeamOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAV_KEY);
      if (raw) setFavs(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(favs)); } catch { /* ignore */ }
  }, [favs]);

  const toggleFav = (k: string) => {
    setFavs((arr) => arr.includes(k) ? arr.filter((x) => x !== k) : [...arr, k]);
  };

  const demoNow = useMemo(() => {
    const real = Date.now();
    const anchor = OPENER_UTC_MS + 4 * 86_400_000;
    if (real < OPENER_UTC_MS - 30 * 86_400_000 || real > OPENER_UTC_MS + 60 * 86_400_000) return anchor;
    return real;
  }, []);

  const tzInfo = useMemo(() => TIMEZONES.find((z) => z.key === tz) ?? TIMEZONES[8]!, [tz]);

  const fmtTime = (utc: number) => {
    const d = new Date(utc);
    const iana = tz === 'userLocal' ? Intl.DateTimeFormat().resolvedOptions().timeZone : tzInfo.iana;
    try {
      return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : locale === 'ar' ? 'ar-SA' : locale, {
        timeZone: iana, month: 'short', day: '2-digit', weekday: 'short',
        hour: '2-digit', minute: '2-digit', hour12: false,
      }).format(d);
    } catch {
      return d.toISOString().slice(0, 16).replace('T', ' ');
    }
  };

  const sameDay = (aUTC: number, bUTC: number) => {
    const iana = tz === 'userLocal' ? Intl.DateTimeFormat().resolvedOptions().timeZone : tzInfo.iana;
    try {
      const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: iana, year: 'numeric', month: '2-digit', day: '2-digit' });
      return fmt.format(new Date(aUTC)) === fmt.format(new Date(bUTC));
    } catch {
      return Math.abs(aUTC - bUTC) < 86_400_000;
    }
  };

  const filtered = useMemo(() => {
    let list = FIXTURES.slice();
    if (filter === 'group') list = list.filter((m) => m.stage === 'group');
    else if (filter === 'knockout') list = list.filter((m) => m.stage !== 'group');
    else if (filter === 'r32') list = list.filter((m) => m.stage === 'r32');
    else if (filter === 'r16') list = list.filter((m) => m.stage === 'r16');
    else if (filter === 'qf') list = list.filter((m) => m.stage === 'qf');
    else if (filter === 'sf') list = list.filter((m) => m.stage === 'sf');
    else if (filter === 'final') list = list.filter((m) => m.stage === 'final' || m.stage === 'tp');
    else if (filter === 'today') list = list.filter((m) => sameDay(m.kickoffUTC, demoNow));
    else if (filter === 'tomorrow') list = list.filter((m) => sameDay(m.kickoffUTC, demoNow + 86_400_000));
    if (group) list = list.filter((m) => m.group === group);
    if (teamKey) list = list.filter((m) => m.homeKey === teamKey || m.awayKey === teamKey);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((m) => {
        const h = TEAM_BY_KEY[m.homeKey], a = TEAM_BY_KEY[m.awayKey];
        return (
          (h?.en.toLowerCase().includes(q) || h?.label.toLowerCase().includes(q) || m.homeKey.toLowerCase() === q) ||
          (a?.en.toLowerCase().includes(q) || a?.label.toLowerCase().includes(q) || m.awayKey.toLowerCase() === q) ||
          m.city.toLowerCase().includes(q) ||
          m.venue.toLowerCase().includes(q)
        );
      });
    }
    if (favOnly && favs.length > 0) {
      list = list.filter((m) => favs.includes(m.homeKey) || favs.includes(m.awayKey));
    }
    list.sort((x, y) => x.kickoffUTC - y.kickoffUTC);
    return list;
  }, [filter, group, teamKey, search, favOnly, favs, demoNow, tz]);

  const detail = useMemo(() => detailId ? FIXTURES.find((m) => m.id === detailId) ?? null : null, [detailId]);

  const teamLabelOf = (k: string) => {
    const tm = TEAM_BY_KEY[k];
    if (!tm) return k;
    if (locale === 'zh') return tm.label;
    return tm.en;
  };

  const teamBadge = (k: string, size = 28) => {
    const tm = TEAM_BY_KEY[k];
    if (!tm) return null;
    const [c1, c2] = tm.colors;
    return (
      <span
        className="inline-flex items-center justify-center rounded-full shrink-0 font-black text-white shadow-inner border"
        style={{
          width: size, height: size, fontSize: Math.max(9, Math.round(size * 0.38)),
          background: `linear-gradient(135deg, ${c1} 0%, ${c2 ?? c1} 100%)`,
          borderColor: tm.accent,
          textShadow: '0 1px 2px rgba(0,0,0,0.5)',
        }}
      >
        {k}
      </span>
    );
  };

  const mainTabs: FilterTab[] = ['all', 'today', 'tomorrow', 'group', 'knockout'];
  const koSubTabs: FilterTab[] = ['r32', 'r16', 'qf', 'sf', 'final'];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="card-base p-5 sm:p-6 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <CalendarDays className="w-5 h-5 text-[color:var(--color-primary)]" />
          <h1 className="text-[18px] font-bold">{locale === 'zh' ? '2026 世界杯赛程查询器' : 'World Cup 2026 Schedule'}</h1>
        </div>
        <p className="text-[13px] text-[color:var(--color-text-secondary)] mb-3">{t.subtitle}</p>
        <div className="text-[12px] inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 mb-4">
          {t.offline}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium mb-2 inline-flex items-center gap-1">
              <Globe className="w-4 h-4" />{t.timezoneLabel}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-1.5">
              {TIMEZONES.map((z) => (
                <button
                  key={z.key}
                  type="button"
                  onClick={() => setTz(z.key)}
                  className={`!h-10 text-[11px] sm:text-[12px] rounded-[var(--radius-md)] border touch-manipulation whitespace-nowrap ${tz === z.key ? 'bg-[color:var(--color-primary)] text-white border-[color:var(--color-primary)]' : 'bg-[color:var(--color-bg-secondary)] border-[color:var(--color-border)]'}`}
                  style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', minHeight: 44 }}
                >
                  {t[z.key]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium mb-2">
              {t.filterLabel}
              <span className="text-[12px] font-normal text-[color:var(--color-text-secondary)] ml-2">
                · {t.matchesFound} <span className="font-semibold text-[color:var(--color-primary)]">{filtered.length}</span> / {FIXTURES.length}
              </span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 mb-2">
              {mainTabs.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setFilter(k)}
                  className={`!h-10 text-[12px] sm:text-[13px] rounded-[var(--radius-md)] border touch-manipulation ${filter === k ? 'bg-[color:var(--color-primary)] text-white border-[color:var(--color-primary)]' : 'bg-[color:var(--color-bg-secondary)] border-[color:var(--color-border)]'}`}
                  style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', minHeight: 44 }}
                >
                  {t[k]}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {koSubTabs.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setFilter(filter === k ? 'knockout' : k)}
                  className={`!h-9 text-[11px] sm:text-[12px] rounded-[var(--radius-md)] border touch-manipulation ${filter === k ? 'bg-[color:var(--color-primary)] text-white border-[color:var(--color-primary)]' : 'bg-[color:var(--color-bg-tertiary)] border-[color:var(--color-border)]'}`}
                  style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', minHeight: 36 }}
                >
                  {t[k]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
            <div className="lg:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-text-secondary)]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="input-base w-full !h-11 pl-9 pr-9 text-[14px]"
                style={{ touchAction: 'manipulation', minHeight: 44 }}
              />
              {search && (
                <button type="button" onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 inline-flex items-center justify-center rounded-full text-[color:var(--color-text-secondary)]" style={{ minHeight: 32 }}>
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="lg:col-span-4 relative">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-text-secondary)] pointer-events-none" />
              <button
                type="button"
                onClick={() => setTeamOpen((v) => !v)}
                className="input-base w-full !h-11 pl-9 pr-9 text-[14px] text-left flex items-center justify-between"
                style={{ touchAction: 'manipulation', minHeight: 44 }}
              >
                <span className={teamKey ? 'text-[color:var(--color-text-primary)]' : 'text-[color:var(--color-text-secondary)]'}>
                  {teamKey ? (
                    <span className="inline-flex items-center gap-2">
                      {teamBadge(teamKey, 22)}
                      <span className="font-medium">{teamLabelOf(teamKey)}</span>
                    </span>
                  ) : t.selectTeam}
                </span>
                <ChevronDown className={`w-4 h-4 text-[color:var(--color-text-secondary)] transition-transform ${teamOpen ? 'rotate-180' : ''}`} />
              </button>
              {teamKey && (
                <button type="button" onClick={() => setTeamKey('')} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 inline-flex items-center justify-center rounded-full text-[color:var(--color-text-secondary)] z-10" style={{ minHeight: 32 }}>
                  <X className="w-4 h-4" />
                </button>
              )}
              {teamOpen && (
                <div className="absolute left-0 right-0 mt-1 max-h-72 overflow-y-auto z-20 card-base !p-2 shadow-xl">
                  {ALL_TEAMS.map((tm) => (
                    <button
                      key={tm.key}
                      type="button"
                      onClick={() => { setTeamKey(tm.key); setTeamOpen(false); }}
                      className={`w-full !h-11 px-2 text-[13px] rounded-[var(--radius-md)] text-left inline-flex items-center gap-2 touch-manipulation ${teamKey === tm.key ? 'bg-[color:var(--color-bg-tertiary)]' : 'hover:bg-[color:var(--color-bg-secondary)]'}`}
                      style={{ minHeight: 44 }}
                    >
                      {teamBadge(tm.key, 24)}
                      <span className="font-medium">{tm.en}</span>
                      <span className="text-[color:var(--color-text-secondary)]">{locale === 'zh' ? tm.label : ''}</span>
                      {favs.includes(tm.key) && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 ml-auto" />}
                      {tm.isHypothetical && <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 ml-auto">H</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-3 flex items-center gap-2 flex-wrap">
              <label className="inline-flex items-center gap-2 text-[13px] cursor-pointer select-none touch-manipulation" style={{ minHeight: 44 }}>
                <input
                  type="checkbox"
                  checked={favOnly}
                  onChange={(e) => setFavOnly(e.target.checked)}
                  className="w-4 h-4 rounded"
                />
                <Users className="w-4 h-4" />
                <span>{t.favOnly}</span>
                <span className="text-[color:var(--color-primary)] font-semibold">({favs.length})</span>
              </label>
              {favs.length > 0 && (
                <button
                  type="button"
                  onClick={() => setFavs([])}
                  className="text-[12px] px-2.5 h-9 rounded-full border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] hover:text-red-600 hover:border-red-300 touch-manipulation"
                  style={{ minHeight: 36 }}
                >
                  {t.clearFav}
                </button>
              )}
              {favs.slice(0, 5).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => toggleFav(k)}
                  className="inline-flex items-center gap-1 touch-manipulation"
                  title={`${teamLabelOf(k)}`}
                  style={{ minHeight: 36 }}
                >
                  {teamBadge(k, 26)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium mb-2 inline-flex items-center gap-1">
              <Trophy className="w-4 h-4" />{t.groupLabel}
            </label>
            <div className="grid grid-cols-7 sm:grid-cols-13 gap-1.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(44px, 1fr))' }}>
              <button
                type="button"
                onClick={() => setGroup('')}
                className={`!h-10 text-[11px] sm:text-[12px] rounded-[var(--radius-md)] border touch-manipulation ${!group ? 'bg-[color:var(--color-primary)] text-white border-[color:var(--color-primary)]' : 'bg-[color:var(--color-bg-secondary)] border-[color:var(--color-border)]'}`}
                style={{ minHeight: 40 }}
              >
                {t.all}
              </button>
              {GROUPS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGroup(group === g ? '' : g)}
                  className={`!h-10 text-[12px] font-bold rounded-[var(--radius-md)] border touch-manipulation ${group === g ? 'bg-[color:var(--color-primary)] text-white border-[color:var(--color-primary)]' : 'bg-[color:var(--color-bg-secondary)] border-[color:var(--color-border)]'}`}
                  style={{ minHeight: 40 }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card-base p-10 text-center text-[color:var(--color-text-secondary)]">
          <Clock className="w-8 h-8 mx-auto mb-3 opacity-50" />
          {locale === 'zh' ? '暂无符合筛选条件的比赛，试试调整筛选条件。' : 'No matches found. Try adjusting filters.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {filtered.map((m) => {
            const isOpen = detailId === m.id;
            return (
              <div key={m.id} className="card-base overflow-hidden flex flex-col">
                <button
                  type="button"
                  onClick={() => setDetailId(isOpen ? null : m.id)}
                  className="w-full text-left px-4 py-3.5 inline-flex items-center gap-3 touch-manipulation hover:bg-[color:var(--color-bg-secondary)] flex-1"
                  style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', minHeight: 72 }}
                >
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-[color:var(--color-bg-tertiary)] text-[color:var(--color-text-secondary)] font-medium whitespace-nowrap">
                        {STAGE_LABEL[m.stage]}{m.group ? ` · ${m.group}` : ''}
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-[color:var(--color-text-secondary)] inline-flex items-center gap-1 shrink-0">
                        <MapPin className="w-3 h-3" />{m.city}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 justify-between">
                      <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                        <div className={`text-[13px] sm:text-[14px] font-bold line-clamp-1 text-right ${favs.includes(m.homeKey) ? 'ring-1 ring-amber-400 rounded px-1.5 py-0.5' : ''}`}>
                          {locale === 'zh' ? teamLabelOf(m.homeKey) : TEAM_BY_KEY[m.homeKey]?.en ?? m.homeKey}
                        </div>
                        {teamBadge(m.homeKey, 28)}
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-[color:var(--color-primary)] text-white font-black text-[15px] sm:text-[17px] tabular-nums shrink-0">
                        {m.scoreH ?? '-'}<span className="mx-0.5 opacity-50">:</span>{m.scoreA ?? '-'}
                      </span>
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {teamBadge(m.awayKey, 28)}
                        <div className={`text-[13px] sm:text-[14px] font-bold line-clamp-1 ${favs.includes(m.awayKey) ? 'ring-1 ring-amber-400 rounded px-1.5 py-0.5' : ''}`}>
                          {locale === 'zh' ? teamLabelOf(m.awayKey) : TEAM_BY_KEY[m.awayKey]?.en ?? m.awayKey}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-[11px] text-[color:var(--color-text-secondary)]">
                      <span className="inline-flex items-center gap-1 min-w-0 truncate">
                        <Clock className="w-3 h-3 shrink-0" />
                        <span className="truncate">{fmtTime(m.kickoffUTC)}</span>
                      </span>
                      <span className="min-w-0 truncate">{m.venue}</span>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-[color:var(--color-text-secondary)] transition-transform shrink-0 ${isOpen ? 'rotate-90' : ''}`} />
                </button>

                <div className="px-3 pb-3 flex items-center gap-1.5 border-t border-[color:var(--color-border)] pt-2">
                  <button
                    type="button"
                    onClick={() => toggleFav(m.homeKey)}
                    className={`flex-1 !h-9 text-[11px] rounded-[var(--radius-md)] border inline-flex items-center justify-center gap-1 touch-manipulation ${favs.includes(m.homeKey) ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-[color:var(--color-bg-secondary)] border-[color:var(--color-border)]'}`}
                    style={{ minHeight: 36 }}
                  >
                    {favs.includes(m.homeKey) ? <Star className="w-3.5 h-3.5 fill-amber-500" /> : <StarOff className="w-3.5 h-3.5" />}
                    {m.homeKey}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleFav(m.awayKey)}
                    className={`flex-1 !h-9 text-[11px] rounded-[var(--radius-md)] border inline-flex items-center justify-center gap-1 touch-manipulation ${favs.includes(m.awayKey) ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-[color:var(--color-bg-secondary)] border-[color:var(--color-border)]'}`}
                    style={{ minHeight: 36 }}
                  >
                    {favs.includes(m.awayKey) ? <Star className="w-3.5 h-3.5 fill-amber-500" /> : <StarOff className="w-3.5 h-3.5" />}
                    {m.awayKey}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {detail && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setDetailId(null)}>
          <div
            className="w-full sm:max-w-lg bg-[color:var(--color-bg-primary)] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-[color:var(--color-border)] flex items-center justify-between bg-[color:var(--color-bg-secondary)]">
              <h3 className="text-[15px] font-bold inline-flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[color:var(--color-primary)]" />
                {t.matchDetail}
              </h3>
              <button
                type="button"
                onClick={() => setDetailId(null)}
                className="w-9 h-9 rounded-full inline-flex items-center justify-center hover:bg-[color:var(--color-bg-tertiary)] touch-manipulation"
                style={{ minHeight: 36 }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto space-y-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 justify-end min-w-0">
                  <div className="text-right min-w-0">
                    <div className="text-[15px] font-bold truncate">{locale === 'zh' ? teamLabelOf(detail.homeKey) : TEAM_BY_KEY[detail.homeKey]?.en ?? detail.homeKey}</div>
                    <div className="text-[11px] text-[color:var(--color-text-secondary)]">{detail.homeKey}</div>
                  </div>
                  {teamBadge(detail.homeKey, 44)}
                </div>
                <div className="px-4 py-2 rounded-lg bg-[color:var(--color-primary)] text-white font-black text-[22px] sm:text-[26px] tabular-nums shrink-0">
                  {detail.scoreH ?? '-'}<span className="mx-1 opacity-50">:</span>{detail.scoreA ?? '-'}
                </div>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {teamBadge(detail.awayKey, 44)}
                  <div className="text-left min-w-0">
                    <div className="text-[15px] font-bold truncate">{locale === 'zh' ? teamLabelOf(detail.awayKey) : TEAM_BY_KEY[detail.awayKey]?.en ?? detail.awayKey}</div>
                    <div className="text-[11px] text-[color:var(--color-text-secondary)]">{detail.awayKey}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] overflow-hidden">
                <div className="grid grid-cols-[100px_1fr] text-[13px] divide-y divide-[color:var(--color-border)]">
                  <div className="px-3 py-2.5 text-[color:var(--color-text-secondary)] font-medium">{t.stage}</div>
                  <div className="px-3 py-2.5 font-semibold">{STAGE_LABEL[detail.stage]}{detail.group ? ` · ${t.groupLabel} ${detail.group}` : ''}</div>
                  <div className="px-3 py-2.5 text-[color:var(--color-text-secondary)] font-medium inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />{t.kickoff}
                  </div>
                  <div className="px-3 py-2.5 font-semibold">{fmtTime(detail.kickoffUTC)}</div>
                  <div className="px-3 py-2.5 text-[color:var(--color-text-secondary)] font-medium inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />{t.venue}
                  </div>
                  <div className="px-3 py-2.5 font-semibold">
                    {detail.venue}
                    <span className="ml-2 text-[12px] text-[color:var(--color-text-secondary)] font-normal">
                      {t.city}: {detail.city} · {t.capacity} {detail.cap}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[14px] font-semibold mb-2 inline-flex items-center gap-1">
                  <Swords className="w-4 h-4" /> {t.h2h}
                </h4>
                <div className="rounded-[var(--radius-lg)] border border-[color:var(--color-border)] bg-[color:var(--color-bg-secondary)] p-4">
                  {(() => {
                    const h = getH2H(detail.homeKey, detail.awayKey);
                    if (h) {
                      return (
                        <div className="space-y-2 text-[13px]">
                          <div className="flex items-center justify-between">
                            <span className="text-[color:var(--color-text-secondary)]">总场次 / Played</span>
                            <span className="font-semibold">{h.played}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[color:var(--color-text-secondary)]">战绩 / W-D-L</span>
                            <span className="font-semibold">{h.wdl}</span>
                          </div>
                          <div className="pt-2 mt-2 border-t border-[color:var(--color-border)] text-[12px] text-[color:var(--color-text-secondary)]">
                            {locale === 'zh' ? '最近一次' : 'Last meeting'}：{h.last}
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div className="space-y-2 text-[13px]">
                        <div className="flex items-center justify-between">
                          <span className="text-[color:var(--color-text-secondary)]">总场次</span>
                          <span className="font-semibold">— （首次相遇）</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[color:var(--color-text-secondary)]">战绩</span>
                          <span className="font-semibold">—</span>
                        </div>
                        <div className="pt-2 mt-2 border-t border-[color:var(--color-border)] text-[12px] text-[color:var(--color-text-secondary)]">
                          {locale === 'zh'
                            ? `两队首次在世界杯正赛相遇，本场将在 ${detail.city} 的 ${detail.venue} 举行，预计 ${detail.cap} 名观众见证历史。`
                            : `First ever World Cup finals meeting between ${TEAM_BY_KEY[detail.homeKey]?.en ?? detail.homeKey} and ${TEAM_BY_KEY[detail.awayKey]?.en ?? detail.awayKey}, at ${detail.venue}, ${detail.city}.`}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => toggleFav(detail.homeKey)}
                  className={`!h-11 rounded-[var(--radius-md)] border inline-flex items-center justify-center gap-2 text-[13px] touch-manipulation ${favs.includes(detail.homeKey) ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-[color:var(--color-bg-primary)] border-[color:var(--color-border)]'}`}
                  style={{ minHeight: 44 }}
                >
                  {favs.includes(detail.homeKey) ? <Star className="w-4 h-4 fill-amber-500" /> : <StarOff className="w-4 h-4" />}
                  {teamLabelOf(detail.homeKey)} · {favs.includes(detail.homeKey) ? t.rmFav : t.addFav}
                </button>
                <button
                  type="button"
                  onClick={() => toggleFav(detail.awayKey)}
                  className={`!h-11 rounded-[var(--radius-md)] border inline-flex items-center justify-center gap-2 text-[13px] touch-manipulation ${favs.includes(detail.awayKey) ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-[color:var(--color-bg-primary)] border-[color:var(--color-border)]'}`}
                  style={{ minHeight: 44 }}
                >
                  {favs.includes(detail.awayKey) ? <Star className="w-4 h-4 fill-amber-500" /> : <StarOff className="w-4 h-4" />}
                  {teamLabelOf(detail.awayKey)} · {favs.includes(detail.awayKey) ? t.rmFav : t.addFav}
                </button>
              </div>
            </div>
            <div className="px-5 py-4 border-t border-[color:var(--color-border)]">
              <button
                type="button"
                onClick={() => setDetailId(null)}
                className="btn-primary w-full !h-11 text-[14px] touch-manipulation"
                style={{ minHeight: 44 }}
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wc2026Schedule;
