import {
  FileText,
  ScanSearch,
  FilePenLine,
  Target,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Activity,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // FETCH DASHBOARD DATA
  // ============================================================

  const fetchDashboardData = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `http://127.0.0.1:8000/api/dashboard-stats/${user.id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to load dashboard");
      }

      setDashboardData(data.stats);
    } catch (err) {
      console.error("Dashboard Error:", err);
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id]);

  // ============================================================
  // DATA
  // ============================================================

  const stats = dashboardData || {};

  const resumeScore = stats.latest_resume_score ?? "--";
  const atsScore = stats.latest_ats_score ?? "--";
  const jobMatchScore = stats.latest_match_score ?? "--";

  const skillsMatched = stats.skills_matched ?? 0;
  const skillsMissing = stats.skills_missing ?? 0;

  const careerReadiness = stats.career_readiness ?? 0;

  const resumeCount = stats.resume_count ?? 0;
  const atsCount = stats.ats_count ?? 0;
  const jdMatchCount = stats.jd_match_count ?? 0;

  const firstName = user?.name?.split(" ")[0] || "User";

  // A new user should see the product's core actions first.
  const isNewUser = resumeCount === 0 && atsCount === 0 && jdMatchCount === 0;

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="dashboard-page">
        <section className="welcome-section">
          <p className="eyebrow">CARRERIX AI</p>

          <h1>Welcome, {firstName}!</h1>

          <p>
            Preparing your career workspace...
          </p>
        </section>

        <section className="dashboard-panel dashboard-loading">
          <RefreshCw
            size={28}
            className="loading-spinner"
          />

          <p>Loading your dashboard...</p>
        </section>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <div className="dashboard-page">
        <section className="welcome-section">
          <p className="eyebrow">CARRERIX AI</p>

          <h1>Welcome back, {firstName}!</h1>

          <p>{error}</p>
        </section>

        <section className="dashboard-panel dashboard-error">
          <AlertCircle size={34} />

          <h3>We couldn't load your dashboard</h3>

          <p>
            Please try again. Your saved data is not affected.
          </p>

          <button
            className="primary-action-btn"
            onClick={fetchDashboardData}
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* =====================================================
          WELCOME
      ===================================================== */}

      <section className="welcome-section dashboard-welcome">

        <div>
          <p className="eyebrow">
            CARRERIX AI
          </p>

          <h1>
            Welcome back, {firstName}!
          </h1>

          <p>
            Build a stronger resume, check your ATS score,
            and match your profile with the right opportunities.
          </p>
        </div>

        <button
          className="dashboard-refresh-btn"
          onClick={fetchDashboardData}
          title="Refresh dashboard"
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </section>


      {/* =====================================================
          START HERE — PRIMARY USER JOURNEY
      ===================================================== */}

      <section className="start-section">

        <div className="section-heading start-heading">

          <div>
            <p className="eyebrow">
              {isNewUser ? "GET STARTED" : "CONTINUE YOUR CAREER JOURNEY"}
            </p>

            <h2>
              {isNewUser
                ? "What would you like to do?"
                : "Take your next step"}
            </h2>

            <p>
              {isNewUser
                ? "Choose a tool below to start improving your career profile."
                : "Jump directly into the tool you need."}
            </p>
          </div>

        </div>


        <div className="start-grid">

          {/* Resume Analyzer */}

          <button
            className="start-card start-card-primary"
            onClick={() => navigate("/resume-analyzer")}
          >

            <div className="start-card-top">
              <div className="start-icon">
                <FileText size={24} />
              </div>

              <span className="start-card-arrow">
                <ArrowRight size={18} />
              </span>
            </div>

            <div className="start-card-content">
              <span className="start-card-label">
                STEP 01
              </span>

              <h3>
                Analyze Your Resume
              </h3>

              <p>
                Upload your resume and get a detailed score,
                detected skills, sections, and improvement suggestions.
              </p>
            </div>

            <span className="start-card-action">
              {resumeCount > 0 ? "Analyze Again" : "Start Analysis"}
              <ArrowRight size={16} />
            </span>

          </button>


          {/* Resume Builder */}

          <button
            className="start-card"
            onClick={() => navigate("/resume-builder")}
          >

            <div className="start-card-top">
              <div className="start-icon start-icon-blue">
                <FilePenLine size={24} />
              </div>

              <span className="start-card-arrow">
                <ArrowRight size={18} />
              </span>
            </div>

            <div className="start-card-content">
              <span className="start-card-label">
                STEP 02
              </span>

              <h3>
                Build Your Resume
              </h3>

              <p>
                Create a professional, structured resume
                that is ready for your next application.
              </p>
            </div>

            <span className="start-card-action">
              {resumeCount > 0 ? "Edit Resume" : "Build Resume"}
              <ArrowRight size={16} />
            </span>

          </button>


          {/* ATS Checker */}

          <button
            className="start-card"
            onClick={() => navigate("/ats-checker")}
          >

            <div className="start-card-top">
              <div className="start-icon start-icon-green">
                <ScanSearch size={24} />
              </div>

              <span className="start-card-arrow">
                <ArrowRight size={18} />
              </span>
            </div>

            <div className="start-card-content">
              <span className="start-card-label">
                STEP 03
              </span>

              <h3>
                Check ATS Compatibility
              </h3>

              <p>
                Check whether your resume is optimized
                for applicant tracking systems.
              </p>
            </div>

            <span className="start-card-action">
              {atsCount > 0 ? "Check Again" : "Check Resume"}
              <ArrowRight size={16} />
            </span>

          </button>

        </div>

      </section>


      {/* =====================================================
          PERFORMANCE SNAPSHOT
      ===================================================== */}

      <section className="dashboard-section-block">

        <div className="section-heading compact-heading">

          <div>
            <p className="eyebrow">
              PERFORMANCE
            </p>

            <h2>
              Your Career Snapshot
            </h2>
          </div>

        </div>


        <div className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon">
              <FileText size={22} />
            </div>

            <div>
              <span>Resume Score</span>

              <strong>
                {resumeScore}
                {resumeScore !== "--" && "%"}
              </strong>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon">
              <ScanSearch size={22} />
            </div>

            <div>
              <span>ATS Score</span>

              <strong>
                {atsScore}
                {atsScore !== "--" && "%"}
              </strong>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon">
              <Target size={22} />
            </div>

            <div>
              <span>Skills Matched</span>

              <strong>
                {skillsMatched}
              </strong>
            </div>
          </div>


          <div className="stat-card">
            <div className="stat-icon">
              <Briefcase size={22} />
            </div>

            <div>
              <span>Job Match</span>

              <strong>
                {jobMatchScore}
                {jobMatchScore !== "--" && "%"}
              </strong>
            </div>
          </div>

        </div>

      </section>


      {/* =====================================================
          CAREER READINESS + SKILL GAP
      ===================================================== */}

      <section className="dashboard-two-column">

        {/* Career Readiness */}

        <div className="dashboard-panel readiness-panel">

          <div className="panel-heading">

            <div>
              <p className="eyebrow">
                OVERALL PERFORMANCE
              </p>

              <h2>
                Career Readiness
              </h2>
            </div>

            <div className="panel-heading-icon">
              <TrendingUp size={20} />
            </div>

          </div>


          <div className="readiness-content">

            <div className="readiness-score">

              <strong>
                {careerReadiness}%
              </strong>

              <span>
                Overall Readiness
              </span>

            </div>


            <div className="readiness-bar-container">

              <div className="readiness-bar">

                <div
                  className="readiness-progress"
                  style={{
                    width: `${careerReadiness}%`,
                  }}
                />

              </div>

              <div className="readiness-labels">
                <span>Getting Started</span>
                <span>Job Ready</span>
              </div>

            </div>

          </div>


          <p className="readiness-description">
            Your readiness score combines your resume,
            ATS compatibility, and job skill alignment.
          </p>

        </div>


        {/* Skill Gap */}

        <div className="dashboard-panel">

          <div className="panel-heading">

            <div>
              <p className="eyebrow">
                SKILL OVERVIEW
              </p>

              <h2>
                Skill Gap
              </h2>
            </div>

            <div className="panel-heading-icon">
              <Target size={20} />
            </div>

          </div>


          <div className="skill-overview">

            <div className="skill-overview-item">

              <div className="skill-overview-left">
                <CheckCircle2 size={18} />
                <span>Skills Matched</span>
              </div>

              <strong>
                {skillsMatched}
              </strong>

            </div>


            <div className="skill-overview-item">

              <div className="skill-overview-left">
                <AlertCircle size={18} />
                <span>Skills Missing</span>
              </div>

              <strong>
                {skillsMissing}
              </strong>

            </div>

          </div>


          <button
            className="panel-link-btn"
            onClick={() => navigate("/skill-gap")}
          >
            View Skill Gap
            <ArrowRight size={16} />
          </button>

        </div>

      </section>


      {/* =====================================================
          PROFILE PROGRESS
      ===================================================== */}

      <section className="dashboard-panel progress-panel">

        <div className="panel-heading">

          <div>
            <p className="eyebrow">
              YOUR PROGRESS
            </p>

            <h2>
              Career Profile Progress
            </h2>
          </div>

          <div className="panel-heading-icon">
            <Activity size={20} />
          </div>

        </div>


        <div className="progress-list">

          {/* Resume */}

          <div className="progress-item">

            <div className="progress-item-icon">
              {resumeScore !== "--" ? (
                <CheckCircle2 size={18} />
              ) : (
                <FileText size={18} />
              )}
            </div>

            <div className="progress-item-content">

              <div className="progress-item-heading">

                <strong>
                  Resume Analysis
                </strong>

                <span>
                  {resumeScore !== "--"
                    ? `${resumeScore}%`
                    : "Not completed"}
                </span>

              </div>

              <div className="mini-progress">
                <div
                  style={{
                    width:
                      resumeScore !== "--"
                        ? `${resumeScore}%`
                        : "0%",
                  }}
                />
              </div>

            </div>

          </div>


          {/* ATS */}

          <div className="progress-item">

            <div className="progress-item-icon">
              {atsScore !== "--" ? (
                <CheckCircle2 size={18} />
              ) : (
                <ScanSearch size={18} />
              )}
            </div>

            <div className="progress-item-content">

              <div className="progress-item-heading">

                <strong>
                  ATS Compatibility
                </strong>

                <span>
                  {atsScore !== "--"
                    ? `${atsScore}%`
                    : "Not completed"}
                </span>

              </div>

              <div className="mini-progress">
                <div
                  style={{
                    width:
                      atsScore !== "--"
                        ? `${atsScore}%`
                        : "0%",
                  }}
                />
              </div>

            </div>

          </div>


          {/* Job Match */}

          <div className="progress-item">

            <div className="progress-item-icon">
              {jobMatchScore !== "--" ? (
                <CheckCircle2 size={18} />
              ) : (
                <Briefcase size={18} />
              )}
            </div>

            <div className="progress-item-content">

              <div className="progress-item-heading">

                <strong>
                  Job Alignment
                </strong>

                <span>
                  {jobMatchScore !== "--"
                    ? `${jobMatchScore}%`
                    : "Not completed"}
                </span>

              </div>

              <div className="mini-progress">
                <div
                  style={{
                    width:
                      jobMatchScore !== "--"
                        ? `${jobMatchScore}%`
                        : "0%",
                  }}
                />
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          RECENT ACTIVITY
      ===================================================== */}

      <section className="dashboard-panel activity-panel">

        <div className="panel-heading">

          <div>
            <p className="eyebrow">
              ACTIVITY
            </p>

            <h2>
              Recent Activity
            </h2>
          </div>

        </div>


        <div className="activity-list">

          <div className="activity-item">

            <div className="activity-icon">
              <FileText size={18} />
            </div>

            <div className="activity-content">

              <strong>
                Resume Analysis
              </strong>

              <span>
                {resumeScore !== "--"
                  ? `Your latest resume score is ${resumeScore}%.`
                  : "Analyze your resume to get started."}
              </span>

            </div>

            <button
              onClick={() => navigate("/resume-analyzer")}
            >
              Open
            </button>

          </div>


          <div className="activity-item">

            <div className="activity-icon">
              <ScanSearch size={18} />
            </div>

            <div className="activity-content">

              <strong>
                ATS Check
              </strong>

              <span>
                {atsScore !== "--"
                  ? `Your latest ATS compatibility score is ${atsScore}%.`
                  : "Check your resume compatibility."}
              </span>

            </div>

            <button
              onClick={() => navigate("/ats-checker")}
            >
              Open
            </button>

          </div>


          <div className="activity-item">

            <div className="activity-icon">
              <Briefcase size={18} />
            </div>

            <div className="activity-content">

              <strong>
                Job Matching
              </strong>

              <span>
                {jobMatchScore !== "--"
                  ? `Your latest job match score is ${jobMatchScore}%.`
                  : "Match your resume with a target job."}
              </span>

            </div>

            <button
              onClick={() => navigate("/jd-matcher")}
            >
              Open
            </button>

          </div>

        </div>

      </section>


      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <section className="quick-actions">

        <div className="section-heading">

          <div>
            <h2>
              More Tools
            </h2>

            <p>
              Explore the rest of your career workspace.
            </p>
          </div>

        </div>


        <div className="action-grid">

          <div className="action-card">

            <div className="action-icon">
              <Briefcase size={22} />
            </div>

            <h3>
              Match a Job
            </h3>

            <p>
              Compare your resume with a target job description.
            </p>

            <button
              onClick={() => navigate("/jd-matcher")}
            >
              Match Job
              <ArrowRight size={17} />
            </button>

          </div>


          <div className="action-card">

            <div className="action-icon">
              <Target size={22} />
            </div>

            <h3>
              Skill Gap
            </h3>

            <p>
              Discover missing skills and identify areas to improve.
            </p>

            <button
              onClick={() => navigate("/skill-gap")}
            >
              View Skills
              <ArrowRight size={17} />
            </button>

          </div>


          <div className="action-card">

            <div className="action-icon">
              <Activity size={22} />
            </div>

            <h3>
              Resume History
            </h3>

            <p>
              Review your previous resume analyses and progress.
            </p>

            <button
              onClick={() => navigate("/resume-history")}
            >
              View History
              <ArrowRight size={17} />
            </button>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Dashboard;
