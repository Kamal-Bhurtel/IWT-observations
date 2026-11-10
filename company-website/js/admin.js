// Admin Dashboard Logic

document.addEventListener('DOMContentLoaded', () => {
    const session = Session.requireAuth(['admin']);
    if (!session) return;

    // Greeting
    const greeting = document.getElementById('userGreeting');
    if (greeting) {
        greeting.textContent = `Hello, ${session.name}`;
    }

    // Find current admin
    const currentAdmin = AppData.admins.find(a => a.id === session.id);

    // Stats
    const employeeCountEl = document.getElementById('employeeCount');
    const deptCountEl = document.getElementById('deptCount');
    const activeCountEl = document.getElementById('activeCount');

    if (employeeCountEl) employeeCountEl.textContent = AppData.employees.length;

    const departments = new Set(AppData.employees.map(e => e.department));
    if (deptCountEl) deptCountEl.textContent = departments.size;

    const activeCount = AppData.employees.filter(e => e.status === 'Active').length;
    if (activeCountEl) activeCountEl.textContent = activeCount;

    // Populate employee table
    const tableBody = document.getElementById('employeeTableBody');
    const searchInput = document.getElementById('searchInput');

    function renderEmployees(filter = '') {
        if (!tableBody) return;
        tableBody.innerHTML = '';

        const filtered = AppData.employees.filter(emp => {
            if (!filter) return true;
            const q = filter.toLowerCase();
            return (
                emp.name.toLowerCase().includes(q) ||
                emp.email.toLowerCase().includes(q) ||
                emp.department.toLowerCase().includes(q) ||
                emp.position.toLowerCase().includes(q)
            );
        });

        filtered.forEach(emp => {
            const statusClass = emp.status === 'Active' ? 'status-active' : 'status-onleave';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${emp.name}</strong></td>
                <td>${emp.email}</td>
                <td>${emp.department}</td>
                <td>${emp.position}</td>
                <td>${emp.phone}</td>
                <td><span class="status-badge ${statusClass}">${emp.status}</span></td>
            `;
            tableBody.appendChild(row);
        });
    }

    renderEmployees();

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderEmployees(e.target.value.trim());
        });
    }

    // Admin profile card
    const profileEl = document.getElementById('adminProfile');
    if (profileEl && currentAdmin) {
        profileEl.innerHTML = `
            <div class="profile-item">
                <label>Full Name</label>
                <span>${currentAdmin.name}</span>
            </div>
            <div class="profile-item">
                <label>Email</label>
                <span>${currentAdmin.email}</span>
            </div>
            <div class="profile-item">
                <label>Role</label>
                <span>${currentAdmin.role}</span>
            </div>
            <div class="profile-item">
                <label>Department</label>
                <span>${currentAdmin.department}</span>
            </div>
            <div class="profile-item">
                <label>Phone</label>
                <span>${currentAdmin.phone}</span>
            </div>
            <div class="profile-item">
                <label>Joined</label>
                <span>${formatDate(currentAdmin.joined)}</span>
            </div>
        `;
    }
});