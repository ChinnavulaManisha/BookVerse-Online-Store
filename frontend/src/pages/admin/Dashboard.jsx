import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBook, FiShoppingBag, FiUsers, FiDollarSign, FiPlus, FiList, FiPackage } from 'react-icons/fi';
import API from '../../api/axios';
import Spinner from '../../components/Spinner';

const Dashboard = () => {
  const [stats, setStats] = useState({ books: 0, orders: 0, users: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [booksRes, ordersRes, usersRes] = await Promise.all([
          API.get('/api/books?limit=1'),
          API.get('/api/orders'),
          API.get('/api/orders/users/all')
        ]);

        setStats({
          books: booksRes.data.pagination?.total || 0,
          orders: ordersRes.data.count || 0,
          users: usersRes.data.count || 0,
          revenue: ordersRes.data.totalRevenue || 0
        });

        setRecentOrders((ordersRes.data.orders || []).slice(0, 5));
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Spinner text="Loading dashboard..." />;

  return (
    <div className="admin-page" id="admin-dashboard">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin <span className="gradient-text">Dashboard</span></h1>
          <p>Manage your bookstore</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card stat-books">
            <div className="stat-icon"><FiBook /></div>
            <div className="stat-info">
              <span className="stat-value">{stats.books}</span>
              <span className="stat-label">Total Books</span>
            </div>
          </div>
          <div className="stat-card stat-orders">
            <div className="stat-icon"><FiShoppingBag /></div>
            <div className="stat-info">
              <span className="stat-value">{stats.orders}</span>
              <span className="stat-label">Total Orders</span>
            </div>
          </div>
          <div className="stat-card stat-users">
            <div className="stat-icon"><FiUsers /></div>
            <div className="stat-info">
              <span className="stat-value">{stats.users}</span>
              <span className="stat-label">Total Users</span>
            </div>
          </div>
          <div className="stat-card stat-revenue">
            <div className="stat-icon"><FiDollarSign /></div>
            <div className="stat-info">
              <span className="stat-value">₹{stats.revenue.toLocaleString()}</span>
              <span className="stat-label">Revenue</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/admin/books/add" className="action-card">
              <FiPlus /> Add New Book
            </Link>
            <Link to="/admin/books" className="action-card">
              <FiList /> Manage Books
            </Link>
            <Link to="/admin/orders" className="action-card">
              <FiPackage /> Manage Orders
            </Link>
            <Link to="/admin/users" className="action-card">
              <FiUsers /> View Users
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="recent-orders">
          <div className="section-header">
            <h2>Recent Orders</h2>
            <Link to="/admin/orders" className="view-all-link">View All</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="no-data">No orders yet</p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order._id}>
                      <td className="order-id">#{order._id.slice(-8).toUpperCase()}</td>
                      <td>{order.user?.name || 'N/A'}</td>
                      <td>{order.items.length}</td>
                      <td>₹{order.total.toFixed(2)}</td>
                      <td><span className="status-badge-sm" data-status={order.status}>{order.status}</span></td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
