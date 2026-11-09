import { useEffect, useState } from "react";
import {
  Target,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ArrowRight,
  Sparkles,
  History,
  Eye,
  ChevronUp,
  RefreshCw,
} from "lucide-react";

import { matchJob } from "../services/api";
import { useAuth } from "../context/AuthContext";

function SkillGap() {
  const { user } = useAuth();

  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);

  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  const [selectedHistoryId, setSelectedHistoryId] = useState(null);

  const resumeAnalysis = JSON.parse(
    localStorage.getItem("careerai_resume_analysis") || "null"
  );

  const resumeText = resumeAnalysis?.text || "";

  // =========================================================
  // LOAD SKILL GAP HISTORY
  // =========================================================

  const loadHistory = async () => {
    if (!user?.id) {
      return;
    }

    try {
      setHistoryLoading(true);
      setHistoryError("");

      const response = await fetch(
        `http://127.0.0.1:8000/api/jd-match-history/${user.id}`
      );

      if (!response.ok) {
        throw new Error("Unable to fetch history.");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message || "Unable to fetch skill gap history."
        );
      }

      setHistory(data.history || []);
    } catch (err) {
      console.error("Skill Gap History error:", err);

      setHistoryError("Unable to connect to the backend.");
    } finally {
      setHistoryLoading(false);
    }
  };

  // Load history when page opens
  useEffect(() => {
    if (user?.id) {
      loadHistory();
    }
  }, [user?.id]);

  // =========================================================
  // ANALYZE SKILL GAP
  // =========================================================

  const handleAnalyze = async () => {
    setError("");
    setResult(null);

    if (!user?.id) {
      setError("User session not found. Please login again.");
      return;
    }

    if (!resumeText.trim()) {
      setError(
        "Please analyze your resume first from the Resume Analyzer page."
      );
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please enter your target job description.");
      return;
    }

    try {
      setIsAnalyzing(true);

      const data = await matchJob(
        resumeText,
        jobDescription,
        user.id
      );

      if (!data.success) {
        setError(
          data.message || "Unable to analyze skill gap."
        );
        return;
      }

      setResult(data);

      localStorage.setItem(
        "careerai_skill_gap",
        JSON.stringify(data)
      );

      // Refresh history after successful analysis
      await loadHistory();
    } catch (err) {
      console.error("Skill Gap error:", err);

      setError(
        "Unable to connect to the backend. Make sure FastAPI is running."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // =========================================================
  // PRIORITY
  // =========================================================

  const getPriority = (index) => {
    if (index === 0) return "High";
    if (index <= 2) return "Medium";
    return "Low";
  };

  // =========================================================
  // VIEW HISTORY DETAILS
  // =========================================================

  const handleViewHistory = (item) => {
    setSelectedHistoryId((current) =>
      current === item.id ? null : item.id
    );
  };

  return (
    <div className="dashboard-page">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="welcome-section">
        <p className="eyebrow">CAREER DEVELOPMENT</p>

        <h1>Skill Gap Analysis</h1>

        <p>
          Discover the skills you need to improve for your target career.
        </p>
      </div>

      {/* =====================================================
          INPUT CARD
      ====================================================== */}

      <div className="analysis-card skill-gap-input-card">

        <div className="analysis-title">
          <Target size={20} />

          <div>
            <h3>Target Job</h3>

            <p className="card-subtitle">
              Paste the job description to identify your skill gaps.
            </p>
          </div>
        </div>

        <textarea
          className="job-description-input skill-gap-textarea"
          placeholder="Paste your target job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />

        {error && (
          <div className="error-message">
            <AlertCircle size={18} />

            <span>{error}</span>
          </div>
        )}

        <button
          className="analyze-btn"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          <Sparkles size={17} />

          {isAnalyzing
            ? "Analyzing Skills..."
            : "Analyze Skill Gap"}

          <ArrowRight size={17} />
        </button>
      </div>

      {/* =====================================================
          CURRENT RESULT
      ====================================================== */}

      {result && (
        <>
          {/* Stats */}

          <div className="stats-grid skill-gap-stats">

            <div className="stat-card">
              <div className="stat-icon">
                <Target size={22} />
              </div>

              <div>
                <span>Skill Coverage</span>

                <strong>
                  {result.skill_match}%
                </strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <CheckCircle2 size={22} />
              </div>

              <div>
                <span>Skills Matched</span>

                <strong>
                  {result.matched_skills?.length || 0}
                </strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <AlertCircle size={22} />
              </div>

              <div>
                <span>Skills Missing</span>

                <strong>
                  {result.missing_skills?.length || 0}
                </strong>
              </div>
            </div>

          </div>

          {/* =================================================
              SKILL LISTS
          ================================================== */}

          <div className="analysis-grid skill-gap-results">

            {/* Matched Skills */}

            <div className="analysis-card">

              <div className="analysis-title">
                <CheckCircle2 size={20} />

                <div>
                  <h3>Matched Skills</h3>

                  <p className="card-subtitle">
                    Skills you already have.
                  </p>
                </div>
              </div>

              {result.matched_skills?.length > 0 ? (
                <div className="skills-list">

                  {result.matched_skills.map(
                    (skill, index) => (
                      <span
                        className="skill-tag"
                        key={`${skill}-${index}`}
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>
              ) : (
                <p className="empty-state">
                  No matching skills found.
                </p>
              )}

            </div>

            {/* Missing Skills */}

            <div className="analysis-card">

              <div className="analysis-title">
                <AlertCircle size={20} />

                <div>
                  <h3>Missing Skills</h3>

                  <p className="card-subtitle">
                    Skills you should focus on.
                  </p>
                </div>
              </div>

              {result.missing_skills?.length > 0 ? (
                <div className="skills-list">

                  {result.missing_skills.map(
                    (skill, index) => (
                      <span
                        className="missing-skill-tag"
                        key={`${skill}-${index}`}
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>
              ) : (
                <p className="empty-state">
                  No major skill gaps detected.
                </p>
              )}

            </div>

          </div>

          {/* =================================================
              LEARNING ROADMAP
          ================================================== */}

          <div className="analysis-card learning-roadmap-card">

            <div className="analysis-title">
              <BookOpen size={20} />

              <div>
                <h3>Learning Roadmap</h3>

                <p className="card-subtitle">
                  Prioritize the missing skills based on your current gap.
                </p>
              </div>
            </div>

            {result.missing_skills?.length > 0 ? (
              <div className="learning-list">

                {result.missing_skills.map(
                  (skill, index) => (
                    <div
                      className="learning-item"
                      key={`${skill}-learning-${index}`}
                    >

                      <div className="learning-number">
                        {index + 1}
                      </div>

                      <div className="learning-content">

                        <div className="learning-heading">

                          <strong>{skill}</strong>

                          <span
                            className={`priority-badge priority-${getPriority(
                              index
                            ).toLowerCase()}`}
                          >
                            {getPriority(index)} Priority
                          </span>

                        </div>

                        <p>
                          Focus on {skill} and build at least
                          one practical project to strengthen
                          your resume.
                        </p>

                      </div>

                    </div>
                  )
                )}

              </div>
            ) : (
              <div className="success-state">

                <CheckCircle2 size={22} />

                <span>
                  Your current skills are well aligned with this target job.
                </span>

              </div>
            )}

          </div>

          {/* =================================================
              RECOMMENDATIONS
          ================================================== */}

          {result.recommendations?.length > 0 && (
            <div className="analysis-card">

              <div className="analysis-title">
                <Sparkles size={20} />

                <div>
                  <h3>Recommendations</h3>

                  <p className="card-subtitle">
                    Suggestions to improve your career profile.
                  </p>
                </div>
              </div>

              <div className="recommendations-list">

                {result.recommendations.map(
                  (recommendation, index) => (
                    <div
                      className="analysis-item"
                      key={index}
                    >

                      <ArrowRight size={18} />

                      <span>
                        {recommendation}
                      </span>

                    </div>
                  )
                )}

              </div>

            </div>
          )}

        </>
      )}

      {/* =====================================================
          SKILL GAP HISTORY
      ====================================================== */}

      <div className="analysis-card">

        <div
          className="analysis-title"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >

            <History size={20} />

            <div>
              <h3>Skill Gap History</h3>

              <p className="card-subtitle">
                View your previous skill gap analyses.
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={loadHistory}
            disabled={historyLoading}
            style={{
              background: "transparent",
              border: "none",
              color: "inherit",
              cursor: historyLoading
                ? "not-allowed"
                : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px",
            }}
          >
            <RefreshCw
              size={15}
              className={historyLoading ? "spin" : ""}
            />

            Refresh
          </button>

        </div>

        {/* History Error */}

        {historyError && (
          <div className="error-message">
            <AlertCircle size={18} />

            <span>{historyError}</span>
          </div>
        )}

        {/* Loading */}

        {historyLoading ? (
          <div className="empty-state">
            Loading skill gap history...
          </div>
        ) : history.length === 0 ? (
          /* Empty */

          <div
            className="empty-state"
            style={{
              padding: "40px 20px",
              textAlign: "center",
            }}
          >

            <History
              size={42}
              style={{
                opacity: 0.45,
                marginBottom: "12px",
              }}
            />

            <p style={{ margin: 0 }}>
              No Skill Gap history found.
            </p>

            <small>
              Your previous skill gap analyses will appear here.
            </small>

          </div>
        ) : (
          /* History List */

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              marginTop: "20px",
            }}
          >

            {history.map((item) => {

              const isSelected =
                selectedHistoryId === item.id;

              return (
                <div
                  key={item.id}
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "12px",
                    padding: "16px",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >

                  {/* History Summary */}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "20px",
                      flexWrap: "wrap",
                    }}
                  >

                    <div>
                      <strong>
                        Skill Gap Analysis
                      </strong>

                      <p
                        style={{
                          margin: "5px 0 0",
                          opacity: 0.65,
                          fontSize: "13px",
                        }}
                      >
                        {item.created_at
                          ? new Date(
                              item.created_at
                            ).toLocaleString()
                          : "Previous analysis"}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                      }}
                    >

                      <div>
                        <small
                          style={{
                            display: "block",
                            opacity: 0.6,
                          }}
                        >
                          Skill Coverage
                        </small>

                        <strong>
                          {item.skill_match ?? 0}%
                        </strong>
                      </div>

                      <div>
                        <small
                          style={{
                            display: "block",
                            opacity: 0.6,
                          }}
                        >
                          Matched
                        </small>

                        <strong>
                          {item.matched_skills?.length || 0}
                        </strong>
                      </div>

                      <div>
                        <small
                          style={{
                            display: "block",
                            opacity: 0.6,
                          }}
                        >
                          Missing
                        </small>

                        <strong>
                          {item.missing_skills?.length || 0}
                        </strong>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleViewHistory(item)
                        }
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "inherit",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >

                        {isSelected ? (
                          <ChevronUp size={17} />
                        ) : (
                          <Eye size={17} />
                        )}

                        {isSelected
                          ? "Hide"
                          : "View Details"}

                      </button>

                    </div>

                  </div>

                  {/* History Details */}

                  {isSelected && (
                    <div
                      style={{
                        marginTop: "18px",
                        paddingTop: "18px",
                        borderTop:
                          "1px solid rgba(255,255,255,0.08)",
                      }}
                    >

                      {/* Matched */}

                      <div style={{ marginBottom: "18px" }}>

                        <h4
                          style={{
                            marginBottom: "10px",
                          }}
                        >
                          Matched Skills
                        </h4>

                        {item.matched_skills?.length > 0 ? (
                          <div className="skills-list">

                            {item.matched_skills.map(
                              (skill, index) => (
                                <span
                                  className="skill-tag"
                                  key={`${skill}-history-matched-${index}`}
                                >
                                  {skill}
                                </span>
                              )
                            )}

                          </div>
                        ) : (
                          <p className="empty-state">
                            No matched skills.
                          </p>
                        )}

                      </div>

                      {/* Missing */}

                      <div style={{ marginBottom: "18px" }}>

                        <h4
                          style={{
                            marginBottom: "10px",
                          }}
                        >
                          Missing Skills
                        </h4>

                        {item.missing_skills?.length > 0 ? (
                          <div className="skills-list">

                            {item.missing_skills.map(
                              (skill, index) => (
                                <span
                                  className="missing-skill-tag"
                                  key={`${skill}-history-missing-${index}`}
                                >
                                  {skill}
                                </span>
                              )
                            )}

                          </div>
                        ) : (
                          <p className="empty-state">
                            No missing skills.
                          </p>
                        )}

                      </div>

                      {/* Recommendations */}

                      {item.recommendations?.length > 0 && (
                        <div>

                          <h4
                            style={{
                              marginBottom: "10px",
                            }}
                          >
                            Recommendations
                          </h4>

                          <div className="recommendations-list">

                            {item.recommendations.map(
                              (recommendation, index) => (
                                <div
                                  className="analysis-item"
                                  key={index}
                                >

                                  <ArrowRight size={17} />

                                  <span>
                                    {recommendation}
                                  </span>

                                </div>
                              )
                            )}

                          </div>

                        </div>
                      )}

                    </div>
                  )}

                </div>
              );
            })}

          </div>
        )}

      </div>

    </div>
  );
}

export default SkillGap;