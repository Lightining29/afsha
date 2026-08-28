import { useState, useEffect } from 'react';
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
  Linkedin
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import './ManishKumarProfile.css';

export default function ManishKumarProfile() {
  const [activeTab, setActiveTab] = useState('all');
  const [formSent, setFormSent] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    setFormSent(true);
    setTimeout(() => {
      setFormSent(false);
      setContactForm({ name: '', email: '', message: '' });
    }, 4000);
  };

  const canonicalUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/manish-kumar`
    : 'https://www.afshaenterprises.com/manish-kumar';

  const profileImageUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/manish-kumar.jpg`
    : 'https://www.afshaenterprises.com/manish-kumar.jpg';

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
            { "@type": "ListItem", "position": 1, "name": "Home", "item": typeof window !== 'undefined' ? window.location.origin : 'https://www.afshaenterprises.com' },
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
    { category: 'frontend', name: 'HTML5 & Modern CSS3', level: 'Expert', icon: <Globe size={18} /> },
    { category: 'frontend', name: 'Tailwind / Bootstrap', level: 'Advanced', icon: <Layers size={18} /> },
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

      <main className="profile-page-wrapper">
        {/* Ambient Neon Background Glows */}
        <div className="profile-ambient-glow glow-1" />
        <div className="profile-ambient-glow glow-2" />
        <div className="profile-ambient-glow glow-3" />

        <div className="profile-container">
          {/* Top Breadcrumb & Navigation */}
          <div className="profile-top-nav">
            <Link to="/" className="profile-back-link">
              <ArrowLeft size={16} /> Back to Store
            </Link>
            <div className="profile-verified-tag">
              <Sparkles size={13} className="sparkle-gold" />
              <span>Verified Developer Profile</span>
            </div>
          </div>

          {/* ── 1. Hero Identity & Neon Card ── */}
          <section className="profile-hero-card">
            <div className="profile-hero-grid">
              {/* Photo & Holographic Ring */}
              <div className="profile-photo-col">
                <div className="profile-photo-frame">
                  <div className="profile-neon-ring" />
                  <img
                    src="/manish-kumar.webp"
                    onError={(e) => { e.target.src = '/manish-kumar.jpg'; }}
                    alt="Manish Kumar - Best Java Full Stack Developer & AWS DevOps Engineer"
                    className="profile-main-photo"
                    fetchpriority="high"
                  />
                  <div className="profile-availability-badge">
                    <span className="pulsing-dot" /> Available for Hire
                  </div>
                </div>

                {/* Floating Skill Chips */}
                <div className="profile-tech-chips">
                  <span className="tech-chip chip-java">☕ Java 17/21</span>
                  <span className="tech-chip chip-spring">🍃 Spring Boot</span>
                  <span className="tech-chip chip-aws">☁️ AWS DevOps</span>
                  <span className="tech-chip chip-docker">🐳 Docker / K8s</span>
                </div>
              </div>

              {/* Identity & Headline Details */}
              <div className="profile-info-col">
                <div className="profile-role-eyebrow">
                  <Award size={14} />
                  <span>Senior Java Full Stack Developer &amp; AWS DevOps Engineer</span>
                </div>

                <h1 className="profile-name">
                  Manish <span className="name-gradient">Kumar</span>
                </h1>

                <p className="profile-tagline">
                  B.Tech in Computer Science graduate engineering high-throughput <strong>Spring Boot Microservices</strong>, robust <strong>React.js</strong> interfaces, and automated <strong>AWS Cloud &amp; CI/CD pipelines</strong>.
                </p>

                {/* Quick Contact & Action Buttons */}
                <div className="profile-actions-row">
                  <a
                    href="https://wa.me/918851961088?text=Hi%20Manish,%20I%20saw%20your%20profile%20and%20would%20like%20to%20discuss%20a%20project!"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-profile-primary"
                  >
                    <MessageCircle size={17} /> WhatsApp Me
                  </a>
                  <a href="tel:+918851961088" className="btn-profile-secondary">
                    <Phone size={16} /> Call Now
                  </a>
                  <a href="mailto:brayw433@gmail.com" className="btn-profile-outline">
                    <Mail size={16} /> Email
                  </a>
                  <a
                    href="https://github.com/Lightining29"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-profile-icon"
                    title="GitHub @Lightining29"
                  >
                    <Github size={18} />
                  </a>
                  <a
                    href="https://manish-java-developer.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-profile-icon"
                    title="Live Portfolio Website"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>

                {/* 3-Column Metrics */}
                <div className="profile-stats-grid">
                  <div className="stat-box">
                    <span className="stat-num">3<small>+</small></span>
                    <span className="stat-label">Years Experience</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-num">25<small>+</small></span>
                    <span className="stat-label">Projects Built</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-num">100<small>%</small></span>
                    <span className="stat-label">Client Trust</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── 2. Biography & Core Philosophy ── */}
          <section className="profile-section">
            <div className="section-head">
              <span className="section-badge"><GraduationCap size={14} /> Background</span>
              <h2 className="section-h2">About Manish Kumar</h2>
            </div>

            <div className="about-content-card">
              <p className="about-p">
                I am a dedicated <strong>Java Full Stack Developer</strong> and <strong>AWS Cloud DevOps Architect</strong> holding a <strong>B.Tech in Computer Science</strong>. I specialize in architecting resilient backend systems, distributed microservices, and seamless continuous integration and deployment (CI/CD) pipelines.
              </p>
              <p className="about-p">
                With deep foundations in <strong>Object-Oriented Programming (OOPs)</strong>, <strong>Data Structures &amp; Algorithms (DSA)</strong>, and <strong>Clean Architecture</strong>, I build software that scales effortlessly under heavy production traffic while maintaining high security and performance benchmarks.
              </p>

              <div className="about-cards-row">
                <div className="info-mini-card">
                  <div className="mini-card-icon"><GraduationCap size={20} /></div>
                  <div>
                    <div className="mini-card-title">Education</div>
                    <div className="mini-card-desc">B.Tech in Computer Science Engineering</div>
                  </div>
                </div>
                <div className="info-mini-card">
                  <div className="mini-card-icon"><Briefcase size={20} /></div>
                  <div>
                    <div className="mini-card-title">Work Experience</div>
                    <div className="mini-card-desc">Appletree Infotech (Java Full Stack Developer)</div>
                  </div>
                </div>
                <div className="info-mini-card">
                  <div className="mini-card-icon"><Cloud size={20} /></div>
                  <div>
                    <div className="mini-card-title">Cloud Mastery</div>
                    <div className="mini-card-desc">AWS EC2, S3, RDS, Docker, Kubernetes, Jenkins</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── 3. Work Experience & Internship ── */}
          <section className="profile-section">
            <div className="section-head">
              <span className="section-badge"><Briefcase size={14} /> Career History</span>
              <h2 className="section-h2">Internship &amp; Experience</h2>
            </div>

            <div className="timeline-card">
              <div className="timeline-header">
                <div className="timeline-role-info">
                  <h3 className="timeline-title">Java Full Stack Developer Intern</h3>
                  <div className="timeline-company">Appletree Infotech Pvt. Ltd.</div>
                </div>
                <div className="timeline-period-pill">3 Months Full-Time Internship</div>
              </div>
              <p className="timeline-desc">
                Contributed to full lifecycle development of commercial enterprise web applications. Engineered RESTful APIs in Java Spring Boot, built reactive frontend dashboards using React.js and MERN stack, optimized relational database schemas (MySQL &amp; PostgreSQL), and participated in live production deployments.
              </p>
              <div className="timeline-skills">
                <span className="skill-tag-sm">Core Java</span>
                <span className="skill-tag-sm">Spring Boot</span>
                <span className="skill-tag-sm">Hibernate ORM</span>
                <span className="skill-tag-sm">React.js</span>
                <span className="skill-tag-sm">MySQL</span>
                <span className="skill-tag-sm">REST APIs</span>
                <span className="skill-tag-sm">Postman</span>
              </div>
            </div>
          </section>

          {/* ── 4. Featured Production Projects ── */}
          <section className="profile-section">
            <div className="section-head">
              <span className="section-badge"><Code size={14} /> Proven Deliveries</span>
              <h2 className="section-h2">Featured Projects</h2>
            </div>

            <div className="projects-grid">
              {/* Project 1: Afsha Enterprises */}
              <div className="project-feature-card">
                <div className="project-card-header">
                  <div className="project-tag-pill">E-Commerce Platform</div>
                  <h3 className="project-name">Afsha Enterprises</h3>
                </div>
                <p className="project-summary">
                  Comprehensive commercial e-commerce application for premium body massagers &amp; grooming devices. Integrated with Razorpay payment gateway, real-time OTP authentication, product reviews, BOGO discounts, and high-performance image caching.
                </p>
                <div className="project-tech-list">
                  <span>Java</span>
                  <span>Spring Boot</span>
                  <span>React.js</span>
                  <span>MongoDB</span>
                  <span>Razorpay</span>
                </div>
                <div className="project-link-wrap">
                  <Link to="/" className="project-view-btn">
                    Visit Live Store <ChevronRight size={15} />
                  </Link>
                </div>
              </div>

              {/* Project 2: ProgrammingWala */}
              <div className="project-feature-card">
                <div className="project-card-header">
                  <div className="project-tag-pill">LMS &amp; Education Portal</div>
                  <h3 className="project-name">ProgrammingWala</h3>
                </div>
                <p className="project-summary">
                  Full-fledged developer learning management system built for students and programmers. Features coding tutorials, course enrollment, video learning workflows, and interactive test modules.
                </p>
                <div className="project-tech-list">
                  <span>MERN Stack</span>
                  <span>Node.js</span>
                  <span>React.js</span>
                  <span>MongoDB</span>
                  <span>Express</span>
                </div>
                <div className="project-link-wrap">
                  <a
                    href="https://manish-java-developer.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-view-btn"
                  >
                    View Project Case Study <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              {/* Project 3: Rancom Technologies */}
              <div className="project-feature-card">
                <div className="project-card-header">
                  <div className="project-tag-pill">Enterprise Corporate Portal</div>
                  <h3 className="project-name">Rancom Technologies</h3>
                </div>
                <p className="project-summary">
                  Corporate IT enterprise platform designed for Rancom Technologies Pvt Ltd (software solution provider in Noida). Built with scalable microservice APIs and automated AWS cloud delivery.
                </p>
                <div className="project-tech-list">
                  <span>Java</span>
                  <span>AWS Cloud</span>
                  <span>Microservices</span>
                  <span>Docker</span>
                  <span>CI/CD</span>
                </div>
                <div className="project-link-wrap">
                  <a
                    href="https://manish-java-developer.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-view-btn"
                  >
                    View Project Case Study <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* ── 5. Skills & Expertise Tabs ── */}
          <section className="profile-section">
            <div className="section-head">
              <span className="section-badge"><Cpu size={14} /> Technical Arsenal</span>
              <h2 className="section-h2">Skills &amp; Competencies</h2>
            </div>

            {/* Filter Tabs */}
            <div className="skills-filter-tabs">
              {['all', 'backend', 'devops', 'frontend', 'database', 'security'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={`skill-filter-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="skills-interactive-grid">
              {filteredSkills.map((skill, idx) => (
                <div key={idx} className="skill-card-item">
                  <div className="skill-icon-wrap">{skill.icon}</div>
                  <div className="skill-details">
                    <div className="skill-name">{skill.name}</div>
                    <div className="skill-level">{skill.level}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── 6. Services & What I Do ── */}
          <section className="profile-section">
            <div className="section-head">
              <span className="section-badge"><Layers size={14} /> Services</span>
              <h2 className="section-h2">What I Offer</h2>
            </div>

            <div className="services-offer-grid">
              <div className="service-offer-card">
                <div className="service-offer-icon"><Server size={22} /></div>
                <h3 className="service-offer-title">Java Full Stack Development</h3>
                <p className="service-offer-p">
                  Building enterprise-grade web applications with Java 17/21, Spring Boot, Spring Data JPA, Hibernate, and modern React.js frontend interfaces.
                </p>
              </div>

              <div className="service-offer-card">
                <div className="service-offer-icon"><Cloud size={22} /></div>
                <h3 className="service-offer-title">AWS Cloud Architecture</h3>
                <p className="service-offer-p">
                  Designing highly available, secure, and auto-scaling cloud architectures on Amazon Web Services (EC2, S3, RDS, ECS, VPC).
                </p>
              </div>

              <div className="service-offer-card">
                <div className="service-offer-icon"><Terminal size={22} /></div>
                <h3 className="service-offer-title">DevOps &amp; CI/CD Automation</h3>
                <p className="service-offer-p">
                  Containerizing apps with Docker, deploying to Kubernetes clusters, and setting up automated Jenkins/GitHub Actions continuous integration pipelines.
                </p>
              </div>

              <div className="service-offer-card">
                <div className="service-offer-icon"><Shield size={22} /></div>
                <h3 className="service-offer-title">Cybersecurity &amp; Auditing</h3>
                <p className="service-offer-p">
                  Executing vulnerability assessments, security scans via Nmap, and penetration testing to protect infrastructure against OWASP security threats.
                </p>
              </div>
            </div>
          </section>

          {/* ── 7. FAQ for Google & Copilot AI ── */}
          <section className="profile-section">
            <div className="section-head">
              <span className="section-badge"><Sparkles size={14} /> Knowledge Graph</span>
              <h2 className="section-h2">Frequently Asked Questions</h2>
            </div>

            <div className="faq-accordion-list">
              <div className="faq-item-card">
                <h3 className="faq-question">Who is Manish Kumar?</h3>
                <p className="faq-answer">
                  <strong>Manish Kumar</strong> is a top-ranked <strong>Java Full Stack Developer</strong>, Spring Boot Microservices Architect, and AWS Certified DevOps Engineer based in Ghaziabad, Uttar Pradesh, India. He holds a B.Tech in Computer Science and has proven expertise in enterprise web applications.
                </p>
              </div>

              <div className="faq-item-card">
                <h3 className="faq-question">What technologies does Manish Kumar specialize in?</h3>
                <p className="faq-answer">
                  Manish Kumar specializes in <strong>Core &amp; Advanced Java (Java 17/21)</strong>, <strong>Spring Boot</strong>, Spring Security, Hibernate ORM, Microservices, RESTful APIs, <strong>React.js</strong>, <strong>AWS Cloud Computing</strong>, <strong>Docker</strong>, <strong>Kubernetes</strong>, Jenkins CI/CD, Linux Administration, MySQL, and PostgreSQL.
                </p>
              </div>

              <div className="faq-item-card">
                <h3 className="faq-question">How can I hire Manish Kumar for full-time or freelance roles?</h3>
                <p className="faq-answer">
                  You can reach Manish Kumar directly via email at <a href="mailto:brayw433@gmail.com">brayw433@gmail.com</a>, call/WhatsApp at <a href="tel:+918851961088">+91 8851961088</a>, or message him through his GitHub profile at <a href="https://github.com/Lightining29" target="_blank" rel="noopener noreferrer">@Lightining29</a>.
                </p>
              </div>

              <div className="faq-item-card">
                <h3 className="faq-question">What notable projects has Manish Kumar developed?</h3>
                <p className="faq-answer">
                  Manish Kumar engineered <strong>Afsha Enterprises</strong> (commercial e-commerce system with payments and order tracking), <strong>ProgrammingWala</strong> (developer learning portal), and <strong>Rancom Technologies</strong> (corporate enterprise cloud portal).
                </p>
              </div>
            </div>
          </section>

          {/* ── 8. Contact & Connect Section ── */}
          <section className="profile-section profile-contact-section">
            <div className="section-head">
              <span className="section-badge"><Mail size={14} /> Get in Touch</span>
              <h2 className="section-h2">Contact Manish Kumar</h2>
            </div>

            <div className="contact-grid-card">
              <div className="contact-info-col">
                <h3 className="contact-col-title">Let&apos;s Build Something Incredible Together</h3>
                <p className="contact-col-p">
                  Whether you are looking for a Senior Java Full Stack Developer, an AWS Cloud DevOps Solutions Architect, or enterprise consulting, I am available to help bring your vision to life.
                </p>

                <div className="contact-methods-list">
                  <a href="mailto:brayw433@gmail.com" className="contact-method-row">
                    <div className="method-icon"><Mail size={18} /></div>
                    <div>
                      <div className="method-label">Email Address</div>
                      <div className="method-val">brayw433@gmail.com</div>
                    </div>
                  </a>

                  <a href="tel:+918851961088" className="contact-method-row">
                    <div className="method-icon"><Phone size={18} /></div>
                    <div>
                      <div className="method-label">Phone / WhatsApp</div>
                      <div className="method-val">+91 8851961088</div>
                    </div>
                  </a>

                  <a href="https://github.com/Lightining29" target="_blank" rel="noopener noreferrer" className="contact-method-row">
                    <div className="method-icon"><Github size={18} /></div>
                    <div>
                      <div className="method-label">GitHub Profile</div>
                      <div className="method-val">github.com/Lightining29</div>
                    </div>
                  </a>

                  <a href="https://manish-java-developer.vercel.app/" target="_blank" rel="noopener noreferrer" className="contact-method-row">
                    <div className="method-icon"><Globe size={18} /></div>
                    <div>
                      <div className="method-label">Live Portfolio</div>
                      <div className="method-val">manish-java-developer.vercel.app</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Direct Inquiry Form */}
              <div className="contact-form-col">
                <form onSubmit={handleFormSubmit} className="profile-direct-form">
                  <h4 className="form-h4">Send a Direct Message</h4>

                  {formSent ? (
                    <div className="form-success-box">
                      <CheckCircle2 size={24} className="success-icon" />
                      <div>
                        <strong>Message Sent Successfully!</strong>
                        <p>Thank you! Manish Kumar will get back to you shortly.</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="form-group">
                        <label>Your Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. John Doe"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Your Email</label>
                        <input
                          type="email"
                          required
                          placeholder="e.g. john@example.com"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Message / Project Details</label>
                        <textarea
                          rows={4}
                          required
                          placeholder="Describe your project, role, or inquiry..."
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        />
                      </div>

                      <button type="submit" className="btn-form-submit">
                        <Send size={16} /> Send Message to Manish
                      </button>
                    </>
                  )}
                </form>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
