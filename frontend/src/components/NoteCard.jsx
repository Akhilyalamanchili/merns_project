import { format } from 'date-fns';
import { Edit2, Tag, Trash2, FileText, CheckCircle2 } from 'lucide-react';
import './NoteCard.css';

const NoteCard = ({ note, onEdit, onDelete, currentUser }) => {
    const noteAuthorId = note.author?._id || note.author?.id;
    const isOwner = !note.author || noteAuthorId === currentUser?.id;

    return (
        <div className="card note-card animate-fade-in">
            <div className="note-card-header">
                <h3>{note.title}</h3>
                {isOwner && (
                    <div className="note-card-actions">
                        <button className="icon-btn edit-btn" title="Edit Note" onClick={() => onEdit(note)}>
                            <Edit2 size={16} />
                        </button>
                        <button className="icon-btn delete-btn" title="Delete Note" onClick={() => onDelete(note._id || note.id)}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
            </div>
            <div
                className="note-content ql-editor"
                dangerouslySetInnerHTML={{ __html: note.content }}
            />
            <div className="note-footer">
                <span className="note-date">{format(new Date(note.updatedAt), 'MMM d, yyyy')}</span>
                {note.category && (
                    <span className={`note-category badge ${note.category.toLowerCase()}`} style={note.category === 'Official' ? {backgroundColor: '#fef3c7', color: '#d97706', border: '1px solid #fcd34d'} : {}}>
                        {note.category === 'Official' ? <CheckCircle2 size={12} /> : <Tag size={12} />}
                        {note.category}
                    </span>
                )}
                {note.pdfUrl && (
                    <a href={`http://localhost:5000/${note.pdfUrl}`} target="_blank" rel="noreferrer" className="note-category badge public" style={{ textDecoration: 'none', background: '#e0e7ff', color: '#4338ca' }} onClick={(e) => e.stopPropagation()}>
                        <FileText size={12} />
                        Attached PDF
                    </a>
                )}
                {!isOwner && note.author && (
                    <span className="note-author badge">
                        <span className="author-avatar">{note.author.avatar}</span>
                        {note.author.name}
                    </span>
                )}
            </div>
        </div>
    );
};

export default NoteCard;
