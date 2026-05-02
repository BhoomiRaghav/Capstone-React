// src/components/ChatWindow.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useChat } from '../hooks/useChat';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

const TOOLBAR_ACTIONS = [
  { icon: 'B', label: 'Bold', style: { fontWeight: '800', fontStyle: 'normal' } },
  { icon: 'I', label: 'Italic', style: { fontStyle: 'italic', fontWeight: '400' } },
  { icon: '<>', label: 'Code', style: { fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' } },
  { icon: '🔗', label: 'Link', style: {} },
  { icon: '📎', label: 'Attach', style: {} },
  { icon: '😊', label: 'Emoji', style: {} },
];

function formatDateLabel(date) {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
}

function groupMessagesByDate(messages) {
  const groups = [];
  let currentDate = null;
  let currentGroup = [];

  messages.forEach((msg, i) => {
    const dateLabel = formatDateLabel(msg.timestamp);
    if (dateLabel !== currentDate) {
      if (currentGroup.length) groups.push({ date: currentDate, messages: currentGroup });
      currentDate = dateLabel;
      currentGroup = [msg];
    } else {
      currentGroup.push(msg);
    }
  });
  if (currentGroup.length) groups.push({ date: currentDate, messages: currentGroup });
  return groups;
}

// Check if a message is "grouped" with the previous (same author, close in time)
function shouldGroup(messages, index) {
  if (index === 0) return false;
  const prev = messages[index - 1];
  const curr = messages[index];
  if (prev.userId !== curr.userId) return false;
  const timeDiff = new Date(curr.timestamp) - new Date(prev.timestamp);
  return timeDiff < 5 * 60 * 1000; // 5 minutes
}

export default function ChatWindow() {
  const { theme } = useTheme();
  const {
    activeChannel,
    activeMessages,
    sendMessage,
    isTyping,
    typingUser,
    channels,
    users,
    activeChannelId,
  } = useChat();

  const [inputText, setInputText] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length, isTyping]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
    inputRef.current?.focus();
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Derive channel meta
  const isDm = activeChannelId?.startsWith('dm-');
  const channelData = channels.find((c) => c.id === activeChannelId);
  const dmUserId = isDm ? activeChannelId?.replace('dm-', '') : null;
  const dmUser = dmUserId ? users[dmUserId] : null;
  const headerName = isDm ? dmUser?.name : `#${channelData?.name || activeChannelId}`;
  const headerDesc = isDm ? dmUser?.role : channelData?.description;
  const headerEmoji = isDm ? null : channelData?.emoji;
  const memberCount = channelData?.members?.length;

  const dateGroups = groupMessagesByDate(activeMessages);
  const hasPinned = !isDm && channelData?.pinned;

  const s = {
    window: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: theme.bgMain,
      overflow: 'hidden',
      transition: 'background 0.3s',
    },
    header: {
      padding: '12px 20px',
      borderBottom: `1px solid ${theme.border}`,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexShrink: 0,
      background: theme.bgMain,
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flex: 1,
      minWidth: 0,
    },
    headerEmoji: {
      fontSize: '18px',
    },
    headerName: {
      fontSize: '15px',
      fontWeight: '700',
      color: theme.textPrimary,
      letterSpacing: '-0.01em',
    },
    headerDesc: {
      fontSize: '12px',
      color: theme.textMuted,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexShrink: 0,
    },
    memberPile: {
      display: 'flex',
      alignItems: 'center',
    },
    memberCount: {
      fontSize: '12px',
      color: theme.textSecondary,
      marginLeft: '6px',
      fontWeight: '600',
    },
    headerBtn: {
      padding: '5px 12px',
      borderRadius: '8px',
      border: `1px solid ${theme.border}`,
      color: theme.textSecondary,
      fontSize: '12px',
      fontFamily: 'DM Sans, sans-serif',
      cursor: 'pointer',
      transition: 'all 0.2s',
      background: 'transparent',
    },
    pinnedBanner: {
      padding: '8px 20px',
      background: theme.pinnedBg,
      borderBottom: `1px solid ${theme.pinnedBorder}`,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '12px',
      color: theme.textSecondary,
      flexShrink: 0,
    },
    pinnedIcon: { fontSize: '14px' },
    pinnedText: { flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    messagesArea: {
      flex: 1,
      overflowY: 'auto',
      padding: '8px 0',
    },
    dateGroup: {
      marginBottom: '4px',
    },
    dateDivider: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 20px',
    },
    dateLine: {
      flex: 1,
      height: '1px',
      background: theme.divider,
    },
    dateLabel: {
      fontSize: '11px',
      fontWeight: '700',
      color: theme.textMuted,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      whiteSpace: 'nowrap',
      padding: '3px 10px',
      border: `1px solid ${theme.border}`,
      borderRadius: '20px',
      background: theme.bgMain,
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      gap: '12px',
      color: theme.textMuted,
      padding: '40px',
      textAlign: 'center',
    },
    emptyEmoji: { fontSize: '48px' },
    emptyTitle: { fontSize: '18px', fontWeight: '700', color: theme.textSecondary },
    emptyDesc: { fontSize: '13px', color: theme.textMuted, maxWidth: '300px' },
    inputArea: {
      padding: '0 20px 16px',
      flexShrink: 0,
    },
    inputWrapper: {
      border: `1px solid ${inputFocused ? theme.accent : theme.borderStrong}`,
      borderRadius: '12px',
      background: theme.bgInput,
      overflow: 'hidden',
      boxShadow: inputFocused ? theme.shadowInput : 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    toolbar: {
      display: 'flex',
      gap: '2px',
      padding: '8px 10px 0',
      borderBottom: `1px solid ${theme.border}`,
    },
    toolbarBtn: {
      width: '28px', height: '26px',
      borderRadius: '6px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer',
      color: theme.textMuted,
      fontSize: '12px',
      transition: 'background 0.15s, color 0.15s',
      background: 'transparent',
      border: 'none',
    },
    textarea: {
      width: '100%',
      padding: '10px 14px',
      background: 'transparent',
      color: theme.textPrimary,
      fontSize: '14px',
      resize: 'none',
      minHeight: '44px',
      maxHeight: '120px',
      lineHeight: '1.6',
      border: 'none',
    },
    inputFooter: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 12px',
      borderTop: `1px solid ${theme.border}`,
    },
    inputHint: {
      fontSize: '11px',
      color: theme.textMuted,
    },
    sendBtn: {
      width: '32px', height: '32px',
      borderRadius: '8px',
      background: inputText.trim()
        ? `linear-gradient(135deg, ${theme.accent}, ${theme.accentPurple})`
        : theme.bgBadge,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: inputText.trim() ? 'pointer' : 'not-allowed',
      fontSize: '16px',
      color: inputText.trim() ? '#fff' : theme.textMuted,
      transition: 'all 0.2s',
      border: 'none',
    },
    memberAvatar: (i) => ({
      width: '22px', height: '22px',
      borderRadius: '50%',
      fontSize: '9px', fontWeight: '700', color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginLeft: i > 0 ? '-6px' : '0',
      border: `2px solid ${theme.bgMain}`,
      flexShrink: 0,
    }),
  };

  const memberUsers = (channelData?.members || []).slice(0, 4).map((id) => users[id]).filter(Boolean);

  return (
    <div style={s.window}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          {headerEmoji && <span style={s.headerEmoji}>{headerEmoji}</span>}
          {isDm && dmUser && (
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: dmUser.avatarColor, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: '700', color: '#fff',
            }}>
              {dmUser.avatar}
            </div>
          )}
          <div>
            <div style={s.headerName}>{headerName}</div>
            {headerDesc && <div style={s.headerDesc}>{headerDesc}</div>}
          </div>
        </div>

        <div style={s.headerRight}>
          {!isDm && memberUsers.length > 0 && (
            <>
              <div style={s.memberPile}>
                {memberUsers.map((u, i) => (
                  <div key={u.id} style={{ ...s.memberAvatar(i), background: u.avatarColor }} title={u.name}>
                    {u.avatar}
                  </div>
                ))}
              </div>
              <span style={s.memberCount}>{memberCount}</span>
            </>
          )}
          <button
            style={s.headerBtn}
            onMouseEnter={(e) => { e.currentTarget.style.background = theme.bgSidebarHover; e.currentTarget.style.color = theme.textPrimary; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = theme.textSecondary; }}
          >
            🔍 Search
          </button>
          <button
            style={s.headerBtn}
            onMouseEnter={(e) => { e.currentTarget.style.background = theme.bgSidebarHover; e.currentTarget.style.color = theme.textPrimary; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = theme.textSecondary; }}
          >
            ☎ Call
          </button>
        </div>
      </div>

      {/* Pinned message banner */}
      {hasPinned && (
        <div style={s.pinnedBanner}>
          <span style={s.pinnedIcon}>📌</span>
          <span style={s.pinnedText}>{channelData.pinned}</span>
        </div>
      )}

      {/* Messages area */}
      <div style={s.messagesArea}>
        {activeMessages.length === 0 ? (
          <div style={s.emptyState}>
            <span style={s.emptyEmoji}>{isDm ? '👋' : headerEmoji || '💬'}</span>
            <div style={s.emptyTitle}>
              {isDm ? `Say hi to ${dmUser?.name}!` : `Welcome to #${channelData?.name}`}
            </div>
            <div style={s.emptyDesc}>
              {isDm ? 'This is the beginning of your conversation.' : channelData?.description || 'Start the conversation!'}
            </div>
          </div>
        ) : (
          dateGroups.map((group) => (
            <div key={group.date} style={s.dateGroup}>
              <div style={s.dateDivider}>
                <div style={s.dateLine} />
                <span style={s.dateLabel}>{group.date}</span>
                <div style={s.dateLine} />
              </div>
              {group.messages.map((msg, i) => {
                const allMsgs = group.messages;
                const grouped = i > 0 && shouldGroup(allMsgs, i);
                return <Message key={msg.id} message={msg} isGrouped={grouped} />;
              })}
            </div>
          ))
        )}

        {/* Typing indicator */}
        <TypingIndicator user={isTyping ? typingUser : null} />
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div style={s.inputArea}>
        <div style={s.inputWrapper}>
          <div style={s.toolbar}>
            {TOOLBAR_ACTIONS.map(({ icon, label, style }) => (
              <button
                key={label}
                style={{ ...s.toolbarBtn, ...style }}
                title={label}
                onMouseEnter={(e) => { e.currentTarget.style.background = theme.bgSidebarHover; e.currentTarget.style.color = theme.textPrimary; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = theme.textMuted; }}
              >
                {icon}
              </button>
            ))}
          </div>

          <textarea
            ref={inputRef}
            style={s.textarea}
            placeholder={`Message ${headerName}`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKey}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
          />

          <div style={s.inputFooter}>
            <span style={s.inputHint}>
              <kbd style={{ background: theme.bgBadge, borderRadius: '4px', padding: '1px 5px', fontSize: '11px', color: theme.textSecondary }}>Enter</kbd>
              {' '}to send · {' '}
              <kbd style={{ background: theme.bgBadge, borderRadius: '4px', padding: '1px 5px', fontSize: '11px', color: theme.textSecondary }}>Shift+Enter</kbd>
              {' '}new line
            </span>
            <button
              style={s.sendBtn}
              onClick={handleSend}
              onMouseEnter={(e) => { if (inputText.trim()) e.currentTarget.style.opacity = '0.85'; }}
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
