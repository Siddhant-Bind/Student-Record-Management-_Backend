const supabase = require('../config/supabase');

exports.getMe = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Student record not found' });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMe = async (req, res) => {
  const { email, hobbies } = req.body;
  try {
    // Basic validation
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const { data, error } = await supabase
      .from('students')
      .update({ email, hobbies })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
