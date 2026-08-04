# BookVerse — Premium Full-Stack Bookstore

BookVerse is a modern, premium online bookstore web application designed for buying and managing books. It provides a complete e-commerce experience including user authentication, book catalog management, search, filtering, a shopping cart, a mock checkout flow, order tracking, and an admin dashboard.

## Tech Stack
- **Frontend**: React.js, Vite, Axios, React Icons, React Hot Toast
- **Backend**: Node.js, Express.js, JWT, bcryptjs, Multer
- **Database**: MongoDB, Mongoose
- **API Testing**: Postman

---

## Folder Structure
```
summer pep project/
├── backend/
│   ├── config/db.js           # DB connection
│   ├── controllers/           # Route controllers (auth, books, cart, orders)
│   ├── middleware/            # Auth, Admin and Upload (Multer) middlewares
│   ├── models/                # User, Book, Cart, Order models
│   ├── routes/                # REST API endpoints
│   ├── seed/seedBooks.js      # Seeding script with 12 sample books
│   └── server.js              # Server entry point
├── frontend/
│   ├── src/
│   │   ├── api/axios.js       # Axios base configuration
│   │   ├── components/        # Navigation, Cards, Spinner, Guards
│   │   ├── context/           # Auth, Cart context providers
│   │   ├── pages/             # Home, Catalog, Details, Cart, Checkout, Success, Orders
│   │   ├── App.jsx            # Layout and router structure
│   │   ├── index.css          # Premium design system tokens
│   │   └── App.css            # Component and page layout styles
│   └── index.html             # React mount structure
└── BookVerse.postman_collection.json # Postman requests collection
```

---

## Getting Started

### Prerequisites
- Node.js installed locally
- MongoDB running locally (`mongodb://localhost:27017`) or a MongoDB Atlas URI

### Step 1: Set Up Backend
1. Open a terminal and navigate to the backend:
   ```bash
   cd backend
   ```
2. Create your `.env` file from the example:
   ```bash
   copy .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the seed script to populate books and create the admin user:
   ```bash
   npm run seed
   ```
   *Note: This creates an Admin account with: `admin@bookverse.com` / `admin123`.*
5. Start the backend server:
   ```bash
   npm run dev
   ```
   *Backend runs on: `http://localhost:5000`*

### Step 2: Set Up Frontend
1. Open another terminal and navigate to the frontend:
   ```bash
   cd frontend
   ```
2. Create your `.env` file:
   ```bash
   copy .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *Frontend runs on: `http://localhost:5173`*

---

## API Endpoints Reference

### Authentication
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Login user or admin

### Books
- `GET /api/books` — Get books with search/filters/sorting/pagination
- `GET /api/books/categories/list` — List all categories
- `GET /api/books/:id` — Get single book details
- `POST /api/books` — Create a new book *(Admin only, supports image upload)*
- `PUT /api/books/:id` — Update book details *(Admin only, supports image upload)*
- `DELETE /api/books/:id` — Delete a book *(Admin only)*

### Cart
- `GET /api/cart` — Retrieve user's cart
- `POST /api/cart` — Add book/increment quantity in cart
- `PUT /api/cart/:id` — Update item quantity
- `DELETE /api/cart/:id` — Remove item from cart

### Orders
- `POST /api/orders` — Checkout cart and place order
- `GET /api/orders/my` — Get logged-in user's order history
- `GET /api/orders/:id` — Get single order details
- `GET /api/orders` — Get all orders *(Admin only)*
- `PUT /api/orders/:id/status` — Update order status *(Admin only)*
- `GET /api/orders/users/all` — View all registered users *(Admin only)*
