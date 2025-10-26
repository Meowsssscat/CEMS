// Event Registration Details JavaScript

document.addEventListener('DOMContentLoaded', function() {
  
  // Auto-dismiss alerts after 5 seconds
  autoHideAlerts();
  
  // Add smooth scrolling to filter buttons
  addSmoothScroll();
  
  // Enhance card interactions
  enhanceCardInteractions();
  
  // Add confirmation dialogs
  enhanceConfirmations();
  
  // Add loading states to action buttons
  addLoadingStates();
  
  // Animate registration cards on scroll
  animateCardsOnScroll();
  
});

/**
 * Auto-hide alert messages after 5 seconds
 */
function autoHideAlerts() {
  const alerts = document.querySelectorAll('.alert');
  
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.style.opacity = '0';
      alert.style.transform = 'translateY(-10px)';
      alert.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      
      setTimeout(() => {
        alert.remove();
      }, 300);
    }, 5000);
  });
}

/**
 * Add smooth scrolling when clicking filter buttons
 */
function addSmoothScroll() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Let the link navigate normally, but add smooth scroll to registrations list
      setTimeout(() => {
        const registrationsList = document.querySelector('.registrations-list');
        if (registrationsList && window.innerWidth <= 768) {
          registrationsList.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    });
  });
}

/**
 * Enhance card interactions with hover effects
 */
function enhanceCardInteractions() {
  const cards = document.querySelectorAll('.registration-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.zIndex = '1';
    });
  });
  
  // Student Registration
  // Add ripple effect to cards on click
  cards.forEach(card => {
    card.addEventListener('click', function(e) {
      // Don't trigger if clicking on buttons
      if (e.target.tagName === 'A' || e.target.closest('a')) {
        return;
      }
      
      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'rgba(46, 80, 144, 0.1)';
      ripple.style.width = '100px';
      ripple.style.height = '100px';
      ripple.style.left = (e.clientX - this.getBoundingClientRect().left - 50) + 'px';
      ripple.style.top = (e.clientY - this.getBoundingClientRect().top - 50) + 'px';
      ripple.style.pointerEvents = 'none';
      ripple.style.animation = 'ripple-animation 0.6s ease-out';
      
      this.style.position = 'relative';
      this.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
  
  // Add ripple animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple-animation {
      from {
        transform: scale(0);
        opacity: 1;
      }
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Enhance confirmation dialogs
 */
function enhanceConfirmations() {
  const approveButtons = document.querySelectorAll('.btn-approve');
  const rejectButtons = document.querySelectorAll('.btn-reject');
  
  approveButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      const card = this.closest('.registration-card');
      const studentName = card.querySelector('.student-name').textContent;
      
      const confirmed = confirm(
        `Approve registration for ${studentName}?\n\n` +
        `A unique QR code will be generated for the student.`
      );
      
      if (!confirmed) {
        e.preventDefault();
      }
    });
  });
  
  rejectButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      const card = this.closest('.registration-card');
      const studentName = card.querySelector('.student-name').textContent;
      
      const confirmed = confirm(
        `Reject registration for ${studentName}?\n\n` +
        `This action cannot be undone.`
      );
      
      if (!confirmed) {
        e.preventDefault();
      }
    });
  });
}

/**
 * Add loading states to action buttons when clicked
 */
function addLoadingStates() {
  const actionButtons = document.querySelectorAll('.btn-approve, .btn-reject');
  
  actionButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Only proceed if confirmation was successful
      setTimeout(() => {
        const originalText = button.textContent;
        button.textContent = 'Processing...';
        button.style.opacity = '0.7';
        button.style.pointerEvents = 'none';
        button.style.cursor = 'wait';
      }, 100);
    });
  });
}

/**
 * Animate cards on scroll (fade in effect)
 */
function animateCardsOnScroll() {
  const cards = document.querySelectorAll('.registration-card');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '0';
        entry.target.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, 100);
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  cards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(card);
  });
}

/**
 * Update registration counts with animation
 */
function animateCounts() {
  const countElements = document.querySelectorAll('.summary-card .count');
  
  countElements.forEach(element => {
    const targetValue = parseInt(element.textContent);
    let currentValue = 0;
    const increment = Math.ceil(targetValue / 20);
    
    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= targetValue) {
        currentValue = targetValue;
        clearInterval(timer);
      }
      element.textContent = currentValue;
    }, 50);
  });
}

/**
 * Add keyboard navigation support
 */
function addKeyboardNavigation() {
  document.addEventListener('keydown', function(e) {
    // Press 'B' to go back
    if (e.key === 'b' || e.key === 'B') {
      const backButton = document.querySelector('.btn-back');
      if (backButton && !e.ctrlKey && !e.altKey && !e.metaKey) {
        // Check if not typing in an input
        if (document.activeElement.tagName !== 'INPUT' && 
            document.activeElement.tagName !== 'TEXTAREA') {
          backButton.click();
        }
      }
    }
  });
}

/**
 * Add search/filter functionality
 */
function addSearchFunctionality() {
  // This can be extended if you add a search input field
  const cards = document.querySelectorAll('.registration-card');
  
  // Example: Filter cards by student name or ID
  window.filterCards = function(searchTerm) {
    const term = searchTerm.toLowerCase();
    
    cards.forEach(card => {
      const studentName = card.querySelector('.student-name').textContent.toLowerCase();
      const studentId = card.querySelector('.student-id').textContent.toLowerCase();
      
      if (studentName.includes(term) || studentId.includes(term)) {
        card.style.display = 'block';
        card.style.animation = 'fadeIn 0.3s ease';
      } else {
        card.style.display = 'none';
      }
    });
  };
}

/**
 * Count visible cards and update display
 */
function updateCardCount() {
  const cards = document.querySelectorAll('.registration-card');
  const visibleCards = Array.from(cards).filter(card => 
    card.style.display !== 'none'
  ).length;
  
  const heading = document.querySelector('.registrations-list h2');
  if (heading && visibleCards > 0) {
    const originalText = heading.textContent.split('(')[0].trim();
    heading.textContent = `${visibleCards} ${originalText}`;
  }
}

/**
 * Add print support
 */
function addPrintSupport() {
  // Add print button (optional)
  window.printRegistrations = function() {
    window.print();
  };
}

/**
 * Highlight status badges on hover
 */
function enhanceStatusBadges() {
  const badges = document.querySelectorAll('.status-badge');
  
  badges.forEach(badge => {
    badge.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
      this.style.transition = 'transform 0.2s ease';
    });
    
    badge.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });
}

// Initialize all features
addKeyboardNavigation();
addSearchFunctionality();
addPrintSupport();
enhanceStatusBadges();

// Animate counts on page load
setTimeout(animateCounts, 300);

// Update card count
setTimeout(updateCardCount, 100);