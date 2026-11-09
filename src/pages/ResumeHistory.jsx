import { useEffect, useState } from "react";
import {
  FileText,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Eye,
  ArrowRight,
  Sparkles,
  Search,
} from "lucide-react";

import { getResumeHistory } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function ResumeHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadHistory = async () => {
    if (!user?.id) {
      setHistory([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const data = await getResumeHistory(user.id);

      if (!data.success) {
        setError(
          data.message || "Unable to load resume history."
        );
        return;
      }

      setHistory(data.history || []);
    } catch (err) {
      console.error("Resume history error:", err);

      setError(
        "Unable to connect to the backend. Make sure FastAPI is running."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [user?.id]);

  const filteredHistory = history.filter((item) =>
    item.filename
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const getScoreClass = (score) => {
    if (score >= 80) return "good";
    if (score >= 60) return "average";
    return "low";
  };

  return (
    <div className="dashboard-page carrerix-history-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="carrerix-history-header">
        <div>
          <div className="carrerix-page-eyebrow">
            <Sparkles size={14} />
            RESUME INTELLIGENCE
          </div>

          <h1>Your Resume History</h1>

          <p>
            Review your previous resume analyses, compare
            scores and continue improving your career profile.
          </p>
        </div>

        <button
          type="button"
          className="carrerix-history-refresh"
          onClick={loadHistory}
          disabled={isLoading}
        >
          <RefreshCw
            size={17}
            className={isLoading ? "spin" : ""}
          />

          {isLoading ? "Refreshing..." : "Refresh"}
        </button>
      </section>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      {!isLoading && !error && history.length > 0 && (
        <section className="carrerix-history-summary">

          <div className="carrerix-history-summary-card">
            <div className="carrerix-history-summary-icon">
              <FileText size={20} />
            </div>

            <div>
              <span>Total Analyses</span>
              <strong>{history.length}</strong>
            </div>
          </div>

          <div className="carrerix-history-summary-card">
            <div className="carrerix-history-summary-icon">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <span>Latest Score</span>
              <strong>
                {history[0]?.score ?? 0}%
              </strong>
            </div>
          </div>

          <div className="carrerix-history-summary-card">
            <div className="carrerix-history-summary-icon">
              <Sparkles size={20} />
            </div>

            <div>
              <span>Latest Skills</span>
              <strong>
                {history[0]?.skill_count ?? 0}
              </strong>
            </div>
          </div>

        </section>
      )}

      {/* =====================================================
          MAIN CARD
      ===================================================== */}

      <section className="carrerix-history-card">

        <div className="carrerix-history-card-header">

          <div>
            <h2>Previous Analyses</h2>

            <p>
              {history.length === 0
                ? "Your analyzed resumes will appear here."
                : `${history.length} analysis${
                    history.length !== 1 ? "es" : ""
                  } found`}
            </p>
          </div>

          {history.length > 0 && (
            <div className="carrerix-history-search">
              <Search size={17} />

              <input
                type="text"
                placeholder="Search resume..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />
            </div>
          )}

        </div>

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div className="carrerix-history-error">
            <AlertCircle size={19} />

            <div>
              <strong>Unable to load history</strong>

              <span>{error}</span>
            </div>

            <button
              type="button"
              onClick={loadHistory}
            >
              Try Again
            </button>
          </div>
        )}

        {/* ===================================================
            LOADING
        =================================================== */}

        {isLoading && (
          <div className="carrerix-history-loading">

            <div className="carrerix-history-loader">
              <RefreshCw
                size={25}
                className="spin"
              />
            </div>

            <h3>Loading your resume history</h3>

            <p>
              Fetching your previous resume analyses...
            </p>

          </div>
        )}

        {/* ===================================================
            EMPTY STATE
        =================================================== */}

        {!isLoading &&
          !error &&
          history.length === 0 && (
            <div className="carrerix-history-empty">

              <div className="carrerix-history-empty-icon">
                <FileText size={32} />
              </div>

              <div>
                <h3>No resume analyses yet</h3>

                <p>
                  Upload your resume and run your first
                  analysis to start building your career
                  profile.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/resume-analyzer")
                  }
                >
                  Analyze Your Resume
                  <ArrowRight size={17} />
                </button>
              </div>

            </div>
          )}

        {/* ===================================================
            SEARCH EMPTY
        =================================================== */}

        {!isLoading &&
          !error &&
          history.length > 0 &&
          filteredHistory.length === 0 && (
            <div className="carrerix-history-search-empty">

              <Search size={28} />

              <h3>No matching resumes</h3>

              <p>
                Try searching with a different filename.
              </p>

            </div>
          )}

        {/* ===================================================
            HISTORY LIST
        =================================================== */}

        {!isLoading &&
          !error &&
          filteredHistory.length > 0 && (
            <div className="carrerix-history-list">

              {filteredHistory.map((item, index) => {

                const scoreClass = getScoreClass(
                  item.score
                );

                return (
                  <article
                    className="carrerix-history-item"
                    key={item.id}
                  >

                    {/* LEFT */}

                    <div className="carrerix-history-file">

                      <div className="carrerix-history-file-icon">
                        <FileText size={21} />
                      </div>

                      <div className="carrerix-history-file-info">

                        <div className="carrerix-history-file-name">
                          {item.filename}
                        </div>

                        <div className="carrerix-history-file-meta">
                          <span>
                            {item.skill_count || 0} skills detected
                          </span>

                          <span className="carrerix-history-dot">
                            •
                          </span>

                          <span>
                            Analysis #{history.length - index}
                          </span>
                        </div>

                      </div>

                    </div>

                    {/* SCORE */}

                    <div className="carrerix-history-score">

                      <div
                        className={`carrerix-score-ring ${scoreClass}`}
                      >
                        <strong>
                          {item.score ?? 0}
                        </strong>

                        <span>/100</span>
                      </div>

                      <div className="carrerix-score-label">
                        Resume Score
                      </div>

                    </div>

                    {/* ACTION */}

                    <button
                      type="button"
                      className="carrerix-history-view-btn"
                      onClick={() =>
                        navigate(
                          `/resume-history/${item.id}`
                        )
                      }
                    >
                      <Eye size={17} />

                      <span>View Analysis</span>

                      <ArrowRight size={16} />
                    </button>

                  </article>
                );
              })}

            </div>
          )}

      </section>

      {/* =====================================================
          BOTTOM CTA
      ===================================================== */}

      {!isLoading && history.length > 0 && (
        <section className="carrerix-history-cta">

          <div className="carrerix-history-cta-icon">
            <Sparkles size={22} />
          </div>

          <div>
            <h3>Ready to improve your resume?</h3>

            <p>
              Run another analysis after making changes
              and track your progress here.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/resume-analyzer")
            }
          >
            Analyze New Resume
            <ArrowRight size={17} />
          </button>

        </section>
      )}

    </div>
  );
}

export default ResumeHistory;