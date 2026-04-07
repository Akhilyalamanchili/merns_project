import { useState, useEffect } from 'react';
import { X, FileText } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './NoteModal.css';

const NoteModal = ({ isOpen, onClose, onSave, noteToEdit, currentUser }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');
    const [pdfFile, setPdfFile] = useState(null);

    useEffect(() => {
        if (noteToEdit) {
            setTitle(noteToEdit.title);
            setContent(noteToEdit.content);
            setCategory(noteToEdit.category || '');
            setPdfFile(null);
        } else {
            setTitle('');
            setContent('');
            setCategory('');
            setPdfFile(null);
        }
    }, [noteToEdit, isOpen]);

    if (!isOpen) return null;

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'clean']
        ],
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            id: noteToEdit ? noteToEdit.id : Date.now().toString(),
            title,
            content,
            category,
            pdfFile,
            updatedAt: new Date().toISOString()
        });
    };

    return (
        <div className="modal-overlay animate-fade-in">
            <div className="modal-content card slide-in">
                <div className="modal-header">
                    <h2>{noteToEdit ? 'Edit Note' : 'Create Note'}</h2>
                    <button className="icon-btn close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Note Title"
                            className="input-control title-input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>
                    <div className="input-group">
                        <select
                            className="input-control"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">No Category</option>
                            <option value="Private">Private</option>
                            <option value="Public">Public</option>
                            {currentUser?.role === 'teacher' && <option value="Official">Official</option>}
                        </select>
                    </div>
                    
                    <div className="input-group" style={{ margin: '16px 0', padding: '16px', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
                        <span style={{ display: 'block', fontWeight: 600, marginBottom: '12px', color: '#1e293b' }}>
                          <FileText size={18} style={{ verticalAlign: 'text-bottom', marginRight: '4px' }} /> Attach PDF to Note
                        </span>
                        {noteToEdit?.pdfUrl && (
                             <div style={{ marginBottom: '8px', fontSize: '0.9rem', color: '#4338ca' }}>
                                Current Attachment: <a href={`http://localhost:5000/${noteToEdit.pdfUrl}`} target="_blank" rel="noreferrer" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>View File</a>
                             </div>
                        )}
                        <input type="file" accept="application/pdf" className="input-control" style={{ background: 'white', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '6px', width: '100%', cursor: 'pointer' }} onChange={(e) => setPdfFile(e.target.files[0])} />
                    </div>

                    <div className="input-group">
                        <ReactQuill
                            theme="snow"
                            value={content}
                            onChange={setContent}
                            modules={modules}
                            placeholder="Start typing your note here..."
                            className="quill-editor"
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Note</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NoteModal;
