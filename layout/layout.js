// Layout management with ES6 modules
export function loadLayout() {
    loadHeader();
    loadSidebar();
    setupEventListeners();
}

async function loadHeader() {
    try {
        const response = await fetch('layout/header.html');
        const headerHtml = await response.text();
        document.getElementById('header').innerHTML = headerHtml;
    } catch (error) {
        console.error('Failed to load header:', error);
    }
}

async function loadSidebar() {
    try {
        const response = await fetch('layout/sidebar.html');
        const sidebarHtml = await response.text();
        document.getElementById('sidebar').innerHTML = sidebarHtml;
        
        // Initialize sidebar menu after loading
        initializeSidebarMenu();
    } catch (error) {
        console.error('Failed to load sidebar:', error);
    }
}

function initializeSidebarMenu() {
    // Initialize sidebar menu functionality
    const hasArrowElements = document.querySelectorAll('.has-arrow');
    
    hasArrowElements.forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            const parent = this.parentElement;
            
            // Toggle active class
            parent.classList.toggle('active');
            
            // Collapse other menus at the same level
            const siblings = Array.from(parent.parentElement.children).filter(child => child !== parent);
            siblings.forEach(sibling => {
                sibling.classList.remove('active');
            });
        });
    });
}

function setupEventListeners() {
    // Mobile menu toggle
    document.addEventListener('click', function(e) {
        if (e.target.closest('.nav-toggler') || e.target.closest('.sidebartoggler')) {
            const body = document.body;
            body.classList.toggle('mini-sidebar');
        }
    });
    
    // Profile dropdown
    const profileDropdown = document.querySelector('.nav-item.dropdown');
    if (profileDropdown) {
        profileDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        const dropdowns = document.querySelectorAll('.dropdown-menu');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    });
}

// Global logout function
window.logout = function() {
    if (confirm('Are you sure you want to logout?')) {
        // Clear any stored authentication data
        localStorage.removeItem('authToken');
        sessionStorage.clear();
        
        // Redirect to login page
        window.location.href = 'pages/login.html';
    }
};

// Navigation function
window.navigateTo = function(page) {
    // In a real application, this would use a router
    // For now, we'll just show an alert
    alert(`Navigating to ${page} page`);
    
    // Example of how you might handle navigation
    switch(page) {
        case 'users':
            window.location.href = 'pages/users.html';
            break;
        case 'roles':
            window.location.href = 'pages/roles.html';
            break;
        case 'payments':
            window.location.href = 'pages/payments.html';
            break;
        case 'institutions':
            window.location.href = 'pages/institutions.html';
            break;
        default:
            // Stay on current page
            break;
    }
};