/**
 * CESMS Request Status Page JavaScript
 * Handles interactive features for the request status page
 */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeRequestStatus();
});

/**
 * Initialize request status page functionality
 */
function initializeRequestStatus() {
    initializeFlashMessages();
    initializeFilterButtons();
    initializeRequestCards();
    initializeTooltips();
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
 * Initialize filter button interactions
 */
function initializeFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Add loading state
            button.style.opacity = '0.7';
            button.style.pointerEvents = 'none';
            
            // Remove loading state after navigation
            setTimeout(() => {
                button.style.opacity = '1';
                button.style.pointerEvents = 'auto';
            }, 1000);
        });
    });
}

/**
 * Initialize request card interactions
 */
function initializeRequestCards() {
    const requestCards = document.querySelectorAll('.request-card');
    
    requestCards.forEach(card => {
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
    });
}

/**
 * Initialize tooltips for status badges and icons
 */
function initializeTooltips() {
    const statusBadges = document.querySelectorAll('.status-badge');
    const cardIcons = document.querySelectorAll('.card-icon');
    
    // Add tooltips to status badges
    statusBadges.forEach(badge => {
        const status = badge.textContent.trim();
        const tooltipText = getStatusTooltip(status);
        
        if (tooltipText) {
            addTooltip(badge, tooltipText);
        }
    });
    
    // Add tooltips to card icons
    cardIcons.forEach(icon => {
        const card = icon.closest('.summary-card');
        if (card) {
            const cardType = card.classList.contains('pending') ? 'pending' :
                           card.classList.contains('approved') ? 'approved' :
                           card.classList.contains('rejected') ? 'rejected' :
                           card.classList.contains('cancelled') ? 'cancelled' : '';
            
            const tooltipText = getCardTooltip(cardType);
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
        'PENDING': 'Request is under review by OSAS',
        'APPROVED': 'Request has been approved and event is active',
        'REJECTED': 'Request was rejected and needs changes',
        'CANCELLED': 'Request was cancelled by department'
    };
    
    return tooltips[status.toUpperCase()] || '';
}

/**
 * Get tooltip text for summary card icons
 */
function getCardTooltip(cardType) {
    const tooltips = {
        'pending': 'Requests awaiting OSAS review',
        'approved': 'Successfully approved requests',
        'rejected': 'Requests that were rejected',
        'cancelled': 'Requests cancelled by department'
    };
    
    return tooltips[cardType] || '';
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
 * Initialize summary card animations
 */
function initializeSummaryCards() {
    const summaryCards = document.querySelectorAll('.summary-card');
    
    summaryCards.forEach((card, index) => {
        // Stagger animation on load
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

/**
 * Initialize request card animations
 */
function initializeRequestCardAnimations() {
    const requestCards = document.querySelectorAll('.request-card');
    
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
    
    requestCards.forEach((card, index) => {
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
    const filterButtons = document.querySelector('.filter-buttons');
    const requestsGrid = document.querySelector('.requests-grid');
    
    function handleResize() {
        const width = window.innerWidth;
        
        if (width <= 768) {
            // Mobile optimizations
            if (filterButtons) {
                filterButtons.style.flexDirection = 'column';
            }
        } else {
            // Desktop optimizations
            if (filterButtons) {
                filterButtons.style.flexDirection = 'row';
            }
        }
    }
    
    // Initial call
    handleResize();
    
    // Listen for resize events
    window.addEventListener('resize', debounce(handleResize, 250));
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

/**
 * Initialize page animations
 */
function initializePageAnimations() {
    // Initialize summary card animations
    initializeSummaryCards();
    
    // Initialize request card animations
    initializeRequestCardAnimations();
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeRequestStatus();
    initializeResponsive();
    initializePageAnimations();
});

// Add CSS animations
const animationStyle = document.createElement('style');
animationStyle.textContent = `
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
    
    .summary-card {
        transition: all 0.3s ease;
    }
    
    .request-card {
        transition: all 0.3s ease;
    }
    
    .filter-btn {
        transition: all 0.2s ease;
    }
    
    .btn {
        transition: all 0.2s ease;
    }
    
    .tooltip {
        transition: opacity 0.2s ease;
    }
`;
document.head.appendChild(animationStyle);
