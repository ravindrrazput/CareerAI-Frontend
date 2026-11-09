import { useEffect, useRef, useState } from "react";
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Search,
  History,
  Eye,
  ChevronUp,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function ATSChecker() {
  const { user } = useAuth();

  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);

  // =====================================================
  // ATS HISTORY
  // =====================================================

  const loadHistory = async () => {
    if (!user?.id) return;

    try {
      setHistoryLoading(true);
      setHistoryError("");

      const response = await fetch(
        `http://127.0.0.1:8000/api/ats-history/${user.id}`
      );

      const data = await response.json();

      if (!data.success) {
        setHistoryError(data.message || "Unable to load ATS history.");
        return;
      }

      setHistory(data.history || []);
    } catch (err) {
      console.error("ATS history error:", err);
      setHistoryError("Unable to connect to the backend.");
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [user?.id]);

  // =====================================================
  // FILE HANDLING
  // =====================================================

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    setError("");
    setResult(null);

    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF file only.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size should be less than 5 MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    handleFile(selectedFile);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFile = event.dataTransfer.files[0];

    handleFile(droppedFile);
  };

  const removeFile = () => {
    setFile(null);
    setResult(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =====================================================
  // ATS CHECK
  // =====================================================

  const handleCheckATS = async () => {
    setError("");
    setResult(null);

    if (!file) {
      setError("Please upload your resume first.");
      return;
    }

    if (!user?.id) {
      setError("User session not found. Please login again.");
      return;
    }

    try {
      setIsChecking(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", user.id);

      const response = await fetch(
        "http://127.0.0.1:8000/api/check-ats",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!data.success) {
        setError(
          data.message || "Unable to check your resume."
        );
        return;
      }

      setResult(data);
       
      localStorage.setItem(
        "careerai_ats_analysis",
        JSON.stringify(data)
      );

      await loadHistory();

    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to the backend. Make sure FastAPI is running."
      );
    } finally {
      setIsChecking(false);
    }
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="dashboard-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="welcome-section">

        <p className="eyebrow">
          ATS OPTIMIZATION
        </p>

        <h1>
          Check Your Resume ATS Score
        </h1>

        <p>
          Analyze your resume for ATS compatibility,
          structure, keywords, skills, and important
          resume information.
        </p>

      </div>


      {/* =================================================
          RESUME UPLOAD
      ================================================= */}

      <div className="analyzer-card">

        <div className="analysis-title">

          <FileText size={20} />

          <h3>
            Upload Your Resume
          </h3>

        </div>


        <div
          className={`upload-area ${
            isDragging ? "dragging" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() =>
            fileInputRef.current?.click()
          }
        >

          <div className="upload-icon">
            <Upload size={28} />
          </div>

          <h3>
            Drag & Drop your resume here
          </h3>

          <p>
            or click to browse from your computer
          </p>

          <span>
            PDF only • Maximum 5 MB
          </span>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            hidden
          />

        </div>


        {/* Selected File */}

        {file && (
          <div className="selected-file">

            <div className="file-info">

              <div className="file-icon">
                <FileText size={22} />
              </div>

              <div>

                <strong>
                  {file.name}
                </strong>

                <span>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>

              </div>

            </div>


            <button
              className="remove-file"
              onClick={(event) => {
                event.stopPropagation();
                removeFile();
              }}
              title="Remove file"
            >
              <X size={18} />
            </button>

          </div>
        )}

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="error-message">

          <AlertCircle size={18} />

          <span>
            {error}
          </span>

        </div>
      )}


      {/* =================================================
          CHECK BUTTON
      ================================================= */}

      <button
        className="analyze-btn"
        onClick={handleCheckATS}
        disabled={!file || isChecking}
      >

        {isChecking ? (
          <>
            <Loader2
              className="spin"
              size={18}
            />

            Checking ATS Score...
          </>
        ) : (
          <>
            <Search size={18} />

            Check ATS Score
          </>
        )}

      </button>


      {/* =================================================
          RESULTS
      ================================================= */}

      {result && (
        <div className="analysis-results">

          {/* RESULT HEADER */}

          <div className="results-header">

            <div>

              <p className="eyebrow">
                ATS ANALYSIS COMPLETE
              </p>

              <h2>
                Resume ATS Analysis
              </h2>

              <p>
                {result.filename}
              </p>

            </div>


            <div className="score-box">

              <span>
                ATS Score
              </span>

              <strong>
                {result.ats_score}%
              </strong>

            </div>

          </div>


          {/* SCORE CARDS */}

          <div className="stats-grid">

            <div className="stat-card">

              <div className="stat-icon">
                <CheckCircle size={22} />
              </div>

              <div>

                <span>
                  ATS Score
                </span>

                <strong>
                  {result.ats_score}%
                </strong>

              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon">
                <FileText size={22} />
              </div>

              <div>

                <span>
                  Word Count
                </span>

                <strong>
                  {result.word_count}
                </strong>

              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon">
                <CheckCircle size={22} />
              </div>

              <div>

                <span>
                  Skills Detected
                </span>

                <strong>
                  {result.skill_count}
                </strong>

              </div>

            </div>

          </div>


          {/* STATUS */}

          <div className="analysis-card">

            <div className="analysis-title">

              <CheckCircle size={20} />

              <h3>
                ATS Status
              </h3>

            </div>

            <div className="analysis-item">

              <CheckCircle size={18} />

              <span>
                Your resume ATS status is{" "}
                <strong>{result.status}</strong>.
              </span>

            </div>

          </div>


          {/* SKILLS */}

          <div className="analysis-card">

            <div className="analysis-title">

              <CheckCircle size={20} />

              <h3>
                Detected Skills
              </h3>

            </div>

            <div className="skills-list">

              {result.skills?.length > 0 ? (

                result.skills.map(
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


          {/* RESUME STRUCTURE */}

          <div className="analysis-card">

            <div className="analysis-title">

              <FileText size={20} />

              <h3>
                Resume Structure
              </h3>

            </div>


            <div className="analysis-grid">

              <div className="analysis-item">

                <CheckCircle size={18} />

                <span>
                  Sections Detected:{" "}
                  <strong>
                    {result.section_count}
                  </strong>
                </span>

              </div>


              <div className="analysis-item">

                <CheckCircle size={18} />

                <span>
                  Contact Information:{" "}
                  <strong>
                    {result.contact_count}
                  </strong>
                </span>

              </div>

            </div>

          </div>


          {/* RECOMMENDATIONS */}

          <div className="analysis-card">

            <div className="analysis-title">

              <Search size={20} />

              <h3>
                ATS Recommendations
              </h3>

            </div>


            {result.recommendations?.length > 0 ? (

              result.recommendations.map(
                (recommendation, index) => (

                  <div
                    className="analysis-item"
                    key={index}
                  >

                    <AlertCircle size={16} />

                    <span>
                      {recommendation}
                    </span>

                  </div>

                )
              )

            ) : (

              <div className="analysis-item">

                <CheckCircle size={16} />

                <span>
                  Your resume looks well optimized
                  for ATS systems.
                </span>

              </div>

            )}

          </div>

        </div>
      )}

      {/* =================================================
          ATS HISTORY
      ================================================= */}

      <div
        className="analysis-card"
        style={{ marginTop: "30px" }}
      >
        <div
          className="analysis-title"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <History size={20} />
            <h3>ATS History</h3>
          </div>

          <button
            type="button"
            onClick={loadHistory}
            disabled={historyLoading}
            style={{
              border: "none",
              background: "transparent",
              cursor: historyLoading ? "not-allowed" : "pointer",
              color: "inherit",
              fontSize: "13px",
            }}
          >
            {historyLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {historyError && (
          <div className="error-message" style={{ marginTop: "16px" }}>
            <AlertCircle size={18} />
            <span>{historyError}</span>
          </div>
        )}

        {historyLoading && (
          <div style={{ padding: "30px 0", textAlign: "center", color: "#9ca3af" }}>
            <Loader2 className="spin" size={24} />
            <p>Loading your ATS history...</p>
          </div>
        )}

        {!historyLoading && !historyError && history.length === 0 && (
          <div style={{ padding: "35px 10px", textAlign: "center", color: "#9ca3af" }}>
            <History size={35} style={{ marginBottom: "10px", opacity: 0.6 }} />
            <p>No ATS history found.</p>
            <span style={{ fontSize: "13px" }}>Your previous ATS analyses will appear here.</span>
          </div>
        )}

        {!historyLoading && history.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "18px" }}>
            {history.map((item, index) => {
              const isSelected = selectedHistoryId === item.id;

              return (
                <div
                  key={item.id || index}
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "14px",
                    padding: "18px",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
                    <div>
                      <p style={{ margin: "0 0 5px", fontSize: "12px", color: "#9ca3af" }}>
                        ATS ANALYSIS #{history.length - index}
                      </p>
                      <strong style={{ fontSize: "16px" }}>{item.filename || "Resume Analysis"}</strong>
                      <p style={{ margin: "5px 0 0", fontSize: "12px", color: "#6b7280" }}>
                        {item.created_at ? new Date(item.created_at).toLocaleString("en-IN") : "Recent analysis"}
                      </p>
                    </div>

                    <div style={{ textAlign: "center", minWidth: "90px" }}>
                      <span style={{ display: "block", fontSize: "12px", color: "#9ca3af" }}>ATS Score</span>
                      <strong style={{ fontSize: "24px" }}>{item.ats_score}%</strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedHistoryId(isSelected ? null : item.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "7px",
                        padding: "9px 14px",
                        borderRadius: "8px",
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "transparent",
                        color: "inherit",
                        cursor: "pointer",
                      }}
                    >
                      {isSelected ? <ChevronUp size={16} /> : <Eye size={16} />}
                      {isSelected ? "Hide Details" : "View Details"}
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "10px", marginTop: "16px" }}>
                    <div style={{ padding: "12px", borderRadius: "10px", background: "rgba(255,255,255,0.03)" }}>
                      <span style={{ display: "block", fontSize: "12px", color: "#9ca3af" }}>Status</span>
                      <strong>{item.status || "-"}</strong>
                    </div>
                    <div style={{ padding: "12px", borderRadius: "10px", background: "rgba(255,255,255,0.03)" }}>
                      <span style={{ display: "block", fontSize: "12px", color: "#9ca3af" }}>Word Count</span>
                      <strong>{item.word_count}</strong>
                    </div>
                    <div style={{ padding: "12px", borderRadius: "10px", background: "rgba(255,255,255,0.03)" }}>
                      <span style={{ display: "block", fontSize: "12px", color: "#9ca3af" }}>Skills</span>
                      <strong>{item.skill_count}</strong>
                    </div>
                    <div style={{ padding: "12px", borderRadius: "10px", background: "rgba(255,255,255,0.03)" }}>
                      <span style={{ display: "block", fontSize: "12px", color: "#9ca3af" }}>Sections</span>
                      <strong>{item.section_count}</strong>
                    </div>
                  </div>

                  {isSelected && (
                    <div style={{ marginTop: "18px", paddingTop: "18px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                      <div style={{ marginBottom: "20px" }}>
                        <h4>Detected Skills</h4>
                        <div className="skills-list">
                          {item.skills?.length > 0 ? item.skills.map((skill, skillIndex) => (
                            <span className="skill-tag" key={skillIndex}>{skill}</span>
                          )) : <p>No technical skills detected.</p>}
                        </div>
                      </div>

                      <div>
                        <h4>ATS Recommendations</h4>
                        {item.recommendations?.length > 0 ? item.recommendations.map((recommendation, recommendationIndex) => (
                          <div className="analysis-item" key={recommendationIndex}>
                            <AlertCircle size={16} />
                            <span>{recommendation}</span>
                          </div>
                        )) : <p>No recommendations available.</p>}
                      </div>
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

export default ATSChecker;