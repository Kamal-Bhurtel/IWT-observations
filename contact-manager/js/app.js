// Contact Management Application
// API Base URL - adjust if your folder structure is different
const API_URL = 'php/api.php';

// State
let contacts = [];
let editingId = null;
let deleteId = null;

// DOM Elements
const contactsGrid = document.getElementById('contactsGrid');
const searchInput = document.getElementById('searchInput');
const contactModal = document.getElementById('contactModal');
const confirmModal = document.getElementById('confirmModal');
const contactForm = document.getElementById('contactForm');
const modalTitle = document.getElementById('modalTitle');
const totalContactsEl = document.getElementById('totalContacts');
const toastContainer = document.getElementById('toastContainer');

// ========== Initialization ==========
document.addEventListener('DOMContentLoaded', () => {
    loadContacts();
    
    // Event listeners
    document.getElementById('btnAdd').addEventListener('click', openAddModal);
    document.getElementById('btnCloseModal').addEventListener('click', closeModal);
    document.getElementById('btnCancel').addEventListener('click', closeModal);
    document.getElementById('btnSave').addEventListener('click', saveContact);
    document.getElementById('btnConfirmDelete').addEventListener('click', confirmDelete);
    document.getElementById('btnCancelDelete').addEventListener('click', closeConfirmModal);
    
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    // Close modal on overlay click
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) closeModal();
    });
    confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) closeConfirmModal();
    });
    
    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeConfirmModal();
        }
    });
});

// ========== API Calls ==========
async function loadContacts(search = '') {
    showLoading();
    try {
        const url = search 
            ? `${API_URL}?action=list&search=${encodeURIComponent(search)}`
            : `${API_URL}`;
        
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.success) {
            contacts = data.data;
            renderContacts();
            updateStats();
        } else {
            showToast(data.message || 'Failed to load contacts', 'error');
        }
    } catch (err) {
        console.error(err);
        showToast('Network error. Make sure PHP server is running and database is configured.', 'error');
        contactsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="icon">⚠️</div>
                <h2>Connection Error</h2>
                <p>Could not connect to the server. Please check your setup.</p>
            </div>
        `;
    }
}

async function saveContact() {
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim(),
        notes: document.getElementById('notes').value.trim()
    };

    // Client-side validation
    if (!formData.name || !formData.email || !formData.phone) {
        showToast('Name, Email and Phone are required', 'error');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }

    const btn = document.getElementById('btnSave');
    btn.disabled = true;
    btn.textContent = 'Saving...';

    try {
        let url, body;
        
        if (editingId) {
            url = `${API_URL}?action=update`;
            body = { ...formData, id: editingId };
        } else {
            url = `${API_URL}?action=add`;
            body = formData;
        }

        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (data.success) {
            showToast(data.message, 'success');
            closeModal();
            loadContacts(searchInput.value.trim());
        } else {
            showToast(data.message || 'Operation failed', 'error');
        }
    } catch (err) {
        console.error(err);
        showToast('Network error occurred', 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Save Contact';
    }
}

async function deleteContact(id) {
    try {
        const res = await fetch(`${API_URL}?id=${id}`, {
            method: 'DELETE'
        });
        const data = await res.json();

        if (data.success) {
            showToast(data.message, 'success');
            loadContacts(searchInput.value.trim());
        } else {
            showToast(data.message || 'Delete failed', 'error');
        }
    } catch (err) {
        console.error(err);
        showToast('Network error occurred', 'error');
    }
}

// ========== UI Rendering ==========
function renderContacts() {
    if (contacts.length === 0) {
        contactsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="icon">📇</div>
                <h2>No contacts found</h2>
                <p>${searchInput.value ? 'Try a different search term' : 'Add your first contact to get started'}</p>
                ${!searchInput.value ? '<button class="btn btn-primary" onclick="openAddModal()">+ Add Contact</button>' : ''}
            </div>
        `;
        return;
    }

    contactsGrid.innerHTML = contacts.map(c => `
        <div class="contact-card" data-id="${c.id}">
            <div class="contact-header">
                <div class="avatar">${getInitials(c.name)}</div>
                <div class="contact-info">
                    <h3>${escapeHtml(c.name)}</h3>
                    <div class="email">${escapeHtml(c.email)}</div>
                </div>
            </div>
            <div class="contact-details">
                <div class="detail-row">
                    <span class="icon">📞</span>
                    <span>${escapeHtml(c.phone)}</span>
                </div>
                ${c.address ? `
                <div class="detail-row">
                    <span class="icon">📍</span>
                    <span>${escapeHtml(c.address)}</span>
                </div>` : ''}
                ${c.notes ? `
                <div class="detail-row">
                    <span class="icon">📝</span>
                    <span>${escapeHtml(c.notes)}</span>
                </div>` : ''}
            </div>
            <div class="contact-actions">
                <button class="btn btn-secondary btn-sm" onclick="openEditModal(${c.id})">
                    ✏️ Edit
                </button>
                <button class="btn btn-danger btn-sm" onclick="openDeleteConfirm(${c.id})">
                    🗑️ Delete
                </button>
            </div>
        </div>
    `).join('');
}

function showLoading() {
    contactsGrid.innerHTML = `
        <div class="loading" style="grid-column: 1 / -1;">
            <div class="spinner"></div>
            <p>Loading contacts...</p>
        </div>
    `;
}

function updateStats() {
    totalContactsEl.textContent = contacts.length;
}

// ========== Modal Handlers ==========
function openAddModal() {
    editingId = null;
    modalTitle.textContent = 'Add New Contact';
    contactForm.reset();
    contactModal.classList.add('active');
    document.getElementById('name').focus();
}

function openEditModal(id) {
    const contact = contacts.find(c => c.id == id);
    if (!contact) return;

    editingId = id;
    modalTitle.textContent = 'Edit Contact';
    
    document.getElementById('name').value = contact.name;
    document.getElementById('email').value = contact.email;
    document.getElementById('phone').value = contact.phone;
    document.getElementById('address').value = contact.address || '';
    document.getElementById('notes').value = contact.notes || '';
    
    contactModal.classList.add('active');
    document.getElementById('name').focus();
}

function closeModal() {
    contactModal.classList.remove('active');
    editingId = null;
    contactForm.reset();
}

function openDeleteConfirm(id) {
    deleteId = id;
    const contact = contacts.find(c => c.id == id);
    document.getElementById('deleteContactName').textContent = contact ? contact.name : 'this contact';
    confirmModal.classList.add('active');
}

function closeConfirmModal() {
    confirmModal.classList.remove('active');
    deleteId = null;
}

function confirmDelete() {
    if (deleteId) {
        deleteContact(deleteId);
        closeConfirmModal();
    }
}

// ========== Helpers ==========
function handleSearch() {
    loadContacts(searchInput.value.trim());
}

function getInitials(name) {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${type === 'success' ? '✅' : '❌'}</span>
        <span class="message">${escapeHtml(message)}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}