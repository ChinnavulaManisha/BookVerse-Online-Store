import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('bookverse_wishlist');
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load wishlist', e);
      }
    }
  }, []);

  const saveWishlist = (items) => {
    setWishlist(items);
    localStorage.setItem('bookverse_wishlist', JSON.stringify(items));
  };

  const isInWishlist = (bookId) => {
    return wishlist.some(item => (item._id || item) === bookId);
  };

  const toggleWishlist = (book) => {
    const bookId = book._id || book;
    if (isInWishlist(bookId)) {
      const updated = wishlist.filter(item => (item._id || item) !== bookId);
      saveWishlist(updated);
      toast.success('Removed from Wishlist');
    } else {
      const updated = [...wishlist, book];
      saveWishlist(updated);
      toast.success('Added to Wishlist!');
    }
  };

  const removeFromWishlist = (bookId) => {
    const updated = wishlist.filter(item => (item._id || item) !== bookId);
    saveWishlist(updated);
    toast.success('Removed from Wishlist');
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      wishlistCount: wishlist.length,
      isInWishlist,
      toggleWishlist,
      removeFromWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
