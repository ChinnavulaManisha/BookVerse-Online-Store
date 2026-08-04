import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiCreditCard } from 'react-icons/fi';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [address, setAddress] = useState({
    fullName: '', address: '', city: '', state: '', zip: '', phone: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [upiPaid, setUpiPaid] = useState(false);
  const [verifyingUpi, setVerifyingUpi] = useState(false);

  useEffect(() => {
    const savedAddress = localStorage.getItem('bookverse_saved_address');
    if (savedAddress) {
      try {
        setAddress(JSON.parse(savedAddress));
      } catch (e) {
        console.error('Failed to parse saved address');
      }
    }
  }, []);

  const getImageUrl = (image) => {
    if (!image) return 'https://picsum.photos/seed/default/400/600';
    if (image.startsWith('http')) return image;
    return `${API_URL}${image}`;
  };

  const deliveryCharge = cartTotal >= 500 ? 0 : 10;
  const total = Math.round((cartTotal + deliveryCharge) * 100) / 100;

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address.fullName || !address.address || !address.city || !address.state || !address.zip || !address.phone) {
      toast.error('Please fill in all fields');
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await API.post('/api/orders', { shippingAddress: address, paymentMethod });
      if (data.success) {
        localStorage.setItem('bookverse_saved_address', JSON.stringify(address));
        clearCart();
        toast.success('Order placed successfully!');
        navigate(`/order-success/${data.order._id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page" id="checkout-page">
      <div className="checkout-container">
        <h1><FiCreditCard /> <span className="gradient-text">Checkout</span></h1>

        <div className="checkout-layout">
          <form className="shipping-form" onSubmit={handleSubmit} id="shipping-form">
            <h2><FiMapPin /> Shipping Address</h2>
            <div className="form-grid">
              <div className="form-group full-width">
                <label htmlFor="fullName">Full Name</label>
                <input type="text" id="fullName" name="fullName" value={address.fullName} onChange={handleChange} placeholder="John Doe" required />
              </div>
              <div className="form-group full-width">
                <label htmlFor="address">Address</label>
                <input type="text" id="address" name="address" value={address.address} onChange={handleChange} placeholder="123 Main Street" required />
              </div>
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input type="text" id="city" name="city" value={address.city} onChange={handleChange} placeholder="Mumbai" required />
              </div>
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input type="text" id="state" name="state" value={address.state} onChange={handleChange} placeholder="Maharashtra" required />
              </div>
              <div className="form-group">
                <label htmlFor="zip">ZIP Code</label>
                <input type="text" id="zip" name="zip" value={address.zip} onChange={handleChange} placeholder="400001" required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input type="text" id="phone" name="phone" value={address.phone} onChange={handleChange} placeholder="+91 9876543210" required />
              </div>
            </div>
            
            <div className="payment-method-section" style={{ marginTop: '30px' }}>
              <h2><FiCreditCard /> Payment Method</h2>
              <div className="form-group full-width">
                <div className="radio-group" style={{ display: 'flex', gap: '20px', marginTop: '15px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="Cash on Delivery" 
                      checked={paymentMethod === 'Cash on Delivery'} 
                      onChange={(e) => { setPaymentMethod(e.target.value); setUpiPaid(false); }} 
                    />
                    Cash on Delivery (COD)
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="UPI" 
                      checked={paymentMethod === 'UPI'} 
                      onChange={(e) => setPaymentMethod(e.target.value)} 
                    />
                    UPI
                  </label>
                </div>
              </div>

              {paymentMethod === 'UPI' && (
                <div className="upi-qr-card" style={{
                  marginTop: '20px',
                  padding: '24px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-accent)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textCenter: 'center',
                  gap: '15px'
                }}>
                  <h4 style={{ margin: 0, color: 'var(--accent)' }}>Scan to Pay with Any UPI App</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    GPay • PhonePe • Paytm • BHIM
                  </p>

                  <div style={{
                    padding: '12px',
                    background: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: 'var(--shadow-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=bookverse@upi%26pn=BookVerse%20Store%26am=${total}%26cu=INR`} 
                      alt="BookVerse UPI QR Code" 
                      style={{ width: '180px', height: '180px' }}
                    />
                  </div>

                  <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    <strong>UPI ID:</strong> <code style={{ color: 'var(--accent)' }}>bookverse@upi</code> | <strong>Amount:</strong> ₹{total.toFixed(2)}
                  </div>

                  {upiPaid ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      background: 'rgba(34, 197, 94, 0.15)',
                      border: '1px solid #22c55e',
                      borderRadius: 'var(--radius-md)',
                      color: '#22c55e',
                      fontWeight: 'bold',
                      fontSize: '1rem'
                    }}>
                      <span>✅ Payment Done!</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setVerifyingUpi(true);
                        setTimeout(() => {
                          setVerifyingUpi(false);
                          setUpiPaid(true);
                          toast.success('UPI Payment Verified!');
                        }, 1500);
                      }}
                      disabled={verifyingUpi}
                      style={{
                        fontSize: '0.85rem',
                        padding: '8px 16px',
                        cursor: 'pointer'
                      }}
                    >
                      {verifyingUpi ? 'Verifying Scan...' : 'Click to Simulate Scan & Pay'}
                    </button>
                  )}
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={submitting || (paymentMethod === 'UPI' && !upiPaid)} id="place-order-btn" style={{ marginTop: '30px' }}>
              {submitting ? 'Placing Order...' : (paymentMethod === 'UPI' && !upiPaid ? 'Please Complete UPI Payment' : 'Place Order')}
            </button>
          </form>

          <div className="checkout-summary" id="checkout-summary">
            <h3>Order Summary</h3>
            <div className="checkout-items">
              {cartItems.map((item) => (
                <div className="checkout-item" key={item._id}>
                  <img src={getImageUrl(item.book?.image)} alt={item.book?.title} />
                  <div className="checkout-item-info">
                    <p className="item-title">{item.book?.title}</p>
                    <p className="item-qty">Qty: {item.quantity}</p>
                  </div>
                  <span className="item-price">₹{(item.book?.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal.toFixed(2)}</span></div>
            <div className="summary-row"><span>Delivery Charges</span><span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span></div>
            <div className="summary-divider"></div>
            <div className="summary-row total-row"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
