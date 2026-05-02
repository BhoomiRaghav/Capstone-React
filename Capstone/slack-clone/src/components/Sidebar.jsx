// src/components/Sidebar.jsx
import React, { useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useChat } from '../hooks/useChat';

function Avatar({ user, size = 28, showStatus = false }) {
  const { theme } = useTheme();
  const statusColor = {
    online: theme.online,
    away: theme.away,
    offline: theme.offline,
  }[user?.status || 'offline'];

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div style={{
        width: size, height: size,
        borderRadius: size <= 24 ? '50%' : '8px',
        background: user?.avatarColor || '#888',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.36, fontWeight: '700', color: '#fff',
      }}>
        {user?.avatar || '?'}
      </div>
      {showStatus && (
        <div style={{
          width: 9, height: 9,
          borderRadius: '50%',
          background: statusColor,
          position: 'absolute', bottom: -1, right: -1,
          border: `2px solid var(--bg-sidebar, #111124)`,
        }} />
      )}
    </div>
  );
}

export default function Sidebar() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { channels, dms, activeChannelId, switchChannel, users } = useChat();
  const [channelsOpen, setChannelsOpen] = useState(true);
  const [dmsOpen, setDmsOpen] = useState(true);
  const me = users['me'];

  const s = {
    sidebar: {
      width: '260px',
      flexShrink: 0,
      background: theme.bgSidebar,
      display: 'flex',
      flexDirection: 'column',
      borderRight: `1px solid ${theme.border}`,
      height: '100%',
      overflow: 'hidden',
      transition: 'background 0.3s',
    },
    workspaceHeader: {
      padding: '14px 16px',
      borderBottom: `1px solid ${theme.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0,
    },
    logoArea: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    logoIcon: {
      width: '28px', height: '28px',
      borderRadius: '8px',
      background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentPurple})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '14px',
    },
    workspaceName: {
      fontSize: '15px',
      fontWeight: '700',
      color: theme.textPrimary,
      letterSpacing: '-0.02em',
    },
    workspaceTag: {
      fontSize: '10px',
      color: theme.textMuted,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
    themeBtn: {
      width: '34px', height: '20px',
      borderRadius: '10px',
      background: isDark ? theme.bgBadge : theme.bgSidebarActive,
      cursor: 'pointer',
      position: 'relative',
      transition: 'background 0.3s',
      border: `1px solid ${theme.border}`,
      flexShrink: 0,
    },
    themeBtnThumb: {
      width: '14px', height: '14px',
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentPurple})`,
      position: 'absolute',
      top: '2px',
      left: isDark ? '16px' : '2px',
      transition: 'left 0.3s',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '8px',
    },
    scrollArea: {
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden',
      padding: '8px 0',
    },
    sectionHeader: {
      padding: '6px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'pointer',
      userSelect: 'none',
    },
    sectionLabel: {
      fontSize: '11px',
      fontWeight: '700',
      color: theme.textMuted,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
    },
    sectionToggle: {
      fontSize: '10px',
      color: theme.textMuted,
      transition: 'transform 0.2s',
    },
    channelItem: (isActive) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '5px 16px',
      cursor: 'pointer',
      background: isActive ? theme.bgSidebarActive : 'transparent',
      borderRadius: '0',
      transition: 'background 0.15s',
      userSelect: 'none',
      position: 'relative',
    }),
    channelPrefix: {
      fontSize: '14px',
      color: theme.textMuted,
      width: '16px',
      flexShrink: 0,
      textAlign: 'center',
    },
    channelName: (isActive, hasUnread) => ({
      fontSize: '13px',
      fontWeight: hasUnread ? '700' : isActive ? '600' : '400',
      color: hasUnread ? theme.textPrimary : isActive ? theme.textPrimary : theme.textSecondary,
      flex: 1,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }),
    badge: {
      minWidth: '18px', height: '18px',
      padding: '0 5px',
      borderRadius: '9px',
      background: theme.accentAlt,
      color: '#fff',
      fontSize: '10px',
      fontWeight: '700',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'badgeBounce 0.4s ease',
    },
    dmItem: (isActive) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '5px 16px',
      cursor: 'pointer',
      background: isActive ? theme.bgSidebarActive : 'transparent',
      transition: 'background 0.15s',
      userSelect: 'none',
    }),
    dmName: (isActive, hasUnread) => ({
      fontSize: '13px',
      fontWeight: hasUnread ? '700' : isActive ? '600' : '400',
      color: hasUnread ? theme.textPrimary : isActive ? theme.textPrimary : theme.textSecondary,
      flex: 1,
    }),
    activeBar: {
      position: 'absolute',
      left: 0, top: '20%', bottom: '20%',
      width: '3px',
      borderRadius: '0 3px 3px 0',
      background: `linear-gradient(to bottom, ${theme.accent}, ${theme.accentPurple})`,
    },
    footer: {
      padding: '12px',
      borderTop: `1px solid ${theme.border}`,
      flexShrink: 0,
    },
    userCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px 10px',
      borderRadius: '10px',
      cursor: 'pointer',
      transition: 'background 0.15s',
    },
    userInfo: { flex: 1, minWidth: 0 },
    userName: {
      fontSize: '13px',
      fontWeight: '700',
      color: theme.textPrimary,
    },
    userStatus: {
      fontSize: '11px',
      color: theme.textMuted,
    },
    themeLabel: {
      fontSize: '10px',
      color: theme.textMuted,
    },
  };

  const handleChannelHover = (e, enter) => {
    if (!e.currentTarget.dataset.active) {
      e.currentTarget.style.background = enter ? theme.bgSidebarHover : 'transparent';
    }
  };

  return (
    <div style={s.sidebar}>
      {/* Workspace header */}
      <div style={s.workspaceHeader}>
        <div style={s.logoArea}>
          <div style={s.logoIcon}>⚡</div>
          <div>
            <div style={s.workspaceName}>Blip</div>
            <div style={s.workspaceTag}>Workspace</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={s.themeLabel}>{isDark ? '🌙' : '☀️'}</span>
          <button style={s.themeBtn} onClick={toggleTheme} title="Toggle theme">
            <div style={s.themeBtnThumb} />
          </button>
        </div>
      </div>

      {/* Scrollable nav */}
      <div style={s.scrollArea}>
        {/* Channels */}
        <div
          style={s.sectionHeader}
          onClick={() => setChannelsOpen((p) => !p)}
          onMouseEnter={(e) => e.currentTarget.style.background = theme.bgSidebarHover}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <span style={s.sectionLabel}>Channels</span>
          <span style={{ ...s.sectionToggle, transform: channelsOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}>▼</span>
        </div>

        {channelsOpen && channels.map((channel) => {
          const isActive = activeChannelId === channel.id;
          const hasUnread = channel.unread > 0;
          return (
            <div
              key={channel.id}
              style={s.channelItem(isActive)}
              data-active={isActive || undefined}
              onClick={() => switchChannel(channel.id)}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = theme.bgSidebarHover; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              {isActive && <div style={s.activeBar} />}
              <span style={s.channelPrefix}>#</span>
              <span style={s.channelName(isActive, hasUnread)}>{channel.name}</span>
              {hasUnread && <div style={s.badge}>{channel.unread}</div>}
            </div>
          );
        })}

        {/* Add channel */}
        {channelsOpen && (
          <div
            style={{ ...s.channelItem(false), opacity: 0.6 }}
            onMouseEnter={(e) => { e.currentTarget.style.background = theme.bgSidebarHover; e.currentTarget.style.opacity = '1'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.opacity = '0.6'; }}
          >
            <span style={s.channelPrefix}>+</span>
            <span style={{ fontSize: '13px', color: theme.textMuted }}>Add a channel</span>
          </div>
        )}

        {/* Divider */}
        <div style={{ height: '8px' }} />

        {/* DMs */}
        <div
          style={s.sectionHeader}
          onClick={() => setDmsOpen((p) => !p)}
          onMouseEnter={(e) => e.currentTarget.style.background = theme.bgSidebarHover}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <span style={s.sectionLabel}>Direct Messages</span>
          <span style={{ ...s.sectionToggle, transform: dmsOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}>▼</span>
        </div>

        {dmsOpen && dms.map((dm) => {
          const isActive = activeChannelId === dm.id;
          const dmUser = users[dm.userId];
          const hasUnread = dm.unread > 0;
          return (
            <div
              key={dm.id}
              style={s.dmItem(isActive)}
              onClick={() => switchChannel(dm.id)}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = theme.bgSidebarHover; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              {isActive && <div style={s.activeBar} />}
              <Avatar user={dmUser} size={22} showStatus />
              <span style={s.dmName(isActive, hasUnread)}>{dmUser?.name}</span>
              {hasUnread && <div style={s.badge}>{dm.unread}</div>}
            </div>
          );
        })}
      </div>

      {/* User footer */}
      <div style={s.footer}>
        <div
          style={s.userCard}
          onMouseEnter={(e) => e.currentTarget.style.background = theme.bgSidebarHover}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <Avatar user={me} size={32} showStatus />
          <div style={s.userInfo}>
            <div style={s.userName}>{me?.name}</div>
            <div style={s.userStatus}>🟢 Active</div>
          </div>
          <span style={{ fontSize: '14px', color: theme.textMuted }}>⚙️</span>
        </div>
      </div>
    </div>
  );
}
