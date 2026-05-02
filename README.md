# ⚡ Blip — Modern Team Chat UI

A fun, production-grade Slack-inspired chat app built with React.

## Features
- 📢 Channel list with unread badges
- 💬 Real-time-style chat with message grouping
- 🧵 Threaded replies panel
- ⌨️ Simulated typing indicator with auto-reply
- 😊 Emoji reactions (click to toggle)
- 🌙 Dark / ☀️ Light mode toggle (persisted to localStorage)
- 📌 Pinned message banners
- 🎨 Unique teal/coral/lime color palette — NOT Slack colors

## Project Structure

```
src/
 ├── components/
 │    ├── Sidebar.jsx         # Nav: channels, DMs, user profile, theme toggle
 │    ├── ChatWindow.jsx      # Header, messages list, input toolbar
 │    ├── Message.jsx         # Individual message with reactions & hover actions
 │    ├── ThreadPanel.jsx     # Slide-in thread reply panel
 │    ├── TypingIndicator.jsx # Animated dots + user name
 │
 ├── hooks/
 │    ├── useChat.js          # Consume ChatContext
 │    ├── useTheme.js         # Consume ThemeContext
 │
 ├── context/
 │    ├── ChatContext.jsx     # Global chat state, send/react/thread actions
 │    ├── ThemeContext.jsx    # Theme state + CSS variable injection
 │
 ├── data/
 │    ├── mockData.js         # Users, channels, messages mock data
 │
 ├── styles/
 │    ├── theme.js            # Dark & light theme token objects
 │    ├── global.css          # Reset, fonts, keyframe animations
 │
 ├── App.jsx                  # Root layout (Sidebar + ChatWindow + ThreadPanel)
 └── main.jsx                 # Entry point with providers
```

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

Open [https://slackcloneai.vercel.app]

## Usage Tips
- Click channels in the sidebar to switch views
- Send a message — a teammate will auto-reply in ~2–3 seconds
- Hover a message to see the action toolbar (react, thread, bookmark)
- Click reactions to toggle yours; click + to add new ones
- Click "X replies" or the thread icon to open the Thread panel
- Toggle dark/light mode with the pill switch in the top-left header
