import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Package, Truck, ShoppingBag, Trash2, User, Heart, Star } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AIChatbot.css';

export default function AIChatbot() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const location = useLocation();

  const makeWelcome = (u) => ({
    id: 'welcome',
    sender: 'bot',
    text: u?.role === 'admin'
      ? `👑 Welcome, **${u.name?.split(' ')[0] || 'Admin'}**! You're in **Admin Mode**.\n\nI can show you new orders, pending approvals, revenue, analytics and more. What would you like to check?`
      : u
      ? `Hello **${u.name?.split(' ')[0] || 'there'}**! 👋 I'm **AfshaBot**, your 24/7 AI Shopping Assistant.\n\nI've already loaded your account details — just ask me anything about your orders, wishlist, account and more!`
      : `Hello! 👋 I'm **AfshaBot**, your 24/7 AI Shopping Assistant. How can I help you today?`,
    timestamp: new Date().toISOString(),
  });

  const [isOpen, setIsOpen] = useState(false);

  const [mascotMood, setMascotMood] = useState('happy'); // 'happy' | 'crying' | 'sleeping' | 'dizzy' | 'confused' | 'shy' | 'cooking' | 'drinking' | 'playing' | 'shopping'
  const [speechBubble, setSpeechBubble] = useState('✨ Welcome to Afsha Store! Tap me anytime 🌸');
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
  const chatEndRef = useRef(null);

  // ── Scroll velocity tracking for Dizzy reaction ──────────────────────────────
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastTime = Date.now();
    let dizzyTimeout = null;

    const handleScroll = () => {
      const now = Date.now();
      const dt = Math.max(now - lastTime, 16);
      const dy = Math.abs(window.scrollY - lastScrollY);
      const speed = dy / dt; // velocity in px/ms

      lastScrollY = window.scrollY;
      lastTime = now;

      if (speed > 1.6) {
        setMascotMood('dizzy');
        setSpeechBubble('🌀 Whoa, so fast! dizzy dizzy~');
        if (dizzyTimeout) clearTimeout(dizzyTimeout);
        dizzyTimeout = setTimeout(() => {
          setMascotMood('happy');
          setSpeechBubble('✨ Tap me for beauty secrets!');
        }, 3000);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (dizzyTimeout) clearTimeout(dizzyTimeout);
    };
  }, []);

  // ── Night Time Sleepy Reaction (10 PM to 6 AM) ──────────────────────────────
  useEffect(() => {
    const checkNight = () => {
      const hour = new Date().getHours();
      const isNight = hour >= 22 || hour < 6;
      if (isNight && mascotMood !== 'dizzy') {
        setMascotMood('sleeping');
        setSpeechBubble("💤 Yawn~ It's late! Want sweet dreams & beauty deals?");
      }
    };
    checkNight();
  }, []);

  // ── Auto Offer & Cute Activity Speech Rotator ───────────────────────────────
  const cuteActivities = [
    // Happy & Offers
    { mood: 'happy',    text: '⚡ Bestseller Hair Remover is in stock!' },
    { mood: 'happy',    text: '🌸 Smooth skin secrets await! Tap me!' },
    { mood: 'happy',    text: '✨ Welcome to Afsha Store! Tap me anytime 🌸' },
    { mood: 'happy',    text: '💖 Discover our cute beauty collection today!' },

    // Boba / Drinking
    { mood: 'drinking', text: '🧋 Slurp~ Sipping boba while finding sweet deals for you!' },
    { mood: 'drinking', text: '🧋 Strawberry boba tea is my favourite! What is yours? 🍓' },
    { mood: 'drinking', text: '🧋 Chill mode on~ Tap me to unlock secret deals! 🎟️' },

    // Cooking
    { mood: 'cooking',  text: '🍳 Cooking up fresh discount offers for you!' },
    { mood: 'cooking',  text: '🍳 Yummy recipes & hot deals fresh out of the kitchen! 🧁' },
    { mood: 'cooking',  text: '🍳 Baking special deals just for you today! 🍰' },

    // Playing / Gaming
    { mood: 'playing',  text: '🎮 Fun shopping time! Tap me anytime!' },
    { mood: 'playing',  text: '🎮 Level up your beauty routine with our bestsellers! 🕹️' },
    { mood: 'playing',  text: '🎮 High score unlocked! Discover top products 🛍️' },

    // Shy
    { mood: 'shy',      text: '🙈 Hihi~ Welcome to our cute shop! 🌸' },
    { mood: 'shy',      text: '🙈 Aap kitne cute ho! Welcome to Afsha Store 💕' },
    { mood: 'shy',      text: '🙈 Shy feel ho raha hai, par products bahut awesome hain! 💖' }
  ];

  useEffect(() => {
    if (isOpen || mascotMood === 'dizzy' || mascotMood === 'sleeping' || mascotMood === 'crying') return;
    const interval = setInterval(() => {
      const randomActivity = cuteActivities[Math.floor(Math.random() * cuteActivities.length)];
      setMascotMood(randomActivity.mood);
      setSpeechBubble(randomActivity.text);
    }, 7500);
    return () => clearInterval(interval);
  }, [isOpen, mascotMood]);

  // ── Track Navigation, Product Page Load Price Alert & Exit Reactions ────────
  const prevPathRef = useRef(location.pathname);
  const productViewCountRef = useRef(0);

  useEffect(() => {
    const prev = prevPathRef.current;
    const current = location.pathname;
    prevPathRef.current = current;

    const wasOnProductPage = prev.startsWith('/products/') || prev.startsWith('/product/');
    const isStillOnProductPage = current.startsWith('/products/') || current.startsWith('/product/');

    // When customer opens product detail page & page loads
    if (isStillOnProductPage) {
      productViewCountRef.current += 1;

      // Extract slug & try to fetch product price directly from API
      const slugMatch = current.match(/\/(?:products|product)\/([^/]+)/);
      if (slugMatch && slugMatch[1]) {
        const slug = slugMatch[1];
        fetch(`/api/products/${slug}`)
          .then(res => res.json())
          .then(prod => {
            if (prod && prod.price) {
              const displayPrice = prod.finalPrice || prod.flashSalePrice || prod.price;
              const productPageMsgs = [
                `🛍️ Sasta product hai khareed lo! Bas ₹${displayPrice} me 💖✨`,
                `😱 Kya pata iska price badh jaye! Fast buy kar lo 🛍️💕`,
                `💖 Ye product bahut achha hai! Highly recommended ✨🌸`,
                `✨ Isse aapki skin ekdum clean ho jayegi! 🥰💖`,
                `👑 Aap ekdum heroine lagogi / hero lagoge! 💃✨💕`,
                `🥰 Aap pehle se itne sundar ho, aur sundar ho jaoge! 💖✨🌸`,
                `🛍️ Wow! Ye product bas ₹${displayPrice} me mil raha hai! Add to cart fast! 🛒💖`
              ];
              setMascotMood('shopping');
              setSpeechBubble(productPageMsgs[Math.floor(Math.random() * productPageMsgs.length)]);
            }
          })
          .catch(() => {
            const defaultProductPageMsgs = [
              `🛍️ Sasta product hai khareed lo! 💖✨`,
              `😱 Kya pata iska price badh jaye! Fast buy kar lo 🛍️💕`,
              `💖 Ye product bahut achha hai! Highly recommended ✨🌸`,
              `✨ Isse aapki skin ekdum clean ho jayegi! 🥰💖`,
              `👑 Aap ekdum heroine lagogi / hero lagoge! 💃✨💕`,
              `🥰 Aap pehle se itne sundar ho, aur sundar ho jaoge! 💖✨🌸`
            ];
            setMascotMood('shopping');
            setSpeechBubble(defaultProductPageMsgs[Math.floor(Math.random() * defaultProductPageMsgs.length)]);
          });

      }

      // If customer has viewed 3 or more products, mascot acts confused
      if (productViewCountRef.current >= 3) {
        const confusedMsgs = [
          '🤔 Kya aapko koi madad chahiye?',
          '🤔 Kuch samajh nahi aaya? Mujhe batao, main help karungi! 💖',
          '🤔 Confused between products? Ask me which one is best! ✨'
        ];
        const confusedTimer = setTimeout(() => {
          setMascotMood('confused');
          setSpeechBubble(confusedMsgs[Math.floor(Math.random() * confusedMsgs.length)]);
        }, 3500);

        return () => clearTimeout(confusedTimer);
      }
    }


    // Reaction when customer exits a product page without buying
    if (wasOnProductPage && !isStillOnProductPage) {
      setMascotMood('crying');
      setSpeechBubble('😭 Aapko ye product pasand nhi aaya kya?');

      const msg2Timer = setTimeout(() => {
        setSpeechBubble('😭 Kya product jyada mehenga hai?');
      }, 4500);

      const resetTimer = setTimeout(() => {
        setMascotMood('happy');
        setSpeechBubble('✨ Let me know if you need any help! 🌸');
      }, 9500);

      return () => {
        clearTimeout(msg2Timer);
        clearTimeout(resetTimer);
      };
    }
  }, [location.pathname]);


  // ── Admin Automatic Database Order & Pending Orders Monitor ─────────────────
  const prevOrderCountRef = useRef(0);

  useEffect(() => {
    if (!isAdmin) return;

    const checkAdminOrdersFromDb = async () => {
      try {
        const adminToken = localStorage.getItem('glowora_token');
        if (!adminToken) return;

        const res = await fetch('/api/admin/orders', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
          }
        });

        if (!res.ok) return;
        const allOrders = await res.json();
        if (!Array.isArray(allOrders)) return;

        // Check for new incoming orders
        if (prevOrderCountRef.current > 0 && allOrders.length > prevOrderCountRef.current) {
          const newest = allOrders[0];
          setSpeechBubble(`📦 New Order Alert! Order #${newest?.orderNumber || 'New'} detected!`);
        }
        prevOrderCountRef.current = allOrders.length;

        // Check for pending / unshipped orders
        const pendingOrUnshipped = allOrders.filter(o => {
          const s = (o.status || '').toLowerCase().replace(/ /g, '_');
          return ['pending', 'pending_payment', 'paid', 'approved', 'processing'].includes(s);
        });

        if (pendingOrUnshipped.length > 0) {
          const pendingNums = pendingOrUnshipped.slice(0, 3).map(o => `#${o.orderNumber}`).join(', ');
          setSpeechBubble(`⚠️ Admin Alert: ${pendingOrUnshipped.length} order(s) pending approval or shipping! (${pendingNums})`);
        }
      } catch (err) {
        // silent catch
      }
    };

    checkAdminOrdersFromDb();
    const interval = setInterval(checkAdminOrdersFromDb, 20000);
    return () => clearInterval(interval);
  }, [isAdmin]);


  // Mascot Image & Emoji Mapping
  const getMascotImage = () => {
    if (mascotMood === 'sleeping') return '/cute-girl-sleeping.png';
    if (mascotMood === 'crying') return '/cute-girl-crying.png';
    if (mascotMood === 'confused') return '/cute-girl-confused.png';
    if (mascotMood === 'shy') return '/cute-girl-shy.png';
    if (mascotMood === 'cooking') return '/cute-girl-cooking.png';
    if (mascotMood === 'drinking') return '/cute-girl-drinking.png';
    if (mascotMood === 'playing') return '/cute-girl-playing.png';
    if (mascotMood === 'shopping') return '/cute-girl-shopping.png';
    return '/cute-girl-happy.png';
  };

  const getMoodEmoji = () => {
    const emojiMap = {
      sleeping: '💤',
      dizzy:    '🌀',
      crying:   '😭',
      confused: '🤔',
      shy:      '🙈',
      shopping: '🛍️',
      cooking:  '🍳',
      drinking: '🧋',
      playing:  '🎮',
      happy:    '✨'
    };
    return emojiMap[mascotMood] || '✨';
  };





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
      return `### 👨‍💼 Connect with Human Support\n\nI've logged your request for our live customer support team!\n\nYou can reach us at **reazafsha0@gmail.com** or call **+91 8073786650** (Mon-Sat, 9AM-8PM).`;
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
    return `Hello ${name}! 👋 I'm **AfshaBot**, your 24/7 AI Shopping Assistant.\n\nI can help you with:\n- 📦 **Your Orders** & Live Tracking\n- 💖 **Your Wishlist**\n- 👤 **Your Account**\n- 🚚 **Shipping** & Timelines\n- 💳 **Refunds**\n- 🛡️ **Warranty** & 🎟️ **Coupons**\n- 🛍️ **Product Recommendations**`;
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

      // ── ADMIN FAST PATH: fetch all orders from /api/admin/orders ─────────────
      const lower2     = query.toLowerCase();
      const isAdminUser = user?.role === 'admin';
      const isAdminOrderQ = isAdminUser && (
        lower2.includes('new order') || lower2.includes('pending') ||
        lower2.includes('approved') || lower2.includes('paid order') ||
        lower2.includes('all order') || lower2.includes('today order') ||
        lower2.includes('recent order') || lower2.includes('incoming') ||
        lower2.includes('order list') || lower2.includes('show order') ||
        lower2.includes('revenue') || lower2.includes('analytics') ||
        lower2.includes('sales') || lower2.includes('total revenue') ||
        lower2.includes('how many order') || lower2.includes('order count')
      );

      if (isAdminOrderQ) {
        try {
          const adminToken = localStorage.getItem('glowora_token');
          const adminHeaders = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` };
          const adminRes = await fetch('/api/admin/orders', { headers: adminHeaders });
          if (adminRes.ok) {
            const allOrders = await adminRes.json();

            // Filter: paid/approved = successful payment orders
            const PAID_STATUSES = ['paid', 'approved', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
            const paidOrders   = allOrders.filter(o => PAID_STATUSES.includes((o.status||'').toLowerCase().replace(/ /g,'_')));
            const newOrders    = allOrders.filter(o => ['paid','approved'].includes((o.status||'').toLowerCase()));
            const pendingOrders = allOrders.filter(o => ['pending','pending_payment'].includes((o.status||'').toLowerCase().replace(/ /g,'_')));

            // Revenue calc
            const totalRevenue = paidOrders.reduce((s, o) => s + (Number(o.total)||0), 0);
            const todayStr     = new Date().toDateString();
            const todayOrders  = allOrders.filter(o => new Date(o.createdAt).toDateString() === todayStr);
            const todayRevenue = todayOrders.filter(o => PAID_STATUSES.includes((o.status||'').toLowerCase().replace(/ /g,'_'))).reduce((s,o) => s+(Number(o.total)||0), 0);

            const statusEmojis = { pending_payment:'⏳', pending:'⏳', paid:'✅', approved:'✅', processing:'⚙️', shipped:'🚚', out_for_delivery:'🛵', delivered:'🏠', cancelled:'❌', refunded:'💳' };

            let adminCard = '';

            // Revenue / analytics query
            if (lower2.includes('revenue') || lower2.includes('analytics') || lower2.includes('sales')) {
              const statusBreakdown = {};
              allOrders.forEach(o => { const s=(o.status||'unknown').toLowerCase(); statusBreakdown[s]=(statusBreakdown[s]||0)+1; });
              const bLines = Object.entries(statusBreakdown).map(([s,c]) => {
                const em = statusEmojis[s.replace(/ /g,'_')] || '📦';
                return `${em} ${s.charAt(0).toUpperCase()+s.slice(1)}: **${c}**`;
              }).join('\n');
              adminCard  = `### 📊 Store Analytics\n\n`;
              adminCard += `| | |\n|---|---|\n`;
              adminCard += `| 🛒 **Total Orders** | ${allOrders.length} |\n`;
              adminCard += `| ✅ **Paid Orders** | ${paidOrders.length} |\n`;
              adminCard += `| 🆕 **New (Paid/Approved)** | ${newOrders.length} |\n`;
              adminCard += `| ⏳ **Pending Payment** | ${pendingOrders.length} |\n`;
              adminCard += `| 📅 **Today's Orders** | ${todayOrders.length} |\n`;
              adminCard += `| 💸 **Total Revenue** | ₹${totalRevenue.toLocaleString('en-IN')} |\n`;
              adminCard += `| 📆 **Today's Revenue** | ₹${todayRevenue.toLocaleString('en-IN')} |\n`;
              adminCard += `\n**Order Breakdown:**\n${bLines}`;

            // New / pending approval orders
            } else if (lower2.includes('new order') || lower2.includes('incoming') || lower2.includes('approved') || lower2.includes('paid order') || lower2.includes('pending')) {
              const showOrders = lower2.includes('pending') ? pendingOrders : newOrders;
              const label      = lower2.includes('pending') ? '⏳ Pending Payment Orders' : '🆕 New Orders (Paid & Approved)';
              if (showOrders.length === 0) {
                adminCard = `### ${label}\n\nNo orders in this category right now.`;
              } else {
                const rows = showOrders.slice(0, 15).map(o => {
                  const em      = statusEmojis[(o.status||'').toLowerCase().replace(/ /g,'_')] || '📦';
                  const cust    = o.user?.name || o.shippingAddress?.fullName || 'Guest';
                  const email   = o.user?.email || '-';
                  const items   = (o.items||[]).length;
                  const dt      = o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : '-';
                  return `${em} **#${o.orderNumber}** | ${cust} | ₹${o.total} | ${items} item(s) | ${dt}`;
                }).join('\n');
                adminCard  = `### ${label} (${showOrders.length} total)\n\n${rows}`;
                if (showOrders.length > 15) adminCard += `\n\n_Showing 15 of ${showOrders.length}. Visit Admin Panel for full list._`;
              }

            // All orders / today's orders
            } else {
              const showOrders = lower2.includes('today') ? todayOrders : allOrders.slice(0, 10);
              const label      = lower2.includes('today') ? `📅 Today's Orders (${todayOrders.length})` : `📋 All Orders (${allOrders.length} total, showing 10)`;
              const rows = showOrders.map(o => {
                const em   = statusEmojis[(o.status||'').toLowerCase().replace(/ /g,'_')] || '📦';
                const cust = o.user?.name || o.shippingAddress?.fullName || 'Guest';
                const dt   = o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN') : '-';
                return `${em} **#${o.orderNumber}** | ${cust} | ₹${o.total} | ${(o.status||'').toUpperCase()} | ${dt}`;
              }).join('\n');
              adminCard = `### ${label}\n\n${rows || 'No orders found.'}`;
            }

            if (adminCard) {
              setMessages(prev => [...prev, { id: (Date.now()+1).toString(), sender: 'bot', text: adminCard, timestamp: new Date().toISOString() }]);
              setIsLoading(false);
              return;
            }
          }
        } catch (_) { /* fall through */ }
      }

      // ── ORDER FAST PATH: use existing /api/orders/my — no AI, no new endpoints ──
      const glwMatch  = query.match(/GLW-[A-Z0-9-]+/i);
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
              card += `\n\n> For support or assistance with order #${o.orderNumber}, contact **reazafsha0@gmail.com**.`;

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
                card = `### 📦 Order Not Found\n\nI couldn't find order **#${searchId}** under your account.\n\n- Double-check the order ID\n- Make sure you're logged in with the correct account\n- Contact us: **reazafsha0@gmail.com** | **+91 8073786650**`;
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

  // Quick-action chips — personalised by role
  const adminChips = [
    { label: '🆕 New Orders',       icon: <Package size={13} />,     msg: 'Show new orders with successful payment' },
    { label: '⏳ Pending Payment',   icon: null,                       msg: 'Show pending payment orders' },
    { label: '📊 Analytics',         icon: <ShoppingBag size={13} />, msg: 'Show store analytics and revenue' },
    { label: '📅 Today Orders',      icon: null,                       msg: 'Show today orders' },
    { label: '📋 All Orders',        icon: null,                       msg: 'Show all orders' },
    { label: '💸 Revenue',           icon: null,                       msg: 'Show total revenue and sales analytics' },
  ];

  const userChips = [
    { label: 'Track my order', icon: <Package size={13} />, msg: 'Track my latest order' },
    { label: 'My wishlist',    icon: <Heart size={13} />,   msg: 'Show my wishlist' },
    { label: 'My account',    icon: <User size={13} />,     msg: 'Show my account details' },
    { label: 'My reviews',    icon: <Star size={13} />,     msg: 'Show my reviews' },
    { label: 'Spending',      icon: <ShoppingBag size={13} />, msg: 'How much have I spent?' },
    { label: 'Shipping',      icon: <Truck size={13} />,    msg: 'What are the shipping timelines?' },
  ];

  const guestChips = [
    { label: 'Orders',   icon: <Package size={13} />,     msg: 'Order status' },
    { label: 'Shipping', icon: <Truck size={13} />,       msg: 'Shipping timelines' },
    { label: 'Refunds',  icon: null,                      msg: 'Refund policy' },
    { label: 'Warranty', icon: null,                      msg: '🛡️ Warranty policy' },
    { label: 'Payments', icon: null,                      msg: 'Payment methods' },
    { label: 'Coupons',  icon: null,                      msg: '🎟️ Coupons and discounts' },
    { label: 'Products', icon: <ShoppingBag size={13} />, msg: 'Product recommendations' },
  ];

  const chips = isAdmin ? adminChips : user ? userChips : guestChips;

  return (
    <div className="ai-chatbot-widget">
      {/* Floating Auto-Offer / Reaction Speech Bubble */}
      {!isOpen && speechBubble && (
        <div className="ai-cute-speech-bubble" onClick={() => setIsOpen(true)}>
          <span>{speechBubble}</span>
        </div>
      )}

      {/* Floating Action Button — Full Body Mascot */}
      <button
        className={`ai-chatbot-fab ai-mascot-fab mood-${mascotMood}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle 24/7 AI Cute Assistant"
      >
        {isOpen ? (
          <X size={26} color="#E94057" />
        ) : (
          <div className="ai-mascot-avatar-wrap">
            <img
              src={getMascotImage()}
              alt="Cute AI Mascot"
              className={`ai-mascot-img ${mascotMood}`}
            />
            <span className={`ai-mascot-badge ${mascotMood}`}>{getMoodEmoji()}</span>
          </div>

        )}
        {!isOpen && <span className="ai-fab-badge">24/7 AI</span>}
      </button>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="ai-chatbot-modal">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-chat-header-info">
              <div className="ai-bot-avatar cute-header-avatar">
                <img src={getMascotImage()} alt="Afsha Mascot" className="ai-header-mascot-img" />
              </div>
              <div className="ai-bot-details">
                <h4>AfshaBot AI <Sparkles size={13} color="#FFD700" /></h4>
                <div className="ai-bot-status">
                  <span className="ai-status-dot"></span>
                  {isAdmin
                    ? <span>👑 Admin: <strong>{user.name?.split(' ')[0]}</strong></span>
                    : user
                    ? <span>Logged in as <strong>{user.name?.split(' ')[0]}</strong></span>
                    : '24/7 Cute AI Online'}
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
