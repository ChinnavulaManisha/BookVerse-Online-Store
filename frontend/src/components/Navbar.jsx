import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiLogOut, FiGrid, FiPackage, FiBook, FiSun, FiMoon, FiHeart } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdown, setUserDropdown] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdown(false);
    navigate('/');
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" id="navbar-logo">
          <FiBook className="logo-icon" />
          <span>Book<span className="logo-accent">Verse</span></span>
        </Link>

        <form className="navbar-search" onSubmit={handleSearch} id="navbar-search">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search books, authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="search-input"
          />
        </form>

        <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/books" className="nav-link" onClick={() => setMenuOpen(false)}>Books</Link>
          {user && !isAdmin && (
            <Link to="/my-orders" className="nav-link" onClick={() => setMenuOpen(false)}>
              <FiPackage /> My Orders
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          <button className="theme-toggle-btn" onClick={toggleTheme} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: 'var(--radius-md)', transition: 'var(--transition)' }}>
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>
          
          <Link to="/wishlist" className="cart-btn" id="wishlist-btn" title="Wishlist" style={{ position: 'relative' }}>
            <FiHeart />
            {wishlistCount > 0 && <span className="cart-badge" style={{ background: '#ef4444' }}>{wishlistCount}</span>}
          </Link>
          
          <Link to="/cart" className="cart-btn" id="cart-btn">
            <FiShoppingCart />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="user-menu">
              <button className="user-btn" onClick={() => setUserDropdown(!userDropdown)} id="user-menu-btn">
                <FiUser />
                <span className="user-name">{user.name?.split(' ')[0]}</span>
              </button>
              {userDropdown && (
                <div className="user-dropdown" id="user-dropdown">
                  <div className="dropdown-header">
                    <p className="dropdown-name">{user.name}</p>
                    <p className="dropdown-email">{user.email}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  {!isAdmin && (
                    <>
                      <Link to="/wishlist" className="dropdown-item" onClick={() => setUserDropdown(false)}>
                        <FiHeart /> Wishlist
                      </Link>
                      <Link to="/my-orders" className="dropdown-item" onClick={() => setUserDropdown(false)}>
                        <FiPackage /> My Orders
                      </Link>
                    </>
                  )}
                  {isAdmin && (
                    <Link to="/admin" className="dropdown-item" onClick={() => setUserDropdown(false)}>
                      <FiGrid /> Admin Dashboard
                    </Link>
                  )}
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-btn" id="login-btn">
              <FiUser /> Login
            </Link>
          )}

          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} id="menu-toggle">
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
