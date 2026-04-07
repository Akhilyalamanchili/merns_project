const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, enum: ['Private', 'Public', 'Official'], default: 'Public' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pdfUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
