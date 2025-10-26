// Department Event Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
  
    // Auto-dismiss alerts
    autoHideAlerts();
    
    // Animate summary cards on load
    animateSummaryCards();
    
    // Enhance event card interactions
    enhanceEventCardInteractions();
    
    // Add smooth scrolling for filter buttons
    addSmoothScrolling();
    
    // Enhance confirmation dialogs
    enhanceConfirmations();
    
    // Add loading states to action buttons
    addLoadingStates();
    
    // Animate event cards on scroll
    animateCardsOnScroll();
    
    // Add keyboard shortcuts
    addKeyboardShortcuts();
    
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
   * Animate summary card counts on page load
   */
  function animateSummaryCards() {
    const countElements = document.querySelectorAll('.summary-card .count');
    
    countElements.forEach((element, index) => {
      const targetValue = parseInt(element.textContent);
      let currentValue = 0;
      const increment = Math.ceil(targetValue / 25);
      const delay = index * 100;
      
      setTimeout(() => {
        const timer = setInterval(() => {
          currentValue += increment;
          if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(timer);
          }
          element.textContent = currentValue;
        }, 40);
      }, delay);
    });
  }
  
  /**
   * Enhance event card interactions
   */
  function enhanceEventCardInteractions() {
    const cards = document.querySelectorAll('.event-card');
    
    cards.forEach(card => {
      // Add hover effect enhancement
      card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
      });
      
      // Add click ripple effect (except on buttons)
      card.addEventListener('click', function(e) {
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
        ripple.style.animation = 'ripple-effect 0.6s ease-out';
        
        this.style.position = 'relative';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      });
    });
    
    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ripple-effect {
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
   * Add smooth scrolling for filter buttons
   */
  function addSmoothScrolling() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        setTimeout(() => {
          const eventsList = document.querySelector('.events-list');
          if (eventsList && window.innerWidth <= 768) {
            eventsList.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start' 
            });
          }
        }, 100);
      });
    });
  }
  
  /**
   * Enhance confirmation dialogs with event details
   */
  function enhanceConfirmations() {
    const cancelButtons = document.querySelectorAll('.btn-danger');
    
    cancelButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        const card = this.closest('.event-card');
        const eventTitle = card.querySelector('.event-title').textContent;
        const eventDate = card.querySelector('.detail-value').textContent;
        
        const confirmed = confirm(
          `Cancel Event: ${eventTitle}\n\n` +
          `Date: ${eventDate}\n\n` +
          `Are you sure you want to cancel this event?\n` +
          `This action cannot be undone and all participants will be notified.`
        );
        
        if (!confirmed) {
          e.preventDefault();
        }
      });
    });
    
    const postponeButtons = document.querySelectorAll('.btn-secondary');
    
    postponeButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        const card = this.closest('.event-card');
        const eventTitle = card.querySelector('.event-title').textContent;
        
        // Note: This is just for UX feedback
        // The actual postpone logic should be handled by the server
        console.log(`Postponing event: ${eventTitle}`);
      });
    });
  }
  
  /**
   * Add loading states to action buttons
   */
  function addLoadingStates() {
    const actionButtons = document.querySelectorAll('.btn-secondary, .btn-danger');
    
    actionButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        setTimeout(() => {
          const originalContent = button.innerHTML;
          button.innerHTML = '<span class="btn-icon">⏳</span> Processing...';
          button.style.opacity = '0.7';
          button.style.pointerEvents = 'none';
          button.style.cursor = 'wait';
        }, 100);
      });
    });
  }
  
  /**
   * Animate event cards on scroll (fade in effect)
   */
  function animateCardsOnScroll() {
    const cards = document.querySelectorAll('.event-card');
    
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '0';
          entry.target.style.transform = 'translateY(30px)';
          
          setTimeout(() => {
            entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
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
   * Add keyboard shortcuts for quick navigation
   */
  function addKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
      // Don't trigger if typing in an input
      if (document.activeElement.tagName === 'INPUT' || 
          document.activeElement.tagName === 'TEXTAREA') {
        return;
      }
      
      // Press 'F' to focus on filter buttons
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        const firstFilterBtn = document.querySelector('.filter-btn');
        if (firstFilterBtn) {
          firstFilterBtn.focus();
          firstFilterBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      
      // Press 'Esc' to clear any focused elements
      if (e.key === 'Escape') {
        document.activeElement.blur();
      }
    });
  }
  
  /**
   * Add status filter functionality with animation
   */
  function filterEventsByStatus(status) {
    const cards = document.querySelectorAll('.event-card');
    
    cards.forEach(card => {
      const cardStatus = card.getAttribute('data-status');
      
      if (status === 'all' || cardStatus === status) {
        card.style.display = 'flex';
        card.style.animation = 'fadeIn 0.5s ease';
      } else {
        card.style.display = 'none';
      }
    });
    
    updateEventCount();
  }
  
  /**
   * Update the event count display
   */
  function updateEventCount() {
    const cards = document.querySelectorAll('.event-card');
    const visibleCards = Array.from(cards).filter(card => 
      card.style.display !== 'none'
    ).length;
    
    const heading = document.querySelector('.events-list > h2');
    if (heading && visibleCards > 0) {
      const originalText = heading.textContent.split('(')[0].trim();
      heading.textContent = `${visibleCards} ${originalText}`;
    }
  }
  
  /**
   * Add print functionality
   */
  function addPrintSupport() {
    window.printEvents = function() {
      window.print();
    };
    
    // Optional: Add a print button dynamically
    const eventsHeading = document.querySelector('.events-list > h2');
    if (eventsHeading) {
      const printBtn = document.createElement('button');
      printBtn.textContent = '🖨️ Print';
      printBtn.style.cssText = `
        float: right;
        padding: 0.5rem 1rem;
        background-color: var(--primary-blue);
        color: white;
        border: none;
        border-radius: var(--border-radius);
        cursor: pointer;
        font-weight: 600;
        transition: var(--transition);
      `;
      printBtn.onclick = window.printEvents;
      printBtn.onmouseover = function() {
        this.style.backgroundColor = 'var(--dark-blue)';
      };
      printBtn.onmouseout = function() {
        this.style.backgroundColor = 'var(--primary-blue)';
      };
      
      // Uncomment to add print button
      // eventsHeading.appendChild(printBtn);
    }
  }
  
  /**
   * Enhance status badges with tooltips
   */
  function addStatusTooltips() {
    const statusBadges = document.querySelectorAll('.status-badge');
    
    const tooltips = {
      'active': 'This event is currently active and accepting registrations',
      'completed': 'This event has been completed',
      'cancelled': 'This event has been cancelled'
    };
    
    statusBadges.forEach(badge => {
      const statusClass = Array.from(badge.classList).find(cls => cls.startsWith('status-'));
      if (statusClass) {
        const status = statusClass.replace('status-', '');
        badge.title = tooltips[status] || '';
        
        badge.addEventListener('mouseenter', function() {
          this.style.transform = 'scale(1.05)';
          this.style.transition = 'transform 0.2s ease';
        });
        
        badge.addEventListener('mouseleave', function() {
          this.style.transform = 'scale(1)';
        });
      }
    });
  }
  
  /**
   * Add search functionality (if search input exists)
   */
  function addSearchFunctionality() {
    const searchInput = document.querySelector('#event-search');
    
    if (searchInput) {
      searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.event-card');
        
        cards.forEach(card => {
          const title = card.querySelector('.event-title').textContent.toLowerCase();
          const description = card.querySelector('.event-description')?.textContent.toLowerCase() || '';
          const location = card.querySelector('.detail-value').textContent.toLowerCase();
          
          if (title.includes(searchTerm) || 
              description.includes(searchTerm) || 
              location.includes(searchTerm)) {
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.3s ease';
          } else {
            card.style.display = 'none';
          }
        });
        
        updateEventCount();
      });
    }
  }
  
  /**
   * Add event card quick actions on hover
   */
  function addQuickActions() {
    const cards = document.querySelectorAll('.event-card');
    
    cards.forEach(card => {
      const footer = card.querySelector('.card-footer');
      
      card.addEventListener('mouseenter', function() {
        if (footer) {
          footer.style.transform = 'translateY(0)';
        }
      });
    });
  }
  
  /**
   * Initialize loading indicator
   */
  function showLoadingIndicator() {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-indicator';
    loadingDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      display: none;
      z-index: 9999;
    `;
    loadingDiv.innerHTML = '<div style="text-align: center;"><div style="font-size: 2rem;">⏳</div><p>Loading...</p></div>';
    document.body.appendChild(loadingDiv);
  }
  
  /**
   * Handle responsive table/card view toggle
   */
  function handleResponsiveView() {
    const updateView = () => {
      const cards = document.querySelectorAll('.event-card');
      const width = window.innerWidth;
      
      cards.forEach(card => {
        if (width <= 768) {
          card.classList.add('mobile-view');
        } else {
          card.classList.remove('mobile-view');
        }
      });
    };
    
    updateView();
    
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateView, 250);
    });
  }
  
  // Initialize all additional features
  addPrintSupport();
  addStatusTooltips();
  addSearchFunctionality();
  addQuickActions();
  showLoadingIndicator();
  handleResponsiveView();
  
  // Update event count on page load
  setTimeout(updateEventCount, 300);
  
  // Add fade-in animation for page elements
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .event-summary,
    .filter-section,
    .events-list > h2 {
      animation: fadeIn 0.5s ease;
    }
  `;
  document.head.appendChild(style);