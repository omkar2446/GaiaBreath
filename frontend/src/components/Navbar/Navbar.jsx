import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import {
  ADMIN_TOKEN_KEY,
  AUTH_EMAIL_KEY,
  AUTH_NAME_KEY,
  AUTH_ROLE_KEY,
  AUTH_TOKEN_KEY,
  adminLogin,
  getAuthMe,
  loginUser,
  logoutAuth,
  signupUser,
} from "../../services/api";

function Navbar({ onMenuClick }) {
  const [showLogin, setShowLogin] = useState(false);
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [auth, setAuth] = useState({
    token: "",
    role: "",
    name: "",
    email: "",
  });

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY) || "";
    const role = localStorage.getItem(AUTH_ROLE_KEY) || "";
    const savedName = localStorage.getItem(AUTH_NAME_KEY) || "";
    const savedEmail = localStorage.getItem(AUTH_EMAIL_KEY) || "";

    if (!token) return;

    getAuthMe(token)
      .then((me) => {
        setAuth({
          token,
          role: me.role || role,
          name: me.name || savedName,
          email: me.email || savedEmail,
        });
      })
      .catch(() => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_ROLE_KEY);
        localStorage.removeItem(AUTH_NAME_KEY);
        localStorage.removeItem(AUTH_EMAIL_KEY);
        localStorage.removeItem(ADMIN_TOKEN_KEY);
      });
  }, []);

  const saveAuth = (data) => {
    const next = {
      token: data.token || "",
      role: data.role || "user",
      name: data.name || "User",
      email: data.email || "",
    };
    setAuth(next);
    localStorage.setItem(AUTH_TOKEN_KEY, next.token);
    localStorage.setItem(AUTH_ROLE_KEY, next.role);
    localStorage.setItem(AUTH_NAME_KEY, next.name);
    localStorage.setItem(AUTH_EMAIL_KEY, next.email);

    if (next.role === "admin") {
      localStorage.setItem(ADMIN_TOKEN_KEY, next.token);
    } else {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    }
  };

  const clearAuth = () => {
    setAuth({ token: "", role: "", name: "", email: "" });
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_ROLE_KEY);
    localStorage.removeItem(AUTH_NAME_KEY);
    localStorage.removeItem(AUTH_EMAIL_KEY);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  };

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const data = await loginUser(email.trim(), password);
      saveAuth(data);
      setPassword("");
      setSuccess("Login successful.");
      setTimeout(() => setShowLogin(false), 600);
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !password) {
      setError("Name, email and password are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      await signupUser({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      setSuccess("Signup successful. Please login now.");
      setMode("login");
      setPassword("");
    } catch (err) {
      setError(err.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    if (!email.trim() || !password) {
      setError("Admin email and password are required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const data = await adminLogin(email.trim(), password);
      saveAuth({
        token: data.token,
        role: "admin",
        name: "Admin",
        email: data.admin_email || email.trim(),
      });
      setPassword("");
      setSuccess("Admin login successful.");
      setTimeout(() => setShowLogin(false), 600);
    } catch (err) {
      setError(err.message || "Admin login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const token = auth.token || localStorage.getItem(AUTH_TOKEN_KEY) || "";
    try {
      if (token) {
        await logoutAuth(token);
      }
    } catch {
      // Ignore logout API failure and clear local session anyway.
    } finally {
      clearAuth();
    }
  };

  return (
    <>
      <header className="navbar">
        <div className="nav-left">
          <button className="menu-btn" onClick={onMenuClick} title="Open Menu">
            &#9776;
          </button>

          <div className="brand">
            <img src={logo} alt="GaiaBreath logo" className="brand-logo" />
            <span className="brand-name">GaiaBreath</span>
          </div>
        </div>

        <nav className="nav-center">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>

        <div className="nav-right">
          {!auth.token && (
            <button className="login-btn" onClick={() => setShowLogin(true)}>
              Login
            </button>
          )}
          {auth.token && (
            <button className="login-btn" onClick={handleLogout}>
              Logout ({auth.role})
            </button>
          )}
        </div>
      </header>

      {showLogin && (
        <div className="login-overlay" onClick={() => setShowLogin(false)}>
          <div className="login-card" onClick={(e) => e.stopPropagation()}>
            <h3>{mode === "signup" ? "Sign Up" : mode === "admin" ? "Admin Login" : "Login"}</h3>
            <div className="login-modes">
              <button
                type="button"
                className={mode === "login" ? "active" : ""}
                onClick={() => {
                  setMode("login");
                  setError("");
                  setSuccess("");
                }}
              >
                Login
              </button>
              <button
                type="button"
                className={mode === "signup" ? "active" : ""}
                onClick={() => {
                  setMode("signup");
                  setError("");
                  setSuccess("");
                }}
              >
                Sign Up
              </button>
              <button
                type="button"
                className={mode === "admin" ? "active" : ""}
                onClick={() => {
                  setMode("admin");
                  setEmail("otambe655@gmail.com");
                  setError("");
                  setSuccess("");
                }}
              >
                Admin
              </button>
            </div>
            {mode === "signup" && (
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="login-error">{error}</p>}
            {success && <p className="login-success">{success}</p>}
            <div className="login-actions">
              <button
                className="btn-primary"
                onClick={
                  mode === "signup"
                    ? handleSignup
                    : mode === "admin"
                      ? handleAdminLogin
                      : handleLogin
                }
                disabled={loading}
              >
                {loading ? "Please wait..." : "Submit"}
              </button>
              <button
                className="btn-secondary"
                onClick={() => setShowLogin(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
