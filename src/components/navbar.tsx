import { Link, useLocation } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import './navbar.css';



export const Navbar = () => {
  const [user] = useAuthState(auth);
  const location = useLocation();
  
  const signUserOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  const isActive = (path: string) => {
    return location.pathname === path;
  }
 
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="brand">
            <span className="brand-icon">🌟</span>
          </Link>
          <div className="navbar-links">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              <span className="nav-icon">🏠</span>
              <span className="nav-text">Home</span>
            </Link>
            
            {user && (
              <Link 
                to="/create-post" 
                className={`nav-link ${isActive('/create-post') ? 'active' : ''}`}
              >
                <span className="nav-icon">✨</span>
                <span className="nav-text">Create</span>
              </Link>
            )}
          </div>
        </div>

        <div className="navbar-right">
          {!user ? (
            <Link to="/login" className="login-btn">
              Login
            </Link>
          ) : (
            <div className="user-profile">
              <div className="user-info">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={`${user.displayName || 'User'}'s profile`}
                    className="profile-image"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="profile-placeholder">
                    {(user.displayName?.[0] || 'U').toUpperCase()}
                  </div>
                )}
                <span className="username-display">
                  {user.displayName || 'User'}
                </span>
              </div>
              <button
                onClick={signUserOut}
                className="logout-btn"
                aria-label="Sign out"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};