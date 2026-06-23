import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    primaryColor: { type: String, default: '#C97A6E' },
    primaryColorLight: { type: String, default: '#E8C4B8' },
    primaryColorDark: { type: String, default: '#9B5A52' },
    primaryColorDeep: { type: String, default: '#7A4A42' },
    accentColor: { type: String, default: '#3D3430' },
  },
  { timestamps: true }
);

export default mongoose.model('Settings', settingsSchema);
