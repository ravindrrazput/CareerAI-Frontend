import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  FileCheck2,
  FilePenLine,
  FileSearch,
  Gauge,
  Menu,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
  X,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const goToRegister = () => {
    setMobileMenuOpen(false);
    navigate("/register");
  };

  const goToLogin = () => {
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);

    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const features = [
    {
      icon: <FileSearch size={24} />,
      title: "Resume Analyzer",
      description:
        "Analyze your resume and understand its strengths, weaknesses, skills and overall profile quality.",
      className: "landing-feature-orange",
    },
    {
      icon: <Gauge size={24} />,
      title: "ATS Checker",
      description:
        "Check your resume for ATS compatibility and identify areas that may affect your application.",
      className: "landing-feature-blue",
    },
    {
      icon: <BriefcaseBusiness size={24} />,
      title: "Job Matcher",
      description:
        "Compare your resume with a job description and discover how well your profile matches the role.",
      className: "landing-feature-purple",
    },
    {
      icon: <FilePenLine size={24} />,
      title: "Resume Builder",
      description:
        "Create and organize a professional resume with structured sections designed for modern hiring.",
      className: "landing-feature-green",
    },
    {
      icon: <Target size={24} />,
      title: "Skill Gap",
      description:
        "Identify missing skills and understand what you can improve for your target career path.",
      className: "landing-feature-orange",
    },
    {
      icon: <TrendingUp size={24} />,
      title: "Career Progress",
      description:
        "Track your resume, ATS and job matching performance from one centralized dashboard.",
      className: "landing-feature-blue",
    },
  ];

  const steps = [
    {
      number: "01",
      icon: <Upload size={22} />,
      title: "Upload Your Resume",
      description:
        "Upload your existing resume and let Carrerix AI understand your professional profile.",
    },
    {
      number: "02",
      icon: <FileCheck2 size={22} />,
      title: "Analyze Your Profile",
      description:
        "Get insights about your resume quality, skills, ATS compatibility and career readiness.",
    },
    {
      number: "03",
      icon: <Sparkles size={22} />,
      title: "Improve & Optimize",
      description:
        "Identify gaps, improve your resume and build a stronger application profile.",
    },
    {
      number: "04",
      icon: <Target size={22} />,
      title: "Match With Jobs",
      description:
        "Compare your profile with job descriptions and understand where you stand.",
    },
    {
      number: "05",
      icon: <BarChart3 size={22} />,
      title: "Track Your Progress",
      description:
        "Monitor your career preparation journey through your personalized dashboard.",
    },
  ];

  return (
    <div className="landing-page">
      {/* =========================
          NAVBAR
      ========================== */}
      <header className="landing-navbar">
        <div
          className="landing-container landing-navbar-inner"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              return;
            }
          }}
        >
          {/* LOGO */}
          <button
            className="landing-logo"
            onClick={() => {
              setMobileMenuOpen(false);
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            aria-label="Carrerix AI home"
          >
            <span className="landing-logo-mark">C</span>

            <span className="landing-logo-text">
              <strong>Carrerix AI</strong>
              <small>Career Intelligence Platform</small>
            </span>
          </button>

          {/* DESKTOP NAVIGATION */}
          <nav className="landing-nav-links">
            <button onClick={() => scrollToSection("features")}>
              Features
            </button>

            <button onClick={() => scrollToSection("how-it-works")}>
              How It Works
            </button>

            <button onClick={() => scrollToSection("why-carrerix")}>
              Why Carrerix
            </button>
          </nav>

          {/* DESKTOP ACTIONS */}
          <div className="landing-nav-actions">
            <button className="landing-login-btn" onClick={goToLogin}>
              Login
            </button>

            <button className="landing-primary-btn" onClick={goToRegister}>
              Get Started
              <ArrowRight size={17} />
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="landing-mobile-menu-btn"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>

        {/* MOBILE NAVIGATION */}
        {mobileMenuOpen && (
          <div className="landing-mobile-menu">
            <button onClick={() => scrollToSection("features")}>
              Features
            </button>

            <button onClick={() => scrollToSection("how-it-works")}>
              How It Works
            </button>

            <button onClick={() => scrollToSection("why-carrerix")}>
              Why Carrerix
            </button>

            <div className="landing-mobile-actions">
              <button
                className="landing-mobile-login"
                onClick={goToLogin}
              >
                Login
              </button>

              <button
                className="landing-primary-btn"
                onClick={goToRegister}
              >
                Get Started
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* =========================
          HERO SECTION
      ========================== */}
      <main>
        <section className="landing-hero">
          <div className="landing-hero-glow landing-glow-one" />
          <div className="landing-hero-glow landing-glow-two" />

          <div className="landing-container landing-hero-grid">
            {/* HERO CONTENT */}
            <div className="landing-hero-content">
              <div className="landing-eyebrow">
                <span className="landing-eyebrow-icon">
                  <Sparkles size={15} />
                </span>

                AI-Powered Career Intelligence
              </div>

              <h1>
                Build a Resume
                <span> That Gets Noticed.</span>
              </h1>

              <p className="landing-hero-description">
                Carrerix AI helps you analyze, optimize and improve your
                resume — while giving you the insights you need to move
                closer to your career goals.
              </p>

              <div className="landing-hero-actions">
                <button
                  className="landing-primary-btn landing-hero-btn"
                  onClick={goToRegister}
                >
                  Analyze My Resume
                  <ArrowRight size={18} />
                </button>

                <button
                  className="landing-secondary-btn landing-hero-btn"
                  onClick={() => scrollToSection("how-it-works")}
                >
                  See How It Works
                </button>
              </div>

              <div className="landing-hero-trust">
                <div className="landing-trust-item">
                  <CheckCircle2 size={17} />
                  <span>Resume Analysis</span>
                </div>

                <div className="landing-trust-item">
                  <CheckCircle2 size={17} />
                  <span>ATS Optimization</span>
                </div>

                <div className="landing-trust-item">
                  <CheckCircle2 size={17} />
                  <span>Job Matching</span>
                </div>
              </div>
            </div>

            {/* HERO VISUAL */}
            <div className="landing-hero-visual">
              <div className="landing-dashboard-glow" />

              <div className="landing-dashboard-card">
                {/* MOCK DASHBOARD HEADER */}
                <div className="landing-dashboard-header">
                  <div>
                    <span className="landing-dashboard-label">
                      Career Dashboard
                    </span>

                    <strong>Profile Overview</strong>
                  </div>

                  <div className="landing-dashboard-avatar">
                    C
                  </div>
                </div>

                {/* SCORE CARD */}
                <div className="landing-score-card">
                  <div className="landing-score-info">
                    <span>Resume Score</span>

                    <strong>86</strong>

                    <small>
                      <TrendingUp size={14} />
                      Strong profile
                    </small>
                  </div>

                  <div className="landing-score-ring">
                    <div className="landing-score-ring-inner">
                      86%
                    </div>
                  </div>
                </div>

                {/* MINI STATS */}
                <div className="landing-mini-stats">
                  <div className="landing-mini-stat">
                    <div className="landing-mini-icon landing-mini-blue">
                      <Gauge size={17} />
                    </div>

                    <div>
                      <strong>92%</strong>
                      <span>ATS Score</span>
                    </div>
                  </div>

                  <div className="landing-mini-stat">
                    <div className="landing-mini-icon landing-mini-green">
                      <Target size={17} />
                    </div>

                    <div>
                      <strong>78%</strong>
                      <span>Job Match</span>
                    </div>
                  </div>
                </div>

                {/* SKILLS */}
                <div className="landing-dashboard-section">
                  <div className="landing-dashboard-section-heading">
                    <span>Skills Matched</span>
                    <span>8 / 10</span>
                  </div>

                  <div className="landing-progress-bar">
                    <span />
                  </div>

                  <div className="landing-skill-pills">
                    <span>React</span>
                    <span>JavaScript</span>
                    <span>Python</span>
                    <span>SQL</span>
                  </div>
                </div>

                {/* DASHBOARD FOOTER */}
                <div className="landing-dashboard-footer">
                  <div>
                    <CheckCircle2 size={16} />
                    <span>Career profile improving</span>
                  </div>

                  <ArrowRight size={16} />
                </div>
              </div>

              {/* FLOATING CARD */}
              <div className="landing-floating-card">
                <div className="landing-floating-icon">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <strong>ATS Ready</strong>
                  <span>Resume optimized</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            TRUST / STATS
        ========================== */}
        <section className="landing-trust-section">
          <div className="landing-container">
            <div className="landing-trust-grid">
              <div className="landing-trust-stat">
                <strong>6+</strong>
                <span>Career Tools</span>
              </div>

              <div className="landing-trust-stat">
                <strong>AI</strong>
                <span>Powered Insights</span>
              </div>

              <div className="landing-trust-stat">
                <strong>ATS</strong>
                <span>Compatibility Checks</span>
              </div>

              <div className="landing-trust-stat">
                <strong>360°</strong>
                <span>Career Visibility</span>
              </div>
            </div>
          </div>
        </section>

        {/* =========================
            FEATURES
        ========================== */}
        <section
          id="features"
          className="landing-section landing-features-section"
        >
          <div className="landing-container">
            <div className="landing-section-heading">
              <div className="landing-section-eyebrow">
                EVERYTHING YOU NEED
              </div>

              <h2>
                One Platform.
                <span> Your Complete Career Toolkit.</span>
              </h2>

              <p>
                From building your resume to understanding your job
                readiness, Carrerix AI brings the essential career tools
                together in one place.
              </p>
            </div>

            <div className="landing-feature-grid">
              {features.map((feature, index) => (
                <div
                  className="landing-feature-card"
                  key={`${feature.title}-${index}`}
                >
                  <div
                    className={`landing-feature-icon ${feature.className}`}
                  >
                    {feature.icon}
                  </div>

                  <h3>{feature.title}</h3>

                  <p>{feature.description}</p>

                  <button
                    className="landing-feature-link"
                    onClick={goToRegister}
                  >
                    Explore Tool
                    <ArrowRight size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================
            WHY CARRERIX
        ========================== */}
        <section
          id="why-carrerix"
          className="landing-section landing-why-section"
        >
          <div className="landing-container landing-why-grid">
            <div className="landing-why-content">
              <div className="landing-section-eyebrow">
                WHY CARRERIX AI
              </div>

              <h2>
                Stop Guessing.
                <span> Start Improving.</span>
              </h2>

              <p>
                Your resume is more than a document. It is the first step
                between your skills and your next opportunity. Carrerix AI
                helps you understand exactly where your profile stands.
              </p>

              <div className="landing-benefit-list">
                <div className="landing-benefit">
                  <div className="landing-benefit-icon">
                    <FileCheck2 size={19} />
                  </div>

                  <div>
                    <strong>Understand Your Resume</strong>
                    <span>
                      Get structured insights instead of blindly editing
                      your resume.
                    </span>
                  </div>
                </div>

                <div className="landing-benefit">
                  <div className="landing-benefit-icon">
                    <ShieldCheck size={19} />
                  </div>

                  <div>
                    <strong>Prepare for ATS Screening</strong>
                    <span>
                      Identify potential ATS compatibility issues before
                      applying.
                    </span>
                  </div>
                </div>

                <div className="landing-benefit">
                  <div className="landing-benefit-icon">
                    <Target size={19} />
                  </div>

                  <div>
                    <strong>Know Your Skill Gaps</strong>
                    <span>
                      Discover skills that may matter for your target
                      opportunities.
                    </span>
                  </div>
                </div>

                <div className="landing-benefit">
                  <div className="landing-benefit-icon">
                    <BarChart3 size={19} />
                  </div>

                  <div>
                    <strong>Track Your Progress</strong>
                    <span>
                      Keep your career preparation journey measurable and
                      organized.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* WHY VISUAL */}
            <div className="landing-why-visual">
              <div className="landing-insight-card">
                <div className="landing-insight-top">
                  <div>
                    <span>Career Readiness</span>
                    <strong>82%</strong>
                  </div>

                  <div className="landing-insight-badge">
                    <TrendingUp size={15} />
                    Improving
                  </div>
                </div>

                <div className="landing-readiness-bar">
                  <span />
                </div>

                <div className="landing-insight-grid">
                  <div>
                    <span>Resume</span>
                    <strong>86%</strong>
                  </div>

                  <div>
                    <span>ATS</span>
                    <strong>92%</strong>
                  </div>

                  <div>
                    <span>Skills</span>
                    <strong>78%</strong>
                  </div>

                  <div>
                    <span>Match</span>
                    <strong>74%</strong>
                  </div>
                </div>

                <div className="landing-insight-message">
                  <Sparkles size={17} />

                  <span>
                    Keep improving your missing skills to strengthen your
                    career profile.
                  </span>
                </div>
              </div>

              <div className="landing-abstract-shape landing-shape-one" />
              <div className="landing-abstract-shape landing-shape-two" />
            </div>
          </div>
        </section>

        {/* =========================
            HOW IT WORKS
        ========================== */}
        <section
          id="how-it-works"
          className="landing-section landing-how-section"
        >
          <div className="landing-container">
            <div className="landing-section-heading landing-how-heading">
              <div className="landing-section-eyebrow">
                SIMPLE PROCESS
              </div>

              <h2>
                From Resume to
                <span> Career Ready.</span>
              </h2>

              <p>
                A simple workflow designed to help you understand,
                improve and prepare your professional profile.
              </p>
            </div>

            <div className="landing-steps">
              {steps.map((step, index) => (
                <div className="landing-step" key={step.number}>
                  <div className="landing-step-number">
                    {step.number}
                  </div>

                  <div className="landing-step-icon">
                    {step.icon}
                  </div>

                  <h3>{step.title}</h3>

                  <p>{step.description}</p>

                  {index !== steps.length - 1 && (
                    <div className="landing-step-line">
                      <ArrowRight size={16} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================
            CTA
        ========================== */}
        <section className="landing-cta-section">
          <div className="landing-container">
            <div className="landing-cta-card">
              <div className="landing-cta-glow landing-cta-glow-one" />
              <div className="landing-cta-glow landing-cta-glow-two" />

              <div className="landing-cta-content">
                <div className="landing-cta-icon">
                  <Sparkles size={22} />
                </div>

                <div>
                  <div className="landing-cta-eyebrow">
                    YOUR NEXT OPPORTUNITY STARTS HERE
                  </div>

                  <h2>
                    Ready to Build a
                    <span> Stronger Career Profile?</span>
                  </h2>

                  <p>
                    Create your Carrerix AI account and start improving
                    your resume, skills and job readiness today.
                  </p>
                </div>
              </div>

              <button
                className="landing-cta-button"
                onClick={goToRegister}
              >
                Get Started Free
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* =========================
          FOOTER
      ========================== */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="landing-footer-main">
            <div className="landing-footer-brand">
              <button
                className="landing-footer-logo"
                onClick={() =>
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  })
                }
              >
                <span className="landing-logo-mark">
                  C
                </span>

                <span>
                  <strong>Carrerix AI</strong>
                  <small>
                    Craft Your Resume. Elevate Your Career.
                  </small>
                </span>
              </button>

              <p>
                AI-powered tools to help you build, analyze and improve
                your professional career profile.
              </p>
            </div>

            <div className="landing-footer-links">
              <div>
                <strong>Platform</strong>

                <button onClick={() => scrollToSection("features")}>
                  Features
                </button>

                <button
                  onClick={() => scrollToSection("how-it-works")}
                >
                  How It Works
                </button>

                <button onClick={goToRegister}>
                  Get Started
                </button>
              </div>

              <div>
                <strong>Account</strong>

                <button onClick={goToLogin}>Login</button>

                <button onClick={goToRegister}>Create Account</button>
              </div>

              <div>
                <strong>Career Tools</strong>

                <button onClick={goToRegister}>
                  Resume Analyzer
                </button>

                <button onClick={goToRegister}>
                  ATS Checker
                </button>

                <button onClick={goToRegister}>
                  Job Matcher
                </button>
              </div>
            </div>
          </div>

          <div className="landing-footer-bottom">
            <span>
              © {new Date().getFullYear()} Carrerix AI. All rights
              reserved.
            </span>

            <span>Craft Your Resume. Elevate Your Career.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;