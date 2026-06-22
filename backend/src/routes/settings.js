import express from 'express';
import Settings from '../models/Settings.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, adminOnly);

/* ─── GET SETTINGS ─────────────────────────────────────────────────── */
router.get('/', async (_req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ─── UPDATE SETTINGS ─────────────────────────────────────────────────── */
router.put('/', async (req, res) => {
  try {
    const { primaryColor, primaryColorLight, primaryColorDark, primaryColorDeep, accentColor } = req.body;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    if (primaryColor) settings.primaryColor = primaryColor;
    if (primaryColorLight) settings.primaryColorLight = primaryColorLight;
    if (primaryColorDark) settings.primaryColorDark = primaryColorDark;
    if (primaryColorDeep) settings.primaryColorDeep = primaryColorDeep;
    if (accentColor) settings.accentColor = accentColor;

    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
