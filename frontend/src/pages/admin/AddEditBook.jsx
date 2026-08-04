import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiUpload, FiSave } from 'react-icons/fi';
import API from '../../api/axios';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const categories = ['Fiction', 'UPSC', 'Physics', 'Mathematics', 'Story', 'Novels', 'Horror & Thriller', 'Self-Help'];

const AddEditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [form, setForm] = useState({
    title: '', author: '', description: '', category: 'Fiction',
    price: '', stock: '', rating: ''
  });

  useEffect(() => {
    if (isEdit) {
      const fetchBook = async () => {
        try {
          const { data } = await API.get(`/api/books/${id}`);
          const b = data.book;
          setForm({
            title: b.title, author: b.author, description: b.description,
            category: b.category, price: b.price, stock: b.stock, rating: b.rating
          });
          if (b.image) {
            setImagePreview(b.image.startsWith('http') ? b.image : `${API_URL}${b.image}`);
          }
        } catch (error) {
          toast.error('Failed to load book');
          navigate('/admin/books');
        } finally {
          setLoading(false);
        }
      };
      fetchBook();
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      if (imageFile) formData.append('image', imageFile);

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      if (isEdit) {
        await API.put(`/api/books/${id}`, formData, config);
        toast.success('Book updated!');
      } else {
        await API.post('/api/books', formData, config);
        toast.success('Book created!');
      }
      navigate('/admin/books');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save book');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner text="Loading book..." />;

  return (
    <div className="admin-page" id="add-edit-book-page">
      <div className="admin-container">
        <Link to="/admin/books" className="back-link"><FiArrowLeft /> Back to Books</Link>
        <h1>{isEdit ? 'Edit' : 'Add New'} <span className="gradient-text">Book</span></h1>

        <form className="admin-form" onSubmit={handleSubmit} id="book-form">
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="author">Author</label>
              <input type="text" id="author" name="author" value={form.author} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category" name="category" value={form.category} onChange={handleChange}>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="price">Price (₹)</label>
              <input type="number" id="price" name="price" value={form.price} onChange={handleChange} min="0" step="0.01" required />
            </div>
            <div className="form-group">
              <label htmlFor="stock">Stock</label>
              <input type="number" id="stock" name="stock" value={form.stock} onChange={handleChange} min="0" required />
            </div>
            <div className="form-group">
              <label htmlFor="rating">Rating (0-5)</label>
              <input type="number" id="rating" name="rating" value={form.rating} onChange={handleChange} min="0" max="5" step="0.1" />
            </div>
            <div className="form-group full-width">
              <label htmlFor="description">Description</label>
              <textarea id="description" name="description" value={form.description} onChange={handleChange} rows="4" required></textarea>
            </div>
            <div className="form-group full-width">
              <label>Book Cover Image</label>
              <div className="image-upload-area">
                {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
                <label htmlFor="image-upload" className="upload-label">
                  <FiUpload /> {imagePreview ? 'Change Image' : 'Upload Image'}
                </label>
                <input type="file" id="image-upload" accept="image/*" onChange={handleImageChange} hidden />
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={submitting} id="save-book-btn">
            <FiSave /> {submitting ? 'Saving...' : (isEdit ? 'Update Book' : 'Add Book')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEditBook;
