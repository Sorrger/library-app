import '../statics/home/page.css';
import {isLoggedIn, getUserNameFromToken} from '../utils/auth';


export default function Home() {
  const loggedIn = isLoggedIn();
  const login = getUserNameFromToken();
  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">Welcome on the LibraryApp!</h1>
        <p className='home-subtitle'>
        {loggedIn?(
          <>Hi <strong>{login}</strong>! 👋</>
        ): (
          <>If u want to unlock whole potentail of website, please <strong>login</strong>!</>
        )}
        </p>
      </header>

    </div>
  );
}
