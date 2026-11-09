import { useRef, useState } from "react";
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { analyzeResume } from "../services/api";
import { useAuth } from "../context/AuthContext";

function ResumeAnalyzer() {
  const { user } = useAuth();

  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF file only.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError("");
    setResult(null);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const droppedFile = event.dataTransfer.files?.[0];

    if (!droppedFile) {
      return;
    }

    if (droppedFile.type !== "application/pdf") {
      setError("Please upload a PDF file only.");
      setFile(null);
      return;
    }

    setFile(droppedFile);
    setError("");
    setResult(null);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const removeFile = () => {
    setFile(null);
    setResult(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload your resume first.");
      return;
    }

    if (!user?.id) {
      setError("User session not found. Please login again.");
      return;
    }

    try {
      setIsAnalyzing(true);
      setError("");
      setResult(null);

      // IMPORTANT:
      // Send logged-in user's ID with the resume
      const data = await analyzeResume(file, user.id);

      if (!data.success) {
        setError(data.message || "Resume analysis failed.");
        return;
      }

      setResult({
        filename: data.filename,
        score: data.score,
        skills: data.skill_count,
        detectedSkills: data.skills,
        sections: data.sections,
        contact: data.contact,
        strengths: data.strengths,
        improvements: data.improvements,
        text: data.text,
      });
    } catch (err) {
      console.error("Resume analysis error:", err);

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Something went wrong while analyzing your resume."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Resume Analyzer</h1>
          <p>
            Upload your resume and get an AI-powered analysis of your
            skills, sections, strengths, and areas for improvement.
          </p>
        </div>
      </div>

      <div className="resume-analyzer-container">
        {!result && (
          <div
            className="upload-card"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="upload-icon">
              <Upload size={32} />
            </div>

            <h2>Upload Your Resume</h2>

            <p>
              Drag & drop your PDF resume here or choose a file
              from your computer.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <button
              type="button"
              className="primary-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={18} />
              Choose Resume
            </button>

            <span className="upload-hint">
              PDF files only
            </span>
          </div>
        )}

        {file && !result && (
          <div className="selected-file-card">
            <div className="selected-file-info">
              <div className="file-icon">
                <FileText size={24} />
              </div>

              <div>
                <strong>{file.name}</strong>
                <span>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>

            <button
              type="button"
              className="remove-file-btn"
              onClick={removeFile}
              disabled={isAnalyzing}
            >
              <X size={18} />
            </button>
          </div>
        )}

        {error && (
          <div className="error-message">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {file && !result && (
          <button
            type="button"
            className="analyze-btn"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={18} className="spin" />
                Analyzing Resume...
              </>
            ) : (
              <>
                <CheckCircle size={18} />
                Analyze Resume
              </>
            )}
          </button>
        )}

        {result && (
          <div className="analysis-result">
            <div className="result-header">
              <div>
                <span className="result-label">
                  Analysis Complete
                </span>

                <h2>{result.filename}</h2>
              </div>

              <div className="score-card">
                <span>Resume Score</span>
                <strong>{result.score}</strong>
                <small>/ 100</small>
              </div>
            </div>

            <div className="result-grid">
              <div className="result-card">
                <h3>Detected Skills</h3>

                {result.detectedSkills?.length > 0 ? (
                  <div className="skills-list">
                    {result.detectedSkills.map(
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
                  <p>No skills detected.</p>
                )}
              </div>

              <div className="result-card">
                <h3>Resume Sections</h3>

                {result.sections &&
                Object.keys(result.sections).length > 0 ? (
                  <div className="sections-list">
                    {Object.entries(result.sections).map(
                      ([section, value]) => (
                        <div
                          className="section-item"
                          key={section}
                        >
                          <span>{section}</span>

                          <strong>
                            {typeof value === "boolean"
                              ? value
                                ? "Found"
                                : "Missing"
                              : value}
                          </strong>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p>No section information available.</p>
                )}
              </div>

              <div className="result-card">
                <h3>Contact Information</h3>

                {result.contact &&
                Object.keys(result.contact).length > 0 ? (
                  <div className="contact-list">
                    {Object.entries(result.contact).map(
                      ([key, value]) => (
                        <div
                          className="contact-item"
                          key={key}
                        >
                          <span>{key}</span>
                          <strong>
                            {value || "Not detected"}
                          </strong>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p>
                    Contact information could not be detected.
                  </p>
                )}
              </div>

              <div className="result-card">
                <h3>Strengths</h3>

                {result.strengths?.length > 0 ? (
                  <ul className="result-list success-list">
                    {result.strengths.map(
                      (strength, index) => (
                        <li key={index}>{strength}</li>
                      )
                    )}
                  </ul>
                ) : (
                  <p>No strengths identified.</p>
                )}
              </div>

              <div className="result-card">
                <h3>Areas for Improvement</h3>

                {result.improvements?.length > 0 ? (
                  <ul className="result-list improvement-list">
                    {result.improvements.map(
                      (improvement, index) => (
                        <li key={index}>{improvement}</li>
                      )
                    )}
                  </ul>
                ) : (
                  <p>No improvements identified.</p>
                )}
              </div>

              <div className="result-card full-width">
                <h3>Extracted Resume Text</h3>

                <div className="resume-text">
                  {result.text || "No text extracted."}
                </div>
              </div>
            </div>

            <div className="result-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setFile(null);
                  setResult(null);
                  setError("");

                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
              >
                Analyze Another Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeAnalyzer;