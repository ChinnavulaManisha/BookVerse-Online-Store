import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiShoppingBag } from 'react-icons/fi';

const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <div className="order-success-page" id="order-success-page">
      <div className="success-container">
        <div className="success-animation">
          <FiCheckCircle className="success-icon" />
        </div>
        <h1>Order Placed <span className="gradient-text">Successfully!</span></h1>
        <p className="success-message">Thank you for your purchase! Your order has been confirmed and will be shipped soon.</p>
        {id && (
          <div className="order-id-box">
            <span>Order ID:</span>
            <code>{id}</code>
          </div>
        )}
        <p className="delivery-estimate">📦 Estimated delivery: 5-7 business days</p>
        <div className="success-actions">
          <Link to={`/orders/${id}`} className="btn btn-primary btn-lg">
            <FiPackage /> View Order Details
          </Link>
          <Link to="/books" className="btn btn-outline btn-lg">
            <FiShoppingBag /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
