document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Set Footer Year dynamically
    const yearSpan = document.getElementById('footer-year');
    if (yearSpan) {
        yearSpan.innerHTML = `&copy; ${new Date().getFullYear()} Notes App. All rights reserved.`;
    }

    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
        // If logged in, redirect to dashboard automatically
        window.location.href = 'dashboard.html';
    }
});
