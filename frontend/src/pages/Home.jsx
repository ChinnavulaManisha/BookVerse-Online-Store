import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiBook, FiUsers, FiStar, FiTruck } from 'react-icons/fi';
import API from '../api/axios';
import BookCard from '../components/BookCard';
import Spinner from '../components/Spinner';

const categories = [
  { name: 'Fiction', icon: '📖', color: '#f59e0b' },
  { name: 'UPSC', icon: '📚', color: '#3b82f6' },
  { name: 'Physics', icon: '⚛️', color: '#10b981' },
  { name: 'Mathematics', icon: '➗', color: '#8b5cf6' },
  { name: 'Story', icon: '✨', color: '#ef4444' },
  { name: 'Novels', icon: '📕', color: '#06b6d4' },
  { name: 'Horror & Thriller', icon: '👻', color: '#ec4899' },
];

const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await API.get('/api/books?sort=rating&limit=8');
        setFeaturedBooks(data.books || []);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="home-page" id="home-page">
      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="hero-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-badge">📚 Your Universe of Books</span>
            <h1>Discover Your Next <span className="gradient-text">Great Read</span></h1>
            <p>Explore thousands of titles across every genre. From timeless classics to modern bestsellers, find your perfect book at BookVerse.</p>
            <div className="hero-actions">
              <Link to="/books" className="btn btn-primary btn-lg">
                Browse Books <FiArrowRight />
              </Link>
              <Link to="/books?category=Fiction" className="btn btn-outline btn-lg">
                Top Fiction
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <FiBook />
                <div>
                  <strong>10,000+</strong>
                  <span>Books</span>
                </div>
              </div>
              <div className="stat">
                <FiUsers />
                <div>
                  <strong>50,000+</strong>
                  <span>Readers</span>
                </div>
              </div>
              <div className="stat">
                <FiStar />
                <div>
                  <strong>4.8/5</strong>
                  <span>Rating</span>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-books">
              <div className="floating-book fb-1">
                <img src="https://picsum.photos/seed/hero1/200/300" alt="Book" />
              </div>
              <div className="floating-book fb-2">
                <img src="https://picsum.photos/seed/hero2/200/300" alt="Book" />
              </div>
              <div className="floating-book fb-3">
                <img src="https://picsum.photos/seed/hero3/200/300" alt="Book" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section" id="categories-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Browse by <span className="gradient-text">Category</span></h2>
            <p>Find books in your favorite genres</p>
          </div>
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link
                to={`/books?category=${cat.name}`}
                key={cat.name}
                className="category-card"
                style={{ '--accent': cat.color }}
              >
                <span className="category-icon">{cat.icon}</span>
                <span className="category-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="featured-section" id="featured-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Featured <span className="gradient-text">Books</span></h2>
            <p>Top rated books handpicked for you</p>
            <Link to="/books" className="view-all-link">
              View All <FiArrowRight />
            </Link>
          </div>
          {loading ? (
            <Spinner text="Loading books..." />
          ) : (
            <div className="books-grid">
              {featuredBooks.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features-section">
        <div className="section-container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><FiTruck /></div>
              <h3>Free Shipping</h3>
              <p>Free delivery on orders above ₹500</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><FiBook /></div>
              <h3>Wide Selection</h3>
              <p>Thousands of books across all genres</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><FiStar /></div>
              <h3>Best Prices</h3>
              <p>Competitive prices with great discounts</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><FiUsers /></div>
              <h3>Community</h3>
              <p>Join 50,000+ happy book lovers</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
