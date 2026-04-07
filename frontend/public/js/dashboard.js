document.addEventListener('DOMContentLoaded', () => {
    // 1. Authentication Check & Setup
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
        window.location.href = 'login.html';
        return;
    }

    const currentUser = JSON.parse(userStr);

    // User Info Display
    document.getElementById('user-name').textContent = currentUser.name || 'Unknown User';
    document.getElementById('user-email').textContent = currentUser.email || '';
    if (currentUser.name) {
        document.getElementById('user-avatar-initials').textContent =
            currentUser.name.substring(0, 2).toUpperCase();
    }

    // Initialize Lucide Icons
    lucide.createIcons();

    // 2. State Management
    let notes = [];
    let activeCategory = 'All';
    let searchQuery = '';

    // 3. Setup Quill Editor
    // Using vanilla Quill
    const quill = new Quill('#quill-editor', {
        theme: 'snow',
        placeholder: 'Start typing your note here...',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'clean']
            ]
        }
    });

    // 4. DOM Elements
    const notesGrid = document.getElementById('notes-grid');
    const emptyState = document.getElementById('empty-state');
    const notesCount = document.getElementById('notes-count');
    const currentCategoryTitle = document.getElementById('current-category-title');
    const searchInput = document.getElementById('search-input');

    // Modal Elements
    const noteModal = document.getElementById('note-modal');
    const noteForm = document.getElementById('note-form');
    const noteIdInput = document.getElementById('note-id-input');
    const noteTitleInput = document.getElementById('note-title-input');
    const noteCategoryInput = document.getElementById('note-category-input');
    const notePdfInput = document.getElementById('note-pdf-input');
    const currentPdfDisplay = document.getElementById('current-pdf-display');
    const modalTitle = document.getElementById('modal-title');
    const maximizeModalBtn = document.getElementById('maximize-modal-btn');
    const modalContentBox = document.querySelector('.modal-content-box');

    // 5. Fetch Notes
    const fetchNotes = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/notes', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                notes = await res.json();
                renderNotes();
            } else if (res.status === 401) {
                // Token might be expired
                handleLogout();
            }
        } catch (error) {
            console.error("Failed to fetch notes:", error);
        }
    };

    // 6. Render Notes
    const renderNotes = () => {
        // Filter Logic
        const filteredNotes = notes.filter(note => {
            const matchesSearch =
                (note.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                (note.content?.toLowerCase() || '').includes(searchQuery.toLowerCase());

            let matchesCategory = false;
            const authorId = note.author?._id || note.author?.id;

            if (activeCategory === 'All') {
                matchesCategory = authorId === currentUser.id;
            } else if (activeCategory === 'Private') {
                matchesCategory = note.category === 'Private' && authorId === currentUser.id;
            } else if (activeCategory === 'Public') {
                matchesCategory = note.category === 'Public';
            }

            return matchesCategory && matchesSearch;
        });

        // Update Header
        currentCategoryTitle.textContent = activeCategory === 'All' ? 'All Notes' : `${activeCategory} Notes`;
        notesCount.textContent = `${filteredNotes.length} notes`;

        // Render logic
        notesGrid.innerHTML = '';
        if (filteredNotes.length === 0) {
            notesGrid.style.display = 'none';
            emptyState.style.display = 'flex';
        } else {
            notesGrid.style.display = 'grid';
            emptyState.style.display = 'none';

            filteredNotes.forEach(note => {
                const authorId = note.author?._id || note.author?.id;
                const isOwner = !note.author || authorId === currentUser.id;

                // Format Date (using vanilla format or date-fns if loaded globally)
                let dateStr = '';
                if (window.dateFns && note.updatedAt) {
                    dateStr = window.dateFns.format(new Date(note.updatedAt), 'MMM d, yyyy');
                } else if (note.updatedAt) {
                    dateStr = new Date(note.updatedAt).toLocaleDateString();
                }

                const card = document.createElement('div');
                card.className = 'card note-card animate-fade-in';

                let actionsHtml = '';
                if (isOwner) {
                    actionsHtml = `
                        <div class="note-card-actions">
                            <button class="icon-btn edit-btn" title="Edit Note" data-id="${note._id || note.id}">
                                <i data-lucide="edit-2" style="width: 16px; height: 16px;"></i>
                            </button>
                            <button class="icon-btn delete-btn" title="Delete Note" data-id="${note._id || note.id}">
                                <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
                            </button>
                        </div>
                    `;
                }

                let badgeHtml = '';
                if (note.category) {
                    badgeHtml += `
                        <span class="note-category badge ${note.category.toLowerCase()}">
                            <i data-lucide="tag" style="width: 12px; height: 12px;"></i>
                            ${note.category}
                        </span>
                    `;
                }

                if (note.pdfUrl) {
                    badgeHtml += `
                        <a href="http://localhost:5000/${note.pdfUrl}" target="_blank" class="note-category badge public" style="text-decoration: none; display: inline-flex; align-items: center; background: #e0e7ff; color: #4338ca;">
                            <i data-lucide="file-text" style="width: 12px; height: 12px;"></i>
                            Attached PDF
                        </a>
                    `;
                }

                if (!isOwner && note.author) {
                    const avatarStr = note.author.avatar || (note.author.name ? note.author.name.substring(0, 2).toUpperCase() : '');
                    badgeHtml += `
                        <span class="note-author badge">
                            <span class="author-avatar" style="margin-right:4px; font-weight:bold;">${avatarStr}</span>
                            ${note.author.name || 'Unknown'}
                        </span>
                    `;
                }

                card.innerHTML = `
                    <div class="note-card-header">
                        <h3>${note.title || 'Untitled'}</h3>
                        ${actionsHtml}
                    </div>
                    <div class="note-content ql-editor" style="padding:0; border:none;">
                        ${note.content || ''}
                    </div>
                    <div class="note-footer">
                        <span class="note-date">${dateStr}</span>
                        <div style="display:flex; gap:8px;">${badgeHtml}</div>
                    </div>
                `;

                // Attach event listeners for edit and delete buttons
                if (isOwner) {
                    const editBtn = card.querySelector('.edit-btn');
                    const deleteBtn = card.querySelector('.delete-btn');

                    editBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        openModal(note);
                    });

                    deleteBtn.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        if (confirm('Are you sure you want to delete this note?')) {
                            await deleteNote(note._id || note.id);
                        }
                    });
                }

                // Allow clicking whole card to edit if owner
                card.addEventListener('click', () => {
                    if (isOwner) openModal(note);
                });

                // Prevent PDF download link from bubbling to open the modal
                const pdfLink = card.querySelector('.note-category.public[href]');
                if (pdfLink) {
                    pdfLink.addEventListener('click', (e) => {
                        e.stopPropagation();
                    });
                }

                notesGrid.appendChild(card);
            });
            // Re-initialize dynamic icons inserted
            lucide.createIcons();
        }
    };

    // 7. Note Operations (Create, Update, Delete)
    const openModal = (note = null) => {
        if (notePdfInput) notePdfInput.value = '';
        if (currentPdfDisplay) currentPdfDisplay.style.display = 'none';

        if (note) {
            modalTitle.textContent = 'Edit Note';
            noteIdInput.value = note._id || note.id;
            noteTitleInput.value = note.title;
            noteCategoryInput.value = note.category || '';
            quill.root.innerHTML = note.content || '';
            
            if (note.pdfUrl && currentPdfDisplay) {
                currentPdfDisplay.style.display = 'block';
                currentPdfDisplay.innerHTML = `Current Attachment: <a href="http://localhost:5000/${note.pdfUrl}" target="_blank" style="font-weight: bold; text-decoration: underline;">View File</a>`;
            }
        } else {
            modalTitle.textContent = 'Create Note';
            noteIdInput.value = '';
            noteTitleInput.value = '';
            noteCategoryInput.value = '';
            quill.root.innerHTML = '';
        }
        noteModal.classList.add('active');
    };

    const closeModal = () => {
        noteModal.classList.remove('active');
        if (modalContentBox.classList.contains('maximized')) {
            modalContentBox.classList.remove('maximized');
            maximizeModalBtn.innerHTML = '<i data-lucide="maximize" style="width: 20px; height: 20px;"></i>';
            lucide.createIcons();
        }
    };

    const saveNote = async (e) => {
        e.preventDefault();

        const noteId = noteIdInput.value;
        const title = noteTitleInput.value;
        const category = noteCategoryInput.value;
        const content = quill.root.innerHTML;

        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('content', content);
        
        if (notePdfInput && notePdfInput.files[0]) {
            formData.append('pdfFile', notePdfInput.files[0]);
        }

        const url = noteId ? `http://localhost:5000/api/notes/${noteId}` : 'http://localhost:5000/api/notes';
        const method = noteId ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (res.ok) {
                await fetchNotes();
                closeModal();
            } else {
                alert('Failed to save note');
            }
        } catch (error) {
            console.error("Save note error:", error);
            alert('Could not connect to server to save note.');
        }
    };

    const deleteNote = async (noteId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                notes = notes.filter(n => n.id !== noteId && n._id !== noteId);
                renderNotes();
            } else {
                alert('Failed to delete note');
            }
        } catch (error) {
            console.error("Delete note error:", error);
        }
    };

    // 8. Event Listeners
    // Sidebar Categories
    const categoryBtns = document.querySelectorAll('.category-item');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.getAttribute('data-category');
            renderNotes();
        });
    });

    // Search
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderNotes();
    });

    // Modals & Buttons
    document.getElementById('create-note-btn').addEventListener('click', () => openModal(null));
    document.getElementById('empty-state-create-btn').addEventListener('click', () => openModal(null));
    document.getElementById('close-modal-btn').addEventListener('click', () => closeModal());
    document.getElementById('cancel-modal-btn').addEventListener('click', () => closeModal());
    
    maximizeModalBtn.addEventListener('click', () => {
        modalContentBox.classList.toggle('maximized');
        if (modalContentBox.classList.contains('maximized')) {
            maximizeModalBtn.innerHTML = '<i data-lucide="minimize" style="width: 20px; height: 20px;"></i>';
        } else {
            maximizeModalBtn.innerHTML = '<i data-lucide="maximize" style="width: 20px; height: 20px;"></i>';
        }
        lucide.createIcons();
    });

    noteForm.addEventListener('submit', saveNote);

    // Logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    };
    document.getElementById('logout-btn').addEventListener('click', handleLogout);

    // 9. Initial Load
    fetchNotes();
});
