import { useNavigate, Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ user, setUser }: any) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/auth");
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="nav-logo">
          🌌 T45K <span>Universe</span>
        </Link>

        <div className="nav-links">
          {user ? (
            <div className="nav-user-section">
              <span className="nav-username">Welcome, {user.username}</span>
              <button className="nav-btn logout" onClick={logout}>Logout</button>
            </div>
          ) : (
            <Link to="/auth" className="nav-btn login">Login / Join</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;