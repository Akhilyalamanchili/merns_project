document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = 'dashboard.html';
    }

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const submitBtn = document.getElementById('submit-btn');

            setLoading(submitBtn, true, 'Signing in...');

            try {
                const res = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data));
                    window.location.href = 'dashboard.html';
                } else {
                    alert(data.message || 'Login failed');
                }
            } catch (err) {
                alert('Could not connect to server');
            } finally {
                setLoading(submitBtn, false, 'Sign In');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const submitBtn = document.getElementById('submit-btn');

            setLoading(submitBtn, true, 'Creating account...');

            try {
                const res = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data));
                    window.location.href = 'dashboard.html';
                } else {
                    alert(data.message || 'Registration failed');
                }
            } catch (err) {
                alert('Could not connect to server');
            } finally {
                setLoading(submitBtn, false, 'Create Account');
            }
        });
    }

    function setLoading(btn, isLoading, text) {
        const span = btn.querySelector('span');
        const icon = btn.querySelector('i') || btn.querySelector('svg');

        btn.disabled = isLoading;
        if (span) span.textContent = text;

        if (icon) {
            if (isLoading) {
                icon.style.display = 'none';
            } else {
                icon.style.display = 'inline-block';
            }
        }
    }
});
