import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Briefcase,
  GraduationCap,
  Save,
  LogOut,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  saveSettings,
  getSettings,
} from "../services/api";

function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    targetRole: "",
    experience: "Student",
    careerGoal: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD SETTINGS FROM MONGODB
  // =========================================================

  useEffect(() => {
    const loadSettings = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await getSettings(user.id);

        if (!response?.success) {
          setError(
            response?.message ||
              "Unable to load settings."
          );
          return;
        }

        if (response.settings) {
          setFormData({
            name:
              response.settings.name ||
              user?.name ||
              "",

            email:
              response.settings.email ||
              user?.email ||
              "",

            targetRole:
              response.settings.targetRole ||
              "",

            experience:
              response.settings.experience ||
              "Student",

            careerGoal:
              response.settings.careerGoal ||
              "",
          });
        } else {
          setFormData({
            name: user?.name || "",
            email: user?.email || "",
            targetRole: "",
            experience: "Student",
            careerGoal: "",
          });
        }
      } catch (err) {
        console.error(
          "Settings loading error:",
          err
        );

        setError(
          "Unable to connect to the backend."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user?.id]);


  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
    setError("");
  };


  // =========================================================
  // SAVE SETTINGS
  // =========================================================

  const handleSave = async () => {
    if (!user?.id) {
      setError(
        "User session not found. Please login again."
      );
      return;
    }

    try {
      setSaving(true);
      setSaved(false);
      setError("");

      const settingsData = {
        user_id: user.id,
        name: formData.name,
        email: formData.email,
        targetRole: formData.targetRole,
        experience: formData.experience,
        careerGoal: formData.careerGoal,
      };

      const response =
        await saveSettings(settingsData);

      if (!response?.success) {
        setError(
          response?.message ||
            "Unable to save settings."
        );
        return;
      }

      // Local backup/cache
      localStorage.setItem(
        "careerai_settings",
        JSON.stringify(formData)
      );

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (err) {
      console.error(
        "Settings save error:",
        err
      );

      setError(
        "Unable to connect to the backend."
      );
    } finally {
      setSaving(false);
    }
  };


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="dashboard-page">

        <div className="welcome-section">

          <p className="eyebrow">
            ACCOUNT
          </p>

          <h1>
            Settings
          </h1>

          <p>
            Loading your account settings...
          </p>

        </div>

      </div>
    );
  }


  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="dashboard-page">

      {/* HEADER */}

      <div className="welcome-section">

        <p className="eyebrow">
          ACCOUNT
        </p>

        <h1>
          Settings
        </h1>

        <p>
          Manage your Carrerix AI profile and
          career preferences.
        </p>

      </div>


      {/* ERROR */}

      {error && (
        <div className="error-message">

          <AlertCircle size={18} />

          <span>
            {error}
          </span>

        </div>
      )}


      {/* PROFILE INFORMATION */}

      <div className="settings-card">

        <div className="settings-title">

          <div className="settings-icon">
            <User size={20} />
          </div>

          <div>

            <h3>
              Profile Information
            </h3>

            <p>
              Update your personal information.
            </p>

          </div>

        </div>


        <div className="settings-form">

          {/* NAME */}

          <div className="form-group">

            <label htmlFor="name">
              Full Name
            </label>

            <div className="input-with-icon">

              <User size={17} />

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />

            </div>

          </div>


          {/* EMAIL */}

          <div className="form-group">

            <label htmlFor="email">
              Email Address
            </label>

            <div className="input-with-icon">

              <Mail size={17} />

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                readOnly
              />

            </div>

            <small>
              Email is linked to your Carrerix AI account.
            </small>

          </div>

        </div>

      </div>


      {/* CAREER PREFERENCES */}

      <div className="settings-card">

        <div className="settings-title">

          <div className="settings-icon">
            <Briefcase size={20} />
          </div>

          <div>

            <h3>
              Career Preferences
            </h3>

            <p>
              Tell Carrerix AI what kind of role
              you are targeting.
            </p>

          </div>

        </div>


        <div className="settings-form">

          {/* TARGET ROLE */}

          <div className="form-group">

            <label htmlFor="targetRole">
              Target Job Role
            </label>

            <div className="input-with-icon">

              <Briefcase size={17} />

              <input
                id="targetRole"
                name="targetRole"
                type="text"
                value={formData.targetRole}
                onChange={handleChange}
                placeholder="e.g. Full Stack Developer"
              />

            </div>

          </div>


          {/* EXPERIENCE */}

          <div className="form-group">

            <label htmlFor="experience">
              Experience Level
            </label>

            <div className="input-with-icon">

              <GraduationCap size={17} />

              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
              >

                <option value="Student">
                  Student
                </option>

                <option value="Fresher">
                  Fresher
                </option>

                <option value="0-1 Years">
                  0-1 Years
                </option>

                <option value="1-3 Years">
                  1-3 Years
                </option>

                <option value="3-5 Years">
                  3-5 Years
                </option>

                <option value="5+ Years">
                  5+ Years
                </option>

              </select>

            </div>

          </div>


          {/* CAREER GOAL */}

          <div className="form-group">

            <label htmlFor="careerGoal">
              Career Goal
            </label>

            <textarea
              id="careerGoal"
              name="careerGoal"
              value={formData.careerGoal}
              onChange={handleChange}
              placeholder="Describe what you want to achieve in your career..."
              rows="4"
            />

          </div>

        </div>

      </div>


      {/* SAVE */}

      <div className="settings-actions">

        <button
          className="analyze-btn"
          onClick={handleSave}
          disabled={saving}
        >

          <Save size={17} />

          {saving
            ? "Saving Changes..."
            : "Save Changes"}

        </button>


        {saved && (
          <div className="settings-success">

            <CheckCircle2 size={17} />

            <span>
              Settings saved successfully.
            </span>

          </div>
        )}

      </div>


      {/* ACCOUNT */}

      <div className="settings-card danger-card">

        <div className="settings-title">

          <div className="settings-icon danger-icon">

            <LogOut size={20} />

          </div>

          <div>

            <h3>
              Account
            </h3>

            <p>
              Sign out from your Carrerix AI account.
            </p>

          </div>

        </div>


        <button
          className="logout-settings-btn"
          onClick={handleLogout}
        >

          <LogOut size={17} />

          Logout

        </button>

      </div>

    </div>
  );
}

export default Settings;