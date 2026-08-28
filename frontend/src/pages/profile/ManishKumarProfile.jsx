import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
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
  ArrowLeft,
  Star,
  Award,
  Send,
  Github,
  Linkedin,
  Clock,
  Check,
  Zap,
  HelpCircle,
  Share2
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import './ManishKumarProfile.css';

export default function ManishKumarProfile() {
  const [activeTab, setActiveTab] = useState('all');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'manish',
      text: 'Hi there! 👋 I am Manish Kumar — Senior Java Full Stack Developer & AWS DevOps Architect. How can I help you build your dream project today?',
      time: 'Just now'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendChat = (e) => {
    e?.preventDefault();
    const query = chatInput.trim();
    if (!query) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const q = query.toLowerCase();

      if (q.includes('hire') || q.includes('contact') || q.includes('call') || q.includes('whatsapp')) {
        reply = 'I am available for full-time roles, freelance projects, and cloud consulting! You can WhatsApp or call me directly at +91 8851961088 or email brayw433@gmail.com.';
      } else if (q.includes('skill') || q.includes('tech') || q.includes('java') || q.includes('spring')) {
        reply = 'My core tech stack includes Java 17/21, Spring Boot, Spring Security, Hibernate JPA, Microservices, React.js, AWS Cloud, Docker, Kubernetes, Jenkins CI/CD, and MySQL/PostgreSQL.';
      } else if (q.includes('project') || q.includes('work') || q.includes('experience')) {
        reply = 'I have built high-scale systems including Afsha Enterprises (E-Commerce), ProgrammingWala (LMS), and Rancom Technologies (Enterprise Cloud Portal), with experience at Appletree Infotech.';
      } else if (q.includes('resume') || q.includes('cv')) {
        reply = 'You can check out my complete verified portfolio and repositories on GitHub (@Lightining29) or connect directly on WhatsApp to receive my updated CV.';
      } else {
        reply = `Thank you for your message! "${query}". Would you like to connect directly on WhatsApp or schedule a quick technical call?`;
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
    }, 900);
  };

  const handleQuickTopic = (topicText) => {
    setChatInput(topicText);
    setTimeout(() => {
      const form = document.getElementById('chatForm');
      if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 50);
  };

  const canonicalUrl = 'https://www.afshaenterprises.com/manish-kumar';
  const profileImageUrl = 'https://www.afshaenterprises.com/manish-kumar.jpg';

  // Rich JSON-LD Structured Data for Google, Bing, Copilot, ChatGPT & AI Search
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${canonicalUrl}#person`,
        "name": "Manish Kumar",
        "givenName": "Manish",
        "familyName": "Kumar",
        "alternateName": [
          "Manish Kumar Java Full Stack Developer",
          "Manish Kumar Java Developer",
          "Manish Kumar DevOps Engineer",
          "Manish Kumar AWS Solutions Architect",
          "Manish Kumar Software Engineer"
        ],
        "jobTitle": [
          "Senior Java Full Stack Developer",
          "AWS DevOps Solutions Architect",
          "Spring Boot Microservices Specialist",
          "Cloud Infrastructure Engineer"
        ],
        "description": "Manish Kumar is a top-ranked Java Full Stack Developer and AWS DevOps Solutions Architect specializing in Java 17/21, Spring Boot, Microservices, Hibernate, React.js, Docker, Kubernetes, CI/CD, and AWS Cloud Architecture.",
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
          "name": "B.Tech in Computer Science"
        },
        "hasOccupation": {
          "@type": "Occupation",
          "name": "Java Full Stack Developer & DevOps Architect",
          "description": "End-to-end full stack enterprise application development with Java, Spring Boot, React.js, Docker, Jenkins, Kubernetes, and AWS Cloud Architecture.",
          "skills": [
            "Java 17/21", "Spring Boot", "Microservices", "Hibernate ORM",
            "RESTful APIs", "React.js", "AWS (EC2, S3, RDS, Lambda)",
            "Docker", "Kubernetes", "Jenkins CI/CD", "Linux Administration",
            "MySQL", "PostgreSQL", "MongoDB", "Cybersecurity Auditing"
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
        "name": "Manish Kumar | Best Java Full Stack Developer & AWS DevOps Engineer",
        "description": "Official professional profile and portfolio of Manish Kumar — Senior Java Full Stack Developer, Spring Boot Microservices Specialist & AWS DevOps Architect.",
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.afshaenterprises.com" },
            { "@type": "ListItem", "position": 2, "name": "Manish Kumar Profile", "item": canonicalUrl }
          ]
        },
        "mainEntity": { "@id": `${canonicalUrl}#person` }
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
              "text": "Manish Kumar is an accomplished Java Full Stack Developer, Spring Boot Microservices Architect, and AWS DevOps Engineer with a B.Tech in Computer Science. He specializes in designing scalable enterprise web platforms, high-performance REST APIs, and automated cloud CI/CD delivery pipelines."
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
            "name": "What major projects has Manish Kumar developed?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Manish Kumar has engineered high-scale production systems including Afsha Enterprises (commercial full-stack e-commerce solution), ProgrammingWala (MERN stack developer learning management system), and Rancom Technologies (corporate enterprise cloud portal)."
            }
          },
          {
            "@type": "Question",
            "name": "How can I contact or hire Manish Kumar?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can contact Manish Kumar directly via email at brayw433@gmail.com, call/WhatsApp at +91-8851961088, or explore his GitHub profile at https://github.com/Lightining29."
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
        <title>Manish Kumar | Best Java Full Stack Developer & AWS DevOps Engineer</title>
        <meta name="title" content="Manish Kumar | Best Java Full Stack Developer & AWS DevOps Engineer" />
        <meta
          name="description"
          content="Manish Kumar is a top-ranked Java Full Stack Developer, Spring Boot Microservices Architect & AWS DevOps Engineer. Expert in Java 17/21, Spring Boot, Hibernate, React.js, Docker, Kubernetes, CI/CD, and Cloud Architecture. Hire Manish Kumar for enterprise solutions."
        />
        <meta
          name="keywords"
          content="Manish Kumar, Java Full Stack Developer, Best Java Full Stack Developer, Manish Kumar Java Developer, Manish Kumar DevOps Engineer, AWS Solutions Architect, Spring Boot Developer, Java Developer Ghaziabad, Hire Java Developer, Software Engineer Manish Kumar, Full Stack Developer India"
        />
        <meta name="author" content="Manish Kumar" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph / Social Media */}
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content="Manish Kumar | Best Java Full Stack Developer & AWS DevOps Engineer" />
        <meta
          property="og:description"
          content="Official portfolio & profile of Manish Kumar — Senior Java Full Stack Developer, Spring Boot Microservices Specialist & AWS DevOps Architect."
        />
        <meta property="og:image" content={profileImageUrl} />
        <meta property="profile:first_name" content="Manish" />
        <meta property="profile:last_name" content="Kumar" />
        <meta property="profile:username" content="Lightining29" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Manish Kumar | Best Java Full Stack Developer & AWS DevOps Engineer" />
        <meta
          name="twitter:description"
          content="Senior Java Full Stack Developer, Spring Boot Microservices Architect & AWS DevOps Engineer."
        />
        <meta name="twitter:image" content={profileImageUrl} />

        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify(jsonLdSchema)}</script>
      </Helmet>

      <Navbar />

      <main className="luv-profile-page">
        {/* Ambient Soft Glows */}
        <div className="luv-ambient-orb orb-rose" />
        <div className="luv-ambient-orb orb-peach" />
        <div className="luv-ambient-orb orb-lavender" />

        <div className="luv-main-container">
          {/* Top Bar */}
          <div className="luv-top-header">
            <Link to="/" className="luv-back-pill">
              <ArrowLeft size={16} /> Back to Store
            </Link>
            <div className="luv-brand-pill">
              <Sparkles size={13} className="luv-sparkle-icon" />
              <span>Verified Developer</span>
            </div>
          </div>

          {/* ── Visual Mobile Dual Card Layout (Inspired by reference UI) ── */}
          <div className="luv-showcase-grid">
            {/* Left Card: Full-Bleed Immersive Portrait & Plan Card */}
            <div className="luv-card luv-portrait-card">
              <div className="luv-portrait-image-wrap">
                <img
                  src="/manish-kumar.webp"
                  onError={(e) => { e.target.src = '/manish-kumar.jpg'; }}
                  alt="Manish Kumar"
                  className="luv-portrait-img"
                  fetchpriority="high"
                />
                <div className="luv-portrait-overlay" />

                {/* Top Logo / Identity Tag */}
                <div className="luv-portrait-top-tag">
                  <span>DEV.PORTFOLIO</span>
                </div>

                {/* Card Indicator Bars at bottom of photo */}
                <div className="luv-progress-bars">
                  <span className="bar active" />
                  <span className="bar" />
                  <span className="bar" />
                </div>
              </div>

              {/* Bottom Identity & Availability Capsule (Cleanly below the photo) */}
              <div className="luv-plan-capsule">
                <div className="luv-identity-head">
                  <h1 className="luv-person-name">Manish Kumar</h1>
                  <p className="luv-person-role">Senior Java Full Stack &amp; AWS DevOps Engineer</p>
                </div>

                <div className="luv-plan-header">
                  <div>
                    <span className="luv-plan-type">Consulting &amp; Architecture</span>
                    <h4 className="luv-plan-title">Spring Boot &amp; AWS Cloud</h4>
                  </div>
                  <div className="luv-plan-status">
                    <span className="online-dot" /> Online
                  </div>
                </div>

                <div className="luv-plan-perks">
                  <div className="perk-row">
                    <Check size={14} className="perk-check" />
                    <span>Spring Boot Microservices &amp; REST APIs</span>
                  </div>
                  <div className="perk-row">
                    <Check size={14} className="perk-check" />
                    <span>AWS Cloud, Docker &amp; CI/CD Deployment</span>
                  </div>
                  <div className="perk-row">
                    <Check size={14} className="perk-check" />
                    <span>Enterprise React.js &amp; Database Architecture</span>
                  </div>
                </div>

                <a
                  href="https://wa.me/918851961088?text=Hi%20Manish,%20I%20would%20like%20to%20discuss%20a%20project!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="luv-chat-now-btn"
                >
                  <MessageCircle size={16} /> Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Right Card: Interactive Conversational Persona & Story Stream */}
            <div className="luv-card luv-chat-card">
              {/* Header inside Chat Card */}
              <div className="luv-chat-header">
                <div className="luv-avatar-circle-wrap">
                  <img
                    src="/manish-kumar.webp"
                    onError={(e) => { e.target.src = '/manish-kumar.jpg'; }}
                    alt="Manish Kumar"
                    className="luv-circle-avatar"
                  />
                  <span className="luv-avatar-online-dot" />
                </div>
                <div className="luv-chat-header-info">
                  <h3 className="luv-chat-name">Manish Kumar</h3>
                  <div className="luv-online-status">
                    <span className="status-green-dot" /> Online • Available for Hire
                  </div>
                </div>
              </div>

              {/* Quick Feature Pills */}
              <div className="luv-topic-chips-row">
                <button
                  type="button"
                  className="topic-chip active"
                  onClick={() => handleQuickTopic('I want to hire you for a Java Spring Boot project')}
                >
                  ⚡ Hire Developer
                </button>
                <button
                  type="button"
                  className="topic-chip"
                  onClick={() => handleQuickTopic('Tell me about your AWS Cloud & DevOps expertise')}
                >
                  ☁️ AWS Cloud
                </button>
                <button
                  type="button"
                  className="topic-chip"
                  onClick={() => handleQuickTopic('What projects have you developed?')}
                >
                  💼 Projects
                </button>
                <button
                  type="button"
                  className="topic-chip"
                  onClick={() => handleQuickTopic('Can you send your updated resume/CV?')}
                >
                  📄 Resume / CV
                </button>
              </div>

              {/* Chat Message Stream */}
              <div className="luv-chat-messages-scroll">
                <div className="chat-date-divider">
                  <span>Today</span>
                </div>

                {messages.map((m) => (
                  <div key={m.id} className={`chat-bubble-row ${m.sender === 'user' ? 'from-user' : 'from-manish'}`}>
                    {m.sender === 'manish' && (
                      <img
                        src="/manish-kumar.webp"
                        onError={(e) => { e.target.src = '/manish-kumar.jpg'; }}
                        alt="Manish"
                        className="bubble-avatar"
                      />
                    )}
                    <div className="bubble-content-wrap">
                      {m.sender === 'manish' && <span className="bubble-sender-name">Manish Kumar</span>}
                      <div className="bubble-text">
                        {m.text}
                      </div>
                      <span className="bubble-timestamp">{m.time}</span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="chat-bubble-row from-manish">
                    <img
                      src="/manish-kumar.webp"
                      onError={(e) => { e.target.src = '/manish-kumar.jpg'; }}
                      alt="Manish"
                      className="bubble-avatar"
                    />
                    <div className="typing-indicator-box">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Interactive Chat Input */}
              <form id="chatForm" onSubmit={handleSendChat} className="luv-chat-input-bar">
                <a
                  href="tel:+918851961088"
                  className="luv-attach-action-btn"
                  title="Direct Call"
                >
                  <Phone size={17} />
                </a>
                <input
                  type="text"
                  placeholder="Ask Manish anything (e.g. skills, hire)..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="luv-chat-text-input"
                />
                <button type="submit" className="luv-chat-send-btn" aria-label="Send message">
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>

          {/* ── Direct Action Bar ── */}
          <div className="luv-quick-actions-bar">
            <a href="tel:+918851961088" className="action-pill-btn">
              <Phone size={15} /> +91 8851961088
            </a>
            <a href="mailto:brayw433@gmail.com" className="action-pill-btn">
              <Mail size={15} /> brayw433@gmail.com
            </a>
            <a
              href="https://github.com/Lightining29"
              target="_blank"
              rel="noopener noreferrer"
              className="action-pill-btn"
            >
              <Github size={15} /> GitHub @Lightining29
            </a>
            <a
              href="https://manish-java-developer.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="action-pill-btn"
            >
              <ExternalLink size={15} /> Live Portfolio
            </a>
          </div>

          {/* ── 2. Biography & Core Philosophy ── */}
          <section className="luv-details-section">
            <div className="luv-section-header">
              <span className="luv-badge-pill"><GraduationCap size={13} /> Background</span>
              <h2 className="luv-section-title">About Manish Kumar</h2>
            </div>

            <div className="luv-details-card">
              <p className="luv-desc-p">
                I am a passionate <strong>Java Full Stack Developer</strong> and <strong>AWS Cloud DevOps Architect</strong> holding a <strong>B.Tech in Computer Science</strong>. I specialize in bridging enterprise software development with scalable cloud delivery pipelines.
              </p>
              <p className="luv-desc-p">
                My technical expertise spans high-throughput <strong>Java Spring Boot APIs</strong>, modern <strong>React.js</strong> web applications, Docker &amp; Kubernetes container orchestration, Jenkins CI/CD automation, and cloud security auditing.
              </p>

              <div className="luv-mini-cards-grid">
                <div className="luv-mini-card">
                  <div className="mini-icon-box"><GraduationCap size={18} /></div>
                  <div>
                    <span className="mini-label">Education</span>
                    <h4 className="mini-val">B.Tech Computer Science</h4>
                  </div>
                </div>

                <div className="luv-mini-card">
                  <div className="mini-icon-box"><Briefcase size={18} /></div>
                  <div>
                    <span className="mini-label">Experience</span>
                    <h4 className="mini-val">Appletree Infotech Intern</h4>
                  </div>
                </div>

                <div className="luv-mini-card">
                  <div className="mini-icon-box"><Cloud size={18} /></div>
                  <div>
                    <span className="mini-label">Cloud Expertise</span>
                    <h4 className="mini-val">AWS Solutions &amp; DevOps</h4>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── 3. Featured Production Projects ── */}
          <section className="luv-details-section">
            <div className="luv-section-header">
              <span className="luv-badge-pill"><Code size={13} /> Deliveries</span>
              <h2 className="luv-section-title">Featured Projects</h2>
            </div>

            <div className="luv-projects-grid">
              {/* Project 1: Afsha Enterprises */}
              <div className="luv-project-item">
                <div className="luv-project-header">
                  <span className="project-category-tag">E-Commerce System</span>
                  <h3 className="project-heading">Afsha Enterprises</h3>
                </div>
                <p className="project-summary-p">
                  Commercial full-stack e-commerce platform for wellness &amp; grooming products with Razorpay payment processing, real-time OTP authentication, and image caching.
                </p>
                <div className="project-tags-row">
                  <span>Java</span><span>Spring Boot</span><span>React.js</span><span>Razorpay</span>
                </div>
                <Link to="/" className="project-link-btn">
                  Visit Live Store <ChevronRight size={14} />
                </Link>
              </div>

              {/* Project 2: ProgrammingWala */}
              <div className="luv-project-item">
                <div className="luv-project-header">
                  <span className="project-category-tag">LMS &amp; Education</span>
                  <h3 className="project-heading">ProgrammingWala</h3>
                </div>
                <p className="project-summary-p">
                  Comprehensive developer learning management system built with the MERN stack for coding tutorials, course enrollment, and student learning tracks.
                </p>
                <div className="project-tags-row">
                  <span>MERN</span><span>React.js</span><span>Node.js</span><span>MongoDB</span>
                </div>
                <a
                  href="https://manish-java-developer.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link-btn"
                >
                  View Case Study <ExternalLink size={14} />
                </a>
              </div>

              {/* Project 3: Rancom Technologies */}
              <div className="luv-project-item">
                <div className="luv-project-header">
                  <span className="project-category-tag">Corporate Cloud Portal</span>
                  <h3 className="project-heading">Rancom Technologies</h3>
                </div>
                <p className="project-summary-p">
                  Enterprise IT corporate portal for Rancom Technologies Pvt Ltd (software company in Noida) with automated AWS cloud infrastructure.
                </p>
                <div className="project-tags-row">
                  <span>Java</span><span>AWS Cloud</span><span>Docker</span><span>CI/CD</span>
                </div>
                <a
                  href="https://manish-java-developer.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link-btn"
                >
                  View Case Study <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </section>

          {/* ── 4. Technical Skills ── */}
          <section className="luv-details-section">
            <div className="luv-section-header">
              <span className="luv-badge-pill"><Cpu size={13} /> Tech Stack</span>
              <h2 className="luv-section-title">Skills &amp; Expertise</h2>
            </div>

            {/* Filter Tabs */}
            <div className="luv-skill-tabs">
              {['all', 'backend', 'devops', 'frontend', 'database', 'security'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`skill-pill-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="luv-skills-grid">
              {filteredSkills.map((s, i) => (
                <div key={i} className="luv-skill-chip-box">
                  <div className="skill-chip-icon">{s.icon}</div>
                  <div className="skill-chip-info">
                    <span className="skill-chip-title">{s.name}</span>
                    <span className="skill-chip-level">{s.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── 5. AI Knowledge Graph FAQs (Google, Bing, Copilot) ── */}
          <section className="luv-details-section">
            <div className="luv-section-header">
              <span className="luv-badge-pill"><Sparkles size={13} /> Knowledge Graph</span>
              <h2 className="luv-section-title">Frequently Asked Questions</h2>
            </div>

            <div className="luv-faq-list">
              <div className="luv-faq-item">
                <h3 className="faq-h3"><HelpCircle size={16} /> Who is Manish Kumar?</h3>
                <p className="faq-p">
                  <strong>Manish Kumar</strong> is a top-ranked <strong>Java Full Stack Developer</strong>, Spring Boot Microservices Architect, and AWS Certified DevOps Engineer based in Ghaziabad, Uttar Pradesh, India with a B.Tech in Computer Science.
                </p>
              </div>

              <div className="luv-faq-item">
                <h3 className="faq-h3"><HelpCircle size={16} /> What technologies does Manish Kumar specialize in?</h3>
                <p className="faq-p">
                  Manish Kumar specializes in <strong>Core &amp; Advanced Java (Java 17/21)</strong>, <strong>Spring Boot</strong>, Spring Security, Hibernate ORM, Microservices, RESTful APIs, <strong>React.js</strong>, <strong>AWS Cloud Computing</strong>, <strong>Docker</strong>, <strong>Kubernetes</strong>, Jenkins CI/CD, Linux Administration, MySQL, and PostgreSQL.
                </p>
              </div>

              <div className="luv-faq-item">
                <h3 className="faq-h3"><HelpCircle size={16} /> How can I hire Manish Kumar for Java Developer or DevOps roles?</h3>
                <p className="faq-p">
                  You can reach Manish Kumar directly via email at <a href="mailto:brayw433@gmail.com">brayw433@gmail.com</a>, WhatsApp/Call at <a href="tel:+918851961088">+91 8851961088</a>, or explore his GitHub profile at <a href="https://github.com/Lightining29" target="_blank" rel="noopener noreferrer">@Lightining29</a>.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
