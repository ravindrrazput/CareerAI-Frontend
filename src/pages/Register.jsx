import { useState } from "react";
import { ArrowRight, CheckCircle2, Eye, EyeOff, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { loginUser: setLoggedInUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
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

    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!formData.password) {
      setError("Please create a password.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await registerUser(
        formData.name.trim(),
        formData.email.trim(),
        formData.password
      );

      if (!response?.success) {
        setError(response?.message || "Unable to create your account.");
        return;
      }

      /*
        Register ke baad agar backend user data return karta hai,
        user ko directly login state mein set karne ki koshish.
      */
      if (response.user) {
        setLoggedInUser(response.user);
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Something went wrong. Please try again."
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
        {/* =========================
            LEFT BRAND PANEL
        ========================== */}
        <div className="carrerix-register-brand">
          <button
            type="button"
            className="carrerix-auth-logo"
            onClick={() => navigate("/")}
          >
            <span className="carrerix-auth-logo-mark">C</span>

            <span className="carrerix-auth-logo-text">
              <strong>Carrerix AI</strong>
              <small>Career Intelligence Platform</small>
            </span>
          </button>

          <div className="carrerix-brand-content">
            <div className="carrerix-brand-badge">
              <Sparkles size={14} />
              AI-Powered Career Intelligence
            </div>

            <h1>
              Build your career
              <span> with confidence.</span>
            </h1>

            <p>
              Create your Carrerix AI account and get access to powerful
              tools designed to help you build, analyze and improve your
              professional profile.
            </p>

            <div className="carrerix-benefits">
              <div>
                <CheckCircle2 size={18} />
                <span>AI-powered resume analysis</span>
              </div>

              <div>
                <CheckCircle2 size={18} />
                <span>ATS compatibility checking</span>
              </div>

              <div>
                <CheckCircle2 size={18} />
                <span>Job matching and skill insights</span>
              </div>

              <div>
                <CheckCircle2 size={18} />
                <span>Professional resume builder</span>
              </div>
            </div>
          </div>

          <div className="carrerix-brand-footer">
            Craft Your Resume. Elevate Your Career.
          </div>
        </div>

        {/* =========================
            REGISTER FORM
        ========================== */}
        <div className="carrerix-register-form-panel">
          <div className="carrerix-register-form-container">
            <div className="carrerix-mobile-logo">
              <button
                type="button"
                className="carrerix-auth-logo"
                onClick={() => navigate("/")}
              >
                <span className="carrerix-auth-logo-mark">C</span>

                <span className="carrerix-auth-logo-text">
                  <strong>Carrerix AI</strong>
                  <small>Career Intelligence Platform</small>
                </span>
              </button>
            </div>

            <div className="carrerix-form-heading">
              <span className="carrerix-form-eyebrow">
                GET STARTED
              </span>

              <h2>Create your account</h2>

              <p>
                Start building a stronger professional profile today.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="carrerix-auth-error">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="carrerix-form-group">
                <label htmlFor="register-name">
                  Full Name
                </label>

                <input
                  id="register-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                />
              </div>

              {/* Email */}
              <div className="carrerix-form-group">
                <label htmlFor="register-email">
                  Email Address
                </label>

                <input
                  id="register-email"
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
                <label htmlFor="register-password">
                  Password
                </label>

                <div className="carrerix-password-wrapper">
                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    autoComplete="new-password"
                  />

                  <button
                    type="button"
                    className="carrerix-password-toggle"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
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

                <span className="carrerix-input-hint">
                  Use at least 6 characters.
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="carrerix-register-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="carrerix-button-spinner" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="carrerix-login-divider">
              <span>Already have an account?</span>

              <Link to="/login">
                Login
              </Link>
            </div>

            <p className="carrerix-security-note">
              By creating an account, you can securely access your
              personalized career dashboard and tools.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;