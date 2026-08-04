import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiPackage } from 'react-icons/fi';
import API from '../api/axios';
import Spinner from '../components/Spinner';

const statusColors = {
  Pending: '#f59e0b',
  Processing: '#3b82f6',
  Shipped: '#8b5cf6',
  Delivered: '#10b981',
  Cancelled: '#ef4444'
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/api/orders/my');
        setOrders(data.orders || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Spinner text="Loading your orders..." />;

  return (
    <div className="my-orders-page" id="my-orders-page">
      <div className="orders-container">
        <h1><FiPackage /> My <span className="gradient-text">Orders</span></h1>

        {orders.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📦</span>
            <h3>No orders yet</h3>
            <p>You haven't placed any orders. Start shopping!</p>
            <Link to="/books" className="btn btn-primary">Browse Books</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order._id} id={`order-${order._id}`}>
                <div className="order-card-header">
                  <div className="order-meta">
                    <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                    <span className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <span className="status-badge" style={{ background: statusColors[order.status] || '#6b7280' }}>
                    {order.status}
                  </span>
                </div>
                <div className="order-card-items">
                  <p>{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                  <div className="order-items-preview">
                    {order.items.slice(0, 3).map((item, i) => (
                      <span key={i} className="item-preview">{item.title}</span>
                    ))}
                    {order.items.length > 3 && <span className="item-preview">+{order.items.length - 3} more</span>}
                  </div>
                </div>
                <div className="order-card-footer">
                  <span className="order-total">Total: ₹{order.total.toFixed(2)}</span>
                  <Link to={`/orders/${order._id}`} className="btn btn-outline btn-sm">
                    <FiEye /> View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
