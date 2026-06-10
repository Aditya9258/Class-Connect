const axios = require('axios');

async function test() {
  try {
    const res = await axios.patch('http://localhost:5000/api/admin/config', {
      timetables: []
    }, {
      headers: {
        Cookie: 'jwt_refresh=test'
      }
    });
    console.log(res.status, res.data);
  } catch (err) {
    console.log(err.response ? err.response.status + ' ' + JSON.stringify(err.response.data) : err.message);
  }
}
test();
