// Employee Dashboard Logic

document.addEventListener('DOMContentLoaded', () => {
    const session = Session.requireAuth(['employee']);
    if (!session) return;

    // Greeting
    const greeting = document.getElementById('userGreeting');
    if (greeting) {
        greeting.textContent = `Hello, ${session.name}`;
    }

    // Find current employee
    const currentEmployee = AppData.employees.find(e => e.id === session.id);

    // Populate admin table (employees can see admin details)
    const adminTableBody = document.getElementById('adminTableBody');
    const adminCountEl = document.getElementById('adminCount');
    const deptCountEl = document.getElementById('departmentCount');

    if (adminTableBody) {
        AppData.admins.forEach(admin => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${admin.name}</strong></td>
                <td>${admin.email}</td>
                <td>${admin.role}</td>
                <td>${admin.department}</td>
                <td>${admin.phone}</td>
            `;
            adminTableBody.appendChild(row);
        });

        if (adminCountEl) adminCountEl.textContent = AppData.admins.length;

        // Unique departments among admins
        const depts = new Set(AppData.admins.map(a => a.department));
        if (deptCountEl) deptCountEl.textContent = depts.size;
    }

    // Employee profile card
    const profileEl = document.getElementById('employeeProfile');
    if (profileEl && currentEmployee) {
        profileEl.innerHTML = `
            <div class="profile-item">
                <label>Full Name</label>
                <span>${currentEmployee.name}</span>
            </div>
            <div class="profile-item">
                <label>Email</label>
                <span>${currentEmployee.email}</span>
            </div>
            <div class="profile-item">
                <label>Department</label>
                <span>${currentEmployee.department}</span>
            </div>
            <div class="profile-item">
                <label>Position</label>
                <span>${currentEmployee.position}</span>
            </div>
            <div class="profile-item">
                <label>Phone</label>
                <span>${currentEmployee.phone}</span>
            </div>
            <div class="profile-item">
                <label>Status</label>
                <span>${currentEmployee.status}</span>
            </div>
            <div class="profile-item">
                <label>Joined</label>
                <span>${formatDate(currentEmployee.joined)}</span>
            </div>
        `;
    }
});