import axios from "axios";

const API = axios.create({
baseURL: "https://careerai-backend-5hf4.onrender.com",
});


// =========================================================
// AUTH
// =========================================================

export const registerUser = async (
  name,
  email,
  password
) => {
  const response = await API.post(
    "/api/auth/register",
    {
      name,
      email,
      password,
    }
  );

  return response.data;
};


export const loginUser = async (
  email,
  password
) => {
  const response = await API.post(
    "/api/auth/login",
    {
      email,
      password,
    }
  );

  return response.data;
};


// =========================================================
// RESUME ANALYZER
// =========================================================

export const analyzeResume = async (
  file,
  userId
) => {

  const formData = new FormData();

  formData.append(
    "file",
    file
  );

  if (userId) {
    formData.append(
      "user_id",
      userId
    );
  }

  const response = await API.post(
    "/api/analyze-resume",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


// =========================================================
// RESUME HISTORY
// =========================================================

export const getResumeHistory = async (
  userId
) => {

  const response = await API.get(
    `/api/resume-history/${userId}`
  );

  return response.data;
};


// =========================================================
// JD MATCHER
// =========================================================

export const matchJob = async (
  resumeText,
  jobDescription,
  userId
) => {

  const response = await API.post(
    "/api/match-job",
    {
      resume_text: resumeText,
      job_description: jobDescription,
      user_id: userId,
    }
  );

  return response.data;
};


// =========================================================
// ATS CHECKER
// =========================================================

export const checkATS = async (
  file
) => {

  const formData = new FormData();

  formData.append(
    "file",
    file
  );

  const response = await API.post(
    "/api/check-ats",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// ============================================================
// RESUME BUILDER
// ============================================================

export const saveResumeBuilder = async (resumeData) => {
  const response = await API.post(
    "/api/resume-builder/save",
    resumeData
  );

  return response.data;
};

export const getResumeBuilder = async (userId) => {
  const response = await API.get(
    `/api/resume-builder/${userId}`
  );

  return response.data;
};

export const deleteResumeBuilder = async (userId) => {
  const response = await API.delete(
    `/api/resume-builder/${userId}`
  );

  return response.data;
};

// =========================================================
// SETTINGS
// =========================================================

export const saveSettings = async (settingsData) => {
  const response = await API.post(
    "/api/settings/save",
    settingsData
  );

  return response.data;
};

export const getSettings = async (userId) => {
  const response = await API.get(
    `/api/settings/${userId}`
  );

  return response.data;
};

export const deleteSettings = async (userId) => {
  const response = await API.delete(
    `/api/settings/${userId}`
  );

  return response.data;
};