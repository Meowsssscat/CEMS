/**
 * CESMS Dashboard JavaScript
 * Handles sidebar navigation, responsive behavior, and interactive features
 */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

/**
 * Initialize dashboard functionality
 */
function initializeDashboard() {
    initializeSidebar();
    initializeResponsive();
    initializeFlashMessages();
    initializeTooltips();
    initializeTables();
    initializeModals();
    initializeAccessibility();
}

/**
 * Initialize sidebar functionality
 */
function initializeSidebar() {
    const sidebar = document.querySelector('.dashboard-sidebar');
    const main = document.querySelector('.dashboard-main');
    const toggle = document.querySelector('.sidebar-toggle');
    const mobileOverlay = document.querySelector('.mobile-overlay');
    
    console.log('Initializing sidebar...', { sidebar: !!sidebar, main: !!main, toggle: !!toggle, mobileOverlay: !!mobileOverlay });
    
    if (!sidebar || !main || !toggle) {
        console.error('Missing sidebar elements:', { sidebar: !!sidebar, main: !!main, toggle: !!toggle });
        return;
    }
    
    // Toggle sidebar
    toggle.addEventListener('click', (e) => {
        console.log('Hamburger clicked!');
        e.preventDefault();
        if (window.innerWidth <= 768) {
            // Mobile behavior
            sidebar.classList.toggle('mobile-open');
            mobileOverlay.classList.toggle('active');
            document.body.classList.toggle('sidebar-open');
            console.log('Mobile toggle applied');
        } else {
            // Desktop behavior
            sidebar.classList.toggle('collapsed');
            main.classList.toggle('expanded');
            console.log('Desktop toggle applied');
        }
    });
    
    // Close mobile sidebar when clicking overlay
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', () => {
            sidebar.classList.remove('mobile-open');
            mobileOverlay.classList.remove('active');
            document.body.classList.remove('sidebar-open');
        });
    }
    
    // Close mobile sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(e.target) && 
            !toggle.contains(e.target) &&
            sidebar.classList.contains('mobile-open')) {
            sidebar.classList.remove('mobile-open');
            mobileOverlay.classList.remove('active');
            document.body.classList.remove('sidebar-open');
        }
    });
    
    // Set active navigation item
    setActiveNavItem();
}

/**
 * Set active navigation item based on current URL
 */
function setActiveNavItem() {
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && currentPath.includes(href.split('/').pop())) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

/**
 * Initialize responsive behavior
 */
function initializeResponsive() {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    });
    
    // Initial check
    handleResize();
}

/**
 * Handle window resize
 */
function handleResize() {
    const sidebar = document.querySelector('.dashboard-sidebar');
    const main = document.querySelector('.dashboard-main');
    const mobileOverlay = document.querySelector('.mobile-overlay');
    
    if (!sidebar || !main) return;
    
    if (window.innerWidth <= 768) {
        // Mobile view
        sidebar.classList.remove('collapsed');
        main.classList.remove('expanded');
        if (mobileOverlay) {
            mobileOverlay.classList.remove('active');
        }
    } else {
        // Desktop view
        sidebar.classList.remove('mobile-open');
        if (mobileOverlay) {
            mobileOverlay.classList.remove('active');
        }
        document.body.classList.remove('sidebar-open');
    }
}

/**
 * Initialize flash messages
 */
function initializeFlashMessages() {
    const flashMessages = document.querySelectorAll('.flash-message');
    
    flashMessages.forEach(message => {
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            dismissFlashMessage(message);
        }, 5000);
        
        // Manual dismiss on close button click
        const closeBtn = message.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                dismissFlashMessage(message);
            });
        }
    });
}

/**
 * Dismiss flash message with animation
 */
function dismissFlashMessage(message) {
    message.style.animation = 'slideOutUp 0.3s ease forwards';
    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 300);
}

/**
 * Initialize tooltips
 */
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

/**
 * Show tooltip
 */
function showTooltip(e) {
    const text = e.target.getAttribute('data-tooltip');
    if (!text) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: var(--lspu-navy);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 0.8rem;
        z-index: 1000;
        pointer-events: none;
        white-space: nowrap;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    
    e.target.tooltip = tooltip;
}

/**
 * Hide tooltip
 */
function hideTooltip(e) {
    if (e.target.tooltip) {
        e.target.tooltip.remove();
        e.target.tooltip = null;
    }
}

/**
 * Initialize table functionality
 */
function initializeTables() {
    const tables = document.querySelectorAll('.table');
    
    tables.forEach(table => {
        // Add sorting functionality
        const headers = table.querySelectorAll('th[data-sort]');
        headers.forEach(header => {
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => sortTable(table, header));
        });
        
        // Add row selection
        const selectableRows = table.querySelectorAll('tr[data-selectable]');
        selectableRows.forEach(row => {
            row.addEventListener('click', () => toggleRowSelection(row));
        });
    });
}

/**
 * Sort table by column
 */
function sortTable(table, header) {
    const column = header.getAttribute('data-sort');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const isAscending = header.classList.contains('sort-asc');
    
    // Remove sort classes from all headers
    table.querySelectorAll('th').forEach(th => {
        th.classList.remove('sort-asc', 'sort-desc');
    });
    
    // Add appropriate sort class
    header.classList.add(isAscending ? 'sort-desc' : 'sort-asc');
    
    // Sort rows
    rows.sort((a, b) => {
        const aValue = a.querySelector(`[data-sort="${column}"]`)?.textContent || '';
        const bValue = b.querySelector(`[data-sort="${column}"]`)?.textContent || '';
        
        if (isAscending) {
            return bValue.localeCompare(aValue);
        } else {
            return aValue.localeCompare(bValue);
        }
    });
    
    // Reorder rows in table
    rows.forEach(row => tbody.appendChild(row));
}

/**
 * Toggle row selection
 */
function toggleRowSelection(row) {
    row.classList.toggle('selected');
    
    // Update selection count
    const selectedRows = document.querySelectorAll('tr.selected');
    const selectionInfo = document.querySelector('.selection-info');
    if (selectionInfo) {
        selectionInfo.textContent = `${selectedRows.length} item(s) selected`;
    }
}

/**
 * Initialize modal functionality
 */
function initializeModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = trigger.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                showModal(modal);
            }
        });
    });
    
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => hideModal(modal));
        }
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal(modal);
            }
        });
    });
}

/**
 * Show modal
 */
function showModal(modal) {
    modal.style.display = 'flex';
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    
    // Focus first input
    const firstInput = modal.querySelector('input, textarea, select');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }
}

/**
 * Hide modal
 */
function hideModal(modal) {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

/**
 * Initialize accessibility features
 */
function initializeAccessibility() {
    // Add ARIA labels to interactive elements
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    interactiveElements.forEach(element => {
        if (!element.getAttribute('aria-label') && !element.textContent.trim()) {
            const title = element.getAttribute('title') || element.getAttribute('data-tooltip');
            if (title) {
                element.setAttribute('aria-label', title);
            }
        }
    });
    
    // Add keyboard navigation for sidebar
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach((item, index) => {
        item.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' && index < navItems.length - 1) {
                navItems[index + 1].focus();
            } else if (e.key === 'ArrowUp' && index > 0) {
                navItems[index - 1].focus();
            }
        });
    });
    
    // Add skip links
    addSkipLinks();
}

/**
 * Add skip links for accessibility
 */
function addSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--lspu-blue);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

/**
 * Utility function to show loading state
 */
function showLoading(element) {
    element.classList.add('loading');
    element.disabled = true;
}

/**
 * Utility function to hide loading state
 */
function hideLoading(element) {
    element.classList.remove('loading');
    element.disabled = false;
}

/**
 * Utility function to show notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `flash-message ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="close-btn" aria-label="Close message">&times;</button>
    `;
    
    const container = document.querySelector('.flash-messages') || createFlashContainer();
    container.appendChild(notification);
    
    // Auto-dismiss
    setTimeout(() => {
        dismissFlashMessage(notification);
    }, 5000);
    
    // Manual dismiss
    notification.querySelector('.close-btn').addEventListener('click', () => {
        dismissFlashMessage(notification);
    });
}

/**
 * Create flash message container if it doesn't exist
 */
function createFlashContainer() {
    const container = document.createElement('div');
    container.className = 'flash-messages';
    const content = document.querySelector('.dashboard-content');
    if (content) {
        content.insertBefore(container, content.firstChild);
    }
    return container;
}

/**
 * Utility function to format date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Utility function to format time
 */
function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Utility function to debounce function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add CSS for animations
const dashboardAnimationStyle = document.createElement('style');
dashboardAnimationStyle.textContent = `
    .skip-link:focus {
        top: 6px !important;
    }
    
    @keyframes slideOutUp {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(-20px);
            opacity: 0;
        }
    }
    
    .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 1000;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .modal.active {
        opacity: 1;
    }
    
    .modal-content {
        background: white;
        border-radius: 8px;
        padding: 24px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        transform: scale(0.9);
        transition: transform 0.3s ease;
    }
    
    .modal.active .modal-content {
        transform: scale(1);
    }
    
    .modal-close {
        position: absolute;
        top: 12px;
        right: 12px;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--medium-gray);
    }
    
    .modal-close:hover {
        color: var(--dark-gray);
    }
    
    .sort-asc::after {
        content: ' ↑';
        color: var(--lspu-blue);
    }
    
    .sort-desc::after {
        content: ' ↓';
        color: var(--lspu-blue);
    }
    
    tr.selected {
        background: rgba(46, 80, 144, 0.1) !important;
    }
    
    .selection-info {
        padding: 8px 16px;
        background: var(--light-gray);
        border-radius: 4px;
        font-size: 0.9rem;
        color: var(--medium-gray);
    }
`;
document.head.appendChild(dashboardAnimationStyle);
