// src/components/TypingIndicator.jsx
import React from 'react';
import { useTheme } from '../hooks/useTheme';

export default function TypingIndicator({ user }) {
  const { theme } = useTheme();

  const s = {
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '6px 20px 10px',
      minHeight: '32px',
    },
    avatar: {
      width: '20px',
      height: '20px',
      borderRadius: '6px',
      background: user?.avatarColor || theme.accent,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '9px',
      fontWeight: '700',
      color: '#fff',
      flexShrink: 0,
    },
    text: {
      fontSize: '12px',
      color: theme.textMuted,
    },
    name: {
      color: theme.textSecondary,
      fontWeight: '600',
    },
    dots: {
      display: 'flex',
      gap: '3px',
      alignItems: 'center',
      marginLeft: '2px',
    },
  };

  if (!user) return <div style={s.wrapper} />;

  return (
    <div style={s.wrapper} className="anim-fade-in">
      <div style={s.avatar}>{user.avatar}</div>
      <span style={s.text}>
        <span style={s.name}>{user.name}</span> is typing
      </span>
      <div style={s.dots}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: theme.typingDot,
              display: 'block',
              animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
