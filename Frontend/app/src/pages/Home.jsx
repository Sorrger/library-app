import { Link } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

export default function Home() {

    const handleClick = () => {
      localStorage.clear();
    };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white px-6 py-4 shadow">
        <h1 className="text-2xl font-bold">Strona Główna</h1>
      </header>

      <nav className="bg-white shadow px-6 py-3">
        <ul className="flex gap-4">

          <li>
            <Link to="/books" className="text-blue-600 hover:underline">
              Książki
            </Link>
          </li>
          {!isLoggedIn() && (
            <li>
                <Link to="/login" className="text-blue-600 hover:underline">
                Login
                </Link>
            </li>
        )}
          <li>
            <button
              onClick={handleClick}
              className="text-blue-600 hover:underline"
            >
              Konto użytkownika
            </button>
          </li>

        </ul>
      </nav>

    </div>
  );
}
