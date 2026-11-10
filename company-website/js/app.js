// Shared app utilities and data store

const AppData = {
    // Sample Admin users
    admins: [
        {
            id: 1,
            name: "Sarah Johnson",
            email: "admin@technova.com",
            password: "admin123",
            role: "Chief Technology Officer",
            department: "Executive",
            phone: "+1 (555) 100-2001",
            joined: "2019-03-15"
        },
        {
            id: 2,
            name: "Michael Chen",
            email: "michael.chen@technova.com",
            password: "admin456",
            role: "Head of Engineering",
            department: "Engineering",
            phone: "+1 (555) 100-2002",
            joined: "2020-06-01"
        },
        {
            id: 3,
            name: "Priya Sharma",
            email: "priya.sharma@technova.com",
            password: "admin789",
            role: "HR Director",
            department: "Human Resources",
            phone: "+1 (555) 100-2003",
            joined: "2018-11-20"
        }
    ],

    // Sample Employees
    employees: [
        {
            id: 101,
            name: "Alice Williams",
            email: "alice@technova.com",
            password: "employee123",
            department: "Engineering",
            position: "Senior Frontend Developer",
            phone: "+1 (555) 200-3001",
            status: "Active",
            joined: "2021-02-10"
        },
        {
            id: 102,
            name: "Bob Martinez",
            email: "bob.martinez@technova.com",
            password: "employee123",
            department: "Engineering",
            position: "Backend Developer",
            phone: "+1 (555) 200-3002",
            status: "Active",
            joined: "2022-05-18"
        },
        {
            id: 103,
            name: "Carol Davis",
            email: "carol.davis@technova.com",
            password: "employee123",
            department: "Design",
            position: "UI/UX Designer",
            phone: "+1 (555) 200-3003",
            status: "Active",
            joined: "2021-09-01"
        },
        {
            id: 104,
            name: "David Kim",
            email: "david.kim@technova.com",
            password: "employee123",
            department: "Product",
            position: "Product Manager",
            phone: "+1 (555) 200-3004",
            status: "On Leave",
            joined: "2020-11-12"
        },
        {
            id: 105,
            name: "Emma Thompson",
            email: "emma.thompson@technova.com",
            password: "employee123",
            department: "Marketing",
            position: "Marketing Specialist",
            phone: "+1 (555) 200-3005",
            status: "Active",
            joined: "2023-01-20"
        },
        {
            id: 106,
            name: "Frank Lopez",
            email: "frank.lopez@technova.com",
            password: "employee123",
            department: "Engineering",
            position: "DevOps Engineer",
            phone: "+1 (555) 200-3006",
            status: "Active",
            joined: "2022-08-05"
        },
        {
            id: 107,
            name: "Grace Lee",
            email: "grace.lee@technova.com",
            password: "employee123",
            department: "Human Resources",
            position: "HR Coordinator",
            phone: "+1 (555) 200-3007",
            status: "Active",
            joined: "2021-04-15"
        },
        {
            id: 108,
            name: "Henry Wilson",
            email: "henry.wilson@technova.com",
            password: "employee123",
            department: "Sales",
            position: "Account Executive",
            phone: "+1 (555) 200-3008",
            status: "Active",
            joined: "2023-03-01"
        }
    ]
};

// Session helpers
const Session = {
    get() {
        const data = localStorage.getItem('technova_session');
        return data ? JSON.parse(data) : null;
    },

    set(user, role) {
        const session = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: role, // 'admin' or 'employee'
            loggedInAt: new Date().toISOString()
        };
        localStorage.setItem('technova_session', JSON.stringify(session));
        return session;
    },

    clear() {
        localStorage.removeItem('technova_session');
    },

    isLoggedIn() {
        return !!this.get();
    },

    requireAuth(allowedRoles = []) {
        const session = this.get();
        if (!session) {
            window.location.href = 'login.html';
            return null;
        }
        if (allowedRoles.length && !allowedRoles.includes(session.role)) {
            // Redirect to correct dashboard
            if (session.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'employee.html';
            }
            return null;
        }
        return session;
    }
};

// Utility: format date
function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
}