import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import api from '../services/api';

const ChatSystem = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const [conversations, setConversations] = useState([]); // array of email strings
  const [recipientEmail, setRecipientEmail] = useState('');
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const stompClientRef = useRef(null);
  const recipientRef = useRef(recipientEmail);
  recipientRef.current = recipientEmail;

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch conversation list
  const fetchConversations = useCallback(async () => {
    try {
      const res = await api.get('/chat/conversations');
      setConversations(Array.isArray(res.data) ? res.data : []);
    } catch {
      // silently ignore
    }
  }, []);

  // Resolve URL query param (runs once on mount / location change)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    const userIdParam = params.get('user');

    if (emailParam) {
      setRecipientEmail(emailParam);
      setConversations(prev =>
        prev.includes(emailParam) ? prev : [emailParam, ...prev]
      );
    } else if (userIdParam) {
      api.get(`/chat/user-email/${userIdParam}`)
        .then(res => {
          const email = res.data;
          setRecipientEmail(email);
          setConversations(prev =>
            prev.includes(email) ? prev : [email, ...prev]
          );
        })
        .catch(() => {});
    }
  }, [location.search]);

  // Initial conversations fetch
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // WebSocket setup (once)
  useEffect(() => {
    const socket = new SockJS('https://localloop-0857.onrender.com/ws');
    const client = new Client({
      webSocketFactory: () => socket, 
      connectHeaders: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe('/user/queue/messages', frame => {
          const incoming = JSON.parse(frame.body);
          // Only append if this message belongs to the open conversation
          if (
            incoming.senderEmail === recipientRef.current ||
            incoming.recipientEmail === recipientRef.current
          ) {
            setMessages(prev => {
              // Deduplicate by id
              if (prev.some(m => m.id === incoming.id)) return prev;
              return [...prev, incoming];
            });
          }
          fetchConversations();
        });
      },
      onStompError: () => {},
    });

    client.activate();
    stompClientRef.current = client;

    return () => { client.deactivate(); };
  }, [fetchConversations]);

  // Fetch message history when recipient changes
  useEffect(() => {
    if (!recipientEmail) { setMessages([]); return; }
    setHistoryLoading(true);
    api.get(`/chat/history/${encodeURIComponent(recipientEmail)}`)
      .then(res => setMessages(Array.isArray(res.data) ? res.data : []))
      .catch(() => setMessages([]))
      .finally(() => setHistoryLoading(false));
  }, [recipientEmail]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !recipientEmail || sending) return;

    setSending(true);
    try {
      const res = await api.post('/chat/send', {
        recipientEmail,
        content: messageInput.trim(),
      });
      setMessages(prev => {
        if (prev.some(m => m.id === res.data.id)) return prev;
        return [...prev, res.data];
      });
      setMessageInput('');
      fetchConversations();
    } catch {
      // show inline error
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) sendMessage(e);
  };

  // Display name helper (shows first part of email until we have full name)
  const displayName = email => email?.split('@')[0] || email;

  const formatTime = ts =>
    ts ? new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  const formatDate = ts => {
    if (!ts) return '';
    const d = new Date(ts);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Today';
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  // Group messages by date for date separators
  const groupedMessages = messages.reduce((acc, msg) => {
    const dateKey = msg.timestamp
      ? new Date(msg.timestamp).toDateString()
      : 'Unknown';
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(msg);
    return acc;
  }, {});

  return (
    <div className="chat-page">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="chat-sidebar__header">
          <h3>Messages</h3>
        </div>

        <div className="chat-sidebar__list">
          {conversations.length === 0 ? (
            <div className="chat-sidebar__empty">
              <span>💬</span>
              <p>No conversations yet.</p>
              <small>Click "Message Seller" on any listing to start chatting.</small>
            </div>
          ) : (
            conversations.map((email, i) => (
              <button
                key={i}
                className={`conv-item ${recipientEmail === email ? 'conv-item--active' : ''}`}
                onClick={() => setRecipientEmail(email)}
              >
                <div className="conv-avatar">
                  {email.charAt(0).toUpperCase()}
                </div>
                <div className="conv-body">
                  <span className="conv-name">{displayName(email)}</span>
                  <span className="conv-hint">Click to view</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="chat-main">
        {!recipientEmail ? (
          <div className="chat-empty">
            <span className="chat-empty__icon">💬</span>
            <h3>Select a conversation</h3>
            <p>Choose a contact from the sidebar or message a seller from the marketplace.</p>
          </div>
        ) : (
          <div className="chat-window">
            {/* Chat header */}
            <div className="chat-win__header">
              <div className="chat-win__avatar">
                {recipientEmail.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="chat-win__name">{displayName(recipientEmail)}</h4>
                <p className="chat-win__email">{recipientEmail}</p>
              </div>
            </div>

            {/* Messages */}
            <div className="chat-win__messages">
              {historyLoading ? (
                <div className="chat-loading">Loading messages…</div>
              ) : messages.length === 0 ? (
                <div className="chat-no-messages">
                  Start the conversation! 👋
                </div>
              ) : (
                Object.entries(groupedMessages).map(([dateKey, msgs]) => (
                  <div key={dateKey}>
                    <div className="date-separator">
                      <span>{formatDate(msgs[0]?.timestamp)}</span>
                    </div>
                    {msgs.map((msg, idx) => {
                      const isMine = msg.senderEmail === user?.email;
                      return (
                        <div
                          key={msg.id || idx}
                          className={`msg-row ${isMine ? 'msg-row--mine' : 'msg-row--theirs'}`}
                        >
                          {!isMine && (
                            <div className="msg-avatar">
                              {msg.senderEmail?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="msg-bubble">
                            <p className="msg-text">{msg.content}</p>
                            <span className="msg-time">{formatTime(msg.timestamp)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form className="chat-win__input-bar" onSubmit={sendMessage}>
              <input
                type="text"
                className="chat-win__input"
                placeholder="Type a message…"
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={sending}
              />
              <button
                type="submit"
                className="btn btn--primary chat-win__send"
                disabled={!messageInput.trim() || sending}
              >
                {sending ? '…' : '→'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSystem;
