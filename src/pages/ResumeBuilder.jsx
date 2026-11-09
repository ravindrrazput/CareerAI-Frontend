import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { User, GraduationCap, Briefcase, Code, FileText, Plus, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { saveResumeBuilder, getResumeBuilder } from "../services/api";

const emptyEducation = () => ({ degree: "", university: "", year: "", cgpa: "" });
const emptyExperience = () => ({ role: "", company: "", duration: "", details: "" });
const emptyProject = () => ({ name: "", tech: "", link: "", details: "" });

function ResumeBuilder() {
  const resumeRef = useRef(null);
  const { user } = useAuth();

  const [isLoadingResume, setIsLoadingResume] = useState(true);
  const [isSavingResume, setIsSavingResume] = useState(false);
  const [printScale, setPrintScale] = useState(1);
  const [template, setTemplate] = useState(localStorage.getItem("careerai_resume_template") || "minimal");

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", location: "", linkedin: "", github: "",
    summary: "",
    education: [emptyEducation()],
    experience: [emptyExperience()],
    projects: [emptyProject()],
    skills: "", certifications: "", achievements: ""
  });

  useEffect(() => {
    const loadResume = async () => {
      if (!user?.id) { setIsLoadingResume(false); return; }
      try {
        const data = await getResumeBuilder(user.id);
        if (data?.success && data.resume) {
          const r = data.resume;
          setFormData({
            name: r.name || "", email: r.email || "", phone: r.phone || "", location: r.location || "",
            linkedin: r.linkedin || "", github: r.github || "", summary: r.summary || "",
            education: Array.isArray(r.education) && r.education.length ? r.education : [emptyEducation()],
            experience: Array.isArray(r.experience) && r.experience.length ? r.experience : [emptyExperience()],
            projects: Array.isArray(r.projects) && r.projects.length ? r.projects : [emptyProject()],
            skills: r.skills || "", certifications: r.certifications || "", achievements: r.achievements || ""
          });
          if (r.template) setTemplate(r.template);
        }
      } catch (error) {
        console.error("Resume loading error:", error);
      } finally {
        setIsLoadingResume(false);
      }
    };
    loadResume();
  }, [user?.id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const updateArrayItem = (key, index, event) => {
    const { name, value } = event.target;
    setFormData((p) => {
      const next = [...p[key]];
      next[index] = { ...next[index], [name]: value };
      return { ...p, [key]: next };
    });
  };

  const addItem = (key, factory) => setFormData((p) => ({ ...p, [key]: [...p[key], factory()] }));
  const removeItem = (key, index) => setFormData((p) => ({
    ...p,
    [key]: p[key].length === 1 ? p[key] : p[key].filter((_, i) => i !== index)
  }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user?.id) {
      alert("User session not found. Please login again.");
      return;
    }
    try {
      setIsSavingResume(true);
      const data = await saveResumeBuilder({ user_id: user.id, ...formData, template });
      if (!data?.success) {
        alert(data?.message || "Unable to save resume.");
        return;
      }
      localStorage.setItem("careerai_resume_builder", JSON.stringify(formData));
      localStorage.setItem("careerai_resume_template", template);
      alert("Resume saved successfully!");
    } catch (error) {
      console.error("Resume save error:", error);
      alert("Unable to connect to the backend. Make sure FastAPI is running.");
    } finally {
      setIsSavingResume(false);
    }
  };

  const handleTemplateChange = (value) => {
    setTemplate(value);
    localStorage.setItem("careerai_resume_template", value);
  };

  // PDF DOWNLOAD
  // Print only the resume into a clean document.
  // This keeps the PDF as real/selectable text instead of a canvas image.
  const handleDownloadPDF = () => {
    if (!resumeRef.current) return;

    const resume = resumeRef.current.querySelector(".resume-print-sheet");
    if (!resume) return;

    const printWindow = window.open("", "_blank", "width=900,height=1200");

    if (!printWindow) {
      alert("Please allow pop-ups to download your resume as a PDF.");
      return;
    }

    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .map((link) => `<link rel="stylesheet" href="${link.href}">`)
      .join("\n");

    const inlineStyles = Array.from(document.querySelectorAll("style"))
      .map((style) => style.textContent || "")
      .join("\n");

    printWindow.document.open();
    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${formData.name || "Resume"} - Resume</title>
          ${styles}
          <style>
            ${inlineStyles}

            @page {
              size: A4 portrait;
              margin: 0;
            }

            html, body {
              margin: 0 !important;
              padding: 0 !important;
              width: 210mm !important;
              min-width: 210mm !important;
              background: #ffffff !important;
              overflow: visible !important;
            }

            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            .resume-print-sheet {
              width: 210mm !important;
              height: 297mm !important;
              min-height: 297mm !important;
              max-height: 297mm !important;
              margin: 0 !important;
              box-sizing: border-box !important;
              overflow: hidden !important;
              box-shadow: none !important;
              border: none !important;
              /* Use browser zoom for one-page fitting, not CSS transforms. */
              transform: none !important;
              zoom: var(--resume-scale, 1) !important;
              transform-origin: top left !important;
            }

            /* Do not rasterize the resume with html2canvas/html2pdf. */
            .resume-print-sheet,
            .resume-print-sheet * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            @media print {
              html, body {
                width: 210mm !important;
                height: 297mm !important;
                overflow: hidden !important;
              }
            }
          </style>
        </head>
        <body>
          ${resume.outerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();

    const print = () => {
      printWindow.focus();
      printWindow.print();

      // Close after the browser finishes/cancels the print dialog.
      setTimeout(() => {
        try {
          printWindow.close();
        } catch (_) {}
      }, 1000);
    };

    if (printWindow.document.fonts?.ready) {
      printWindow.document.fonts.ready.then(() => setTimeout(print, 250));
    } else {
      setTimeout(print, 500);
    }
  };

  const renderBulletPoints = (text) => {
    if (!text) return null;
    return text.split(/\r?\n/).map((item) => item.trim()).filter(Boolean).map((item, index) => (
      <li key={index}>{item.replace(/^[-•*]\s*/, "")}</li>
    ));
  };

  const skillList = formData.skills.split(",").map((s) => s.trim()).filter(Boolean);
  const hasEducation = formData.education.some((x) => x.degree || x.university || x.year || x.cgpa);
  const hasExperience = formData.experience.some((x) => x.role || x.company || x.duration || x.details);
  const hasProjects = formData.projects.some((x) => x.name || x.tech || x.link || x.details);

  // Keep the generated resume on exactly one A4 page without converting it to an image.
  useLayoutEffect(() => {
    const el = resumeRef.current?.querySelector(".resume-print-sheet");
    if (!el) return;
    const fit = () => {
      el.style.setProperty("--resume-scale", "1");
      const available = el.clientHeight || 1122;
      const content = el.scrollHeight || available;
      const scale = Math.min(1, Math.max(0.72, (available - 4) / content));
      setPrintScale(Number(scale.toFixed(3)));
    };
    fit();
    const id = requestAnimationFrame(fit);
    return () => cancelAnimationFrame(id);
  }, [formData, template]);

  if (isLoadingResume) {
    return (
      <div className="dashboard-page"><div className="welcome-section">
        <p className="eyebrow">RESUME CREATOR</p><h1>Build Your Resume</h1><p>Loading your saved resume...</p>
      </div></div>
    );
  }

  return (
    <div className="dashboard-page resume-builder-page">
      <div className="welcome-section no-print">
        <p className="eyebrow">RESUME CREATOR</p>
        <h1>Build Your Resume</h1>
        <p>Create a professional one-page resume.</p>
      </div>

      <section className="template-selector-card no-print">
        <div className="analysis-title"><FileText size={20} /><h3>Resume Layout</h3></div>
        <p className="template-description">Choose your resume style.</p>
        <div className="template-options">
          <button type="button" className={`template-option ${template === "minimal" ? "selected" : ""}`} onClick={() => handleTemplateChange("minimal")}>
            <div className="template-mini minimal-mini"><div className="mini-title"/><div className="mini-line"/><div className="mini-line short"/><div className="mini-section"/><div className="mini-line"/></div>
            <strong>Minimal</strong><span>Simple and clean</span>
          </button>
          <button type="button" className={`template-option ${template === "classic" ? "selected" : ""}`} onClick={() => handleTemplateChange("classic")}>
            <div className="template-mini classic-mini"><div className="mini-title centered"/><div className="mini-line centered"/><div className="mini-section centered"/><div className="mini-line"/></div>
            <strong>Classic</strong><span>Traditional professional</span>
          </button>
          <button type="button" className={`template-option ${template === "modern" ? "selected" : ""}`} onClick={() => handleTemplateChange("modern")}>
            <div className="template-mini modern-mini"><div className="mini-title"/><div className="mini-line"/><div className="mini-section"/><div className="mini-line short"/></div>
            <strong>Modern</strong><span>Clean and professional</span>
          </button>
        </div>
      </section>

      <form className="analysis-card no-print" onSubmit={handleSubmit}>
        <div className="analysis-title"><User size={20}/><h3>Personal Information</h3></div>
        <div className="analysis-grid">
          {[
            ["name", "Full Name", "text", "Enter your full name"],
            ["email", "Email", "email", "Enter your email"],
            ["phone", "Phone", "tel", "Enter your phone number"],
            ["location", "Location", "text", "City, State"],
            ["linkedin", "LinkedIn", "text", "linkedin.com/in/username"],
            ["github", "GitHub", "text", "github.com/username"]
          ].map(([name, label, type, placeholder]) => (
            <div className="form-group" key={name}><label>{label}</label><input type={type} name={name} value={formData[name]} onChange={handleChange} placeholder={placeholder} required={name === "name" || name === "email"}/></div>
          ))}
        </div>

        <div className="analysis-title"><FileText size={20}/><h3>Professional Summary</h3></div>
        <div className="form-group"><textarea name="summary" value={formData.summary} onChange={handleChange} placeholder="Write a short professional summary..." rows={4}/></div>

        <div className="section-header-row"><div className="analysis-title"><GraduationCap size={20}/><h3>Education</h3></div><button type="button" className="secondary-action-btn" onClick={() => addItem("education", emptyEducation)}><Plus size={16}/> Add Education</button></div>
        {formData.education.map((education, index) => (
          <div className="repeatable-card" key={index}>
            <div className="repeatable-card-header"><strong>Education {index + 1}</strong>{formData.education.length > 1 && <button type="button" className="remove-entry-btn" onClick={() => removeItem("education", index)}><Trash2 size={16}/> Remove</button>}</div>
            <div className="analysis-grid">
              <div className="form-group"><label>Degree</label><input name="degree" value={education.degree} onChange={(e) => updateArrayItem("education", index, e)} placeholder="B.Tech in Computer Science"/></div>
              <div className="form-group"><label>University / College</label><input name="university" value={education.university} onChange={(e) => updateArrayItem("education", index, e)} placeholder="Galgotias University"/></div>
              <div className="form-group"><label>Year</label><input name="year" value={education.year} onChange={(e) => updateArrayItem("education", index, e)} placeholder="2028"/></div>
              <div className="form-group"><label>CGPA / Percentage</label><input name="cgpa" value={education.cgpa} onChange={(e) => updateArrayItem("education", index, e)} placeholder="8.2 CGPA"/></div>
            </div>
          </div>
        ))}

        <div className="section-header-row"><div className="analysis-title"><Briefcase size={20}/><h3>Experience</h3></div><button type="button" className="secondary-action-btn" onClick={() => addItem("experience", emptyExperience)}><Plus size={16}/> Add Experience</button></div>
        {formData.experience.map((experience, index) => (
          <div className="repeatable-card" key={index}>
            <div className="repeatable-card-header"><strong>Experience {index + 1}</strong>{formData.experience.length > 1 && <button type="button" className="remove-entry-btn" onClick={() => removeItem("experience", index)}><Trash2 size={16}/> Remove</button>}</div>
            <div className="analysis-grid">
              <div className="form-group"><label>Job Role</label><input name="role" value={experience.role} onChange={(e) => updateArrayItem("experience", index, e)} placeholder="Software Developer Intern"/></div>
              <div className="form-group"><label>Company</label><input name="company" value={experience.company} onChange={(e) => updateArrayItem("experience", index, e)} placeholder="Company Name"/></div>
              <div className="form-group"><label>Duration</label><input name="duration" value={experience.duration} onChange={(e) => updateArrayItem("experience", index, e)} placeholder="June 2026 - August 2026"/></div>
            </div>
            <div className="form-group"><label>Responsibilities & Achievements</label><textarea name="details" value={experience.details} onChange={(e) => updateArrayItem("experience", index, e)} placeholder={'Write one point per line:\nDeveloped responsive web applications\nBuilt reusable React components\nImproved application performance'} rows={5}/></div>
          </div>
        ))}

        <div className="section-header-row"><div className="analysis-title"><Code size={20}/><h3>Projects</h3></div><button type="button" className="secondary-action-btn" onClick={() => addItem("projects", emptyProject)}><Plus size={16}/> Add Project</button></div>
        {formData.projects.map((project, index) => (
          <div className="repeatable-card" key={index}>
            <div className="repeatable-card-header"><strong>Project {index + 1}</strong>{formData.projects.length > 1 && <button type="button" className="remove-entry-btn" onClick={() => removeItem("projects", index)}><Trash2 size={16}/> Remove</button>}</div>
            <div className="analysis-grid">
              <div className="form-group"><label>Project Name</label><input name="name" value={project.name} onChange={(e) => updateArrayItem("projects", index, e)} placeholder="CareerAI Resume Analyzer"/></div>
              <div className="form-group"><label>Technologies</label><input name="tech" value={project.tech} onChange={(e) => updateArrayItem("projects", index, e)} placeholder="React, FastAPI, Python"/></div>
              <div className="form-group"><label>Project Link</label><input name="link" value={project.link} onChange={(e) => updateArrayItem("projects", index, e)} placeholder="github.com/username/project"/></div>
            </div>
            <div className="form-group"><label>Project Details</label><textarea name="details" value={project.details} onChange={(e) => updateArrayItem("projects", index, e)} placeholder={'Write one point per line:\nBuilt an AI-powered resume analysis platform\nImplemented ATS scoring\nCreated a responsive dashboard'} rows={5}/></div>
          </div>
        ))}

        <div className="analysis-title"><Code size={20}/><h3>Skills</h3></div>
        <div className="form-group"><textarea name="skills" value={formData.skills} onChange={handleChange} placeholder="Java, JavaScript, React.js, Node.js, MongoDB, Git" rows={3}/></div>
        <div className="analysis-title"><FileText size={20}/><h3>Certifications</h3></div>
        <div className="form-group"><textarea name="certifications" value={formData.certifications} onChange={handleChange} placeholder={'Java Programming Certification - Oracle\nWeb Development Certification - Coursera'} rows={3}/></div>
        <div className="analysis-title"><FileText size={20}/><h3>Achievements</h3></div>
        <div className="form-group"><textarea name="achievements" value={formData.achievements} onChange={handleChange} placeholder={'Solved 300+ DSA problems\nParticipated in Smart India Hackathon\nOrganized technical events at college'} rows={3}/></div>
        <button type="submit" className="analyze-btn" disabled={isSavingResume}><FileText size={18}/>{isSavingResume ? "Saving Resume..." : "Save Resume Information"}</button>
      </form>

      <section className="resume-preview-card" ref={resumeRef}>
        <div className="analysis-title no-print"><FileText size={20}/><h3>Resume Preview</h3></div>

        <div className={`resume-print-sheet resume-template-${template}`} style={{ "--resume-scale": printScale }}>
          {template === "modern" ? (
            <>
              <aside className="resume-sidebar">
                <div className="modern-sidebar-name">{formData.name || "Your Name"}</div>
                <div className="resume-side-section">
                  <h2>Contact</h2>
                  {formData.email && <div className="side-contact">{formData.email}</div>}
                  {formData.phone && <div className="side-contact">{formData.phone}</div>}
                  {formData.location && <div className="side-contact">{formData.location}</div>}
                  {formData.linkedin && <div className="side-contact">{formData.linkedin}</div>}
                  {formData.github && <div className="side-contact">{formData.github}</div>}
                </div>
                {skillList.length > 0 && <div className="resume-side-section"><h2>Skills</h2><div className="side-skills">{skillList.map((s) => <div className="side-skill" key={s}>{s}</div>)}</div></div>}
                {formData.certifications && <div className="resume-side-section"><h2>Certifications</h2><ul className="side-bullets">{renderBulletPoints(formData.certifications)}</ul></div>}
              </aside>
              <main className="resume-main">
                <header className="resume-main-header"><h1>{formData.name || "Your Name"}</h1><div className="resume-title-line">Computer Science Student</div></header>
                {formData.summary && <section className="resume-main-section"><h2>Professional Summary</h2><p className="resume-summary">{formData.summary}</p></section>}
                {hasExperience && <section className="resume-main-section"><h2>Experience</h2>{formData.experience.map((x,i) => (x.role||x.company||x.details) && <div className="resume-entry" key={i}><div className="resume-entry-header"><strong>{x.role || x.company}</strong>{x.duration && <span>{x.duration}</span>}</div>{x.company && x.role && <div className="resume-entry-subtitle">{x.company}</div>}{x.details && <ul className="resume-bullets">{renderBulletPoints(x.details)}</ul>}</div>)}</section>}
                {hasProjects && <section className="resume-main-section"><h2>Projects</h2>{formData.projects.map((x,i) => (x.name||x.details) && <div className="resume-entry" key={i}><div className="resume-entry-header"><strong>{x.name}</strong>{x.link && <span className="project-link">{x.link}</span>}</div>{x.tech && <div className="project-tech">{x.tech}</div>}{x.details && <ul className="resume-bullets">{renderBulletPoints(x.details)}</ul>}</div>)}</section>}
                {hasEducation && <section className="resume-main-section"><h2>Education</h2>{formData.education.map((x,i) => (x.degree||x.university) && <div className="resume-entry" key={i}><div className="resume-entry-header"><strong>{x.degree || x.university}</strong>{x.year && <span>{x.year}</span>}</div>{x.degree && x.university && <div className="resume-entry-subtitle">{x.university}</div>}{x.cgpa && <div className="resume-entry-meta">CGPA: {x.cgpa}</div>}</div>)}</section>}
                {formData.achievements && <section className="resume-main-section"><h2>Achievements</h2><ul className="resume-bullets">{renderBulletPoints(formData.achievements)}</ul></section>}
              </main>
            </>
          ) : (
            <main className="resume-single-column">
              <header className="resume-header">
                <h1>{formData.name || "Your Name"}</h1>
                <div className="resume-contact">
                  {[formData.email, formData.phone, formData.location, formData.linkedin, formData.github].filter(Boolean).map((v,i) => <span key={i}>{v}</span>)}
                </div>
              </header>
              {formData.summary && <section className="resume-section"><h2>Professional Summary</h2><p>{formData.summary}</p></section>}
              {hasEducation && <section className="resume-section"><h2>Education</h2>{formData.education.map((x,i) => (x.degree||x.university) && <div className="resume-entry" key={i}><div className="resume-entry-header"><strong>{x.degree || x.university}</strong>{x.year && <span>{x.year}</span>}</div>{x.degree && x.university && <div className="resume-entry-subtitle">{x.university}</div>}{x.cgpa && <div className="resume-entry-meta">CGPA: {x.cgpa}</div>}</div>)}</section>}
              {hasExperience && <section className="resume-section"><h2>Experience</h2>{formData.experience.map((x,i) => (x.role||x.company||x.details) && <div className="resume-entry" key={i}><div className="resume-entry-header"><strong>{x.role || x.company}</strong>{x.duration && <span>{x.duration}</span>}</div>{x.company && x.role && <div className="resume-entry-subtitle">{x.company}</div>}{x.details && <ul className="resume-bullets">{renderBulletPoints(x.details)}</ul>}</div>)}</section>}
              {hasProjects && <section className="resume-section"><h2>Projects</h2>{formData.projects.map((x,i) => (x.name||x.details) && <div className="resume-entry" key={i}><div className="resume-entry-header"><strong>{x.name}</strong>{x.link && <span className="project-link">{x.link}</span>}</div>{x.tech && <div className="project-tech">{x.tech}</div>}{x.details && <ul className="resume-bullets">{renderBulletPoints(x.details)}</ul>}</div>)}</section>}
              {skillList.length > 0 && <section className="resume-section"><h2>Skills</h2><p className="resume-skills-line">{skillList.join(" • ")}</p></section>}
              {formData.certifications && <section className="resume-section"><h2>Certifications</h2><ul className="resume-bullets">{renderBulletPoints(formData.certifications)}</ul></section>}
              {formData.achievements && <section className="resume-section"><h2>Achievements</h2><ul className="resume-bullets">{renderBulletPoints(formData.achievements)}</ul></section>}
            </main>
          )}
        </div>

        <button type="button" className="analyze-btn no-print" onClick={handleDownloadPDF}><FileText size={18}/> Download Resume as PDF</button>
      </section>
    </div>
  );
}

export default ResumeBuilder;
