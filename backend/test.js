const fs = require('fs');
const path = require('path');

async function runComprehensiveTests() {
  const API_URL = 'http://localhost:5000/api';
  let token = '';
  let postId = '';
  let imagePath = '';
  
  console.log('🚀 Starting Comprehensive Backend Tests...\n');

  try {
    // ---------------------------------------------------------
    // 1. AUTHENTICATION TESTS
    // ---------------------------------------------------------
    console.log('--- Auth Tests ---');
    console.log('Testing: POST /api/auth/login or register');
    
    let loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test_suite@engineerhouse.com', password: 'password123' })
    });

    if (!loginRes.ok) {
      console.log('Test user not found, registering test user...');
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
    // 2. UPLOAD TEST
    // ---------------------------------------------------------
    console.log('--- Upload Tests ---');
    console.log('Testing: POST /api/upload');
    
    // Create a dummy text file to upload as image (for testing purposes, multer doesn't strictly check content)
    const dummyFilePath = path.join(__dirname, 'dummy_test_image.jpg');
    fs.writeFileSync(dummyFilePath, 'dummy image content');
    
    const formData = new FormData();
    const fileContent = fs.readFileSync(dummyFilePath);
    const blob = new Blob([fileContent], { type: 'image/jpeg' });
    formData.append('image', blob, 'dummy_test_image.jpg');

    const uploadRes = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const uploadData = await uploadRes.json();
    if (!uploadRes.ok) throw new Error(`Upload failed: ${JSON.stringify(uploadData)}`);
    
    imagePath = uploadData.filePath;
    console.log(`✅ Upload successful! File path: ${imagePath}\n`);

    // Clean up dummy file
    fs.unlinkSync(dummyFilePath);

    // ---------------------------------------------------------
    // 3. POSTS CRUD TESTS
    // ---------------------------------------------------------
    console.log('--- Posts CRUD Tests ---');
    
    // CREATE
    console.log('Testing: POST /api/posts');
    const createRes = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'Comprehensive Test Post',
        summary: 'Testing the entire CRUD lifecycle.',
        content: '<p>Test content</p>',
        category: 'Electronics Circuits',
        tags: ['test', 'automated'],
        image: imagePath,
        isPublished: false
      })
    });
    
    const createData = await createRes.json();
    if (!createRes.ok) throw new Error(`Create post failed: ${JSON.stringify(createData)}`);
    postId = createData.post._id;
    console.log(`✅ Post created! ID: ${postId}`);

    // GET ALL (ADMIN)
    console.log('Testing: GET /api/posts/admin');
    const getAdminRes = await fetch(`${API_URL}/posts/admin`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!getAdminRes.ok) throw new Error(`Get admin posts failed`);
    const adminPosts = await getAdminRes.json();
    console.log(`✅ Admin fetched all posts! Total: ${adminPosts.length}`);

    // UPDATE
    console.log('Testing: PUT /api/posts/:id');
    const updateRes = await fetch(`${API_URL}/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'Comprehensive Test Post - UPDATED'
      })
    });
    if (!updateRes.ok) throw new Error(`Update post failed`);
    console.log('✅ Post updated!');

    // TOGGLE PUBLISH
    console.log('Testing: PATCH /api/posts/:id/publish');
    const publishRes = await fetch(`${API_URL}/posts/${postId}/publish`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const publishData = await publishRes.json();
    if (!publishRes.ok) throw new Error(`Publish toggle failed`);
    console.log(`✅ Post publish status toggled! isPublished: ${publishData.post.isPublished}`);

    // GET SINGLE (PUBLIC)
    console.log('Testing: GET /api/posts/:id');
    const getSingleRes = await fetch(`${API_URL}/posts/${postId}`);
    if (!getSingleRes.ok) {
      console.log('⚠️ Failed to get single public post (expected if not published)');
      if (publishData.post.isPublished) {
         throw new Error(`Should have fetched published post, but got ${getSingleRes.status}`);
      }
    } else {
      console.log('✅ Public post fetched!');
    }

    // DELETE
    console.log('Testing: DELETE /api/posts/:id');
    const deleteRes = await fetch(`${API_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!deleteRes.ok) throw new Error(`Delete post failed`);
    console.log('✅ Post deleted!');

    console.log('\n🎉 ALL COMPREHENSIVE TESTS PASSED SUCCESSFULLY! 🎉');

  } catch (error) {
    console.error('\n❌ TEST SUITE FAILED!');
    console.error(error.message);
  }
}

runComprehensiveTests();
