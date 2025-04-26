import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../statics/register/registerForm.css";

export default function RegisterForm() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Hasła nie są identyczne");
      return;
    }

    try {
      const payload = {
        login,
        password,
        student: {
          name,
          surname,
          phone_number: phoneNumber || null,
        },
      };
      const resp = await axios.post("http://localhost:8000/register", payload);
      console.log("Zarejestrowano:", resp.data);
      navigate("/login");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.detail);
      } else {
        setError("Błąd sieci");
      }
    }
  };

  return (
    <div className="register-form">
      <h2 className="form-title">Rejestracja</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="form">
        <div>
          <label>Login</label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div>
          <label>Hasło</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div>
          <label>Potwierdź hasło</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div>
          <label>Imię</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div>
          <label>Nazwisko</label>
          <input
            type="text"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div>
          <label>Numer telefonu (opcjonalnie)</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="input-field"
          />
        </div>
        <button type="submit" className="submit-button">
          Zarejestruj
        </button>
        <p className="redirect-text">
          Masz konto? <a href="/login" className="redirect-link">Zaloguj się</a>
        </p>
      </form>
    </div>
  );
}
