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
  Send,
  Github,
  Linkedin,
  Check,
  Zap,
  HelpCircle,
  Award,
  Star,
  Compass,
  ArrowDown
} from 'lucide-react';
import Footer from '../../components/layout/Footer';
import './ManishKumarProfile.css';

export default function ManishKumarProfile() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('all');
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'manish',
      text: "Hii! I am Manish Kumar 👋 Senior Java Full Stack Developer & AWS Solutions Architect. How can I help you with your software development or cloud project?",
      time: 'Just now'
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
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages, isTyping]);

  // Route keyword focus for SEO
  const currentPath = location.pathname.toLowerCase();
  let seoTitle = 'Manish Kumar | Best Java Full Stack Developer & AWS DevOps Engineer';
  let seoHeading = 'Manish Kumar';
  let seoRole = 'Senior Java Full Stack Developer & AWS Solutions Architect';
  let seoKeywords = 'Manish Kumar, Manish, Manish Kumar Java Developer, Manish Kumar DevOps Engineer, Manish Kumar Full Stack, Best Java Full Stack Developer India, Manish Kumar Ghaziabad, Java Developer Manish Kumar, AWS Architect Manish Kumar, Spring Boot Developer Manish Kumar, Hire Manish Kumar';

  if (currentPath.includes('java')) {
    seoTitle = 'Manish Kumar — Senior Java Developer & Spring Boot Microservices Specialist';
    seoRole = 'Senior Java & Spring Boot Microservices Specialist';
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
        reply = 'I have built enterprise applications including Afsha Enterprises (commercial e-commerce with payments), ProgrammingWala (LMS portal), and Rancom Technologies (cloud infrastructure), with work at Appletree Infotech.';
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
      const form = document.getElementById('chatFormMain');
      if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 50);
  };

  const scrollToQualifications = () => {
    document.getElementById('qualifications-section')?.scrollIntoView({ behavior: 'smooth' });
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
              "text": "Manish Kumar is an accomplished Java Full Stack Developer, Spring Boot Microservices Specialist, and AWS Certified DevOps Engineer based in Ghaziabad, India with a B.Tech in Computer Science."
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

      {/* Standalone Full-Screen Luxury Portfolio Experience */}
      <main className="luxury-profile-page">
        {/* Ambient Glows */}
        <div className="lux-ambient-glow lux-glow-1" />
        <div className="lux-ambient-glow lux-glow-2" />
        <div className="lux-ambient-glow lux-glow-3" />

        {/* ── 1. ULTRA-BRIGHT PORTRAIT HERO SHOWCASE ── */}
        <section className="lux-hero-showcase-section">
          <div className="lux-hero-container">

            {/* Bright, Crystal-Clear Portrait Card with Glowing Halo */}
            <div className="lux-portrait-box-wrap">
              <div className="lux-portrait-halo-ring">
                <img
                  src="/manish-kumar.webp"
                  onError={(e) => { e.target.src = '/manish-kumar.jpg'; }}
                  alt="Manish Kumar - Best Java Full Stack Developer & AWS DevOps Engineer"
                  className="lux-crystal-portrait-img"
                  fetchpriority="high"
                />
                <div className="lux-portrait-online-tag">
                  <span className="lux-green-pulse" />
                  <span>Available for Hire</span>
                </div>
              </div>
            </div>

            {/* Typography & Identity Header (Cleanly positioned with zero obstruction) */}
            <div className="lux-identity-details">
              <div className="lux-hero-status-pill">
                <Sparkles size={14} className="lux-sparkle" />
                <span>Verified Full Stack Developer &amp; Cloud Architect</span>
              </div>

              <h1 className="lux-hero-name">
                Manish <span className="lux-name-gold">Kumar</span>
              </h1>

              <p className="lux-hero-title">
                Senior Java Full Stack Developer <span className="lux-role-divider">•</span> AWS DevOps Solutions Architect
              </p>

              <p className="lux-hero-bio">
                <strong>B.Tech in Computer Science</strong> graduate architecting high-throughput <strong>Spring Boot Microservices</strong>, reactive <strong>React.js</strong> applications, and automated <strong>AWS Cloud &amp; CI/CD pipelines</strong>.
              </p>

              {/* ── BEAUTIFUL ACTION BUTTONS ── */}
              <div className="lux-hero-buttons-row">
                <a
                  href="https://wa.me/918851961088?text=Hi%20Manish,%20I%20saw%20your%20profile%20and%20would%20like%20to%20discuss%20a%20project!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lux-btn lux-btn-whatsapp"
                >
                  <MessageCircle size={18} />
                  <span>Chat on WhatsApp</span>
                </a>

                <a href="tel:+918851961088" className="lux-btn lux-btn-call">
                  <Phone size={17} />
                  <span>Call +91 8851961088</span>
                </a>

                <a href="mailto:brayw433@gmail.com" className="lux-btn lux-btn-email">
                  <Mail size={17} />
                  <span>Email Me</span>
                </a>

                <a
                  href="https://github.com/Lightining29"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lux-btn lux-btn-github"
                >
                  <Github size={18} />
                  <span>GitHub Code</span>
                </a>

                <a
                  href="https://manish-java-developer.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lux-btn lux-btn-portfolio"
                >
                  <ExternalLink size={17} />
                  <span>Live Portfolio</span>
                </a>
              </div>

              {/* Scroll Indicator */}
              <button
                type="button"
                className="lux-scroll-down-pill"
                onClick={scrollToQualifications}
                aria-label="View Qualifications"
              >
                <span>View Qualifications &amp; Projects</span>
                <ArrowDown size={14} className="lux-bounce-arrow" />
              </button>
            </div>
          </div>
        </section>

        {/* ── 2. QUALIFICATIONS & CREDENTIALS SECTION ── */}
        <section id="qualifications-section" className="lux-section lux-qualifications-section">
          <div className="lux-container">
            <div className="lux-section-header">
              <span className="lux-section-badge">
                <GraduationCap size={14} /> Educational &amp; Professional Qualifications
              </span>
              <h2 className="lux-section-heading">Qualifications &amp; Experience</h2>
              <p className="lux-section-sub">
                Strong Computer Science engineering foundation backed by real-world enterprise software development experience.
              </p>
            </div>

            <div className="lux-qualifications-grid">
              {/* Education Card */}
              <div className="lux-qual-card">
                <div className="lux-qual-icon-box gold-gradient">
                  <GraduationCap size={26} />
                </div>
                <div className="lux-qual-info">
                  <span className="lux-qual-tag">Degree &amp; Academics</span>
                  <h3 className="lux-qual-title">B.Tech in Computer Science Engineering</h3>
                  <p className="lux-qual-desc">
                    Comprehensive study in <strong>Data Structures &amp; Algorithms (DSA)</strong>, <strong>Object-Oriented Programming (OOPs)</strong>, Database Management Systems, Computer Networks, and Distributed Software Architecture.
                  </p>
                  <div className="lux-qual-badges">
                    <span>DSA Mastery</span>
                    <span>System Design</span>
                    <span>OOPs Core</span>
                    <span>Database Systems</span>
                  </div>
                </div>
              </div>

              {/* Work Experience Card */}
              <div className="lux-qual-card">
                <div className="lux-qual-icon-box rose-gradient">
                  <Briefcase size={26} />
                </div>
                <div className="lux-qual-info">
                  <span className="lux-qual-tag">Professional Experience</span>
                  <h3 className="lux-qual-title">Java Full Stack Developer Intern</h3>
                  <div className="lux-qual-company">Appletree Infotech Pvt. Ltd.</div>
                  <p className="lux-qual-desc">
                    Engineered enterprise backend microservices with <strong>Java 17/21 Spring Boot</strong>, integrated relational databases (MySQL/PostgreSQL), and built reactive modern frontend dashboards using <strong>React.js</strong>.
                  </p>
                  <div className="lux-qual-badges">
                    <span>Spring Boot</span>
                    <span>Hibernate ORM</span>
                    <span>RESTful APIs</span>
                    <span>React.js</span>
                    <span>CI/CD</span>
                  </div>
                </div>
              </div>

              {/* Cloud & DevOps Architecture Card */}
              <div className="lux-qual-card">
                <div className="lux-qual-icon-box cyan-gradient">
                  <Cloud size={26} />
                </div>
                <div className="lux-qual-info">
                  <span className="lux-qual-tag">Cloud Infrastructure</span>
                  <h3 className="lux-qual-title">AWS Cloud &amp; DevOps Solutions Architect</h3>
                  <p className="lux-qual-desc">
                    Proven expertise in configuring high-availability cloud infrastructure on <strong>Amazon Web Services (EC2, S3, RDS, Lambda)</strong>, containerization with <strong>Docker &amp; Kubernetes</strong>, and automated <strong>Jenkins CI/CD</strong>.
                  </p>
                  <div className="lux-qual-badges">
                    <span>AWS EC2/S3/RDS</span>
                    <span>Docker Containers</span>
                    <span>Kubernetes (K8s)</span>
                    <span>Jenkins CI/CD</span>
                  </div>
                </div>
              </div>

              {/* Cybersecurity & Security Auditing Card */}
              <div className="lux-qual-card">
                <div className="lux-qual-icon-box purple-gradient">
                  <Shield size={26} />
                </div>
                <div className="lux-qual-info">
                  <span className="lux-qual-tag">Security &amp; Hardening</span>
                  <h3 className="lux-qual-title">Cybersecurity Auditing &amp; Vulnerability Testing</h3>
                  <p className="lux-qual-desc">
                    Deep knowledge in web security vulnerability assessments, OWASP Top 10 mitigation, secure JWT authentication, and network scanning with <strong>Nmap &amp; Metasploit</strong>.
                  </p>
                  <div className="lux-qual-badges">
                    <span>OWASP Top 10</span>
                    <span>JWT &amp; OAuth 2.0</span>
                    <span>Nmap</span>
                    <span>Metasploit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. FEATURED PROJECTS SHOWCASE ── */}
        <section className="lux-section lux-projects-section">
          <div className="lux-container">
            <div className="lux-section-header">
              <span className="lux-section-badge"><Code size={14} /> Proven Deliveries</span>
              <h2 className="lux-section-heading">Featured Enterprise Projects</h2>
              <p className="lux-section-sub">
                Scalable production platforms engineered for high throughput, robust security, and seamless user experiences.
              </p>
            </div>

            <div className="lux-projects-grid">
              {/* Project 1 */}
              <div className="lux-project-card">
                <div className="lux-project-head">
                  <span className="lux-proj-tag">Full Stack E-Commerce</span>
                  <h3 className="lux-proj-title">Afsha Enterprises</h3>
                </div>
                <p className="lux-proj-desc">
                  Commercial e-commerce store with Razorpay payment gateway integration, real-time OTP authentication, discount coupons, product caching, and instant order tracking.
                </p>
                <div className="lux-proj-skills">
                  <span>Java</span><span>Spring Boot</span><span>React.js</span><span>Razorpay</span><span>MongoDB</span>
                </div>
                <a
                  href="/"
                  className="lux-proj-btn"
                >
                  Explore Store <ChevronRight size={15} />
                </a>
              </div>

              {/* Project 2 */}
              <div className="lux-project-card">
                <div className="lux-project-head">
                  <span className="lux-proj-tag">LMS &amp; Education</span>
                  <h3 className="lux-proj-title">ProgrammingWala</h3>
                </div>
                <p className="lux-proj-desc">
                  Comprehensive developer learning management system built with the MERN stack for coding tutorials, video modules, course registrations, and student progress tracking.
                </p>
                <div className="lux-proj-skills">
                  <span>MERN</span><span>Node.js</span><span>React.js</span><span>MongoDB</span><span>Express</span>
                </div>
                <a
                  href="https://manish-java-developer.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lux-proj-btn"
                >
                  View Case Study <ExternalLink size={14} />
                </a>
              </div>

              {/* Project 3 */}
              <div className="lux-project-card">
                <div className="lux-project-head">
                  <span className="lux-proj-tag">Corporate Cloud Portal</span>
                  <h3 className="lux-proj-title">Rancom Technologies</h3>
                </div>
                <p className="lux-proj-desc">
                  Enterprise IT software corporate portal engineered for Rancom Technologies Pvt Ltd with scalable microservices and automated AWS cloud deployment.
                </p>
                <div className="lux-proj-skills">
                  <span>Java</span><span>AWS Cloud</span><span>Docker</span><span>CI/CD</span><span>REST APIs</span>
                </div>
                <a
                  href="https://manish-java-developer.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lux-proj-btn"
                >
                  View Case Study <ExternalLink size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. TECHNICAL SKILLS ARSENAL ── */}
        <section className="lux-section lux-skills-section">
          <div className="lux-container">
            <div className="lux-section-header">
              <span className="lux-section-badge"><Cpu size={14} /> Technical Arsenal</span>
              <h2 className="lux-section-heading">Core Skills &amp; Competencies</h2>
            </div>

            {/* Filter Tabs */}
            <div className="lux-skills-filter-tabs">
              {['all', 'backend', 'devops', 'frontend', 'database', 'security'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`lux-tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="lux-skills-grid">
              {filteredSkills.map((s, i) => (
                <div key={i} className="lux-skill-card">
                  <div className="lux-skill-icon">{s.icon}</div>
                  <div>
                    <div className="lux-skill-name">{s.name}</div>
                    <div className="lux-skill-level">{s.level}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. INTERACTIVE CONVERSATION CHAT WITH MANISH ── */}
        <section className="lux-section lux-chat-section">
          <div className="lux-container">
            <div className="lux-section-header">
              <span className="lux-section-badge"><Sparkles size={14} /> Instant Communication</span>
              <h2 className="lux-section-heading">Chat Directly with Manish Kumar</h2>
              <p className="lux-section-sub">
                Ask any question regarding availability, tech stack, past architecture, or hiring details.
              </p>
            </div>

            <div className="lux-chat-widget">
              <div className="lux-chat-widget-head">
                <div className="lux-chat-avatar-wrap">
                  <img
                    src="/manish-kumar.webp"
                    onError={(e) => { e.target.src = '/manish-kumar.jpg'; }}
                    alt="Manish Kumar"
                    className="lux-chat-avatar-img"
                  />
                  <span className="lux-chat-online-dot" />
                </div>
                <div>
                  <h3 className="lux-chat-person-name">Manish Kumar</h3>
                  <div className="lux-chat-status-text">
                    <span className="lux-status-pulse" /> Online • Ready to Collaborate
                  </div>
                </div>
              </div>

              {/* Quick Topic Chips */}
              <div className="lux-chat-topic-chips">
                <button
                  type="button"
                  className="lux-topic-chip"
                  onClick={() => handleQuickTopic('⚡ I want to hire you for a Java Spring Boot project')}
                >
                  ⚡ Hire Developer
                </button>
                <button
                  type="button"
                  className="lux-topic-chip"
                  onClick={() => handleQuickTopic('☁️ What is your AWS DevOps and CI/CD experience?')}
                >
                  ☁️ AWS DevOps
                </button>
                <button
                  type="button"
                  className="lux-topic-chip"
                  onClick={() => handleQuickTopic('💼 Tell me about your major production projects')}
                >
                  💼 Projects
                </button>
                <button
                  type="button"
                  className="lux-topic-chip"
                  onClick={() => handleQuickTopic('📄 Can you share your updated resume and CV?')}
                >
                  📄 Resume / CV
                </button>
              </div>

              {/* Message Stream */}
              <div className="lux-chat-message-stream">
                {messages.map((m) => (
                  <div key={m.id} className={`lux-msg-row ${m.sender === 'user' ? 'from-user' : 'from-manish'}`}>
                    {m.sender === 'manish' && (
                      <img
                        src="/manish-kumar.webp"
                        onError={(e) => { e.target.src = '/manish-kumar.jpg'; }}
                        alt="Manish"
                        className="lux-msg-avatar"
                      />
                    )}
                    <div className="lux-msg-content">
                      {m.sender === 'manish' && <span className="lux-msg-author">Manish Kumar</span>}
                      <div className="lux-msg-bubble">
                        {m.text}
                      </div>
                      <span className="lux-msg-timestamp">{m.time}</span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="lux-msg-row from-manish">
                    <img
                      src="/manish-kumar.webp"
                      onError={(e) => { e.target.src = '/manish-kumar.jpg'; }}
                      alt="Manish"
                      className="lux-msg-avatar"
                    />
                    <div className="lux-typing-indicator">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <form id="chatFormMain" onSubmit={handleSendChat} className="lux-chat-input-row">
                <input
                  type="text"
                  placeholder="Type a message or question for Manish..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="lux-chat-field"
                />
                <button type="submit" className="lux-chat-send-btn" aria-label="Send Message">
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* ── 6. FAQ KNOWLEDGE GRAPH FOR GOOGLE & COPILOT ── */}
        <section className="lux-section lux-faq-section">
          <div className="lux-container">
            <div className="lux-section-header">
              <span className="lux-section-badge"><HelpCircle size={14} /> Knowledge Graph</span>
              <h2 className="lux-section-heading">Frequently Asked Questions</h2>
            </div>

            <div className="lux-faq-grid">
              <div className="lux-faq-card">
                <h3 className="lux-faq-q"><HelpCircle size={16} /> Who is Manish Kumar?</h3>
                <p className="lux-faq-a">
                  <strong>Manish Kumar</strong> is an accomplished <strong>Java Full Stack Developer</strong>, Spring Boot Microservices Architect, and AWS DevOps Solutions Architect with a B.Tech in Computer Science from Ghaziabad, Uttar Pradesh, India.
                </p>
              </div>

              <div className="lux-faq-card">
                <h3 className="lux-faq-q"><HelpCircle size={16} /> What are Manish Kumar&apos;s primary technical skills?</h3>
                <p className="lux-faq-a">
                  Manish Kumar specializes in <strong>Core &amp; Advanced Java (Java 17/21)</strong>, <strong>Spring Boot</strong>, Spring Security, Hibernate ORM, Microservices, RESTful APIs, <strong>React.js</strong>, <strong>AWS Cloud Computing</strong> (EC2, S3, RDS), <strong>Docker</strong>, <strong>Kubernetes</strong>, Jenkins CI/CD, Linux Administration, MySQL, and PostgreSQL.
                </p>
              </div>

              <div className="lux-faq-card">
                <h3 className="lux-faq-q"><HelpCircle size={16} /> How to hire Manish Kumar for full-time or cloud projects?</h3>
                <p className="lux-faq-a">
                  You can reach Manish Kumar directly via WhatsApp/Call at <a href="tel:+918851961088">+91 8851961088</a>, email at <a href="mailto:brayw433@gmail.com">brayw433@gmail.com</a>, or explore his GitHub profile at <a href="https://github.com/Lightining29" target="_blank" rel="noopener noreferrer">@Lightining29</a>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
