const express = require('express');
const supabase = require('../config/supabase');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    res.json({ session: data.session, user: data.user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/logout', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
          await supabase.auth.admin.signOut(token); // Or just client side discard? 
          // Supabase stateless JWTs are hard to invalidate serverside without RLS or blacklist. 
          // auth.signOut() on client is standard. 
          // Server-side signOut takes a JWT.
          const { error } = await supabase.auth.signOut(token);
           if (error) console.error('Logout error', error);
      }
  }
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
