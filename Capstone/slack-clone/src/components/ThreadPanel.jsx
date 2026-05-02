// src/components/ThreadPanel.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useChat } from '../hooks/useChat';

function Avatar({ user, size = 32 }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: size <= 24 ? '50%' : '8px',
      background: user?.avatarColor || '#888',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.35, fontWeight: '700', color: '#fff', flexShrink: 0,
    }}>
      {user?.avatar || '?'}
    </div>
  );
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ThreadPanel() {
  const { theme } = useTheme();
  const { activeThread, closeThread, addThreadReply, users } = useChat();
  const [replyText, setReplyText] = useState('');
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (activeThread) inputRef.current?.focus();
  }, [activeThread]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.thread?.length]);

  if (!activeThread) return null;

  const handleSend = () => {
    if (!replyText.trim()) return;
    addThreadReply(activeThread.id, replyText);
    setReplyText('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const originalAuthor = users[activeThread.userId];
  const allReplies = activeThread.thread || [];

  const s = {
    panel: {
      width: '360px',
      flexShrink: 0,
      background: theme.bgThread,
      borderLeft: `1px solid ${theme.border}`,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      animation: 'slideInRight 0.25s ease',
    },
    header: {
      padding: '16px',
      borderBottom: `1px solid ${theme.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: '15px',
      fontWeight: '700',
      color: theme.textPrimary,
    },
    closeBtn: {
      width: '28px', height: '28px',
      borderRadius: '6px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '16px',
      color: theme.textMuted,
      transition: 'background 0.15s, color 0.15s',
    },
    body: {
      flex: 1,
      overflowY: 'auto',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '0',
    },
    originalMsg: {
      padding: '12px',
      borderRadius: '10px',
      background: theme.bgCard,
      border: `1px solid ${theme.border}`,
      marginBottom: '16px',
    },
    originalHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '6px',
    },
    originalAuthorName: {
      fontSize: '13px',
      fontWeight: '700',
      color: theme.textPrimary,
    },
    originalTime: {
      fontSize: '11px',
      color: theme.textMuted,
      fontFamily: 'JetBrains Mono, monospace',
    },
    originalText: {
      fontSize: '13px',
      color: theme.textSecondary,
      lineHeight: '1.6',
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '16px',
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      background: theme.divider,
    },
    dividerText: {
      fontSize: '11px',
      color: theme.textMuted,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      whiteSpace: 'nowrap',
    },
    reply: {
      display: 'flex',
      gap: '8px',
      marginBottom: '14px',
    },
    replyContent: { flex: 1 },
    replyHeader: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '6px',
      marginBottom: '2px',
    },
    replyAuthor: {
      fontSize: '13px',
      fontWeight: '700',
      color: theme.textPrimary,
    },
    replyTime: {
      fontSize: '11px',
      color: theme.textMuted,
      fontFamily: 'JetBrains Mono, monospace',
    },
    replyText: {
      fontSize: '13px',
      color: theme.textSecondary,
      lineHeight: '1.6',
    },
    inputArea: {
      padding: '12px 16px',
      borderTop: `1px solid ${theme.border}`,
      flexShrink: 0,
    },
    inputWrapper: {
      border: `1px solid ${theme.borderStrong}`,
      borderRadius: '10px',
      background: theme.bgInput,
      overflow: 'hidden',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    textarea: {
      width: '100%',
      padding: '10px 12px',
      background: 'transparent',
      color: theme.textPrimary,
      fontSize: '13px',
      resize: 'none',
      minHeight: '60px',
      maxHeight: '100px',
      lineHeight: '1.5',
    },
    inputFooter: {
      display: 'flex',
      justifyContent: 'flex-end',
      padding: '6px 10px',
      borderTop: `1px solid ${theme.border}`,
    },
    sendBtn: {
      width: '30px', height: '30px',
      borderRadius: '8px',
      background: replyText.trim() ? `linear-gradient(135deg, ${theme.accent}, ${theme.accentPurple})` : theme.bgBadge,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: replyText.trim() ? 'pointer' : 'default',
      fontSize: '14px',
      transition: 'all 0.2s',
    },
    noReplies: {
      textAlign: 'center',
      padding: '24px',
      color: theme.textMuted,
      fontSize: '13px',
    },
  };

  return (
    <div style={s.panel}>
      {/* Header */}
      <div style={s.header}>
        <span style={s.title}>🧵 Thread</span>
        <button
          style={s.closeBtn}
          onClick={closeThread}
          onMouseEnter={(e) => { e.currentTarget.style.background = theme.bgSidebarHover; e.currentTarget.style.color = theme.textPrimary; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = theme.textMuted; }}
        >
          ✕
        </button>
      </div>

      {/* Scrollable body */}
      <div style={s.body}>
        {/* Original message */}
        <div style={s.originalMsg}>
          <div style={s.originalHeader}>
            <Avatar user={originalAuthor} size={24} />
            <span style={s.originalAuthorName}>{originalAuthor?.name}</span>
            <span style={s.originalTime}>{formatTime(activeThread.timestamp)}</span>
          </div>
          <div style={s.originalText}>{activeThread.text}</div>
        </div>

        {/* Divider */}
        <div style={s.divider}>
          <div style={s.dividerLine} />
          <span style={s.dividerText}>{allReplies.length} {allReplies.length === 1 ? 'reply' : 'replies'}</span>
          <div style={s.dividerLine} />
        </div>

        {allReplies.length === 0 && (
          <div style={s.noReplies}>No replies yet — be the first! 👇</div>
        )}

        {allReplies.map((reply) => {
          const replyAuthor = users[reply.userId];
          return (
            <div key={reply.id} style={s.reply} className="anim-fade-slide-up">
              <Avatar user={replyAuthor} size={28} />
              <div style={s.replyContent}>
                <div style={s.replyHeader}>
                  <span style={s.replyAuthor}>{replyAuthor?.name || 'Unknown'}</span>
                  <span style={s.replyTime}>{formatTime(reply.timestamp)}</span>
                </div>
                <div style={s.replyText}>{reply.text}</div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Reply input */}
      <div style={s.inputArea}>
        <div
          style={s.inputWrapper}
          onFocus={(e) => { e.currentTarget.style.borderColor = theme.accent; e.currentTarget.style.boxShadow = theme.shadowInput; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = theme.borderStrong; e.currentTarget.style.boxShadow = 'none'; }}
        >
          <textarea
            ref={inputRef}
            style={s.textarea}
            placeholder="Reply in thread..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={handleKey}
          />
          <div style={s.inputFooter}>
            <button
              style={s.sendBtn}
              onClick={handleSend}
              onMouseEnter={(e) => { if (replyText.trim()) e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
