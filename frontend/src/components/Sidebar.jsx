import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Tag as TagIcon, Settings, LogOut, Plus } from 'lucide-react';

const Sidebar = ({ activeCategory, onSelectCategory, currentUser }) => {
    const categories = ['All', 'Private', 'Public', 'Official'];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="brand">
                    <div className="brand-logo">N</div>
                    <h2>Notes</h2>
                </div>
            </div>

            <div className="sidebar-nav">
                <div className="nav-section">
                    <p className="nav-label">CATEGORIES</p>
                    <ul className="category-list">
                        {categories.map((cat) => (
                            <li key={cat}>
                                <button
                                    className={`category-item ${activeCategory === cat ? 'active' : ''}`}
                                    onClick={() => onSelectCategory(cat)}
                                >
                                    <TagIcon size={16} className="category-icon" />
                                    <span>{cat}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="avatar" style={currentUser?.role === 'teacher' ? { background: '#f59e0b', color: 'white' } : {}}>
                        {currentUser?.name ? currentUser.name.substring(0, 2).toUpperCase() : 'U'}
                    </div>
                    <div className="user-info">
                        <p className="user-name">{currentUser?.name || 'User'}</p>
                        <p className="user-email">{currentUser?.email || ''}</p>
                    </div>
                    <NavLink to="/login" className="icon-btn logout-btn" title="Logout" onClick={() => localStorage.removeItem('token')}>
                        <LogOut size={16} />
                    </NavLink>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
