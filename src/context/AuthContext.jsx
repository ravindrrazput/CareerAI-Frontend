import { createContext, useContext, useState } from "react";

import {
  loginUser as loginAPI,
  registerUser as registerAPI,
} from "../services/api";

const AuthContext = createContext(null);

// =====================================================
// LOAD STORED USER SAFELY
// =====================================================

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("careerai_user");

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Stored user data is invalid:", error);

    localStorage.removeItem("careerai_user");
    localStorage.removeItem("careerai_logged_in");

    return null;
  }
};

// =====================================================
// AUTH PROVIDER
// =====================================================

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  // ===================================================
  // LOGIN
  // ===================================================

  const loginUser = async (email, password) => {
    try {
      const response = await loginAPI(
        email.trim().toLowerCase(),
        password
      );

      if (!response?.success) {
        return {
          success: false,
          message:
            response?.message ||
            "Invalid email or password.",
        };
      }

      const loggedInUser = response.user;

      setUser(loggedInUser);

      localStorage.setItem(
        "careerai_user",
        JSON.stringify(loggedInUser)
      );

      localStorage.setItem(
        "careerai_logged_in",
        "true"
      );

      return {
        success: true,
        user: loggedInUser,
        message:
          response.message || "Login successful.",
      };
    } catch (error) {
      console.error("Login error:", error);

      return {
        success: false,
        message:
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Unable to connect to the backend.",
      };
    }
  };

  // ===================================================
  // REGISTER
  // ===================================================

  const registerUser = async (
    name,
    email,
    password
  ) => {
    try {
      const response = await registerAPI(
        name.trim(),
        email.trim().toLowerCase(),
        password
      );

      if (!response?.success) {
        return {
          success: false,
          message:
            response?.message ||
            "Unable to create your account.",
        };
      }

      const registeredUser = response.user;

      setUser(registeredUser);

      localStorage.setItem(
        "careerai_user",
        JSON.stringify(registeredUser)
      );

      localStorage.setItem(
        "careerai_logged_in",
        "true"
      );

      return {
        success: true,
        user: registeredUser,
        message:
          response.message ||
          "Account created successfully.",
      };
    } catch (error) {
      console.error("Registration error:", error);

      return {
        success: false,
        message:
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Unable to create your account.",
      };
    }
  };

  // ===================================================
  // LOGOUT
  // ===================================================

  const logout = () => {
    setUser(null);

    localStorage.removeItem("careerai_user");
    localStorage.removeItem("careerai_logged_in");
  };

  return (
    <AuthContext.Provider
      value={{
        user,

        // Main names used by Login/Register
        loginUser,
        registerUser,

        // Compatibility aliases
        login: loginUser,
        register: registerUser,

        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =====================================================
// USE AUTH
// =====================================================

export function useAuth() {
  return useContext(AuthContext);
}