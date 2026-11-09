import { useEffect, useState } from "react";
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { getResumeHistory } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

function ResumeAnalysisDetails() {
  const { user } = useAuth();
  const { analysisId } = useParams();
  const navigate = useNavigate();

  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadAnalysis = async () => {
      if (!user?.id) {
        setError("User information not found.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await getResumeHistory(user.id);

        if (!data.success) {
          setError(
            data.message ||
              "Unable to load resume analysis."
          );
          return;
        }

        const selectedAnalysis =
          (data.history || []).find(
            (item) => item.id === analysisId
          );

        if (!selectedAnalysis) {
          setError(
            "Resume analysis not found."
          );
          return;
        }

        setAnalysis(selectedAnalysis);

      } catch (err) {
        console.error(
          "Analysis details error:",
          err
        );

        setError(
          "Unable to connect to the backend."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalysis();
  }, [user?.id, analysisId]);


  if (isLoading) {
    return (
      <div className="dashboard-page">
        <div className="analyzer-card">
          <p>
            Loading resume analysis...
          </p>
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="dashboard-page">

        <div className="error-message">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>

        <button
          onClick={() =>
            navigate("/resume-history")
          }
        >
          Back to History
        </button>

      </div>
    );
  }


  return (
    <div className="dashboard-page">

      {/* HEADER */}

      <div className="welcome-section">

        <button
          type="button"
          onClick={() =>
            navigate("/resume-history")
          }
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            marginBottom: "20px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <ArrowLeft size={18} />
          Back to Resume History
        </button>


        <p className="eyebrow">
          SAVED ANALYSIS
        </p>

        <h1>
          Resume Analysis
        </h1>

        <p>
          {analysis.filename}
        </p>

      </div>


      {/* SCORE */}

      <div className="results-header">

        <div>
          <p className="eyebrow">
            ANALYSIS COMPLETE
          </p>

          <h2>
            {analysis.filename}
          </h2>
        </div>


        <div className="score-box">

          <span>
            Resume Score
          </span>

          <strong>
            {analysis.score}%
          </strong>

        </div>

      </div>


      {/* STATS */}

      <div className="stats-grid">

        <div className="stat-card">

          <div className="stat-icon">
            <CheckCircle size={22} />
          </div>

          <div>
            <span>
              Resume Score
            </span>

            <strong>
              {analysis.score}%
            </strong>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            <FileText size={22} />
          </div>

          <div>
            <span>
              Skills Detected
            </span>

            <strong>
              {analysis.skill_count}
            </strong>
          </div>

        </div>


        <div className="stat-card">

          <div className="stat-icon">
            <CheckCircle size={22} />
          </div>

          <div>
            <span>
              Contact Info
            </span>

            <strong>
              {
                [
                  analysis.contact?.email,
                  analysis.contact?.phone,
                  analysis.contact?.linkedin,
                  analysis.contact?.github,
                ].filter(Boolean).length
              }/4
            </strong>
          </div>

        </div>

      </div>


      {/* DETECTED SKILLS */}

      <div className="analysis-card">

        <div className="analysis-title">

          <CheckCircle size={20} />

          <h3>
            Detected Skills
          </h3>

        </div>


        <div className="skills-list">

          {analysis.skills?.length > 0 ? (

            analysis.skills.map(
              (skill, index) => (
                <span
                  className="skill-tag"
                  key={index}
                >
                  {skill}
                </span>
              )
            )

          ) : (

            <p>
              No technical skills detected.
            </p>

          )}

        </div>

      </div>


      {/* SECTIONS */}

      <div className="analysis-card">

        <div className="analysis-title">

          <FileText size={20} />

          <h3>
            Resume Sections
          </h3>

        </div>


        <div className="sections-list">

          {Object.entries(
            analysis.sections || {}
          ).map(
            ([section, found]) => (

              <div
                className="section-item"
                key={section}
              >

                {found ? (
                  <CheckCircle size={17} />
                ) : (
                  <AlertCircle size={17} />
                )}

                <span>
                  {section
                    .charAt(0)
                    .toUpperCase() +
                    section.slice(1)}
                </span>

                <strong>
                  {found
                    ? "Present"
                    : "Missing"}
                </strong>

              </div>

            )
          )}

        </div>

      </div>


      {/* STRENGTHS + IMPROVEMENTS */}

      <div className="analysis-grid">

        {/* STRENGTHS */}

        <div className="analysis-card">

          <div className="analysis-title">

            <CheckCircle size={20} />

            <h3>
              Strengths
            </h3>

          </div>


          {analysis.strengths?.map(
            (item, index) => (

              <div
                className="analysis-item"
                key={index}
              >

                <CheckCircle size={16} />

                <span>
                  {item}
                </span>

              </div>

            )
          )}

        </div>


        {/* IMPROVEMENTS */}

        <div className="analysis-card">

          <div className="analysis-title">

            <AlertCircle size={20} />

            <h3>
              Areas to Improve
            </h3>

          </div>


          {analysis.improvements?.map(
            (item, index) => (

              <div
                className="analysis-item"
                key={index}
              >

                <AlertCircle size={16} />

                <span>
                  {item}
                </span>

              </div>

            )
          )}

        </div>

      </div>


      {/* CONTACT */}

      <div className="analysis-card">

        <div className="analysis-title">

          <FileText size={20} />

          <h3>
            Contact Information
          </h3>

        </div>


        <div className="sections-list">

          {[
            ["Email", analysis.contact?.email],
            ["Phone", analysis.contact?.phone],
            ["LinkedIn", analysis.contact?.linkedin],
            ["GitHub", analysis.contact?.github],
          ].map(
            ([label, found]) => (

              <div
                className="section-item"
                key={label}
              >

                {found ? (
                  <CheckCircle size={17} />
                ) : (
                  <AlertCircle size={17} />
                )}

                <span>
                  {label}
                </span>

                <strong>
                  {found
                    ? "Found"
                    : "Missing"}
                </strong>

              </div>

            )
          )}

        </div>

      </div>


      {/* EXTRACTED TEXT */}

      <div className="analysis-card extracted-text-card">

        <div className="analysis-title">

          <FileText size={20} />

          <h3>
            Extracted Resume Text
          </h3>

        </div>


        <div className="resume-text">

          {analysis.text ||
            "No text found in this PDF."}

        </div>

      </div>

    </div>
  );
}

export default ResumeAnalysisDetails;