import { useState } from 'react';
import { Mail, Sparkles, Gift, Tag, ShoppingCart, Copy, Check, Send, RefreshCw, Eye, Code } from 'lucide-react';
import './AdminAIEmailGenerator.css';

export default function AdminAIEmailGenerator() {
  const [emailType, setEmailType] = useState('festival'); // 'festival' | 'offer' | 'abandoned_cart'
  const [prompt, setPrompt] = useState('Diwali Festival Special Sale');
  const [discountCode, setDiscountCode] = useState('DIWALI50');
  const [provider, setProvider] = useState('auto');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(0);
  const [viewMode, setViewMode] = useState('preview'); // 'preview' | 'html' | 'text'
  const [copiedStatus, setCopiedStatus] = useState(null);

  const [aiData, setAiData] = useState({
    subjectLines: [
      "✨ Festive Magic: Diwali Special Sale + Flat 50% Off!",
      "🎆 Celebrate with Afsha Enterprises: Claim Your DIWALI50 Voucher!",
      "🎁 Holiday Special: Unbox Radiance with Exclusive Discounts"
    ],
    previewText: "Light up your celebrations with premium products! Use code DIWALI50 for maximum savings.",
    htmlContent: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; }
    .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
    .header { background: #E94057; padding: 24px; text-align: center; }
    .hero { background: linear-gradient(135deg, #E94057 0%, #FF758C 100%); padding: 40px 24px; text-align: center; color: #ffffff; }
    .hero h1 { margin: 0 0 12px; font-size: 26px; font-weight: 700; }
    .hero p { margin: 0; font-size: 16px; opacity: 0.95; line-height: 1.5; }
    .content { padding: 32px 24px; text-align: center; color: #333333; }
    .promo-box { background: #fff0f5; border: 2px dashed #E94057; border-radius: 12px; padding: 20px; margin: 24px 0; display: inline-block; width: 80%; }
    .code { font-size: 24px; font-weight: 800; letter-spacing: 2px; color: #E94057; margin: 8px 0; }
    .cta-btn { display: inline-block; background: #E94057; color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 50px; font-size: 16px; font-weight: 700; margin-top: 12px; }
    .footer { background: #f4f6f8; padding: 24px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eeeeee; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h2 style="color: #ffffff; margin: 0; font-weight: 800; letter-spacing: 1px;">AFSHA ENTERPRISES</h2>
    </div>
    <div class="hero">
      <h1>Celebrate Festive Deals with Afsha Enterprises! ✨</h1>
      <p>Make this festival season unforgettable with authentic premium products.</p>
    </div>
    <div class="content">
      <p style="font-size: 16px; line-height: 1.6; color: #555555;">
        Enjoy flat 50% discount across our entire luxury collection!
      </p>
      <div class="promo-box">
        <span style="font-size: 12px; text-transform: uppercase; color: #777;">Use Promo Code At Checkout</span>
        <div class="code">DIWALI50</div>
        <span style="font-size: 12px; color: #888;">Valid for a limited time only!</span>
      </div>
      <div>
        <a href="/" class="cta-btn">SHOP FESTIVE SALE</a>
      </div>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Afsha Enterprises. All rights reserved.</p>
      <p><a href="#" style="color: #888888;">Unsubscribe</a> | <a href="#" style="color: #888888;">Privacy Policy</a></p>
    </div>
  </div>
</body>
</html>`,
    textContent: `Celebrate Festive Deals with Afsha Enterprises!\n\nUse Code: DIWALI50\n\nShop Now at Afsha Enterprises`
  });

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: emailType,
          prompt,
          discountCode,
          provider: provider === 'auto' ? undefined : provider,
          apiKey: apiKey || undefined,
        }),
      });

      const data = await res.json();

      if (data.success && data.data) {
        setAiData(data.data);
        setSelectedSubject(0);
      } else {
        throw new Error(data.message || 'Failed to generate email');
      }
    } catch (err) {
      alert(`AI Email Generation Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedStatus(key);
    setTimeout(() => setCopiedStatus(null), 2000);
  };

  return (
    <div className="ai-email-page">
      <div className="ai-email-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1>
              <img src="/logo.png" alt="Afsha Enterprises" style={{ height: 38, objectFit: 'contain', verticalAlign: 'middle', marginRight: 12 }} />
              AI Email Marketing Studio <span className="ai-badge-sparkle"><Sparkles size={13} inline /> AI Powered</span>
            </h1>
            <p>Generate high-converting Welcome Emails, Festival Emails, Abandoned Cart, Delivery Updates & Offer campaigns in seconds.</p>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ background: '#fff0f5', color: '#802636', border: '1px solid #ffd1dc', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800 }}>
              ⚡ Instant AI Copy
            </span>
            <span style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800 }}>
              🛡️ Spam-Safe HTML
            </span>
            <span style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800 }}>
              🎁 6 Campaign Types
            </span>
          </div>
        </div>
      </div>

      {/* Campaign Type Selector */}
      <div className="ai-email-type-selector" style={{ flexWrap: 'wrap' }}>
        <button
          className={`ai-type-btn ${emailType === 'welcome' ? 'active' : ''}`}
          onClick={() => {
            setEmailType('welcome');
            setPrompt('Welcome to Glowora');
            setDiscountCode('WELCOME10');
          }}
        >
          <Sparkles size={16} /> Welcome Email
        </button>
        <button
          className={`ai-type-btn ${emailType === 'abandoned_cart' ? 'active' : ''}`}
          onClick={() => {
            setEmailType('abandoned_cart');
            setPrompt('Abandoned Cart Reminder');
            setDiscountCode('COMEBACK10');
          }}
        >
          <ShoppingCart size={16} /> Abandoned Cart
        </button>
        <button
          className={`ai-type-btn ${emailType === 'order_confirmation' ? 'active' : ''}`}
          onClick={() => {
            setEmailType('order_confirmation');
            setPrompt('Order Confirmation Receipt');
            setDiscountCode('THANKYOU');
          }}
        >
          <Mail size={16} /> Order Confirmation
        </button>
        <button
          className={`ai-type-btn ${emailType === 'delivery_update' ? 'active' : ''}`}
          onClick={() => {
            setEmailType('delivery_update');
            setPrompt('Order Dispatched Shipping Update');
            setDiscountCode('EXPRESS');
          }}
        >
          <Tag size={16} /> Delivery Updates
        </button>
        <button
          className={`ai-type-btn ${emailType === 'promotional' ? 'active' : ''}`}
          onClick={() => {
            setEmailType('promotional');
            setPrompt('Flash Sale 40% Off');
            setDiscountCode('FLASH40');
          }}
        >
          <Tag size={16} /> Promotional Campaigns
        </button>
        <button
          className={`ai-type-btn ${emailType === 'festival' ? 'active' : ''}`}
          onClick={() => {
            setEmailType('festival');
            setPrompt('Diwali Festival Special Sale');
            setDiscountCode('DIWALI50');
          }}
        >
          <Gift size={16} /> Festival Greetings
        </button>
      </div>

      {/* Form Controls */}
      <div className="ai-email-form-card">
        <div className="ai-email-grid">
          <div className="ai-field-group">
            <label>Campaign Subject / Theme</label>
            <input
              type="text"
              className="ai-input-text"
              placeholder="e.g. Diwali Special, Flash Sale 50%, Abandoned Cart Bonus"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="ai-field-group">
            <label>Promo Code</label>
            <input
              type="text"
              className="ai-input-text"
              placeholder="e.g. DIWALI50"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
            />
          </div>

          <div className="ai-field-group">
            <label>AI Engine</label>
            <select
              className="ai-input-text"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
            >
              <option value="auto">Auto (Smart Fallback)</option>
              <option value="gemini">Google Gemini API</option>
              <option value="openrouter">OpenRouter API</option>
              <option value="huggingface">HuggingFace API</option>
            </select>
          </div>

          <button
            className="ai-btn-generate"
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {isLoading ? 'Generating Email...' : 'Generate AI Email'}
          </button>
        </div>
      </div>

      {/* AI Subject Lines */}
      {aiData?.subjectLines && (
        <div className="ai-subjects-box">
          <h3><Mail size={16} color="#E94057" /> High-Converting Subject Line Suggestions:</h3>
          {aiData.subjectLines.map((subj, idx) => (
            <div
              key={idx}
              className={`ai-subject-item ${selectedSubject === idx ? 'selected' : ''}`}
              onClick={() => setSelectedSubject(idx)}
            >
              <span>{subj}</span>
              <button
                className="ai-chip"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(subj, `subj_${idx}`);
                }}
              >
                {copiedStatus === `subj_${idx}` ? <Check size={14} /> : <Copy size={14} />}
                Copy Subject
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Preview Container */}
      <div className="ai-email-preview-container">
        <div className="ai-preview-header">
          <div className="ai-preview-title">
            Subject: <strong>{aiData?.subjectLines?.[selectedSubject]}</strong>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`ai-chip ${viewMode === 'preview' ? 'active' : ''}`}
              onClick={() => setViewMode('preview')}
            >
              <Eye size={14} /> Visual Preview
            </button>
            <button
              className={`ai-chip ${viewMode === 'html' ? 'active' : ''}`}
              onClick={() => setViewMode('html')}
            >
              <Code size={14} /> HTML Code
            </button>
            <button
              className="ai-chip"
              style={{ background: '#1A2B3C', color: '#fff' }}
              onClick={() => handleCopy(aiData?.htmlContent || '', 'html_content')}
            >
              {copiedStatus === 'html_content' ? <Check size={14} /> : <Copy size={14} />}
              Copy HTML Code
            </button>
          </div>
        </div>

        {viewMode === 'preview' ? (
          <iframe
            className="ai-email-iframe"
            srcDoc={aiData?.htmlContent}
            title="AI Email Preview"
          />
        ) : (
          <textarea
            style={{
              width: '100%',
              height: '500px',
              padding: '16px',
              fontFamily: 'monospace',
              fontSize: '13px',
              border: 'none',
              background: '#0f172a',
              color: '#38bdf8',
            }}
            readOnly
            value={aiData?.htmlContent}
          />
        )}
      </div>
    </div>
  );
}
