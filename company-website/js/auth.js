// Authentication logic for login page and shared logout

document.addEventListener('DOMContentLoaded', () => {
    // Role tab switching
    const roleTabs = document.querySelectorAll('.role-tab');
    let selectedRole = 'employee';

    roleTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // Remove active from all tabs
            roleTabs.forEach(t => t.classList.remove('active'));
            
            // Add active to clicked tab
            this.classList.add('active');
            
            // Update selected role
            selectedRole = this.getAttribute('data-role');
            console.log('Selected role:', selectedRole); // for testing
        });
    });

    // Login form handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        // If already logged in, redirect
        const existing = Session.get();
        if (existing) {
            window.location.href = existing.role === 'admin' ? 'admin.html' : 'employee.html';
            return;
        }

        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value.trim().toLowerCase();
            const password = document.getElementById('password').value;
            const errorEl = document.getElementById('loginError');

            errorEl.style.display = 'none';
            errorEl.textContent = '';

            let user = null;

            if (selectedRole === 'admin') {
                user = AppData.admins.find(a => 
                    a.email.toLowerCase() === email && a.password === password
                );
            } else {
                user = AppData.employees.find(e => 
                    e.email.toLowerCase() === email && e.password === password
                );
            }

            if (user) {
                Session.set(user, selectedRole);
                window.location.href = selectedRole === 'admin' ? 'admin.html' : 'employee.html';
            } else {
                errorEl.textContent = 'Invalid email or password. Please try again.';
                errorEl.style.display = 'block';
            }
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            Session.clear();
            window.location.href = 'login.html';
        });
    }
});