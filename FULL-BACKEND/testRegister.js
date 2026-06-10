const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test Student',
      email: 'test' + Date.now() + '@student.com',
      password: 'password123',
      role: 'student',
      adminCreate: true,
      course: 'Class 10-A',
      session: '2026-2027',
      status: 'Pending'
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
}

test();
