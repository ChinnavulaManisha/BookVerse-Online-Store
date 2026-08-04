import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiPackage, FiCheck } from 'react-icons/fi';
import API from '../api/axios';
import Spinner from '../components/Spinner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const statusSteps = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/api/orders/${id}`);
        setOrder(data.order);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const getImageUrl = (image) => {
    if (!image) return 'https://picsum.photos/seed/default/400/600';
    if (image.startsWith('http')) return image;
    return `${API_URL}${image}`;
  };

  const getStatusIndex = (status) => {
    if (status === 'Cancelled') return -1;
    return statusSteps.indexOf(status);
  };

  if (loading) return <Spinner text="Loading order details..." />;
  if (!order) return (
    <div className="empty-state">
      <h3>Order not found</h3>
      <Link to="/my-orders" className="btn btn-primary">Back to Orders</Link>
    </div>
  );

  const currentStep = getStatusIndex(order.status);

  return (
    <div className="order-details-page" id="order-details-page">
      <div className="order-details-container">
        <Link to="/my-orders" className="back-link"><FiArrowLeft /> Back to Orders</Link>

        <div className="order-details-header">
          <h1>Order <span className="gradient-text">#{order._id.slice(-8).toUpperCase()}</span></h1>
          <p className="order-date">Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>

        {/* Status Timeline */}
        {order.status !== 'Cancelled' ? (
          <div className="status-timeline" id="status-timeline">
            {statusSteps.map((step, index) => (
              <div 
                key={step} 
                className={`timeline-step ${index <= currentStep ? 'completed' : ''} ${index === currentStep ? 'current' : ''} ${index < currentStep ? 'line-active' : ''}`}
              >
                <div className="timeline-dot" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                  {index <= currentStep && (
                    <FiCheck size={14} strokeWidth={4} />
                  )}
                </div>
                <span>{step}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="cancelled-banner">
            <span>❌ This order has been cancelled</span>
          </div>
        )}

        <div className="order-details-grid">
          {/* Items */}
          <div className="order-items-section">
            <h3><FiPackage /> Order Items</h3>
            {order.items.map((item, i) => (
              <div className="order-detail-item" key={i}>
                <img src={getImageUrl(item.image)} alt={item.title} />
                <div className="item-info">
                  <p className="item-title">{item.title}</p>
                  <p className="item-qty">Qty: {item.quantity}</p>
                  <p className="item-price">₹{item.price} × {item.quantity} = ₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="order-side-info">
            {/* Shipping Address */}
            <div className="order-address-card">
              <h3><FiMapPin /> Shipping Address</h3>
              <p><strong>{order.shippingAddress.fullName}</strong></p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
              <p>📞 {order.shippingAddress.phone}</p>
            </div>

            {/* Payment & Price Summary */}
            <div className="order-price-card">
              <h3>Price Summary</h3>
              <div className="summary-row" style={{ marginBottom: '10px' }}>
                <span>Payment Method</span>
                <strong>{order.paymentMethod || 'Cash on Delivery'}</strong>
              </div>
              <div className="summary-divider" style={{ margin: '10px 0' }}></div>
              <div className="summary-row"><span>Subtotal</span><span>₹{order.subtotal.toFixed(2)}</span></div>
              <div className="summary-row"><span>Delivery Charges</span><span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span></div>
              <div className="summary-divider"></div>
              <div className="summary-row total-row"><span>Total</span><span>₹{order.total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
