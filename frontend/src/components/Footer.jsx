import { Link } from 'react-router-dom';
import { FiBook, FiMail, FiGithub, FiTwitter, FiInstagram } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <FiBook className="logo-icon" />
              <span>Book<span className="logo-accent">Verse</span></span>
            </Link>
            <p className="footer-desc">
              Your universe of books. Discover, explore, and buy from thousands of titles across every genre.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-link" aria-label="Twitter"><FiTwitter /></a>
              <a href="#" className="social-link" aria-label="Instagram"><FiInstagram /></a>
              <a href="#" className="social-link" aria-label="GitHub"><FiGithub /></a>
              <a href="#" className="social-link" aria-label="Email"><FiMail /></a>
            </div>
          </div>

          <div className="footer-links-group">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/books">All Books</Link>
            <Link to="/books?category=Fiction">Fiction</Link>
            <Link to="/books?category=Technology">Technology</Link>
          </div>

          <div className="footer-links-group">
            <h4>Categories</h4>
            <Link to="/books?category=Science">Science</Link>
            <Link to="/books?category=Self-Help">Self-Help</Link>
            <Link to="/books?category=Fantasy">Fantasy</Link>
            <Link to="/books?category=Business">Business</Link>
          </div>

          <div className="footer-links-group">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Shipping Info</a>
            <a href="#">Returns</a>
            <a href="#">Contact Us</a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} BookVerse. All rights reserved.</p>
          <p>Made with ❤️ for book lovers</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
