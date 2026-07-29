const express = require('express');
const bcrypt = require('bcryptjs');
const { getSupabase } = require('../db');
const { initialsFromName } = require('../utils/engagement');

const router = express.Router();

// MAT number format: DE.YYYY/NNNN  (e.g. DE.2021/5628)
const MAT_REGEX = /^DE\.\d{4}\/\d{4}$/i;

// Full name must have at least two words (first + last)
function isValidFullName(name) {
  if (!name || !name.trim()) return false;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.length >= 2;
}

router.post('/register', async (req, res, next) => {
  try {
    const { matNumber, fullName, level, password, faculty, department } = req.body;

    if (!matNumber?.trim() || !fullName?.trim() || !level || !password?.trim() || !faculty?.trim() || !department?.trim()) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!MAT_REGEX.test(matNumber.trim())) {
      return res.status(400).json({ error: 'Invalid MAT number format. Expected format: DE.YYYY/NNNN (e.g. DE.2021/5628)' });
    }

    if (!isValidFullName(fullName)) {
      return res.status(400).json({ error: 'Full name must include at least a first and last name' });
    }

    const supabase = getSupabase();

    // Check if user already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('mat_number', matNumber.trim().toUpperCase())
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ error: 'MAT number already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const initials = initialsFromName(fullName);

    const { data: user, error } = await supabase
      .from('users')
      .insert({
        mat_number: matNumber.trim().toUpperCase(),
        full_name: fullName.trim(),
        level,
        password_hash: passwordHash,
        initials,
        faculty: faculty.trim(),
        department: department.trim(),
      })
      .select()
      .single();

    if (error) {
      console.error('Register insert error:', error);
      return res.status(500).json({ error: 'Registration failed' });
    }

    res.status(201).json({
      userId: user.mat_number,
      matNumber: user.mat_number,
      fullName: user.full_name,
      initials: user.initials,
      level: user.level,
      faculty: user.faculty,
      department: user.department,
    });
  } catch (err) {
    next(err);
  }
});



router.post('/login', async (req, res, next) => {
  try {
    const { matNumber, password } = req.body;

    if (!matNumber?.trim() || !password?.trim()) {
      return res.status(400).json({ error: 'MAT number and password are required' });
    }

    if (!MAT_REGEX.test(matNumber.trim())) {
      return res.status(400).json({ error: 'Invalid MAT number format. Expected format: DE.YYYY/NNNN (e.g. DE.2021/5628)' });
    }

    const supabase = getSupabase();

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('mat_number', matNumber.trim().toUpperCase())
      .maybeSingle();

    if (error) {
      console.error('Login query error:', error);
      return res.status(500).json({ error: 'Login failed' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      userId: user.mat_number,
      matNumber: user.mat_number,
      fullName: user.full_name,
      initials: user.initials,
      level: user.level,
      faculty: user.faculty,
      department: user.department,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
