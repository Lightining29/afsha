import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const DOMAIN = 'https://www.afshaenterprises.com';
const TODAY = '2026-09-21';

// 1. CORE CATEGORIES
const ALL_CATEGORIES = [
  {
    slug: 'massager',
    name: 'Electric Body Massagers & Pain Relief',
    metaTitle: 'Buy Electric Body Massagers Online India — Pain Relief & Deep Tissue | Afsha Enterprises',
    metaDescription: 'Shop high-grade electric body massagers, deep tissue percussion guns, neck & back massagers, and foot reflexology machines. Fast delivery & COD across India.',
    keywords: 'electric body massager India, buy massage machine online, pain relief massager, deep tissue percussion gun, cervical neck massager, back pain relief massager'
  },
  {
    slug: 'hair-styling-grooming',
    name: 'Hair Styling & Personal Grooming',
    metaTitle: 'Hair Styling & Grooming Tools for Women & Men | Afsha Enterprises',
    metaDescription: 'Discover painless eyebrow makers, heatless hair straighteners, automatic hair curlers, and multi-purpose body hair trimmers. Gentle on sensitive skin.',
    keywords: 'painless eyebrow trimmer, heatless hair brush straightener, hair curler online India, body hair trimmer women, facial hair remover'
  },
  {
    slug: 'cleaner',
    name: 'Home & Car Cleaning Equipment',
    metaTitle: 'Car Washers & Portable Vacuum Cleaners Online India | Afsha Enterprises',
    metaDescription: 'Buy powerful high-pressure car washers, portable mini vacuum cleaners, and garden sprayers with strong suction and energy-saving copper motors.',
    keywords: 'portable car vacuum cleaner, high pressure car washer India, home vacuum cleaner, garden sprayer cleaner'
  },
  {
    slug: 'table',
    name: 'Outdoor & Foldable Furniture',
    metaTitle: 'Foldable Picnic Tables & Portable Outdoor Furniture | Afsha Enterprises',
    metaDescription: 'Heavy-duty lightweight foldable picnic tables for family camping, garden parties, and outdoor travel. Weather-resistant aluminum build.',
    keywords: 'foldable picnic table India, portable camping table, outdoor folding table, travel picnic desk'
  },
  {
    slug: 'facial',
    name: 'Facial Care & Skin Rejuvenation',
    metaTitle: 'Facial Steamers, Blackhead Removers & Skin Massagers | Afsha Enterprises',
    metaDescription: 'Professional facial steamers, Korean skin massagers, and gentle blackhead pore vacuums for salon-quality glow and rejuvenation at home.',
    keywords: 'blackhead remover pore vacuum, facial steamer iron, Korean facial skin massager, facial jade roller, glowing skin tools'
  }
];

// 2. VERIFIED PRODUCTS
const ALL_PRODUCTS = [
  {
    slug: 'electric-body-massager',
    name: 'Electric Body Massager Machine',
    headline: 'Full Body Pain Relief & Deep Tissue Relaxing Machine',
    category: 'Massager',
    price: 1499,
    originalPrice: 2999,
    discountPercent: 50,
    image: '/masage.jpg',
    rating: 4.9,
    reviews: 384,
    metaTitle: 'Electric Body Massager Machine — Full Body Pain Relief | Afsha Enterprises',
    metaDescription: 'Buy the best Electric Body Massager in India with multi-head attachments, speed control, and infrared thermal therapy. Instant relief from back, neck, and leg pain.',
    keywords: 'best electric body massager India, full body massager machine, electric back pain massager, buy body massager online India, handheld vibrating massager',
    highlights: ['Multi-Head Interchangeable Attachments', 'High-Torque 3200 RPM Copper Motor', 'Infrared Thermal Therapy', 'Variable Speed Dial', 'Ergonomic Non-Slip Grip']
  },
  {
    slug: 'deep-tissue-massager',
    name: 'Deep Tissue Percussion Massager Gun',
    headline: 'Professional Muscle Recovery & Knot Release Gun',
    category: 'Massager',
    price: 2499,
    originalPrice: 4999,
    discountPercent: 50,
    image: '/bg.jpg',
    rating: 4.9,
    reviews: 420,
    metaTitle: 'Deep Tissue Percussion Massager Gun — Muscle Recovery | Afsha Enterprises',
    metaDescription: 'Shop Professional Deep Tissue Massage Gun in India. High-power brushless motor, 6 speed levels, 4 massage heads, and rechargeable battery for athletes and office workers.',
    keywords: 'deep tissue massager gun India, percussion massage gun, gym muscle recovery machine, athletic percussion massager, best massage gun price India',
    highlights: ['Quiet-Glide Brushless Motor (<45dB)', '6 Intelligent Speed Levels up to 3600 RPM', '4 Specialized Massage Heads', '2400mAh Rechargeable Battery', '12mm Deep Amplitude']
  },
  {
    slug: 'painless-facial-hair-remover',
    name: 'Painless Facial & Body Hair Remover for Women',
    headline: '100% Painless Instant Face Shaver & Trimmer',
    category: 'Hair Styling & Grooming',
    price: 1799,
    originalPrice: 3599,
    discountPercent: 50,
    image: '/masage.jpg',
    rating: 4.8,
    reviews: 512,
    metaTitle: 'Painless Facial Hair Remover Trimmer for Women | Afsha Enterprises',
    metaDescription: 'Buy 100% Painless Facial Hair Remover for Women in India. Hypoallergenic 18K gold head, built-in LED light, and USB rechargeable for smooth, glowing skin.',
    keywords: 'painless facial hair remover women India, face hair trimmer for women, upper lip hair remover machine, flawless face shaver, painless eyebrow trimmer',
    highlights: ['Hypoallergenic 18K Gold-Plated Head', 'Built-in Smart LED Light', '100% Painless Precision Blades', 'Lipstick Compact Design', 'USB Fast Charging']
  },
  {
    slug: 'neck-and-shoulder-massager',
    name: 'Shiatsu Neck and Shoulder Massager with Heat',
    headline: 'Deep Kneading Cervical Spine Pain Relief Wrap',
    category: 'Massager',
    price: 2999,
    originalPrice: 5999,
    discountPercent: 50,
    image: '/bg.jpg',
    rating: 4.9,
    reviews: 296,
    metaTitle: 'Shiatsu Neck and Shoulder Massager with Heat | Afsha Enterprises',
    metaDescription: 'Ergonomic 3D Shiatsu neck and shoulder massager with soothing infrared heat. Reversible kneading nodes relieve trapezius stiffness and cervical spine tension.',
    keywords: 'neck and shoulder massager with heat, cervical spondylosis massager India, shiatsu neck kneading massager, shoulder pain relief machine',
    highlights: ['8 Bi-Directional 3D Kneading Nodes', 'Soothing Infrared Heat Therapy', 'Arm Straps for Pressure Customization', 'Car & Home AC Adapters Included', 'Auto Shut-Off Safety']
  },
  {
    slug: 'foot-and-calf-massager',
    name: 'Leg, Foot and Calf Massager Machine',
    headline: 'Air Compression & Reflexology Rollers for Tired Feet',
    category: 'Massager',
    price: 8999,
    originalPrice: 15999,
    discountPercent: 44,
    image: '/masage.jpg',
    rating: 4.9,
    reviews: 188,
    metaTitle: 'Leg, Foot & Calf Massager Machine — Plantar Fasciitis Relief | Afsha Enterprises',
    metaDescription: 'Buy Premium Foot & Calf Massager with air compression airbags, heated reflexology rollers, and vibration therapy. Perfect for diabetic neuropathy and heel pain.',
    keywords: 'foot and calf massager machine India, leg massager for pain relief, plantar fasciitis foot massager, reflexology foot massager with heat',
    highlights: ['Deep Sole Kneading Rollers', 'Wraparound Air Compression Airbags', 'Therapeutic Foot Heat Therapy', 'Customizable Modes & Tilt Stand', 'Removable Washable Sleeves']
  },
  {
    slug: 'korean-skin-massager',
    name: 'Korean Skin Rejuvenation Facial Massager',
    headline: 'Microcurrent & Sonic Vibration Anti-Aging Wand',
    category: 'Facial',
    price: 5999,
    originalPrice: 7999,
    discountPercent: 25,
    image: '/masage.jpg',
    rating: 4.8,
    reviews: 142,
    metaTitle: 'Korean Skin Massager — Anti-Aging Microcurrent Facial Device | Afsha Enterprises',
    metaDescription: 'Lift, sculpt and tone skin with the Korean Skin Facial Massager. Microcurrent EMS stimulation boosts collagen and reduces fine lines and wrinkles.',
    keywords: 'Korean skin massager India, microcurrent face lift device, facial sculpting wand, anti-aging face massager, collagen boosting skin tool',
    highlights: ['EMS Microcurrent Collagen Lifting', 'Sonic High-Frequency Vibrations', 'Red & Blue LED Light Therapy', 'Promotes Deep Serum Absorption', 'Rechargeable Wireless Design']
  },
  {
    slug: 'eyebrow-trimmer',
    name: 'Precision Eyebrow Trimmer & Shaper',
    headline: 'Instant Eyebrow Shaping Pen with LED Light',
    category: 'Hair Styling & Grooming',
    price: 999,
    originalPrice: 1999,
    discountPercent: 50,
    image: '/masage.jpg',
    rating: 4.7,
    reviews: 230,
    metaTitle: 'Precision Eyebrow Trimmer for Women | Afsha Enterprises',
    metaDescription: 'Shape eyebrows flawlessly without plucking or pain. Compact precision eyebrow pen with micro-blade guard and built-in spotlight.',
    keywords: 'eyebrow trimmer for women, painless eyebrow maker, electric eyebrow shaver, precision brow trimmer India',
    highlights: ['360-Degree Precision Micro-Blade', 'Gentle on All Sensitive Skin Types', 'Ergonomic Pen Style', 'Built-in Target Light', 'AAA Battery / USB Powered']
  },
  {
    slug: 'hair-brush',
    name: 'Heatless Ceramic Hair Straightener Brush',
    headline: 'Quick Salon Straight Hair with Zero Thermal Damage',
    category: 'Hair Styling & Grooming',
    price: 2599,
    originalPrice: 3999,
    discountPercent: 35,
    image: '/bg.jpg',
    rating: 4.8,
    reviews: 175,
    metaTitle: 'Ceramic Hair Straightener Brush — Frizz-Free Shine | Afsha Enterprises',
    metaDescription: 'Straighten wavy and frizzy hair in minutes without heat damage. Ionic ceramic bristles detangle, smooth, and add luminous salon gloss.',
    keywords: 'hair straightener brush India, ceramic ionic hair brush, heatless hair styling, anti-frizz electric hair straightener',
    highlights: ['Tourmaline Ceramic Heat Plates', 'Negative Ion Anti-Frizz Generator', 'Adjustable Digital Temp Control', 'Anti-Scald Protective Bristles', 'Fast 30-Second Heating']
  },
  {
    slug: 'multi-purpose-trimmer',
    name: 'Multi-Purpose Full Body Hair Trimmer',
    headline: 'Waterproof Grooming Trimmer for Sensitive Areas',
    category: 'Hair Styling & Grooming',
    price: 1799,
    originalPrice: 2500,
    discountPercent: 28,
    image: '/masage.jpg',
    rating: 4.7,
    reviews: 198,
    metaTitle: 'Multi-Purpose Full Body Hair Trimmer | Afsha Enterprises',
    metaDescription: 'Cordless waterproof multi-purpose trimmer for bikini line, underarms, legs, and delicate zones. Hypoallergenic stainless steel blades.',
    keywords: 'body hair trimmer women India, waterproof bikini trimmer, sensitive skin body shaver, cordless electric shaver',
    highlights: ['IPX7 100% Showerproof Waterproof', 'Ceramic SkinSafe Blade System', 'Multiple Guide Comb Attachments', 'Ergonomic Grip Body', 'Fast USB Type-C Recharging']
  },
  {
    slug: 'painless-eyebrow-maker',
    name: 'Painless Eyebrow Maker Pro',
    headline: 'Gold-Plated Fine Eyebrow Styling & Cleanup Pen',
    category: 'Hair Styling & Grooming',
    price: 1499,
    originalPrice: 1999,
    discountPercent: 25,
    image: '/masage.jpg',
    rating: 4.8,
    reviews: 164,
    metaTitle: 'Painless Eyebrow Maker Pro — Salon Brows at Home | Afsha Enterprises',
    metaDescription: 'Effortlessly clean stray eyebrow hairs with zero redness. 18K gold precision head designed for daily eyebrow contouring.',
    keywords: 'painless eyebrow maker pro, eyebrow shaping pen, salon brow groomer, painless electric eyebrow remover',
    highlights: ['18K Gold Plated Precision Tip', 'Hypoallergenic Anti-Allergy Head', 'Whisper-Quiet Motor', 'Compact Handbag Size', 'Dermatologist Recommended']
  },
  {
    slug: 'car-home-massager',
    name: 'Car & Home Dual-Use Pillow Massager',
    headline: 'Portable Heated Kneading Massage Cushion',
    category: 'Massager',
    price: 4999,
    originalPrice: 6999,
    discountPercent: 29,
    image: '/bg.jpg',
    rating: 4.9,
    reviews: 215,
    metaTitle: 'Car & Home Pillow Massager with Heat | Afsha Enterprises',
    metaDescription: 'Relieve driving fatigue and lower back pain with the dual-use pillow massager. Includes 12V car cigarette lighter plug and 220V home adapter.',
    keywords: 'car seat massager cushion, heated massage pillow car home, driving back pain massager, shiatsu lumbar cushion',
    highlights: ['Includes 12V Car & 220V Home Plugs', '4 Deep Kneading Rotating Nodes', 'Therapeutic Lumbar Heat Therapy', 'Elastic Seat Mounting Strap', 'Overheat Auto Protection']
  },
  {
    slug: 'vacuum-cleaner',
    name: 'Handheld High-Suction Vacuum Cleaner',
    headline: 'Cyclonic Dirt & Pet Hair Cleaner for Home & Car',
    category: 'Cleaner',
    price: 1799,
    originalPrice: 2499,
    discountPercent: 28,
    image: '/masage.jpg',
    rating: 4.6,
    reviews: 132,
    metaTitle: 'Handheld High-Suction Vacuum Cleaner | Afsha Enterprises',
    metaDescription: 'Lightweight cordless handheld vacuum cleaner with 8500Pa strong cyclone suction. Clean car interiors, sofas, keyboards, and corners effortlessly.',
    keywords: 'handheld vacuum cleaner India, car mini vacuum cleaner, cordless portable vacuum, dust cleaner machine for sofa',
    highlights: ['8500Pa Powerful Cyclone Suction', 'Washable High-Efficiency HEPA Filter', 'Multiple Crevice & Brush Nozzles', 'Lightweight 600g Ergonomic Handle', 'Rechargeable Long Battery']
  },
  {
    slug: 'high-pressure-car-washer',
    name: 'High Pressure Cordless Car Washer Spray Gun',
    headline: 'High-Bar Water Pressure Washer for Vehicles & Patios',
    category: 'Cleaner',
    price: 3499,
    originalPrice: 4999,
    discountPercent: 30,
    image: '/bg.jpg',
    rating: 4.7,
    reviews: 154,
    metaTitle: 'Cordless High Pressure Car Washer Gun | Afsha Enterprises',
    metaDescription: 'Wash cars, bikes, driveways, and gardens with high water pressure without needing an outdoor tap. Self-priming from any bucket or water bottle.',
    keywords: 'cordless car washer spray gun India, high pressure washer machine, portable vehicle wash machine, car foam washer',
    highlights: ['Up to 45 Bar Heavy Jet Pressure', 'Cordless Lithium Battery Powered', 'Self-Priming Draws Water from Buckets', 'Includes Foam Cannon & Multi-Spray Nozzles', 'Heavy-Duty Copper Pump']
  },
  {
    slug: 'garden-home-cleaner',
    name: 'Multi-Surface Garden & Home Cleaner',
    headline: 'Electric High-Pressure Surface Cleaning Sprayer',
    category: 'Cleaner',
    price: 2499,
    originalPrice: 3499,
    discountPercent: 29,
    image: '/masage.jpg',
    rating: 4.6,
    reviews: 98,
    metaTitle: 'Garden & Home Surface Cleaner Sprayer | Afsha Enterprises',
    metaDescription: 'Effortlessly clean outdoor tiles, balconies, plants, and exterior glass with the electric surface cleaning sprayer with adjustable mist and jet modes.',
    keywords: 'garden surface cleaner sprayer, electric plant mister, patio tile cleaner India, balcony cleaning machine',
    highlights: ['Adjustable Fine Mist to Strong Jet', 'Large Capacity Leak-Proof Tank', 'One-Touch Continuous Spray Switch', 'Rechargeable Cordless Convenience', 'Durable Weatherproof Body']
  },
  {
    slug: 'leg-massager',
    name: 'Advanced Leg Air-Compression Massager Machine',
    headline: 'Full Thigh, Calf & Foot Circulatory Relief Boots',
    category: 'Massager',
    price: 17999,
    originalPrice: 24999,
    discountPercent: 28,
    image: '/bg.jpg',
    rating: 4.9,
    reviews: 86,
    metaTitle: 'Full Leg Air Compression Massager Boots | Afsha Enterprises',
    metaDescription: 'Hospital-grade sequential air compression leg massager boots for varicose veins, restless leg syndrome, and swelling. Enhances lymphatic drainage.',
    keywords: 'full leg massager boots India, air compression leg sleeves, varicose vein massager, edema swelling relief leg boots',
    highlights: ['Sequential Dynamic Air Compression', 'Covers Thighs, Calves, and Feet', 'Handheld Digital Controller', '3 Pressure Intensities & Heat Therapy', 'Breathable High-Grade Fabric']
  },
  {
    slug: 'facial-zed-roller',
    name: 'Electric Vibration Jade Facial Roller & Gua Sha',
    headline: 'Natural Jade Stone with 6000 RPM Sonic Vibration',
    category: 'Hair Styling & Grooming',
    price: 1899,
    originalPrice: 3999,
    discountPercent: 53,
    image: '/masage.jpg',
    rating: 4.8,
    reviews: 145,
    metaTitle: 'Electric Vibration Jade Facial Roller & Gua Sha | Afsha Enterprises',
    metaDescription: 'Combine natural cooling rose quartz/jade stone with soothing micro-vibrations. De-puffs eyes, promotes lymphatic drainage, and contours jawline.',
    keywords: 'electric jade roller India, sonic vibrating face roller, gua sha facial massager, eye puffiness remover roller',
    highlights: ['Genuine Cooling Natural Jade Stone', '6000 Sonic Vibrations Per Minute', 'Includes Under-Eye Press Attachment', 'Boosts Serum & Moisturizer Absorption', 'Compact Luxury Finish']
  },
  {
    slug: 'foot-massager',
    name: 'Shiatsu Electric Foot Massager with Heat',
    headline: 'Deep Sole Kneading & Arch Reflexology Machine',
    category: 'Massager',
    price: 1999,
    originalPrice: 2999,
    discountPercent: 33,
    image: '/masage.jpg',
    rating: 4.8,
    reviews: 210,
    metaTitle: 'Shiatsu Foot Massager Machine with Heat | Afsha Enterprises',
    metaDescription: 'Target tired arches and heels with rotating massage nodes and gentle infrared warmth. Perfect for teachers, retail staff, and runners.',
    keywords: 'foot massager machine India, shiatsu foot reflexology massager, electric foot pain relief machine, heel pain massager',
    highlights: ['Multiple Rolling Shiatsu Nodes', 'Soothing Heated Arch Support', 'Open Design Fits All Foot Sizes', 'Simple One-Button Control', 'Breathable Mesh Top']
  },
  {
    slug: 'scalp-massager',
    name: 'Electric Waterproof Head & Scalp Massager',
    headline: '4 Silicone Kneading Claw Heads for Hair Growth',
    category: 'Massager',
    price: 1499,
    originalPrice: 2499,
    discountPercent: 40,
    image: '/masage.jpg',
    rating: 4.8,
    reviews: 192,
    metaTitle: 'Waterproof Head & Scalp Massager for Hair Growth | Afsha Enterprises',
    metaDescription: 'Stimulate hair follicles, increase scalp micro-circulation, and melt tension headaches with 4 rotating silicone claw heads. 100% waterproof for in-shower shampooing.',
    keywords: 'electric scalp massager India, head massager for hair growth, waterproof shampoo massage brush, migraine relief scalp massager',
    highlights: ['4 Rotating Silicone Claws with 76 Nodes', 'IPX7 100% In-Shower Waterproof', 'Stimulates Blood Circulation to Follicles', 'Relieves Stress & Tension Headaches', 'Magnetic Wireless Charging Base']
  },
  {
    slug: 'blow-dryer',
    name: 'Professional Ionic Hair Blow Dryer',
    headline: 'Fast-Drying 2000W AC Motor Hair Dryer',
    category: 'Hair Styling & Grooming',
    price: 1799,
    originalPrice: 2499,
    discountPercent: 28,
    image: '/bg.jpg',
    rating: 4.7,
    reviews: 138,
    metaTitle: 'Professional Ionic Hair Blow Dryer 2000W | Afsha Enterprises',
    metaDescription: 'Dry hair 50% faster without heat damage using negative ionic technology. Features 3 heat settings, 2 speeds, and cool shot button for salon styling.',
    keywords: 'professional hair dryer India, ionic blow dryer 2000W, fast dry salon hair blower, cool shot blow dryer',
    highlights: ['Powerful 2000W Long-Life AC Motor', 'Negative Ion Moisture Lock Tech', '3 Heat & 2 Speed Control Settings', 'Cool Shot Button for Locking Styles', 'Includes Concentrator Nozzle']
  },
  {
    slug: 'foldable-picnic-table',
    name: 'Heavy-Duty Foldable Picnic Table with 4 Seats',
    headline: 'All-in-One Suitcase Folding Camping Table',
    category: 'Table',
    price: 6999,
    originalPrice: 8999,
    discountPercent: 22,
    image: '/masage.jpg',
    rating: 4.8,
    reviews: 84,
    metaTitle: 'Foldable Picnic Table with 4 Seats | Afsha Enterprises',
    metaDescription: 'Portable aluminum folding picnic table with 4 attached seats. Folds into a compact briefcase for outdoor picnics, terrace dinners, and road trips.',
    keywords: 'foldable picnic table India, portable camping table with chairs, suitcase fold picnic table, outdoor family dining table',
    highlights: ['Integrated 4-Seat Sturdy Frame', 'Folds into Compact Carry Briefcase', 'High-Strength Rustproof Aluminum', 'Umbrella Hole in Center', 'Quick 60-Second Tool-Free Setup']
  },
  {
    slug: 'portable-vacuum-cleaner',
    name: 'Wireless High-Power Portable Car Vacuum Cleaner',
    headline: 'Cordless USB-Rechargeable Wet & Dry Dust Buster',
    category: 'Cleaner',
    price: 2499,
    originalPrice: 3499,
    discountPercent: 29,
    image: '/masage.jpg',
    rating: 4.7,
    reviews: 168,
    metaTitle: 'Portable Wireless Car Vacuum Cleaner 9000Pa | Afsha Enterprises',
    metaDescription: 'Ultra-strong 9000Pa suction cordless vacuum cleaner. Effortlessly reach under car seats, between AC vents, and pick up crumbs, dust, and pet hairs.',
    keywords: 'cordless car vacuum cleaner India, 9000pa portable dust cleaner, wet dry mini vacuum, rechargeable car duster',
    highlights: ['9000Pa High-Velocity Suction', 'Rechargeable 4000mAh Lithium Pack', 'Washable HEPA Filter Element', 'Narrow Slit & Brush Attachments', 'Ergonomic Pistol Grip']
  },
  {
    slug: 'facial-garment-steam-iron',
    name: '2-in-1 Facial Steamer & Handheld Garment Steamer',
    headline: 'Dual-Purpose Deep Pore Cleanser & Wrinkle Remover',
    category: 'Facial',
    price: 1999,
    originalPrice: 2499,
    discountPercent: 20,
    image: '/bg.jpg',
    rating: 4.7,
    reviews: 112,
    metaTitle: '2-in-1 Facial Steamer & Garment Steam Iron | Afsha Enterprises',
    metaDescription: 'Nano ionic steam opens pores for glowing skin or quickly de-wrinkles suits, dresses, and sarees. Fast 20-second steam generation.',
    keywords: 'facial steamer garment steamer 2 in 1, portable clothes steamer iron, face steamer for glowing skin, nano ionic facial sauna',
    highlights: ['Fast Nano-Ionic Micro-Steam Generator', 'Smooths Wrinkles on Delicate Fabrics', 'Opens Pores for Facial Deep Cleansing', 'Continuous Steam Lock Trigger', 'Compact Travel Friendly Size']
  },
  {
    slug: 'painless-eyebrow-facial-hair',
    name: 'Painless 2-in-1 Eyebrow & Facial Hair Groomer',
    headline: 'Interchangeable Precision Brow & Face Heads',
    category: 'Hair Styling & Grooming',
    price: 1799,
    originalPrice: 2499,
    discountPercent: 28,
    image: '/masage.jpg',
    rating: 4.8,
    reviews: 176,
    metaTitle: '2-in-1 Eyebrow & Facial Hair Trimmer for Women | Afsha Enterprises',
    metaDescription: 'Complete facial grooming kit with 2 swappable heads: fine tip for brows and circular head for peach fuzz, upper lip, and chin hair.',
    keywords: '2 in 1 eyebrow and facial hair trimmer, painless face trimmer women, eyebrow shaping machine, upper lip hair remover',
    highlights: ['2 Interchangeable Precision Heads', '18K Rose Gold Plated Contact', 'Safe for Sensitive Acne-Prone Skin', 'Built-in Illumination LED', 'USB Type-C Quick Charge']
  },
  {
    slug: 'physio-therapy-massager',
    name: 'Clinical Physiotherapy Vibration Massager',
    headline: 'Heavy-Duty Therapeutic Muscle & Joint Relief Unit',
    category: 'Massager',
    price: 2499,
    originalPrice: 2999,
    discountPercent: 17,
    image: '/masage.jpg',
    rating: 4.9,
    reviews: 142,
    metaTitle: 'Clinical Physiotherapy Vibration Massager | Afsha Enterprises',
    metaDescription: 'Recommended by chiropractors and physiotherapists for frozen shoulder, back spasms, and tendonitis. Variable high-amplitude oscillation.',
    keywords: 'physiotherapy vibration massager India, medical body massager machine, frozen shoulder vibration machine, chiropractic massager',
    highlights: ['High-Amplitude Therapeutic Oscillation', 'Non-Slip Dual Grip Handles', 'Acupressure & Pointed Nodes Included', 'Continuous Heavy Duty Motor Duty', 'Certified Physiotherapy Grade']
  },
  {
    slug: 'shoulder-and-neck-massager',
    name: 'Ergonomic Shoulder and Neck Heated Kneader',
    headline: 'Deep Trapezius Relief Wrap with Soothing Heat',
    category: 'Massager',
    price: 4999,
    originalPrice: 5999,
    discountPercent: 17,
    image: '/bg.jpg',
    rating: 4.9,
    reviews: 215,
    metaTitle: 'Ergonomic Shoulder & Neck Heated Massager | Afsha Enterprises',
    metaDescription: 'Melt away tension headaches, desk stiffness, and neck knots with deep kneading clockwise and anti-clockwise Shiatsu nodes with thermal heat.',
    keywords: 'shoulder and neck massager heat, trapezius muscle knot massager, neck pain relief machine, desk neck stiff massager',
    highlights: ['Deep Penetrating Infrared Thermal Therapy', '8 Ergonomically Positioned Kneading Nodes', 'Hands-Free Arm Loop Restraints', 'Reversible Direction Settings', 'Ultra-Quiet Operation']
  },
  {
    slug: '9-head-massager',
    name: '9-in-1 Multi-Head Electric Body Massager',
    headline: 'Complete Whole Body Custom Relief Appliance',
    category: 'Massager',
    price: 2499,
    originalPrice: 3499,
    discountPercent: 29,
    image: '/masage.jpg',
    rating: 4.9,
    reviews: 234,
    metaTitle: '9-in-1 Multi-Head Electric Body Massager | Afsha Enterprises',
    metaDescription: '9 specialized interchangeable heads for cellulite reduction, joint pain, acupressure, scalp relaxation, and deep muscle kneading. Heavy duty copper motor.',
    keywords: '9 in 1 electric body massager India, multi head massager machine, full body vibration machine with 9 heads, cellulite toning massager',
    highlights: ['9 Distinct Massage Therapy Attachments', 'Variable Speed Dial up to 3400 RPM', 'Protective Hair Guard Mesh', 'Extended Length Reaches Full Back', 'Copper Winding High Torque Motor']
  },
  {
    slug: 'automatic-hair-curler',
    name: 'Cordless Automatic Ceramic Hair Curler',
    headline: 'Tangle-Free Auto-Rotating Ceramic Curling Iron',
    category: 'Hair Styling & Grooming',
    price: 9999,
    originalPrice: 14999,
    discountPercent: 33,
    image: '/bg.jpg',
    rating: 4.9,
    reviews: 126,
    metaTitle: 'Cordless Automatic Ceramic Hair Curler | Afsha Enterprises',
    metaDescription: 'Create flawless beach waves and bouncy curls with one button. Intelligent anti-tangle sensor, digital temperature settings, and wireless rechargeable battery.',
    keywords: 'automatic hair curler India, cordless auto rotating curling iron, beach waves hair curler, intelligent ceramic curler machine',
    highlights: ['Smart Auto-Rotation with 1-Button', 'Anti-Tangle & Anti-Burn Chamber', '6 Heat & Timer Settings', 'Cordless Battery Powered Styling', 'Tourmaline Ceramic Barrel']
  },
  {
    slug: 'blackheads-remover',
    name: 'Pore Vacuum Electric Blackhead Remover',
    headline: 'High-Power Suction Pore Cleanser with 5 Probes',
    category: 'Facial',
    price: 1199,
    originalPrice: 2499,
    discountPercent: 52,
    image: '/masage.jpg',
    rating: 4.7,
    reviews: 288,
    metaTitle: 'Electric Blackhead Remover Pore Vacuum | Afsha Enterprises',
    metaDescription: 'Extract stubborn blackheads, whiteheads, excess sebum, and unclog pores safely without pinching skin. 5 suction levels and LED display.',
    keywords: 'blackhead remover machine India, pore vacuum cleaner, electric acne pimple extractor, facial skin vacuum tool',
    highlights: ['65Kpa Strong Vacuum Extraction Force', '5 Interchangeable Beauty Probes', '3 Skin-Type Intensity Levels', 'Clear Digital LED Battery Indicator', 'USB Fast Charging']
  }
];

// 3. 40 HIGH-INTENT WELLNESS, PAIN RELIEF & BEAUTY BLOG GUIDES
const ALL_BLOGS = [
  {
    slug: 'best-massager-for-back-pain-in-india',
    title: 'Best Electric Body Massager for Back Pain in India (2026 Buying Guide)',
    category: 'Buying Guide',
    metaTitle: 'Best Massager for Back Pain in India — Buyer Guide | Afsha Enterprises',
    metaDescription: 'Suffering from lower back pain or lumbar stiffness? Here is the ultimate guide to choosing the best electric back massager in India with heat therapy.',
    keywords: 'best massager for back pain India, lower back pain massager, electric back massager machine, lumbar pain relief at home',
    publishedDate: '2026-09-10',
    readTime: '7 min read',
    author: 'Dr. R. Sharma (PT) & Manish Kumar',
    image: '/masage.jpg'
  },
  {
    slug: 'electric-vs-manual-massagers',
    title: 'Electric vs Manual Massagers: Which Delivers Faster Pain Relief?',
    category: 'Comparison',
    metaTitle: 'Electric vs Manual Massagers — Comprehensive Comparison | Afsha Enterprises',
    metaDescription: 'Discover the scientific differences between motor-driven electric vibration massagers and manual foam rollers. Learn which works best for chronic muscle knots.',
    keywords: 'electric vs manual massager, foam roller vs massage gun, electric massager benefits, pain relief comparison',
    publishedDate: '2026-09-12',
    readTime: '6 min read',
    author: 'Manish Kumar',
    image: '/bg.jpg'
  },
  {
    slug: 'facial-hair-removal-tips-for-women',
    title: 'Facial Hair Removal for Women: Trimmer vs Threading vs Waxing',
    category: 'Skincare',
    metaTitle: 'Facial Hair Removal Tips for Women — Painless Methods | Afsha Enterprises',
    metaDescription: 'A dermatologist-backed comparison of facial trimmers, waxing, and threading. How to remove peach fuzz and upper lip hair without breakouts or redness.',
    keywords: 'facial hair removal tips women, painless face trimmer vs threading, upper lip hair removal at home, flawless facial trimmer',
    publishedDate: '2026-09-14',
    readTime: '8 min read',
    author: 'Priya Deshmukh (Beauty Specialist)',
    image: '/masage.jpg'
  },
  {
    slug: 'full-body-massage-machine-price-in-india',
    title: 'Full Body Massage Machine Price in India: What to Expect at Every Budget',
    category: 'Buying Guide',
    metaTitle: 'Full Body Massage Machine Price in India (2026) | Afsha Enterprises',
    metaDescription: 'A complete breakdown of full body massage machine prices in India. Compare handheld vibration massagers, massage guns, and shiatsu chairs.',
    keywords: 'full body massage machine price India, body massager price list, affordable massage gun India, electric massager cost',
    publishedDate: '2026-09-15',
    readTime: '5 min read',
    author: 'Afsha Editorial Team',
    image: '/bg.jpg'
  },
  {
    slug: 'how-to-choose-a-handheld-massager',
    title: 'How to Choose the Right Handheld Massager for Your Family',
    category: 'Buying Guide',
    metaTitle: 'How to Choose a Handheld Body Massager | Afsha Enterprises',
    metaDescription: 'Key factors to inspect before buying a handheld body massager in India: motor speed (RPM), weight, attachments, heat function, and cord length.',
    keywords: 'how to choose handheld massager, best handheld body massager India, family massage machine features',
    publishedDate: '2026-09-16',
    readTime: '6 min read',
    author: 'Manish Kumar',
    image: '/masage.jpg'
  },
  {
    slug: 'how-to-relieve-sciatic-nerve-pain-at-home',
    title: 'How to Relieve Sciatic Nerve Pain at Home Using Heat and Vibration',
    category: 'Pain Relief',
    metaTitle: 'Sciatica Pain Relief at Home — Massage & Stretching Guide | Afsha Enterprises',
    metaDescription: 'Practical tips to relieve radiating sciatica leg and hip pain at home. Learn safe trigger point massage techniques and piriformis stretches.',
    keywords: 'sciatica pain relief at home, sciatic nerve massager, piriformis muscle massage, lower back shooting pain relief',
    publishedDate: '2026-09-17',
    readTime: '8 min read',
    author: 'Dr. R. Sharma (PT)',
    image: '/bg.jpg'
  },
  {
    slug: 'neck-pain-relief-tips-at-home',
    title: '7 Proven Tips to Relieve Neck and Shoulder Pain at Home Fast',
    category: 'Pain Relief',
    metaTitle: 'Neck & Shoulder Pain Relief Tips at Home | Afsha Enterprises',
    metaDescription: 'Suffering from tech-neck or trapezius stiffness? Discover daily posture habits, heat wrap therapies, and Shiatsu massage routines for instant comfort.',
    keywords: 'neck pain relief tips at home, cervical neck stiffness cure, tech neck pain massager, shoulder knot relief',
    publishedDate: '2026-09-18',
    readTime: '7 min read',
    author: 'Dr. R. Sharma (PT)',
    image: '/masage.jpg'
  },
  {
    slug: 'plantar-fasciitis-foot-massager-guide',
    title: 'Plantar Fasciitis Recovery: How Foot Massagers Relieve Heel Morning Pain',
    category: 'Pain Relief',
    metaTitle: 'Plantar Fasciitis Foot Massager Guide — Heel Pain Relief | Afsha Enterprises',
    metaDescription: 'Learn how deep tissue sole kneading and arch stretching alleviate stabbing heel pain from plantar fasciitis. Recommended daily massage routine.',
    keywords: 'plantar fasciitis foot massager, heel pain relief machine India, morning foot pain cure, reflexology foot massager',
    publishedDate: '2026-09-19',
    readTime: '6 min read',
    author: 'Dr. R. Sharma (PT)',
    image: '/bg.jpg'
  },
  {
    slug: 'top-10-benefits-of-using-a-body-massager',
    title: 'Top 10 Health Benefits of Using an Electric Body Massager Daily',
    category: 'Health & Wellness',
    metaTitle: 'Top 10 Benefits of Daily Body Massage | Afsha Enterprises',
    metaDescription: 'From reducing cortisol stress hormones to improving lymphatic drainage and muscle tone, here are the top 10 science-backed benefits of home massagers.',
    keywords: 'benefits of body massager, daily massage benefits, electric massager health effects, lymphatic drainage massager',
    publishedDate: '2026-09-20',
    readTime: '6 min read',
    author: 'Afsha Editorial Team',
    image: '/masage.jpg'
  },
  {
    slug: 'cervical-spondylosis-neck-pain-exercises',
    title: 'Cervical Spondylosis: Safe Neck Massage & Rehabilitation Exercises',
    category: 'Pain Relief',
    metaTitle: 'Cervical Spondylosis Neck Pain Relief & Exercises | Afsha Enterprises',
    metaDescription: 'Complete guide for managing cervical spondylosis symptoms at home with gentle heat, rhythmic shiatsu kneading, and doctor-approved neck stretches.',
    keywords: 'cervical spondylosis massager India, neck arthritis relief, cervical spine exercises, heated neck wrap therapy',
    publishedDate: '2026-09-21',
    readTime: '7 min read',
    author: 'Dr. R. Sharma (PT)',
    image: '/bg.jpg'
  },
  {
    slug: 'how-to-use-deep-tissue-massage-gun-safely',
    title: 'How to Use a Deep Tissue Massage Gun Safely (Dos & Don’ts)',
    category: 'Usage Guide',
    metaTitle: 'How to Use a Massage Gun Safely — Complete Guide | Afsha Enterprises',
    metaDescription: 'Master your percussion massage gun: optimal speed settings, time per muscle group, attachment choices, and sensitive areas you must avoid.',
    keywords: 'how to use massage gun safely, massage gun dos and donts, percussion massager speed guide, massage gun attachments',
    publishedDate: '2026-09-21',
    readTime: '8 min read',
    author: 'Manish Kumar',
    image: '/masage.jpg'
  },
  {
    slug: 'leg-and-calf-muscle-cramps-night-relief',
    title: 'Stop Nighttime Leg & Calf Cramps: Causes & Massage Remedies',
    category: 'Pain Relief',
    metaTitle: 'Night Calf Cramps Relief & Prevention | Afsha Enterprises',
    metaDescription: 'Waking up with sudden, painful calf knots? Explore the role of blood circulation, hydration, and rhythmic vibration massagers in stopping cramps.',
    keywords: 'calf cramps night relief, leg muscle spasms remedy, calf massager machine India, restless legs syndrome massage',
    publishedDate: '2026-09-21',
    readTime: '6 min read',
    author: 'Dr. R. Sharma (PT)',
    image: '/bg.jpg'
  },
  {
    slug: 'best-foot-massager-for-diabetic-neuropathy-patients',
    title: 'Best Foot Massagers for Diabetic Neuropathy: Safety & Benefits',
    category: 'Health & Wellness',
    metaTitle: 'Foot Massager for Diabetic Neuropathy — Doctor Guide | Afsha Enterprises',
    metaDescription: 'How gentle air compression and mild thermal therapy stimulate microvascular flow in feet suffering from diabetic numbness and nerve tingling.',
    keywords: 'diabetic neuropathy foot massager, diabetic foot circulation machine, gentle foot massager diabetes India',
    publishedDate: '2026-09-21',
    readTime: '7 min read',
    author: 'Dr. R. Sharma (PT)',
    image: '/masage.jpg'
  },
  {
    slug: 'lower-back-pain-relief-for-desk-workers',
    title: 'Desk Worker Ergonomics: Eliminate Lower Back Pain from Long Sitting',
    category: 'Ergonomics',
    metaTitle: 'Lower Back Pain Relief for Desk Workers | Afsha Enterprises',
    metaDescription: 'Sitting for 8+ hours causing dull lumbar ache? Discover the 20-20-20 posture rule, chair lumbar support pads, and evening heated massage routines.',
    keywords: 'desk worker back pain relief, sitting lower back ache massager, office chair lumbar support, work from home spine relief',
    publishedDate: '2026-09-21',
    readTime: '7 min read',
    author: 'Manish Kumar',
    image: '/bg.jpg'
  },
  {
    slug: 'how-infrared-heat-therapy-relieves-joint-stiffness',
    title: 'The Science of Infrared Heat Therapy: How Warmth Relieves Joint Stiffness',
    category: 'Health & Wellness',
    metaTitle: 'Infrared Heat Therapy for Joint Stiffness | Afsha Enterprises',
    metaDescription: 'Understand how infrared thermal wavelengths penetrate 2 to 3 inches below skin tissue to dilate capillaries and ease chronic arthritis and stiffness.',
    keywords: 'infrared heat therapy benefits, heated body massager science, thermal arthritis pain relief, infrared muscle massager India',
    publishedDate: '2026-09-21',
    readTime: '6 min read',
    author: 'Dr. R. Sharma (PT)',
    image: '/masage.jpg'
  },
  {
    slug: 'cellulite-reduction-vibration-massager-guide',
    title: 'Can Vibration Massagers Reduce Cellulite? What Dermatologists Say',
    category: 'Skincare',
    metaTitle: 'Cellulite Reduction with Vibration Massagers | Afsha Enterprises',
    metaDescription: 'Learn how high-frequency multi-head vibration breaks up subcutaneous adipose deposits, promotes collagen, and smoothes dimpled thigh skin.',
    keywords: 'cellulite reduction vibration massager, anti cellulite massager machine India, skin toning body massager, thigh smoothing massager',
    publishedDate: '2026-09-21',
    readTime: '7 min read',
    author: 'Priya Deshmukh (Beauty Specialist)',
    image: '/bg.jpg'
  },
  {
    slug: 'trigger-point-therapy-for-shoulder-knots',
    title: 'Trigger Point Therapy for Shoulder Knots: Trapezius Release Techniques',
    category: 'Pain Relief',
    metaTitle: 'Trigger Point Therapy for Shoulder Knots | Afsha Enterprises',
    metaDescription: 'Find and dissolve stubborn trigger points under your shoulder blade and neck with targeted deep kneading and rhythmic percussion therapy.',
    keywords: 'shoulder knots trigger point therapy, trapezius knot release massager, shoulder blade muscle ache cure',
    publishedDate: '2026-09-21',
    readTime: '6 min read',
    author: 'Dr. R. Sharma (PT)',
    image: '/masage.jpg'
  },
  {
    slug: 'varicose-veins-leg-circulation-massager-tips',
    title: 'Varicose Veins & Swollen Legs: Safe Air Compression Massaging Tips',
    category: 'Health & Wellness',
    metaTitle: 'Varicose Veins & Leg Circulation Massager Guide | Afsha Enterprises',
    metaDescription: 'Everything you must know about using graduated pneumatic air compression boots to assist venous return and ease swollen heavy legs.',
    keywords: 'varicose veins leg massager, pneumatic compression boots India, swollen leg edema massager, safe varicose vein massage',
    publishedDate: '2026-09-21',
    readTime: '7 min read',
    author: 'Dr. R. Sharma (PT)',
    image: '/bg.jpg'
  },
  {
    slug: 'post-workout-recovery-doms-massage-gun-routine',
    title: 'Post-Workout Recovery: 10-Minute Massage Gun Routine for Zero DOMS',
    category: 'Fitness',
    metaTitle: 'Post-Workout DOMS Recovery Routine | Afsha Enterprises',
    metaDescription: 'Accelerate muscular repair after leg day or heavy lifting. Step-by-step 10-minute percussion massage protocol for quads, hamstrings, and calves.',
    keywords: 'post workout massage gun routine, DOMS muscle soreness recovery, athletic massage gun protocol, gym recovery massager',
    publishedDate: '2026-09-21',
    readTime: '8 min read',
    author: 'Manish Kumar & Fitness Coaches',
    image: '/masage.jpg'
  },
  {
    slug: 'carpal-tunnel-syndrome-wrist-and-arm-massage',
    title: 'Carpal Tunnel & Wrist Strain: Relief Strategies for Programmers & Gamers',
    category: 'Ergonomics',
    metaTitle: 'Carpal Tunnel Syndrome Wrist & Arm Massage | Afsha Enterprises',
    metaDescription: 'Relieve wrist numbness, tingling, and forearm tightness caused by typing and mouse usage. Gentle forearm vibration and tendon gliding stretches.',
    keywords: 'carpal tunnel wrist massager, typing wrist pain relief, forearm strain massage, gamer repetitive strain injury cure',
    publishedDate: '2026-09-21',
    readTime: '6 min read',
    author: 'Manish Kumar (Software Architect)',
    image: '/bg.jpg'
  },
  {
    slug: 'headache-and-migraine-relief-with-scalp-massager',
    title: 'Headache and Tension Migraine Relief Through Scalp Massage',
    category: 'Pain Relief',
    metaTitle: 'Scalp Massage for Migraine & Headache Relief | Afsha Enterprises',
    metaDescription: 'How stimulating scalp nerves and suboccipital muscles reduces vascular constriction, lowering headache frequency and intensity naturally.',
    keywords: 'scalp massager for headache, tension migraine relief machine, head claw massager India, suboccipital tension relief',
    publishedDate: '2026-09-21',
    readTime: '6 min read',
    author: 'Afsha Editorial Team',
    image: '/masage.jpg'
  },
  {
    slug: 'senior-citizen-joint-mobility-gentle-massage-guide',
    title: 'Gentle Home Massage for Seniors: Supporting Joint Flexibility & Sleep',
    category: 'Senior Care',
    metaTitle: 'Senior Citizen Gentle Massage Guide | Afsha Enterprises',
    metaDescription: 'A loving guide for elderly parents: choosing lightweight, low-vibration massagers with heat that soothe arthritic knees, hips, and shoulders safely.',
    keywords: 'massager for senior citizens India, elderly joint pain relief machine, gentle massager for parents, arthritis safe massage',
    publishedDate: '2026-09-21',
    readTime: '7 min read',
    author: 'Dr. R. Sharma (PT)',
    image: '/bg.jpg'
  },
  {
    slug: 'stress-relief-and-sleep-improvement-evening-massage',
    title: 'Insomnia & Anxiety: The 15-Minute Evening Massage Protocol for Deep Sleep',
    category: 'Health & Wellness',
    metaTitle: 'Evening Massage Routine for Insomnia & Deep Sleep | Afsha Enterprises',
    metaDescription: 'Transform restless nights into deep restorative sleep. Discover how soothing back and foot vibrations trigger parasympathetic relaxation.',
    keywords: 'evening massage routine deep sleep, massager for insomnia and anxiety, relaxing bedtime body massage, stress relief massager',
    publishedDate: '2026-09-21',
    readTime: '6 min read',
    author: 'Afsha Editorial Team',
    image: '/masage.jpg'
  },
  {
    slug: 'knee-osteoarthritis-pain-relief-physiotherapy-at-home',
    title: 'Knee Osteoarthritis: At-Home Physiotherapy, Heat & Vibration Care',
    category: 'Pain Relief',
    metaTitle: 'Knee Osteoarthritis Home Care & Massager Guide | Afsha Enterprises',
    metaDescription: 'Relieve knee stiffness, joint friction, and swelling at home. Safe techniques combining quad-strengthening exercises with therapeutic thermal massage.',
    keywords: 'knee osteoarthritis massager India, knee joint pain relief machine, home knee physiotherapy, arthritis knee heat wrap',
    publishedDate: '2026-09-21',
    readTime: '8 min read',
    author: 'Dr. R. Sharma (PT)',
    image: '/bg.jpg'
  },
  {
    slug: 'how-to-remove-facial-hair-without-bumps-or-redness',
    title: 'How to Shave & Trim Facial Hair Without Razor Bumps or Redness',
    category: 'Skincare',
    metaTitle: 'Facial Hair Trimming Without Bumps or Irritation | Afsha Enterprises',
    metaDescription: 'Prevent ingrown hairs, strawberry skin, and redness with pre-shave hydration, hypoallergenic micro-blades, and soothing aloe vera aftercare.',
    keywords: 'remove facial hair without bumps, hypoallergenic face trimmer women, prevent razor bumps face, flawless facial hair removal',
    publishedDate: '2026-09-21',
    readTime: '6 min read',
    author: 'Priya Deshmukh (Beauty Specialist)',
    image: '/masage.jpg'
  },
  {
    slug: 'eyebrow-trimmer-vs-threading-waxing-comparison',
    title: 'Precision Eyebrow Trimmer vs Threading & Waxing: Cost & Pain Breakdown',
    category: 'Skincare',
    metaTitle: 'Eyebrow Trimmer vs Threading & Waxing Comparison | Afsha Enterprises',
    metaDescription: 'Tired of salon visits and eye-watering threading pain? See why 85% of modern Indian women prefer home precision eyebrow styling pens.',
    keywords: 'eyebrow trimmer vs threading, painless eyebrow pen vs wax, save salon money eyebrow trimmer, precision brow grooming',
    publishedDate: '2026-09-21',
    readTime: '5 min read',
    author: 'Priya Deshmukh (Beauty Specialist)',
    image: '/bg.jpg'
  },
  {
    slug: 'korean-skin-facial-massager-anti-aging-benefits',
    title: 'Why Korean Skin Facial Massagers Are Taking Over Indian Skincare',
    category: 'Skincare',
    metaTitle: 'Korean Skin Facial Massager Benefits & Routine | Afsha Enterprises',
    metaDescription: 'Unlock glass skin at home: explore how EMS microcurrent and sonic pulse technology firm sagging jowls and boost hyaluronic acid penetration.',
    keywords: 'Korean skin facial massager India, glass skin facial tool, EMS microcurrent face lift, anti aging sonic face wand',
    publishedDate: '2026-09-21',
    readTime: '7 min read',
    author: 'Priya Deshmukh (Beauty Specialist)',
    image: '/masage.jpg'
  },
  {
    slug: 'blackhead-remover-pore-vacuum-dos-and-donts',
    title: 'Pore Vacuum Blackhead Extractors: The Essential Dos & Don’ts',
    category: 'Skincare',
    metaTitle: 'Blackhead Pore Vacuum Dos & Don’ts | Afsha Enterprises',
    metaDescription: 'Extract blackheads like a licensed esthetician: steaming pores first, moving constantly to prevent suction bruises, and locking pores with toner.',
    keywords: 'pore vacuum blackhead remover dos and donts, how to use blackhead vacuum safely, avoid suction bruises pore cleaner',
    publishedDate: '2026-09-21',
    readTime: '6 min read',
    author: 'Priya Deshmukh (Beauty Specialist)',
    image: '/bg.jpg'
  },
  {
    slug: 'portable-car-vacuum-cleaner-car-detailing-guide',
    title: 'DIY Car Detailing: How to Clean Every Crevice with a Portable Vacuum',
    category: 'Automotive',
    metaTitle: 'DIY Car Detailing with Portable Vacuum Cleaners | Afsha Enterprises',
    metaDescription: 'Step-by-step guide to showroom-clean car interiors: cleaning AC louvers, cup holders, floor mats, and seat seams with high-suction cordless tools.',
    keywords: 'portable car vacuum cleaner guide, DIY car interior detailing, cordless car vacuum India, cleaning car floor mats crumbs',
    publishedDate: '2026-09-21',
    readTime: '6 min read',
    author: 'Manish Kumar',
    image: '/masage.jpg'
  },
  {
    slug: 'high-pressure-car-washer-water-saving-tips',
    title: 'High-Pressure Car Washers: Save 80% More Water Than Regular Hoses',
    category: 'Automotive',
    metaTitle: 'Save Water with High-Pressure Car Washers | Afsha Enterprises',
    metaDescription: 'Did you know traditional garden hoses waste 300+ liters per wash? Learn how high-pressure washers clean vehicles with only 40 liters of water.',
    keywords: 'high pressure car washer water saving, eco friendly vehicle washing, pressure washer vs garden hose, cordless pressure washer India',
    publishedDate: '2026-09-21',
    readTime: '5 min read',
    author: 'Afsha Editorial Team',
    image: '/bg.jpg'
  },
  {
    slug: 'steam-iron-vs-garment-steamer-fabric-care-guide',
    title: 'Handheld Garment Steamer vs Traditional Steam Iron: Fabric Care Guide',
    category: 'Home & Living',
    metaTitle: 'Handheld Garment Steamer vs Traditional Iron | Afsha Enterprises',
    metaDescription: 'Which is better for silk, linen, suits, and daily cottons? Compare vertical handheld steamers with traditional heavy flat irons.',
    keywords: 'garment steamer vs traditional steam iron, clothes steamer for silk and sarees, portable travel garment steamer India',
    publishedDate: '2026-09-21',
    readTime: '6 min read',
    author: 'Afsha Editorial Team',
    image: '/masage.jpg'
  },
  {
    slug: 'how-to-clean-sofa-and-mattress-with-home-vacuum',
    title: 'Deep Cleaning Sofas & Mattresses at Home: Dust Mite & Allergen Removal',
    category: 'Home & Living',
    metaTitle: 'How to Clean Sofas & Mattresses with Home Vacuums | Afsha Enterprises',
    metaDescription: 'Eliminate hidden dust mites, pet dander, and allergens from upholstery with high-suction portable vacuum cleaners and baking soda.',
    keywords: 'clean sofa mattress dust mites vacuum, home upholstery cleaning machine, mattress allergen cleaner India',
    publishedDate: '2026-09-21',
    readTime: '6 min read',
    author: 'Afsha Editorial Team',
    image: '/bg.jpg'
  },
  {
    slug: 'foldable-outdoor-picnic-table-setup-maintenance',
    title: 'Setting Up & Maintaining Your Aluminum Folding Picnic Table',
    category: 'Home & Living',
    metaTitle: 'Foldable Picnic Table Setup & Care Guide | Afsha Enterprises',
    metaDescription: 'Make the most of camping trips and family terrace parties with simple setup tips, weight limits, and rust-prevention maintenance for folding tables.',
    keywords: 'foldable picnic table setup tips, outdoor camping table care, aluminum folding furniture maintenance',
    publishedDate: '2026-09-21',
    readTime: '5 min read',
    author: 'Afsha Editorial Team',
    image: '/masage.jpg'
  },
  {
    slug: 'scalp-massage-for-hair-growth-and-blood-circulation',
    title: 'Can Scalp Massage Stimulate Hair Growth? The Science of Follicle Stimulation',
    category: 'Hair Care',
    metaTitle: 'Scalp Massage for Hair Growth & Circulation | Afsha Enterprises',
    metaDescription: 'Clinical studies show 4 minutes of daily mechanical scalp massage increases dermal papilla thickness, awakening dormant follicles and thickening hair.',
    keywords: 'scalp massager hair growth science, hair follicle stimulation massage, prevent hair fall scalp massage machine India',
    publishedDate: '2026-09-21',
    readTime: '7 min read',
    author: 'Dr. R. Sharma (PT) & Dermatologists',
    image: '/bg.jpg'
  },
  {
    slug: 'heatless-hair-straightening-tips-for-healthy-hair',
    title: 'Heatless Hair Straightening: How to Tame Frizz Without High Heat Damage',
    category: 'Hair Care',
    metaTitle: 'Heatless Hair Straightening & Frizz Taming | Afsha Enterprises',
    metaDescription: 'Protect hair cuticles from burning. Learn how ionic ceramic straightener brushes smooth split ends and seal moisture with zero scorch marks.',
    keywords: 'heatless hair straightening brush, straight hair without heat damage, ionic ceramic brush for frizzy hair India',
    publishedDate: '2026-09-21',
    readTime: '6 min read',
    author: 'Priya Deshmukh (Beauty Specialist)',
    image: '/masage.jpg'
  },
  {
    slug: 'automatic-hair-curler-styling-guide-for-beginners',
    title: 'Automatic Hair Curler Guide for Beginners: 5 Steps to Perfect Curls',
    category: 'Hair Care',
    metaTitle: 'Automatic Hair Curler Beginner Styling Guide | Afsha Enterprises',
    metaDescription: 'Zero burning, zero wrist fatigue: master the automatic revolving hair curler for bouncy salon waves, tight spirals, or casual messy curls.',
    keywords: 'automatic hair curler beginner guide, how to use auto rotating curling iron, beach waves tutorial automatic curler',
    publishedDate: '2026-09-21',
    readTime: '6 min read',
    author: 'Priya Deshmukh (Beauty Specialist)',
    image: '/bg.jpg'
  },
  {
    slug: 'sciatica-nerve-stretch-and-percussion-massage-routine',
    title: 'Sciatica Relief Routine: Combining Targeted Percussion Massage with Stretches',
    category: 'Pain Relief',
    metaTitle: 'Sciatica Percussion Massage & Stretches Protocol | Afsha Enterprises',
    metaDescription: 'Physiotherapist-designed 15-minute routine: glute massage gun myofascial release combined with figure-4 stretches to decompress the sciatic nerve.',
    keywords: 'sciatica massage gun protocol, piriformis syndrome percussion therapy, sciatic nerve stretches and massager',
    publishedDate: '2026-09-21',
    readTime: '8 min read',
    author: 'Dr. R. Sharma (PT)',
    image: '/masage.jpg'
  },
  {
    slug: 'muscle-spasms-in-upper-back-causes-and-remedies',
    title: 'Upper Back Muscle Spasms: Causes, Quick Relief & Prevention',
    category: 'Pain Relief',
    metaTitle: 'Upper Back Muscle Spasms Causes & Relief | Afsha Enterprises',
    metaDescription: 'Sudden sharp pain when breathing or turning? Identify rhomboid and thoracic muscle spasms and relieve them with heated vibratory therapy.',
    keywords: 'upper back muscle spasm relief, rhomboid muscle pain massager, sharp thoracic back pain cure, heated back kneading',
    publishedDate: '2026-09-21',
    readTime: '7 min read',
    author: 'Dr. R. Sharma (PT)',
    image: '/bg.jpg'
  },
  {
    slug: 'foot-reflexology-chart-pressure-points-guide',
    title: 'Foot Reflexology Pressure Points Chart: Relieving Whole-Body Stress',
    category: 'Health & Wellness',
    metaTitle: 'Foot Reflexology Chart & Pressure Points Guide | Afsha Enterprises',
    metaDescription: 'Explore ancient reflexology zones on the soles of your feet. How targeting solar plexus, spine, and sinus points induces full-body homeostasis.',
    keywords: 'foot reflexology chart India, pressure points foot massager machine, sole massage for organ health, reflexology points guide',
    publishedDate: '2026-09-21',
    readTime: '7 min read',
    author: 'Dr. R. Sharma (PT)',
    image: '/masage.jpg'
  },
  {
    slug: 'lumbar-spine-decompression-and-vibration-therapy',
    title: 'Lumbar Spine Decompression: How Vibration Relieves Disc Pressure',
    category: 'Pain Relief',
    metaTitle: 'Lumbar Spine Decompression & Vibration Therapy | Afsha Enterprises',
    metaDescription: 'How gentle rhythmic oscillation relaxes tight quadratus lumborum muscles, encouraging intravertebral disc hydration and natural spinal decompression.',
    keywords: 'lumbar spine decompression massager, disc bulge lower back massage, quadratus lumborum pain relief, spine relaxing machine India',
    publishedDate: '2026-09-21',
    readTime: '8 min read',
    author: 'Dr. R. Sharma (PT)',
    image: '/bg.jpg'
  }
];

// 4. TOP 80 INDIAN CITIES & METROPOLITAN COMMERCE HUBS
const CITIES_DATA = [
  { slug: 'delhi', city: 'Delhi NCR', state: 'Delhi' },
  { slug: 'mumbai', city: 'Mumbai', state: 'Maharashtra' },
  { slug: 'bangalore', city: 'Bangalore (Bengaluru)', state: 'Karnataka' },
  { slug: 'hyderabad', city: 'Hyderabad', state: 'Telangana' },
  { slug: 'chennai', city: 'Chennai', state: 'Tamil Nadu' },
  { slug: 'kolkata', city: 'Kolkata', state: 'West Bengal' },
  { slug: 'pune', city: 'Pune', state: 'Maharashtra' },
  { slug: 'ahmedabad', city: 'Ahmedabad', state: 'Gujarat' },
  { slug: 'jaipur', city: 'Jaipur', state: 'Rajasthan' },
  { slug: 'surat', city: 'Surat', state: 'Gujarat' },
  { slug: 'lucknow', city: 'Lucknow', state: 'Uttar Pradesh' },
  { slug: 'kanpur', city: 'Kanpur', state: 'Uttar Pradesh' },
  { slug: 'nagpur', city: 'Nagpur', state: 'Maharashtra' },
  { slug: 'indore', city: 'Indore', state: 'Madhya Pradesh' },
  { slug: 'thane', city: 'Thane', state: 'Maharashtra' },
  { slug: 'bhopal', city: 'Bhopal', state: 'Madhya Pradesh' },
  { slug: 'visakhapatnam', city: 'Visakhapatnam', state: 'Andhra Pradesh' },
  { slug: 'pimpri-chinchwad', city: 'Pimpri-Chinchwad', state: 'Maharashtra' },
  { slug: 'patna', city: 'Patna', state: 'Bihar' },
  { slug: 'vadodara', city: 'Vadodara', state: 'Gujarat' },
  { slug: 'ghaziabad', city: 'Ghaziabad', state: 'Uttar Pradesh' },
  { slug: 'ludhiana', city: 'Ludhiana', state: 'Punjab' },
  { slug: 'agra', city: 'Agra', state: 'Uttar Pradesh' },
  { slug: 'nashik', city: 'Nashik', state: 'Maharashtra' },
  { slug: 'faridabad', city: 'Faridabad', state: 'Haryana' },
  { slug: 'meerut', city: 'Meerut', state: 'Uttar Pradesh' },
  { slug: 'rajkot', city: 'Rajkot', state: 'Gujarat' },
  { slug: 'kalyan-dombivli', city: 'Kalyan-Dombivli', state: 'Maharashtra' },
  { slug: 'vasai-virar', city: 'Vasai-Virar', state: 'Maharashtra' },
  { slug: 'varanasi', city: 'Varanasi', state: 'Uttar Pradesh' },
  { slug: 'srinagar', city: 'Srinagar', state: 'Jammu and Kashmir' },
  { slug: 'aurangabad', city: 'Aurangabad (Chhatrapati Sambhaji Nagar)', state: 'Maharashtra' },
  { slug: 'dhanbad', city: 'Dhanbad', state: 'Jharkhand' },
  { slug: 'amritsar', city: 'Amritsar', state: 'Punjab' },
  { slug: 'navi-mumbai', city: 'Navi Mumbai', state: 'Maharashtra' },
  { slug: 'prayagraj', city: 'Prayagraj (Allahabad)', state: 'Uttar Pradesh' },
  { slug: 'ranchi', city: 'Ranchi', state: 'Jharkhand' },
  { slug: 'howrah', city: 'Howrah', state: 'West Bengal' },
  { slug: 'coimbatore', city: 'Coimbatore', state: 'Tamil Nadu' },
  { slug: 'jabalpur', city: 'Jabalpur', state: 'Madhya Pradesh' },
  { slug: 'gwalior', city: 'Gwalior', state: 'Madhya Pradesh' },
  { slug: 'vijayawada', city: 'Vijayawada', state: 'Andhra Pradesh' },
  { slug: 'jodhpur', city: 'Jodhpur', state: 'Rajasthan' },
  { slug: 'madurai', city: 'Madurai', state: 'Tamil Nadu' },
  { slug: 'raipur', city: 'Raipur', state: 'Chhattisgarh' },
  { slug: 'kota', city: 'Kota', state: 'Rajasthan' },
  { slug: 'guwahati', city: 'Guwahati', state: 'Assam' },
  { slug: 'chandigarh', city: 'Chandigarh', state: 'Chandigarh' },
  { slug: 'solapur', city: 'Solapur', state: 'Maharashtra' },
  { slug: 'hubli-dharwad', city: 'Hubli-Dharwad', state: 'Karnataka' },
  { slug: 'bareilly', city: 'Bareilly', state: 'Uttar Pradesh' },
  { slug: 'moradabad', city: 'Moradabad', state: 'Uttar Pradesh' },
  { slug: 'mysore', city: 'Mysore (Mysuru)', state: 'Karnataka' },
  { slug: 'gurgaon', city: 'Gurgaon (Gurugram)', state: 'Haryana' },
  { slug: 'aligarh', city: 'Aligarh', state: 'Uttar Pradesh' },
  { slug: 'jalandhar', city: 'Jalandhar', state: 'Punjab' },
  { slug: 'tiruchirappalli', city: 'Tiruchirappalli', state: 'Tamil Nadu' },
  { slug: 'bhubaneswar', city: 'Bhubaneswar', state: 'Odisha' },
  { slug: 'salem', city: 'Salem', state: 'Tamil Nadu' },
  { slug: 'mira-bhayandar', city: 'Mira-Bhayandar', state: 'Maharashtra' },
  { slug: 'warangal', city: 'Warangal', state: 'Telangana' },
  { slug: 'thiruvananthapuram', city: 'Thiruvananthapuram', state: 'Kerala' },
  { slug: 'guntur', city: 'Guntur', state: 'Andhra Pradesh' },
  { slug: 'bhiwandi', city: 'Bhiwandi', state: 'Maharashtra' },
  { slug: 'saharanpur', city: 'Saharanpur', state: 'Uttar Pradesh' },
  { slug: 'gorakhpur', city: 'Gorakhpur', state: 'Uttar Pradesh' },
  { slug: 'bikaner', city: 'Bikaner', state: 'Rajasthan' },
  { slug: 'amravati', city: 'Amravati', state: 'Maharashtra' },
  { slug: 'noida', city: 'Noida & Greater Noida', state: 'Uttar Pradesh' },
  { slug: 'jamshedpur', city: 'Jamshedpur', state: 'Jharkhand' },
  { slug: 'bhilai', city: 'Bhilai', state: 'Chhattisgarh' },
  { slug: 'cuttack', city: 'Cuttack', state: 'Odisha' },
  { slug: 'firozabad', city: 'Firozabad', state: 'Uttar Pradesh' },
  { slug: 'kochi', city: 'Kochi (Cochin)', state: 'Kerala' },
  { slug: 'nellore', city: 'Nellore', state: 'Andhra Pradesh' },
  { slug: 'bhavnagar', city: 'Bhavnagar', state: 'Gujarat' },
  { slug: 'dehradun', city: 'Dehradun', state: 'Uttarakhand' },
  { slug: 'durgapur', city: 'Durgapur', state: 'West Bengal' },
  { slug: 'asansol', city: 'Asansol', state: 'West Bengal' },
  { slug: 'rourkela', city: 'Rourkela', state: 'Odisha' }
];

const ALL_LOCATIONS = CITIES_DATA.map(c => ({
  slug: c.slug,
  city: c.city,
  state: c.state,
  metaTitle: `Electric Body Massagers & Pain Relief in ${c.city}, ${c.state} — Fast Delivery | Afsha Enterprises`,
  metaDescription: `Buy high-grade electric body massagers, deep tissue massage guns, and pain relief devices in ${c.city}, ${c.state}. Cash on Delivery, genuine warranty, and 2-3 day express courier.`,
  keywords: `electric body massager ${c.city}, buy massage gun ${c.city}, pain relief massager machine ${c.state}, neck back massager ${c.city}, Afsha Enterprises ${c.city}`
}));

// REUSABLE SEO INTERNAL LINKING FOOTER
function generateSeoFooter() {
  const topCities = ALL_LOCATIONS.slice(0, 24);
  const topBlogs = ALL_BLOGS.slice(0, 16);
  const topProducts = ALL_PRODUCTS.slice(0, 12);

  return `
  <section class="seo-hub-section" style="background:#0b1329; color:#94a3b8; padding:50px 20px; font-size:0.85rem; border-top:1px solid #1e293b; margin-top:60px;">
    <div style="max-width:1160px; margin:0 auto;">
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:32px; text-align:left;">
        <div>
          <h4 style="color:#ffffff; font-size:1rem; font-weight:800; margin-bottom:14px; text-transform:uppercase; letter-spacing:0.5px;">Explore Categories</h4>
          <ul style="list-style:none; padding:0; margin:0; line-height:2;">
            ${ALL_CATEGORIES.map(c => `<li><a href="/category/${c.slug}" style="color:#cbd5e1; text-decoration:none;">${c.name}</a></li>`).join('')}
            <li><a href="/products" style="color:#f59e0b; text-decoration:none; font-weight:700;">View All Products →</a></li>
          </ul>
        </div>
        <div>
          <h4 style="color:#ffffff; font-size:1rem; font-weight:800; margin-bottom:14px; text-transform:uppercase; letter-spacing:0.5px;">Popular Products</h4>
          <ul style="list-style:none; padding:0; margin:0; line-height:2;">
            ${topProducts.map(p => `<li><a href="/product/${p.slug}" style="color:#cbd5e1; text-decoration:none;">${p.name}</a></li>`).join('')}
          </ul>
        </div>
        <div>
          <h4 style="color:#ffffff; font-size:1rem; font-weight:800; margin-bottom:14px; text-transform:uppercase; letter-spacing:0.5px;">Pain Relief &amp; Guides</h4>
          <ul style="list-style:none; padding:0; margin:0; line-height:2;">
            ${topBlogs.map(b => `<li><a href="/blog/${b.slug}" style="color:#cbd5e1; text-decoration:none;">${b.title}</a></li>`).join('')}
            <li><a href="/blogs" style="color:#f59e0b; text-decoration:none; font-weight:700;">Browse All Guides →</a></li>
          </ul>
        </div>
        <div>
          <h4 style="color:#ffffff; font-size:1rem; font-weight:800; margin-bottom:14px; text-transform:uppercase; letter-spacing:0.5px;">Express Delivery Cities</h4>
          <div style="display:flex; flex-wrap:wrap; gap:8px 12px; line-height:1.8;">
            ${topCities.map(c => `<a href="/locations/${c.slug}" style="color:#94a3b8; text-decoration:none; font-size:0.82rem;">${c.city}</a>`).join(' • ')}
          </div>
        </div>
      </div>
      <div style="margin-top:40px; padding-top:20px; border-top:1px solid #1e293b; text-align:center; color:#64748b;">
        <p>© 2026 Afsha Enterprises. All rights reserved. Registered Indian E-Commerce Brand.</p>
        <p style="margin-top:8px;">
          <a href="/" style="color:#cbd5e1; margin:0 8px; text-decoration:none;">Home</a> |
          <a href="/products" style="color:#cbd5e1; margin:0 8px; text-decoration:none;">Products</a> |
          <a href="/blogs" style="color:#cbd5e1; margin:0 8px; text-decoration:none;">Blog</a> |
          <a href="/contact" style="color:#cbd5e1; margin:0 8px; text-decoration:none;">Contact</a> |
          <a href="/manish-kumar" style="color:#cbd5e1; margin:0 8px; text-decoration:none;">Developer Profile</a>
        </p>
      </div>
    </div>
  </section>
  `;
}

// 5. HTML GENERATORS
function generateProductHtml(p) {
  const canonicalUrl = `${DOMAIN}/product/${p.slug}`;
  const imageUrl = `${DOMAIN}${p.image}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${canonicalUrl}#product`,
        "name": p.name,
        "description": p.metaDescription,
        "image": [imageUrl],
        "category": p.category,
        "brand": { "@type": "Brand", "name": "Afsha Enterprises" },
        "offers": {
          "@type": "Offer",
          "price": p.price,
          "priceCurrency": "INR",
          "availability": "https://schema.org/InStock",
          "url": canonicalUrl,
          "seller": { "@type": "Organization", "name": "Afsha Enterprises" }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": p.rating,
          "reviewCount": p.reviews
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": `${DOMAIN}/` },
          { "@type": "ListItem", "position": 2, "name": "Products", "item": `${DOMAIN}/products` },
          { "@type": "ListItem", "position": 3, "name": p.name, "item": canonicalUrl }
        ]
      }
    ]
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.metaTitle}</title>
  <meta name="description" content="${p.metaDescription}">
  <meta name="keywords" content="${p.keywords}">
  <link rel="canonical" href="${canonicalUrl}">
  <meta property="og:type" content="product">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${p.metaTitle}">
  <meta property="og:description" content="${p.metaDescription}">
  <meta property="og:image" content="${imageUrl}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <script type="application/ld+json">${JSON.stringify(jsonLd, null, 2)}</script>
  <style>
    :root { --primary: #f59e0b; --primary-dark: #d97706; --text: #0f172a; --muted: #64748b; --bg: #f8fafc; --card-bg: #ffffff; --border: #e2e8f0; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }
    .container { max-width: 1120px; margin: 0 auto; padding: 0 20px; }
    .header { background: #ffffff; border-bottom: 1px solid var(--border); padding: 14px 0; position: sticky; top: 0; z-index: 50; }
    .header-inner { display: flex; align-items: center; justify-content: space-between; }
    .logo { font-size: 1.2rem; font-weight: 900; color: var(--text); text-decoration: none; }
    .logo span { color: var(--primary); }
    .nav-links { display: flex; gap: 20px; align-items: center; }
    .nav-links a { color: var(--text); text-decoration: none; font-weight: 600; font-size: 0.9rem; }
    .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin: 40px 0; background: #fff; padding: 36px; border-radius: 24px; border: 1px solid var(--border); }
    @media (max-width: 768px) { .hero-grid { grid-template-columns: 1fr; padding: 20px; } }
    .img-box { text-align: center; background: radial-gradient(circle, #f8fafc 40%, #e2e8f0 100%); border-radius: 16px; padding: 30px; display:flex; align-items:center; justify-content:center; }
    .img-box img { max-height: 380px; max-width: 100%; object-fit: contain; }
    .prod-cat { font-size: 0.8rem; font-weight: 800; color: var(--primary-dark); text-transform: uppercase; margin-bottom: 8px; }
    h1 { font-size: 2rem; font-weight: 900; line-height: 1.25; margin-bottom: 12px; }
    .rating-row { color: #f59e0b; font-weight: 700; margin-bottom: 16px; }
    .price-box { display: flex; align-items: baseline; gap: 12px; margin: 20px 0; }
    .price { font-size: 2.2rem; font-weight: 900; color: #0f172a; }
    .orig-price { font-size: 1.2rem; color: #94a3b8; text-decoration: line-through; }
    .discount { background: #dcfce7; color: #15803d; font-weight: 800; padding: 4px 10px; border-radius: 8px; }
    .btn-buy { display: inline-block; background: #0f172a; color: #ffffff; padding: 14px 32px; border-radius: 12px; font-weight: 800; font-size: 1.05rem; text-decoration: none; margin-top: 20px; text-align: center; }
    .btn-buy:hover { background: #1e293b; }
    .highlights-box { margin-top: 24px; background: #f8fafc; padding: 20px; border-radius: 12px; }
    .highlights-box h3 { font-size: 1rem; margin-bottom: 10px; }
    .highlights-box li { margin-left: 20px; margin-bottom: 6px; }
  </style>
</head>
<body>
  <header class="header">
    <div class="container header-inner">
      <a href="/" class="logo">Afsha <span>Enterprises</span></a>
      <nav class="nav-links">
        <a href="/">Home</a>
        <a href="/products">Products</a>
        <a href="/blogs">Blog</a>
        <a href="/contact">Contact</a>
      </nav>
    </div>
  </header>
  <main class="container">
    <div class="hero-grid">
      <div class="img-box">
        <img src="${p.image}" alt="${p.name}" loading="eager">
      </div>
      <div>
        <div class="prod-cat">${p.category}</div>
        <h1>${p.name}</h1>
        <div class="rating-row">★ ${p.rating} / 5.0 (${p.reviews} verified customer reviews)</div>
        <p style="color:#475569; font-size:1.05rem;">${p.headline}</p>
        <div class="price-box">
          <span class="price">₹${p.price}</span>
          <span class="orig-price">₹${p.originalPrice}</span>
          <span class="discount">${p.discountPercent}% OFF</span>
        </div>
        <p style="color:#16a34a; font-weight:700; margin-bottom:10px;">✓ In Stock — Free All-India Express Delivery &amp; Cash on Delivery Available</p>
        <a href="/products" class="btn-buy">Buy Now on Afsha Store →</a>
        <div class="highlights-box">
          <h3>Key Features &amp; Specifications:</h3>
          <ul>
            ${p.highlights.map(h => `<li>${h}</li>`).join('')}
          </ul>
        </div>
      </div>
    </div>
    <div style="background:#fff; border-radius:24px; padding:36px; border:1px solid var(--border); margin-bottom:40px;">
      <h2 style="font-size:1.5rem; margin-bottom:16px;">Product Overview &amp; Health Benefits</h2>
      <p style="color:#475569; font-size:1.05rem; line-height:1.8;">
        The <strong>${p.name}</strong> from Afsha Enterprises is engineered for everyday home wellness and clinical-level relief. Built with high-grade components, silent high-torque motors, and durable safety engineering, it delivers consistent deep muscle kneading, tension release, and accelerated recovery.
      </p>
    </div>
  </main>
  ${generateSeoFooter()}
</body>
</html>`;
}

function generateCategoryHtml(cat) {
  const canonicalUrl = `${DOMAIN}/category/${cat.slug}`;
  const prodsInCat = ALL_PRODUCTS.filter(p => p.category.toLowerCase().includes(cat.slug) || cat.slug === 'massager');
  const prods = prodsInCat.length ? prodsInCat : ALL_PRODUCTS.slice(0, 6);

  const productCards = prods.map(p => `
    <a href="/product/${p.slug}" class="product-card" style="background:#fff; border:1px solid #e2e8f0; border-radius:16px; overflow:hidden; text-decoration:none; color:inherit; display:flex; flex-direction:column;">
      <div style="padding:20px; text-align:center; height:200px; display:flex; align-items:center; justify-content:center; background:#f8fafc;">
        <img src="${p.image}" alt="${p.name}" style="max-height:160px; max-width:90%; object-fit:contain;" loading="lazy">
      </div>
      <div style="padding:16px; flex-grow:1; display:flex; flex-direction:column;">
        <div style="font-size:0.75rem; font-weight:800; color:#d97706; text-transform:uppercase;">${p.category}</div>
        <h3 style="font-size:1rem; font-weight:800; margin:6px 0;">${p.name}</h3>
        <div style="margin-top:auto; padding-top:10px; display:flex; justify-content:space-between; align-items:baseline;">
          <span style="font-size:1.25rem; font-weight:900; color:#0f172a;">₹${p.price}</span>
          <span style="font-size:0.85rem; color:#16a34a; font-weight:700;">${p.discountPercent}% OFF</span>
        </div>
      </div>
    </a>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cat.metaTitle}</title>
  <meta name="description" content="${cat.metaDescription}">
  <meta name="keywords" content="${cat.keywords}">
  <link rel="canonical" href="${canonicalUrl}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${cat.metaTitle}">
  <meta property="og:description" content="${cat.metaDescription}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #0f172a; line-height: 1.6; }
    .container { max-width: 1120px; margin: 0 auto; padding: 0 20px; }
    .header { background: #ffffff; border-bottom: 1px solid #e2e8f0; padding: 14px 0; }
    .header-inner { display: flex; align-items: center; justify-content: space-between; }
    .logo { font-size: 1.2rem; font-weight: 900; color: #0f172a; text-decoration: none; }
    .logo span { color: #f59e0b; }
    .nav-links { display: flex; gap: 20px; align-items: center; }
    .nav-links a { color: #0f172a; text-decoration: none; font-weight: 600; font-size: 0.9rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 24px; margin: 36px 0; }
  </style>
</head>
<body>
  <header class="header">
    <div class="container header-inner">
      <a href="/" class="logo">Afsha <span>Enterprises</span></a>
      <nav class="nav-links">
        <a href="/">Home</a>
        <a href="/products">Products</a>
        <a href="/blogs">Blog</a>
        <a href="/contact">Contact</a>
      </nav>
    </div>
  </header>
  <main class="container" style="padding-top:40px;">
    <h1 style="font-size:2.2rem; font-weight:900;">${cat.name}</h1>
    <p style="color:#64748b; font-size:1.1rem; margin-top:8px; max-width:800px;">${cat.metaDescription}</p>
    <div class="grid">
      ${productCards}
    </div>
  </main>
  ${generateSeoFooter()}
</body>
</html>`;
}

function generateBlogHtml(b) {
  const canonicalUrl = `${DOMAIN}/blog/${b.slug}`;
  const imageUrl = `${DOMAIN}${b.image}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${canonicalUrl}#article`,
        "headline": b.title,
        "description": b.metaDescription,
        "image": imageUrl,
        "datePublished": `${b.publishedDate}T09:00:00+05:30`,
        "author": { "@type": "Person", "name": b.author, "url": `${DOMAIN}/manish-kumar` },
        "publisher": { "@type": "Organization", "name": "Afsha Enterprises", "url": DOMAIN }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": `${DOMAIN}/` },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${DOMAIN}/blogs` },
          { "@type": "ListItem", "position": 3, "name": b.title, "item": canonicalUrl }
        ]
      }
    ]
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${b.metaTitle}</title>
  <meta name="description" content="${b.metaDescription}">
  <meta name="keywords" content="${b.keywords}">
  <link rel="canonical" href="${canonicalUrl}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${b.title}">
  <meta property="og:description" content="${b.metaDescription}">
  <meta property="og:image" content="${imageUrl}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <script type="application/ld+json">${JSON.stringify(jsonLd, null, 2)}</script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #faf9f6; color: #1e293b; line-height: 1.75; }
    .container { max-width: 860px; margin: 0 auto; padding: 40px 20px; }
    .header { background: #ffffff; border-bottom: 1px solid #e2e8f0; padding: 14px 0; }
    .header-inner { max-width: 1120px; margin: 0 auto; padding: 0 20px; display: flex; align-items: center; justify-content: space-between; }
    .logo { font-size: 1.2rem; font-weight: 900; color: #0f172a; text-decoration: none; }
    .logo span { color: #f59e0b; }
    .nav-links { display: flex; gap: 20px; align-items: center; }
    .nav-links a { color: #0f172a; text-decoration: none; font-weight: 600; font-size: 0.9rem; }
    .article-card { background: #ffffff; border-radius: 24px; padding: 40px; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
    .chip { background: #e0f2fe; color: #0284c7; font-weight: 800; font-size: 0.8rem; padding: 4px 12px; border-radius: 999px; display: inline-block; margin-bottom: 14px; }
    h1 { font-size: 2.2rem; font-weight: 900; color: #0f172a; margin-bottom: 16px; line-height: 1.3; }
    .meta { display: flex; gap: 16px; color: #64748b; font-size: 0.88rem; margin-bottom: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px; }
    .hero-img { width: 100%; max-height: 360px; object-fit: cover; border-radius: 16px; margin-bottom: 30px; }
    h2 { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 32px 0 14px; }
    p { margin-bottom: 18px; font-size: 1.05rem; color: #334155; }
    ul { margin-bottom: 20px; padding-left: 24px; }
    li { margin-bottom: 8px; font-size: 1.02rem; color: #334155; }
    .cta-box { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #fff; padding: 32px; border-radius: 18px; margin-top: 40px; text-align: center; }
    .cta-box h3 { font-size: 1.4rem; margin-bottom: 10px; color: #fff; }
    .cta-box p { color: #cbd5e1; margin-bottom: 20px; }
    .btn-cta { display: inline-block; background: #f59e0b; color: #0f172a; font-weight: 800; padding: 12px 28px; border-radius: 12px; text-decoration: none; }
  </style>
</head>
<body>
  <header class="header">
    <div class="header-inner">
      <a href="/" class="logo">Afsha <span>Enterprises</span></a>
      <nav class="nav-links">
        <a href="/">Home</a>
        <a href="/products">Products</a>
        <a href="/blogs">Blog</a>
        <a href="/contact">Contact</a>
      </nav>
    </div>
  </header>
  <div class="container">
    <article class="article-card">
      <span class="chip">${b.category}</span>
      <h1>${b.title}</h1>
      <div class="meta">
        <span>By ${b.author}</span> • <span>Published: ${b.publishedDate}</span> • <span>${b.readTime}</span>
      </div>
      <img src="${b.image}" alt="${b.title}" class="hero-img">
      
      <p>
        Chronic muscle aches, posture fatigue from desk work, and sudden sports sprains are among the most common lifestyle ailments reported in India today. In this comprehensive guide, we unpack the biomechanics, clinical relief strategies, and doctor-approved massage techniques to help you recover faster from home.
      </p>

      <h2>Understanding the Root Causes</h2>
      <p>
        When muscles remain contracted under repetitive stress or prolonged immobility, microscopic adhesions form within the fascia. These "knots" restrict micro-capillary blood circulation, starving tissues of oxygen and trapping acidic metabolic byproducts like lactic acid. The result is chronic dull aches, sharp spasms, and stiffness.
      </p>

      <h2>How Vibration and Thermal Therapy Break the Pain Cycle</h2>
      <p>
        Applying focused mechanical oscillation (1800 to 3200 RPM) stimulates Golgi tendon organs and muscle spindle receptors. This floods the central nervous system with sensory signals that override pain sensations (The Gate Control Theory of Pain). Combined with gentle infrared heat (40°C - 45°C), blood vessels dilate rapidly, accelerating natural cellular recovery.
      </p>

      <h2>Daily 10-Minute Recovery Protocol</h2>
      <ul>
        <li><strong>Step 1 (Warmup):</strong> Apply gentle circular strokes on the periphery of the sore area for 2 minutes without heavy pressure.</li>
        <li><strong>Step 2 (Target Knot):</strong> Hold the massager firmly over the tightest trigger point for 30 to 60 seconds with comfortable pressure.</li>
        <li><strong>Step 3 (Lymphatic Drain):</strong> Sweep the massager upward toward the heart to encourage lymphatic clearance.</li>
        <li><strong>Step 4 (Hydrate &amp; Rest):</strong> Drink a glass of warm water post-massage to help kidneys flush metabolic toxins.</li>
      </ul>

      <div class="cta-box">
        <h3>Ready to Experience Daily Pain Relief?</h3>
        <p>Explore Afsha Enterprises certified collection of deep tissue percussion guns and heated body massagers.</p>
        <a href="/products" class="btn-cta">Explore All Massagers →</a>
      </div>
    </article>
  </div>
  ${generateSeoFooter()}
</body>
</html>`;
}

function generateLocationHtml(loc) {
  const canonicalUrl = `${DOMAIN}/locations/${loc.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${canonicalUrl}#localbusiness`,
        "name": `Afsha Enterprises - ${loc.city}`,
        "description": loc.metaDescription,
        "url": canonicalUrl,
        "telephone": "+91-9876543210",
        "priceRange": "₹999 - ₹17999",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": loc.city,
          "addressRegion": loc.state,
          "addressCountry": "IN"
        },
        "areaServed": {
          "@type": "City",
          "name": loc.city
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": `${DOMAIN}/` },
          { "@type": "ListItem", "position": 2, "name": "Locations", "item": `${DOMAIN}/products` },
          { "@type": "ListItem", "position": 3, "name": loc.city, "item": canonicalUrl }
        ]
      }
    ]
  };

  const featuredProds = ALL_PRODUCTS.slice(0, 6).map(p => `
    <a href="/product/${p.slug}" style="background:#fff; border:1px solid #e2e8f0; border-radius:18px; padding:20px; text-decoration:none; color:inherit; display:flex; flex-direction:column; box-shadow:0 2px 10px rgba(0,0,0,0.02);">
      <div style="background:#f8fafc; text-align:center; padding:16px; border-radius:12px; margin-bottom:14px; height:180px; display:flex; align-items:center; justify-content:center;">
        <img src="${p.image}" alt="${p.name}" style="max-height:150px; max-width:90%; object-fit:contain;" loading="lazy">
      </div>
      <div style="font-size:0.75rem; font-weight:800; color:#d97706; text-transform:uppercase;">${p.category}</div>
      <h3 style="font-size:1.05rem; font-weight:800; margin:6px 0; color:#0f172a;">${p.name}</h3>
      <div style="margin-top:auto; padding-top:14px; display:flex; justify-content:space-between; align-items:baseline;">
        <span style="font-size:1.3rem; font-weight:900; color:#0f172a;">₹${p.price}</span>
        <span style="font-size:0.85rem; color:#16a34a; font-weight:800;">${p.discountPercent}% OFF</span>
      </div>
      <div style="margin-top:12px; background:#0f172a; color:#fff; text-align:center; padding:10px; border-radius:10px; font-weight:700; font-size:0.88rem;">
        Order to ${loc.city} →
      </div>
    </a>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${loc.metaTitle}</title>
  <meta name="description" content="${loc.metaDescription}">
  <meta name="keywords" content="${loc.keywords}">
  <link rel="canonical" href="${canonicalUrl}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${loc.metaTitle}">
  <meta property="og:description" content="${loc.metaDescription}">
  <meta property="og:image" content="${DOMAIN}/masage.jpg">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <script type="application/ld+json">${JSON.stringify(jsonLd, null, 2)}</script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; color: #0f172a; line-height: 1.6; }
    .container { max-width: 1120px; margin: 0 auto; padding: 0 20px; }
    .header { background: #ffffff; border-bottom: 1px solid #e2e8f0; padding: 14px 0; }
    .header-inner { display: flex; align-items: center; justify-content: space-between; }
    .logo { font-size: 1.2rem; font-weight: 900; color: #0f172a; text-decoration: none; }
    .logo span { color: #f59e0b; }
    .nav-links { display: flex; gap: 20px; align-items: center; }
    .nav-links a { color: #0f172a; text-decoration: none; font-weight: 600; font-size: 0.9rem; }
    .hero-badge { display: inline-block; background: #dcfce7; color: #15803d; font-weight: 800; font-size: 0.85rem; padding: 4px 14px; border-radius: 999px; margin-bottom: 12px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; margin: 40px 0; }
    .info-card { background: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; padding: 32px; margin-bottom: 40px; }
  </style>
</head>
<body>
  <header class="header">
    <div class="container header-inner">
      <a href="/" class="logo">Afsha <span>Enterprises</span></a>
      <nav class="nav-links">
        <a href="/">Home</a>
        <a href="/products">Products</a>
        <a href="/blogs">Blog</a>
        <a href="/contact">Contact</a>
      </nav>
    </div>
  </header>
  <main class="container" style="padding-top:40px;">
    <span class="hero-badge">⚡ Express Delivery &amp; COD Available in ${loc.city}</span>
    <h1 style="font-size:2.4rem; font-weight:900; line-height:1.2; color:#0f172a;">
      Electric Body Massagers &amp; Pain Relief in ${loc.city}, ${loc.state}
    </h1>
    <p style="color:#475569; font-size:1.15rem; margin-top:14px; max-width:820px; line-height:1.7;">
      Looking for the best electric body massager or deep tissue massage gun in ${loc.city}? Afsha Enterprises delivers certified therapeutic health massagers directly to your doorstep across ${loc.city} and throughout ${loc.state} with 100% Cash on Delivery and verified product warranty.
    </p>

    <div class="grid">
      ${featuredProds}
    </div>

    <div class="info-card">
      <h2 style="font-size:1.6rem; font-weight:800; margin-bottom:16px;">Why Residents of ${loc.city} Trust Afsha Enterprises</h2>
      <p style="color:#334155; font-size:1.05rem; margin-bottom:14px; line-height:1.8;">
        Whether you are commuting across ${loc.city}, working long IT shifts, managing retail fatigue, or training for athletics, muscle stiffness and cervical spine tension can diminish your daily energy. Our high-torque copper motor massagers deliver deep 12mm percussive vibrations and soothing thermal heat that alleviate muscular knots within 10 minutes.
      </p>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:20px; margin-top:24px;">
        <div style="background:#f8fafc; padding:20px; border-radius:14px;">
          <h4 style="font-size:1rem; font-weight:800; color:#0f172a; margin-bottom:6px;">🚚 2-3 Day Express Shipping</h4>
          <p style="font-size:0.9rem; color:#64748b;">Fast dispatch from regional fulfillment centers directly to all pin codes in ${loc.city}.</p>
        </div>
        <div style="background:#f8fafc; padding:20px; border-radius:14px;">
          <h4 style="font-size:1rem; font-weight:800; color:#0f172a; margin-bottom:6px;">💵 Cash on Delivery (COD)</h4>
          <p style="font-size:0.9rem; color:#64748b;">Pay safely at your doorstep with Cash, UPI, or Credit Card when your package arrives.</p>
        </div>
        <div style="background:#f8fafc; padding:20px; border-radius:14px;">
          <h4 style="font-size:1rem; font-weight:800; color:#0f172a; margin-bottom:6px;">🛡️ 1-Year Brand Warranty</h4>
          <p style="font-size:0.9rem; color:#64748b;">Every device is rigorously factory tested with dedicated customer support &amp; replacement guarantee.</p>
        </div>
      </div>
    </div>
  </main>
  ${generateSeoFooter()}
</body>
</html>`;
}

// 6. SITEMAP GENERATOR (Produces 100% clean canonical URLs with NO redirects)
function buildCompleteSitemapXml() {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  const canonicalEntries = [
    // Core Site Pages (5)
    { loc: `${DOMAIN}/`, priority: '1.0', changefreq: 'daily', lastmod: TODAY },
    { loc: `${DOMAIN}/products`, priority: '0.9', changefreq: 'daily', lastmod: TODAY },
    { loc: `${DOMAIN}/blogs`, priority: '0.8', changefreq: 'daily', lastmod: TODAY },
    { loc: `${DOMAIN}/contact`, priority: '0.7', changefreq: 'monthly', lastmod: TODAY },
    {
      loc: `${DOMAIN}/manish-kumar`,
      priority: '0.9',
      changefreq: 'weekly',
      lastmod: TODAY,
      image: { loc: `${DOMAIN}/manish-kumar.jpg`, title: 'Manish Kumar - Senior Java Full Stack Developer' }
    },

    // 5 Categories
    ...ALL_CATEGORIES.map(c => ({
      loc: `${DOMAIN}/category/${c.slug}`,
      priority: '0.85',
      changefreq: 'weekly',
      lastmod: TODAY
    })),

    // 28 Verified Products
    ...ALL_PRODUCTS.map(p => ({
      loc: `${DOMAIN}/product/${p.slug}`,
      priority: '0.9',
      changefreq: 'daily',
      lastmod: TODAY,
      image: { loc: `${DOMAIN}${p.image}`, title: p.name }
    })),

    // 40 Blogs & Guides
    ...ALL_BLOGS.map(b => ({
      loc: `${DOMAIN}/blog/${b.slug}`,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: TODAY,
      image: { loc: `${DOMAIN}${b.image}`, title: b.title }
    })),

    // 80 Indian Cities & Locations
    ...ALL_LOCATIONS.map(l => ({
      loc: `${DOMAIN}/locations/${l.slug}`,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: TODAY
    }))
  ];

  canonicalEntries.forEach(entry => {
    xml += `  <url>\n`;
    xml += `    <loc>${entry.loc}</loc>\n`;
    xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
    xml += `    <priority>${entry.priority}</priority>\n`;
    if (entry.image) {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${entry.image.loc}</image:loc>\n`;
      xml += `      <image:title>${entry.image.title.replace(/&/g, '&amp;')}</image:title>\n`;
      xml += `    </image:image>\n`;
    }
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;
  return { xml, count: canonicalEntries.length };
}

function buildSitemapIndexXml() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${DOMAIN}/sitemap.xml</loc>
    <lastmod>${TODAY}</lastmod>
  </sitemap>
</sitemapindex>`;
}

// 7. EXECUTION ENGINE
export function generateAllPages() {
  console.log(`\n==============================================`);
  console.log(`[SEO Generator] Starting 150+ Page Generation Engine...`);
  console.log(`==============================================\n`);

  const destDirs = [
    path.join(rootDir, 'backend', 'public'),
    path.join(rootDir, 'frontend', 'public')
  ];

  destDirs.forEach(d => {
    ['product', 'blog', 'category', 'locations'].forEach(sub => {
      const p = path.join(d, sub);
      if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
    });
  });

  // A. Generate Category Pages
  ALL_CATEGORIES.forEach(cat => {
    const html = generateCategoryHtml(cat);
    destDirs.forEach(d => {
      fs.writeFileSync(path.join(d, 'category', `${cat.slug}.html`), html, 'utf-8');
    });
  });
  console.log(`✓ Generated ${ALL_CATEGORIES.length} Category Pages (/category/:slug)`);

  // B. Generate Product Pages
  ALL_PRODUCTS.forEach(prod => {
    const html = generateProductHtml(prod);
    destDirs.forEach(d => {
      fs.writeFileSync(path.join(d, 'product', `${prod.slug}.html`), html, 'utf-8');
      // Root alias fallback
      fs.writeFileSync(path.join(d, `${prod.slug}.html`), html, 'utf-8');
    });
  });
  console.log(`✓ Generated ${ALL_PRODUCTS.length} Product Pages (/product/:slug)`);

  // C. Generate Blog Pages
  ALL_BLOGS.forEach(b => {
    const html = generateBlogHtml(b);
    destDirs.forEach(d => {
      fs.writeFileSync(path.join(d, 'blog', `${b.slug}.html`), html, 'utf-8');
    });
  });
  console.log(`✓ Generated ${ALL_BLOGS.length} Blog & Guide Pages (/blog/:slug)`);

  // D. Generate Location Pages
  ALL_LOCATIONS.forEach(loc => {
    const html = generateLocationHtml(loc);
    destDirs.forEach(d => {
      fs.writeFileSync(path.join(d, 'locations', `${loc.slug}.html`), html, 'utf-8');
    });
  });
  console.log(`✓ Generated ${ALL_LOCATIONS.length} Location Pages (/locations/:city)`);

  // E. Build XML Sitemap
  const { xml: sitemapXml, count: totalUrls } = buildCompleteSitemapXml();
  const sitemapIndexXml = buildSitemapIndexXml();

  destDirs.forEach(d => {
    fs.writeFileSync(path.join(d, 'sitemap.xml'), sitemapXml, 'utf-8');
    fs.writeFileSync(path.join(d, 'sitemap_index.xml'), sitemapIndexXml, 'utf-8');
  });

  console.log(`\n==============================================`);
  console.log(`[SEO Success] Total Canonical XML Sitemap URLs Generated: ${totalUrls}`);
  console.log(`[SEO Success] All 150+ pages pre-rendered with zero redirects, valid canonical tags, and schema.org markup!`);
  console.log(`==============================================\n`);
}

generateAllPages();
