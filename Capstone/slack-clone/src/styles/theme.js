// src/styles/theme.js

export const darkTheme = {
  name: 'dark',

  // Core backgrounds
  bgApp: '#0C0C1A',
  bgSidebar: '#111124',
  bgSidebarHover: '#1A1A35',
  bgSidebarActive: '#22224A',
  bgMain: '#0A0A18',
  bgInput: '#181830',
  bgMessageHover: '#13132A',
  bgThread: '#141428',
  bgCard: '#1A1A35',
  bgBadge: '#2A2A50',

  // Text
  textPrimary: '#F0EEFF',
  textSecondary: '#A8A8CC',
  textMuted: '#5C5C8A',
  textInverse: '#0C0C1A',

  // Brand palette — teal/coral/lime
  accent: '#00D9C0',       // teal
  accentAlt: '#FF6B6B',    // coral
  accentThird: '#C6FF4D',  // lime
  accentPurple: '#9B72FF', // purple accent

  accentGlow: 'rgba(0,217,192,0.2)',
  accentHover: '#00F0D5',

  // Borders
  border: '#1E1E40',
  borderStrong: '#2E2E5A',
  borderAccent: '#00D9C080',

  // Status
  online: '#00D9C0',
  away: '#FFD93D',
  offline: '#5C5C8A',

  // Reactions
  reactionBg: '#1E1E40',
  reactionBgMine: 'rgba(0,217,192,0.15)',
  reactionBorderMine: '#00D9C0',

  // Shadows
  shadowCard: '0 4px 24px rgba(0,0,0,0.4)',
  shadowInput: '0 0 0 2px rgba(0,217,192,0.3)',
  shadowThread: '-2px 0 0 0 #00D9C0',

  // Misc
  scrollbarThumb: '#2E2E5A',
  typingDot: '#5C5C8A',
  divider: '#1E1E40',
  pinnedBg: 'rgba(0,217,192,0.08)',
  pinnedBorder: 'rgba(0,217,192,0.3)',
};

export const lightTheme = {
  name: 'light',

  bgApp: '#F4F2FF',
  bgSidebar: '#ECEAFF',
  bgSidebarHover: '#DDD9FF',
  bgSidebarActive: '#CCC7FF',
  bgMain: '#FAFAFA',
  bgInput: '#F0EEFF',
  bgMessageHover: '#F6F4FF',
  bgThread: '#F0EEFF',
  bgCard: '#FFFFFF',
  bgBadge: '#CCC7FF',

  textPrimary: '#1A1535',
  textSecondary: '#4A4680',
  textMuted: '#8884B0',
  textInverse: '#FAFAFA',

  accent: '#0099A8',
  accentAlt: '#E53E3E',
  accentThird: '#5B8A00',
  accentPurple: '#6B46C1',

  accentGlow: 'rgba(0,153,168,0.15)',
  accentHover: '#007A8A',

  border: '#DDD9FF',
  borderStrong: '#BEBAF0',
  borderAccent: '#0099A880',

  online: '#0099A8',
  away: '#D97706',
  offline: '#8884B0',

  reactionBg: '#E8E5FF',
  reactionBgMine: 'rgba(0,153,168,0.1)',
  reactionBorderMine: '#0099A8',

  shadowCard: '0 4px 24px rgba(0,0,0,0.08)',
  shadowInput: '0 0 0 2px rgba(0,153,168,0.25)',
  shadowThread: '-2px 0 0 0 #0099A8',

  scrollbarThumb: '#BEBAF0',
  typingDot: '#8884B0',
  divider: '#DDD9FF',
  pinnedBg: 'rgba(0,153,168,0.06)',
  pinnedBorder: 'rgba(0,153,168,0.2)',
};
