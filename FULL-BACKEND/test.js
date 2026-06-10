const register = async () => {
  try {
    const res = await fetch('http://127.0.0.1:5001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'educator@school.edu',
        password: 'password123',
        role: 'educator'
      })
    });
    const data = await res.json();
    console.log("REGISTER RESPONSE:", data);
  } catch (err) {
    console.error("ERROR:", err);
  }
};

register();
