import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Package, Truck, ShoppingBag, Trash2, User, Heart, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AIChatbot.css';

export default function AIChatbot() {
  const { user } = useAuth();

  const makeWelcome = (u) => ({
    id: 'welcome',
    sender: 'bot',
    text: u
      ? `Hello **${u.name?.split(' ')[0] || 'there'}**! 👋 I'm **AfshaBot**, your 24/7 AI Shopping Assistant.\n\nI've already loaded your account details — just ask me anything about your orders, wishlist, account and more!`
      : `Hello! 👋 I'm **AfshaBot**, your 24/7 AI Shopping Assistant. How can I help you today?`,
    timestamp: new Date().toISOString(),
  });

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('glowora_ai_chat_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [makeWelcome(null)];
  });
  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState('auto');
  const [apiKey, setApiKey] = useState('');
  const chatEndRef = useRef(null);

  // Re-personalise the welcome message when auth state changes
  const prevUserId = useRef(null);
  useEffect(() => {
    const newId = user?._id || user?.id || null;
    if (newId !== prevUserId.current) {
      prevUserId.current = newId;
      setMessages(prev => {
        const withoutWelcome = prev.filter(m => m.id !== 'welcome');
        return [makeWelcome(user), ...withoutWelcome];
      });
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('glowora_ai_chat_history', JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Client-side fallback (when backend is unreachable or user is not logged in)
  const getClientSideBotReply = (queryText) => {
    const lower = queryText.toLowerCase().trim();
    const name = user?.name?.split(' ')[0] || 'there';

    if (lower.includes('human') || lower.includes('agent') || lower.includes('representative')) {
      return `### 👨‍💼 Connect with Human Support\n\nI've logged your request for our live customer support team!\n\nYou can reach us at **support@afshaenterprises.com** or call **+91 96071 11312** (Mon-Sat, 9AM-8PM).`;
    }
    if (lower.includes('order') || lower.includes('status') || lower.includes('track') || lower.includes('purchase') || lower.includes('bought') || /glw-[a-z0-9-]+/i.test(lower)) {
      const matched = queryText.match(/GLW-[A-Z0-9-]+/i);
      if (user) {
        const orderId = matched ? ` for **#${matched[0].toUpperCase()}**` : '';
        return `### 📦 Your Orders, ${name}\n\nI'm looking up your order${orderId} right now. If you don't see a response in a moment, you can view all your orders directly here:\n\n👉 **[My Account → Order History](/account/orders)**\n\nOr share your **Order ID** (e.g. \`GLW-XXXXXX\`) and I'll pull up the details!`;
      }
      return `### 📦 Order Tracking\n\nPlease **log in** to your account to view your order history and live tracking updates.`;
    }
    if (lower.includes('wishlist') || lower.includes('wish list') || lower.includes('saved item') || lower.includes('favourite') || lower.includes('favorite')) {
      if (user) {
        return `### 💖 Your Wishlist, ${name}\n\nI'm loading your saved items now. If it takes a moment, you can view your full wishlist here:\n\n👉 **[My Account → Wishlist](/wishlist)**`;
      }
      return `### 💖 Wishlist\n\nPlease **log in** to view your saved wishlist items.`;
    }
    if (lower.includes('my account') || lower.includes('my profile') || lower.includes('my email') || lower.includes('my phone') || lower.includes('my address') || lower.includes('my info') || lower.includes('my detail')) {
      if (user) {
        const addressParts = [user.address, user.city, user.state, user.zipCode].filter(Boolean);
        return `### 👤 Your Account Details, ${name}\n\n- **Name:** ${user.name || 'Not set'}\n- **Email:** ${user.email || 'Not set'}\n- **Phone:** ${user.phone || 'Not set'}\n- **Address:** ${addressParts.length > 0 ? addressParts.join(', ') : 'Not set'}\n- **Account Status:** ${user.isVerified ? '✅ Verified' : '⚠️ Not verified'}\n\nWant to update your details? Visit **My Account → Profile Settings**.`;
      }
      return `### 👤 Account\n\nPlease **log in** to view your account information.`;
    }
    if (lower.includes('ship') || lower.includes('delivery') || lower.includes('courier')) {
      return `### 🚚 Shipping & Delivery\n\n- **Standard:** 3–5 business days across India (FREE above ₹499).\n- **Express:** 1–2 business days in metro cities.\n- Tracking link sent via SMS & Email after dispatch!`;
    }
    if (lower.includes('return') || lower.includes('exchange')) {
      return `### 🔄 Return & Exchange Policy\n\n- **30-Day Returns** on unopened or gently used items.\n- **Free doorstep pickup** arranged by us.\n- Start via **My Account → Orders → Return Item**.`;
    }
    if (lower.includes('refund') || lower.includes('money back')) {
      return `### 💳 Refund Policy\n\nRefunds are processed within **3–5 business days** to your original payment method.`;
    }
    if (lower.includes('warranty') || lower.includes('guarantee') || lower.includes('broken') || lower.includes('damaged')) {
      return `### 🛡️ Warranty & Guarantee\n\nAll products carry a **1-Year Quality Guarantee**. Damaged on arrival? Contact us within **48 hours** for a free replacement!`;
    }
    if (lower.includes('payment') || lower.includes('razorpay') || lower.includes('cod') || lower.includes('upi')) {
      return `### 💳 Payment Methods\n\nWe accept **Razorpay (Cards, NetBanking)**, **UPI (Google Pay, PhonePe, Paytm)**, and **Cash on Delivery**. All payments are 256-bit SSL encrypted.`;
    }
    if (lower.includes('coupon') || lower.includes('discount') || lower.includes('promo')) {
      return `### 🎟️ Coupons & Discounts\n\n- **WELCOME10** — 10% off your first order!\n- **DIWALI50** — Flat 50% off on festive collections.`;
    }
    return `Hello ${name}! 👋 I'm **AfshaBot**, your 24/7 AI Shopping Assistant.\n\nI can help you with:\n- 📦 **Your Orders** & Live Tracking\n- 💖 **Your Wishlist**\n- 👤 **Your Account**\n- 🚚 **Shipping** & Timelines\n- 🔄 **Returns** & 💳 **Refunds**\n- 🛡️ **Warranty** & 🎟️ **Coupons**\n- 🛍️ **Product Recommendations**`;
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
      const token = localStorage.getItem('glowora_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // ── ORDER FAST PATH: use existing /api/orders/my — no AI, no new endpoints ──
      const glwMatch  = query.match(/GLW-[A-Z0-9-]+/i);
      const lower2    = query.toLowerCase();
      const isSpendingQ = lower2.includes('spent') || lower2.includes('spending') || lower2.includes('total spend') || lower2.includes('how much') || lower2.includes('expenditure') || lower2.includes('total amount') || lower2.includes('money spent');
      const isOrderQ  = glwMatch || isSpendingQ || lower2.includes('order') || lower2.includes('track') || lower2.includes('purchase') || lower2.includes('bought') || lower2.includes('latest order') || lower2.includes('my order');

      if (isOrderQ && token) {
        try {
          const ordRes  = await fetch('/api/orders/my', { headers });
          if (ordRes.ok) {
            const orders = await ordRes.json(); // array of orders

            const statusLabels = {
              pending_payment:  '⏳ Pending Payment — Please complete your payment',
              pending:          '⏳ Pending — Awaiting confirmation',
              paid:             '✅ Payment Confirmed — Order is being reviewed',
              approved:         '✅ Approved — Being packed & prepared',
              processing:       '⚙️ Processing — Being prepared for dispatch',
              shipped:          '🚚 Shipped — On the way!',
              out_for_delivery: '🛵 Out for Delivery — Arriving today!',
              delivered:        '🏠 Delivered — Successfully delivered',
              cancelled:        '❌ Cancelled',
              refunded:         '💳 Refunded',
            };

            const buildCard = (o) => {
              const statusKey   = (o.status || '').toLowerCase().replace(/ /g, '_');
              const statusLabel = statusLabels[statusKey] || `📦 ${(o.status || '').toUpperCase()}`;
              const ship        = o.shippingAddress
                ? `${o.shippingAddress.fullName || ''}, ${o.shippingAddress.city || ''}, ${o.shippingAddress.state || ''}`.replace(/^,\s*|,\s*$/g, '')
                : null;
              const placedOn    = o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : null;
              const estDel      = o.estimatedDelivery ? new Date(o.estimatedDelivery).toLocaleDateString('en-IN') : null;

              let card  = `### 📦 Order #${o.orderNumber}\n\n`;
              card     += `**${statusLabel}**\n\n`;
              card     += `| | |\n|---|---|\n`;
              card     += `| 💰 **Total** | ₹${o.total} |\n`;
              card     += `| 💳 **Payment** | ${o.paymentMethod || 'N/A'} |\n`;
              if (placedOn)         card += `| 📅 **Placed On** | ${placedOn} |\n`;
              if (ship)             card += `| 📮 **Ship To** | ${ship} |\n`;
              if (o.trackingNumber) card += `| 📍 **Tracking** | ${o.trackingNumber} |\n`;
              if (estDel)           card += `| 📆 **Est. Delivery** | ${estDel} |\n`;
              if (o.items?.length > 0) {
                const itemLines = o.items.map(i => `- ${i.name || 'Item'} (x${i.quantity}) — ₹${i.price}`).join('\n');
                card += `\n**Items Ordered:**\n${itemLines}`;
              }
              card += `\n\n> To return or cancel this order, say **"I want to return order ${o.orderNumber}"**.`;
              return card;
            };

            let card = '';

            // ── Spending summary ────────────────────────────────────────────
            if (isSpendingQ) {
              const PAID_STATUSES = new Set(['paid','approved','processing','shipped','out_for_delivery','delivered']);
              const paidOrders    = orders.filter(o => PAID_STATUSES.has((o.status||'').toLowerCase().replace(/ /g,'_')));
              const cancelledCnt  = orders.filter(o => ['cancelled','refunded'].includes((o.status||'').toLowerCase())).length;
              const totalSpent    = paidOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
              const avgOrder      = paidOrders.length > 0 ? (totalSpent / paidOrders.length).toFixed(2) : 0;
              const biggest       = paidOrders.length > 0 ? paidOrders.reduce((max, o) => (Number(o.total) > Number(max.total) ? o : max), paidOrders[0]) : null;

              // Count payment methods
              const pmCount = {};
              paidOrders.forEach(o => { const pm = o.paymentMethod || 'Unknown'; pmCount[pm] = (pmCount[pm] || 0) + 1; });
              const favPM = Object.entries(pmCount).sort((a,b) => b[1]-a[1])[0]?.[0] || 'N/A';

              // Status breakdown
              const statusCount = {};
              orders.forEach(o => {
                const s = (o.status || 'unknown').toLowerCase();
                statusCount[s] = (statusCount[s] || 0) + 1;
              });
              const statusLines = Object.entries(statusCount)
                .map(([s, c]) => {
                  const em = { pending_payment:'⏳', pending:'⏳', paid:'✅', approved:'✅', processing:'⚙️', shipped:'🚚', out_for_delivery:'🛵', delivered:'🏠', cancelled:'❌', refunded:'💳' }[s.replace(/ /g,'_')] || '📦';
                  return `${em} ${s.charAt(0).toUpperCase()+s.slice(1)}: **${c}**`;
                }).join('\n');

              if (orders.length === 0) {
                card = `### 💰 Your Spending Summary, ${name}\n\nYou haven't placed any orders yet. Start shopping today!`;
              } else {
                card  = `### 💰 Your Spending Summary, ${name}\n\n`;
                card += `| | |\n|---|---|\n`;
                card += `| 🛒 **Total Orders** | ${orders.length} |\n`;
                card += `| ✅ **Paid Orders** | ${paidOrders.length} |\n`;
                card += `| 💸 **Total Spent** | ₹${totalSpent.toLocaleString('en-IN')} |\n`;
                card += `| 📊 **Avg Order Value** | ₹${Number(avgOrder).toLocaleString('en-IN')} |\n`;
                if (biggest) card += `| 🏆 **Biggest Purchase** | #${biggest.orderNumber} — ₹${biggest.total} |\n`;
                card += `| 💳 **Fav Payment** | ${favPM} |\n`;
                if (cancelledCnt > 0) card += `| ❌ **Cancelled/Refunded** | ${cancelledCnt} |\n`;
                card += `\n**Order Breakdown:**\n${statusLines}`;
                card += `\n\n> Ask me about a specific order by sharing its ID, e.g. \`GLW-XXXXXX\`.`;
              }

            // ── Specific order ID lookup ────────────────────────────────────
            } else if (glwMatch) {
              const searchId = glwMatch[0].toUpperCase();
              const found    = orders.find(o => (o.orderNumber || '').toUpperCase() === searchId);
              if (found) {
                card = buildCard(found);
              } else {
                card = `### 📦 Order Not Found\n\nI couldn't find order **#${searchId}** under your account.\n\n- Double-check the order ID\n- Make sure you're logged in with the correct account\n- Contact us: **support@afshaenterprises.com** | **+91 96071 11312**`;
              }

            // ── No orders yet ───────────────────────────────────────────────
            } else if (orders.length === 0) {
              card = `### 📦 No Orders Yet, ${name}\n\nYou haven't placed any orders yet. Start shopping and your orders will appear here!`;

            // ── Recent orders list ──────────────────────────────────────────
            } else {
              const recent = orders.slice(0, 3);
              const statusEmojis = { pending_payment:'⏳', pending:'⏳', paid:'✅', approved:'✅', processing:'⚙️', shipped:'🚚', out_for_delivery:'🛵', delivered:'🏠', cancelled:'❌', refunded:'💳' };
              const lines = recent.map(o => {
                const sk = (o.status || '').toLowerCase().replace(/ /g,'_');
                const em = statusEmojis[sk] || '📦';
                const dt = o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : '';
                return `${em} **#${o.orderNumber}** — ${(o.status||'').toUpperCase()} — ₹${o.total} — ${dt}`;
              }).join('\n');
              card = `### 📦 Your Recent Orders, ${name}\n\n${lines}\n\n> Share an order ID (e.g. \`GLW-XXXXXX\`) for full tracking details.`;
            }

            if (card) {
              setMessages(prev => [...prev, { id: (Date.now()+1).toString(), sender: 'bot', text: card, timestamp: new Date().toISOString() }]);
              setIsLoading(false);
              return;
            }
          }
        } catch (_) {
          // fall through to AI chat
        }
      }

      // ── NORMAL PATH: send to AI chat route ───────────────────────────────────
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: query,
          conversationHistory: messages.slice(-5),
          provider: provider === 'auto' ? undefined : provider,
          apiKey: apiKey || undefined,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      let botReply = '';

      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success && data.message) botReply = data.message;
      } else if (res.status === 401) {
        botReply = `### 🔐 Please Log In\n\nTo get personalised support (orders, wishlist, account info), please **log in** to your account first.`;
      }

      if (!botReply) botReply = getClientSideBotReply(query);

      setMessages(prev => [...prev, { id: (Date.now()+1).toString(), sender: 'bot', text: botReply, timestamp: new Date().toISOString() }]);
    } catch (err) {
      setMessages(prev => [...prev, { id: (Date.now()+1).toString(), sender: 'bot', text: getClientSideBotReply(query), timestamp: new Date().toISOString() }]);
    } finally {
      setIsLoading(false);
    }
  };


  const handleClearChat = () => {
    setMessages([makeWelcome(user)]);
    localStorage.removeItem('glowora_ai_chat_history');
  };

  // Render simple markdown to HTML
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

  // Quick-action chips — personalised for logged-in users
  const userChips = [
    { label: 'Track my order', icon: <Package size={13} />, msg: 'Track my latest order' },
    { label: 'My wishlist', icon: <Heart size={13} />, msg: 'Show my wishlist' },
    { label: 'My account', icon: <User size={13} />, msg: 'Show my account details' },
    { label: 'My reviews', icon: <Star size={13} />, msg: 'Show my reviews' },
    { label: 'Spending', icon: <ShoppingBag size={13} />, msg: 'How much have I spent?' },
    { label: 'Shipping', icon: <Truck size={13} />, msg: 'What are the shipping timelines?' },
    { label: 'Returns', icon: null, msg: '🔄 Returns policy' },
  ];

  const guestChips = [
    { label: 'Orders', icon: <Package size={13} />, msg: 'Order status' },
    { label: 'Shipping', icon: <Truck size={13} />, msg: 'Shipping timelines' },
    { label: 'Returns', icon: null, msg: 'Return & exchange policy' },
    { label: 'Refunds', icon: null, msg: 'Refund policy' },
    { label: 'Warranty', icon: null, msg: '🛡️ Warranty policy' },
    { label: 'Payments', icon: null, msg: 'Payment methods' },
    { label: 'Coupons', icon: null, msg: '🎟️ Coupons and discounts' },
    { label: 'Products', icon: <ShoppingBag size={13} />, msg: 'Product recommendations' },
  ];

  const chips = user ? userChips : guestChips;

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
                <h4>AfshaBot AI <Sparkles size={13} color="#FFD700" /></h4>
                <div className="ai-bot-status">
                  <span className="ai-status-dot"></span>
                  {user
                    ? <span>Logged in as <strong>{user.name?.split(' ')[0]}</strong></span>
                    : '24/7 Online Support'}
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

          {/* Quick Action Chips */}
          <div className="ai-quick-actions" style={{ flexWrap: 'wrap' }}>
            {chips.map((chip) => (
              <button
                key={chip.msg}
                className="ai-chip"
                onClick={() => handleSend(chip.msg)}
              >
                {chip.icon}
                {chip.label}
              </button>
            ))}
            <button
              className="ai-chip"
              style={{ background: '#1A2B3C', color: '#ffffff', borderColor: '#1A2B3C' }}
              onClick={() => handleSend('Connect to a human support agent')}
            >
              👨‍💼 Human Agent
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
                placeholder={user ? `Ask anything, ${user.name?.split(' ')[0]}...` : 'Ask about orders, returns, delivery...'}
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
