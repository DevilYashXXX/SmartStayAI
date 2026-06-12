import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaRobot, FaTimes, FaPaperPlane, FaUser } from 'react-icons/fa';

const suggestions = [
  { text: 'Suggest PG in Salt Lake', label: 'PG in Salt Lake' },
  { text: 'Best hostel under Rs 5,000', label: 'Hostel < Rs 5K' },
  { text: 'How is verification score calculated?', label: 'How scores work' },
  { text: 'Recommend a studio in New Town', label: 'Studio in New Town' }
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hi there! I am your SmartStay AI Guide. Ask me anything about student accommodations in Kolkata!'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = (text) => {
    if (!text.trim()) return;

    // Append User Message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulated Bot Reply
    setTimeout(() => {
      let replyText = "I'm sorry, I didn't quite catch that. Try asking about a specific area like Salt Lake or Jadavpur, or click one of the quick suggestions below!";
      const query = text.toLowerCase();

      if (query.includes('salt lake') && query.includes('pg')) {
        replyText = "In Salt Lake, I recommend **Salt Lake Sector V Co-Living** (Rs 7,500/mo, 0.8km from college, 96% verification score) which has biometric access and meals included, or **Salt Lake Sector II Flat** (Rs 10,000/mo, 0.6km, 90% score).";
      } else if (query.includes('hostel') && (query.includes('5000') || query.includes('5,000') || query.includes('under'))) {
        replyText = "We have excellent budget-friendly hostels under Rs 5,000: \n1. **College Street Heritage Hostel** (Rs 3,200/mo, 1.2km from college, verified)\n2. **Gariahat Student Lodge** (Rs 4,000/mo, 1.5km from college, verified)\n3. **Dum Dum Metro Hostel** (Rs 4,500/mo, 1.8km, Dum Dum).";
      } else if (query.includes('score') || query.includes('verification') || query.includes('calculated')) {
        replyText = "SmartStay AI's verification score is calculated out of 100 based on standard listings transparency:\n- Detailed description length: up to 35 pts\n- Number of property photos (at least 2): up to 20 pts\n- Listed amenities (at least 3): up to 10 pts\nStays scoring 85+ are labeled as **Verified** with **Low Risk**.";
      } else if (query.includes('new town') || query.includes('studio') || query.includes('apartment')) {
        replyText = "For New Town, check out **New Town Luxury Studio** (Rs 14,000/mo, Action Area 1, 2.4km from Amity University) which features AC, parking, and a modern kitchenette, or **Bidhannagar Suite Stay** (Rs 15,000/mo, 0.4km from NIFT, 97% score) with full housekeeping.";
      } else if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
        replyText = "Hello! How can I help you find your student housing today? You can search by area (e.g. Jadavpur, Ballygunge) or property types (PG, Hostel).";
      } else if (query.includes('jadavpur')) {
        replyText = "In Jadavpur, we have the highly-rated **Jadavpur Scholars PG** (Rs 5,200/mo, girls-only, 0.5km from Jadavpur University, verified) which provides home-style meals and study desk facilities.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: replyText
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <ChatBotContainer>
      {/* Floating Chat Trigger button */}
      <ChatIcon onClick={toggleChat} $isOpen={isOpen} title="Talk to SmartStay AI assistant">
        {isOpen ? <FaTimes /> : <FaRobot />}
        {!isOpen && <PulseBadge />}
      </ChatIcon>

      {/* Chat Window Panel */}
      {isOpen && (
        <ChatWindow>
          <ChatHeader>
            <HeaderInfo>
              <FaRobot size={24} />
              <div>
                <h3>AI Guide</h3>
                <span>Always online</span>
              </div>
            </HeaderInfo>
            <CloseButton onClick={toggleChat}>
              <FaTimes />
            </CloseButton>
          </ChatHeader>

          <MessagesArea>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} $isUser={msg.sender === 'user'}>
                <Avatar $isUser={msg.sender === 'user'}>
                  {msg.sender === 'user' ? <FaUser size={10} /> : <FaRobot size={10} />}
                </Avatar>
                <MessageContent $isUser={msg.sender === 'user'}>
                  {msg.text.split('\n').map((line, idx) => (
                    <p key={idx} style={{ margin: '0 0 0.3rem 0' }}>
                      {/* Bold bold tags format parsing */}
                      {line.split('**').map((chunk, i) => i % 2 === 1 ? <strong key={i}>{chunk}</strong> : chunk)}
                    </p>
                  ))}
                </MessageContent>
              </MessageBubble>
            ))}
            {isTyping && (
              <TypingIndicator>
                <span></span>
                <span></span>
                <span></span>
              </TypingIndicator>
            )}
            <div ref={messagesEndRef} />
          </MessagesArea>

          {/* Smart suggestion chips */}
          <SuggestionsPanel>
            {suggestions.map((sug) => (
              <SuggestionChip key={sug.label} onClick={() => handleSendMessage(sug.text)}>
                {sug.label}
              </SuggestionChip>
            ))}
          </SuggestionsPanel>

          <InputArea onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }}>
            <input
              type="text"
              placeholder="Ask about properties, areas, prices..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <SendButton type="submit">
              <FaPaperPlane size={14} />
            </SendButton>
          </InputArea>
        </ChatWindow>
      )}
    </ChatBotContainer>
  );
};

export default ChatBot;

// Styled Components
const ChatBotContainer = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  font-family: inherit;
`;

const ChatIcon = styled.div`
  width: 56px;
  height: 56px;
  font-size: 1.5rem;
  color: white;
  background-color: ${(props) => (props.$isOpen ? '#ef4444' : 'var(--primary)')};
  border-radius: 50%;
  box-shadow: 0 4px 20px rgba(15, 118, 110, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &:hover {
    transform: scale(1.08) rotate(${(props) => (props.$isOpen ? '90deg' : '0deg')});
    box-shadow: 0 6px 24px rgba(15, 118, 110, 0.4);
  }
`;

const PulseBadge = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background-color: var(--accent);
  border-radius: 50%;
  border: 2px solid white;
  animation: pulse 1.8s infinite;

  @keyframes pulse {
    0% { transform: scale(0.9); opacity: 1; }
    50% { transform: scale(1.3); opacity: 0.5; }
    100% { transform: scale(0.9); opacity: 1; }
  }
`;

const ChatWindow = styled.div`
  position: fixed;
  bottom: 96px;
  right: 24px;
  width: 360px;
  height: 520px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.15);
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: floatUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;

  @keyframes floatUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @media (max-width: 480px) {
    width: calc(100vw - 32px);
    right: 16px;
    height: 480px;
  }
`;

const ChatHeader = styled.header`
  background: var(--primary);
  color: white;
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  h3 {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 700;
  }

  span {
    font-size: 0.75rem;
    opacity: 0.85;
    font-weight: 500;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  opacity: 0.8;

  &:hover {
    opacity: 1;
  }
`;

const MessagesArea = styled.div`
  flex: 1;
  padding: 1.25rem;
  overflow-y: auto;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MessageBubble = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.$isUser ? 'row-reverse' : 'row')};
  gap: 0.5rem;
  align-items: flex-end;
  max-width: 85%;
  align-self: ${(props) => (props.$isUser ? 'flex-end' : 'flex-start')};
`;

const Avatar = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${(props) => (props.$isUser ? 'var(--accent)' : 'var(--primary)')};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const MessageContent = styled.div`
  background: ${(props) => (props.$isUser ? 'var(--primary)' : 'white')};
  color: ${(props) => (props.$isUser ? 'white' : 'var(--text)')};
  padding: 0.65rem 0.85rem;
  border-radius: ${(props) => (props.$isUser ? '12px 12px 0 12px' : '12px 12px 12px 0')};
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
  font-size: 0.88rem;
  line-height: 1.45;
  border: ${(props) => (props.$isUser ? 'none' : '1px solid var(--border)')};
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 0.25rem;
  align-self: flex-start;
  padding: 0.5rem 1rem;
  background: white;
  border-radius: 12px;
  border: 1px solid var(--border);

  span {
    width: 6px;
    height: 6px;
    background-color: var(--muted);
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out both;
  }

  span:nth-child(1) { animation-delay: -0.32s; }
  span:nth-child(2) { animation-delay: -0.16s; }

  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
  }
`;

const SuggestionsPanel = styled.div`
  display: flex;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  background: #ffffff;
  overflow-x: auto;
  border-top: 1px solid var(--border);
  flex-wrap: nowrap;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const SuggestionChip = styled.button`
  background: #f1f5f9;
  border: 1px solid var(--border);
  border-radius: 999px;
  color: var(--primary);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.35rem 0.7rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
  }
`;

const InputArea = styled.form`
  display: flex;
  border-top: 1px solid var(--border);
  padding: 0.6rem 1rem;
  margin: 0;
  max-width: 100%;
  border-radius: 0;
  box-shadow: none;
  background: white;
  gap: 0.5rem;

  input {
    flex: 1;
    border: none;
    background: none;
    font-size: 0.88rem;
    padding: 0.5rem 0;
    margin: 0;
    min-height: auto;
    
    &:focus {
      box-shadow: none;
      border: none;
    }
  }
`;

const SendButton = styled.button`
  background: var(--primary);
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  min-height: auto;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &:hover {
    background: var(--primary-dark);
    transform: scale(1.05);
  }
`;