const express = require('express');
const multer = require('multer');
const path = require('path');
const { getNotes, createNote, updateNote, deleteNote } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const router = express.Router();

router.route('/')
    .get(protect, getNotes)
    .post(protect, upload.single('pdfFile'), createNote);

router.route('/:id')
    .put(protect, upload.single('pdfFile'), updateNote)
    .delete(protect, deleteNote);

module.exports = router;
