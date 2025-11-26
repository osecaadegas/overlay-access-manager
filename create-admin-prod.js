// Run this script after deployment to create an admin user
// Usage: node create-admin-prod.js https://your-app.vercel.app

const https = require('https');

const args = process.argv.slice(2);
const baseUrl = args[0] || 'http://localhost:3000';

const data = JSON.stringify({
  email: 'admin@example.com',
  password: 'admin123',
  name: 'Admin User',
  role: 'ADMIN'
});

const url = new URL('/api/auth/register', baseUrl);
const options = {
  hostname: url.hostname,
  port: url.port || (url.protocol === 'https:' ? 443 : 80),
  path: url.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

console.log(`🔄 Creating admin user at ${baseUrl}...`);

const protocol = url.protocol === 'https:' ? https : require('http');

const req = protocol.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log(`\n📊 Response Status: ${res.statusCode}`);
    try {
      const json = JSON.parse(responseData);
      console.log('📦 Response:', JSON.stringify(json, null, 2));
      
      if (res.statusCode === 201) {
        console.log('\n✅ Admin user created successfully!');
        console.log('📧 Email: admin@example.com');
        console.log('🔑 Password: admin123');
        console.log('\n⚠️  Please change the password after first login!');
      } else if (res.statusCode === 409) {
        console.log('\n⚠️  User already exists. Try logging in instead.');
      } else {
        console.log('\n❌ Failed to create user.');
      }
    } catch (e) {
      console.log('Response:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
  console.log('\nTroubleshooting:');
  console.log('1. Make sure your app is deployed and accessible');
  console.log('2. Verify the URL is correct');
  console.log('3. Check that the database is set up (run: npx prisma db push)');
});

req.write(data);
req.end();
