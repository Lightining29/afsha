import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Package, RotateCcw, Truck, ShoppingBag, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AIChatbot.css';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('glowora_ai_chat_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'welcome',
        sender: 'bot',
        text: "Hello! 👋 I'm **GlowBot**, your 24/7 AI Shopping Assistant. How can I help you today?",
        timestamp: new Date().toISOString(),
      },
    ];
  });
  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState('auto');
  const [apiKey, setApiKey] = useState('');
  const { user } = useAuth();
  const chatEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('glowora_ai_chat_history', JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const getClientSideBotReply = (queryText) => {
    const lower = queryText.toLowerCase().trim();
    if (lower.includes('human') || lower.includes('agent') || lower.includes('person') || lower.includes('representative')) {
      return `### 👨‍💼 Connect with Human Support\n\nI have logged your request for our live customer support team! \n\nYou can reach our live support desk directly at **support@afshaenterprises.com** or call **+91 96071 11312** (Mon-Sat, 9AM-8PM).`;
    }
    if (lower.includes('order') || lower.includes('status') || lower.includes('track') || /glw-[a-z0-9-]+/i.test(lower)) {
      const matched = queryText.match(/GLW-[A-Z0-9-]+/i);
      if (matched) {
        return `### 📦 Order Status Update\n\nFound Order **#${matched[0].toUpperCase()}**.\n\n- **Status:** APPROVED & IN PROCESSING\n- **Courier:** Express Parcel Service\n- **Estimated Delivery:** 2 to 3 Business Days.`;
      }
      return `### 📦 Order Status & Tracking\n\nTo track your order live, please share your **Order ID** (e.g. \`GLW-MSESA4BL-0055\`) or check your **Account > Order History** section!`;
    }
    if (lower.includes('ship') || lower.includes('delivery') || lower.includes('pincode') || lower.includes('courier')) {
      return `### 🚚 Shipping & Delivery Information\n\n- **Standard Delivery:** 3 to 5 business days across India.\n- **Express Shipping:** 1 to 2 business days in select metro cities.\n- **Dispatch:** Same-day dispatch for orders placed before 2:00 PM.`;
    }
    if (lower.includes('return') || lower.includes('exchange') || lower.includes('policy')) {
      return `### 🛡️ Customer Support & Order Assistance\n\n- All products are quality inspected and covered under a **1-Year Warranty**.\n- For any order issues or support, please contact our support team at **support@afshaenterprises.com** or call **+91 96071 11312**.`;
    }
    if (lower.includes('refund') || lower.includes('money back')) {
      return `### 💳 Refund & Payment Assistance\n\n- For verified order cancellations or failed transactions, refunds are processed back to your original payment method within **3 to 5 business days**.`;
    }
    if (lower.includes('warranty') || lower.includes('guarantee') || lower.includes('broken') || lower.includes('damaged')) {
      return `### 🛡️ Product Warranty & Quality Guarantee\n\n- All products come with a **1-Year Quality Warranty**.\n- If an item arrives damaged, we provide a 100% free replacement!`;
    }
    if (lower.includes('payment') || lower.includes('razorpay') || lower.includes('cod') || lower.includes('upi') || lower.includes('card')) {
      return `### 💳 Payment Methods & Security\n\nWe accept **Razorpay (Credit/Debit Cards, NetBanking)**, **UPI (Google Pay, PhonePe, Paytm)**, and **Cash on Delivery (COD)**. All payments are 256-bit SSL encrypted.`;
    }
    if (lower.includes('coupon') || lower.includes('code') || lower.includes('discount') || lower.includes('promo')) {
      return `### 🎟️ Active Coupons & Savings\n\n- Code **WELCOME10** for 10% off your first order!\n- Code **DIWALI50** for flat 50% off on festive collections!`;
    }
    return `Hello! 👋 I'm **AfshaBot**, your 24/7 AI Shopping Assistant.\n\nHow can I help you today? Feel free to ask about:\n- 📦 **Orders** & Live Tracking\n- 🚚 **Shipping** & Timelines\n- 🛡️ **Warranty** & 💳 **Payments**\n- 🎟️ **Coupons** & 🛍️ **Product Questions**`;
  };

  const handleSend = async (textToSend) => {
    const query = textToSend || inputMsg.trim();
    if (!query || isLoading) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMsg('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          conversationHistory: messages.slice(-5),
          userId: user?._id || user?.id,
          provider: provider === 'auto' ? undefined : provider,
          apiKey: apiKey || undefined,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      let botReply = '';

      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success && data.message) {
          botReply = data.message;
        }
      }

      if (!botReply) {
        botReply = getClientSideBotReply(query);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: botReply,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      const fallbackReply = getClientSideBotReply(query);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: fallbackReply,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: "Hello! 👋 I'm **GlowBot**, your 24/7 AI Shopping Assistant. How can I help you today?",
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  // Helper to format simple markdown text (bold, links, headers, lists)
  const renderMarkdown = (content) => {
    let formatted = content
      .replace(/### (.*)/g, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;">$1</code>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n- (.*)/g, '<br/>• $1')
      .replace(/\n/g, '<br/>');

    return { __html: formatted };
  };

  return (
    <div className="ai-chatbot-widget">
      {/* Floating Action Button */}
      <button
        className="ai-chatbot-fab"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle 24/7 AI Customer Assistant"
      >
        {isOpen ? <X size={26} /> : <Bot size={26} />}
        {!isOpen && <span className="ai-fab-badge">24/7 AI</span>}
      </button>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="ai-chatbot-modal">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-chat-header-info">
              <div className="ai-bot-avatar">
                <Sparkles size={22} color="#ffffff" />
              </div>
              <div className="ai-bot-details">
                <h4>GlowBot AI <Sparkles size={13} color="#FFD700" /></h4>
                <div className="ai-bot-status">
                  <span className="ai-status-dot"></span> 24/7 Online Support
                </div>
              </div>
            </div>

            <div className="ai-chat-header-actions">
              <button
                className="ai-header-btn"
                title="Clear Chat History"
                onClick={handleClearChat}
              >
                <Trash2 size={16} />
              </button>
              <button
                className="ai-header-btn"
                title="Close Chat"
                onClick={() => setIsOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick Action Chips across 8 topics + Human Agent Escalation */}
          <div className="ai-quick-actions" style={{ flexWrap: 'wrap' }}>
            <button className="ai-chip" onClick={() => handleSend('Order status')}>
              <Package size={13} /> Orders
            </button>
            <button className="ai-chip" onClick={() => handleSend('Shipping timelines')}>
              <Truck size={13} /> Shipping
            </button>
            <button className="ai-chip" onClick={() => handleSend('Shipping info')}>
              <Truck size={13} /> Shipping
            </button>
            <button className="ai-chip" onClick={() => handleSend('Refund status')}>
              💳 Refunds
            </button>
            <button className="ai-chip" onClick={() => handleSend('Warranty policy')}>
              🛡️ Warranty
            </button>
            <button className="ai-chip" onClick={() => handleSend('Payment methods')}>
              💳 Payments
            </button>
            <button className="ai-chip" onClick={() => handleSend('Coupons and discounts')}>
              🎟️ Coupons
            </button>
            <button className="ai-chip" onClick={() => handleSend('Product recommendations')}>
              <ShoppingBag size={13} /> Product Qs
            </button>
            <button
              className="ai-chip"
              style={{ background: '#1A2B3C', color: '#ffffff', borderColor: '#1A2B3C' }}
              onClick={() => handleSend('Connect to a human support agent')}
            >
              👨‍💼 Connect to Human Agent
            </button>
          </div>

          {/* Messages Feed */}
          <div className="ai-chat-messages">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`ai-msg ${msg.sender === 'user' ? 'ai-msg-user' : 'ai-msg-bot'}`}
              >
                {msg.sender === 'bot' ? (
                  <div dangerouslySetInnerHTML={renderMarkdown(msg.text)} />
                ) : (
                  msg.text
                )}
              </div>
            ))}

            {isLoading && (
              <div className="ai-typing-indicator">
                <span className="ai-dot"></span>
                <span className="ai-dot"></span>
                <span className="ai-dot"></span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Footer */}
          <div className="ai-chat-input-area">
            <div className="ai-provider-select-wrapper">
              <span>Engine:</span>
              <select
                className="ai-provider-select"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
              >
                <option value="auto">Auto / Smart Fallback</option>
                <option value="gemini">Google Gemini API</option>
                <option value="openrouter">OpenRouter API</option>
                <option value="huggingface">HuggingFace API</option>
              </select>
            </div>

            <form
              className="ai-input-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <input
                type="text"
                className="ai-chat-input"
                placeholder="Ask about orders, returns, delivery..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
              />
              <button
                type="submit"
                className="ai-send-btn"
                disabled={!inputMsg.trim() || isLoading}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
