const fs = require('fs');
const path = require('path');

async function createBulkPosts() {
  const API_URL = 'http://localhost:5000/api';
  let token = '';
  
  console.log('🚀 Starting Bulk Post Creation with Real Images...\n');

  try {
    // 1. Authenticate
    console.log('Logging in...');
    let loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test_suite@engineerhouse.com', password: 'password123' })
    });

    if (!loginRes.ok) {
        loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@engineerhouse.com', password: 'password123' })
        });
    }

    const loginData = await loginRes.json();
    token = loginData.token;
    console.log('✅ Logged in.\n');

    // 2. Clear old test posts (optional but makes it clean)
    console.log('Cleaning up old test posts...');
    const getRes = await fetch(`${API_URL}/posts/admin`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const oldPosts = await getRes.json();
    for (const p of oldPosts) {
        if (p.title.includes('Test') || p.title.includes('Smart Home') || p.title.includes('Arduino') || p.title.includes('Multimeter')) {
            await fetch(`${API_URL}/posts/${p._id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        }
    }
    console.log('✅ Cleanup complete.\n');

    const categories = ['IoT Projects', 'Electronics Circuits', 'DIY Projects'];
    const projects = [
        {
            title: 'Smart Home Automation using ESP32',
            image: 'C:\\Users\\krish\\.gemini\\antigravity\\brain\\0ef090df-1850-4dd6-8670-2e58fccf5641\\smart_home_esp32_1777785172761.png'
        },
        {
            title: 'Getting Started with Arduino Uno',
            image: 'C:\\Users\\krish\\.gemini\\antigravity\\brain\\0ef090df-1850-4dd6-8670-2e58fccf5641\\arduino_uno_starter_1777785190356.png'
        },
        {
            title: 'Build Your Own Digital Multimeter',
            image: 'C:\\Users\\krish\\.gemini\\antigravity\\brain\\0ef090df-1850-4dd6-8670-2e58fccf5641\\digital_multimeter_diy_1777785206890.png'
        },
        {
            title: 'Home Security System with Motion Sensors',
            image: 'C:\\Users\\krish\\.gemini\\antigravity\\brain\\0ef090df-1850-4dd6-8670-2e58fccf5641\\home_security_sensors_1777785229961.png'
        },
        {
            title: 'Wireless Weather Station Project',
            image: 'C:\\Users\\krish\\.gemini\\antigravity\\brain\\0ef090df-1850-4dd6-8670-2e58fccf5641\\wireless_weather_station_1777785246838.png'
        },
        {
            title: 'Introduction to PCB Designing',
            image: 'C:\\Users\\krish\\.gemini\\antigravity\\brain\\0ef090df-1850-4dd6-8670-2e58fccf5641\\pcb_design_layout_1777785262698.png'
        }
    ];

    for (let i = 0; i < projects.length; i++) {
        const proj = projects[i];
        console.log(`Creating post ${i + 1}: ${proj.title}...`);

        if (!fs.existsSync(proj.image)) {
            console.error(`❌ Image not found: ${proj.image}`);
            continue;
        }

        const fileContent = fs.readFileSync(proj.image);

        // Upload image
        const formData = new FormData();
        const blob = new Blob([fileContent], { type: 'image/png' });
        formData.append('image', blob, `img_${i}.png`);

        const uploadRes = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        const uploadData = await uploadRes.json();
        const imagePath = uploadData.filePath;

        // Create Post
        const postRes = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: proj.title,
                summary: `Master the art of ${proj.title.toLowerCase()} with this detailed, step-by-step tutorial. Includes full circuit diagrams and tested source code.`,
                content: `<h2>Project Overview</h2><p>This tutorial covers the complete implementation of ${proj.title}.</p><h3>What You Will Learn</h3><ul><li>Component selection and circuit wiring.</li><li>Firmware development and debugging.</li><li>Integration and testing.</li></ul><p>Follow along to build your own high-quality electronics project.</p>`,
                category: categories[i % categories.length],
                tags: ['Electronics', 'Tutorial', 'Project'],
                image: imagePath,
                isPublished: true
            })
        });

        if (postRes.ok) {
            console.log(`✅ Post ${i + 1} created successfully!`);
        } else {
            console.error(`❌ Failed to create post ${i + 1}:`, await postRes.text());
        }
    }

    console.log('\n🎉 Finished creating 6 posts with high-quality images!');

  } catch (error) {
    console.error('\n❌ Bulk creation failed!');
    console.error(error.message);
  }
}

createBulkPosts();
