const supabase = require('../config/supabase');

// Middleware to check if user is authenticated
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header required' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token required' });
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error('Auth User Error:', error);
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    return res.status(500).json({ error: 'Internal server error during auth' });
  }
};

// Middleware to check user role
const requireRole = (role) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error || !profile) {
        console.error('Role Check Error:', error);
        return res.status(403).json({ error: 'Access denied: Profile not found' });
      }

      if (profile.role !== role) {
        return res.status(403).json({ error: `Access denied: Requires ${role} role` });
      }

      next();
    } catch (err) {
      console.error('Role Middleware Error:', err);
      return res.status(500).json({ error: 'Internal server error during role check' });
    }
  };
};

module.exports = { requireAuth, requireRole };
