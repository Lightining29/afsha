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
    price: 1799,
    originalPrice: 3599,
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

const ALL_BLOGS = [
  {
    slug: 'top-10-benefits-of-using-a-body-massager',
    title: 'Top 10 Benefits of Using a Body Massager',
    metaTitle: 'Top 10 Benefits of Using an Electric Body Massager Daily | Afsha Enterprises',
    metaDescription: 'Discover the top 10 health benefits of using a body massager daily. From stress relief to improved blood circulation and muscle recovery.',
    keywords: 'benefits of body massager, electric massager benefits, body massager for back pain, muscle relaxation machine, daily massager benefits India',
    category: 'Wellness & Therapy',
    readTime: '6 min read',
    publishedDate: '2026-08-20',
    image: '/masage.jpg',
    author: 'Manish Kumar',
    content: `Using a body massager is one of the easiest, most cost-effective ways to relieve stress, improve health, and promote muscle recovery. Discover how 10 minutes of daily electric massage therapy can eliminate back pain, boost lymphatic drainage, and improve sleep quality.`
  },
  {
    slug: 'best-massager-for-back-pain-in-india',
    title: 'Best Massager for Back Pain in India',
    metaTitle: 'Best Massager for Back Pain in India (2026 Expert Guide) | Afsha Enterprises',
    metaDescription: 'Suffering from back pain? Read our expert guide on the best body massagers for back pain relief in India, featuring top electric and deep tissue options.',
    keywords: 'best massager for back pain India, lower back pain machine, electric back massager price, sciatica pain relief massager',
    category: 'Pain Relief & Health',
    readTime: '7 min read',
    publishedDate: '2026-08-22',
    image: '/bg.jpg',
    author: 'Manish Kumar',
    content: `Back pain is a widespread issue in India, affecting office workers who sit for long hours, active gym-goers, and senior citizens alike. Finding the right solution is critical to maintaining productivity and quality of life.`
  },
  {
    slug: 'how-to-choose-a-handheld-massager',
    title: 'How to Choose a Handheld Massager',
    metaTitle: 'How to Choose the Best Handheld Massager: Complete Buyer Guide | Afsha Enterprises',
    metaDescription: 'Buying guide for handheld massagers online. Learn which key features to look for, including battery life, weight, speed settings, and attachments.',
    keywords: 'how to choose handheld massager, massager buying guide India, percussion vs vibration massager, best handheld body massager',
    category: 'Buyer Guide',
    readTime: '5 min read',
    publishedDate: '2026-08-24',
    image: '/masage.jpg',
    author: 'Manish Kumar',
    content: `With so many handheld massagers available online, choosing the right one can feel overwhelming. Learn how to compare percussion vs vibration, motor quality, weight, and attachments.`
  },
  {
    slug: 'neck-pain-relief-tips-at-home',
    title: 'Neck Pain Relief Tips at Home',
    metaTitle: 'Neck Pain Relief at Home: Exercises, Stretches & Heated Massage | Afsha Enterprises',
    metaDescription: 'Relieve neck and shoulder stiffness at home with these easy exercises, hot therapy tips, and the best neck and shoulder massager machines.',
    keywords: 'neck pain relief at home, cervical pain relief exercises, text neck treatment, neck and shoulder massager with heat',
    category: 'Posture & Ergonomics',
    readTime: '6 min read',
    publishedDate: '2026-08-25',
    image: '/masage.jpg',
    author: 'Manish Kumar',
    content: `Neck pain and shoulder stiffness are common complaints in today's digital age. Hours spent slouching over computers or looking down at smartphones strain the cervical spine.`
  },
  {
    slug: 'electric-vs-manual-massagers',
    title: 'Electric vs Manual Massagers',
    metaTitle: 'Electric vs Manual Massagers: Which Is Better for Pain Relief? | Afsha Enterprises',
    metaDescription: 'Comprehensive comparison between electric massagers and manual foam rollers. Compare speed, pain relief effectiveness, effort, and long-term value.',
    keywords: 'electric vs manual massager, foam roller vs massage gun, electric body massager benefits, best massager machine comparison',
    category: 'Product Comparison',
    readTime: '5 min read',
    publishedDate: '2026-08-26',
    image: '/bg.jpg',
    author: 'Manish Kumar',
    content: `When recovering from muscle stiffness or body aches, you might wonder whether to invest in a modern electric massager or stick to traditional manual tools like foam rollers and wooden massagers.`
  },
  {
    slug: 'how-to-relieve-sciatic-nerve-pain-at-home',
    title: 'How to Relieve Sciatic Nerve Pain at Home',
    metaTitle: 'How to Relieve Sciatic Nerve Pain at Home: Massagers & Stretches | Afsha Enterprises',
    metaDescription: 'Struggling with shooting pain down your leg? Learn how deep vibration therapy, piriformis muscle release, and electric massagers provide fast sciatica relief.',
    keywords: 'sciatica pain relief, sciatic nerve massager, piriformis syndrome treatment, electric massager for sciatica, lower back leg pain relief',
    category: 'Pain Relief & Health',
    readTime: '7 min read',
    publishedDate: '2026-08-27',
    image: '/masage.jpg',
    author: 'Manish Kumar',
    content: `Sciatica refers to pain that radiates along the path of the sciatic nerve, branching from your lower back through your hips and buttocks down each leg. Deep vibration therapy relaxes tight piriformis muscles and provides fast relief.`
  },
  {
    slug: 'plantar-fasciitis-foot-massager-guide',
    title: 'Plantar Fasciitis Foot Massager Guide',
    metaTitle: 'Best Foot Massagers for Plantar Fasciitis & Heel Pain in India | Afsha Enterprises',
    metaDescription: 'Suffering from morning heel pain? Discover how acupressure rolling nodes, air compression, and infrared heat relieve plantar fasciitis and swollen feet.',
    keywords: 'plantar fasciitis massager, best foot massager machine India, heel pain relief machine, electric foot reflexology massager, swollen feet remedy',
    category: 'Pain Relief & Health',
    readTime: '6 min read',
    publishedDate: '2026-08-28',
    image: '/masage.jpg',
    author: 'Manish Kumar',
    content: `Plantar fasciitis is an inflammation of the thick band of tissue running across the bottom of your foot. Acupressure foot massagers with air compression stretch contracted ligaments and stimulate blood flow to speed recovery.`
  },
  {
    slug: 'facial-hair-removal-tips-for-women',
    title: 'Facial Hair Removal Tips for Women',
    metaTitle: 'Painless Facial Hair Removal Tips for Women (No Waxing, No Redness) | Afsha Enterprises',
    metaDescription: 'Say goodbye to painful threading and chemical bleach. Learn how precision rotary micro-trimmers remove peach fuzz and upper lip hair painlessly.',
    keywords: 'facial hair removal women, painless face hair remover, upper lip trimmer, flawless face hair removal, peach fuzz remover India',
    category: 'Skincare',
    readTime: '5 min read',
    publishedDate: '2026-08-28',
    image: '/masage.jpg',
    author: 'Manish Kumar',
    content: `Many women struggle with unwanted upper lip hair or peach fuzz. Modern 18K gold-plated rotary micro-trimmers eliminate peach fuzz in seconds with zero redness, pain, or cuts.`
  },
  {
    slug: 'full-body-massage-machine-price-in-india',
    title: 'Full Body Massage Machine Price in India',
    metaTitle: 'Full Body Massage Machine Price in India (2026 Comparison) | Afsha Enterprises',
    metaDescription: 'Complete price list and feature comparison for handheld body massagers, deep tissue percussion guns, neck massagers, and leg massagers in India.',
    keywords: 'body massager price India, electric massager machine price, deep tissue massager gun cost, massage machine price list, best affordable body massager',
    category: 'Buyer Guide',
    readTime: '6 min read',
    publishedDate: '2026-08-29',
    image: '/bg.jpg',
    author: 'Manish Kumar',
    content: `Investing in a body massager is one of the smartest wellness decisions you can make. Review our comprehensive 2026 price guide covering handheld massagers, deep tissue massage guns, and neck massagers.`
  }
];

function generateProductHtml(p) {
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

  <script type="application/ld+json">
    ${JSON.stringify(jsonLd, null, 2)}
  </script>

  <style>
    :root { --primary: #f59e0b; --text: #0f172a; --bg: #f8fafc; --border: #e2e8f0; --green: #16a34a; --rose: #e11d48; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--bg); color: var(--text); line-height: 1.6; }
    .container { max-width: 1120px; margin: 0 auto; padding: 0 20px; }
    .header { background: #ffffff; border-bottom: 1px solid var(--border); padding: 14px 0; position: sticky; top: 0; z-index: 50; }
    .header-inner { display: flex; align-items: center; justify-content: space-between; }
    .logo { font-size: 1.2rem; font-weight: 900; color: var(--text); text-decoration: none; }
    .logo span { color: var(--primary); }
    .nav-btn { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #ffffff; text-decoration: none; font-weight: 800; font-size: 0.85rem; padding: 8px 18px; border-radius: 999px; }
    .hero-grid { display: grid; grid-template-columns: 1fr; gap: 32px; padding: 36px 0; }
    .img-card { background: radial-gradient(circle at 50% 48%, #ffffff 50%, #f8fafc 100%); border: 1px solid var(--border); border-radius: 40px; padding: 24px; position: relative; text-align: center; display: flex; align-items: center; justify-content: center; min-height: 420px; box-shadow: 0 16px 40px rgba(0, 0, 0, 0.06); }
    .img-card img { width: 95%; max-height: 400px; object-fit: contain; filter: none; }
    .info-card { display: flex; flex-direction: column; gap: 12px; justify-content: center; }
    .hero-top-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
    .title { font-size: clamp(1.5rem, 3.5vw, 2.1rem); font-weight: 900; line-height: 1.2; margin: 0; }
    .price-curr { font-size: 1.85rem; font-weight: 900; white-space: nowrap; }
    .subtitle { font-size: 0.95rem; font-weight: 600; color: #94a3b8; }
    .desc { font-size: 0.92rem; color: #64748b; line-height: 1.55; }
    .action-row { display: flex; align-items: center; gap: 14px; margin-top: 10px; }
    .btn-buy-now { flex: 1; text-align: center; background: ${p.slug === 'painless-facial-hair-remover' ? '#e11d48' : '#ea580c'}; color: #ffffff; font-size: 1.05rem; font-weight: 900; text-decoration: none; padding: 14px 24px; border-radius: 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
    .btn-cart-circle { width: 50px; height: 50px; border-radius: 50%; background: #ffffff; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; text-decoration: none; box-shadow: 0 4px 14px rgba(0,0,0,0.08); }
    .section-card { background: #ffffff; border: 1px solid var(--border); border-radius: 24px; padding: 28px; margin-bottom: 24px; }
    .section-heading { font-size: 1.3rem; font-weight: 900; margin-bottom: 16px; }
    .specs-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
    .specs-table tr { border-bottom: 1px solid var(--border); }
    .specs-table td { padding: 10px 14px; }
    .footer { background: #0f172a; color: #94a3b8; padding: 40px 0 60px; text-align: center; font-size: 0.85rem; margin-top: 50px; }
    .footer a { color: #ffffff; text-decoration: none; margin: 0 10px; }
  </style>
</head>
<body>
  <header class="header">
    <div class="container header-inner">
      <a href="/" class="logo">Afsha <span>Enterprises</span></a>
      <a href="/checkout" class="nav-btn">🛒 Buy Now</a>
    </div>
  </header>
  <main class="container">
    <div class="hero-grid">
      <div class="img-card"><img src="${p.image}" alt="${p.name}"></div>
      <div class="info-card">
        <div class="hero-top-row">
          <h1 class="title">${p.name}</h1>
          <span class="price-curr">₹${p.price}</span>
        </div>
        <p class="subtitle">${p.category} • Certified Quality</p>
        <p class="desc">${p.headline}</p>
        <div class="action-row">
          <a href="/product/${p.slug}" class="btn-buy-now">Buy Now</a>
          <a href="/product/${p.slug}" class="btn-cart-circle" aria-label="Add to cart">🛒</a>
        </div>
      </div>
    </div>
    <section class="section-card">
      <h2 class="section-heading">Key Features &amp; Highlights</h2>
      <ul style="list-style:none; display:grid; gap:8px;">${p.highlights.map(h => `<li style="font-weight:700; color:#334155;">✓ ${h}</li>`).join('')}</ul>
    </section>
    <section class="section-card">
      <h2 class="section-heading">Technical Specifications</h2>
      <table class="specs-table"><tbody>${p.specs.map(s => `<tr><td style="font-weight:700; color:#64748b;">${s.k}</td><td style="font-weight:800;">${s.v}</td></tr>`).join('')}</tbody></table>
    </section>
    <section class="section-card">
      <h2 class="section-heading">Verified Customer Reviews</h2>
      ${p.reviewsList.map(r => `
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:16px; margin-bottom:12px;">
          <div style="display:flex; justify-content:space-between; font-size:0.86rem; font-weight:800;">
            <span>${r.name}</span>
            <span style="color:#16a34a; background:#dcfce7; padding:2px 8px; border-radius:999px;">✓ Verified Buyer (${r.location})</span>
          </div>
          <div style="color:#f59e0b; margin:4px 0;">★★★★★</div>
          <p style="font-size:0.88rem; color:#334155;">"${r.comment}"</p>
        </div>
      `).join('')}
    </section>
  </main>
  <footer class="footer">
    <div class="container">
      <p>© 2026 Afsha Enterprises. All rights reserved.</p>
      <p style="margin-top: 8px;">
        <a href="/">Home</a> • <a href="/blogs">Blog</a> • <a href="/contact">Contact</a> • <a href="/manish-kumar">Developer Profile</a>
      </p>
    </div>
  </footer>
</body>
</html>`;
}

function generateBlogHtml(b) {
  const canonicalUrl = `https://www.afshaenterprises.com/blog/${b.slug}`;
  const imageUrl = `https://www.afshaenterprises.com${b.image}`;

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
        "author": { "@type": "Person", "name": b.author, "url": "https://www.afshaenterprises.com/manish-kumar" },
        "publisher": { "@type": "Organization", "name": "Afsha Enterprises" }
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
  <script type="application/ld+json">${JSON.stringify(jsonLd, null, 2)}</script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #faf9f6; color: #1e293b; line-height: 1.7; }
    .container { max-width: 860px; margin: 0 auto; padding: 40px 20px; }
    .article-card { background: #ffffff; border-radius: 24px; padding: 36px; border: 1px solid #e2e8f0; }
    .chip { background: #e0f2fe; color: #0284c7; font-weight: 800; font-size: 0.78rem; padding: 4px 12px; border-radius: 999px; display: inline-block; margin-bottom: 12px; }
    h1 { font-size: 2.2rem; font-weight: 900; color: #0f172a; margin-bottom: 16px; }
    .meta { display: flex; gap: 16px; color: #64748b; font-size: 0.85rem; margin-bottom: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 14px; }
    .hero-img { width: 100%; max-height: 380px; object-fit: cover; border-radius: 16px; margin-bottom: 24px; }
    .btn-shop { display: inline-block; background: #0f172a; color: #fff; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: 800; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <article class="article-card">
      <span class="chip">${b.category}</span>
      <h1>${b.title}</h1>
      <div class="meta">
        <span>By ${b.author}</span>
        <span>• ${b.publishedDate}</span>
        <span>• ${b.readTime}</span>
      </div>
      <img src="${b.image}" alt="${b.title}" class="hero-img">
      <p style="font-size:1.1rem; color:#334155; margin-bottom:20px;">${b.content}</p>
      <a href="/products" class="btn-shop">Shop Recommended Products →</a>
    </article>
  </div>
</body>
</html>`;
}

function generateManishProfileHtml() {
  const canonicalUrl = 'https://www.afshaenterprises.com/manish-kumar';
  const imageUrl = 'https://www.afshaenterprises.com/manish-kumar.jpg';

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://www.afshaenterprises.com/manish-kumar#person",
        "name": "Manish Kumar",
        "alternateName": ["Manish", "Manish Kumar Developer", "Lightining29"],
        "jobTitle": "Senior Java Full Stack Developer & AWS DevOps Cloud Solutions Architect",
        "description": "Senior Java Full Stack Developer & AWS DevOps Cloud Architect with expertise in Java 21, Spring Boot 3, Microservices, React.js, Docker, Kubernetes, CI/CD pipelines, MongoDB, PostgreSQL, and high-concurrency systems.",
        "url": canonicalUrl,
        "image": imageUrl,
        "email": "mailto:brayw433@gmail.com",
        "telephone": "+91-8851961088",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Ghaziabad",
          "addressRegion": "Uttar Pradesh",
          "postalCode": "201001",
          "addressCountry": "IN"
        },
        "alumniOf": {
          "@type": "EducationalOrganization",
          "name": "B.Tech in Computer Science & Engineering"
        },
        "sameAs": [
          "https://github.com/Lightining29",
          "https://manish-java-developer.vercel.app/"
        ]
      },
      {
        "@type": "ProfilePage",
        "@id": `${canonicalUrl}#webpage`,
        "url": canonicalUrl,
        "name": "Manish Kumar — Senior Java Full Stack Developer & AWS Solutions Architect",
        "description": "Official verified profile of Manish Kumar. Senior Java Full Stack Developer, AWS DevOps Architect, and Full Stack Engineer.",
        "primaryImageOfPage": imageUrl
      }
    ]
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Manish Kumar — Senior Java Full Stack Developer &amp; AWS Cloud Solutions Architect</title>
  <meta name="description" content="Official portfolio &amp; profile of Manish Kumar. Senior Java Full Stack Developer &amp; AWS DevOps Cloud Architect. Expert in Java 21, Spring Boot, Microservices, React, Docker, and AWS. Contact: +91-8851961088.">
  <meta name="keywords" content="Manish Kumar, Manish, Manish Kumar Java Developer, Manish Kumar Full Stack Developer, Manish Kumar DevOps Engineer, Manish Kumar AWS Architect">
  <link rel="canonical" href="${canonicalUrl}">
  <meta property="og:type" content="profile">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="Manish Kumar — Senior Java Full Stack Developer &amp; AWS DevOps Architect">
  <meta property="og:description" content="Official portfolio &amp; profile of Manish Kumar. Senior Java Full Stack Developer &amp; AWS Cloud Architect.">
  <meta property="og:image" content="${imageUrl}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Manish Kumar — Senior Java Full Stack Developer">
  <meta name="twitter:description" content="Building enterprise-scale web applications with Java, Spring Boot, React, and resilient AWS Cloud architecture.">
  <meta name="twitter:image" content="${imageUrl}">
  <script type="application/ld+json">${JSON.stringify(jsonLd, null, 2)}</script>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0f19; color: #f1f5f9; line-height: 1.6; }
    .nav { background: #111827; border-bottom: 1px solid #1f2937; padding: 14px 20px; display: flex; justify-content: space-between; align-items: center; }
    .nav a { color: #f59e0b; text-decoration: none; font-weight: 800; font-size: 1.1rem; }
    .nav-links a { color: #94a3b8; font-size: 0.9rem; margin-left: 16px; font-weight: 600; }
    .nav-links a:hover { color: #fff; }
    .container { max-width: 960px; margin: 0 auto; padding: 32px 20px; }
    .card { background: #111827; border-radius: 24px; padding: 32px; border: 1px solid #1f2937; margin-bottom: 24px; }
    .hero { text-align: center; }
    .avatar { width: 140px; height: 140px; border-radius: 50%; border: 4px solid #f59e0b; margin: 0 auto 16px; display: block; object-fit: cover; }
    h1 { font-size: 2.2rem; font-weight: 900; color: #ffffff; margin-bottom: 6px; }
    .role { color: #f59e0b; font-weight: 800; font-size: 1.15rem; margin-bottom: 14px; }
    .bio { max-width: 650px; margin: 0 auto 20px; color: #94a3b8; font-size: 1.05rem; }
    .actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 18px; }
    .btn { display: inline-flex; align-items: center; padding: 10px 20px; border-radius: 999px; text-decoration: none; font-weight: 700; font-size: 0.92rem; }
    .btn-wa { background: #22c55e; color: #ffffff; }
    .btn-call { background: #0284c7; color: #ffffff; }
    .btn-port { background: #f59e0b; color: #0f172a; }
    .btn-gh { background: #27272a; color: #ffffff; border: 1px solid #3f3f46; }
    .btn-email { background: #6366f1; color: #ffffff; }
    .grid-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 14px; margin: 24px 0 8px; }
    .stat-box { background: #1e293b; padding: 16px; border-radius: 16px; text-align: center; border: 1px solid #334155; }
    .stat-num { font-size: 1.6rem; font-weight: 900; color: #f59e0b; }
    .stat-lbl { font-size: 0.8rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; }
    h2 { font-size: 1.35rem; font-weight: 800; color: #f8fafc; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
    .badge-cloud { display: flex; flex-wrap: wrap; gap: 8px; }
    .badge { background: #1e293b; color: #38bdf8; padding: 6px 12px; border-radius: 8px; font-size: 0.88rem; font-weight: 700; border: 1px solid #334155; }
    .proj-item { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 18px; margin-bottom: 12px; }
    .proj-title { font-size: 1.05rem; font-weight: 800; color: #ffffff; }
    .proj-desc { color: #94a3b8; font-size: 0.92rem; margin-top: 4px; }
    footer { text-align: center; padding: 30px 20px; color: #64748b; font-size: 0.85rem; border-top: 1px solid #1e293b; margin-top: 30px; }
    footer a { color: #94a3b8; text-decoration: none; margin: 0 8px; }
  </style>
</head>
<body>
  <nav class="nav">
    <a href="/">Afsha Enterprises</a>
    <div class="nav-links">
      <a href="/">Shop Products</a>
      <a href="/blogs">Articles</a>
      <a href="/contact">Contact</a>
    </div>
  </nav>

  <div class="container">
    <div class="card hero">
      <img src="${imageUrl}" alt="Manish Kumar" class="avatar" width="140" height="140">
      <h1>Manish Kumar</h1>
      <p class="role">Senior Java Full Stack Developer &amp; AWS DevOps Solutions Architect</p>
      <p class="bio">Building ultra-fast, high-concurrency scalable enterprise systems with Java 21, Spring Boot 3, React.js, Docker, Kubernetes, and resilient AWS Cloud architecture.</p>
      <div class="actions">
        <a href="https://wa.me/918851961088" class="btn btn-wa">💬 WhatsApp (+91 8851961088)</a>
        <a href="tel:+918851961088" class="btn btn-call">📞 Call Directly</a>
        <a href="https://manish-java-developer.vercel.app/" class="btn btn-port" target="_blank" rel="noopener">🌐 Live Portfolio</a>
        <a href="https://github.com/Lightining29" class="btn btn-gh" target="_blank" rel="noopener">🐙 GitHub</a>
        <a href="mailto:brayw433@gmail.com" class="btn btn-email">✉️ Email</a>
      </div>

      <div class="grid-stats">
        <div class="stat-box"><div class="stat-num">4+</div><div class="stat-lbl">Years Exp</div></div>
        <div class="stat-box"><div class="stat-num">15+</div><div class="stat-lbl">Enterprise Projects</div></div>
        <div class="stat-box"><div class="stat-num">99.9%</div><div class="stat-lbl">Cloud Uptime</div></div>
        <div class="stat-box"><div class="stat-num">100%</div><div class="stat-lbl">Client Rating</div></div>
      </div>
    </div>

    <div class="card">
      <h2>🛠️ Core Technical Stack</h2>
      <div class="badge-cloud">
        <span class="badge">Java 21 / 17</span>
        <span class="badge">Spring Boot 3</span>
        <span class="badge">Microservices Architecture</span>
        <span class="badge">Spring Security &amp; OAuth2</span>
        <span class="badge">Hibernate / JPA</span>
        <span class="badge">React.js</span>
        <span class="badge">AWS Cloud (EC2, S3, RDS, Lambda)</span>
        <span class="badge">Docker &amp; Kubernetes</span>
        <span class="badge">Jenkins CI/CD Pipelines</span>
        <span class="badge">MySQL &amp; PostgreSQL</span>
        <span class="badge">MongoDB</span>
        <span class="badge">Redis Caching</span>
        <span class="badge">RESTful APIs &amp; WebSockets</span>
        <span class="badge">Linux Administration</span>
        <span class="badge">Cybersecurity Auditing</span>
      </div>
    </div>

    <div class="card">
      <h2>🚀 Flagship Enterprise Projects</h2>
      <div class="proj-item">
        <div class="proj-title">Afsha Enterprises — Commercial E-Commerce Platform</div>
        <div class="proj-desc">High-speed consumer health &amp; wellness online store featuring live Razorpay payments, real-time OTP auth, pre-rendered fast SSR architecture, and comprehensive SEO optimization.</div>
      </div>
      <div class="proj-item">
        <div class="proj-title">ProgrammingWala — Online Tech Education &amp; LMS Portal</div>
        <div class="proj-desc">High-concurrency learning management system delivering on-demand coding courses, real-time code sandboxes, and automated student enrollment microservices.</div>
      </div>
      <div class="proj-item">
        <div class="proj-title">Rancom Technologies — Cloud Infrastructure Automation</div>
        <div class="proj-desc">Multi-region AWS Cloud architecture leveraging ECS containers, automated GitHub Actions CI/CD deployment pipelines, and zero-downtime rolling updates.</div>
      </div>
    </div>

    <div class="card">
      <h2>💼 Professional Work Experience</h2>
      <div class="proj-item">
        <div class="proj-title">Senior Java Full Stack Developer &amp; AWS Solutions Architect</div>
        <div style="color:#f59e0b; font-size:0.88rem; font-weight:700; margin: 2px 0 6px;">Appletree Infotech • Full-Time</div>
        <div class="proj-desc">Architecting robust backend microservices, optimizing database transactions, designing secure REST endpoints, and automating multi-tier CI/CD cloud deployments across global infrastructure.</div>
      </div>
    </div>

    <div class="card">
      <h2>🎓 Education &amp; Credentials</h2>
      <p style="color:#ffffff; font-weight:800; font-size:1.05rem;">Bachelor of Technology (B.Tech) in Computer Science &amp; Engineering</p>
      <p style="color:#94a3b8; font-size:0.92rem; margin-top:4px;">Specialization in Cloud Computing, Distributed Systems, and Advanced Algorithms.</p>
    </div>
  </div>

  <footer>
    <p>© 2026 Afsha Enterprises. Verified Developer Portfolio.</p>
    <p style="margin-top:8px;">
      <a href="/">Home</a> • <a href="/products">Products</a> • <a href="/blogs">Blog</a> • <a href="/contact">Contact</a> • <a href="/manish-kumar">Manish Kumar Profile</a>
    </p>
  </footer>
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
  path.join(rootDir, 'frontend', 'public', 'blog'),
  path.join(rootDir, 'backend', 'public', 'blog'),
  path.join(rootDir, 'frontend', 'public', 'blogs'),
  path.join(rootDir, 'backend', 'public', 'blogs'),
  path.join(rootDir, 'frontend', 'public', 'locations'),
  path.join(rootDir, 'backend', 'public', 'locations'),
];

outputDirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// 1. Generate Product Static Pages (stored as product/${p.slug}.html and root ${p.slug}.html)
ALL_PRODUCTS.forEach(p => {
  const htmlContent = generateProductHtml(p);
  const rootLocations = [path.join(rootDir, 'frontend', 'public'), path.join(rootDir, 'backend', 'public')];
  rootLocations.forEach(dir => {
    fs.writeFileSync(path.join(dir, `${p.slug}.html`), htmlContent, 'utf-8');
  });
  [path.join(rootDir, 'frontend', 'public', 'product'), path.join(rootDir, 'backend', 'public', 'product')].forEach(dir => {
    fs.writeFileSync(path.join(dir, `${p.slug}.html`), htmlContent, 'utf-8');
  });
  console.log(`Generated product static HTML for: ${p.slug}`);
});

// 2. Generate Blog Static Pages (stored as blog/${b.slug}.html and root ${b.slug}.html)
ALL_BLOGS.forEach(b => {
  const blogHtml = generateBlogHtml(b);
  const rootLocations = [path.join(rootDir, 'frontend', 'public'), path.join(rootDir, 'backend', 'public')];
  rootLocations.forEach(dir => {
    fs.writeFileSync(path.join(dir, `${b.slug}.html`), blogHtml, 'utf-8');
  });
  [path.join(rootDir, 'frontend', 'public', 'blog'), path.join(rootDir, 'backend', 'public', 'blog')].forEach(dir => {
    fs.writeFileSync(path.join(dir, `${b.slug}.html`), blogHtml, 'utf-8');
  });
  console.log(`Generated blog article static HTML for: ${b.slug}`);
});

// 3. Generate Profile Static Pages
const manishHtml = generateManishProfileHtml();
[path.join(rootDir, 'frontend', 'public'), path.join(rootDir, 'backend', 'public')].forEach(dir => {
  fs.writeFileSync(path.join(dir, 'manish-kumar.html'), manishHtml, 'utf-8');
});

// 4. Generate Standard Clean Canonical XML Sitemap
// Google Search Console Best Practice: Only 100% canonical 200-OK URLs! No duplicates, no redirects, no aliases.
function buildCompleteSitemapXml() {
  const domain = 'https://www.afshaenterprises.com';
  const today = '2026-09-09';
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n`;
  xml += `        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  const canonicalEntries = [
    // Core Site Pages
    { loc: `${domain}/`, priority: '1.0', changefreq: 'daily', lastmod: today },
    { loc: `${domain}/products`, priority: '0.9', changefreq: 'daily', lastmod: today },
    { loc: `${domain}/blogs`, priority: '0.8', changefreq: 'daily', lastmod: today },
    { loc: `${domain}/contact`, priority: '0.7', changefreq: 'monthly', lastmod: today },

    // Single Canonical Developer Profile Page
    {
      loc: `${domain}/manish-kumar`,
      priority: '1.0',
      changefreq: 'daily',
      lastmod: today,
      image: { loc: `${domain}/manish-kumar.jpg`, title: 'Manish Kumar - Senior Java Full Stack Developer' }
    },

    // 6 Single Canonical Product URLs (/product/:slug)
    ...ALL_PRODUCTS.map(p => ({
      loc: `${domain}/product/${p.slug}`,
      priority: '1.0',
      changefreq: 'daily',
      lastmod: today,
      image: { loc: `${domain}${p.image}`, title: p.name }
    })),

    // 4 Category URLs
    { loc: `${domain}/category/wellness-massage`, priority: '0.85', changefreq: 'weekly', lastmod: today },
    { loc: `${domain}/category/skincare`, priority: '0.85', changefreq: 'weekly', lastmod: today },
    { loc: `${domain}/category/hair-care`, priority: '0.85', changefreq: 'weekly', lastmod: today },
    { loc: `${domain}/category/body`, priority: '0.85', changefreq: 'weekly', lastmod: today },

    // 9 Single Canonical Blog URLs (/blog/:slug)
    ...ALL_BLOGS.map(b => ({
      loc: `${domain}/blog/${b.slug}`,
      priority: '0.85',
      changefreq: 'weekly',
      lastmod: today,
      image: { loc: `${domain}${b.image}`, title: b.title }
    })),

    // Location Pages
    { loc: `${domain}/locations/delhi`, priority: '0.8', changefreq: 'weekly', lastmod: today },
    { loc: `${domain}/locations/mumbai`, priority: '0.8', changefreq: 'weekly', lastmod: today },
    { loc: `${domain}/locations/bangalore`, priority: '0.8', changefreq: 'weekly', lastmod: today },
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
  return xml;
}

function buildSitemapIndexXml() {
  const domain = 'https://www.afshaenterprises.com';
  const today = '2026-09-09';
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${domain}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;
}

const sitemapXml = buildCompleteSitemapXml();
const sitemapIndexXml = buildSitemapIndexXml();

// Write sitemap.xml and sitemap_index.xml only to root public directories
const sitemapFiles = [
  { path: path.join(rootDir, 'frontend', 'public', 'sitemap.xml'), content: sitemapXml },
  { path: path.join(rootDir, 'backend', 'public', 'sitemap.xml'), content: sitemapXml },
  { path: path.join(rootDir, 'frontend', 'public', 'sitemap_index.xml'), content: sitemapIndexXml },
  { path: path.join(rootDir, 'backend', 'public', 'sitemap_index.xml'), content: sitemapIndexXml },
];

sitemapFiles.forEach(f => {
  const dir = path.dirname(f.path);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(f.path, f.content, 'utf-8');
});

// Clean up duplicate subfolder sitemaps so GSC doesn't crawl them
const staleSubfolderSitemaps = [
  path.join(rootDir, 'frontend', 'public', 'blogs', 'sitemap.xml'),
  path.join(rootDir, 'backend', 'public', 'blogs', 'sitemap.xml'),
  path.join(rootDir, 'frontend', 'public', 'blog', 'sitemap.xml'),
  path.join(rootDir, 'backend', 'public', 'blog', 'sitemap.xml'),
  path.join(rootDir, 'frontend', 'public', 'products', 'sitemap.xml'),
  path.join(rootDir, 'backend', 'public', 'products', 'sitemap.xml'),
  path.join(rootDir, 'frontend', 'public', 'product', 'sitemap.xml'),
  path.join(rootDir, 'backend', 'public', 'product', 'sitemap.xml'),
];

staleSubfolderSitemaps.forEach(f => {
  if (fs.existsSync(f)) {
    try { fs.unlinkSync(f); } catch (e) {}
  }
});

console.log('All static pages, articles, profiles, and XML sitemaps generated successfully!');

