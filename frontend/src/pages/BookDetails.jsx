import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingCart, FiStar, FiMinus, FiPlus, FiArrowLeft, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import Spinner from '../components/Spinner';
import BookCard from '../components/BookCard';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/api/books/${id}`);
        setBook(data.book);

        // Fetch related books
        if (data.book?.category) {
          const related = await API.get(`/api/books?category=${data.book.category}&limit=4`);
          setRelatedBooks((related.data.books || []).filter(b => b._id !== id));
        }
      } catch (error) {
        console.error('Error fetching book:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const getImageUrl = (image) => {
    if (!image) return 'https://picsum.photos/seed/default/400/600';
    if (image.startsWith('http')) return image;
    return `${API_URL}${image}`;
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(<FiStar key={i} className={`star ${i < Math.floor(rating) ? 'filled' : ''}`} />);
    }
    return stars;
  };

  if (loading) return <Spinner text="Loading book details..." />;
  if (!book) return (
    <div className="empty-state">
      <h3>Book not found</h3>
      <Link to="/books" className="btn btn-primary">Browse Books</Link>
    </div>
  );

  return (
    <div className="book-details-page" id="book-details-page">
      <div className="book-details-container">
        <Link to="/books" className="back-link">
          <FiArrowLeft /> Back to Books
        </Link>

        <div className="book-details-grid">
          <div className="book-image-section">
            <div className="book-image-wrapper">
              <img 
                src={getImageUrl(book.image)} 
                alt={book.title} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
                }}
              />
            </div>
          </div>

          <div className="book-info-section">
            <span className="book-category-tag">{book.category}</span>
            <h1 className="book-title">{book.title}</h1>
            <p className="book-author">by <strong>{book.author}</strong></p>

            <div className="book-rating-row">
              <div className="stars">{renderStars(book.rating)}</div>
              <span className="rating-value">{book.rating}</span>
              <span className="review-count">({book.numReviews || 0} reviews)</span>
            </div>

            <div className="book-price-section">
              <span className="book-detail-price">₹{book.price}</span>
              <span className={`stock-status ${book.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                {book.stock > 0 ? <><FiCheckCircle /> In Stock ({book.stock})</> : <><FiXCircle /> Out of Stock</>}
              </span>
            </div>

            <div className="book-description">
              <h3>Description</h3>
              <p>{book.description}</p>
            </div>

            {book.stock > 0 && (
              <div className="book-actions">
                <div className="quantity-selector">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                    <FiMinus />
                  </button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(book.stock, quantity + 1))} disabled={quantity >= book.stock}>
                    <FiPlus />
                  </button>
                </div>
                <button
                  className="btn btn-primary btn-lg add-detail-cart"
                  onClick={() => addToCart(book._id, quantity)}
                  id="add-to-cart-detail"
                >
                  <FiShoppingCart /> Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <div className="related-books-section">
            <h2>Related <span className="gradient-text">Books</span></h2>
            <div className="books-grid">
              {relatedBooks.slice(0, 4).map(b => (
                <BookCard key={b._id} book={b} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
