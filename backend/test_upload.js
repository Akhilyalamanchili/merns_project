const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const path = require('path');

async function run() {
    try {
        // Register a user
        console.log("Registering test user...");
        const email = 'test' + Date.now() + '@example.com';
        const res = await axios.post('http://localhost:5000/api/auth/register', {
            name: 'Test', email, password: 'password'
        });
        const token = res.data.token;
        console.log("Got token!", token);

        // Upload a note with PDF
        console.log("Attempting upload...");
        const form = new FormData();
        form.append('title', 'Test PDF Note');
        form.append('content', 'Testing upload');
        form.append('category', 'Public');
        
        // Ensure a dummy PDF exists
        const dummyPath = path.join(__dirname, '../dummy.pdf');
        if (!fs.existsSync(dummyPath)) {
            fs.writeFileSync(dummyPath, Buffer.from('%PDF-1.0\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 3 3]>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\n0000000102 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n149\n%EOF\n'));
        }
        
        form.append('pdfFile', fs.createReadStream(dummyPath));

        const uploadRes = await axios.post('http://localhost:5000/api/notes', form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log("Upload Success:", uploadRes.data);
    } catch(err) {
        console.error("Upload Error:", err.response ? err.response.data : err.message);
    }
}
run();
