// src/context/ChatContext.jsx

import React, { createContext, useState, useCallback, useRef } from 'react';
import { CHANNELS, DMS, MESSAGES, USERS } from '../data/mockData';

export const ChatContext = createContext(null);

const TYPING_USERS = {
  general: 'ravi',
  'design-system': 'maya',
  engineering: 'zoe',
  random: 'alex',
  launches: 'sam',
  'dm-maya': 'maya',
  'dm-ravi': 'ravi',
  'dm-zoe': 'zoe',
};

export function ChatProvider({ children }) {
  const [activeChannelId, setActiveChannelId] = useState('general');
  const [messages, setMessages] = useState(MESSAGES);
  const [channelList, setChannelList] = useState(CHANNELS);
  const [dmList] = useState(DMS);
  const [typingMap, setTypingMap] = useState({});     // { channelId: bool }
  const [activeThread, setActiveThread] = useState(null); // message object
  const typingTimers = useRef({});

  // Mark channel as read when switching
  const switchChannel = useCallback((channelId) => {
    setActiveChannelId(channelId);
    setActiveThread(null);
    setChannelList((prev) =>
      prev.map((ch) => (ch.id === channelId ? { ...ch, unread: 0 } : ch))
    );
  }, []);

  // Send a new message (from current user)
  const sendMessage = useCallback(
    (text) => {
      if (!text.trim()) return;

      const newMsg = {
        id: `msg-${Date.now()}`,
        channelId: activeChannelId,
        userId: 'me',
        text: text.trim(),
        timestamp: new Date(),
        reactions: [],
        thread: [],
      };

      setMessages((prev) => ({
        ...prev,
        [activeChannelId]: [...(prev[activeChannelId] || []), newMsg],
      }));

      // Simulate a reply after 2-4 seconds
      const responderId = TYPING_USERS[activeChannelId];
      if (responderId) {
        // Start typing indicator
        setTypingMap((prev) => ({ ...prev, [activeChannelId]: true }));

        const delay = 2000 + Math.random() * 2000;
        typingTimers.current[activeChannelId] = setTimeout(() => {
          setTypingMap((prev) => ({ ...prev, [activeChannelId]: false }));

          const replies = [
            'On it! 🚀',
            'Great point — totally agree.',
            'Let me look into that.',
            'Nice work! 🙌',
            'Can you share more context?',
            'Haha yes 😂 100%',
            '👀 Interesting...',
            'Already on my list!',
          ];
          const replyText = replies[Math.floor(Math.random() * replies.length)];

          setMessages((prev) => ({
            ...prev,
            [activeChannelId]: [
              ...(prev[activeChannelId] || []),
              {
                id: `msg-${Date.now()}-reply`,
                channelId: activeChannelId,
                userId: responderId,
                text: replyText,
                timestamp: new Date(),
                reactions: [],
                thread: [],
              },
            ],
          }));
        }, delay);
      }
    },
    [activeChannelId]
  );

  // Toggle a reaction on a message
  const toggleReaction = useCallback((channelId, messageId, emoji) => {
    setMessages((prev) => {
      const channelMessages = prev[channelId] || [];
      return {
        ...prev,
        [channelId]: channelMessages.map((msg) => {
          if (msg.id !== messageId) return msg;
          const existing = msg.reactions.find((r) => r.emoji === emoji);
          if (existing) {
            const isMine = existing.users.includes('me');
            return {
              ...msg,
              reactions: msg.reactions.map((r) =>
                r.emoji === emoji
                  ? isMine
                    ? { ...r, users: r.users.filter((u) => u !== 'me'), count: r.count - 1 }
                    : { ...r, users: [...r.users, 'me'], count: r.count + 1 }
                  : r
              ).filter((r) => r.count > 0),
            };
          }
          return {
            ...msg,
            reactions: [...msg.reactions, { emoji, users: ['me'], count: 1 }],
          };
        }),
      };
    });
  }, []);

  // Add reply to a thread
  const addThreadReply = useCallback((messageId, text) => {
    if (!text.trim()) return;
    const newReply = {
      id: `reply-${Date.now()}`,
      userId: 'me',
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => {
      const channelMessages = prev[activeChannelId] || [];
      return {
        ...prev,
        [activeChannelId]: channelMessages.map((msg) =>
          msg.id === messageId
            ? { ...msg, thread: [...msg.thread, newReply] }
            : msg
        ),
      };
    });

    // Update activeThread to reflect new reply
    setActiveThread((prev) =>
      prev && prev.id === messageId
        ? { ...prev, thread: [...prev.thread, newReply] }
        : prev
    );
  }, [activeChannelId]);

  const openThread = useCallback((message) => {
    setActiveThread(message);
  }, []);

  const closeThread = useCallback(() => {
    setActiveThread(null);
  }, []);

  const activeChannel =
    channelList.find((c) => c.id === activeChannelId) ||
    dmList.find((d) => d.id === activeChannelId);

  const activeMessages = messages[activeChannelId] || [];
  const isTyping = typingMap[activeChannelId] || false;
  const typingUserId = TYPING_USERS[activeChannelId];
  const typingUser = typingUserId ? USERS[typingUserId] : null;

  return (
    <ChatContext.Provider
      value={{
        // Data
        channels: channelList,
        dms: dmList,
        messages,
        activeMessages,
        activeChannelId,
        activeChannel,
        activeThread,
        isTyping,
        typingUser,
        users: USERS,
        // Actions
        switchChannel,
        sendMessage,
        toggleReaction,
        addThreadReply,
        openThread,
        closeThread,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
