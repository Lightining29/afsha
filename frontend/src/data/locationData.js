/**
 * Local SEO Landing Data for Major Indian Metros
 * Enables High Ranking for "body massager in [City]" and "buy massager online in [City]"
 */

export const LOCATION_DATA = {
  delhi: {
    city: 'Delhi NCR',
    state: 'Delhi',
    deliveryTime: '24-48 Hours Express Delivery',
    metaTitle: 'Buy Electric Body Massagers in Delhi NCR — Same Day Dispatch | Afsha Enterprises',
    metaDescription: 'Shop top-rated Electric Body Massagers and Deep Tissue Massage Guns in Delhi NCR. Superfast 24-48h delivery across South Delhi, East Delhi, Noida, Gurgaon, and Faridabad.',
    keywords: 'body massager Delhi, electric massager shop Delhi, massage gun price Delhi NCR, buy massager Noida, massager Gurgaon',
    popularPincodes: ['110001', '110019', '110025', '110048', '110092', '201301', '122001'],
    localReview: {
      author: 'Amitabh Sharma',
      locality: 'Saket, New Delhi',
      comment: 'Ordered the Electric Body Massager at 11 AM, received it the very next afternoon! Excellent motor power for my back pain.'
    }
  },
  mumbai: {
    city: 'Mumbai',
    state: 'Maharashtra',
    deliveryTime: '2-3 Days Express Delivery',
    metaTitle: 'Buy Electric Body Massagers in Mumbai — Fast Doorstep Delivery | Afsha Enterprises',
    metaDescription: 'Order premium Electric Body Massagers and Percussion Massage Guns in Mumbai. Fast delivery across Bandra, Andheri, South Mumbai, Navi Mumbai, and Thane.',
    keywords: 'body massager Mumbai, electric massager Bandra, massage gun price Mumbai, buy body massager Thane, deep tissue massager Navi Mumbai',
    popularPincodes: ['400001', '400050', '400053', '400076', '400601', '400703'],
    localReview: {
      author: 'Pooja Deshmukh',
      locality: 'Andheri West, Mumbai',
      comment: 'Best massager for long local train commutes! Completely relaxes stiff shoulder blades after a tiring day.'
    }
  },
  bangalore: {
    city: 'Bengaluru',
    state: 'Karnataka',
    deliveryTime: '2-3 Days Express Delivery',
    metaTitle: 'Buy Electric Body Massagers in Bengaluru — Techie Posture Pain Relief | Afsha Enterprises',
    metaDescription: 'Best body massagers and cervical neck massagers in Bengaluru. Relieve IT desk backache and neck stiffness. Doorstep delivery across Whitefield, Indiranagar, Koramangala, and HSR Layout.',
    keywords: 'body massager Bangalore, IT back pain massager Bengaluru, massage gun Koramangala, electric massager Whitefield, HSR Layout massager',
    popularPincodes: ['560001', '560034', '560038', '560066', '560102'],
    localReview: {
      author: 'Dr. Rajesh Iyer',
      locality: 'Indiranagar, Bengaluru',
      comment: 'An absolute must-have for IT software developers sitting in chairs for 10 hours. The wave vibration head is incredibly therapeutic.'
    }
  }
};

export function getLocationData(citySlug) {
  return LOCATION_DATA[citySlug?.toLowerCase()] || LOCATION_DATA['delhi'];
}
