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
            const submenu = this.nextElementSibling;
            
            // Close other open menus at the same level
            const allParents = document.querySelectorAll('#sidebarnav li');
            allParents.forEach(item => {
                if (item !== parent && item.classList.contains('active')) {
                    item.classList.remove('active');
                    const otherSubmenu = item.querySelector('ul');
                    if (otherSubmenu) {
                        otherSubmenu.style.display = 'none';
                    }
                }
            });
            
            // Toggle current menu
            if (parent.classList.contains('active')) {
                parent.classList.remove('active');
                if (submenu) {
                    submenu.style.display = 'none';
                }
            } else {
                parent.classList.add('active');
                if (submenu) {
                    submenu.style.display = 'block';
                }
            }
        });
    });
    
    // Initialize all submenus as collapsed
    const allSubmenus = document.querySelectorAll('#sidebarnav ul ul');
    allSubmenus.forEach(submenu => {
        submenu.style.display = 'none';
    });
}

function setupEventListeners() {
    // Mobile menu toggle
    document.addEventListener('click', function(e) {
        if (e.target.closest('.nav-toggler') || e.target.closest('.sidebartoggler')) {
            const body = document.body;
            body.classList.toggle('mini-sidebar');
            
            // Handle mini sidebar state
            if (body.classList.contains('mini-sidebar')) {
                collapseAllMenus();
            } else {
                // Restore previously open menus
                restoreMenuState();
            }
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
    
    // Handle window resize for responsive behavior
    window.addEventListener('resize', handleResize);
}

function collapseAllMenus() {
    const allParents = document.querySelectorAll('#sidebarnav li.active');
    const allSubmenus = document.querySelectorAll('#sidebarnav ul ul');
    
    allParents.forEach(parent => {
        parent.classList.remove('active');
    });
    
    allSubmenus.forEach(submenu => {
        submenu.style.display = 'none';
    });
}

function restoreMenuState() {
    // This function would restore the menu state based on saved preferences
    // For now, we'll just collapse everything
    collapseAllMenus();
}

function handleResize() {
    // Handle responsive behavior on window resize
    if (window.innerWidth < 768) {
        document.body.classList.add('mini-sidebar');
        collapseAllMenus();
    } else {
        document.body.classList.remove('mini-sidebar');
    }
}

// Enhanced menu management functions
window.menuManager = {
    // Expand a specific menu by ID or index
    expandMenu: function(menuIdentifier) {
        let menuElement;
        
        if (typeof menuIdentifier === 'number') {
            // If it's an index
            const menus = document.querySelectorAll('#sidebarnav > li > .has-arrow');
            if (menus[menuIdentifier]) {
                menuElement = menus[menuIdentifier];
            }
        } else if (typeof menuIdentifier === 'string') {
            // If it's a menu text
            const menus = document.querySelectorAll('#sidebarnav > li > .has-arrow');
            menuElement = Array.from(menus).find(menu => 
                menu.querySelector('.hide-menu').textContent.includes(menuIdentifier)
            );
        }
        
        if (menuElement) {
            menuElement.click();
        }
    },
    
    // Collapse a specific menu
    collapseMenu: function(menuIdentifier) {
        let menuElement;
        
        if (typeof menuIdentifier === 'number') {
            const menus = document.querySelectorAll('#sidebarnav > li > .has-arrow');
            if (menus[menuIdentifier]) {
                menuElement = menus[menuIdentifier];
            }
        } else if (typeof menuIdentifier === 'string') {
            const menus = document.querySelectorAll('#sidebarnav > li > .has-arrow');
            menuElement = Array.from(menus).find(menu => 
                menu.querySelector('.hide-menu').textContent.includes(menuIdentifier)
            );
        }
        
        if (menuElement && menuElement.parentElement.classList.contains('active')) {
            menuElement.click();
        }
    },
    
    // Expand all menus
    expandAll: function() {
        const menus = document.querySelectorAll('#sidebarnav > li > .has-arrow');
        menus.forEach(menu => {
            if (!menu.parentElement.classList.contains('active')) {
                menu.click();
            }
        });
    },
    
    // Collapse all menus
    collapseAll: function() {
        collapseAllMenus();
    },
    
    // Get current menu state
    getMenuState: function() {
        const state = {};
        const menus = document.querySelectorAll('#sidebarnav > li > .has-arrow');
        
        menus.forEach((menu, index) => {
            const menuText = menu.querySelector('.hide-menu').textContent;
            state[menuText] = menu.parentElement.classList.contains('active');
        });
        
        return state;
    },
    
    // Set active menu based on current page
    setActiveMenu: function(pageName) {
        // First, collapse all menus
        this.collapseAll();
        
        // Then expand the relevant menu based on the current page
        const menuMap = {
            'users': 'User Management',
            'roles': 'Role Management',
            'payments': 'Payments & Bills',
            'institutions': 'Institutions',
            'change-requests': 'Change Requests',
            'profile': 'Personal Details',
            'change-password': 'Change Password'
        };
        
        if (menuMap[pageName]) {
            this.expandMenu(menuMap[pageName]);
        }
    }
};

// Auto-detect and set active menu based on current page
function autoSetActiveMenu() {
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop().replace('.html', '');
    
    if (pageName && pageName !== 'index') {
        window.menuManager.setActiveMenu(pageName);
    }
}

// Initialize menu state when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure sidebar is loaded
    setTimeout(() => {
        autoSetActiveMenu();
    }, 100);
});

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
    // Set active menu before navigation
    window.menuManager.setActiveMenu(page);
    
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
        case 'change-requests':
            window.location.href = 'pages/change-requests.html';
            break;
        case 'profile':
            window.location.href = 'pages/profile.html';
            break;
        case 'change-password':
            window.location.href = 'pages/change-password.html';
            break;
        default:
            // Stay on current page
            break;
    }
};

// Demo functions for testing menu functionality
window.demoMenuFunctions = {
    showMenuState: function() {
        const state = window.menuManager.getMenuState();
        console.log('Current Menu State:', state);
        alert('Check console for current menu state');
    },
    
    toggleUserManagement: function() {
        const state = window.menuManager.getMenuState();
        if (state['User Management']) {
            window.menuManager.collapseMenu('User Management');
        } else {
            window.menuManager.expandMenu('User Management');
        }
    },
    
    toggleAllMenus: function() {
        const state = window.menuManager.getMenuState();
        const allExpanded = Object.values(state).every(val => val);
        
        if (allExpanded) {
            window.menuManager.collapseAll();
        } else {
            window.menuManager.expandAll();
        }
    }
};