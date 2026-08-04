import { Link } from 'react-router-dom';
import { FiHeart, FiTrash2, FiShoppingBag, FiShoppingCart } from 'react-icons/fi';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const getImageUrl = (image) => {
    if (!image) return 'https://picsum.photos/seed/default/400/600';
    if (image.startsWith('http')) return image;
    return `${API_URL}${image}`;
  };

  return (
    <div className="wishlist-page" id="wishlist-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <div className="wishlist-container">
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FiHeart style={{ color: 'var(--red)' }} /> My <span className="gradient-text">Wishlist</span>
        </h1>

        {wishlist.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">❤️</span>
            <h3>Your Wishlist is Empty</h3>
            <p>Save items you love to your wishlist and revisit them anytime!</p>
            <Link to="/books" className="btn btn-primary" style={{ marginTop: '15px' }}>
              <FiShoppingBag /> Browse Books
            </Link>
          </div>
        ) : (
          <div className="books-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '25px' }}>
            {wishlist.map((book) => (
              <div className="book-card" key={book._id} id={`wishlist-item-${book._id}`}>
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
                    onClick={() => removeFromWishlist(book._id)}
                    title="Remove from Wishlist"
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: 'none',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ef4444',
                      cursor: 'pointer',
                      backdropFilter: 'blur(4px)',
                      transition: 'var(--transition)'
                    }}
                  >
                    <FiTrash2 />
                  </button>
                  <span className="book-category-badge">{book.category}</span>
                </div>
                <div className="book-card-content">
                  <Link to={`/books/${book._id}`} className="book-card-title">
                    {book.title}
                  </Link>
                  <p className="book-card-author">by {book.author}</p>
                  <div className="book-card-footer" style={{ marginTop: '15px' }}>
                    <span className="book-price">₹{book.price}</span>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart(book._id)}
                      disabled={book.stock === 0}
                    >
                      <FiShoppingCart />
                      {book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
