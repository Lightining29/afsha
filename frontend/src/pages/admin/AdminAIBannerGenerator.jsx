import { useState } from 'react';
import { Sparkles, Image as ImageIcon, Share2, Target, Copy, Check, Download, Send, RefreshCw, Key } from 'lucide-react';
import './AdminAIBannerGenerator.css';

export default function AdminAIBannerGenerator() {
  const [prompt, setPrompt] = useState('Diwali Sale 50% Off');
  const [provider, setProvider] = useState('auto');
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('website'); // 'website' | 'social' | 'ads'
  const [copiedId, setCopiedId] = useState(null);
  const [publishStatus, setPublishStatus] = useState(null);

  const [aiData, setAiData] = useState({
    themeTitle: "Diwali Festival Grand Sale",
    websiteBanner: {
      title: "DIWALI FESTIVAL 50% OFF",
      subtitle: "Light up your natural beauty with premium dermatologically proven cosmetics & skincare.",
      badgeText: "✨ FESTIVE CELEBRATION",
      ctaText: "SHOP THE SALE",
      bgGradient: "linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)",
      textColor: "#FFFFFF",
      accentColor: "#FFD700"
    },
    socialPosts: [
      {
        platform: "Instagram & Facebook Post (1:1)",
        aspectRatio: "1:1",
        headline: "Diwali Sale 50% Off ✨",
        body: "Brighten your festive season with Glowora's biggest beauty celebration! Enjoy flat 50% off storewide on all luxury serums, lipsticks, and hydration creams.",
        hashtags: "#DiwaliSale #GloworaBeauty #FestiveGlow #SkincareSale #BeautyDeals",
        bgGradient: "linear-gradient(135deg, #F7971E 0%, #FFD200 100%)"
      },
      {
        platform: "Instagram Story & Reel (9:16)",
        aspectRatio: "9:16",
        headline: "⚡ FLASH DIWALI OFFER",
        body: "Tap to claim your 50% discount voucher + free express doorstep shipping!",
        hashtags: "#InstaBeauty #DiwaliSpecial #LimitedStock",
        bgGradient: "linear-gradient(135deg, #8A2387 0%, #E94057 50%, #F27121 100%)"
      }
    ],
    adCreatives: [
      {
        platform: "Meta Sponsored Ads (FB & IG)",
        headline: "Light Up Your Beauty This Diwali! ✨ Flat 50% Off",
        primaryText: "Give your skin the festive radiance it deserves. Dermatologically tested, 100% cruelty-free luxury skincare.",
        description: "⚡ Free Express Shipping on Orders Above ₹499",
        cta: "Shop Now",
        targetAudience: ["Festive Shoppers", "Cosmetics Buyers", "Skincare Lovers"]
      },
      {
        platform: "Google Search & Display Ads",
        headline: "Official Diwali Sale | Glowora Cosmetics",
        primaryText: "Flat 50% Off All Bestselling Serums & Lipsticks. Limited Festive Stock.",
        description: "Claim Free Gift Samples with Every Order!",
        cta: "Claim 50% Off",
        targetAudience: ["High Intent Beauty Buyers", "Gift Shoppers"]
      }
    ]
  });

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    setPublishStatus(null);

    try {
      const res = await fetch('/api/ai/generate-banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          provider: provider === 'auto' ? undefined : provider,
          apiKey: apiKey || undefined,
        }),
      });

      const data = await res.json();

      if (data.success && data.data) {
        setAiData(data.data);
      } else {
        throw new Error(data.message || 'Failed to generate banner kit');
      }
    } catch (err) {
      alert(`AI Generation Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePublishToStore = async () => {
    setPublishStatus('publishing');
    try {
      // Direct integration to publish generated banner to store promo banners
      const res = await fetch('/api/admin/promo-banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: aiData.websiteBanner.title,
          subtitle: aiData.websiteBanner.subtitle,
          badgeText: aiData.websiteBanner.badgeText,
          ctaText: aiData.websiteBanner.ctaText,
          bgGradient: aiData.websiteBanner.bgGradient,
          isActive: true,
        }),
      });

      if (res.ok) {
        setPublishStatus('published');
        setTimeout(() => setPublishStatus(null), 3000);
      } else {
        throw new Error('Failed to save to promo banner database');
      }
    } catch (err) {
      alert(`Publishing Error: ${err.message}`);
      setPublishStatus(null);
    }
  };

  return (
    <div className="ai-banner-page">
      <div className="ai-banner-header">
        <h1>
          AI Banner & Campaign Generator <span className="ai-badge-sparkle"><Sparkles size={13} inline /> AI Powered</span>
        </h1>
        <p>Input your promotion idea (e.g. Diwali Sale 50% Off) to automatically generate website banners, social posts, and ad creatives using HuggingFace, OpenRouter, or Gemini.</p>
      </div>

      {/* Input Control Card */}
      <div className="ai-banner-form-card">
        <div className="ai-form-grid">
          <div className="ai-field-group">
            <label>Promotional Campaign Topic / Offer</label>
            <input
              type="text"
              className="ai-input-text"
              placeholder="e.g. Diwali Sale 50% Off, Summer Flash Sale, BOGO Free"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="ai-field-group">
            <label>AI Provider Engine</label>
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

          <div className="ai-field-group">
            <label><Key size={13} /> Custom API Key (Optional)</label>
            <input
              type="password"
              className="ai-input-text"
              placeholder="Paste Key (or use .env)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>

          <button
            className="ai-btn-generate"
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} />}
            {isLoading ? 'Generating Assets...' : 'Generate AI Assets'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="ai-results-tabs">
        <button
          className={`ai-tab-btn ${activeTab === 'website' ? 'active' : ''}`}
          onClick={() => setActiveTab('website')}
        >
          <ImageIcon size={18} /> Website Banner
        </button>
        <button
          className={`ai-tab-btn ${activeTab === 'social' ? 'active' : ''}`}
          onClick={() => setActiveTab('social')}
        >
          <Share2 size={18} /> Social Media Posts
        </button>
        <button
          className={`ai-tab-btn ${activeTab === 'ads' ? 'active' : ''}`}
          onClick={() => setActiveTab('ads')}
        >
          <Target size={18} /> Ad Creatives
        </button>
      </div>

      {/* Tab 1: Website Banner */}
      {activeTab === 'website' && aiData?.websiteBanner && (
        <div>
          <div
            className="ai-banner-canvas-preview"
            style={{ background: aiData.websiteBanner.bgGradient }}
          >
            <div className="ai-banner-overlay-badge">
              {aiData.websiteBanner.badgeText}
            </div>
            <h2 className="ai-banner-title">{aiData.websiteBanner.title}</h2>
            <p className="ai-banner-subtitle">{aiData.websiteBanner.subtitle}</p>
            <div className="ai-banner-cta-btn">{aiData.websiteBanner.ctaText}</div>
          </div>

          <div className="ai-banner-actions-row">
            <button
              className="ai-btn-generate"
              style={{ background: '#1A2B3C' }}
              onClick={handlePublishToStore}
              disabled={publishStatus === 'publishing' || publishStatus === 'published'}
            >
              {publishStatus === 'published' ? <Check size={18} /> : <Send size={18} />}
              {publishStatus === 'published' ? 'Published to Store Banners!' : publishStatus === 'publishing' ? 'Publishing...' : 'Publish to Store Banners'}
            </button>
            <button
              className="ai-chip"
              style={{ padding: '12px 20px', fontSize: '14px' }}
              onClick={() => handleCopy(JSON.stringify(aiData.websiteBanner, null, 2), 'banner_json')}
            >
              {copiedId === 'banner_json' ? <Check size={16} /> : <Copy size={16} />}
              Copy JSON Code
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Social Media Posts */}
      {activeTab === 'social' && aiData?.socialPosts && (
        <div className="ai-social-grid">
          {aiData.socialPosts.map((post, idx) => (
            <div key={idx} className="ai-social-card">
              <div
                className="ai-social-graphic-box"
                style={{ background: post.bgGradient }}
              >
                <span className="ai-banner-overlay-badge" style={{ fontSize: '11px' }}>
                  {post.platform}
                </span>
                <h3>{post.headline}</h3>
              </div>

              <div className="ai-social-caption-body">
                <p className="ai-social-caption-text">{post.body}</p>
                <p className="ai-hashtags">{post.hashtags}</p>
                <button
                  className="ai-chip"
                  style={{ width: 'fit-content', marginTop: '8px' }}
                  onClick={() => handleCopy(`${post.headline}\n\n${post.body}\n\n${post.hashtags}`, `social_${idx}`)}
                >
                  {copiedId === `social_${idx}` ? <Check size={14} /> : <Copy size={14} />}
                  Copy Post Caption & Tags
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Ad Creatives */}
      {activeTab === 'ads' && aiData?.adCreatives && (
        <div className="ai-ads-grid">
          {aiData.adCreatives.map((ad, idx) => (
            <div key={idx} className="ai-ad-card">
              <div className="ai-ad-header">
                <span className="ai-ad-platform">{ad.platform}</span>
                <span className="ai-ad-cta-badge">{ad.cta}</span>
              </div>
              <h3 className="ai-ad-headline">{ad.headline}</h3>
              <p className="ai-ad-text">{ad.primaryText}</p>
              <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px' }}>{ad.description}</p>
              
              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', display: 'block', marginBottom: '6px' }}>Recommended Targeting:</span>
                <div className="ai-audience-tags">
                  {ad.targetAudience?.map((tag, tIdx) => (
                    <span key={tIdx} className="ai-audience-tag">#{tag}</span>
                  ))}
                </div>
              </div>

              <button
                className="ai-chip"
                onClick={() => handleCopy(`HEADLINE: ${ad.headline}\n\nBODY: ${ad.primaryText}\n\nDESCRIPTION: ${ad.description}\nCTA: ${ad.cta}`, `ad_${idx}`)}
              >
                {copiedId === `ad_${idx}` ? <Check size={14} /> : <Copy size={14} />}
                Copy Ad Copy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
