class UserView {
    constructor() {
        this.api = api;
        this.currentPage = 1;
        this.users = [];
        this.init();
    }

    async init() {
        await this.loadUsers();
        this.renderUserTable();
        this.setupEventListeners();
    }

    async loadUsers() {
        try {
            this.users = await this.api.getUsers();
        } catch (error) {
            console.error('Failed to load users:', error);
            this.showMessage('Failed to load users', 'error');
        }
    }

    renderUserTable() {
        const tableBody = document.getElementById('usersTableBody');
        if (!tableBody) return;

        tableBody.innerHTML = this.users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>
                    <div class="user-info-cell">
                        <div class="user-avatar">${user.name.charAt(0)}</div>
                        <div>
                            <div class="user-name">${user.name}</div>
                            <div class="user-email">${user.email}</div>
                        </div>
                    </div>
                </td>
                <td>${user.role}</td>
                <td>${user.status}</td>
                <td>${new Date(user.registrationDate).toLocaleDateString()}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon edit-user" data-id="${user.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete-user" data-id="${user.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    setupEventListeners() {
        // Add user button
        const addUserBtn = document.getElementById('addUserBtn');
        if (addUserBtn) {
            addUserBtn.addEventListener('click', () => this.showUserForm());
        }

        // Edit and delete buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.edit-user')) {
                const userId = e.target.closest('.edit-user').dataset.id;
                this.editUser(userId);
            }
            
            if (e.target.closest('.delete-user')) {
                const userId = e.target.closest('.delete-user').dataset.id;
                this.deleteUser(userId);
            }
        });

        // User form submission
        const userForm = document.getElementById('userForm');
        if (userForm) {
            userForm.addEventListener('submit', (e) => this.handleUserFormSubmit(e));
        }
    }

    showUserForm(user = null) {
        const modal = document.getElementById('userModal');
        if (!modal) return;

        const form = document.getElementById('userForm');
        const title = document.getElementById('modalTitle');

        if (user) {
            title.textContent = 'Edit User';
            // Populate form with user data
            Object.keys(user).forEach(key => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input) input.value = user[key];
            });
        } else {
            title.textContent = 'Add New User';
            form.reset();
        }

        modal.style.display = 'block';
    }

    async handleUserFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const userData = Object.fromEntries(formData);

        const validationRules = {
            name: ['required'],
            email: ['required', 'email'],
            role: ['required']
        };

        const validation = ValidationUtils.validateForm(userData, validationRules);
        
        if (!validation.isValid) {
            ValidationUtils.showErrors(e.target, validation.errors);
            return;
        }

        try {
            if (userData.id) {
                await this.api.updateUser(userData.id, userData);
                this.showMessage('User updated successfully', 'success');
            } else {
                await this.api.createUser(userData);
                this.showMessage('User created successfully', 'success');
            }

            this.closeModal();
            await this.loadUsers();
            this.renderUserTable();
        } catch (error) {
            this.showMessage('Failed to save user', 'error');
        }
    }

    async editUser(userId) {
        const user = this.users.find(u => u.id == userId);
        if (user) {
            this.showUserForm(user);
        }
    }

    async deleteUser(userId) {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                await this.api.deleteUser(userId);
                this.showMessage('User deleted successfully', 'success');
                await this.loadUsers();
                this.renderUserTable();
            } catch (error) {
                this.showMessage('Failed to delete user', 'error');
            }
        }
    }

    closeModal() {
        const modal = document.getElementById('userModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    showMessage(message, type) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        toast.style.position = 'fixed';
        toast.style.top = '20px';
        toast.style.right = '20px';
        toast.style.padding = '1rem 1.5rem';
        toast.style.borderRadius = '4px';
        toast.style.color = 'white';
        toast.style.zIndex = '10000';
        toast.style.backgroundColor = type === 'success' ? 'var(--success-color)' : 'var(--accent-color)';
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize user view when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('usersTableBody')) {
        new UserView();
    }
});