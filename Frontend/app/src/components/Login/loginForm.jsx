import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/apiClient";
import { saveToken } from "../../utils/auth";
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
        navigate("/");
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
        <h2 className="login-title">Zaloguj się</h2>
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
            placeholder="Hasło"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <button type="submit" className="login-button">
            Zaloguj
          </button>
          <p className="login-register">
            Nie masz konta? <a href="/register">Zarejestruj się</a>
          </p>
        </form>
      </div>
    );
  }