import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";

import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import ResumeHistory from "./pages/ResumeHistory";
import ResumeAnalysisDetails from "./pages/ResumeAnalysisDetails";
import JDMatcher from "./pages/JDMatcher";
import ATSChecker from "./pages/ATSChecker";
import ResumeBuilder from "./pages/ResumeBuilder";
import SkillGap from "./pages/SkillGap";
import Settings from "./pages/Settings";

function App() {
  return (
    <Routes>

      {/* PUBLIC LANDING PAGE */}

      <Route
        path="/"
        element={<LandingPage />}
      />

      {/* AUTHENTICATION */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* PROTECTED DASHBOARD ROUTES */}

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/resume-analyzer"
          element={<ResumeAnalyzer />}
        />

        <Route
          path="/resume-history"
          element={<ResumeHistory />}
        />

        <Route
          path="/resume-history/:analysisId"
          element={<ResumeAnalysisDetails />}
        />

        <Route
          path="/jd-matcher"
          element={<JDMatcher />}
        />

        <Route
          path="/ats-checker"
          element={<ATSChecker />}
        />

        <Route
          path="/resume-builder"
          element={<ResumeBuilder />}
        />

        <Route
          path="/skill-gap"
          element={<SkillGap />}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

      </Route>

    </Routes>
  );
}

export default App;