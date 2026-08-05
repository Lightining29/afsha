import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

const router = express.Router();

// Helper: Call Google Gemini High Models API
async function callGemini(apiKey, systemPrompt, userPrompt) {
  const geminiModels = ['gemini-2.5-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'];
  let lastErr = null;

  for (const model of geminiModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nUser Request: ${userPrompt}` }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
          },
        }),
      });

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

  throw lastErr || new Error('Gemini API calls failed across high models');
}

// Helper: Call OpenRouter Flagship High Models API (GPT-4o, Claude 3.5 Sonnet, DeepSeek R1, Llama 3.3 70B)
async function callOpenRouter(apiKey, systemPrompt, userPrompt) {
  const openRouterModels = [
    'openai/gpt-4o',
    'anthropic/claude-3.5-sonnet',
    'deepseek/deepseek-r1',
    'google/gemini-2.0-flash-001',
    'meta-llama/llama-3.3-70b-instruct',
    'openai/gpt-4o-mini',
  ];
  let lastErr = null;

  for (const model of openRouterModels) {
    try {
      const url = 'https://openrouter.ai/api/v1/chat/completions';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://glowora.store',
          'X-Title': 'Glowora High AI Suite',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) return text;
      } else {
        const errText = await response.text();
        lastErr = new Error(`OpenRouter ${model} (${response.status}): ${errText}`);
      }
    } catch (e) {
      lastErr = e;
    }
  }

  throw lastErr || new Error('OpenRouter API calls failed across high models');
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

  const effProvider = provider && provider !== 'auto'
    ? provider
    : process.env.GEMINI_API_KEY
    ? 'gemini'
    : process.env.OPENROUTER_API_KEY
    ? 'openrouter'
    : process.env.HUGGINGFACE_API_KEY
    ? 'huggingface'
    : 'fallback';

  if (effProvider === 'gemini' && geminiKey) {
    try {
      return await callGemini(geminiKey, systemPrompt, userPrompt);
    } catch (err) {
      console.warn('Gemini high model call failed, trying fallbacks:', err.message);
    }
  }

  if (effProvider === 'openrouter' && openRouterKey) {
    try {
      return await callOpenRouter(openRouterKey, systemPrompt, userPrompt);
    } catch (err) {
      console.warn('OpenRouter high model call failed, trying fallbacks:', err.message);
    }
  }

  if (effProvider === 'huggingface' && hfKey) {
    try {
      return await callHuggingFace(hfKey, `${systemPrompt}\n${userPrompt}`);
    } catch (err) {
      console.warn('HuggingFace high model call failed, trying fallbacks:', err.message);
    }
  }

  return await fallbackFn();
}

// -------------------------------------------------------------------------
// 1. AI CHATBOT ROUTE (24/7 Support with Human Escalation)
// -------------------------------------------------------------------------
router.post('/chat', async (req, res) => {
  try {
    const { message = '', conversationHistory = [], userId, provider, apiKey } = req.body;
    const lower = message.toLowerCase().trim();

    // Check query intent across 8 core topics
    const isHumanRequest = lower.includes('human') || lower.includes('agent') || lower.includes('person') || lower.includes('representative') || lower.includes('talk to someone') || lower.includes('support team') || lower.includes('call');
    const isOrderQuery = lower.includes('order') || lower.includes('status') || lower.includes('track') || /glw-[a-z0-9-]+/i.test(lower);
    const isShippingQuery = lower.includes('ship') || lower.includes('delivery') || lower.includes('pincode') || lower.includes('how long') || lower.includes('courier');
    const isReturnQuery = lower.includes('return') || lower.includes('exchange') || lower.includes('policy');
    const isRefundQuery = lower.includes('refund') || lower.includes('money back') || lower.includes('bank') || lower.includes('wallet');
    const isWarrantyQuery = lower.includes('warranty') || lower.includes('guarantee') || lower.includes('damage') || lower.includes('broken') || lower.includes('defective');
    const isPaymentQuery = lower.includes('payment') || lower.includes('razorpay') || lower.includes('cod') || lower.includes('card') || lower.includes('upi') || lower.includes('pay');
    const isCouponQuery = lower.includes('coupon') || lower.includes('code') || lower.includes('discount') || lower.includes('promo') || lower.includes('voucher');
    const isProductQuery = lower.includes('product') || lower.includes('buy') || lower.includes('price') || lower.includes('stock') || lower.includes('recommend') || lower.includes('skincare') || lower.includes('makeup') || lower.includes('best') || lower.includes('ingredient');

    const shouldEscalate = isHumanRequest || lower.includes('complaint') || lower.includes('urgent') || lower.includes('fraud');

    let contextData = '';

    // Order lookup
    if (isOrderQuery) {
      const matchedOrderNum = message.match(/GLW-[A-Z0-9-]+/i);
      let order = null;

      if (matchedOrderNum) {
        order = await Order.findOne({ orderNumber: new RegExp(matchedOrderNum[0], 'i') }).populate('items.product');
      } else if (userId) {
        order = await Order.findOne({ user: userId }).sort({ createdAt: -1 }).populate('items.product');
      } else {
        const latestOrders = await Order.find({}).sort({ createdAt: -1 }).limit(1);
        if (latestOrders.length > 0) order = latestOrders[0];
      }

      if (order) {
        const itemNames = order.items.map(i => `${i.name} (x${i.quantity})`).join(', ');
        contextData += `\n[Database Context: Found Order #${order.orderNumber}. Status: ${order.status.toUpperCase()}. Total: ₹${order.total}. Items: ${itemNames}. Delivery Estimate: 3 business days.]`;
      } else {
        contextData += `\n[Database Context: No specific order ID provided or found. Ask customer for their Order ID starting with GLW-.]`;
      }
    }

    // Product search lookup
    if (isProductQuery || lower.length > 2) {
      const keywords = lower.split(' ').filter(w => w.length > 3 && !['what', 'where', 'when', 'how', 'this', 'that', 'have'].includes(w));
      let products = [];

      if (keywords.length > 0) {
        const searchRegex = new RegExp(keywords.join('|'), 'i');
        products = await Product.find({ $or: [{ name: searchRegex }, { description: searchRegex }] }).limit(4);
      }
      if (products.length === 0) {
        products = await Product.find({ bestseller: true }).limit(4);
      }

      if (products.length > 0) {
        const prodList = products.map(p => `- ${p.name} (Price: ₹${p.price}, Rating: ⭐${p.rating || 4.5}, In Stock: ${p.stockQuantity > 0 ? 'Yes' : 'No'}, Slug: /product/${p.slug})`).join('\n');
        contextData += `\n[Database Context: Available Products in Store:\n${prodList}]`;
      }
    }

    const systemPrompt = `You are "AfshaBot", the friendly 24/7 AI Customer Support Specialist for Afsha Enterprises e-commerce.
Assist customers across 8 topics: Orders, Shipping, Returns, Refunds, Warranty, Payments, Coupons, Product Questions.
If confidence is low or customer asks for a human, offer to escalate to a live support agent.
${contextData}`;

    const fallbackFn = async () => {
      if (shouldEscalate) {
        return `### 👨‍💼 Connect with Human Support\n\nI understand you would like to speak directly with a live support representative! \n\nI have created a high-priority support ticket for our customer care team. You can also reach our live desk directly at **support@afshaenterprises.com** or call **+91 96071 11312** (Mon-Sat, 9AM-8PM).`;
      }

      if (isOrderQuery) {
        if (contextData.includes('Found Order #')) {
          const match = contextData.match(/Found Order #(.*)\. Status: (.*)\. Total: (.*)\. Items: (.*)\./);
          if (match) {
            return `### 📦 Order Status Update\n\nYour order **#${match[1]}** is currently **${match[2]}**.\n\n- **Items:** ${match[4]}\n- **Total Paid:** ${match[3]}\n- **Estimated Delivery:** 3 Business Days via Express Courier.\n\nNeed to update your shipping address or change items? Let me know!`;
          }
        }
        return `### 📦 Order Lookup\n\nI can check your order status right away! Please share your **Order ID** (e.g. \`GLW-XXXXXX\`) or login to your account to view live tracking updates.`;
      }

      if (isShippingQuery) {
        return `### 🚚 Shipping & Delivery Timelines\n\n- **Standard Delivery:** 3-5 business days across India (FREE on orders > ₹499).\n- **Express Shipping:** 1-2 business days in select metro cities.\n- **Order Tracking:** Live SMS & Email tracking link sent automatically upon dispatch!`;
      }

      if (isReturnQuery) {
        return `### 🔄 30-Day Return Policy\n\n- **30-Day Guarantee:** Return unopened or gently used items within 30 days.\n- **Free Pickup:** We arrange doorstep pickup from your location.\n- **Easy Start:** Go to **Account > Orders** and tap *Return Item*.`;
      }

      if (isRefundQuery) {
        return `### 💳 Refund Processing\n\n- **Refund Timeline:** Money is credited back to your original payment method (Bank/UPI/Card) within 3-5 business days after product pickup.\n- **Instant Credit:** Wallet/Store Credit is issued instantly upon approval!`;
      }

      if (isWarrantyQuery) {
        return `### 🛡️ Product Warranty & Guarantee\n\n- **100% Authentic:** All Afsha Enterprises products come with a 1-year authentic quality guarantee.\n- **Defective/Damaged:** If an item arrives damaged, we provide instant 100% free replacement! Contact us within 48 hours of delivery.`;
      }

      if (isPaymentQuery) {
        return `### 💳 Payment Methods & Security\n\n- We accept **Razorpay (Credit/Debit Cards, NetBanking)**, **UPI (Google Pay, PhonePe, Paytm)**, and **Cash on Delivery (COD)**.\n- All online transactions use 256-bit SSL encryption.`;
      }

      if (isCouponQuery) {
        return `### 🎟️ Coupons & Discounts\n\n- Use code **WELCOME10** for 10% off your first purchase!\n- Use code **DIWALI50** for flat 50% off on festive collections.\n- Enter your promo code at checkout!`;
      }

      if (isProductQuery || contextData.includes('Available Products')) {
        if (contextData.includes('Available Products')) {
          const lines = contextData.split('\n').filter(l => l.startsWith('- '));
          if (lines.length > 0) {
            const formatted = lines.map(l => {
              const nameMatch = l.match(/- (.*?) \(Price: (.*?), Rating: (.*?), In Stock: (.*?), Slug: (.*?)\)/);
              if (nameMatch) {
                return `- **[${nameMatch[1]}](${nameMatch[5]})** — ${nameMatch[2]} | ${nameMatch[3]} ⭐ (${nameMatch[4] === 'Yes' ? 'In Stock' : 'Out of Stock'})`;
              }
              return l;
            }).join('\n');
            return `### 🛍️ Featured Afsha Enterprises Products\n\nHere are top product recommendations curated for you:\n\n${formatted}\n\nFeel free to ask for specific product features or recommendations!`;
          }
        }
        return `### 🛍️ Product Information\n\nAfsha Enterprises offers 100% authentic premium quality products! Tell me what product or category you're looking for!`;
      }

      return `Hello! 👋 I'm **AfshaBot**, your 24/7 AI Assistant. \n\nI can help you with:\n- 📦 **Orders** & Tracking\n- 🚚 **Shipping** & Timelines\n- 🔄 **Returns** & 💳 **Refunds**\n- 🛡️ **Warranty** & 💳 **Payments**\n- 🎟️ **Coupons** & 🛍️ **Product Questions**\n\nHow can I help you today?`;
    };

    const reply = await getAIResponse(provider, apiKey, systemPrompt, message, fallbackFn);

    return res.json({
      success: true,
      message: reply,
      escalateToHuman: shouldEscalate,
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
