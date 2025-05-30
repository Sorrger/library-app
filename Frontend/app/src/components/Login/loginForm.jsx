import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/apiClient";
import { getUserRoleFromToken, saveToken } from "../../utils/auth";
import "../../statics/login/loginForm.css"

export default function LoginForm() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
  
    const handleLogin = async (e) => {
      e.preventDefault();
      setError("");
  
      try {
        const res = await api.post("/login", {
          login: login,
          password: password
        });

        saveToken(res.data.access_token);
        const role = getUserRoleFromToken(res.data.access_token);
        if (role === "UserRole.librarian") {
          navigate("/librarian-dashboard");
        } else if (role === "UserRole.admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError("Niepoprawne dane logowania");
        } else {
          setError("Wystąpił błąd. Spróbuj ponownie.");
        }
      }
    };
  
    return (
      <div className="login-container">
        <h2 className="login-title">Log in</h2>
        {error && <p className="login-error">{error}</p>}
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Login"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <button type="submit" className="login-button">
            Log in
          </button>
          <p className="login-register">
          Don't have an account? <a href="/register">Register</a>
          </p>
        </form>
      </div>
    );
  }