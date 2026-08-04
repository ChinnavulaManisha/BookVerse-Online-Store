import { Link } from 'react-router-dom';
import { FiShoppingCart, FiStar, FiHeart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const BookCard = ({ book }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const getImageUrl = (image) => {
    if (!image) return 'https://picsum.photos/seed/default/400/600';
    if (image.startsWith('http')) return image;
    return `${API_URL}${image}`;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FiStar
          key={i}
          className={`star ${i < fullStars ? 'filled' : ''}`}
        />
      );
    }
    return stars;
  };

  return (
    <div className="book-card" id={`book-card-${book._id}`}>
      <div className="book-card-image" style={{ position: 'relative' }}>
        <Link to={`/books/${book._id}`}>
          <img 
            src={getImageUrl(book.image)} 
            alt={book.title} 
            loading="lazy" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
            }}
          />
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(book);
          }}
          title={isInWishlist(book._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(15, 23, 42, 0.75)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isInWishlist(book._id) ? '#ef4444' : '#94a3b8',
            cursor: 'pointer',
            backdropFilter: 'blur(4px)',
            transition: 'var(--transition)',
            zIndex: 3
          }}
        >
          <FiHeart fill={isInWishlist(book._id) ? '#ef4444' : 'none'} />
        </button>
        <span className="book-category-badge">{book.category}</span>
      </div>
      <div className="book-card-content">
        <Link to={`/books/${book._id}`} className="book-card-title">
          {book.title}
        </Link>
        <p className="book-card-author">by {book.author}</p>
        <div className="book-card-rating">
          <div className="stars">{renderStars(book.rating)}</div>
          <span className="rating-count">({book.numReviews || 0})</span>
        </div>
        <div className="book-card-footer">
          <span className="book-price">₹{book.price}</span>
          <button
            className="add-to-cart-btn"
            onClick={() => addToCart(book._id)}
            disabled={book.stock === 0}
            id={`add-to-cart-${book._id}`}
          >
            <FiShoppingCart />
            {book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
