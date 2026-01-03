const supabase = require('../config/supabase');

// --- TEACHER MANAGEMENT ---

exports.createTeacher = async (req, res) => {
  const { email, password, fullName, department } = req.body;
  try {
    // 1. Create Auth User
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true // Auto confirm
    });

    if (authError) return res.status(400).json({ error: authError.message });
    const userId = authData.user.id;

    // 2. Create Profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ id: userId, role: 'teacher' });
    
    if (profileError) return res.status(400).json({ error: 'Profile creation failed: ' + profileError.message });

    // 3. Create Teacher Record
    const { data: teacherData, error: teacherError } = await supabase
      .from('teachers')
      .insert({ id: userId, full_name: fullName, department })
      .select()
      .single();

    if (teacherError) return res.status(400).json({ error: 'Teacher record failed: ' + teacherError.message });

    res.status(201).json({ message: 'Teacher created successfully', teacher: teacherData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --- STUDENT MANAGEMENT ---

exports.createStudent = async (req, res) => {
  const { email, password, rollNumber, fullName, hobbies, marks } = req.body;
  
  const missingFields = [];
  if (!email) missingFields.push('email');
  if (!password) missingFields.push('password');
  if (!rollNumber) missingFields.push('rollNumber');
  if (!fullName) missingFields.push('fullName');

  if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
  }

  try {
    // 1. Create Auth User
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    });

    if (authError) return res.status(400).json({ error: authError.message });
    const userId = authData.user.id;

    // 2. Create Profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({ id: userId, role: 'student' });
    
    if (profileError) {
        
        return res.status(400).json({ error: 'Profile creation failed: ' + profileError.message });
    }

    // 3. Create Student Record
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .insert({
        id: userId,
        roll_number: rollNumber,
        full_name: fullName,
        email,
        hobbies,
        marks,
        created_by: req.user.id // The teacher creating them
      })
      .select()
      .single();

    if (studentError) return res.status(400).json({ error: 'Student record failed: ' + studentError.message });

    res.status(201).json({ message: 'Student created successfully', student: studentData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*');

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) return res.status(404).json({ error: 'Student not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .update(req.body) 
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    
    const { error } = await supabase.auth.admin.deleteUser(req.params.id);
    
    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: 'Student and associated account deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
