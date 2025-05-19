import LoginForm from "../components/Login/loginForm";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn,getUserRoleFromToken } from "../utils/auth";
import "../statics/login/page.css";

export default function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn()) {
      const role = getUserRoleFromToken();
      if (role === 'UserRole.admin') navigate('/admin');
      else if (role === 'UserRole.librarian') navigate('/librarian-dashboard');
      else navigate('/');
    }
  }, []);

  return (
    <div className="login-page">
      <LoginForm />
    </div>
  );
}
