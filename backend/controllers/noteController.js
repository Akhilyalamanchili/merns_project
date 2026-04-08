const Note = require('../models/Note');

const getNotes = async (req, res) => {
    try {
        // Get all public notes + user's private notes
        const notes = await Note.find({
            $or: [
                { category: 'Public' },
                { category: 'Official' },
                { author: req.user._id }
            ]
        }).populate('author', 'name email').sort({ updatedAt: -1 });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createNote = async (req, res) => {
    let { title, content, category } = req.body;
    try {
        const pdfUrl = req.file ? req.file.path.replace(/\\/g, '/') : undefined;
        
        let finalCategory = category || 'Private';
        if (req.user.role === 'teacher' && pdfUrl && finalCategory === 'Public') {
            finalCategory = 'Official';
        }

        const note = await Note.create({
            title,
            content,
            category: finalCategory,
            author: req.user._id,
            pdfUrl
        });
        const populatedNote = await Note.findById(note._id).populate('author', 'name email');
        res.status(201).json(populatedNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: 'Note not found' });

        // Check if user is the author
        if (note.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedData = { ...req.body };
        if (req.file) {
            updatedData.pdfUrl = req.file.path.replace(/\\/g, '/');
        }

        const currentPdfUrl = updatedData.pdfUrl || note.pdfUrl;
        const currentCategory = updatedData.category || note.category;
        if (req.user.role === 'teacher' && currentPdfUrl && currentCategory === 'Public') {
            updatedData.category = 'Official';
        }

        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        ).populate('author', 'name email');

        res.json(updatedNote);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: 'Note not found' });

        // Check if user is the author
        if (note.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await note.deleteOne();
        res.json({ message: 'Note removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getNotes, createNote, updateNote, deleteNote };
