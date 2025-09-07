# Voucher Platform

A modern digital voucher and service delivery platform built with React.js and Node.js. This platform allows customers to order digital services (like social media likes, memberships, etc.) and provides administrators with a comprehensive management system.

## Features

### Admin Panel
- **Secure Authentication**: JWT-based authentication system
- **Dashboard**: Real-time statistics and analytics
- **Order Management**: View, filter, update, and delete orders
- **Customer Management**: Manage customer accounts and information
- **Product Management**: Add, edit, and manage service offerings
- **Site Settings**: Configure website settings and preferences

### Customer Area
- **User Registration & Login**: Secure account creation and authentication
- **Order History**: View past and current orders with status tracking
- **Order Placement**: Easy-to-use order form with product selection
- **Support Center**: Contact information and FAQ section

### Technical Features
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Real-time Updates**: Live order status updates
- **Secure API**: RESTful API with proper authentication and validation
- **Database Integration**: MySQL database with proper relationships
- **Payment Integration**: Ready for payment gateway integration

## Technology Stack

### Frontend
- **React.js**: Modern UI library
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls
- **React Hot Toast**: Notification system
- **Lucide React**: Icon library

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MySQL**: Relational database
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **Express Validator**: Input validation
- **Helmet**: Security middleware
- **CORS**: Cross-origin resource sharing

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd voucher-platform
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Database Setup
1. Create a MySQL database named `voucher_platform`
2. Run the SQL script from `server/database/schema.sql` to create tables and insert sample data
3. Update database credentials in `server/env.example` and rename it to `.env`

### 4. Environment Configuration
Create a `.env` file in the `server` directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=voucher_platform
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
NODE_ENV=development
```

### 5. Start the Application
```bash
# From the root directory
npm run dev

# Or start individually:
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Default Accounts

### Admin Account
- **Username**: admin
- **Password**: admin123
- **Access**: Full admin panel access

### Customer Account
- Create a new account through the registration form

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new customer
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Admin Routes
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `DELETE /api/admin/orders/:id` - Delete order
- `GET /api/admin/customers` - Get all customers
- `POST /api/admin/orders/manual` - Create manual order

### Customer Routes
- `GET /api/orders/my-orders` - Get user's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/payment` - Update payment info

### Products
- `GET /api/products` - Get active products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Settings
- `GET /api/settings` - Get site settings
- `PUT /api/settings` - Update settings (admin)

## Project Structure

```
voucher-platform/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   │   ├── admin/     # Admin pages
│   │   │   └── customer/  # Customer pages
│   │   ├── utils/         # Utility functions
│   │   └── App.js         # Main app component
│   └── package.json
├── server/                # Node.js backend
│   ├── config/           # Database configuration
│   ├── database/         # SQL schema
│   ├── middleware/       # Custom middleware
│   ├── routes/          # API routes
│   ├── index.js         # Server entry point
│   └── package.json
└── package.json         # Root package.json
```

## Payment Integration

The platform is ready for payment gateway integration. To integrate a payment gateway:

1. Update the payment gateway configuration in the settings
2. Implement webhook handlers for payment confirmations
3. Update the order status based on payment notifications
4. Add payment verification logic

Example payment gateways:
- bKash API
- Nagad API
- Rocket API
- Stripe
- PayPal

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Rate limiting
- Helmet security headers
- SQL injection prevention

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Email: support@voucher.com
- Phone: +880-123-456-789
- Live Chat: Available 24/7

## Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app development
- [ ] Advanced payment methods
- [ ] Automated service delivery
- [ ] Customer review system
- [ ] Affiliate program
