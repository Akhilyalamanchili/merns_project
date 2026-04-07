import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import './Dashboard.css';

const Dashboard = () => {
    const [notes, setNotes] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [noteToEdit, setNoteToEdit] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            setCurrentUser(JSON.parse(userStr));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const fetchNotes = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const res = await fetch('http://localhost:5000/api/notes', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setNotes(data);
            }
        } catch (error) {
            console.error("Failed to fetch notes:", error);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchNotes();
        }
    }, [currentUser]);

    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content?.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesCategory = false;
        const authorId = note.author?._id || note.author?.id;
        if (activeCategory === 'All') {
            matchesCategory = (authorId === currentUser?.id) || (note.category === 'Official');
        } else if (activeCategory === 'Private') {
            matchesCategory = note.category === 'Private' && authorId === currentUser?.id;
        } else if (activeCategory === 'Public') {
            matchesCategory = note.category === 'Public';
        } else if (activeCategory === 'Official') {
            matchesCategory = note.category === 'Official';
        }

        return matchesCategory && matchesSearch;
    });

    const handleCreateNote = () => {
        setNoteToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditNote = (note) => {
        setNoteToEdit(note);
        setIsModalOpen(true);
    };

    const handleSaveNote = async (savedNote) => {
        try {
            const token = localStorage.getItem('token');
            const noteId = noteToEdit ? (noteToEdit._id || noteToEdit.id) : null;
            const url = noteId ? `http://localhost:5000/api/notes/${noteId}` : 'http://localhost:5000/api/notes';
            const method = noteId ? 'PUT' : 'POST';

            const formData = new FormData();
            formData.append('title', savedNote.title);
            formData.append('content', savedNote.content);
            formData.append('category', savedNote.category);
            if (savedNote.pdfFile) {
                formData.append('pdfFile', savedNote.pdfFile);
            }

            const res = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                await fetchNotes(); // Refresh to get populated author
            } else {
                console.error("Failed to save note", await res.text());
            }
        } catch (error) {
            console.error("Failed to save note:", error);
        }
        setIsModalOpen(false);
    };

    const handleDeleteNote = async (noteId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setNotes(notes.filter(n => n.id !== noteId && n._id !== noteId));
            }
        } catch (error) {
            console.error("Failed to delete note:", error);
        }
    };

    if (!currentUser) return null;


    return (
        <div className="dashboard-container">
            <Sidebar activeCategory={activeCategory} onSelectCategory={setActiveCategory} currentUser={currentUser} />

            <main className="main-content">
                <header className="topbar">
                    <div className="search-bar">
                        <Search className="search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <button className="btn btn-primary create-btn" onClick={handleCreateNote}>
                        <Plus size={18} />
                        <span>New Note</span>
                    </button>
                </header>

                <div className="notes-container">
                    <div className="notes-header">
                        <h2>{activeCategory === 'All' ? 'All Notes' : `${activeCategory} Notes`}</h2>
                        <span className="notes-count">{filteredNotes.length} notes</span>
                    </div>

                    {filteredNotes.length > 0 ? (
                        <div className="notes-grid">
                            {filteredNotes.map(note => (
                                <NoteCard
                                    key={note._id || note.id}
                                    note={note}
                                    onEdit={handleEditNote}
                                    onDelete={handleDeleteNote}
                                    currentUser={currentUser}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon-wrapper">
                                <Search size={32} className="empty-icon" />
                            </div>
                            <h3>No notes found</h3>
                            <p>Get started by creating a new note or modifying your search.</p>
                            <button className="btn btn-primary" onClick={handleCreateNote}>
                                Create Your First Note
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <NoteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveNote}
                noteToEdit={noteToEdit}
                currentUser={currentUser}
            />
        </div>
    );
};

export default Dashboard;
