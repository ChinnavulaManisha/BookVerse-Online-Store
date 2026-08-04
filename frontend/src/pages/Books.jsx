import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import API from '../api/axios';
import BookCard from '../components/BookCard';
import Spinner from '../components/Spinner';

const allCategories = ['Fiction', 'UPSC', 'Physics', 'Mathematics', 'Story', 'Novels', 'Horror & Thriller', 'Self-Help'];

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (category) params.set('category', category);
        if (sort) params.set('sort', sort);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        params.set('page', searchParams.get('page') || '1');
        params.set('limit', '12');

        const { data } = await API.get(`/api/books?${params.toString()}`);
        setBooks(data.books || []);
        setPagination(data.pagination || { current: 1, pages: 1, total: 0 });
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [search, category, sort, minPrice, maxPrice, searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);
    if (search) params.set('search', search);
    else params.delete('search');
    
    if (sort) params.set('sort', sort);
    else params.delete('sort');
    
    if (minPrice) params.set('minPrice', minPrice);
    else params.delete('minPrice');
    
    if (maxPrice) params.set('maxPrice', maxPrice);
    else params.delete('maxPrice');
    
    params.set('page', '1');
    setSearchParams(params);
    setShowFilters(false);
  };

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    const params = new URLSearchParams(searchParams);
    if (cat) {
      params.set('category', cat);
    } else {
      params.delete('category');
    }
    params.set('page', '1');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setSort('');
    setMinPrice('');
    setMaxPrice('');
    setSearchParams({});
  };

  const goToPage = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page);
    setSearchParams(params);
  };

  const hasActiveFilters = search || minPrice || maxPrice;

  return (
    <div className="books-page" id="books-page">
      <div className="books-container">
        {/* Page Header */}
        <div className="books-header">
          <h1>Explore <span className="gradient-text">Books</span></h1>
          <p>{pagination.total} books found</p>
        </div>

        <div className="books-main-layout">
          {/* Sidebar */}
          <aside className="books-sidebar">
            <h3>Categories</h3>
            <ul className="category-list">
              <li 
                className={!category ? 'active' : ''} 
                onClick={() => handleCategorySelect('')}
              >
                All Books
              </li>
              {allCategories.map(cat => (
                <li 
                  key={cat} 
                  className={category === cat ? 'active' : ''}
                  onClick={() => handleCategorySelect(cat)}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </aside>

          {/* Main Content */}
          <div className="books-content">
            {/* Search & Filter Bar */}
            <div className="books-toolbar">
              <div className="search-bar">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by title or author..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                  id="books-search-input"
                />
              </div>

              <div className="toolbar-actions">
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); applyFilters(); }}
                  className="sort-select"
                  id="sort-select"
                >
                  <option value="">Sort by</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="title">Title A-Z</option>
                </select>

                <button
                  className={`filter-toggle-btn ${hasActiveFilters ? 'active' : ''}`}
                  onClick={() => setShowFilters(!showFilters)}
                  id="filter-toggle"
                >
                  <FiFilter /> Price Filter
                  {hasActiveFilters && <span className="filter-count">•</span>}
                </button>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="filter-panel" id="filter-panel">
                <div className="filter-group">
                  <label>Min Price (₹)</label>
                  <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" />
                </div>
                <div className="filter-group">
                  <label>Max Price (₹)</label>
                  <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="999" />
                </div>
                <div className="filter-actions">
                  <button className="btn btn-primary" onClick={applyFilters}>Apply</button>
                  <button className="btn btn-outline" onClick={() => { setMinPrice(''); setMaxPrice(''); applyFilters(); }}>
                    <FiX /> Clear
                  </button>
                </div>
              </div>
            )}

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="active-filters">
                {search && <span className="filter-tag">Search: "{search}" <FiX onClick={() => { setSearch(''); applyFilters(); }} /></span>}
                {(minPrice || maxPrice) && <span className="filter-tag">₹{minPrice || '0'} - ₹{maxPrice || '∞'} <FiX onClick={() => { setMinPrice(''); setMaxPrice(''); applyFilters(); }} /></span>}
                <button className="clear-all-btn" onClick={clearFilters}>Clear All</button>
              </div>
            )}

            {/* Books Grid */}
            {loading ? (
              <Spinner text="Loading books..." />
            ) : books.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📚</span>
                <h3>No books found</h3>
                <p>Try adjusting your search or filters</p>
                <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="books-grid">
                  {books.map(book => (
                    <BookCard key={book._id} book={book} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="pagination" id="pagination">
                    <button
                      className="page-btn"
                      disabled={pagination.current === 1}
                      onClick={() => goToPage(pagination.current - 1)}
                    >
                      Previous
                    </button>
                    {[...Array(pagination.pages)].map((_, i) => (
                      <button
                        key={i + 1}
                        className={`page-btn ${pagination.current === i + 1 ? 'active' : ''}`}
                        onClick={() => goToPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      className="page-btn"
                      disabled={pagination.current === pagination.pages}
                      onClick={() => goToPage(pagination.current + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Books;
