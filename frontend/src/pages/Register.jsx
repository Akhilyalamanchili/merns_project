import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Mail, ArrowRight } from 'lucide-react';
import './Auth.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role })
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                navigate('/dashboard');
            } else {
                alert(data.message || 'Registration failed');
            }
        } catch (err) {
            alert('Could not connect to server');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container animate-fade-in">
            <div className="auth-card card">
                <div className="auth-header">
                    <div className="auth-icon-wrapper">
                        <User className="auth-icon" />
                    </div>
                    <h1>Create Account</h1>
                    <p>Start organizing your thoughts today.</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label htmlFor="name">Full Name</label>
                        <div className="input-with-icon">
                            <User className="input-icon" size={18} />
                            <input
                                type="text"
                                id="name"
                                className="input-control"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <div className="input-with-icon">
                            <Mail className="input-icon" size={18} />
                            <input
                                type="email"
                                id="email"
                                className="input-control"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-with-icon">
                            <Lock className="input-icon" size={18} />
                            <input
                                type="password"
                                id="password"
                                className="input-control"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Account Type</label>
                        <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input type="radio" name="role" value="student" checked={role === 'student'} onChange={(e) => setRole(e.target.value)} />
                                Student
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input type="radio" name="role" value="teacher" checked={role === 'teacher'} onChange={(e) => setRole(e.target.value)} />
                                Teacher
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary auth-submit" disabled={isLoading}>
                        {isLoading ? 'Creating account...' : 'Create Account'}
                        {!isLoading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account? <Link to="/login">Sign in</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
