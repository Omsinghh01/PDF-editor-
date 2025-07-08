# Banking System Pro

A complete, modern banking system built with React, Node.js, and SQLite. This application provides a full-featured online banking experience with secure authentication, account management, and transaction processing.

## ✨ Features

### Core Banking Functions
- **User Authentication**: Secure registration and login with JWT tokens
- **Account Management**: Create and manage multiple account types (Checking, Savings, Credit)
- **Money Transfers**: Instant transfers between accounts with real-time balance updates
- **Deposits & Withdrawals**: Easy money management with transaction tracking
- **Transaction History**: Complete audit trail of all banking activities
- **Balance Inquiry**: Real-time account balance viewing with privacy toggle

### Security Features
- **JWT Authentication**: Secure token-based authentication
- **Password Encryption**: Bcrypt hashing for password security
- **Input Validation**: Comprehensive validation on all user inputs
- **Rate Limiting**: Protection against brute force attacks
- **CORS Security**: Cross-origin request security
- **SQL Injection Protection**: Parameterized queries for database security

### Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern Interface**: Clean, professional design with smooth animations
- **Real-time Updates**: Instant feedback on all transactions
- **Dashboard Overview**: Comprehensive view of all banking activities
- **Accessibility**: Keyboard navigation and screen reader support

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Modern web browser with JavaScript enabled

### Installation

1. **Navigate to the banking system directory**
```bash
cd banking-system
```

2. **Install all dependencies**
```bash
npm run install-all
```

3. **Start the application**
```bash
npm run dev
```

4. **Access the application**
Open your browser and navigate to `http://localhost:3000`

## 🛠️ Development Setup

### Backend Server (Port 5000)
```bash
cd server
npm install
npm run dev
```

### Frontend Client (Port 3000)
```bash
cd client
npm install
npm start
```

## 📁 Project Structure

```
banking-system/
├── package.json                 # Root package with scripts
├── README.md                   # This file
├── .env                        # Environment variables
├── server/                     # Backend Node.js server
│   ├── package.json           # Server dependencies
│   ├── index.js              # Main server file with API routes
│   └── banking.db            # SQLite database (created automatically)
└── client/                    # React frontend
    ├── package.json          # Client dependencies
    ├── public/               # Static files
    ├── src/
    │   ├── App.js           # Main application component
    │   ├── index.js         # React entry point
    │   ├── contexts/
    │   │   └── AuthContext.js   # Authentication context
    │   ├── services/
    │   │   └── api.js          # API communication layer
    │   ├── styles/
    │   │   └── GlobalStyle.js   # Global CSS styles
    │   └── components/         # React components
    │       ├── Auth/           # Authentication components
    │       │   ├── Login.js
    │       │   └── Register.js
    │       ├── Dashboard/      # Main dashboard components
    │       │   ├── Dashboard.js
    │       │   ├── Header.js
    │       │   ├── Sidebar.js
    │       │   ├── Overview.js
    │       │   ├── Accounts.js
    │       │   ├── Transfer.js
    │       │   ├── Transactions.js
    │       │   └── Profile.js
    │       └── UI/            # Reusable UI components
    │           └── Loading.js
    └── build/               # Production build (after npm run build)
```

## 🎯 Usage Guide

### 1. Create Your Account
- Click "Sign up" on the login page
- Fill in your personal information
- Verify your email address
- You'll automatically get a checking account with $1000 starting balance

### 2. Dashboard Overview
- View all your accounts and balances
- See recent transaction activity
- Quick access to common banking functions
- Real-time balance updates

### 3. Account Management
- Create additional accounts (Checking, Savings, Credit)
- View account details and balances
- Monitor account status and activity
- Toggle balance visibility for privacy

### 4. Banking Operations
- **Transfer Money**: Move funds between your accounts instantly
- **Deposit Funds**: Add money to any of your accounts
- **Withdraw Funds**: Remove money from accounts with sufficient balance
- **View History**: Complete transaction history with filtering options

### 5. Profile Management
- View and update personal information
- Monitor account security status
- Track banking statistics and activity

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/profile` - Get user profile

### Account Management
- `GET /api/accounts` - Get user accounts
- `POST /api/accounts` - Create new account
- `GET /api/accounts/:accountNumber/balance` - Get account balance

### Transactions
- `POST /api/transactions/deposit` - Deposit money
- `POST /api/transactions/withdraw` - Withdraw money
- `POST /api/transactions/transfer` - Transfer between accounts
- `GET /api/transactions/:accountNumber` - Get transaction history

### Health Check
- `GET /api/health` - API health status

## 🛡️ Security Features

- **Authentication**: JWT token-based authentication with 24-hour expiration
- **Password Security**: Bcrypt encryption with salt rounds
- **Input Validation**: Express-validator for all user inputs
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS Protection**: Configured cross-origin resource sharing
- **SQL Injection Prevention**: Parameterized database queries
- **XSS Protection**: Helmet.js security headers

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with Inter font
- **Responsive Layout**: Mobile-first design that works on all devices
- **Smooth Animations**: Framer Motion animations for enhanced UX
- **Real-time Feedback**: Toast notifications for all actions
- **Loading States**: Proper loading indicators throughout the app
- **Error Handling**: Graceful error messages and recovery

## 📋 Dependencies

### Backend
- **Express.js**: Web server framework
- **SQLite3**: Lightweight database
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **express-validator**: Input validation
- **express-rate-limit**: Rate limiting
- **helmet**: Security headers
- **cors**: Cross-origin requests
- **uuid**: Unique ID generation

### Frontend
- **React 18**: Modern React with hooks
- **React Router**: Client-side routing
- **Styled Components**: CSS-in-JS styling
- **Framer Motion**: Smooth animations
- **Axios**: HTTP client for API calls
- **React Toastify**: Toast notifications
- **React Icons**: Comprehensive icon library

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Create a `.env` file in the root directory:
```
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=production
```

### Database
The SQLite database (`banking.db`) is created automatically when the server starts. For production, consider migrating to PostgreSQL or MySQL.

## 🧪 Testing

### Test User Accounts
After running the application, you can create test accounts:

1. Register with any valid email
2. You'll get a checking account with $1000 starting balance
3. Create additional accounts for testing transfers
4. Try all banking operations to see the system in action

### Sample Test Data
- **Deposit**: Add $500 to your checking account
- **Transfer**: Move $200 from checking to savings
- **Withdraw**: Take out $100 from your account
- **View History**: Check all your transactions

## 📞 Support

For support, feature requests, or bug reports, please check the application's error handling and toast notifications for guidance.

## 📄 License

This project is licensed under the MIT License.

---

**Banking System Pro** - Your complete digital banking solution! 🏦✨