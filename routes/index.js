const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const prisma = require('../prisma/prisma')


// Middleware for authentication and authorization
function authenticateAndAuthorize(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.redirect('/login');
    }

    // Verify the JWT token
    jwt.verify(token, 'your-secret-key', (error, decodedToken) => {
      if (error) {
        return res.redirect('/login');
      }

      const userId = decodedToken.userId;

      // Attach the user ID to the request object
      req.userId = userId;

      next();
    });
  } catch (error) {
    console.error('Error authenticating and authorizing:', error);
    res.status(500).json({ error: 'An error occurred while authenticating and authorizing' });
  }
}

// Sign up a new user
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        OR: [
          { username },
          { email },
        ],
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        verified: false
      },
    });

    const token = generateVerificationToken();

    //Update the user record with the verification token
    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken: token },
    });

    // Send the verification email
    sendVerificationEmail(email, name, token);


    res.json({ message: 'User signed up successfully. Please check your email for verification.' });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'An error occurred while signing up' });
  }
});


// Email verification route
router.get('/verify/:email', async (req, res) => {
  const { email } = req.params;

  try {
    // Update the user's verified status in the database
    await prisma.user.update({
      where: { email },
      data: { verified: true },
    });

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ error: 'An error occurred while verifying email' });
  }
});


// Sign-in route
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if the user is verified
    if (!user.verified) {
      return res.status(401).json({ error: 'Email not verified' });
    }

    res.json({ message: 'Sign-in successful' });
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).json({ error: 'An error occurred while signing in' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});





//Get Routes

// home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// Login page
router.get('/login', (req, res) => {
  res.send('Login page');
});

// Dashboard page
router.get('/dashboard', authenticateAndAuthorize, (req, res) => {
  res.send('Dashboard page');
});

// Protected route accessible only to authenticated users
router.get('/protected', authenticateAndAuthorize, (req, res) => {
  const { userId } = req;
  // ...
  // Logic for accessing protected resources
  // ...
});
module.exports = router;
