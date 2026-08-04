import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Cart = () => {
  const { cartItems, cartTotal, loading, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();

  const getImageUrl = (image) => {
    if (!image) return 'https://picsum.photos/seed/default/400/600';
    if (image.startsWith('http')) return image;
    return `${API_URL}${image}`;
  };

  const deliveryCharge = cartTotal >= 500 ? 0 : 10;
  const total = Math.round((cartTotal + deliveryCharge) * 100) / 100;

  if (loading) return <Spinner text="Loading cart..." />;

  return (
    <div className="cart-page" id="cart-page">
      <div className="cart-container">
        <h1>Shopping <span className="gradient-text">Cart</span></h1>

        {cartItems.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🛒</span>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added any books yet</p>
            <Link to="/books" className="btn btn-primary">
              <FiShoppingBag /> Browse Books
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div className="cart-item" key={item._id} id={`cart-item-${item._id}`}>
                  <Link to={`/books/${item.book?._id}`} className="cart-item-image">
                    <img src={getImageUrl(item.book?.image)} alt={item.book?.title} />
                  </Link>
                  <div className="cart-item-info">
                    <Link to={`/books/${item.book?._id}`} className="cart-item-title">
                      {item.book?.title}
                    </Link>
                    <p className="cart-item-author">by {item.book?.author}</p>
                    <p className="cart-item-price">₹{item.book?.price}</p>
                  </div>
                  <div className="cart-item-actions">
                    <div className="quantity-selector">
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>
                        <FiMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} disabled={item.quantity >= (item.book?.stock || 10)}>
                        <FiPlus />
                      </button>
                    </div>
                    <span className="cart-item-total">₹{(item.book?.price * item.quantity).toFixed(2)}</span>
                    <button className="remove-btn" onClick={() => removeFromCart(item._id)} id={`remove-${item._id}`}>
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary-card" id="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal ({cartItems.reduce((t, i) => t + i.quantity, 0)} items)</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Charges</span>
                <span>{deliveryCharge === 0 ? <span className="free-shipping">FREE</span> : `₹${deliveryCharge}`}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total-row">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              {deliveryCharge > 0 && (
                <p className="free-shipping-note">Add ₹{(500 - cartTotal).toFixed(2)} more for free delivery!</p>
              )}
              <Link to={user ? '/checkout' : '/login'} className="btn btn-primary btn-lg btn-block" id="checkout-btn">
                {user ? 'Proceed to Checkout' : 'Login to Checkout'} <FiArrowRight />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
