import { useEffect, useState } from 'react';
import { Palette, Check } from 'lucide-react';
import '../../styles/Panel.css';

export default function AdminTheme() {
  const [colors, setColors] = useState({
    primaryColor: '#87CEEB',
    primaryColorLight: '#B8E2F2',
    primaryColorDark: '#5BAFD4',
    primaryColorDeep: '#3A9BC4',
    accentColor: '#1A2B3C',
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      setColors(data);
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleColorChange = (field, value) => {
    setColors({ ...colors, [field]: value });
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(colors),
      });

      if (!res.ok) {
        throw new Error('Failed to save settings');
      }

      const data = await res.json();
      setColors(data);
      setSaved(true);

      // Apply theme colors immediately
      document.documentElement.style.setProperty('--sky-blue', colors.primaryColor);
      document.documentElement.style.setProperty('--sky-blue-light', colors.primaryColorLight);
      document.documentElement.style.setProperty('--sky-blue-dark', colors.primaryColorDark);
      document.documentElement.style.setProperty('--sky-blue-deep', colors.primaryColorDeep);
      document.documentElement.style.setProperty('--text-dark', colors.accentColor);

      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetDefaults = () => {
    const defaults = {
      primaryColor: '#87CEEB',
      primaryColorLight: '#B8E2F2',
      primaryColorDark: '#5BAFD4',
      primaryColorDeep: '#3A9BC4',
      accentColor: '#1A2B3C',
    };
    setColors(defaults);
    setSaved(false);
  };

  if (loading) return <div className="loading-spinner" style={{ margin: '40px auto' }} />;

  return (
    <>
      <h1><Palette size={32} style={{ marginRight: 12 }} /> Theme Colors</h1>
      <p className="panel-subtitle">Customize your website's color scheme</p>

      <div className="product-form">
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
            Primary Color
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 8 }}>
              Main brand color
            </span>
          </label>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input
              type="color"
              value={colors.primaryColor}
              onChange={(e) => handleColorChange('primaryColor', e.target.value)}
              style={{ width: 60, height: 60, border: 'none', borderRadius: 8, cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <input
                type="text"
                value={colors.primaryColor}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                placeholder="#87CEEB"
                style={{
                  padding: '10px 12px',
                  border: '2px solid var(--border)',
                  borderRadius: 8,
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
            Primary Color Light
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 8 }}>
              Light variant
            </span>
          </label>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input
              type="color"
              value={colors.primaryColorLight}
              onChange={(e) => handleColorChange('primaryColorLight', e.target.value)}
              style={{ width: 60, height: 60, border: 'none', borderRadius: 8, cursor: 'pointer' }}
            />
            <input
              type="text"
              value={colors.primaryColorLight}
              onChange={(e) => handleColorChange('primaryColorLight', e.target.value)}
              placeholder="#B8E2F2"
              style={{
                padding: '10px 12px',
                border: '2px solid var(--border)',
                borderRadius: 8,
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                flex: 1,
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
            Primary Color Dark
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 8 }}>
              Dark variant
            </span>
          </label>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input
              type="color"
              value={colors.primaryColorDark}
              onChange={(e) => handleColorChange('primaryColorDark', e.target.value)}
              style={{ width: 60, height: 60, border: 'none', borderRadius: 8, cursor: 'pointer' }}
            />
            <input
              type="text"
              value={colors.primaryColorDark}
              onChange={(e) => handleColorChange('primaryColorDark', e.target.value)}
              placeholder="#5BAFD4"
              style={{
                padding: '10px 12px',
                border: '2px solid var(--border)',
                borderRadius: 8,
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                flex: 1,
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
            Primary Color Deep
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 8 }}>
              Darkest variant
            </span>
          </label>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input
              type="color"
              value={colors.primaryColorDeep}
              onChange={(e) => handleColorChange('primaryColorDeep', e.target.value)}
              style={{ width: 60, height: 60, border: 'none', borderRadius: 8, cursor: 'pointer' }}
            />
            <input
              type="text"
              value={colors.primaryColorDeep}
              onChange={(e) => handleColorChange('primaryColorDeep', e.target.value)}
              placeholder="#3A9BC4"
              style={{
                padding: '10px 12px',
                border: '2px solid var(--border)',
                borderRadius: 8,
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                flex: 1,
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
            Accent Color (Text)
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 8 }}>
              Primary text color
            </span>
          </label>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input
              type="color"
              value={colors.accentColor}
              onChange={(e) => handleColorChange('accentColor', e.target.value)}
              style={{ width: 60, height: 60, border: 'none', borderRadius: 8, cursor: 'pointer' }}
            />
            <input
              type="text"
              value={colors.accentColor}
              onChange={(e) => handleColorChange('accentColor', e.target.value)}
              placeholder="#1A2B3C"
              style={{
                padding: '10px 12px',
                border: '2px solid var(--border)',
                borderRadius: 8,
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                flex: 1,
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          <button onClick={handleSave} className="btn btn-sky" disabled={loading}>
            {saved && <Check size={16} />}
            {saved ? 'Saved!' : 'Save Theme Colors'}
          </button>
          <button
            onClick={handleResetDefaults}
            style={{
              padding: '14px 28px',
              border: '2px solid var(--border)',
              borderRadius: '50px',
              fontSize: '0.93rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: 'var(--white)',
              color: 'var(--text-dark)',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = 'var(--sky-blue)';
              e.target.style.color = 'var(--sky-blue-deep)';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.color = 'var(--text-dark)';
            }}
          >
            Reset to Defaults
          </button>
        </div>
      </div>

      <div style={{ marginTop: 40 }}>
        <h3 style={{ marginBottom: 16 }}>Color Preview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
          <div style={{ background: 'var(--white)', border: `2px solid var(--border)`, borderRadius: 8, padding: 16 }}>
            <div
              style={{
                width: '100%',
                height: 60,
                background: colors.primaryColor,
                borderRadius: 6,
                marginBottom: 8,
              }}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Primary
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{colors.primaryColor}</div>
          </div>

          <div style={{ background: 'var(--white)', border: `2px solid var(--border)`, borderRadius: 8, padding: 16 }}>
            <div
              style={{
                width: '100%',
                height: 60,
                background: colors.primaryColorLight,
                borderRadius: 6,
                marginBottom: 8,
              }}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Light
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{colors.primaryColorLight}</div>
          </div>

          <div style={{ background: 'var(--white)', border: `2px solid var(--border)`, borderRadius: 8, padding: 16 }}>
            <div
              style={{
                width: '100%',
                height: 60,
                background: colors.primaryColorDark,
                borderRadius: 6,
                marginBottom: 8,
              }}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Dark
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{colors.primaryColorDark}</div>
          </div>

          <div style={{ background: 'var(--white)', border: `2px solid var(--border)`, borderRadius: 8, padding: 16 }}>
            <div
              style={{
                width: '100%',
                height: 60,
                background: colors.primaryColorDeep,
                borderRadius: 6,
                marginBottom: 8,
              }}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Deep
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{colors.primaryColorDeep}</div>
          </div>

          <div style={{ background: 'var(--white)', border: `2px solid var(--border)`, borderRadius: 8, padding: 16 }}>
            <div
              style={{
                width: '100%',
                height: 60,
                background: colors.accentColor,
                borderRadius: 6,
                marginBottom: 8,
              }}
            />
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Accent
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{colors.accentColor}</div>
          </div>
        </div>
      </div>
    </>
  );
}
