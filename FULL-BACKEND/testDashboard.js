const axios = require('axios');

async function test() {
  try {
    const res = await axios.get('http://localhost:5000/api/admin/dashboard', {
        // Need to pass token if it's protected
    });
    console.log('Success:', res.data.data.students);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
