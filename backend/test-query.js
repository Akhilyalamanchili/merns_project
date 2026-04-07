require('dotenv').config();
const mongoose = require('mongoose');
const Note = require('./models/Note');
const fs = require('fs');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const notes = await Note.find({ pdfUrl: { $exists: true } });
    fs.writeFileSync('db_out.json', JSON.stringify(notes, null, 2));
    process.exit();
});
