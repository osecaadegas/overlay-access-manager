const fetch = require('node-fetch');

async function createAdminUser() {
  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'ADMIN'
      })
    });

    const data = await response.json();
    console.log('Admin user created:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createAdminUser();
