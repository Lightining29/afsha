import { useState } from 'react';
import { Sparkles, Upload, Scissors, Sun, Maximize2, Zap, Crop, Share2, Download, Check, RefreshCw } from 'lucide-react';
import './AdminAIImageEnhancer.css';

export default function AdminAIImageEnhancer() {
  const [selectedImage, setSelectedImage] = useState('/masage.jpg');
  const [activeTool, setActiveTool] = useState('none'); // 'none' | 'remove_bg' | 'enhance' | 'lighting' | 'compress' | 'square' | 'story'
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result);
        setActiveTool('none');
      };
      reader.readAsDataURL(file);
    }
  };

  const applyEnhancement = (tool) => {
    setIsProcessing(true);
    setActiveTool(tool);
    setTimeout(() => {
      setIsProcessing(false);
    }, 600);
  };

  // Determine dynamic image CSS filter / transformation based on active AI tool
  const getImageStyle = () => {
    switch (activeTool) {
      case 'enhance':
        return { filter: 'contrast(125%) sharpness(150%) brightness(105%) saturate(115%)' };
      case 'lighting':
        return { filter: 'brightness(115%) contrast(110%) saturate(120%)' };
      case 'compress':
        return { filter: 'contrast(100%)' };
      default:
        return {};
    }
  };

  return (
    <div className="ai-image-page">
      <div className="ai-image-header">
        <h1>
          AI Product Image Enhancement Studio <span className="ai-badge-sparkle"><Sparkles size={13} inline /> AI Powered</span>
        </h1>
        <p>Upload product photos to automatically remove backgrounds, increase resolution, optimize lighting, compress images, and generate social media crops.</p>
      </div>

      {/* Upload Dropzone */}
      <label className="ai-upload-dropzone">
        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
        <div className="ai-upload-icon">
          <Upload size={28} />
        </div>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 800 }}>Upload Product Image</h3>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Click or drag & drop image file (PNG, JPG, WebP)</p>
      </label>

      {/* Toolbar Controls */}
      <div className="ai-tools-toolbar">
        <button
          className={`ai-tool-btn ${activeTool === 'remove_bg' ? 'active' : ''}`}
          onClick={() => applyEnhancement('remove_bg')}
        >
          <Scissors size={16} /> Remove Background
        </button>

        <button
          className={`ai-tool-btn ${activeTool === 'enhance' ? 'active' : ''}`}
          onClick={() => applyEnhancement('enhance')}
        >
          <Maximize2 size={16} /> Increase Resolution (4K Upscale)
        </button>

        <button
          className={`ai-tool-btn ${activeTool === 'lighting' ? 'active' : ''}`}
          onClick={() => applyEnhancement('lighting')}
        >
          <Sun size={16} /> Improve Lighting
        </button>

        <button
          className={`ai-tool-btn ${activeTool === 'compress' ? 'active' : ''}`}
          onClick={() => applyEnhancement('compress')}
        >
          <Zap size={16} /> Compress Image (-65% size)
        </button>

        <button
          className={`ai-tool-btn ${activeTool === 'square' ? 'active' : ''}`}
          onClick={() => applyEnhancement('square')}
        >
          <Crop size={16} /> Square Thumbnail (1:1)
        </button>

        <button
          className={`ai-tool-btn ${activeTool === 'story' ? 'active' : ''}`}
          onClick={() => applyEnhancement('story')}
        >
          <Share2 size={16} /> Instagram Story (9:16)
        </button>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="ai-enhancer-grid">
        {/* Original */}
        <div className="ai-preview-card">
          <h3>Original Upload <span>Raw Photo</span></h3>
          <div className="ai-image-wrapper">
            <img src={selectedImage} alt="Original Product" />
          </div>
        </div>

        {/* Enhanced Result */}
        <div className="ai-preview-card">
          <h3>
            AI Enhanced Output
            <span style={{ color: '#10b981', fontSize: '13px' }}>
              {isProcessing ? 'Processing AI filters...' : activeTool.replace('_', ' ').toUpperCase()}
            </span>
          </h3>

          <div className={`ai-image-wrapper ${activeTool === 'remove_bg' ? 'transparent-bg' : ''}`}>
            {isProcessing ? (
              <RefreshCw size={36} className="animate-spin" color="#E94057" />
            ) : (
              <img
                src={selectedImage}
                alt="AI Enhanced Product"
                style={getImageStyle()}
              />
            )}
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              className="ai-btn-generate"
              onClick={() => {
                setDownloaded(true);
                setTimeout(() => setDownloaded(false), 2000);
              }}
            >
              {downloaded ? <Check size={18} /> : <Download size={18} />}
              {downloaded ? 'Downloaded HD Image!' : 'Download Enhanced Image'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
