import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import { saveToken } from "../utils/auth";

export default function Login() {
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
        <div className="max-w-md mx-auto p-4">
          <h2 className="text-2xl mb-4">Logowanie</h2>
          {error && <p className="text-red-600">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="text"
              placeholder="Login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              className="w-full border p-2 rounded"
            />
            <input
              type="password"
              placeholder="Hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border p-2 rounded"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Zaloguj
            </button>
          </form>
        </div>
      );
    }