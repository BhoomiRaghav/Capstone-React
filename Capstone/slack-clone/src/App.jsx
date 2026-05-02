// src/App.jsx
import React from 'react';
import { useTheme } from './hooks/useTheme';
import { useChat } from './hooks/useChat';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import ThreadPanel from './components/ThreadPanel';

function AppLayout() {
  const { theme } = useTheme();
  const { activeThread } = useChat();

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: theme.bgApp,
        transition: 'background 0.3s',
      }}
    >
      <Sidebar />
      <ChatWindow />
      {activeThread && <ThreadPanel />}
    </div>
  );
}

export default AppLayout;
