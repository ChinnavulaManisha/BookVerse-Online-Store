# 📚 BOOKVERSE – ONLINE BOOKSTORE PLATFORM 📖✨

Proud to share my project: **BOOKVERSE**, a modern online bookstore web application designed to provide a seamless reading and book purchasing experience. BookVerse enables users to browse curated categories, manage wishlists, place one-time orders with smart delivery pricing, scan instant UPI QR codes for payment, and track live order status through an interactive visual progress timeline. 🚀📦

---

## 🔑 KEY FEATURES:
- 📚 **Extensive Book Catalog & Category Filtering** (Fiction, UPSC, Physics, Mathematics, Story, Novels, Horror & Thriller, Self-Help)
- ❤️ **Wishlist Management** with Persistent Local Storage & Quick Add to Cart
- 🛒 **Dynamic Cart & Delivery Charge Logic** (Flat ₹10 for orders < ₹500, FREE delivery for orders ≥ ₹500)
- 💳 **Flexible Payment Options**: Cash on Delivery (COD) & Interactive UPI QR Code with Instant Scan Verification (`Payment Done ✅`)
- 📍 **Saved Address Auto-Fill** for Streamlined Checkout
- 📊 **Real-Time Order Status Timeline Tracking** (Pending ➔ Processing ➔ Shipped ➔ Delivered with Checkmark Indicators)
- 🔐 **Secure Authentication & Admin Role Access** (Admin Dashboard for Book CRUD & Order Status Management)
- 🌙 **Seamless Light & Dark Mode Toggle** across all pages
- 📱 **Responsive UI for All Devices**

---

## 👉 USER FLOW:
1. Click on **Browse Books** to explore available books by title, author, or category filters.
2. Click the **Heart icon** on any book to save it to your Wishlist or click **Add to Cart**.
3. Proceed to **Cart & Checkout** to review items and delivery charges (Free delivery on orders ₹500+).
4. Enter shipping details (auto-saved for future orders) and select your **Payment Method**: Cash on Delivery or UPI.
5. For UPI, scan the generated QR code and click to verify payment (`Payment Done ✅`).
6. Complete order placement and track live status stage-by-stage in **My Orders**.

---

## 💻 TECH STACK:
- 🌐 **Frontend**: React.js, Vite, Vanilla CSS Design System, React Icons, React Hot Toast
- ⚙️ **Backend**: Node.js, Express.js, JWT, bcryptjs, Multer
- 💽 **Database**: MongoDB, Mongoose
- 🔐 **Authentication**: JWT Token-Based Auth with Role-Based Access Control (User/Admin)
- 🔄 **State Management**: React Context API (AuthContext, CartContext, WishlistContext)

---

## 💡 LEARNING OUTCOMES:
This project helped me understand full-stack development with the MERN stack, state management using React Context API, custom delivery & payment workflows, database persistence, role-based access control, and building scalable e-commerce systems for real-world use cases.

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed locally
- MongoDB running locally (`mongodb://localhost:27017`) or a MongoDB Atlas URI

### Step 1: Set Up Backend
```bash
cd backend
copy .env.example .env
npm install
npm run seed
npm run dev
```
*Backend runs on: `http://localhost:5000`*

### Step 2: Set Up Frontend
```bash
cd frontend
copy .env.example .env
npm install
npm run dev
```
*Frontend runs on: `http://localhost:5174`*
