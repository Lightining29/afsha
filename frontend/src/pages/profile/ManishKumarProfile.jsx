import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import {
  Code,
  Server,
  Cloud,
  Shield,
  Briefcase,
  GraduationCap,
  Mail,
  Phone,
  MessageCircle,
  ExternalLink,
  Download,
  CheckCircle2,
  Sparkles,
  Layers,
  Cpu,
  Terminal,
  Database,
  Globe,
  ChevronRight,
  ChevronLeft,
  MoreVertical,
  Wifi,
  Battery,
  Send,
  Plus,
  Github,
  Linkedin,
  Check,
  Zap,
  HelpCircle,
  Eye,
  Lock
} from 'lucide-react';
import Footer from '../../components/layout/Footer';
import './ManishKumarProfile.css';

export default function ManishKumarProfile() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('all');
  const [activeScreen, setActiveScreen] = useState('chat'); // 'hero' or 'chat' or 'both'
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'manish',
      text: "Hii, I'm Manish Kumar, your Senior Java Full Stack Developer & AWS Cloud Architect ❤️ How can I help you build your project today?",
      time: '19:45 Pm'
    },
    {
      id: 2,
      sender: 'manish',
      isCard: true,
      cardTitle: 'Afsha Enterprises & Cloud Projects',
      cardDesc: 'High-scale commercial e-commerce, LMS, and AWS microservices.',
      time: '19:46 Pm'
    },
    {
      id: 3,
      sender: 'manish',
      isNotice: true,
      text: '⚡ Available for Full-Time, Freelance & Cloud Consulting roles! Expect high-performance clean code ahead.',
      time: '19:47 Pm'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Determine SEO title and description based on exact route keyword focus
  const currentPath = location.pathname.toLowerCase();
  let seoTitle = 'Manish Kumar | Best Java Full Stack Developer & AWS DevOps Engineer';
  let seoHeading = 'Manish Kumar';
  let seoRole = 'Senior Java Full Stack Developer & AWS Solutions Architect';
  let seoKeywords = 'Manish Kumar, Manish, Manish Kumar Java Developer, Manish Kumar DevOps Engineer, Manish Kumar Full Stack, Best Java Full Stack Developer India, Manish Kumar Ghaziabad, Java Developer Manish Kumar, AWS Architect Manish Kumar, Spring Boot Developer Manish Kumar, Hire Manish Kumar';

  if (currentPath.includes('java')) {
    seoTitle = 'Manish Kumar — Senior Java Developer & Spring Boot Microservices Specialist';
    seoRole = 'Senior Java & Spring Boot Microservices Architect';
    seoKeywords = 'Manish Kumar Java, Manish Kumar Java Developer, Manish Kumar Spring Boot, Java Full Stack Developer Manish Kumar, Manish Java, Best Java Developer India, Manish Kumar Hibernate JPA';
  } else if (currentPath.includes('devops') || currentPath.includes('aws')) {
    seoTitle = 'Manish Kumar — AWS Cloud DevOps Solutions Architect & CI/CD Specialist';
    seoRole = 'AWS DevOps Solutions Architect & Kubernetes Engineer';
    seoKeywords = 'Manish Kumar DevOps, Manish Kumar AWS, Manish Kumar Cloud Architect, Manish Kumar Docker Kubernetes, Manish DevOps, AWS Certified Manish Kumar';
  } else if (currentPath === '/manish') {
    seoTitle = 'Manish | Official Portfolio & Profile — Java Full Stack & Cloud Architect';
    seoHeading = 'Manish';
    seoKeywords = 'Manish, Manish Developer, Manish Full Stack, Manish Java, Manish AWS, Manish Software Engineer, Manish Kumar, Manish Portfolio';
  } else if (currentPath.includes('resume')) {
    seoTitle = 'Manish Kumar Resume & CV | Senior Java Full Stack & AWS DevOps Engineer';
    seoRole = 'Verified Resume & CV — Manish Kumar';
  }

  const canonicalUrl = `https://www.afshaenterprises.com${location.pathname}`;
  const profileImageUrl = 'https://www.afshaenterprises.com/manish-kumar.jpg';

  const handleSendChat = (e) => {
    e?.preventDefault();
    const query = chatInput.trim();
    if (!query) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: currentTime
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const q = query.toLowerCase();

      if (q.includes('hire') || q.includes('contact') || q.includes('call') || q.includes('whatsapp') || q.includes('number')) {
        reply = 'I am actively available for full-time roles, contract work, and cloud consulting! You can contact me directly on WhatsApp/Call at +91 8851961088 or email brayw433@gmail.com.';
      } else if (q.includes('skill') || q.includes('tech') || q.includes('stack') || q.includes('java') || q.includes('spring')) {
        reply = 'My core tech stack: Java 17/21, Spring Boot 3, Spring Security, Hibernate ORM, Microservices, React.js, Docker, Kubernetes, AWS (EC2, S3, RDS, Lambda), Jenkins CI/CD, MySQL, and PostgreSQL.';
      } else if (q.includes('project') || q.includes('afsha') || q.includes('work') || q.includes('experience')) {
        reply = 'I have built enterprise applications including Afsha Enterprises (commercial e-commerce with payments), ProgrammingWala (LMS portal), and Rancom Technologies (cloud infrastructure), plus work at Appletree Infotech.';
      } else if (q.includes('resume') || q.includes('cv') || q.includes('download')) {
        reply = 'You can explore all my verified code on GitHub (@Lightining29) or connect directly on WhatsApp (+91 8851961088) to get my complete PDF resume.';
      } else {
        reply = `Thank you for asking about "${query}". I would love to discuss this with you! Would you like to connect on WhatsApp or schedule a technical discussion?`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'manish',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 850);
  };

  const handleQuickTopic = (topicText) => {
    setChatInput(topicText);
    setTimeout(() => {
      const form = document.getElementById('chatFormDirect');
      if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 50);
  };

  // Structured Data (JSON-LD) for Search Engines & Copilot AI
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://www.afshaenterprises.com/manish-kumar#person",
        "name": "Manish Kumar",
        "givenName": "Manish",
        "familyName": "Kumar",
        "alternateName": [
          "Manish",
          "Manish Kumar Java Developer",
          "Manish Kumar DevOps Engineer",
          "Manish Kumar Full Stack Developer",
          "Manish Kumar Software Engineer",
          "Manish Kumar AWS Solutions Architect",
          "Manish Kumar Ghaziabad"
        ],
        "jobTitle": [
          "Senior Java Full Stack Developer",
          "AWS DevOps Solutions Architect",
          "Spring Boot Microservices Specialist",
          "Lead Cloud Infrastructure Engineer"
        ],
        "description": "Manish Kumar is a top-ranked Java Full Stack Developer and AWS DevOps Solutions Architect with a B.Tech in Computer Science. Expert in Java 17/21, Spring Boot, Microservices, React.js, Docker, Kubernetes, CI/CD, and AWS Cloud Architecture.",
        "email": "brayw433@gmail.com",
        "telephone": "+91-8851961088",
        "image": profileImageUrl,
        "url": canonicalUrl,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Ghaziabad",
          "addressRegion": "Uttar Pradesh",
          "postalCode": "201001",
          "addressCountry": "IN"
        },
        "alumniOf": {
          "@type": "EducationalOrganization",
          "name": "B.Tech in Computer Science Engineering"
        },
        "hasOccupation": {
          "@type": "Occupation",
          "name": "Java Full Stack Developer & AWS DevOps Architect",
          "skills": [
            "Java 17/21", "Spring Boot", "Microservices", "Hibernate ORM",
            "REST APIs", "React.js", "Docker", "Kubernetes", "AWS Cloud",
            "Jenkins CI/CD", "Linux Administration", "MySQL", "PostgreSQL",
            "Cybersecurity Auditing", "Metasploit", "Nmap"
          ]
        },
        "worksFor": {
          "@type": "Organization",
          "name": "Appletree Infotech"
        },
        "sameAs": [
          "https://manish-java-developer.vercel.app/",
          "https://manish-javafullstack.netlify.app/",
          "https://github.com/Lightining29",
          "https://github.com/Lightining29/manish-kumar-javafullstackdeveloper",
          "https://github.com/Lightining29/afsha",
          "https://linkedin.com/in/manishkumar",
          "https://dev.to/manish_kumar_java",
          "https://medium.com/@brayw433"
        ]
      },
      {
        "@type": "ProfilePage",
        "@id": `${canonicalUrl}#webpage`,
        "url": canonicalUrl,
        "name": seoTitle,
        "description": "Official verified portfolio and profile of Manish Kumar — Senior Java Full Stack Developer, Spring Boot Microservices Architect & AWS DevOps Engineer.",
        "mainEntity": { "@id": "https://www.afshaenterprises.com/manish-kumar#person" }
      },
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Who is Manish Kumar?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Manish Kumar is a top-ranked Java Full Stack Developer, Spring Boot Microservices Specialist, and AWS Certified DevOps Engineer based in Ghaziabad, India. He holds a B.Tech in Computer Science and engineers high-throughput enterprise systems."
            }
          },
          {
            "@type": "Question",
            "name": "What technologies does Manish Kumar specialize in?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Manish Kumar specializes in Core & Advanced Java (Java 17/21), Spring Boot, Spring Security, Hibernate ORM, Microservices, RESTful APIs, React.js, Docker, Kubernetes, Jenkins CI/CD, AWS Cloud Architecture (EC2, S3, RDS), Linux Administration, MySQL, and PostgreSQL."
            }
          },
          {
            "@type": "Question",
            "name": "How to contact or hire Manish Kumar?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can reach Manish Kumar directly via WhatsApp/Phone at +91 8851961088, email at brayw433@gmail.com, or visit his GitHub at https://github.com/Lightining29."
            }
          }
        ]
      }
    ]
  };

  const skillsData = [
    { category: 'backend', name: 'Java 17 / 21', level: 'Expert', icon: <Code size={18} /> },
    { category: 'backend', name: 'Spring Boot 3', level: 'Expert', icon: <Server size={18} /> },
    { category: 'backend', name: 'Microservices', level: 'Advanced', icon: <Layers size={18} /> },
    { category: 'backend', name: 'Hibernate / JPA', level: 'Expert', icon: <Database size={18} /> },
    { category: 'backend', name: 'RESTful APIs', level: 'Expert', icon: <Globe size={18} /> },
    { category: 'devops', name: 'AWS Cloud (EC2, S3, RDS)', level: 'Advanced', icon: <Cloud size={18} /> },
    { category: 'devops', name: 'Docker Containers', level: 'Expert', icon: <Cpu size={18} /> },
    { category: 'devops', name: 'Kubernetes (K8s)', level: 'Advanced', icon: <Server size={18} /> },
    { category: 'devops', name: 'Jenkins CI/CD', level: 'Expert', icon: <Terminal size={18} /> },
    { category: 'devops', name: 'Linux Administration', level: 'Expert', icon: <Terminal size={18} /> },
    { category: 'frontend', name: 'React.js', level: 'Expert', icon: <Code size={18} /> },
    { category: 'frontend', name: 'JavaScript / ES6+', level: 'Expert', icon: <Code size={18} /> },
    { category: 'frontend', name: 'HTML5 & CSS3', level: 'Expert', icon: <Globe size={18} /> },
    { category: 'frontend', name: 'Tailwind CSS', level: 'Advanced', icon: <Layers size={18} /> },
    { category: 'database', name: 'MySQL & PostgreSQL', level: 'Expert', icon: <Database size={18} /> },
    { category: 'database', name: 'MongoDB (NoSQL)', level: 'Advanced', icon: <Database size={18} /> },
    { category: 'security', name: 'Cybersecurity Auditing', level: 'Advanced', icon: <Shield size={18} /> },
    { category: 'security', name: 'Nmap & Metasploit', level: 'Proficient', icon: <Shield size={18} /> }
  ];

  const filteredSkills = activeTab === 'all'
    ? skillsData
    : skillsData.filter((s) => s.category === activeTab);

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="title" content={seoTitle} />
        <meta
          name="description"
          content={`Official verified profile of ${seoHeading} (${seoRole}). Specialized in Java 17/21, Spring Boot, Microservices, React.js, Docker, Kubernetes, CI/CD, and AWS Cloud Architecture.`}
        />
        <meta name="keywords" content={seoKeywords} />
        <meta name="author" content="Manish Kumar" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={`Official portfolio & profile of ${seoHeading} — Senior Java Full Stack Developer & AWS DevOps Architect.`} />
        <meta property="og:image" content={profileImageUrl} />
        <meta property="profile:first_name" content="Manish" />
        <meta property="profile:last_name" content="Kumar" />
        <meta property="profile:username" content="Lightining29" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={`Senior Java Full Stack Developer & AWS DevOps Architect — ${seoHeading}.`} />
        <meta name="twitter:image" content={profileImageUrl} />

        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(jsonLdSchema)}</script>
      </Helmet>

      {/* Standalone Distraction-Free Mobile App Canvas (No Navbar, No BottomNav, No Back Button) */}
      <main className="luv-standalone-page">
        {/* Soft Ambient Rose/Peach/Lavender Glows */}
        <div className="luv-glow-orb glow-rose-top" />
        <div className="luv-glow-orb glow-peach-mid" />
        <div className="luv-glow-orb glow-lavender-bot" />

        <div className="luv-app-stage">
          {/* Dual Phone Showcase Container (Exact replica of reference UI) */}
          <div className="luv-dual-phones-wrap">

            {/* ── PHONE 1: Immersive Hero Card ── */}
            <div className="luv-phone-mockup phone-hero-mockup">
              {/* iOS Status Bar */}
              <div className="ios-status-bar">
                <span className="ios-time">9:41</span>
                <div className="ios-status-icons">
                  <span className="ios-signal-bars">••••</span>
                  <Wifi size={13} />
                  <Battery size={15} />
                </div>
              </div>

              {/* Brand Tag */}
              <div className="luv-app-logo-row">
                <span className="luv-logo-text">Manish.AI</span>
              </div>

              {/* Immersive Portrait Card */}
              <div className="luv-portrait-showcase">
                <img
                  src="/manish-kumar.webp"
                  onError={(e) => { e.target.src = '/manish-kumar.jpg'; }}
                  alt="Manish Kumar"
                  className="luv-hero-photo"
                  fetchpriority="high"
                />
                <div className="luv-hero-photo-scrim" />

                <div className="luv-hero-name-overlay">
                  <h1 className="hero-display-name">Manish</h1>
                </div>

                {/* Progress Indicators */}
                <div className="luv-story-progress-bars">
                  <span className="story-bar active" />
                  <span className="story-bar" />
                  <span className="story-bar" />
                </div>
              </div>

              {/* Floating Bottom Card */}
              <div className="luv-floating-bottom-card">
                <div className="plan-label-text">About the engineer</div>

                <div className="plan-main-row">
                  <div>
                    <h3 className="plan-title-h3">Full Stack &amp; Cloud</h3>
                    <span className="plan-sub-text">Java 17/21 + AWS DevOps</span>
                  </div>
                  <div className="plan-rate-box">
                    <span className="rate-amount">Available</span>
                    <span className="rate-period">Full-Time / Freelance</span>
                  </div>
                </div>

                <div className="plan-feature-bullets">
                  <div className="bullet-row">
                    <Check size={13} className="bullet-chk" />
                    <span>Spring Boot Microservices &amp; REST APIs</span>
                  </div>
                  <div className="bullet-row">
                    <Check size={13} className="bullet-chk" />
                    <span>AWS Cloud, Docker, Kubernetes &amp; CI/CD</span>
                  </div>
                </div>

                <a
                  href="https://wa.me/918851961088?text=Hi%20Manish,%20I%20saw%20your%20profile%20and%20would%20like%20to%20discuss%20a%20project!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="luv-black-pill-cta"
                >
                  Chat Now
                </a>

                <div className="plan-footer-sub">
                  <span>Ghaziabad, Uttar Pradesh, India</span>
                </div>
              </div>
            </div>

            {/* ── PHONE 2: Conversational Chat & Profile Stream ── */}
            <div className="luv-phone-mockup phone-chat-mockup">
              {/* iOS Status Bar */}
              <div className="ios-status-bar">
                <span className="ios-time">9:41</span>
                <div className="ios-status-icons">
                  <span className="ios-signal-bars">••••</span>
                  <Wifi size={13} />
                  <Battery size={15} />
                </div>
              </div>

              {/* Top Navigation Bar inside Phone */}
              <div className="ios-chat-nav-bar">
                <button
                  type="button"
                  className="ios-nav-circle-btn"
                  onClick={() => window.history.back()}
                  aria-label="Back"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="ios-nav-title">Manish Kumar</div>
                <button
                  type="button"
                  className="ios-nav-circle-btn"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: seoTitle, url: canonicalUrl });
                    }
                  }}
                  aria-label="Share"
                >
                  <MoreVertical size={17} />
                </button>
              </div>

              {/* Ambient Circular Avatar in Top Center (Exact match to reference) */}
              <div className="luv-avatar-center-stage">
                <div className="luv-avatar-halo-ring">
                  <img
                    src="/manish-kumar.webp"
                    onError={(e) => { e.target.src = '/manish-kumar.jpg'; }}
                    alt="Manish Kumar"
                    className="luv-center-avatar-img"
                  />
                </div>
                <h2 className="luv-center-user-name">Manish Kumar</h2>
                <div className="luv-center-online-status">
                  <span className="online-green-pulse" /> Online
                </div>
              </div>

              {/* Topic Category Pills */}
              <div className="luv-chat-pills-carousel">
                <button
                  type="button"
                  className="chat-filter-pill active"
                  onClick={() => handleQuickTopic('⚡ I want to hire you for a Java Spring Boot project')}
                >
                  ⚡ Exclusive Chat
                </button>
                <button
                  type="button"
                  className="chat-filter-pill"
                  onClick={() => handleQuickTopic('☁️ Tell me about your AWS DevOps & CI/CD architecture')}
                >
                  ☁️ AWS DevOps
                </button>
                <button
                  type="button"
                  className="chat-filter-pill"
                  onClick={() => handleQuickTopic('💼 What major production projects have you built?')}
                >
                  💼 Projects
                </button>
                <button
                  type="button"
                  className="chat-filter-pill"
                  onClick={() => handleQuickTopic('📄 Please share your verified resume/CV')}
                >
                  📄 Resume / CV
                </button>
              </div>

              {/* Conversation Stream Scroll Container */}
              <div className="luv-chat-thread-container">
                <div className="thread-day-tag">
                  <span>Today</span>
                </div>

                {messages.map((m) => (
                  <div key={m.id} className={`thread-message-item ${m.sender === 'user' ? 'from-user' : 'from-manish'}`}>
                    {m.sender === 'manish' && (
                      <img
                        src="/manish-kumar.webp"
                        onError={(e) => { e.target.src = '/manish-kumar.jpg'; }}
                        alt="Manish"
                        className="thread-mini-avatar"
                      />
                    )}

                    <div className="thread-msg-body">
                      {m.sender === 'manish' && <span className="thread-sender-label">Manish Kumar</span>}

                      {/* Card Type Message */}
                      {m.isCard ? (
                        <div className="thread-media-card">
                          <div className="media-card-img-placeholder">
                            <Eye size={20} className="media-eye-icon" />
                            <span>Afsha Enterprises Showcase</span>
                          </div>
                          <div className="media-card-info">
                            <strong>{m.cardTitle}</strong>
                            <p>{m.cardDesc}</p>
                          </div>
                        </div>
                      ) : m.isNotice ? (
                        <div className="thread-notice-bubble">
                          <Zap size={14} className="notice-zap-icon" />
                          <span>{m.text}</span>
                        </div>
                      ) : (
                        <div className="thread-bubble-box">
                          {m.text}
                        </div>
                      )}

                      <span className="thread-msg-time">{m.time}</span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="thread-message-item from-manish">
                    <img
                      src="/manish-kumar.webp"
                      onError={(e) => { e.target.src = '/manish-kumar.jpg'; }}
                      alt="Manish"
                      className="thread-mini-avatar"
                    />
                    <div className="thread-typing-bubble">
                      <span className="dot" />
                      <span className="dot" />
                      <span className="dot" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Interactive Floating Chat Input Bar */}
              <form id="chatFormDirect" onSubmit={handleSendChat} className="ios-chat-bottom-input">
                <a
                  href="tel:+918851961088"
                  className="ios-input-plus-btn"
                  title="Direct Call"
                >
                  <Plus size={18} />
                </a>
                <input
                  type="text"
                  placeholder="Type something here..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="ios-native-text-input"
                />
                <button type="submit" className="ios-send-circle-btn" aria-label="Send message">
                  <Send size={15} />
                </button>
              </form>
            </div>
          </div>

          {/* ── Quick Direct Action Bar ── */}
          <div className="luv-actions-pills-bar">
            <a href="tel:+918851961088" className="app-action-pill">
              <Phone size={15} /> +91 8851961088
            </a>
            <a href="mailto:brayw433@gmail.com" className="app-action-pill">
              <Mail size={15} /> brayw433@gmail.com
            </a>
            <a
              href="https://github.com/Lightining29"
              target="_blank"
              rel="noopener noreferrer"
              className="app-action-pill"
            >
              <Github size={15} /> GitHub @Lightining29
            </a>
            <a
              href="https://manish-java-developer.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="app-action-pill"
            >
              <ExternalLink size={15} /> Live Portfolio
            </a>
          </div>

          {/* ── Comprehensive Profile Details & SEO Knowledge Graph (For Crawlers, Recruiter Reviews & Copilot AI) ── */}
          <div className="luv-extended-portfolio-sheet">
            {/* Biography */}
            <section className="sheet-section">
              <div className="sheet-section-head">
                <span className="sheet-pill-tag"><GraduationCap size={13} /> Biography</span>
                <h2 className="sheet-h2">About Manish Kumar</h2>
              </div>
              <div className="sheet-card-box">
                <p className="sheet-p">
                  <strong>Manish Kumar</strong> is a top-ranked <strong>Java Full Stack Developer</strong> and <strong>AWS Cloud DevOps Architect</strong> holding a <strong>B.Tech in Computer Science</strong>. He specializes in designing resilient microservice backends, reactive user interfaces, and automated CI/CD cloud delivery pipelines.
                </p>
                <div className="sheet-key-highlights">
                  <div className="highlight-item">
                    <GraduationCap size={18} className="hl-icon" />
                    <div>
                      <strong>B.Tech Computer Science</strong>
                      <p>Core Data Structures, Algorithms &amp; OOPs</p>
                    </div>
                  </div>
                  <div className="highlight-item">
                    <Briefcase size={18} className="hl-icon" />
                    <div>
                      <strong>Appletree Infotech Intern</strong>
                      <p>Commercial Full Stack Enterprise Web Apps</p>
                    </div>
                  </div>
                  <div className="highlight-item">
                    <Cloud size={18} className="hl-icon" />
                    <div>
                      <strong>AWS Cloud Architecture</strong>
                      <p>EC2, S3, RDS, Lambda, Docker &amp; Kubernetes</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Featured Projects */}
            <section className="sheet-section">
              <div className="sheet-section-head">
                <span className="sheet-pill-tag"><Code size={13} /> Proven Deliveries</span>
                <h2 className="sheet-h2">Featured Production Projects</h2>
              </div>

              <div className="sheet-projects-grid">
                <div className="sheet-project-card">
                  <span className="proj-badge">E-Commerce System</span>
                  <h3 className="proj-title">Afsha Enterprises</h3>
                  <p className="proj-desc">
                    Commercial e-commerce platform with Razorpay payment gateway integration, instant OTP authentication, real-time reviews, and product caching.
                  </p>
                  <div className="proj-tags">
                    <span>Java</span><span>Spring Boot</span><span>React.js</span><span>Razorpay</span>
                  </div>
                </div>

                <div className="sheet-project-card">
                  <span className="proj-badge">LMS &amp; Education</span>
                  <h3 className="proj-title">ProgrammingWala</h3>
                  <p className="proj-desc">
                    Full-featured developer learning management system built with the MERN stack for coding tutorials, video modules, and student tracking.
                  </p>
                  <div className="proj-tags">
                    <span>MERN</span><span>Node.js</span><span>React.js</span><span>MongoDB</span>
                  </div>
                </div>

                <div className="sheet-project-card">
                  <span className="proj-badge">Corporate Cloud Portal</span>
                  <h3 className="proj-title">Rancom Technologies</h3>
                  <p className="proj-desc">
                    Enterprise IT platform engineered for Rancom Technologies Pvt Ltd with scalable microservices and automated AWS cloud infrastructure.
                  </p>
                  <div className="proj-tags">
                    <span>Java</span><span>AWS Cloud</span><span>Docker</span><span>CI/CD</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Technical Skills */}
            <section className="sheet-section">
              <div className="sheet-section-head">
                <span className="sheet-pill-tag"><Cpu size={13} /> Technical Stack</span>
                <h2 className="sheet-h2">Skills &amp; Competencies</h2>
              </div>

              <div className="sheet-filter-tabs">
                {['all', 'backend', 'devops', 'frontend', 'database', 'security'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={`sheet-tab-btn ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="sheet-skills-grid">
                {filteredSkills.map((s, i) => (
                  <div key={i} className="sheet-skill-item">
                    <div className="skill-icon-wrap">{s.icon}</div>
                    <div>
                      <div className="skill-name-txt">{s.name}</div>
                      <div className="skill-lvl-txt">{s.level}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* AI Knowledge Graph & FAQ (Google, Bing, Copilot) */}
            <section className="sheet-section">
              <div className="sheet-section-head">
                <span className="sheet-pill-tag"><Sparkles size={13} /> Knowledge Graph</span>
                <h2 className="sheet-h2">Frequently Asked Questions</h2>
              </div>

              <div className="sheet-faqs-list">
                <div className="faq-box">
                  <h3 className="faq-q"><HelpCircle size={15} /> Who is Manish Kumar?</h3>
                  <p className="faq-a">
                    <strong>Manish Kumar</strong> is an accomplished <strong>Java Full Stack Developer</strong>, Spring Boot Microservices Architect, and AWS DevOps Engineer with a B.Tech in Computer Science from Ghaziabad, Uttar Pradesh, India.
                  </p>
                </div>

                <div className="faq-box">
                  <h3 className="faq-q"><HelpCircle size={15} /> What technologies does Manish Kumar specialize in?</h3>
                  <p className="faq-a">
                    Manish Kumar specializes in <strong>Core &amp; Advanced Java (Java 17/21)</strong>, <strong>Spring Boot</strong>, Spring Security, Hibernate ORM, Microservices, REST APIs, <strong>React.js</strong>, <strong>AWS Cloud Architecture</strong>, <strong>Docker</strong>, <strong>Kubernetes</strong>, Jenkins CI/CD, Linux Administration, MySQL, and PostgreSQL.
                  </p>
                </div>

                <div className="faq-box">
                  <h3 className="faq-q"><HelpCircle size={15} /> How to hire or contact Manish Kumar?</h3>
                  <p className="faq-a">
                    You can contact Manish Kumar directly via WhatsApp/Phone at <a href="tel:+918851961088">+91 8851961088</a>, email at <a href="mailto:brayw433@gmail.com">brayw433@gmail.com</a>, or explore his GitHub profile at <a href="https://github.com/Lightining29" target="_blank" rel="noopener noreferrer">@Lightining29</a>.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
