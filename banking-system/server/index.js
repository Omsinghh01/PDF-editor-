const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Initialize SQLite database
const db = new sqlite3.Database('banking.db');

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT UNIQUE,
      email TEXT UNIQUE,
      password TEXT,
      first_name TEXT,
      last_name TEXT,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Accounts table
  db.run(`
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account_number TEXT UNIQUE,
      user_id TEXT,
      account_type TEXT,
      balance REAL DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (user_id)
    )
  `);

  // Transactions table
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transaction_id TEXT UNIQUE,
      from_account TEXT,
      to_account TEXT,
      amount REAL,
      transaction_type TEXT,
      description TEXT,
      status TEXT DEFAULT 'completed',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// User Registration
app.post('/api/auth/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().isLength({ min: 1 }),
  body('lastName').trim().isLength({ min: 1 }),
  body('phone').isMobilePhone()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, firstName, lastName, phone } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    db.run(
      'INSERT INTO users (user_id, email, password, first_name, last_name, phone) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, email, hashedPassword, firstName, lastName, phone],
      function(err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT') {
            return res.status(400).json({ error: 'Email already exists' });
          }
          return res.status(500).json({ error: 'Registration failed' });
        }

        // Create default checking account
        const accountNumber = 'ACC' + Math.random().toString(36).substr(2, 9).toUpperCase();
        db.run(
          'INSERT INTO accounts (account_number, user_id, account_type, balance) VALUES (?, ?, ?, ?)',
          [accountNumber, userId, 'checking', 1000], // Start with $1000
          (err) => {
            if (err) {
              console.error('Error creating default account:', err);
            }
          }
        );

        const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({
          message: 'User registered successfully',
          token,
          user: { userId, email, firstName, lastName }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User Login
app.post('/api/auth/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 1 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Login failed' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.user_id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({
      message: 'Login successful',
      token,
      user: {
        userId: user.user_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      }
    });
  });
});

// Get user accounts
app.get('/api/accounts', authenticateToken, (req, res) => {
  db.all('SELECT * FROM accounts WHERE user_id = ? AND status = "active"', [req.user.userId], (err, accounts) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch accounts' });
    }
    res.json(accounts);
  });
});

// Create new account
app.post('/api/accounts', authenticateToken, [
  body('accountType').isIn(['checking', 'savings', 'credit'])
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { accountType } = req.body;
  const accountNumber = 'ACC' + Math.random().toString(36).substr(2, 9).toUpperCase();

  db.run(
    'INSERT INTO accounts (account_number, user_id, account_type, balance) VALUES (?, ?, ?, ?)',
    [accountNumber, req.user.userId, accountType, 0],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create account' });
      }
      res.status(201).json({
        message: 'Account created successfully',
        account: {
          id: this.lastID,
          accountNumber,
          accountType,
          balance: 0
        }
      });
    }
  );
});

// Get account balance
app.get('/api/accounts/:accountNumber/balance', authenticateToken, (req, res) => {
  const { accountNumber } = req.params;
  
  db.get(
    'SELECT balance, account_type FROM accounts WHERE account_number = ? AND user_id = ?',
    [accountNumber, req.user.userId],
    (err, account) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to fetch balance' });
      }
      if (!account) {
        return res.status(404).json({ error: 'Account not found' });
      }
      res.json({ balance: account.balance, accountType: account.account_type });
    }
  );
});

// Deposit money
app.post('/api/transactions/deposit', authenticateToken, [
  body('accountNumber').isLength({ min: 1 }),
  body('amount').isFloat({ min: 0.01 }),
  body('description').optional().isLength({ max: 255 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { accountNumber, amount, description = 'Deposit' } = req.body;
  const transactionId = uuidv4();

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    // Verify account ownership
    db.get(
      'SELECT * FROM accounts WHERE account_number = ? AND user_id = ?',
      [accountNumber, req.user.userId],
      (err, account) => {
        if (err || !account) {
          db.run('ROLLBACK');
          return res.status(404).json({ error: 'Account not found' });
        }

        // Update account balance
        db.run(
          'UPDATE accounts SET balance = balance + ? WHERE account_number = ?',
          [amount, accountNumber],
          (err) => {
            if (err) {
              db.run('ROLLBACK');
              return res.status(500).json({ error: 'Transaction failed' });
            }

            // Record transaction
            db.run(
              'INSERT INTO transactions (transaction_id, to_account, amount, transaction_type, description) VALUES (?, ?, ?, ?, ?)',
              [transactionId, accountNumber, amount, 'deposit', description],
              (err) => {
                if (err) {
                  db.run('ROLLBACK');
                  return res.status(500).json({ error: 'Transaction failed' });
                }

                db.run('COMMIT');
                res.json({
                  message: 'Deposit successful',
                  transactionId,
                  amount,
                  newBalance: account.balance + amount
                });
              }
            );
          }
        );
      }
    );
  });
});

// Withdraw money
app.post('/api/transactions/withdraw', authenticateToken, [
  body('accountNumber').isLength({ min: 1 }),
  body('amount').isFloat({ min: 0.01 }),
  body('description').optional().isLength({ max: 255 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { accountNumber, amount, description = 'Withdrawal' } = req.body;
  const transactionId = uuidv4();

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    // Verify account and sufficient balance
    db.get(
      'SELECT * FROM accounts WHERE account_number = ? AND user_id = ?',
      [accountNumber, req.user.userId],
      (err, account) => {
        if (err || !account) {
          db.run('ROLLBACK');
          return res.status(404).json({ error: 'Account not found' });
        }

        if (account.balance < amount) {
          db.run('ROLLBACK');
          return res.status(400).json({ error: 'Insufficient funds' });
        }

        // Update account balance
        db.run(
          'UPDATE accounts SET balance = balance - ? WHERE account_number = ?',
          [amount, accountNumber],
          (err) => {
            if (err) {
              db.run('ROLLBACK');
              return res.status(500).json({ error: 'Transaction failed' });
            }

            // Record transaction
            db.run(
              'INSERT INTO transactions (transaction_id, from_account, amount, transaction_type, description) VALUES (?, ?, ?, ?, ?)',
              [transactionId, accountNumber, amount, 'withdrawal', description],
              (err) => {
                if (err) {
                  db.run('ROLLBACK');
                  return res.status(500).json({ error: 'Transaction failed' });
                }

                db.run('COMMIT');
                res.json({
                  message: 'Withdrawal successful',
                  transactionId,
                  amount,
                  newBalance: account.balance - amount
                });
              }
            );
          }
        );
      }
    );
  });
});

// Transfer money
app.post('/api/transactions/transfer', authenticateToken, [
  body('fromAccount').isLength({ min: 1 }),
  body('toAccount').isLength({ min: 1 }),
  body('amount').isFloat({ min: 0.01 }),
  body('description').optional().isLength({ max: 255 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fromAccount, toAccount, amount, description = 'Transfer' } = req.body;
  const transactionId = uuidv4();

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    // Verify source account ownership and balance
    db.get(
      'SELECT * FROM accounts WHERE account_number = ? AND user_id = ?',
      [fromAccount, req.user.userId],
      (err, sourceAccount) => {
        if (err || !sourceAccount) {
          db.run('ROLLBACK');
          return res.status(404).json({ error: 'Source account not found' });
        }

        if (sourceAccount.balance < amount) {
          db.run('ROLLBACK');
          return res.status(400).json({ error: 'Insufficient funds' });
        }

        // Verify destination account exists
        db.get(
          'SELECT * FROM accounts WHERE account_number = ?',
          [toAccount],
          (err, destAccount) => {
            if (err || !destAccount) {
              db.run('ROLLBACK');
              return res.status(404).json({ error: 'Destination account not found' });
            }

            // Update balances
            db.run(
              'UPDATE accounts SET balance = balance - ? WHERE account_number = ?',
              [amount, fromAccount],
              (err) => {
                if (err) {
                  db.run('ROLLBACK');
                  return res.status(500).json({ error: 'Transfer failed' });
                }

                db.run(
                  'UPDATE accounts SET balance = balance + ? WHERE account_number = ?',
                  [amount, toAccount],
                  (err) => {
                    if (err) {
                      db.run('ROLLBACK');
                      return res.status(500).json({ error: 'Transfer failed' });
                    }

                    // Record transaction
                    db.run(
                      'INSERT INTO transactions (transaction_id, from_account, to_account, amount, transaction_type, description) VALUES (?, ?, ?, ?, ?, ?)',
                      [transactionId, fromAccount, toAccount, amount, 'transfer', description],
                      (err) => {
                        if (err) {
                          db.run('ROLLBACK');
                          return res.status(500).json({ error: 'Transfer failed' });
                        }

                        db.run('COMMIT');
                        res.json({
                          message: 'Transfer successful',
                          transactionId,
                          amount,
                          fromAccount,
                          toAccount
                        });
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  });
});

// Get transaction history
app.get('/api/transactions/:accountNumber', authenticateToken, (req, res) => {
  const { accountNumber } = req.params;
  const limit = parseInt(req.query.limit) || 50;
  const offset = parseInt(req.query.offset) || 0;

  // Verify account ownership
  db.get(
    'SELECT * FROM accounts WHERE account_number = ? AND user_id = ?',
    [accountNumber, req.user.userId],
    (err, account) => {
      if (err || !account) {
        return res.status(404).json({ error: 'Account not found' });
      }

      // Get transactions
      db.all(
        `SELECT * FROM transactions 
         WHERE from_account = ? OR to_account = ? 
         ORDER BY created_at DESC 
         LIMIT ? OFFSET ?`,
        [accountNumber, accountNumber, limit, offset],
        (err, transactions) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to fetch transactions' });
          }
          res.json(transactions);
        }
      );
    }
  );
});

// Get user profile
app.get('/api/profile', authenticateToken, (req, res) => {
  db.get(
    'SELECT user_id, email, first_name, last_name, phone, created_at FROM users WHERE user_id = ?',
    [req.user.userId],
    (err, user) => {
      if (err || !user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    }
  );
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Banking System Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});