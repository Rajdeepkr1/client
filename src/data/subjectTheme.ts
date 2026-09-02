export interface SubjectTheme {
  icon: string;
  gradient: string;
  glow: string;
}

// One distinct gradient + icon per subject, used everywhere the subject appears
// (home cards, sidebar, topic header) so each subject has a consistent visual identity.
const THEMES: Record<string, SubjectTheme> = {
  angular: { icon: '🅰️', gradient: 'linear-gradient(135deg, #dd0031, #c3002f)', glow: '#ff4d67' },
  react: { icon: '⚛️', gradient: 'linear-gradient(135deg, #61dafb, #21a1c4)', glow: '#61dafb' },
  node: { icon: '🟢', gradient: 'linear-gradient(135deg, #3c873a, #83cd29)', glow: '#83cd29' },
  database: { icon: '🍃', gradient: 'linear-gradient(135deg, #13aa52, #0e7c3f)', glow: '#13aa52' },
  aws: { icon: '☁️', gradient: 'linear-gradient(135deg, #ff9900, #e07000)', glow: '#ff9900' },
  'docker-kubernetes': {
    icon: '🐳',
    gradient: 'linear-gradient(135deg, #2496ed, #326ce5)',
    glow: '#2496ed',
  },
  sql: { icon: '🗄️', gradient: 'linear-gradient(135deg, #4479a1, #2c5d7c)', glow: '#4479a1' },
  'system-design': {
    icon: '🏗️',
    gradient: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
    glow: '#a78bfa',
  },
  dsa: { icon: '🧮', gradient: 'linear-gradient(135deg, #f59e0b, #b45309)', glow: '#f59e0b' },
  'js-ts': { icon: '📜', gradient: 'linear-gradient(135deg, #f7df1e, #3178c6)', glow: '#f7df1e' },
  'html-css': {
    icon: '🎨',
    gradient: 'linear-gradient(135deg, #e34c26, #264de4)',
    glow: '#e34c26',
  },
  'java-backend': {
    icon: '☕',
    gradient: 'linear-gradient(135deg, #f89820, #5382a1)',
    glow: '#f89820',
  },
  'python-backend': {
    icon: '🐍',
    gradient: 'linear-gradient(135deg, #3776ab, #ffd43b)',
    glow: '#3776ab',
  },
  'agentic-ai': {
    icon: '🧠',
    gradient: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
    glow: '#8b5cf6',
  },
  android: {
    icon: '🤖',
    gradient: 'linear-gradient(135deg, #3ddc84, #0a7e4d)',
    glow: '#3ddc84',
  },
  automation: {
    icon: '🧪',
    gradient: 'linear-gradient(135deg, #43b02a, #2d7a1c)',
    glow: '#43b02a',
  },
  cli: {
    icon: '⌨️',
    gradient: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    glow: '#00ff9d',
  },
  communication: {
    icon: '📡',
    gradient: 'linear-gradient(135deg, #0ea5e9, #0369a1)',
    glow: '#38bdf8',
  },
  cpp: {
    icon: '🔷',
    gradient: 'linear-gradient(135deg, #00599c, #004482)',
    glow: '#00599c',
  },
  deployment: {
    icon: '🚀',
    gradient: 'linear-gradient(135deg, #f97316, #c2410c)',
    glow: '#fb923c',
  },
  'design-patterns': {
    icon: '🧩',
    gradient: 'linear-gradient(135deg, #6366f1, #3730a3)',
    glow: '#818cf8',
  },
  'ethical-hacking': {
    icon: '🛡️',
    gradient: 'linear-gradient(135deg, #0f172a, #16a34a)',
    glow: '#22c55e',
  },
  fde: {
    icon: '🛠️',
    gradient: 'linear-gradient(135deg, #92400e, #451a03)',
    glow: '#d97706',
  },
  'game-development': {
    icon: '🎮',
    gradient: 'linear-gradient(135deg, #ec4899, #7c3aed)',
    glow: '#f472b6',
  },
  'interview-communication': {
    icon: '🗣️',
    gradient: 'linear-gradient(135deg, #14b8a6, #0f766e)',
    glow: '#2dd4bf',
  },
  java: {
    icon: '♨️',
    gradient: 'linear-gradient(135deg, #ed8b00, #b23c00)',
    glow: '#f59e0b',
  },
  llm: {
    icon: '🔮',
    gradient: 'linear-gradient(135deg, #a855f7, #6b21a8)',
    glow: '#c084fc',
  },
  nestjs: {
    icon: '🐱',
    gradient: 'linear-gradient(135deg, #e0234e, #a3123a)',
    glow: '#e0234e',
  },
  nextjs: {
    icon: '▲',
    gradient: 'linear-gradient(135deg, #000000, #333333)',
    glow: '#a3a3a3',
  },
  ollama: {
    icon: '🦙',
    gradient: 'linear-gradient(135deg, #78716c, #44403c)',
    glow: '#a8a29e',
  },
  'operating-systems': {
    icon: '🖥️',
    gradient: 'linear-gradient(135deg, #475569, #1e293b)',
    glow: '#64748b',
  },
  'prompt-engineering': {
    icon: '📝',
    gradient: 'linear-gradient(135deg, #eab308, #a16207)',
    glow: '#facc15',
  },
  python: {
    icon: '🐍',
    gradient: 'linear-gradient(135deg, #3776ab, #ffd43b)',
    glow: '#ffd43b',
  },
  'react-native': {
    icon: '📱',
    gradient: 'linear-gradient(135deg, #61dafb, #1e3a5f)',
    glow: '#61dafb',
  },
  readme: {
    icon: '📄',
    gradient: 'linear-gradient(135deg, #3b82f6, #1e40af)',
    glow: '#60a5fa',
  },
};

const FALLBACK: SubjectTheme = {
  icon: '📘',
  gradient: 'linear-gradient(135deg, #6366f1, #4338ca)',
  glow: '#6366f1',
};

export function getSubjectTheme(slug: string): SubjectTheme {
  return THEMES[slug] ?? FALLBACK;
}
