import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await loginUser(
        formData.email.trim(),
        formData.password
      );

      if (!response?.success) {
        setError(
          response?.message ||
            "Invalid email or password."
        );
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page carrerrix-auth-page">
      {/* Background decorations */}
      <div className="auth-background-shape auth-shape-one" />
      <div className="auth-background-shape auth-shape-two" />

      <div className="carrerix-register-wrapper">
        {/* =================================================
            LEFT BRAND PANEL
        ================================================== */}

        <div className="carrerix-register-brand">
          <button
            type="button"
            className="carrerix-auth-logo"
            onClick={() => navigate("/")}
          >
            <span className="carrerix-auth-logo-mark">
              C
            </span>

            <span className="carrerix-auth-logo-text">
              <strong>Carrerix AI</strong>
              <small>
                Career Intelligence Platform
              </small>
            </span>
          </button>

          <div className="carrerix-brand-content">
            <div className="carrerix-brand-badge">
              <Sparkles size={14} />
              AI-Powered Career Intelligence
            </div>

            <h1>
              Your career.
              <span> Your next move.</span>
            </h1>

            <p>
              Welcome back to Carrerix AI. Continue building,
              analyzing and improving your professional profile
              with intelligent career tools.
            </p>

            <div className="carrerix-benefits">
              <div>
                <CheckCircle2 size={18} />
                <span>
                  Analyze and improve your resume
                </span>
              </div>

              <div>
                <CheckCircle2 size={18} />
                <span>
                  Check ATS compatibility
                </span>
              </div>

              <div>
                <CheckCircle2 size={18} />
                <span>
                  Match your profile with jobs
                </span>
              </div>

              <div>
                <CheckCircle2 size={18} />
                <span>
                  Track your career progress
                </span>
              </div>
            </div>
          </div>

          <div className="carrerix-brand-footer">
            Craft Your Resume. Elevate Your Career.
          </div>
        </div>

        {/* =================================================
            LOGIN FORM
        ================================================== */}

        <div className="carrerix-register-form-panel">
          <div className="carrerix-register-form-container">
            {/* Mobile logo */}
            <div className="carrerix-mobile-logo">
              <button
                type="button"
                className="carrerix-auth-logo"
                onClick={() => navigate("/")}
              >
                <span className="carrerix-auth-logo-mark">
                  C
                </span>

                <span className="carrerix-auth-logo-text">
                  <strong>Carrerix AI</strong>
                  <small>
                    Career Intelligence Platform
                  </small>
                </span>
              </button>
            </div>

            {/* Heading */}
            <div className="carrerix-form-heading">
              <span className="carrerix-form-eyebrow">
                WELCOME BACK
              </span>

              <h2>Welcome back</h2>

              <p>
                Login to continue your career journey.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="carrerix-auth-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="carrerix-form-group">
                <label htmlFor="login-email">
                  Email Address
                </label>

                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div className="carrerix-form-group">
                <div className="carrerix-password-label-row">
                  <label htmlFor="login-password">
                    Password
                  </label>
                </div>

                <div className="carrerix-password-wrapper">
                  <input
                    id="login-password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="carrerix-password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Login */}
              <button
                type="submit"
                className="carrerix-register-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="carrerix-button-spinner" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Login to Carrerix AI
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Register */}
            <div className="carrerix-login-divider">
              <span>
                Don't have an account?
              </span>

              <Link to="/register">
                Create Account
              </Link>
            </div>

            <p className="carrerix-security-note">
              Your personalized career tools and progress are
              available after you sign in.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;