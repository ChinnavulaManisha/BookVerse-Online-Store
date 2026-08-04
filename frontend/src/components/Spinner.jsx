const Spinner = ({ size = 'medium', text = 'Loading...' }) => {
  return (
    <div className={`spinner-container spinner-${size}`} id="loading-spinner">
      <div className="book-spinner">
        <div className="book-page"></div>
        <div className="book-page"></div>
        <div className="book-page"></div>
      </div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
};

export default Spinner;
