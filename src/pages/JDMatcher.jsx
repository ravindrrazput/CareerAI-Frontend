import { useEffect, useRef, useState } from "react";

import {
  Upload,
  FileText,
  X,
  Search,
  CheckCircle,
  AlertCircle,
  Loader2,
  Briefcase,
  History,
  Eye,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import {
  analyzeResume,
  matchJob,
} from "../services/api";

import { useAuth } from "../context/AuthContext";


function ATSChecker() {

  const { user } = useAuth();

  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");

  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // =====================================================
  // JD MATCH HISTORY
  // =====================================================

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);


  // =====================================================
  // LOAD JD MATCH HISTORY
  // =====================================================

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

      const data = await response.json();

      if (!data.success) {
        setHistoryError(
          data.message ||
            "Unable to load JD match history."
        );

        return;
      }

      setHistory(data.history || []);

    } catch (err) {

      console.error(
        "JD history error:",
        err
      );

      setHistoryError(
        "Unable to connect to the backend."
      );

    } finally {

      setHistoryLoading(false);

    }
  };


  // Load history whenever user is available
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

    if (
      selectedFile.type !==
      "application/pdf"
    ) {

      setError(
        "Please upload a PDF file only."
      );

      return;
    }

    if (
      selectedFile.size >
      5 * 1024 * 1024
    ) {

      setError(
        "File size should be less than 5 MB."
      );

      return;
    }

    setFile(selectedFile);
  };


  const handleFileChange = (event) => {

    const selectedFile =
      event.target.files[0];

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

    const droppedFile =
      event.dataTransfer.files[0];

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
  // MATCH JOB
  // =====================================================

  const handleMatchJob = async () => {

    setError("");

    setResult(null);

    if (!file) {

      setError(
        "Please upload your resume first."
      );

      return;
    }

    if (!jobDescription.trim()) {

      setError(
        "Please paste the job description."
      );

      return;
    }

    if (!user?.id) {

      setError(
        "User session not found. Please login again."
      );

      return;
    }

    try {

      setIsAnalyzing(true);


      // -----------------------------------------------
      // STEP 1: Extract resume text
      // -----------------------------------------------

      const resumeData =
        await analyzeResume(
          file,
          user.id
        );


      if (!resumeData.success) {

        setError(
          resumeData.message ||
            "Unable to analyze the resume."
        );

        return;
      }


      // -----------------------------------------------
      // STEP 2: Match resume with job description
      // -----------------------------------------------

      const matchData =
        await matchJob(
          resumeData.text,
          jobDescription,
          user.id
        );


      if (!matchData.success) {

        setError(
          matchData.message ||
            "Unable to match the job description."
        );

        return;
      }


      // -----------------------------------------------
      // STEP 3: Store result
      // -----------------------------------------------

      setResult(matchData);

      localStorage.setItem(
        "careerai_job_match",
        JSON.stringify(matchData)
      );


      // -----------------------------------------------
      // STEP 4: Refresh history
      // -----------------------------------------------

      await loadHistory();

    } catch (err) {

      console.error(err);

      setError(
        "Unable to connect to the backend. Make sure FastAPI is running."
      );

    } finally {

      setIsAnalyzing(false);

    }
  };


  // =====================================================
  // VIEW HISTORY DETAILS
  // =====================================================

  const handleViewHistory = (item) => {

    if (
      selectedHistoryId === item.id
    ) {

      setSelectedHistoryId(null);

      return;
    }

    setSelectedHistoryId(item.id);

    setResult(item);

    if (item.job_description) {

      setJobDescription(
        item.job_description
      );

    }

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {

    if (!date) {

      return "Recent match";
    }

    try {

      return new Date(date).toLocaleString(
        "en-IN",
        {
          dateStyle: "medium",
          timeStyle: "short",
        }
      );

    } catch {

      return "Recent match";

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
          JOB MATCHER
        </p>

        <h1>
          Match Your Resume With a Job
        </h1>

        <p>
          Compare your resume with a job
          description and discover your
          match score, missing skills,
          and improvement areas.
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
            isDragging
              ? "dragging"
              : ""
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
                  {
                    (
                      file.size /
                      1024 /
                      1024
                    ).toFixed(2)
                  } MB
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
          JOB DESCRIPTION
      ================================================= */}

      <div className="analysis-card">

        <div className="analysis-title">

          <Briefcase size={20} />

          <h3>
            Job Description
          </h3>

        </div>


        <p
          style={{
            color: "#9ca3af",
            marginBottom: "14px",
          }}
        >
          Paste the job description you want
          to apply for.
        </p>


        <textarea
          className="job-description-input"
          value={jobDescription}
          onChange={(event) =>
            setJobDescription(
              event.target.value
            )
          }
          placeholder="Paste the complete job description here..."
          rows={12}
        />


        <div
          style={{
            marginTop: "8px",
            color: "#6b7280",
            fontSize: "13px",
            textAlign: "right",
          }}
        >

          {jobDescription.length}
          {" "}
          characters

        </div>

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
          MATCH BUTTON
      ================================================= */}

      <button
        className="analyze-btn"
        onClick={handleMatchJob}
        disabled={
          !file ||
          !jobDescription.trim() ||
          isAnalyzing
        }
      >

        {isAnalyzing ? (

          <>

            <Loader2
              className="spin"
              size={18}
            />

            Matching Resume...

          </>

        ) : (

          <>

            <Search size={18} />

            Match Resume With Job

          </>

        )}

      </button>


      {/* =================================================
          CURRENT RESULT
      ================================================= */}

      {result && (

        <div className="analysis-results">

          {/* ---------------------------------------------
              RESULT HEADER
          --------------------------------------------- */}

          <div className="results-header">

            <div>

              <p className="eyebrow">
                MATCH ANALYSIS COMPLETE
              </p>

              <h2>
                Job Match Analysis
              </h2>

              <p>
                {file?.name ||
                  "Saved JD Match"}
              </p>

            </div>


            <div className="score-box">

              <span>
                Job Match Score
              </span>

              <strong>
                {result.match_score}%
              </strong>

            </div>

          </div>


          {/* ---------------------------------------------
              SCORE CARDS
          --------------------------------------------- */}

          <div className="stats-grid">

            <div className="stat-card">

              <div className="stat-icon">

                <CheckCircle size={22} />

              </div>

              <div>

                <span>
                  Overall Match
                </span>

                <strong>
                  {result.match_score}%
                </strong>

              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon">

                <CheckCircle size={22} />

              </div>

              <div>

                <span>
                  Skill Match
                </span>

                <strong>
                  {result.skill_match}%
                </strong>

              </div>

            </div>


            <div className="stat-card">

              <div className="stat-icon">

                <FileText size={22} />

              </div>

              <div>

                <span>
                  Keyword Match
                </span>

                <strong>
                  {result.keyword_match}%
                </strong>

              </div>

            </div>

          </div>


          {/* ---------------------------------------------
              MATCHED SKILLS
          --------------------------------------------- */}

          <div className="analysis-card">

            <div className="analysis-title">

              <CheckCircle size={20} />

              <h3>
                Matched Skills
              </h3>

            </div>


            <div className="skills-list">

              {result.matched_skills?.length > 0 ? (

                result.matched_skills.map(
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
                  No matching skills found.
                </p>

              )}

            </div>

          </div>


          {/* ---------------------------------------------
              MISSING SKILLS
          --------------------------------------------- */}

          <div className="analysis-card">

            <div className="analysis-title">

              <AlertCircle size={20} />

              <h3>
                Missing Skills
              </h3>

            </div>


            <div className="skills-list">

              {result.missing_skills?.length > 0 ? (

                result.missing_skills.map(
                  (skill, index) => (

                    <span
                      className="missing-skill-tag"
                      key={index}
                    >
                      {skill}
                    </span>

                  )
                )

              ) : (

                <p>
                  No major missing skills detected.
                </p>

              )}

            </div>

          </div>


          {/* ---------------------------------------------
              RECOMMENDATIONS
          --------------------------------------------- */}

          <div className="analysis-card">

            <div className="analysis-title">

              <Search size={20} />

              <h3>
                Recommendations
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

              <p>
                No recommendations available.
              </p>

            )}

          </div>

        </div>

      )}


      {/* =================================================
          JD MATCH HISTORY
      ================================================= */}

      <div
        className="analysis-card"
        style={{
          marginTop: "30px",
        }}
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

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >

            <History size={20} />

            <h3>
              JD Match History
            </h3>

          </div>


          <button
            type="button"
            onClick={loadHistory}
            disabled={historyLoading}
            style={{
              border: "none",
              background: "transparent",
              cursor: historyLoading
                ? "not-allowed"
                : "pointer",
              color: "inherit",
              fontSize: "13px",
            }}
          >

            {historyLoading
              ? "Refreshing..."
              : "Refresh"}

          </button>

        </div>


        {/* HISTORY ERROR */}

        {historyError && (

          <div
            className="error-message"
            style={{
              marginTop: "16px",
            }}
          >

            <AlertCircle size={18} />

            <span>
              {historyError}
            </span>

          </div>

        )}


        {/* HISTORY LOADING */}

        {historyLoading && (

          <div
            style={{
              padding: "30px 0",
              textAlign: "center",
              color: "#9ca3af",
            }}
          >

            <Loader2
              className="spin"
              size={24}
            />

            <p>
              Loading your JD match history...
            </p>

          </div>

        )}


        {/* EMPTY HISTORY */}

        {!historyLoading &&
          !historyError &&
          history.length === 0 && (

            <div
              style={{
                padding: "35px 10px",
                textAlign: "center",
                color: "#9ca3af",
              }}
            >

              <History
                size={35}
                style={{
                  marginBottom: "10px",
                  opacity: 0.6,
                }}
              />

              <p>
                No JD match history found.
              </p>

              <span
                style={{
                  fontSize: "13px",
                }}
              >
                Your previous job matches
                will appear here.
              </span>

            </div>

          )}


        {/* HISTORY LIST */}

        {!historyLoading &&
          history.length > 0 && (

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                marginTop: "18px",
              }}
            >

              {history.map(
                (item, index) => {

                  const isSelected =
                    selectedHistoryId ===
                    item.id;

                  return (

                    <div
                      key={
                        item.id ||
                        index
                      }
                      style={{
                        border:
                          "1px solid rgba(255,255,255,0.08)",
                        borderRadius:
                          "14px",
                        padding:
                          "18px",
                        background:
                          "rgba(255,255,255,0.02)",
                      }}
                    >

                      {/* HISTORY TOP */}

                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "center",
                          gap: "20px",
                          flexWrap:
                            "wrap",
                        }}
                      >

                        <div>

                          <p
                            style={{
                              margin:
                                "0 0 5px",
                              fontSize:
                                "12px",
                              color:
                                "#9ca3af",
                            }}
                          >
                            JD MATCH #{history.length - index}
                          </p>

                          <strong
                            style={{
                              fontSize:
                                "16px",
                            }}
                          >
                            Job Match Analysis
                          </strong>

                          <p
                            style={{
                              margin:
                                "5px 0 0",
                              fontSize:
                                "12px",
                              color:
                                "#6b7280",
                            }}
                          >
                            {formatDate(
                              item.created_at
                            )}
                          </p>

                        </div>


                        {/* SCORE */}

                        <div
                          style={{
                            textAlign:
                              "center",
                            minWidth:
                              "90px",
                          }}
                        >

                          <span
                            style={{
                              display:
                                "block",
                              fontSize:
                                "12px",
                              color:
                                "#9ca3af",
                            }}
                          >
                            Match Score
                          </span>

                          <strong
                            style={{
                              fontSize:
                                "24px",
                            }}
                          >
                            {item.match_score}%
                          </strong>

                        </div>


                        {/* VIEW BUTTON */}

                        <button
                          type="button"
                          onClick={() =>
                            handleViewHistory(
                              item
                            )
                          }
                          style={{
                            display:
                              "flex",
                            alignItems:
                              "center",
                            gap:
                              "7px",
                            padding:
                              "9px 14px",
                            borderRadius:
                              "8px",
                            border:
                              "1px solid rgba(255,255,255,0.12)",
                            background:
                              "transparent",
                            color:
                              "inherit",
                            cursor:
                              "pointer",
                          }}
                        >

                          {isSelected ? (
                            <ChevronUp
                              size={16}
                            />
                          ) : (
                            <Eye
                              size={16}
                            />
                          )}

                          {isSelected
                            ? "Hide Details"
                            : "View Details"}

                        </button>

                      </div>


                      {/* MINI SCORE INFO */}

                      <div
                        style={{
                          display:
                            "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(130px, 1fr))",
                          gap:
                            "10px",
                          marginTop:
                            "16px",
                        }}
                      >

                        <div
                          style={{
                            padding:
                              "12px",
                            borderRadius:
                              "10px",
                            background:
                              "rgba(255,255,255,0.03)",
                          }}
                        >

                          <span
                            style={{
                              display:
                                "block",
                              fontSize:
                                "12px",
                              color:
                                "#9ca3af",
                            }}
                          >
                            Skill Match
                          </span>

                          <strong>
                            {item.skill_match}%
                          </strong>

                        </div>


                        <div
                          style={{
                            padding:
                              "12px",
                            borderRadius:
                              "10px",
                            background:
                              "rgba(255,255,255,0.03)",
                          }}
                        >

                          <span
                            style={{
                              display:
                                "block",
                              fontSize:
                                "12px",
                              color:
                                "#9ca3af",
                            }}
                          >
                            Keyword Match
                          </span>

                          <strong>
                            {item.keyword_match}%
                          </strong>

                        </div>


                        <div
                          style={{
                            padding:
                              "12px",
                            borderRadius:
                              "10px",
                            background:
                              "rgba(255,255,255,0.03)",
                          }}
                        >

                          <span
                            style={{
                              display:
                                "block",
                              fontSize:
                                "12px",
                              color:
                                "#9ca3af",
                            }}
                          >
                            Matched Skills
                          </span>

                          <strong>
                            {item.matched_skills?.length || 0}
                          </strong>

                        </div>


                        <div
                          style={{
                            padding:
                              "12px",
                            borderRadius:
                              "10px",
                            background:
                              "rgba(255,255,255,0.03)",
                          }}
                        >

                          <span
                            style={{
                              display:
                                "block",
                              fontSize:
                                "12px",
                              color:
                                "#9ca3af",
                            }}
                          >
                            Missing Skills
                          </span>

                          <strong>
                            {item.missing_skills?.length || 0}
                          </strong>

                        </div>

                      </div>


                      {/* EXPANDED DETAILS */}

                      {isSelected && (

                        <div
                          style={{
                            marginTop:
                              "18px",
                            paddingTop:
                              "18px",
                            borderTop:
                              "1px solid rgba(255,255,255,0.08)",
                          }}
                        >

                          {/* MATCHED SKILLS */}

                          <div
                            style={{
                              marginBottom:
                                "20px",
                            }}
                          >

                            <h4>
                              Matched Skills
                            </h4>

                            <div
                              className="skills-list"
                            >

                              {item.matched_skills?.length > 0 ? (

                                item.matched_skills.map(
                                  (
                                    skill,
                                    skillIndex
                                  ) => (

                                    <span
                                      className="skill-tag"
                                      key={
                                        skillIndex
                                      }
                                    >
                                      {skill}
                                    </span>

                                  )
                                )

                              ) : (

                                <p>
                                  No matching skills found.
                                </p>

                              )}

                            </div>

                          </div>


                          {/* MISSING SKILLS */}

                          <div
                            style={{
                              marginBottom:
                                "20px",
                            }}
                          >

                            <h4>
                              Missing Skills
                            </h4>

                            <div
                              className="skills-list"
                            >

                              {item.missing_skills?.length > 0 ? (

                                item.missing_skills.map(
                                  (
                                    skill,
                                    skillIndex
                                  ) => (

                                    <span
                                      className="missing-skill-tag"
                                      key={
                                        skillIndex
                                      }
                                    >
                                      {skill}
                                    </span>

                                  )
                                )

                              ) : (

                                <p>
                                  No major missing skills detected.
                                </p>

                              )}

                            </div>

                          </div>


                          {/* RECOMMENDATIONS */}

                          <div>

                            <h4>
                              Recommendations
                            </h4>

                            {item.recommendations?.length > 0 ? (

                              item.recommendations.map(
                                (
                                  recommendation,
                                  recommendationIndex
                                ) => (

                                  <div
                                    className="analysis-item"
                                    key={
                                      recommendationIndex
                                    }
                                  >

                                    <AlertCircle
                                      size={16}
                                    />

                                    <span>
                                      {recommendation}
                                    </span>

                                  </div>

                                )
                              )

                            ) : (

                              <p>
                                No recommendations available.
                              </p>

                            )}

                          </div>

                        </div>

                      )}

                    </div>

                  );

                }
              )}

            </div>

          )}

      </div>

    </div>

  );

}


export default ATSChecker;