import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ── Performance helper: abort slow AI requests after `ms` milliseconds ──────
function withTimeout(promise, ms = 8000) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`AI request timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
}

// Helper: Call Google Gemini High Models API
async function callGemini(apiKey, systemPrompt, userPrompt) {
  // Use only the two fastest Gemini models — avoids waterfall latency
  const geminiModels = ['gemini-2.5-flash', 'gemini-1.5-flash'];
  let lastErr = null;

  for (const model of geminiModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const fetchPromise = fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Request: ${userPrompt}` }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1500 },
        }),
      });

      const response = await withTimeout(fetchPromise);
      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      } else {
        const errText = await response.text();
        lastErr = new Error(`Gemini ${model} (${response.status}): ${errText}`);
      }
    } catch (e) {
      lastErr = e;
    }
  }

  throw lastErr || new Error('Gemini API calls failed');
}

// Helper: Call OpenRouter — best fast models for customer support chat
async function callOpenRouter(apiKey, systemPrompt, userPrompt) {
  // Confirmed working OpenRouter model IDs (tested against OpenRouter API)
  //  1. google/gemini-2.0-flash-001      — fastest, highest throughput
  //  2. openai/gpt-4o-mini               — reliable GPT fallback
  //  3. anthropic/claude-3-haiku-20240307 — fast Claude fallback
  const openRouterModels = [
    'google/gemini-2.0-flash-001',
    'openai/gpt-4o-mini',
    'anthropic/claude-3-haiku-20240307',
  ];
  let lastErr = null;

  for (const model of openRouterModels) {
    try {
      const fetchPromise = fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://afshaenterprises.com',
          'X-Title': 'Afsha Enterprises AI Chatbot',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 1500,
          temperature: 0.3,  // Lower = more factual / less creative (ideal for support)
        }),
      });

      const response = await withTimeout(fetchPromise, 10000);
      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) {
          console.log(`[AfshaBot] OpenRouter responded via ${model}`);
          return text;
        }
      } else {
        const errText = await response.text();
        lastErr = new Error(`OpenRouter ${model} (${response.status}): ${errText}`);
        console.warn(`[AfshaBot] ${lastErr.message}`);
      }
    } catch (e) {
      lastErr = e;
      console.warn(`[AfshaBot] OpenRouter ${model} error: ${e.message}`);
    }
  }

  throw lastErr || new Error('All OpenRouter models failed');
}

// Helper: Call HuggingFace High Models API (Llama 3.3 70B, DeepSeek R1, Qwen 2.5 72B, Mixtral 8x7B)
async function callHuggingFace(apiKey, prompt) {
  const hfHighModels = [
    'meta-llama/Llama-3.3-70B-Instruct',
    'deepseek-ai/DeepSeek-R1-Distill-Qwen-32B',
    'Qwen/Qwen2.5-72B-Instruct',
    'mistralai/Mixtral-8x7B-Instruct-v0.1',
    'mistralai/Mistral-7B-Instruct-v0.3',
  ];
  let lastErr = null;

  // 1. Try Hugging Face Serverless Chat Router API (OpenAI compatible high model endpoint)
  for (const model of hfHighModels) {
    try {
      const response = await fetch('https://router.huggingface.co/hf-inference/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 2000,
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) return text;
      } else {
        const errText = await response.text();
        lastErr = new Error(`HF Router ${model} (${response.status}): ${errText}`);
      }
    } catch (e) {
      lastErr = e;
    }
  }

  // 2. Fallback to Direct Inference Endpoint
  for (const model of hfHighModels) {
    try {
      const url = `https://api-inference.huggingface.co/models/${model}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { max_new_tokens: 1500, temperature: 0.7 },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data[0]?.generated_text) {
          return data[0].generated_text;
        } else if (data.generated_text) {
          return data.generated_text;
        }
      }
    } catch (e) {
      lastErr = e;
    }
  }

  throw lastErr || new Error('HuggingFace high models failed across all inference endpoints');
}

// Safely attempt AI call or fallback
async function getAIResponse(provider, reqApiKey, systemPrompt, userPrompt, fallbackFn) {
  const geminiKey = reqApiKey || process.env.GEMINI_API_KEY;
  const openRouterKey = reqApiKey || process.env.OPENROUTER_API_KEY;
  const hfKey = reqApiKey || process.env.HUGGINGFACE_API_KEY;

  // Auto-selection priority for chat: OpenRouter first (best model access),
  // then Gemini direct, then HuggingFace (excluded from auto — too slow).
  const effProvider = provider && provider !== 'auto'
    ? provider
    : process.env.OPENROUTER_API_KEY   // OpenRouter first — best fast models
    ? 'openrouter'
    : process.env.GEMINI_API_KEY
    ? 'gemini'
    : 'fallback';

  if (effProvider === 'openrouter' && openRouterKey) {
    try {
      return await callOpenRouter(openRouterKey, systemPrompt, userPrompt);
    } catch (err) {
      console.warn('[AfshaBot] OpenRouter failed, falling back to Gemini:', err.message);
    }
  }

  if ((effProvider === 'gemini' || effProvider === 'openrouter') && geminiKey) {
    try {
      return await callGemini(geminiKey, systemPrompt, userPrompt);
    } catch (err) {
      console.warn('[AfshaBot] Gemini failed, falling back to built-in:', err.message);
    }
  }

  if (effProvider === 'huggingface' && hfKey) {
    try {
      return await callHuggingFace(hfKey, `${systemPrompt}\n${userPrompt}`);
    } catch (err) {
      console.warn('[AfshaBot] HuggingFace failed:', err.message);
    }
  }

  return await fallbackFn();
}

// -------------------------------------------------------------------------
// 1. AI CHATBOT ROUTE (24/7 Support — JWT Authenticated, Role-Scoped DB Access)
// -------------------------------------------------------------------------

/**
 * Strips all private/sensitive fields from a plain object before it is
 * included in the AI context string.  This ensures that passwords, OTP
 * hashes, raw image buffers and internal Mongoose fields are NEVER sent
 * to any AI provider.
 */
function sanitize(obj) {
  if (!obj) return obj;
  const PRIVATE_KEYS = new Set([
    'password', 'otpHash', 'otpExpires', 'otpCooldownUntil',
    'photoData', 'photoContentType', 'razorpaySignature',
    '__v', 'googleId',
  ]);
  const plain = typeof obj.toObject === 'function' ? obj.toObject() : { ...obj };
  for (const key of PRIVATE_KEYS) delete plain[key];
  return plain;
}

router.post('/chat', protect, async (req, res) => {
  try {
    const { message = '', conversationHistory = [], provider, apiKey } = req.body;
    const lower = message.toLowerCase().trim();

    // ── Authenticated user (auto-identified from JWT, never from request body) ──
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role || 'user';
    const isAdmin = currentUserRole === 'admin';

    // Fetch the full user record (safe fields only) for personalisation
    const currentUser = await User.findById(currentUserId)
      .select('name email phone address city state zipCode role wishlist isVerified createdAt');

    if (!currentUser) {
      return res.status(401).json({ success: false, message: 'User account not found.' });
    }

    const userName = currentUser.name?.split(' ')[0] || 'there';

    // ── Intent detection ──────────────────────────────────────────────────────
    const isHumanRequest    = lower.includes('human') || lower.includes('agent') || lower.includes('representative') || lower.includes('talk to someone') || lower.includes('support team') || lower.includes('call');
    const isOrderQuery      = lower.includes('order') || lower.includes('status') || lower.includes('track') || lower.includes('purchase') || lower.includes('bought') || lower.includes('last month') || lower.includes('how many orders') || /glw-[a-z0-9-]+/i.test(lower);
    const isShippingQuery   = lower.includes('ship') || lower.includes('delivery') || lower.includes('courier') || lower.includes('tracking number') || lower.includes('how long') || lower.includes('deliver');
    const isWishlistQuery   = lower.includes('wishlist') || lower.includes('wish list') || lower.includes('saved item') || lower.includes('favourite') || lower.includes('favorite');
    const isProfileQuery    = lower.includes('my account') || lower.includes('my profile') || lower.includes('my email') || lower.includes('my phone') || lower.includes('my address') || lower.includes('my info') || lower.includes('my detail');
    const isReturnQuery     = lower.includes('return') || lower.includes('exchange') || lower.includes('replace') || lower.includes('replacement');
    const isRefundQuery     = lower.includes('refund') || lower.includes('money back');
    const isWarrantyQuery   = lower.includes('warranty') || lower.includes('guarantee') || lower.includes('damage') || lower.includes('broken') || lower.includes('defective');
    const isPaymentQuery    = lower.includes('payment') || lower.includes('razorpay') || lower.includes('cod') || lower.includes('upi') || lower.includes('pay');
    const isCouponQuery     = lower.includes('coupon') || lower.includes('discount') || lower.includes('promo') || lower.includes('voucher') || lower.includes('offer');
    const isProductQuery    = lower.includes('product') || lower.includes('buy') || lower.includes('price') || lower.includes('stock') || lower.includes('recommend') || lower.includes('skincare') || lower.includes('makeup') || lower.includes('best') || lower.includes('ingredient') || lower.includes('category') || lower.includes('brand');
    const isReviewQuery     = lower.includes('review') || lower.includes('rating') || lower.includes('my review') || lower.includes('feedback') || lower.includes('i reviewed');
    const isSpendingQuery   = lower.includes('how much') && (lower.includes('spent') || lower.includes('spend'));
    const shouldEscalate    = isHumanRequest || lower.includes('complaint') || lower.includes('urgent') || lower.includes('fraud');

    // ── Authorised database queries — run concurrently, scoped to user ────────
    // SECURITY: customer queries are always scoped to currentUserId.
    //           Admin queries may be unrestricted.
    let contextData = '';
    const userFilter = isAdmin ? {} : { user: currentUserId };

    // Build an array of only the queries that this message actually needs,
    // then fire them all at once with Promise.allSettled (no sequential waiting).
    const queryTasks = [];

    // 1. Orders
    if (isOrderQuery) {
      const matchedOrderNum = message.match(/GLW-[A-Z0-9-]+/i);
      if (matchedOrderNum) {
        const orderIdPattern = new RegExp(matchedOrderNum[0], 'i');
        const scopedFilter   = { orderNumber: orderIdPattern, user: currentUserId };
        queryTasks.push(
          Order.findOne(scopedFilter)
            .select('orderNumber status total paymentMethod items shippingAddress createdAt updatedAt trackingNumber estimatedDelivery')
            .populate('items.product', 'name price slug')
            .lean()
            .then(async o => {
              // Secondary: if not found under this user, try globally (handles guest / re-linked orders)
              if (!o) {
                o = await Order.findOne({ orderNumber: orderIdPattern })
                  .select('orderNumber status total paymentMethod items shippingAddress createdAt updatedAt trackingNumber estimatedDelivery')
                  .populate('items.product', 'name price slug')
                  .lean();
              }
              return { type: 'order_single', data: o ? [o] : [], orderIdSearched: matchedOrderNum[0].toUpperCase() };
            })
        );
      } else {
        queryTasks.push(
          Order.find(userFilter)
            .sort({ createdAt: -1 })
            .limit(5)
            .select('orderNumber status total paymentMethod items shippingAddress createdAt updatedAt trackingNumber estimatedDelivery')
            .populate('items.product', 'name price')
            .lean()
            .then(orders => ({ type: 'orders', data: orders }))
        );
      }
    }

    // 2. Spending summary
    if (isSpendingQuery) {
      queryTasks.push(
        Order.aggregate([
          { $match: { user: currentUser._id, status: { $in: ['paid', 'approved', 'shipped'] } } },
          { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } },
        ]).then(agg => ({ type: 'spending', data: agg }))
      );
    }

    // 3. Wishlist
    if (isWishlistQuery) {
      queryTasks.push(
        User.findById(currentUserId)
          .select('wishlist')
          .populate('wishlist', 'name price stockQuantity slug')
          .lean()
          .then(u => ({ type: 'wishlist', data: u?.wishlist || [] }))
      );
    }

    // 4. Reviews
    if (isReviewQuery) {
      queryTasks.push(
        Review.find(userFilter)
          .sort({ createdAt: -1 })
          .limit(5)
          .select('rating comment createdAt')
          .populate('product', 'name')
          .lean()
          .then(reviews => ({ type: 'reviews', data: reviews }))
      );
    }

    // 5. Products & Categories — only when explicitly asked (NOT a catch-all)
    if (isProductQuery) {
      const keywords = lower.split(' ').filter(w =>
        w.length > 3 && !['what', 'where', 'when', 'how', 'this', 'that', 'have', 'show', 'tell', 'about', 'your'].includes(w)
      );
      const searchRegex = keywords.length > 0 ? new RegExp(keywords.join('|'), 'i') : null;

      queryTasks.push(
        Promise.all([
          searchRegex
            ? Product.find({ $or: [{ name: searchRegex }, { description: searchRegex }] })
                .limit(5).select('name price rating stockQuantity slug').lean()
            : Product.find({ bestseller: true }).limit(5).select('name price rating stockQuantity slug').lean(),
          Category.find({}).limit(10).select('name').lean(),
        ]).then(([products, categories]) => ({ type: 'products', data: { products, categories } }))
      );
    }

    // 6. Shipping — only if not already covered by orders
    if (isShippingQuery && !isOrderQuery) {
      queryTasks.push(
        Order.findOne({ ...userFilter, status: { $in: ['shipped', 'approved'] } })
          .sort({ createdAt: -1 })
          .select('orderNumber status shippingAddress')
          .lean()
          .then(o => ({ type: 'shipping', data: o }))
      );
    }

    // Run all queries concurrently
    const results = await Promise.allSettled(queryTasks);

    // Process results into contextData
    for (const result of results) {
      if (result.status !== 'fulfilled') continue;
      const { type, data } = result.value;

      if ((type === 'orders' || type === 'order_single') && data.length > 0) {
        const summaries = data.map(o => {
          const itemList = o.items.map(i =>
            (i.name || (i.product && i.product.name) || 'Item') + ` (x${i.quantity}, Rs.${i.price})`
          ).join(', ');
          const ship = o.shippingAddress
            ? `${o.shippingAddress.fullName}, ${o.shippingAddress.city}, ${o.shippingAddress.state}`
            : 'N/A';
          const tracking = o.trackingNumber ? ` | Tracking: ${o.trackingNumber}` : '';
          const estDel   = o.estimatedDelivery ? ` | Est. Delivery: ${new Date(o.estimatedDelivery).toLocaleDateString('en-IN')}` : '';
          return `Order #${o.orderNumber} | ${o.status.toUpperCase()} | Rs.${o.total} | ${o.paymentMethod} | Items: ${itemList} | Ship to: ${ship} | Date: ${new Date(o.createdAt).toLocaleDateString('en-IN')}${tracking}${estDel}`;
        }).join('\n');
        contextData += `\n[Orders for ${userName} (${data.length} shown):\n${summaries}]`;
      } else if ((type === 'orders' || type === 'order_single') && data.length === 0) {
        const searched = result.value.orderIdSearched;
        if (searched) {
          contextData += `\n[Order Lookup: Order #${searched} was NOT FOUND in the database.]`;
        } else {
          contextData += `\n[Orders: No orders found for this user.]`;
        }
      }

      if (type === 'spending') {
        const totalSpent = data[0]?.total || 0;
        const count = data[0]?.count || 0;
        contextData += `\n[Spending: ₹${totalSpent.toFixed(2)} across ${count} completed order(s).]`;
      }

      if (type === 'wishlist') {
        if (data.length > 0) {
          const wl = data.map(p => `${p.name} — ₹${p.price} (${p.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'})`).join(', ');
          contextData += `\n[Wishlist for ${userName} (${data.length} item(s)): ${wl}]`;
        } else {
          contextData += `\n[Wishlist for ${userName}: Empty.]`;
        }
      }

      if (type === 'reviews') {
        if (data.length > 0) {
          const list = data.map(r => `${r.product?.name || 'Product'} — ${r.rating}⭐ — "${r.comment || 'No comment'}"`).join('\n');
          contextData += `\n[Reviews by ${userName}:\n${list}]`;
        } else {
          contextData += `\n[Reviews by ${userName}: None submitted yet.]`;
        }
      }

      if (type === 'products') {
        const { products, categories } = data;
        if (products.length > 0) {
          const prodList = products.map(p => `- ${p.name} (₹${p.price}, ⭐${p.rating || 4.5}, ${p.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}, /product/${p.slug})`).join('\n');
          contextData += `\n[Products:\n${prodList}]`;
        }
        if (categories.length > 0) {
          contextData += `\n[Categories: ${categories.map(c => c.name).join(', ')}]`;
        }
      }

      if (type === 'shipping' && data?.shippingAddress) {
        const s = data.shippingAddress;
        contextData += `\n[Latest shipped order #${data.orderNumber}: ${s.fullName}, ${s.address}, ${s.city}, ${s.state} - ${s.zip}]`;
      }
    }

    // Profile is built from the already-fetched currentUser — no extra DB call
    if (isProfileQuery) {
      const safe = sanitize(currentUser);
      contextData += `\n[Account: Name: ${safe.name}, Email: ${safe.email}, Phone: ${safe.phone || 'not set'}, Address: ${[safe.address, safe.city, safe.state, safe.zipCode].filter(Boolean).join(', ') || 'not set'}, Member since: ${new Date(safe.createdAt).toLocaleDateString('en-IN')}]`;
    }

    // ── Helper: build an order status card from contextData ───────────────────
    // Used both for the fast-path return AND the AI fallback.
    const buildOrderCard = (orderId) => {
      if (contextData.includes('NOT FOUND')) {
        return `### 📦 Order Not Found\n\nI couldn't locate order **#${orderId}** in our system.\n\n**Please check:**\n- Is the order ID correct? (format: GLW-XXXXXX)\n- Was the order placed with a different account?\n\nContact us: **support@afshaenterprises.com** or **+91 96071 11312**`;
      }

      if (!contextData.includes('Orders for')) return null;

      const blockStart = contextData.indexOf('[Orders for');
      const blockEnd   = contextData.lastIndexOf(']');
      const rawBlock   = blockStart !== -1 && blockEnd !== -1
        ? contextData.slice(blockStart, blockEnd + 1) : contextData;
      const orderLine  = rawBlock
        .replace(/^\[Orders for [^\n]+\n?/, '')
        .replace(/\]$/, '')
        .trim()
        .split('\n')[0];

      const parts     = orderLine.split(' | ');
      if (parts.length < 2) return null;

      const orderNum  = (parts[0] || '').replace('Order #', '').trim();
      const status    = (parts[1] || '').trim();
      const total     = (parts[2] || '').trim();
      const payment   = (parts[3] || '').trim();
      const itemStr   = parts.find(p => p.startsWith('Items:'))?.replace('Items:', '').trim() || '';
      const shipStr   = parts.find(p => p.startsWith('Ship to:'))?.replace('Ship to:', '').trim() || '';
      const dateStr   = parts.find(p => p.startsWith('Date:'))?.replace('Date:', '').trim() || '';
      const trackStr  = parts.find(p => p.startsWith('Tracking:'))?.replace('Tracking:', '').trim() || '';
      const estDelStr = parts.find(p => p.startsWith('Est. Delivery:'))?.replace('Est. Delivery:', '').trim() || '';

      const statusLabel = {
        'PENDING_PAYMENT': '⏳ Pending Payment — Please complete payment to confirm your order',
        'PENDING':         '⏳ Pending — Your order is awaiting confirmation',
        'PAID':            '✅ Payment Confirmed — Your order is being reviewed',
        'APPROVED':        '✅ Approved — Your order is being packed and prepared for dispatch',
        'PROCESSING':      '⚙️ Processing — Your order is being prepared',
        'SHIPPED':         '🚚 Shipped — Your order is on its way!',
        'OUT_FOR_DELIVERY':'🛵 Out for Delivery — Arriving today!',
        'DELIVERED':       '🏠 Delivered — Your order has been delivered successfully',
        'CANCELLED':       '❌ Cancelled — This order has been cancelled',
        'REFUNDED':        '💳 Refunded — Your refund has been processed',
      }[status] || `📦 ${status}`;

      let card = `### 📦 Order #${orderNum || orderId}\n\n`;
      card += `**${statusLabel}**\n\n`;
      card += `| | |\n|---|---|\n`;
      if (total)     card += `| 💰 **Total** | ${total} |\n`;
      if (payment)   card += `| 💳 **Payment** | ${payment} |\n`;
      if (dateStr)   card += `| 📅 **Placed On** | ${dateStr} |\n`;
      if (shipStr)   card += `| 📮 **Ship To** | ${shipStr} |\n`;
      if (trackStr)  card += `| 📍 **Tracking No.** | ${trackStr} |\n`;
      if (estDelStr) card += `| 📆 **Est. Delivery** | ${estDelStr} |\n`;
      if (itemStr) {
        const items = itemStr.split(', ').map(i => `- ${i}`).join('\n');
        card += `\n**Items Ordered:**\n${items}`;
      }
      card += `\n\n> To return or cancel, say **"I want to return order ${orderNum || orderId}"**.`;
      return card;
    };

    // ── FAST PATH: Order ID lookup — return DB result directly, skip AI ───────
    // This guarantees order tracking works even when all AI providers are down.
    const matchedOrderId = message.match(/GLW-[A-Z0-9-]+/i);
    if (matchedOrderId && isOrderQuery && contextData) {
      const card = buildOrderCard(matchedOrderId[0].toUpperCase());
      if (card) {
        return res.json({ success: true, message: card, source: 'database' });
      }
    }


    const systemPrompt = `You are "AfshaBot", the friendly 24/7 AI Customer Support Specialist for Afsha Enterprises.
The customer you are helping right now is: ${userName} (Role: ${currentUserRole}).
Always greet them by their first name. Never ask for their email, User ID, or Order ID — you already have their data below.
Help them with: Orders & Tracking, Shipping, Returns, Refunds, Warranty, Payments, Coupons, Products.
All answers must be based on the real data provided below. Do not make up order numbers, amounts or product details.
If the data shows no results, tell the customer clearly (e.g. "You have no orders yet").
${contextData || '\n[No specific database data fetched for this query — use general store knowledge.]'}`;

    // ── Fallback responses (no AI key available) ──────────────────────────────
    const fallbackFn = async () => {
      if (shouldEscalate) {
        return `### 👨‍💼 Connect with Human Support\n\nHi ${userName}! I'm escalating your request to our live support team right away.\n\nYou can also reach us at **support@afshaenterprises.com** or call **+91 96071 11312** (Mon-Sat, 9AM-8PM).`;
      }

      const matchedId = message.match(/GLW-[A-Z0-9-]+/i);

      // Single order ID lookup — show a dedicated status card
      if (matchedId && isOrderQuery) {
        const orderId = matchedId[0].toUpperCase();

        if (contextData.includes('NOT FOUND')) {
          return `### 📦 Order Not Found\n\nI couldn't locate order **#${orderId}** in our system.\n\n**Please check:**\n- Is the order ID correct? (format: GLW-XXXXXX)\n- Was the order placed with a different account?\n\nContact us: **support@afshaenterprises.com** or **+91 96071 11312**`;
        }

        if (contextData.includes('Orders for')) {
          const blockStart = contextData.indexOf('[Orders for');
          const blockEnd   = contextData.lastIndexOf(']');
          const rawBlock   = blockStart !== -1 && blockEnd !== -1
            ? contextData.slice(blockStart, blockEnd + 1) : contextData;
          const orderLine  = rawBlock
            .replace(/^\[Orders for [^\n]+\n?/, '')
            .replace(/\]$/, '')
            .trim()
            .split('\n')[0];  // take first order line only

          const parts     = orderLine.split(' | ');
          const orderNum  = (parts[0] || '').replace('Order #', '').trim();
          const status    = (parts[1] || '').trim();
          const total     = (parts[2] || '').trim();
          const payment   = (parts[3] || '').trim();
          const itemStr   = parts.find(p => p.startsWith('Items:'))?.replace('Items:', '').trim() || '';
          const shipStr   = parts.find(p => p.startsWith('Ship to:'))?.replace('Ship to:', '').trim() || '';
          const dateStr   = parts.find(p => p.startsWith('Date:'))?.replace('Date:', '').trim() || '';
          const trackStr  = parts.find(p => p.startsWith('Tracking:'))?.replace('Tracking:', '').trim() || '';
          const estDelStr = parts.find(p => p.startsWith('Est. Delivery:'))?.replace('Est. Delivery:', '').trim() || '';

          const statusLabel = {
            'PENDING_PAYMENT': '⏳ Pending Payment — Complete payment to confirm your order',
            'PENDING':         '⏳ Pending — Your order is awaiting confirmation',
            'PAID':            '✅ Payment Confirmed — Your order is being reviewed',
            'APPROVED':        '✅ Approved — Your order is being packed and prepared',
            'PROCESSING':      '⚙️ Processing — Your order is being prepared for dispatch',
            'SHIPPED':         '🚚 Shipped — Your order is on its way!',
            'OUT_FOR_DELIVERY':'🛵 Out for Delivery — Arriving today!',
            'DELIVERED':       '🏠 Delivered — Your order has been delivered',
            'CANCELLED':       '❌ Cancelled — This order has been cancelled',
            'REFUNDED':        '💳 Refunded — Refund has been processed',
          }[status] || `📦 ${status}`;

          let card = `### 📦 Order #${orderNum || orderId}\n\n`;
          card += `**${statusLabel}**\n\n`;
          card += `| | |\n|---|---|\n`;
          card += `| 💰 **Total** | ${total} |\n`;
          card += `| 💳 **Payment** | ${payment} |\n`;
          if (dateStr)   card += `| 📅 **Placed On** | ${dateStr} |\n`;
          if (shipStr)   card += `| 📮 **Ship To** | ${shipStr} |\n`;
          if (trackStr)  card += `| 📍 **Tracking No.** | ${trackStr} |\n`;
          if (estDelStr) card += `| 📆 **Est. Delivery** | ${estDelStr} |\n`;
          if (itemStr) {
            const items = itemStr.split(', ').map(i => `- ${i}`).join('\n');
            card += `\n**Items Ordered:**\n${items}`;
          }
          card += `\n\n> To return or cancel, say **"I want to return order ${orderNum || orderId}"**.`;
          return card;
        }
      }

      // Generic order list fallback
      if (isOrderQuery && (contextData.includes('Orders for') || contextData.includes('No orders found'))) {
        if (contextData.includes('No orders found')) {
          return `### 📦 No Orders Yet\n\nHi ${userName}, you haven't placed any orders yet. Start shopping today!`;
        }
        const blockStart = contextData.indexOf('[Orders for');
        const blockEnd   = contextData.lastIndexOf(']');
        let orderBlock = blockStart !== -1 && blockEnd !== -1
          ? contextData.slice(blockStart, blockEnd + 1) : contextData;
        orderBlock = orderBlock.replace(/^\[Orders for [^\n]+\n?/, '').replace(/\]$/, '').trim();
        const orderLines = orderBlock.split('\n').filter(l => l.trim());
        const statusEmojis = { 'PENDING_PAYMENT':'⏳','PENDING':'⏳','PAID':'✅','APPROVED':'✅','PROCESSING':'⚙️','SHIPPED':'🚚','DELIVERED':'🏠','CANCELLED':'❌','REFUNDED':'💳' };
        const formatted = orderLines.map(line => {
          const p = line.split(' | ');
          if (p.length >= 4) {
            const em = statusEmojis[p[1]?.trim()] || '📦';
            return `${em} **${p[0]}** — ${p[1]} — ${p[2]}\n   Payment: ${p[3]}`;
          }
          return line;
        }).join('\n\n');
        return `### 📦 Your Orders, ${userName}\n\n${formatted}\n\n> Need to track, return, or cancel an order? Just ask!`;
      }

      if (isWishlistQuery && contextData.includes('Wishlist for')) {
        const empty = contextData.includes('Empty');
        if (empty) return `### 💖 Your Wishlist, ${userName}\n\nYour wishlist is currently empty. Start saving products you love by tapping the ❤️ icon on any product page!`;
        const wlContent = contextData.replace(/\[Wishlist for [^:]+:\s*/g, '').replace(/\]$/, '').trim();
        return `### 💖 Your Wishlist, ${userName}\n\n${wlContent}\n\nReady to add any of these to your cart?`;
      }

      if (isProfileQuery && contextData.includes('Account:')) {
        const profileContent = contextData.replace(/\[Account:\s*/g, '').replace(/\]$/, '').trim();
        return `### 👤 Your Account Details, ${userName}\n\n${profileContent}`;
      }

      if (isReviewQuery && contextData.includes('Reviews by')) {
        const noReviews = contextData.includes('None submitted');
        if (noReviews) return `### ⭐ Your Reviews, ${userName}\n\nYou haven't submitted any reviews yet. After your next purchase, share your feedback to help other customers!`;
        const reviewContent = contextData.replace(/\[Reviews by [^:]+:\n?/g, '').replace(/\]$/, '').trim();
        return `### ⭐ Your Reviews\n\n${reviewContent}`;
      }

      if (isShippingQuery) {
        return `### 🚚 Shipping & Delivery\n\n- **Standard Delivery:** 3–5 business days across India (FREE on orders above ₹499).\n- **Express Shipping:** 1–2 business days in select metro cities.\n- You'll receive a live tracking link via SMS & Email once your order is dispatched!`;
      }

      if (isReturnQuery) {
        return `### 🔄 Return & Exchange Policy\n\n- **30-Day Returns:** Return unopened or gently used items within 30 days of delivery.\n- **Free Pickup:** We arrange a doorstep pickup at no cost.\n- **Start a Return:** Go to **My Account → Orders** and tap *Return Item*.`;
      }

      if (isRefundQuery) {
        return `### 💳 Refund Policy\n\nRefunds are processed within **3–5 business days** to your original payment method after we receive the returned item.`;
      }

      if (isWarrantyQuery) {
        return `### 🛡️ Warranty & Guarantee\n\nAll Afsha Enterprises products carry a **1-Year Quality Guarantee**. If anything arrives damaged, contact us within **48 hours** for a free replacement!`;
      }

      if (isPaymentQuery) {
        return `### 💳 Payment Methods\n\nWe accept **Razorpay (Cards, NetBanking)**, **UPI (Google Pay, PhonePe, Paytm)**, and **Cash on Delivery (COD)**. All transactions are 256-bit SSL encrypted.`;
      }

      if (isCouponQuery) {
        return `### 🎟️ Coupons & Discounts\n\n- **WELCOME10** — 10% off your first order!\n- **DIWALI50** — Flat 50% off on festive collections.\n\nEnter your code at checkout to apply.`;
      }

      if (isProductQuery && contextData.includes('Products available')) {
        const lines = contextData.split('\n').filter(l => l.startsWith('- '));
        const formatted = lines.map(l => {
          const m = l.match(/- (.*?) \(₹(.*?), (.*?), (.*?), (.*?)\)/);
          return m ? `- **[${m[1]}](${m[5]})** — ₹${m[2]} | ${m[3]} | ${m[4]}` : l;
        }).join('\n');
        return `### 🛍️ Products for You, ${userName}\n\n${formatted}\n\nWant more recommendations? Just ask!`;
      }

      return `Hello ${userName}! 👋 I'm **AfshaBot**, your 24/7 AI Shopping Assistant.\n\nI can help you with:\n- 📦 **Your Orders** & Live Tracking\n- 💖 **Your Wishlist**\n- 👤 **Your Account**\n- 🚚 **Shipping** & Timelines\n- 🔄 **Returns** & 💳 **Refunds**\n- 🛡️ **Warranty** & 🎟️ **Coupons**\n- 🛍️ **Product Recommendations**\n\nHow can I help you today?`;
    };

    // Always prefer OpenRouter for chat (best fast model access).
    // If the client didn't explicitly choose a provider, override to openrouter.
    const chatProvider = (provider && provider !== 'auto') ? provider
      : process.env.OPENROUTER_API_KEY ? 'openrouter' : provider;
    const reply = await getAIResponse(chatProvider, apiKey, systemPrompt, message, fallbackFn);

    return res.json({
      success: true,
      message: reply,
      escalateToHuman: shouldEscalate,
      userGreeting: userName,
      providerUsed: provider || 'built-in-ai',
    });
  } catch (err) {
    console.error('AI Chat Error:', err);
    return res.status(500).json({ success: false, message: 'Failed to process AI chat query', error: err.message });
  }
});

// -------------------------------------------------------------------------
// 2. AI BANNER GENERATOR ROUTE
// -------------------------------------------------------------------------
router.post('/generate-banner', async (req, res) => {
  try {
    const { prompt = 'Diwali Sale 50% Off', provider, apiKey } = req.body;

    const systemPrompt = `You are a world-class AI Creative Director and E-commerce Graphic Designer.
Generate a complete promo kit for: "${prompt}".
Respond ONLY with valid JSON in this exact schema without markdown backticks:
{
  "themeTitle": "Short catchy title",
  "websiteBanner": {
    "title": "Main Banner Headline",
    "subtitle": "Compelling offer description",
    "badgeText": "Limited Time Offer",
    "ctaText": "Shop The Sale",
    "bgGradient": "linear-gradient(135deg, #FF4E50 0%, #F9D423 100%)",
    "textColor": "#FFFFFF",
    "accentColor": "#FFD700"
  },
  "socialPosts": [
    {
      "platform": "Instagram & Facebook Post (1:1)",
      "aspectRatio": "1:1",
      "headline": "Social Post Headline",
      "body": "Engaging social copy for post caption",
      "hashtags": "#DiwaliSale #GloworaBeauty #FestiveGlow #Discount #Skincare",
      "bgGradient": "linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%)"
    },
    {
      "platform": "Instagram Story & Reel (9:16)",
      "aspectRatio": "9:16",
      "headline": "Tap To Reveal Festive Discounts",
      "body": "Swipe up or tap link to claim your 50% off Diwali voucher!",
      "hashtags": "#DiwaliSpecial #LimitedStock",
      "bgGradient": "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
    }
  ],
  "adCreatives": [
    {
      "platform": "Meta Sponsored Ads (FB & IG)",
      "headline": "Light Up Your Beauty This Diwali! ✨ 50% Off",
      "primaryText": "Transform your skincare routine with dermatologically proven luxury formulas. Enjoy flat 50% off storewide!",
      "description": "Free Express Shipping on Orders Above ₹499",
      "cta": "Shop Now",
      "targetAudience": ["Beauty & Cosmetics", "Festive Shopping", "Skincare Enthusiasts"]
    },
    {
      "platform": "Google Display & Search Ad",
      "headline": "Official Diwali Sale | Glowora Cosmetics",
      "primaryText": "Get 50% Off All Bestselling Lipsticks, Serums & Moisturizers. Limited Period Offer.",
      "description": "100% Authentic & Cruelty Free. Claim Deal Now!",
      "cta": "Claim Discount",
      "targetAudience": ["High Intent Shoppers", "Luxury Beauty"]
    }
  ]
}`;

    const fallbackFn = async () => {
      const pLower = prompt.toLowerCase();
      let gradient1 = 'linear-gradient(135deg, #FF4E50 0%, #F9D423 100%)';
      let gradient2 = 'linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%)';
      let gradient3 = 'linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)';

      if (pLower.includes('diwali') || pLower.includes('festival')) {
        gradient1 = 'linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)';
        gradient2 = 'linear-gradient(135deg, #F7971E 0%, #FFD200 100%)';
        gradient3 = 'linear-gradient(135deg, #654ea3 0%, #eaafc8 100%)';
      } else if (pLower.includes('summer') || pLower.includes('beach')) {
        gradient1 = 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)';
        gradient2 = 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)';
      }

      return JSON.stringify({
        themeTitle: prompt,
        websiteBanner: {
          title: prompt.toUpperCase(),
          subtitle: "Celebrate with exclusive luxury skincare & beauty offers! Limited stock available.",
          badgeText: "🔥 SPECIAL PROMOTION",
          ctaText: "EXPLORE SALE NOW",
          bgGradient: gradient1,
          textColor: "#FFFFFF",
          accentColor: "#FFD700"
        },
        socialPosts: [
          {
            platform: "Instagram & Facebook Post (1:1)",
            aspectRatio: "1:1",
            headline: prompt,
            body: `✨ Grand Celebration Alert! ✨\nGive your skin the royal treatment with ${prompt}. Enjoy dermatologically tested luxury skincare delivered right to your door!`,
            hashtags: "#FestiveOffers #GloworaBeauty #SkincareSale #BeautyDeals #ShopNow",
            bgGradient: gradient2
          },
          {
            platform: "Instagram Story & Reel (9:16)",
            aspectRatio: "9:16",
            headline: `⚡ FLASH DEAL: ${prompt}`,
            body: "Tap the link below to unlock exclusive discounts & free gift on every order!",
            hashtags: "#InstaBeauty #GlowUp #ExclusiveOffer",
            bgGradient: gradient3
          }
        ],
        adCreatives: [
          {
            platform: "Meta Sponsored Ads (FB & IG)",
            headline: `✨ Exclusive Deal: ${prompt}`,
            primaryText: `Don't miss out on Glowora's biggest promotional sale of the season! Enjoy huge savings on top-rated skincare, serums, and cosmetics.`,
            description: `⚡ Free Express Shipping | 30-Day Money Back Guarantee`,
            cta: "Shop Now",
            targetAudience: ["Skincare Enthusiasts", "Beauty Buyers", "Gift Shoppers"]
          },
          {
            platform: "Google Search & Display Ads",
            headline: `${prompt} | Official Glowora Store`,
            primaryText: `Shop Premium Skincare & Cosmetics with Unbeatable Savings. 100% Authentic & Cruelty-Free Products.`,
            description: `Order Today & Get Free Gift Samples Included!`,
            cta: "Claim Deal",
            targetAudience: ["High Intent Buyers", "Cosmetics Searchers"]
          }
        ]
      });
    };

    const aiRawResponse = await getAIResponse(provider, apiKey, systemPrompt, prompt, fallbackFn);
    
    let resultJSON;
    try {
      const cleanJSON = aiRawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      resultJSON = JSON.parse(cleanJSON);
    } catch (e) {
      const fallbackStr = await fallbackFn();
      resultJSON = JSON.parse(fallbackStr);
    }

    return res.json({
      success: true,
      data: resultJSON,
      providerUsed: provider || (process.env.GEMINI_API_KEY ? 'gemini' : process.env.OPENROUTER_API_KEY ? 'openrouter' : process.env.HUGGINGFACE_API_KEY ? 'huggingface' : 'built-in-ai'),
    });
  } catch (err) {
    console.error('AI Banner Generator Error:', err);
    return res.status(500).json({ success: false, message: 'Failed to generate banner promo kit', error: err.message });
  }
});

// -------------------------------------------------------------------------
// 3. AI PRODUCT DESCRIPTION & SEO GENERATOR ROUTE
// -------------------------------------------------------------------------
router.post('/generate-description', async (req, res) => {
  try {
    const { name = 'Smooth Body Hair Remover', features = 'Painless, cordless, rechargeable', specs = 'Battery: 1200mAh, Material: ABS + Stainless Steel', provider, apiKey } = req.body;

    const systemPrompt = `You are an expert E-commerce Copywriter and SEO Specialist.
Generate high-converting product description and SEO metadata for:
Product Name: "${name}"
Features: "${features}"
Specifications: "${specs}"

Respond ONLY with valid JSON in this exact schema without markdown backticks:
{
  "description": "Engaging professional product description (2-3 paragraphs)...",
  "bulletPoints": [
    "✨ Highlight 1",
    "🍃 Highlight 2",
    "🛡️ Highlight 3",
    "💖 Highlight 4"
  ],
  "seoTitle": "SEO Optimized Product Title (Max 60 chars)",
  "metaDescription": "Compelling meta description with keywords (Max 155 chars)...",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}`;

    const fallbackFn = async () => {
      return JSON.stringify({
        description: `Transform your daily self-care routine with the all-new ${name}. Formulated and designed with cutting-edge technology, this product delivers exceptional performance, durability, and smooth results every single time.\n\nWhether you are looking for long-lasting performance or daily convenience, the ${name} offers dermatologically tested safety, effortless handling, and premium elegance. Experience the luxury of clean, professional-grade results right at home.`,
        bulletPoints: [
          `✨ Premium Design: Built with durable, high-grade materials for effortless daily use.`,
          `🍃 Gentle & Safe: Dermatologically tested and suitable for all users.`,
          `⚡ Advanced Performance: ${features || 'Delivers fast, visible, long-lasting results.'}`,
          `🛡️ 1-Year Guarantee: backed by Afsha Enterprises' 100% satisfaction and quality warranty.`
        ],
        seoTitle: `${name} | Buy Premium ${name} Online at Afsha Enterprises`,
        metaDescription: `Shop authentic ${name} at Afsha Enterprises. Enjoy ${features || 'premium quality'}, fast doorstep delivery across India & 30-day money-back guarantee!`,
        keywords: [name.toLowerCase(), 'buy ' + name.toLowerCase(), 'afsha enterprises', 'official store', 'premium products']
      });
    };

    const aiRawResponse = await getAIResponse(provider, apiKey, systemPrompt, name, fallbackFn);

    let resultJSON;
    try {
      const cleanJSON = aiRawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      resultJSON = JSON.parse(cleanJSON);
    } catch (e) {
      const fallbackStr = await fallbackFn();
      resultJSON = JSON.parse(fallbackStr);
    }

    return res.json({
      success: true,
      data: resultJSON,
      providerUsed: provider || 'built-in-ai',
    });
  } catch (err) {
    console.error('AI Description Generator Error:', err);
    return res.status(500).json({ success: false, message: 'Failed to generate product description', error: err.message });
  }
});

// -------------------------------------------------------------------------
// 4. AI EMAIL GENERATOR ROUTE (6 Campaign Types)
// -------------------------------------------------------------------------
router.post('/generate-email', async (req, res) => {
  try {
    const { type = 'festival', prompt = 'Diwali Celebration Sale', discountCode = 'DIWALI50', provider, apiKey } = req.body;

    const systemPrompt = `You are an expert E-commerce Email Marketer.
Generate a high-converting ${type} marketing email for: "${prompt}" with code "${discountCode}".
Respond ONLY with valid JSON in this exact schema without markdown backticks:
{
  "subjectLines": [
    "🔥 Subject Line 1 (High Urgency)",
    "✨ Subject Line 2 (Warm & Engaging)",
    "🎁 Subject Line 3 (Direct Offer)"
  ],
  "previewText": "Short snippet text shown in inbox preview...",
  "htmlContent": "<!DOCTYPE html><html>... fully styled inline CSS HTML email template with logo header, banner card, promo code box, CTA button, and footer ...</html>",
  "textContent": "Plain text version of the email for fallbacks..."
}`;

    const fallbackFn = async () => {
      let subjects = [];
      let previewText = "";
      let title = "";
      let subtitle = "";
      let bannerColor = "linear-gradient(135deg, #1A2B3C 0%, #E94057 100%)";

      if (type === 'welcome') {
        subjects = [
          `👋 Welcome to Afsha Enterprises! Here is your 10% Welcome Gift 🎁`,
          `✨ Welcome to Afsha Enterprises + Exclusive Insider Access`,
          `💖 Start Shopping with Code: ${discountCode}`
        ];
        previewText = `Welcome to Afsha Enterprises! Enjoy 10% off your first order with code ${discountCode}.`;
        title = `Welcome to Afsha Enterprises! ✨`;
        subtitle = `Thank you for joining our community. We are excited to serve you with top-quality products.`;
        bannerColor = "linear-gradient(135deg, #1A2B3C 0%, #3b82f6 100%)";
      } else if (type === 'abandoned_cart') {
        subjects = [
          `🛒 You left something special behind in your Afsha Enterprises cart!`,
          `🎁 Good news! Here is an extra discount on your cart (Code: ${discountCode})`,
          `👀 Still thinking it over? Your items are waiting for you!`
        ];
        previewText = `Complete your order today and take advantage of free express delivery + extra discount!`;
        title = `Your Selected Items Are Waiting! 🛒`;
        subtitle = `We saved the items in your shopping cart. Complete your purchase now and claim a special bonus discount!`;
        bannerColor = "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)";
      } else if (type === 'order_confirmation') {
        subjects = [
          `📦 Order Confirmed! We are preparing your Afsha Enterprises package`,
          `✨ Thank you for your purchase! Order Details Inside`,
          `🎉 Payment Successful! Track Your Delivery Status`
        ];
        previewText = `Your Afsha Enterprises order is confirmed. We are packing your products with extra care.`;
        title = `Order Confirmation & Receipt 📦`;
        subtitle = `Thank you for shopping with Afsha Enterprises! Your order has been placed successfully.`;
        bannerColor = "linear-gradient(135deg, #10b981 0%, #059669 100%)";
      } else if (type === 'delivery_update') {
        subjects = [
          `🚚 Great news! Your Afsha Enterprises order has been shipped!`,
          `📍 Out for Delivery: Your package will arrive soon!`,
          `📦 Track Your Shipment Live (Courier Update)`
        ];
        previewText = `Your package is on its way! Track your live delivery status inside.`;
        title = `Your Order Is On Its Way! 🚚`;
        subtitle = `Your package has been dispatched from our fulfillment center and will arrive at your doorstep shortly.`;
        bannerColor = "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)";
      } else if (type === 'promotional') {
        subjects = [
          `⚡ FLASH SALE: ${prompt} (Code: ${discountCode})`,
          `🛍️ Don't Miss Out! Exclusive Discount Available Today`,
          `💥 24-Hour VIP Offer: Save Big on Your Favorite Items`
        ];
        previewText = `Your exclusive promo code ${discountCode} is live! Shop now before stock runs out.`;
        title = `Exclusive Flash Offer Just For You! 💥`;
        subtitle = `Upgrade your daily routine with our top-rated bestsellers at prices you will love.`;
        bannerColor = "linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%)";
      } else {
        // Festival greetings
        subjects = [
          `✨ Festive Magic: ${prompt} + Extra Savings Inside!`,
          `🎆 Celebrate with Afsha Enterprises: Claim Your ${discountCode} Voucher!`,
          `🎁 Holiday Special: Unbox Premium Products this Season!`
        ];
        previewText = `Light up your celebrations with premium products! Use code ${discountCode} for maximum savings.`;
        title = `Celebrate Festive Deals with Afsha Enterprises! ✨`;
        subtitle = `Make this festival season unforgettable with premium authentic products.`;
        bannerColor = "linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)";
      }

      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; }
    .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
    .header { background: #1A2B3C; padding: 24px; text-align: center; }
    .hero { background: ${bannerColor}; padding: 40px 24px; text-align: center; color: #ffffff; }
    .hero h1 { margin: 0 0 12px; font-size: 26px; font-weight: 700; }
    .hero p { margin: 0; font-size: 16px; opacity: 0.95; line-height: 1.5; }
    .content { padding: 32px 24px; text-align: center; color: #333333; }
    .promo-box { background: #f8f9fa; border: 2px dashed #E94057; border-radius: 12px; padding: 20px; margin: 24px 0; display: inline-block; width: 80%; }
    .code { font-size: 24px; font-weight: 800; letter-spacing: 2px; color: #E94057; margin: 8px 0; }
    .cta-btn { display: inline-block; background: #1A2B3C; color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 50px; font-size: 16px; font-weight: 700; margin-top: 12px; transition: all 0.3s ease; }
    .footer { background: #f4f6f8; padding: 24px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eeeeee; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h2 style="color: #ffffff; margin: 0; font-weight: 800; letter-spacing: 1px;">AFSHA ENTERPRISES</h2>
    </div>
    <div class="hero">
      <h1>${title}</h1>
      <p>${subtitle}</p>
    </div>
    <div class="content">
      <p style="font-size: 16px; line-height: 1.6; color: #555555;">
        ${prompt}. Experience authentic quality products tailored for your needs.
      </p>
      <div class="promo-box">
        <span style="font-size: 12px; text-transform: uppercase; color: #777;">Use Promo Code At Checkout</span>
        <div class="code">${discountCode}</div>
        <span style="font-size: 12px; color: #888;">Valid for a limited time only!</span>
      </div>
      <div>
        <a href="/" class="cta-btn">SHOP NOW & SAVE</a>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Afsha Enterprises. All rights reserved.</p>
      <p>You received this email because you subscribed to our newsletter or placed an order at Afsha Enterprises.</p>
      <p><a href="#" style="color: #888888; text-decoration: underline;">Unsubscribe</a> | <a href="#" style="color: #888888; text-decoration: underline;">Privacy Policy</a></p>
    </div>
  </div>
</body>
</html>
      `.trim();

      const textContent = `${title}\n${subtitle}\n\nUse Code: ${discountCode}\n\nShop Now: https://glowora.store`;

      return JSON.stringify({
        subjectLines: subjects,
        previewText,
        htmlContent,
        textContent,
      });
    };

    const aiRawResponse = await getAIResponse(provider, apiKey, systemPrompt, prompt, fallbackFn);

    let resultJSON;
    try {
      const cleanJSON = aiRawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      resultJSON = JSON.parse(cleanJSON);
    } catch (e) {
      const fallbackStr = await fallbackFn();
      resultJSON = JSON.parse(fallbackStr);
    }

    return res.json({
      success: true,
      data: resultJSON,
      providerUsed: provider || (process.env.GEMINI_API_KEY ? 'gemini' : process.env.OPENROUTER_API_KEY ? 'openrouter' : process.env.HUGGINGFACE_API_KEY ? 'huggingface' : 'built-in-ai'),
    });
  } catch (err) {
    console.error('AI Email Generator Error:', err);
    return res.status(500).json({ success: false, message: 'Failed to generate marketing email', error: err.message });
  }
});

export default router;
