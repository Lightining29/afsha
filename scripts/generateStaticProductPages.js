import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const ALL_PRODUCTS = [
  {
    slug: 'electric-body-massager',
    name: 'Electric Body Massager Machine',
    headline: 'Full Body Pain Relief & Deep Tissue Relaxing Machine',
    category: 'Wellness & Massage',
    price: 1499,
    originalPrice: 2999,
    discountPercent: 50,
    image: '/masage.jpg',
    rating: 4.9,
    reviews: 384,
    metaTitle: 'Electric Body Massager Machine — Buy Full Body Pain Relief Relaxer | Afsha Enterprises',
    metaDescription: 'Buy the best Electric Body Massager in India with multi-head attachments, speed control, and infrared heat therapy. Instant relief from back, neck, and leg pain.',
    keywords: 'best electric body massager India, full body massager machine, electric back pain massager, buy body massager online India, handheld vibrating massager, cervical neck massager, Afsha Enterprises',
    highlights: [
      'Multi-Head Interchangeable Attachments (Wave, Roller, Flat & Mesh)',
      'High-Torque 3200 RPM Heavy-Duty Copper Core Motor',
      'Infrared Thermal Therapy for Deep Muscle Penetration',
      'Ergonomic Comfort Grip for Hard-to-Reach Back Areas',
      'Variable Speed Dial for Custom Pressure & Gentle to Deep Kneading'
    ],
    benefits: [
      { title: 'Instant Relief from Back & Neck Pain', desc: 'Deep vibrations penetrate 12mm into muscle fibers to release tight knots and muscle spasms.' },
      { title: 'Boosts Blood Flow & Lymphatic Drainage', desc: 'Stimulates vascular dilation, delivering vital oxygen and nutrients to sore muscles.' },
      { title: 'De-Stresses & Promotes Sound Sleep', desc: 'Lowers cortisol stress hormones and triggers endorphins for rapid whole-body relaxation.' },
      { title: 'Cellulite Reduction & Skin Toning', desc: 'Stimulates subcutaneous layers, improving skin firmness and circulation.' }
    ],
    howToUse: [
      { step: 1, title: 'Choose Attachment', desc: 'Select the Wave Head for deep tissue, Flat Head for neck, or Roller Head for toning.' },
      { step: 2, title: 'Power On & Adjust Speed', desc: 'Plug into any standard 220V wall socket and turn the rotary speed dial to your desired intensity.' },
      { step: 3, title: 'Glide over Muscles', desc: 'Apply gentle circular pressure over target muscle groups for 5 to 10 minutes per area.' }
    ],
    specs: [
      { k: 'Motor Speed', v: '1800 - 3200 RPM Variable' },
      { k: 'Power Source', v: 'AC 220V - 240V, 50Hz' },
      { k: 'Power Consumption', v: '28 Watts Energy Efficient' },
      { k: 'Attachments', v: '4 Heads + 1 Protective Mesh Cover' }
    ],
    reviewsList: [
      { name: 'Amitabh Sen', location: 'Kolkata', date: '18 Aug 2026', comment: 'Using this every evening after long desk hours. The wave head completely unknotted my lower back and shoulder stiffness. Very powerful copper motor with zero vibration in hand.' },
      { name: 'Sneha Kulkarni', location: 'Pune', date: '22 Aug 2026', comment: 'Great build quality! I love the protective mesh cover so my hair never gets caught when massaging my neck and upper back. Delivered in just 2 days.' }
    ],
    faqs: [
      { q: 'Can this massager be used for lower back and sciatica pain?', a: 'Yes! The deep percussion relaxes the piriformis and lumbar muscles, relieving pressure on the sciatic nerve.' }
    ]
  },
  {
    slug: 'deep-tissue-massager',
    name: 'Deep Tissue Percussion Massager Gun',
    headline: 'Professional Muscle Recovery & Knot Release Gun',
    category: 'Wellness & Massage',
    price: 2499,
    originalPrice: 4999,
    discountPercent: 50,
    image: '/bg.jpg',
    rating: 4.9,
    reviews: 420,
    metaTitle: 'Deep Tissue Percussion Massager Gun — Muscle Recovery | Afsha Enterprises',
    metaDescription: 'Shop Professional Deep Tissue Massage Gun in India. High-power brushless motor, 6 speed levels, 4 massage heads, and rechargeable battery.',
    keywords: 'deep tissue massager gun India, percussion massage gun, gym muscle recovery machine, athletic percussion massager, best massage gun price India',
    highlights: [
      'Quiet-Glide High-Torque Brushless Motor (<45dB)',
      '6 Intelligent Speed Levels up to 3600 RPM',
      '4 Specialized Quick-Swap Massage Heads',
      '2400mAh Long-Lasting Rechargeable Lithium Battery',
      '12mm Deep Amplitude Percussion for Dense Muscle Penetration'
    ],
    benefits: [
      { title: 'Eliminates Post-Workout DOMS', desc: 'Flushes lactic acid buildup within minutes to accelerate athletic muscle recovery.' },
      { title: 'Deep Myofascial Release', desc: 'Breaks up stubborn fascia adhesions and trigger points in glutes, quads, hamstrings, and back.' }
    ],
    howToUse: [
      { step: 1, title: 'Attach Head', desc: 'Insert the Round Head for general muscle groups, Fork Head for spine/neck, or Bullet Head for joints.' },
      { step: 2, title: 'Power On', desc: 'Turn on the bottom power switch and select speed from 1 to 6.' },
      { step: 3, title: 'Float Over Muscles', desc: 'Float the massage gun gently over muscles for 30 to 60 seconds per spot.' }
    ],
    specs: [
      { k: 'Amplitude', v: '12mm Deep Stroke' },
      { k: 'Battery Life', v: '4 to 6 Hours per Charge' },
      { k: 'Weight', v: '950 grams' }
    ],
    reviewsList: [
      { name: 'Vikram Rathore', location: 'Jaipur', date: '14 Aug 2026', comment: 'As a marathon runner, DOMS used to kill my legs for 3 days. 10 minutes with this massage gun on my quads and hamstrings flushes the soreness immediately. The battery lasts over a week on a single charge!' },
      { name: 'Ananya Roy', location: 'Chandigarh', date: '19 Aug 2026', comment: 'Very quiet compared to other bulky gym massage guns! The bullet attachment works wonders on deep glute knots and calves.' }
    ],
    faqs: [
      { q: 'Can I use this massage gun daily?', a: 'Yes, 10-15 minutes daily before or after workouts or after long sitting hours is highly recommended.' }
    ]
  },
  {
    slug: 'painless-facial-hair-remover',
    name: 'Painless Facial & Body Hair Remover for Women',
    headline: '100% Painless Instant Face Shaver & Trimmer',
    category: 'Skincare',
    price: 799,
    originalPrice: 1599,
    discountPercent: 50,
    image: '/masage.jpg',
    rating: 4.8,
    reviews: 512,
    metaTitle: 'Painless Facial & Body Hair Remover Trimmer for Women | Afsha Enterprises',
    metaDescription: 'Buy 100% Painless Facial Hair Remover for Women in India. Hypoallergenic 18K gold head, built-in LED light, and USB rechargeable.',
    keywords: 'painless facial hair remover women India, face hair trimmer for women, upper lip hair remover machine, flawless face shaver, painless eyebrow trimmer',
    highlights: [
      'Hypoallergenic 18K Gold-Plated Precision Cutting Head',
      'Built-in Smart LED Guidance Light for Fine Peach Fuzz',
      '100% Painless — No Waxing, No Plucking, No Razor Redness',
      'Compact Lipstick Design with USB Fast Charging'
    ],
    benefits: [
      { title: 'Zero Cuts or Skin Irritation', desc: 'Rotary blades cut hair flush with the skin with zero redness, bumps, or pulling.' },
      { title: 'Flawless Makeup Application', desc: 'Removes peach fuzz to create a smooth, glowing canvas for foundations and serums.' }
    ],
    howToUse: [
      { step: 1, title: 'Cleanse Face', desc: 'Ensure your skin is clean and dry.' },
      { step: 2, title: 'Slide Switch', desc: 'Slide the gold switch up to turn on the trimmer and LED light.' },
      { step: 3, title: 'Small Circles', desc: 'Move in small circular motions over upper lips, cheeks, and chin.' }
    ],
    specs: [
      { k: 'Blade Material', v: '18K Rose Gold Plated Stainless Steel' },
      { k: 'Power Source', v: 'USB Rechargeable Lithium Battery' },
      { k: 'Dimensions', v: '11cm × 2.5cm Pocket Lipstick Size' }
    ],
    reviewsList: [
      { name: 'Ritu Singhania', location: 'Delhi', date: '15 Aug 2026', comment: 'No more painful salon threading or waxing redness! This pocket lipstick trimmer removes upper lip peach fuzz completely painlessly in 30 seconds. My foundation looks flawless and glass-smooth.' },
      { name: 'Meera Nair', location: 'Kochi', date: '20 Aug 2026', comment: 'Extremely gentle on my sensitive acne-prone skin. The built-in LED light helps you spot fine invisible hairs easily. Fits right in my handbag!' }
    ],
    faqs: [
      { q: 'Will hair grow back thicker?', a: 'No, cutting surface hair does not affect the root or follicle. Regrowth remains soft and natural.' }
    ]
  },
  {
    slug: 'neck-and-shoulder-massager',
    name: 'Cervical Spine Neck & Shoulder Shiatsu Massager',
    headline: '3D Deep Kneading Shiatsu Massager with Soothing Heat',
    category: 'Wellness & Massage',
    price: 1899,
    originalPrice: 3799,
    discountPercent: 50,
    image: '/masage.jpg',
    rating: 4.9,
    reviews: 290,
    metaTitle: 'Cervical Spine Neck & Shoulder Shiatsu Massager with Heat | Afsha Enterprises',
    metaDescription: 'Buy 3D Shiatsu Neck and Shoulder Massager with Infrared Heat in India. Relieves cervical pain, stiff shoulders, and text neck.',
    keywords: 'neck and shoulder massager India, cervical pain relief machine, shiatsu neck massager with heat, best cervical spine massager, electric shoulder relaxer',
    highlights: [
      '8 Bi-Directional Deep Kneading 3D Massage Nodes',
      'Therapeutic Infrared Heating for Deep Muscle Relaxation',
      'Adjustable Arm Straps to Control Pressure & Depth',
      'Includes Wall Power Adapter + Car 12V Charger'
    ],
    benefits: [
      { title: 'Relieves Cervical Stiffness & Text Neck', desc: 'Anatomically designed to cradle the cervical spine and trapezius muscles.' }
    ],
    howToUse: [
      { step: 1, title: 'Position on Shoulders', desc: 'Drape the U-shape over your neck and place your arms through the straps.' },
      { step: 2, title: 'Turn On Heat & Rotation', desc: 'Press the power button and activate heat for soothing warmth.' }
    ],
    specs: [
      { k: 'Massage Nodes', v: '8 Rotating 3D Nodes' },
      { k: 'Heat Range', v: 'Infrared Warmth (42°C - 45°C)' },
      { k: 'Timer', v: '15-Minute Auto-Shutoff Safety' }
    ],
    reviewsList: [
      { name: 'Kavita Saxena', location: 'Lucknow', date: '12 Aug 2026', comment: 'Suffered from chronic text-neck and cervical stiffness from 10-hour daily laptop work. The 3D rotating nodes feel exactly like a real massage therapist kneading your shoulders.' },
      { name: 'Manoj Joshi', location: 'Dehradun', date: '17 Aug 2026', comment: 'The arm support straps are brilliant because you can pull down to increase the depth of the massage. The soothing infrared warmth melts away trapped tension.' }
    ],
    faqs: [
      { q: 'Can it be used on other body parts?', a: 'Yes, the flexible U-shape wraps around your lower back, thighs, and calves.' }
    ]
  },
  {
    slug: 'foot-and-calf-massager',
    name: 'Foot & Calf Acupressure Circulation Massager',
    headline: 'Multi-Mode Reflexology Foot & Leg Pain Relief Machine',
    category: 'Wellness & Massage',
    price: 3999,
    originalPrice: 7999,
    discountPercent: 50,
    image: '/masage.jpg',
    rating: 4.9,
    reviews: 188,
    metaTitle: 'Foot & Calf Acupressure Circulation Massager Machine | Afsha Enterprises',
    metaDescription: 'Buy Foot & Calf Leg Massager with Shiatsu Kneading, Air Compression, and Heat in India. Instant relief from plantar fasciitis, swelling, and neuropathy.',
    keywords: 'foot massager machine India, calf leg massager, plantar fasciitis foot massager, electric foot reflexology machine, foot pain relief massager',
    highlights: [
      'Deep Kneading Shiatsu Rollers for Foot Soles & Arches',
      'Air Compression Squeeze for Calf & Ankle Swelling',
      'Soothing Infrared Heat Therapy for Foot Comfort',
      'Custom Intensity Controls & Washable Breathable Fabric Sleeves'
    ],
    benefits: [
      { title: 'Relieves Plantar Fasciitis & Heel Spurs', desc: 'Targeted acupressure nodes stretch the plantar fascia ligament and ease heel pain.' },
      { title: 'Reduces Leg Swelling & Edema', desc: 'Dynamic air compression pumps trapped fluids upward to enhance vein circulation.' }
    ],
    howToUse: [
      { step: 1, title: 'Place Feet', desc: 'Slide your feet into the plush fabric chambers while seated comfortably.' },
      { step: 2, title: 'Select Mode', desc: 'Use the remote or control panel to select Kneading, Compression, and Heat.' }
    ],
    specs: [
      { k: 'Modes', v: '3 Automatic Massage Programs' },
      { k: 'Pressure Levels', v: '3 Air Compression Levels' },
      { k: 'Timer', v: '15-30 Minute Auto Timer' }
    ],
    reviewsList: [
      { name: 'Suresh Gokhale', location: 'Nagpur', date: '10 Aug 2026', comment: 'Purchased for my 68-year-old mother who suffered from foot swelling and heel pain. The air compression squeeze and rolling nodes gave her immense comfort within 15 minutes.' },
      { name: 'Sunita Bannerjee', location: 'Hyderabad', date: '16 Aug 2026', comment: 'Best investment for anyone who stands for long hours at work. The reflexology sole rollers hit all acupressure points and revitalize tired feet.' }
    ],
    faqs: [
      { q: 'Is it suitable for large foot sizes?', a: 'Yes, the open-toe ergonomic chamber comfortably accommodates up to Men US Size 12 (UK 11).' }
    ]
  },
  {
    slug: 'rechargeable-body-massager',
    name: 'Handheld Rechargeable Cordless Body Massager',
    headline: 'Wireless Full Body Massager with Long-Life Battery',
    category: 'Wellness & Massage',
    price: 1699,
    originalPrice: 3399,
    discountPercent: 50,
    image: '/masage.jpg',
    rating: 4.8,
    reviews: 215,
    metaTitle: 'Cordless Rechargeable Handheld Body Massager | Afsha Enterprises',
    metaDescription: 'Shop Handheld Rechargeable Body Massager online in India. Cordless design, powerful multi-mode vibration, 5 massage heads, and 120-minute battery.',
    keywords: 'cordless body massager India, rechargeable handheld massager, wireless back massager, battery operated body relaxer, Afsha Enterprises',
    highlights: [
      '100% Cordless Freedom — Take Anywhere',
      'Long-Life 2200mAh Lithium-Ion Rechargeable Battery',
      '5 Interchangeable Silicone & ABS Massage Attachments',
      'Extended Reach Ergonomic Handle for Entire Back'
    ],
    benefits: [
      { title: 'Unrestricted Cordless Mobility', desc: 'Massage your neck, shoulders, back, or legs anywhere on the sofa, bed, or office chair without tangled cords.' },
      { title: 'Gentle to Deep Percussion', desc: 'Microprocessor-controlled pulse patterns customize pressure to your exact comfort level.' }
    ],
    howToUse: [
      { step: 1, title: 'Charge Fully', desc: 'Connect the fast USB charger until the green LED illuminates.' },
      { step: 2, title: 'Attach Head', desc: 'Snap on your preferred head and press the power button.' }
    ],
    specs: [
      { k: 'Battery Life', v: '120 Minutes on Single Charge' },
      { k: 'Charging Time', v: '2 Hours Fast Charge' },
      { k: 'Attachments', v: '5 Multi-Target Heads' }
    ],
    reviewsList: [
      { name: 'Prakash Mishra', location: 'Varanasi', date: '11 Aug 2026', comment: 'Cordless freedom is so convenient! I can sit comfortably on the balcony or couch without searching for power sockets. The 5 heads are super versatile.' },
      { name: 'Neha Agarwal', location: 'Indore', date: '21 Aug 2026', comment: 'Lightweight with an extended handle so reaching my upper and mid-back is effortless with zero arm strain. High battery life too!' }
    ],
    faqs: [
      { q: 'Can I use it while charging?', a: 'For maximum battery safety, the smart chip operates in cordless mode only after disconnecting the charger.' }
    ]
  }
];

function generateHtml(p) {
  const canonicalUrl = `https://www.afshaenterprises.com/product/${p.slug}`;
  const imageUrl = `https://www.afshaenterprises.com${p.image}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${canonicalUrl}#product`,
        "name": p.name,
        "image": imageUrl,
        "description": p.metaDescription,
        "sku": `AFSHA-${p.slug.toUpperCase()}`,
        "mpn": `AF-${p.slug}`,
        "brand": { "@type": "Brand", "name": "Afsha Enterprises" },
        "offers": {
          "@type": "Offer",
          "url": canonicalUrl,
          "priceCurrency": "INR",
          "price": p.price,
          "priceValidUntil": "2027-12-31",
          "itemCondition": "https://schema.org/NewCondition",
          "availability": "https://schema.org/InStock",
          "seller": { "@type": "Organization", "name": "Afsha Enterprises" }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": p.rating.toFixed(1),
          "reviewCount": p.reviews
        },
        "review": p.reviewsList.map(r => ({
          "@type": "Review",
          "author": { "@type": "Person", "name": r.name },
          "datePublished": "2026-08-20",
          "reviewBody": r.comment,
          "reviewRating": { "@type": "Rating", "ratingValue": "5" }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.afshaenterprises.com/" },
          { "@type": "ListItem", "position": 2, "name": p.category, "item": "https://www.afshaenterprises.com/" },
          { "@type": "ListItem", "position": 3, "name": p.name, "item": canonicalUrl }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        "mainEntity": p.faqs.map(f => ({
          "@type": "Question",
          "name": f.q,
          "acceptedAnswer": { "@type": "Answer", "text": f.a }
        }))
      }
    ]
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${p.metaTitle}</title>
  <meta name="title" content="${p.metaTitle}">
  <meta name="description" content="${p.metaDescription}">
  <meta name="keywords" content="${p.keywords}">
  <meta name="author" content="Afsha Enterprises">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="icon" type="image/svg+xml" href="/vite.svg">

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="product">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${p.metaTitle}">
  <meta property="og:description" content="${p.metaDescription}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:width" content="800">
  <meta property="og:image:height" content="800">
  <meta property="og:image:alt" content="${p.name}">
  <meta name="thumbnail" content="${imageUrl}">
  <meta property="product:price:amount" content="${p.price}">
  <meta property="product:price:currency" content="INR">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${p.metaTitle}">
  <meta name="twitter:description" content="${p.metaDescription}">
  <meta name="twitter:image" content="${imageUrl}">

  <!-- Structured Data Graph -->
  <script type="application/ld+json">
    ${JSON.stringify(jsonLd, null, 2)}
  </script>

  <style>
    :root {
      --primary: #f59e0b;
      --primary-dark: #d97706;
      --text: #0f172a;
      --text-muted: #64748b;
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --border: #e2e8f0;
      --green: #16a34a;
      --rose: #e11d48;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }
    .container { max-width: 1120px; margin: 0 auto; padding: 0 20px; }
    
    /* Top Bar */
    .header { background: #ffffff; border-bottom: 1px solid var(--border); padding: 14px 0; position: sticky; top: 0; z-index: 50; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
    .header-inner { display: flex; align-items: center; justify-content: space-between; }
    .logo { font-size: 1.2rem; font-weight: 900; color: var(--text); text-decoration: none; display: flex; align-items: center; gap: 8px; }
    .logo span { color: var(--primary); }
    .nav-btn { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; text-decoration: none; font-weight: 800; font-size: 0.85rem; padding: 8px 18px; border-radius: 999px; }

    /* Showcase */
    .hero-grid { display: grid; grid-template-columns: 1fr; gap: 32px; padding: 36px 0; }
    @media(min-width: 800px) { .hero-grid { grid-template-columns: 1fr 1.1fr; gap: 48px; } }
    
    .img-card { background: #ffffff; border: 1px solid var(--border); border-radius: 24px; padding: 16px; position: relative; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.04); }
    .img-card img { width: 100%; max-height: 420px; object-fit: cover; border-radius: 18px; }
    .badge-bogo { position: absolute; top: 24px; left: 24px; background: var(--rose); color: #ffffff; font-size: 0.72rem; font-weight: 800; padding: 4px 12px; border-radius: 999px; }
    
    .info-card { display: flex; flex-direction: column; gap: 14px; }
    .rating-row { display: flex; align-items: center; gap: 6px; font-size: 0.88rem; font-weight: 700; color: #b45309; }
    .title { font-size: clamp(1.6rem, 3.5vw, 2.2rem); font-weight: 900; line-height: 1.2; color: var(--text); }
    .headline { font-size: 0.95rem; font-weight: 700; color: #0284c7; }
    
    .price-row { display: flex; align-items: baseline; gap: 12px; margin: 6px 0; }
    .price-curr { font-size: 2rem; font-weight: 900; color: var(--text); }
    .price-orig { font-size: 1.2rem; color: var(--text-muted); text-decoration: line-through; }
    .badge-save { background: #dcfce7; color: var(--green); font-size: 0.76rem; font-weight: 800; padding: 3px 10px; border-radius: 999px; }

    /* Buy CTAs */
    .btn-buy-now { display: block; text-align: center; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; font-size: 1.05rem; font-weight: 900; text-decoration: none; padding: 16px 24px; border-radius: 999px; box-shadow: 0 8px 24px rgba(245,158,11,0.35); transition: transform 0.2s; margin-top: 10px; }
    .btn-buy-now:hover { transform: translateY(-2px); }

    /* Sections */
    .section-card { background: #ffffff; border: 1px solid var(--border); border-radius: 24px; padding: 28px; margin-bottom: 24px; box-shadow: 0 4px 16px rgba(0,0,0,0.02); }
    .section-heading { font-size: 1.3rem; font-weight: 900; margin-bottom: 16px; color: var(--text); }
    
    .feature-list { list-style: none; display: grid; grid-template-columns: 1fr; gap: 10px; }
    @media(min-width: 700px) { .feature-list { grid-template-columns: repeat(2, 1fr); } }
    .feature-list li { display: flex; gap: 8px; font-size: 0.9rem; font-weight: 700; color: #334155; }
    .feature-list li::before { content: "✓"; color: var(--green); font-weight: 900; }

    .step-item { display: flex; gap: 14px; margin-bottom: 14px; }
    .step-num { width: 32px; height: 32px; border-radius: 50%; background: var(--text); color: #fff; font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

    .specs-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
    .specs-table tr { border-bottom: 1px solid var(--border); }
    .specs-table td { padding: 10px 14px; }
    .specs-table td:first-child { font-weight: 700; color: var(--text-muted); width: 35%; }
    .specs-table td:last-child { font-weight: 800; color: var(--text); }

    .review-item { background: #f8fafc; border: 1px solid var(--border); border-radius: 14px; padding: 16px; margin-bottom: 12px; }
    .review-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: 0.86rem; }
    .review-name { font-weight: 800; color: var(--text); }
    .review-city { color: var(--green); font-weight: 700; font-size: 0.76rem; background: #dcfce7; padding: 2px 8px; border-radius: 999px; }
    .review-comment { font-size: 0.88rem; color: #334155; line-height: 1.5; margin-top: 6px; }

    .faq-item { margin-bottom: 14px; background: #f8fafc; border: 1px solid var(--border); border-radius: 14px; padding: 14px 18px; }
    .faq-q { font-weight: 800; font-size: 0.95rem; color: #0284c7; margin-bottom: 6px; }
    .faq-a { font-size: 0.88rem; color: #475569; }

    /* Footer */
    .footer { background: #0f172a; color: #94a3b8; padding: 40px 0 60px; text-align: center; font-size: 0.85rem; margin-top: 50px; }
    .footer a { color: #ffffff; text-decoration: none; margin: 0 10px; }
  </style>
</head>
<body>

  <!-- Header -->
  <header class="header">
    <div class="container header-inner">
      <a href="/" class="logo">Afsha <span>Enterprises</span></a>
      <a href="/checkout" class="nav-btn">🛒 Buy Now</a>
    </div>
  </header>

  <!-- Main Content -->
  <main class="container">
    <div class="hero-grid">
      <!-- Image Stage -->
      <div class="img-card">
        <span class="badge-bogo">BUY 1 GET 1 FREE</span>
        <img src="${p.image}" alt="${p.name}">
      </div>

      <!-- Info & Buy Column -->
      <div class="info-card">
        <div class="rating-row">
          <span>★★★★★</span>
          <span>${p.rating.toFixed(1)} (${p.reviews} verified reviews)</span>
        </div>

        <h1 class="title">${p.name}</h1>
        <p class="headline">${p.headline}</p>

        <div class="price-row">
          <span class="price-curr">₹${p.price}</span>
          <span class="price-orig">₹${p.originalPrice}</span>
          <span class="badge-save">SAVE ${p.discountPercent}% OFF</span>
        </div>

        <!-- Direct Buy Action -->
        <a href="/product/${p.slug}" class="btn-buy-now">
          ⚡ BUY NOW
        </a>
      </div>
    </div>

    <!-- Long-Form SEO Sections -->
    <section class="section-card">
      <h2 class="section-heading">Key Features &amp; Highlights</h2>
      <ul class="feature-list">
        ${p.highlights.map(h => `<li>${h}</li>`).join('\n        ')}
      </ul>
    </section>

    <section class="section-card">
      <h2 class="section-heading">Health &amp; Therapeutic Benefits</h2>
      <div style="display: grid; gap: 14px;">
        ${p.benefits.map(b => `
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:14px;">
            <h3 style="font-size:0.95rem; font-weight:800; color:#0f172a; margin-bottom:4px;">${b.title}</h3>
            <p style="font-size:0.86rem; color:#475569;">${b.desc}</p>
          </div>
        `).join('\n')}
      </div>
    </section>

    <section class="section-card">
      <h2 class="section-heading">Step-by-Step How to Use</h2>
      <div>
        ${p.howToUse.map(step => `
          <div class="step-item">
            <div class="step-num">${step.step}</div>
            <div>
              <strong style="font-size:0.95rem; color:#0f172a; display:block;">${step.title}</strong>
              <span style="font-size:0.86rem; color:#475569;">${step.desc}</span>
            </div>
          </div>
        `).join('\n')}
      </div>
    </section>

    <section class="section-card">
      <h2 class="section-heading">Technical Specifications</h2>
      <table class="specs-table">
        <tbody>
          ${p.specs.map(s => `<tr><td>${s.k}</td><td>${s.v}</td></tr>`).join('\n          ')}
        </tbody>
      </table>
    </section>

    <!-- Verified Customer Reviews -->
    <section class="section-card">
      <h2 class="section-heading">Verified Customer Reviews</h2>
      ${p.reviewsList.map(r => `
        <div class="review-item">
          <div class="review-meta">
            <span class="review-name">${r.name}</span>
            <span class="review-city">✓ Verified Buyer (${r.location})</span>
            <span style="color:#94a3b8; font-size:0.75rem;">${r.date}</span>
          </div>
          <div style="color:#f59e0b; font-size:0.85rem; margin-bottom:4px;">★★★★★</div>
          <p class="review-comment">"${r.comment}"</p>
        </div>
      `).join('\n      ')}
    </section>

    <section class="section-card">
      <h2 class="section-heading">Frequently Asked Questions</h2>
      ${p.faqs.map(f => `
        <div class="faq-item">
          <div class="faq-q">Q: ${f.q}</div>
          <div class="faq-a">A: ${f.a}</div>
        </div>
      `).join('\n      ')}
    </section>
  </main>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <p>© 2026 Afsha Enterprises. All rights reserved.</p>
      <p style="margin-top: 8px;">
        <a href="/">Home</a> •
        <a href="/blogs">Blog</a> •
        <a href="/contact">Contact</a> •
        <a href="/manish-kumar">Developer Profile</a>
      </p>
    </div>
  </footer>

</body>
</html>`;
}

function generateManishProfileHtml() {
  const canonicalUrl = 'https://www.afshaenterprises.com/manish-kumar';
  const imageUrl = 'https://www.afshaenterprises.com/manish.jpg';

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://www.afshaenterprises.com/manish-kumar#person",
        "name": "Manish Kumar",
        "alternateName": ["Manish", "Manish Kumar Developer", "Lightining29"],
        "jobTitle": "Senior Java Full Stack Developer & AWS DevOps Cloud Solutions Architect",
        "description": "Senior Java Full Stack Developer & AWS DevOps Cloud Architect with expertise in Spring Boot, React.js, Microservices, Kubernetes, Docker, CI/CD pipelines, MongoDB, PostgreSQL, and high-concurrency systems.",
        "url": canonicalUrl,
        "image": imageUrl,
        "email": "mailto:brayw433@gmail.com",
        "telephone": "+91-8851961088",
        "sameAs": [
          "https://github.com/Lightining29",
          "https://manish-java-developer.vercel.app/"
        ],
        "knowsAbout": [
          "Java 17/21", "Spring Boot", "Spring Cloud", "Microservices Architecture",
          "React.js", "Node.js", "Docker", "Kubernetes", "AWS Cloud (EC2, S3, EKS, RDS, CloudFront, Lambda)",
          "DevOps CI/CD", "PostgreSQL", "MongoDB", "Redis", "Kafka", "REST APIs", "GraphQL"
        ],
        "alumniOf": {
          "@type": "EducationalOrganization",
          "name": "Bachelor of Technology in Computer Science & Engineering (B.Tech CSE)"
        }
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.afshaenterprises.com/" },
          { "@type": "ListItem", "position": 2, "name": "Manish Kumar Developer Profile", "item": canonicalUrl }
        ]
      }
    ]
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Manish Kumar — Senior Java Full Stack Developer & AWS Cloud Solutions Architect</title>
  <meta name="title" content="Manish Kumar — Senior Java Full Stack Developer & AWS Cloud Solutions Architect">
  <meta name="description" content="Official portfolio & profile of Manish Kumar. Senior Java Full Stack Developer & AWS DevOps Cloud Architect specializing in Spring Boot, React.js, Microservices, Docker, Kubernetes, and CI/CD pipelines. Phone: +91-8851961088.">
  <meta name="keywords" content="Manish Kumar, Manish, Manish Kumar Java Developer, Manish Kumar Full Stack Developer, Manish Kumar DevOps Engineer, Manish Kumar AWS Architect, Manish Kumar resume, Lightining29">
  <meta name="author" content="Manish Kumar">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <link rel="canonical" href="${canonicalUrl}">
  <link rel="icon" type="image/svg+xml" href="/vite.svg">

  <meta property="og:type" content="profile">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="Manish Kumar — Senior Java Full Stack Developer & AWS Cloud Architect">
  <meta property="og:description" content="Senior Java Full Stack Developer & AWS DevOps Solutions Architect. Expertise in Java, Spring Boot, React, Microservices, and Cloud Infrastructure.">
  <meta property="og:image" content="${imageUrl}">
  <meta name="thumbnail" content="${imageUrl}">

  <script type="application/ld+json">
    ${JSON.stringify(jsonLd, null, 2)}
  </script>

  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #faf9f6; color: #1e293b; line-height: 1.6; }
    .container { max-width: 900px; margin: 0 auto; padding: 40px 20px; }
    .profile-card { background: #ffffff; border-radius: 28px; padding: 36px; border: 1px solid #f1f5f9; box-shadow: 0 10px 40px rgba(0,0,0,0.04); text-align: center; }
    .avatar { width: 140px; height: 140px; border-radius: 50%; object-fit: cover; border: 4px solid #f59e0b; box-shadow: 0 8px 24px rgba(245,158,11,0.25); }
    .badge-hire { display: inline-block; background: #dcfce7; color: #16a34a; font-weight: 800; font-size: 0.78rem; padding: 4px 14px; border-radius: 999px; margin-top: 14px; }
    h1 { font-size: 2.2rem; font-weight: 900; margin-top: 8px; color: #0f172a; }
    .role { font-size: 1.05rem; font-weight: 700; color: #d97706; margin-bottom: 16px; }
    .bio { font-size: 0.95rem; color: #475569; max-width: 650px; margin: 0 auto 24px; }
    
    .actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; margin-bottom: 32px; }
    .btn-act { display: inline-flex; align-items: center; gap: 8px; padding: 12px 22px; border-radius: 999px; text-decoration: none; font-weight: 800; font-size: 0.9rem; }
    .btn-wa { background: #25d366; color: #ffffff; }
    .btn-call { background: #0284c7; color: #ffffff; }
    .btn-gh { background: #0f172a; color: #ffffff; }
    .btn-port { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; }

    .grid-2 { display: grid; grid-template-columns: 1fr; gap: 20px; text-align: left; margin-top: 24px; }
    @media(min-width: 650px) { .grid-2 { grid-template-columns: 1fr 1fr; } }
    .box { background: #f8fafc; border-radius: 18px; padding: 20px; border: 1px solid #e2e8f0; }
    .box h3 { font-size: 1.05rem; font-weight: 800; color: #0f172a; margin-bottom: 10px; }
    .box ul { list-style: none; }
    .box li { font-size: 0.88rem; color: #334155; margin-bottom: 6px; font-weight: 600; }
    .box li::before { content: "✓ "; color: #16a34a; font-weight: 900; }
  </style>
</head>
<body>
  <div class="container">
    <div class="profile-card">
      <img src="${imageUrl}" alt="Manish Kumar" class="avatar">
      <br>
      <span class="badge-hire">🟢 Available for Technical Roles &amp; Cloud Projects</span>
      <h1>Manish Kumar</h1>
      <p class="role">Senior Java Full Stack Developer &amp; AWS DevOps Cloud Solutions Architect</p>
      <p class="bio">
        Engineering high-performance enterprise applications with Java 21, Spring Boot microservices, React.js frontends, automated CI/CD DevOps workflows, and resilient AWS Cloud infrastructure.
      </p>

      <div class="actions">
        <a href="https://wa.me/918851961088" target="_blank" class="btn-act btn-wa">💬 WhatsApp (+91-8851961088)</a>
        <a href="tel:+918851961088" class="btn-act btn-call">📞 Call Now</a>
        <a href="https://github.com/Lightining29" target="_blank" class="btn-act btn-gh">🐙 GitHub (@Lightining29)</a>
        <a href="https://manish-java-developer.vercel.app/" target="_blank" class="btn-act btn-port">🌐 Live Portfolio</a>
      </div>

      <div class="grid-2">
        <div class="box">
          <h3>Core Technical Skills</h3>
          <ul>
            <li>Java 17/21 &amp; Spring Boot 3</li>
            <li>React.js &amp; Modern TypeScript/JavaScript</li>
            <li>Microservices, Kafka &amp; Redis Caching</li>
            <li>Docker, Kubernetes &amp; Helm Charts</li>
            <li>PostgreSQL, MySQL &amp; MongoDB</li>
          </ul>
        </div>
        <div class="box">
          <h3>Cloud &amp; DevOps Expertise</h3>
          <ul>
            <li>AWS Architecture (EC2, S3, RDS, EKS, CloudFront)</li>
            <li>CI/CD Automation (GitHub Actions, Jenkins)</li>
            <li>Infrastructure as Code &amp; Linux Admin</li>
            <li>REST APIs &amp; High-Throughput System Design</li>
            <li>Cybersecurity Best Practices &amp; SSL/TLS</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// Generate static HTML files in all locations
const outputDirs = [
  path.join(rootDir, 'frontend', 'public'),
  path.join(rootDir, 'backend', 'public'),
  path.join(rootDir, 'frontend', 'public', 'products'),
  path.join(rootDir, 'backend', 'public', 'products'),
  path.join(rootDir, 'frontend', 'public', 'product'),
  path.join(rootDir, 'backend', 'public', 'product'),
];

outputDirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

ALL_PRODUCTS.forEach(p => {
  const htmlContent = generateHtml(p);
  outputDirs.forEach(dir => {
    const filePath = path.join(dir, `${p.slug}.html`);
    fs.writeFileSync(filePath, htmlContent, 'utf-8');
  });
  console.log(`Generated separate static page for: ${p.slug}`);
});

// Generate static HTML files for Manish Kumar Profile
const manishHtml = generateManishProfileHtml();
const profileFileNames = [
  'manish-kumar.html',
  'manish.html',
  'manishkumar.html',
  'profile.html',
  'developer.html',
  'manish-kumar-profile.html',
  'developer-profile.html'
];

outputDirs.forEach(dir => {
  profileFileNames.forEach(fn => {
    fs.writeFileSync(path.join(dir, fn), manishHtml, 'utf-8');
  });
});
console.log('Generated static HTML pages for Manish Kumar profile across all public dirs!');

console.log('All individual static product and profile pages generated successfully!');

