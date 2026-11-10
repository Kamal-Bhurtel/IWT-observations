// ========== Authentication System (LocalStorage) ==========

const USERS_KEY = 'cs_dept_users';
const CURRENT_USER_KEY = 'cs_dept_current_user';

// Get all registered users
function getUsers() {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
}

// Save users
function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Get currently logged-in user
function getCurrentUser() {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
}

// Set current user (login)
function setCurrentUser(user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

// Logout
function logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = 'login.html';
}

// Check if user is logged in (for protected pages)
function requireAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
        return null;
    }
    return user;
}

// Redirect if already logged in (for login/register pages)
function redirectIfLoggedIn() {
    if (getCurrentUser()) {
        window.location.href = 'dashboard.html';
    }
}

// ========== Registration ==========
function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim().toLowerCase();
    const studentId = document.getElementById('reg-studentid').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm').value;
    const year = document.getElementById('reg-year').value;
    const messageEl = document.getElementById('message');

    // Validation
    if (!name || !email || !studentId || !password || !year) {
        showMessage(messageEl, 'Please fill all fields.', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage(messageEl, 'Password must be at least 6 characters.', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showMessage(messageEl, 'Passwords do not match.', 'error');
        return;
    }

    const users = getUsers();

    // Check if email already exists
    if (users.some(u => u.email === email)) {
        showMessage(messageEl, 'Email already registered. Please login.', 'error');
        return;
    }

    // Check if Student ID already exists
    if (users.some(u => u.studentId === studentId)) {
        showMessage(messageEl, 'Student ID already registered.', 'error');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        studentId,
        password, // Note: Never store plain passwords in real applications
        year,
        registeredAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    showMessage(messageEl, 'Registration successful! Redirecting to login...', 'success');

    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

// ========== Login ==========
function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim().toLowerCase();
    const password = document.getElementById('login-password').value;
    const messageEl = document.getElementById('message');

    if (!email || !password) {
        showMessage(messageEl, 'Please enter email and password.', 'error');
        return;
    }

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        showMessage(messageEl, 'Invalid email or password.', 'error');
        return;
    }

    // Remove password before storing in session
    const sessionUser = { ...user };
    delete sessionUser.password;

    setCurrentUser(sessionUser);
    showMessage(messageEl, 'Login successful! Redirecting...', 'success');

    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

// ========== Helper ==========
function showMessage(el, text, type) {
    el.textContent = text;
    el.className = `message ${type}`;
}

// ========== Update Navbar (FIXED) ==========
function updateNavbar() {
    const user = getCurrentUser();
    const navLinks = document.getElementById('nav-links');

    if (!navLinks) return;

    // Remove previously added auth items
    navLinks.querySelectorAll('.auth-item').forEach(item => item.remove());

    if (user) {
        // Logged in → Dashboard + Logout
        navLinks.insertAdjacentHTML('beforeend', `
            <li class="auth-item"><a href="dashboard.html">Dashboard</a></li>
            <li class="auth-item"><button class="btn btn-outline" onclick="logout()">Logout</button></li>
        `);
    } else {
        // Not logged in → Login + Register (side by side)
        navLinks.insertAdjacentHTML('beforeend', `
            <li class="auth-item"><a href="login.html">Login</a></li>
            <li class="auth-item"><a href="register.html" class="btn btn-primary">Register</a></li>
        `);
    }
}

// Run on every page load
document.addEventListener('DOMContentLoaded', updateNavbar);