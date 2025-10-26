/**
 * CESMS Event Registrations Page JavaScript
 * Handles interactive features for event registrations management
 */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeEventRegistrations();
});

/**
 * Initialize event registrations page functionality
 */
function initializeEventRegistrations() {
    initializeFlashMessages();
    initializeEventCards();
    initializeQuickActions();
    initializeTooltips();
    initializeAnimations();
}

/**
 * Initialize flash message functionality
 */
function initializeFlashMessages() {
    const flashMessages = document.querySelectorAll('.flash-message');
    
    flashMessages.forEach(message => {
        const closeBtn = message.querySelector('.close-btn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                dismissFlashMessage(message);
            });
        }
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (message.parentNode) {
                dismissFlashMessage(message);
            }
        }, 5000);
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
 * Initialize event card interactions
 */
function initializeEventCards() {
    const eventCards = document.querySelectorAll('.event-card');
    
    eventCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
        
        // Add click animation for action buttons
        const actionButtons = card.querySelectorAll('.btn');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Add click animation
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = 'scale(1)';
                }, 150);
            });
        });
        
        // Add confirmation for cancel buttons
        const cancelBtn = card.querySelector('.btn-danger');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                if (!confirm('Are you sure you want to cancel this event? This action cannot be undone.')) {
                    e.preventDefault();
                }
            });
        }
    });
}

/**
 * Initialize quick action buttons
 */
function initializeQuickActions() {
    const quickActionBtns = document.querySelectorAll('.quick-action-btn');
    
    quickActionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Add loading state
            btn.style.opacity = '0.7';
            btn.style.pointerEvents = 'none';
            
            // Remove loading state after navigation
            setTimeout(() => {
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            }, 1000);
        });
    });
}

/**
 * Initialize tooltips for status badges and icons
 */
function initializeTooltips() {
    const statusBadges = document.querySelectorAll('.status-badge');
    const statIcons = document.querySelectorAll('.stat-icon');
    
    // Add tooltips to status badges
    statusBadges.forEach(badge => {
        const status = badge.textContent.trim();
        const tooltipText = getStatusTooltip(status);
        
        if (tooltipText) {
            addTooltip(badge, tooltipText);
        }
    });
    
    // Add tooltips to stat icons
    statIcons.forEach(icon => {
        const statItem = icon.closest('.stat-item');
        if (statItem) {
            const statLabel = statItem.querySelector('.stat-label');
            const tooltipText = getStatTooltip(statLabel ? statLabel.textContent.trim() : '');
            
            if (tooltipText) {
                addTooltip(icon, tooltipText);
            }
        }
    });
}

/**
 * Get tooltip text for status badges
 */
function getStatusTooltip(status) {
    const tooltips = {
        'ACTIVE': 'Event is currently active and accepting registrations',
        'COMPLETED': 'Event has finished',
        'CANCELLED': 'Event was cancelled'
    };
    
    return tooltips[status.toUpperCase()] || '';
}

/**
 * Get tooltip text for stat icons
 */
function getStatTooltip(statLabel) {
    const tooltips = {
        'TOTAL': 'Total number of registrations',
        'PENDING': 'Registrations awaiting approval',
        'APPROVED': 'Registrations approved by department',
        'AUTO-APPROVED': 'Registrations automatically approved',
        'REJECTED': 'Registrations rejected by department'
    };
    
    return tooltips[statLabel.toUpperCase()] || '';
}

/**
 * Add tooltip to element
 */
function addTooltip(element, text) {
    let tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: var(--lspu-navy);
        color: white;
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
        white-space: nowrap;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    `;
    
    document.body.appendChild(tooltip);
    
    element.addEventListener('mouseenter', (e) => {
        const rect = e.target.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
        tooltip.style.opacity = '1';
        
        e.target.tooltip = tooltip;
    });
    
    element.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
    });
}

/**
 * Initialize animations
 */
function initializeAnimations() {
    const eventCards = document.querySelectorAll('.event-card');
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    eventCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.5s ease';
        
        // Stagger the animation
        setTimeout(() => {
            observer.observe(card);
        }, index * 100);
    });
}

/**
 * Initialize responsive behavior
 */
function initializeResponsive() {
    const eventsGrid = document.querySelector('.events-grid');
    const infoSidebar = document.querySelector('.info-sidebar');
    
    function handleResize() {
        const width = window.innerWidth;
        
        if (width <= 1024) {
            // Mobile/tablet optimizations
            if (infoSidebar) {
                infoSidebar.style.order = '-1';
            }
            
            if (eventsGrid) {
                eventsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(350px, 1fr))';
            }
        } else {
            // Desktop optimizations
            if (infoSidebar) {
                infoSidebar.style.order = '0';
            }
            
            if (eventsGrid) {
                eventsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(400px, 1fr))';
            }
        }
    }
    
    // Initial call
    handleResize();
    
    // Listen for resize events
    window.addEventListener('resize', debounce(handleResize, 250));
}

/**
 * Initialize stat counter animations
 */
function initializeStatCounters() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach(stat => {
        const finalValue = parseInt(stat.textContent);
        if (isNaN(finalValue)) return;
        
        // Animate counter
        animateCounter(stat, 0, finalValue, 1000);
    });
}

/**
 * Animate counter from start to end
 */
function animateCounter(element, start, end, duration) {
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

/**
 * Initialize event filtering (if needed)
 */
function initializeEventFiltering() {
    // This could be expanded to add client-side filtering
    const eventCards = document.querySelectorAll('.event-card');
    
    // Add data attributes for filtering
    eventCards.forEach(card => {
        const statusBadge = card.querySelector('.status-badge');
        const status = statusBadge ? statusBadge.textContent.trim().toLowerCase() : '';
        
        card.setAttribute('data-status', status);
    });
}

/**
 * Debounce function for performance
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

// Initialize all functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeEventRegistrations();
    initializeResponsive();
    initializeStatCounters();
    initializeEventFiltering();
});

// Add CSS animations
const eventRegistrationsStyle = document.createElement('style');
eventRegistrationsStyle.textContent = `
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
    
    .event-card {
        transition: all 0.3s ease;
    }
    
    .btn {
        transition: all 0.2s ease;
    }
    
    .quick-action-btn {
        transition: all 0.2s ease;
    }
    
    .tooltip {
        transition: opacity 0.2s ease;
    }
    
    .stat-value {
        transition: all 0.3s ease;
    }
`;
document.head.appendChild(eventRegistrationsStyle);
