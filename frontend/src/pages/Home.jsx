import { Link } from 'react-router-dom';
import { BookOpen, Shield, Zap, ArrowRight } from 'lucide-react';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <nav className="home-nav">
                <div className="brand">
                    <div className="brand-logo">N</div>
                    <h2>Notes</h2>
                </div>
                <div className="nav-actions">
                    <Link to="/login" className="btn btn-secondary">Log in</Link>
                    <Link to="/register" className="btn btn-primary">Sign up</Link>
                </div>
            </nav>

            <main className="home-main">
                <section className="hero-section">
                    <div className="hero-content animate-fade-in">
                        <h1 className="hero-title">
                            Organize your mind, <br />
                            <span className="text-gradient">effortlessly.</span>
                        </h1>
                        <p className="hero-subtitle">
                            The modern, beautiful, and secure way to capture your thoughts, ideas, and daily tasks all in one place.
                        </p>
                        <div className="hero-cta">
                            <Link to="/register" className="btn btn-primary btn-large">
                                Get Started for Free
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="features-section">
                    <div className="features-grid">
                        <div className="feature-card card slide-in">
                            <div className="feature-icon-wrapper">
                                <Zap className="feature-icon" />
                            </div>
                            <h3>Lightning Fast</h3>
                            <p>Capture your notes instantly with a fast, responsive interface designed for speed.</p>
                        </div>

                        <div className="feature-card card slide-in" style={{ animationDelay: '0.1s' }}>
                            <div className="feature-icon-wrapper">
                                <BookOpen className="feature-icon" />
                            </div>
                            <h3>Beautifully Organized</h3>
                            <p>Sort your thoughts with categories and tags, featuring a stunning masonry and grid layout.</p>
                        </div>

                        <div className="feature-card card slide-in" style={{ animationDelay: '0.2s' }}>
                            <div className="feature-icon-wrapper">
                                <Shield className="feature-icon" />
                            </div>
                            <h3>Private & Secure</h3>
                            <p>Your notes are exclusively yours. End-to-end security ensures your ideas stay private.</p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="home-footer">
                <p>&copy; {new Date().getFullYear()} Notes App. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;
