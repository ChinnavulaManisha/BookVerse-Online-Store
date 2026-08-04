import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!token) {
      setCartItems([]);
      return;
    }
    try {
      setLoading(true);
      const { data } = await API.get('/api/cart');
      setCartItems(data.cart?.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (bookId, quantity = 1) => {
    if (!token) {
      toast.error('Please login to add items to cart');
      return false;
    }
    try {
      const { data } = await API.post('/api/cart', { bookId, quantity });
      setCartItems(data.cart?.items || []);
      toast.success('Added to cart!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
      return false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const { data } = await API.put(`/api/cart/${itemId}`, { quantity });
      setCartItems(data.cart?.items || []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update quantity');
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const { data } = await API.delete(`/api/cart/${itemId}`);
      setCartItems(data.cart?.items || []);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove item');
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => {
    const price = item.book?.price || 0;
    return total + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{
      cartItems, cartCount, cartTotal, loading,
      addToCart, updateQuantity, removeFromCart, clearCart, fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};
