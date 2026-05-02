// src/components/Message.jsx
import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useChat } from '../hooks/useChat';

const QUICK_REACTIONS = ['👍', '❤️', '😂', '🔥', '🚀', '👀'];

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function Avatar({ user, size = 36 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size <= 24 ? '50%' : '10px',
        background: user?.avatarColor || '#888',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.35,
        fontWeight: '700',
        color: '#fff',
        flexShrink: 0,
      }}
    >
      {user?.avatar || '?'}
    </div>
  );
}

export default function Message({ message, isGrouped = false }) {
  const { theme } = useTheme();
  const { users, toggleReaction, openThread, activeChannelId } = useChat();
  const [hovered, setHovered] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const author = users[message.userId];
  const isMe = message.userId === 'me';

  const s = {
    wrapper: {
      display: 'flex',
      gap: '10px',
      padding: '4px 16px',
      borderRadius: '8px',
      background: hovered ? theme.bgMessageHover : 'transparent',
      position: 'relative',
      transition: 'background 0.15s ease',
      marginTop: isGrouped ? '0' : '12px',
    },
    avatarCol: {
      width: '36px',
      flexShrink: 0,
      paddingTop: '2px',
    },
    avatarPlaceholder: {
      width: '36px',
      height: '20px',
    },
    contentCol: {
      flex: 1,
      minWidth: 0,
    },
    header: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '8px',
      marginBottom: '2px',
    },
    authorName: {
      fontSize: '14px',
      fontWeight: '700',
      color: isMe ? theme.accent : theme.textPrimary,
    },
    timestamp: {
      fontSize: '11px',
      color: theme.textMuted,
      fontFamily: 'JetBrains Mono, monospace',
    },
    text: {
      fontSize: '14px',
      color: theme.textSecondary,
      lineHeight: '1.6',
      wordBreak: 'break-word',
    },
    code: {
      background: theme.bgInput,
      padding: '1px 5px',
      borderRadius: '4px',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '12px',
      color: theme.accent,
    },
    reactions: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '4px',
      marginTop: '6px',
    },
    reactionBtn: (isMine) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '2px 8px',
      borderRadius: '12px',
      border: `1px solid ${isMine ? theme.reactionBorderMine : theme.border}`,
      background: isMine ? theme.reactionBgMine : theme.reactionBg,
      cursor: 'pointer',
      fontSize: '13px',
      color: isMine ? theme.accent : theme.textSecondary,
      transition: 'all 0.15s ease',
      fontFamily: 'DM Sans, sans-serif',
    }),
    reactionCount: {
      fontSize: '11px',
      fontWeight: '600',
    },
    threadInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      marginTop: '6px',
      cursor: 'pointer',
      width: 'fit-content',
    },
    threadAvatars: {
      display: 'flex',
    },
    threadText: {
      fontSize: '12px',
      color: theme.accent,
      fontWeight: '600',
    },
    threadTextSub: {
      fontSize: '12px',
      color: theme.textMuted,
      marginLeft: '4px',
    },
    // Hover actions toolbar
    actions: {
      position: 'absolute',
      top: '-14px',
      right: '16px',
      display: hovered || showEmojiPicker ? 'flex' : 'none',
      gap: '2px',
      background: theme.bgCard,
      border: `1px solid ${theme.border}`,
      borderRadius: '8px',
      padding: '3px',
      boxShadow: theme.shadowCard,
      zIndex: 10,
    },
    actionBtn: {
      width: '28px',
      height: '28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      color: theme.textMuted,
      transition: 'background 0.15s, color 0.15s',
    },
    emojiPicker: {
      position: 'absolute',
      top: '16px',
      right: '16px',
      display: 'flex',
      gap: '4px',
      background: theme.bgCard,
      border: `1px solid ${theme.border}`,
      borderRadius: '10px',
      padding: '6px',
      boxShadow: theme.shadowCard,
      zIndex: 20,
    },
    emojiOption: {
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background 0.15s, transform 0.15s',
    },
  };

  // Render text with simple code formatting
  const renderText = (text) => {
    const parts = text.split(/(`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} style={s.code}>{part.slice(1, -1)}</code>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  const threadReplies = message.thread || [];
  const hasThread = threadReplies.length > 0;

  return (
    <div
      style={s.wrapper}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setShowEmojiPicker(false); }}
      className="anim-fade-slide-up"
    >
      {/* Avatar column */}
      <div style={s.avatarCol}>
        {isGrouped ? (
          hovered ? (
            <span style={{ fontSize: '10px', color: theme.textMuted, fontFamily: 'JetBrains Mono, monospace', display: 'block', textAlign: 'right', paddingTop: '3px' }}>
              {formatTime(message.timestamp)}
            </span>
          ) : (
            <div style={s.avatarPlaceholder} />
          )
        ) : (
          <Avatar user={author} size={36} />
        )}
      </div>

      {/* Content column */}
      <div style={s.contentCol}>
        {!isGrouped && (
          <div style={s.header}>
            <span style={s.authorName}>{author?.name || 'Unknown'}</span>
            <span style={s.timestamp}>{formatTime(message.timestamp)}</span>
          </div>
        )}

        <div style={s.text}>{renderText(message.text)}</div>

        {/* Reactions */}
        {message.reactions.length > 0 && (
          <div style={s.reactions}>
            {message.reactions.map((r) => {
              const isMine = r.users.includes('me');
              return (
                <button
                  key={r.emoji}
                  style={s.reactionBtn(isMine)}
                  onClick={() => toggleReaction(activeChannelId, message.id, r.emoji)}
                  title={r.users.map((u) => users[u]?.name || u).join(', ')}
                >
                  {r.emoji}
                  <span style={s.reactionCount}>{r.count}</span>
                </button>
              );
            })}
            <button
              style={s.reactionBtn(false)}
              onClick={() => setShowEmojiPicker((p) => !p)}
              title="Add reaction"
            >
              +
            </button>
          </div>
        )}

        {/* Thread replies */}
        {hasThread && (
          <div style={s.threadInfo} onClick={() => openThread(message)}>
            <div style={s.threadAvatars}>
              {[...new Set(threadReplies.map((r) => r.userId))].slice(0, 3).map((uid, i) => (
                <div key={uid} style={{ marginLeft: i > 0 ? '-6px' : 0 }}>
                  <Avatar user={users[uid]} size={18} />
                </div>
              ))}
            </div>
            <span style={s.threadText}>{threadReplies.length} {threadReplies.length === 1 ? 'reply' : 'replies'}</span>
            <span style={s.threadTextSub}>View thread →</span>
          </div>
        )}
      </div>

      {/* Hover Action Bar */}
      <div style={s.actions}>
        {[
          { icon: '😊', label: 'React', action: () => setShowEmojiPicker((p) => !p) },
          { icon: '💬', label: 'Reply in thread', action: () => openThread(message) },
          { icon: '🔖', label: 'Bookmark', action: () => {} },
          { icon: '↗️', label: 'Share', action: () => {} },
        ].map(({ icon, label, action }) => (
          <button
            key={label}
            style={s.actionBtn}
            title={label}
            onClick={action}
            onMouseEnter={(e) => { e.currentTarget.style.background = theme.bgSidebarHover; e.currentTarget.style.color = theme.textPrimary; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = theme.textMuted; }}
          >
            {icon}
          </button>
        ))}
      </div>

      {/* Quick Emoji Picker */}
      {showEmojiPicker && (
        <div style={s.emojiPicker} className="anim-scale-in">
          {QUICK_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              style={s.emojiOption}
              onClick={() => { toggleReaction(activeChannelId, message.id, emoji); setShowEmojiPicker(false); }}
              onMouseEnter={(e) => { e.currentTarget.style.background = theme.bgSidebarHover; e.currentTarget.style.transform = 'scale(1.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.transform = 'scale(1)'; }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
