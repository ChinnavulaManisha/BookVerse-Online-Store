import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit, FiTrash2, FiPlus, FiArrowLeft } from 'react-icons/fi';
import API from '../../api/axios';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const { data } = await API.get('/api/books?limit=100');
      setBooks(data.books || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await API.delete(`/api/books/${id}`);
      setBooks(books.filter(b => b._id !== id));
      toast.success('Book deleted');
    } catch (error) {
      toast.error('Failed to delete book');
    }
  };

  const getImageUrl = (image) => {
    if (!image) return 'https://picsum.photos/seed/default/400/600';
    if (image.startsWith('http')) return image;
    return `${API_URL}${image}`;
  };

  if (loading) return <Spinner text="Loading books..." />;

  return (
    <div className="admin-page" id="manage-books-page">
      <div className="admin-container">
        <Link to="/admin" className="back-link"><FiArrowLeft /> Back to Dashboard</Link>
        <div className="admin-header">
          <h1>Manage <span className="gradient-text">Books</span></h1>
          <Link to="/admin/books/add" className="btn btn-primary"><FiPlus /> Add Book</Link>
        </div>

        {books.length === 0 ? (
          <div className="empty-state">
            <h3>No books yet</h3>
            <Link to="/admin/books/add" className="btn btn-primary">Add First Book</Link>
          </div>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map(book => (
                  <tr key={book._id}>
                    <td><img src={getImageUrl(book.image)} alt={book.title} className="table-thumb" /></td>
                    <td className="table-title">{book.title}</td>
                    <td>{book.author}</td>
                    <td><span className="category-pill">{book.category}</span></td>
                    <td>₹{book.price}</td>
                    <td><span className={book.stock > 0 ? 'stock-ok' : 'stock-out'}>{book.stock}</span></td>
                    <td className="table-actions">
                      <Link to={`/admin/books/edit/${book._id}`} className="action-btn edit-btn"><FiEdit /></Link>
                      <button className="action-btn delete-btn" onClick={() => handleDelete(book._id, book.title)}><FiTrash2 /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBooks;
