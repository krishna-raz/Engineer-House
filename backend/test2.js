const fs = require('fs');
const path = require('path');

async function runImageTests() {
  const API_URL = 'http://localhost:5000/api';
  let token = '';
  
  console.log('🚀 Starting Image Upload Tests...\n');

  try {
    // ---------------------------------------------------------
    // 1. AUTHENTICATION
    // ---------------------------------------------------------
    console.log('1. Authenticating...');
    let loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test_suite@engineerhouse.com', password: 'password123' })
    });

    if (!loginRes.ok) {
      console.log('Registering test user...');
      loginRes = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Suite Admin',
          email: 'test_suite@engineerhouse.com',
          password: 'password123'
        })
      });
      if (!loginRes.ok) throw new Error(`Auth failed: ${await loginRes.text()}`);
    }

    const loginData = await loginRes.json();
    token = loginData.token;
    console.log('✅ Auth successful! Token acquired.\n');

    // ---------------------------------------------------------
    // 2. COVER IMAGE UPLOAD TEST (Real 2MB image)
    // ---------------------------------------------------------
    console.log('2. Testing Cover Image Upload (/api/upload)...');
    
    // We will use the logo.png from frontend/public which is ~2MB
    const realImagePath = path.join(__dirname, '../frontend/public/logo.png');
    
    if (!fs.existsSync(realImagePath)) {
        throw new Error(`Test image not found at ${realImagePath}`);
    }

    const formData = new FormData();
    const fileContent = fs.readFileSync(realImagePath);
    // Use a blob to construct the multipart form data
    const blob = new Blob([fileContent], { type: 'image/png' });
    formData.append('image', blob, 'test_logo.png');

    console.log(`Uploading file of size: ${(fileContent.length / 1024 / 1024).toFixed(2)} MB`);

    const uploadRes = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const uploadData = await uploadRes.json();
    if (!uploadRes.ok) throw new Error(`Upload failed: ${JSON.stringify(uploadData)}`);
    
    const coverImagePath = uploadData.filePath;
    console.log(`✅ Cover image upload successful! File path: ${coverImagePath}\n`);

    // ---------------------------------------------------------
    // 3. CONTENT BODY IMAGE TEST (Large Base64 payload)
    // ---------------------------------------------------------
    console.log('3. Testing Content Body with embedded Base64 image (/api/posts)...');
    
    // Convert the 2MB image to base64
    const base64Image = fileContent.toString('base64');
    const dataUri = `data:image/png;base64,${base64Image}`;
    
    // Creating a very large JSON payload to test express.json() limits
    const largeContentHtml = `<p>Here is an embedded image:</p><img src="${dataUri}" />`;
    console.log(`Sending JSON payload of size: ${(largeContentHtml.length / 1024 / 1024).toFixed(2)} MB`);

    const createRes = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'Image Test Post',
        summary: 'Testing cover image and base64 body image.',
        content: largeContentHtml,
        category: 'DIY Projects',
        tags: ['test', 'image'],
        image: coverImagePath,
        isPublished: false
      })
    });
    
    const createData = await createRes.json();
    if (!createRes.ok) throw new Error(`Create post failed: ${JSON.stringify(createData)}`);
    const postId = createData.post._id;
    console.log(`✅ Post with large Base64 content created! ID: ${postId}`);

    // Clean up
    console.log('\nCleaning up by deleting the test post...');
    await fetch(`${API_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Cleanup done!');

    console.log('\n🎉 ALL IMAGE TESTS PASSED SUCCESSFULLY! 🎉');

  } catch (error) {
    console.error('\n❌ IMAGE TEST FAILED!');
    console.error(error.message);
  }
}

runImageTests();
