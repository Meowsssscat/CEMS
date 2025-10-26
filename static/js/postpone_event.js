// Postpone Event JavaScript

document.addEventListener('DOMContentLoaded', function() {
  
    // Auto-dismiss alerts
    autoHideAlerts();
    
    // Set minimum date to today
    setMinimumDate();
    
    // Add form validation
    setupFormValidation();
    
    // Add real-time time validation
    setupTimeValidation();
    
    // Add loading state on form submit
    setupFormSubmit();
    
    // Animate page elements
    animatePageElements();
    
    // Add keyboard shortcuts
    addKeyboardShortcuts();
    
    // Enhance form interactions
    enhanceFormInteractions();
    
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
   * Set minimum date to today for the date input
   */
  function setMinimumDate() {
    const dateInput = document.getElementById('new_date');
    
    if (dateInput) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const minDate = tomorrow.toISOString().split('T')[0];
      dateInput.setAttribute('min', minDate);
      
      // Add visual feedback
      dateInput.addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);
        
        if (selectedDate <= todayDate) {
          this.setCustomValidity('Please select a future date');
          this.classList.add('invalid');
        } else {
          this.setCustomValidity('');
          this.classList.remove('invalid');
        }
      });
    }
  }
  
  /**
   * Setup comprehensive form validation
   */
  function setupFormValidation() {
    const form = document.getElementById('postponeForm');
    
    if (!form) return;
    
    const dateInput = document.getElementById('new_date');
    const startTimeInput = document.getElementById('new_start_time');
    const endTimeInput = document.getElementById('new_end_time');
    
    // Real-time validation on inputs
    const inputs = [dateInput, startTimeInput, endTimeInput];
    
    inputs.forEach(input => {
      if (input) {
        input.addEventListener('blur', function() {
          validateField(this);
        });
        
        input.addEventListener('input', function() {
          if (this.classList.contains('invalid')) {
            validateField(this);
          }
        });
      }
    });
    
    // Form submission validation
    form.addEventListener('submit', function(e) {
      let isValid = true;
      
      inputs.forEach(input => {
        if (input && !validateField(input)) {
          isValid = false;
        }
      });
      
      // Validate time range
      if (startTimeInput && endTimeInput) {
        if (!validateTimeRange(startTimeInput.value, endTimeInput.value)) {
          isValid = false;
          showError(endTimeInput, 'End time must be after start time');
        }
      }
      
      if (!isValid) {
        e.preventDefault();
        scrollToFirstError();
      }
    });
  }
  
  /**
   * Validate individual field
   */
  function validateField(field) {
    if (!field.value.trim()) {
      showError(field, 'This field is required');
      return false;
    }
    
    clearError(field);
    return true;
  }
  
  /**
   * Setup real-time time validation
   */
  function setupTimeValidation() {
    const startTimeInput = document.getElementById('new_start_time');
    const endTimeInput = document.getElementById('new_end_time');
    
    if (!startTimeInput || !endTimeInput) return;
    
    function validateTimes() {
      const startTime = startTimeInput.value;
      const endTime = endTimeInput.value;
      
      if (startTime && endTime) {
        if (!validateTimeRange(startTime, endTime)) {
          showError(endTimeInput, 'End time must be after start time');
          return false;
        } else {
          clearError(endTimeInput);
          showTimeDuration(startTime, endTime);
          return true;
        }
      }
      return true;
    }
    
    startTimeInput.addEventListener('change', validateTimes);
    endTimeInput.addEventListener('change', validateTimes);
  }
  
  /**
   * Validate time range
   */
  function validateTimeRange(startTime, endTime) {
    const start = convertTimeToMinutes(startTime);
    const end = convertTimeToMinutes(endTime);
    return end > start;
  }
  
  /**
   * Convert time string to minutes
   */
  function convertTimeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }
  
  /**
   * Show time duration between start and end
   */
  function showTimeDuration(startTime, endTime) {
    const start = convertTimeToMinutes(startTime);
    const end = convertTimeToMinutes(endTime);
    const duration = end - start;
    
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    
    let durationText = '';
    if (hours > 0) {
      durationText += `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
      if (hours > 0) durationText += ' ';
      durationText += `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    
    // Display duration hint
    const endTimeInput = document.getElementById('new_end_time');
    let durationHint = endTimeInput.parentElement.querySelector('.duration-hint');
    
    if (!durationHint) {
      durationHint = document.createElement('small');
      durationHint.className = 'duration-hint';
      durationHint.style.color = '#28a745';
      durationHint.style.fontWeight = '600';
      durationHint.style.marginTop = '0.25rem';
      durationHint.style.display = 'block';
      endTimeInput.parentElement.appendChild(durationHint);
    }
    
    durationHint.textContent = `Duration: ${durationText}`;
  }
  
  /**
   * Show error message for field
   */
  function showError(field, message) {
    field.classList.add('invalid');
    field.style.borderColor = '#dc3545';
    
    let errorMsg = field.parentElement.querySelector('.error-message');
    
    if (!errorMsg) {
      errorMsg = document.createElement('small');
      errorMsg.className = 'error-message';
      errorMsg.style.color = '#dc3545';
      errorMsg.style.fontWeight = '600';
      errorMsg.style.marginTop = '0.25rem';
      errorMsg.style.display = 'block';
      field.parentElement.appendChild(errorMsg);
    }
    
    errorMsg.textContent = message;
  }
  
  /**
   * Clear error message for field
   */
  function clearError(field) {
    field.classList.remove('invalid');
    field.style.borderColor = '';
    
    const errorMsg = field.parentElement.querySelector('.error-message');
    if (errorMsg) {
      errorMsg.remove();
    }
  }
  
  /**
   * Scroll to first error
   */
  function scrollToFirstError() {
    const firstError = document.querySelector('.invalid');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstError.focus();
    }
  }
  
  /**
   * Setup form submit with loading state
   */
  function setupFormSubmit() {
    const form = document.getElementById('postponeForm');
    const submitBtn = form ? form.querySelector('.btn-primary') : null;
    
    if (!form || !submitBtn) return;
    
    form.addEventListener('submit', function(e) {
      // Check if form is valid
      const isValid = form.checkValidity();
      
      if (isValid) {
        // Show loading state
        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="btn-icon">⏳</span> Processing...';
        submitBtn.style.opacity = '0.7';
        submitBtn.style.pointerEvents = 'none';
        submitBtn.disabled = true;
        
        // Add loading overlay
        showLoadingOverlay();
      }
    });
  }
  
  /**
   * Show loading overlay
   */
  function showLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `;
    
    overlay.innerHTML = `
      <div style="background: white; padding: 2rem; border-radius: 12px; text-align: center; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);">
        <div style="font-size: 3rem; margin-bottom: 1rem;">⏳</div>
        <h3 style="color: #2E5090; margin-bottom: 0.5rem;">Postponing Event</h3>
        <p style="color: #6c757d;">Please wait...</p>
      </div>
    `;
    
    document.body.appendChild(overlay);
  }
  
  /**
   * Animate page elements on load
   */
  function animatePageElements() {
    const elements = [
      '.event-details-card',
      '.postpone-form-card'
    ];
    
    elements.forEach((selector, index) => {
      const element = document.querySelector(selector);
      if (element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }, 100 + (index * 150));
      }
    });
  }
  
  /**
   * Add keyboard shortcuts
   */
  function addKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
      // Don't trigger if typing in an input
      if (document.activeElement.tagName === 'INPUT' || 
          document.activeElement.tagName === 'TEXTAREA') {
        return;
      }
      
      // Press 'B' to go back
      if (e.key === 'b' || e.key === 'B') {
        const backBtn = document.querySelector('.btn-back');
        if (backBtn) {
          backBtn.click();
        }
      }
      
      // Press 'Esc' to cancel/go back
      if (e.key === 'Escape') {
        const cancelBtn = document.querySelector('.btn-secondary');
        if (cancelBtn && confirm('Cancel postponing this event?')) {
          window.location.href = cancelBtn.href;
        }
      }
    });
  }
  
  /**
   * Enhance form interactions
   */
  function enhanceFormInteractions() {
    const formControls = document.querySelectorAll('.form-control');
    
    formControls.forEach(control => {
      // Add focus animation
      control.addEventListener('focus', function() {
        this.parentElement.style.transform = 'scale(1.01)';
        this.parentElement.style.transition = 'transform 0.2s ease';
      });
      
      control.addEventListener('blur', function() {
        this.parentElement.style.transform = 'scale(1)';
      });
      
      // Add filled class when input has value
      control.addEventListener('input', function() {
        if (this.value) {
          this.classList.add('filled');
        } else {
          this.classList.remove('filled');
        }
      });
      
      // Check initial value
      if (control.value) {
        control.classList.add('filled');
      }
    });
  }
  
  /**
   * Add date change notification
   */
  function addDateChangeNotification() {
    const dateInput = document.getElementById('new_date');
    
    if (dateInput) {
      dateInput.addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
        const formattedDate = selectedDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        
        // Show date info
        let dateInfo = this.parentElement.querySelector('.date-info');
        
        if (!dateInfo) {
          dateInfo = document.createElement('small');
          dateInfo.className = 'date-info';
          dateInfo.style.color = '#2E5090';
          dateInfo.style.fontWeight = '600';
          dateInfo.style.marginTop = '0.25rem';
          dateInfo.style.display = 'block';
          this.parentElement.appendChild(dateInfo);
        }
        
        dateInfo.textContent = `${dayOfWeek}, ${formattedDate}`;
      });
    }
  }
  
  /**
   * Add form field animations
   */
  function addFieldAnimations() {
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach((group, index) => {
      group.style.opacity = '0';
      group.style.transform = 'translateX(-20px)';
      
      setTimeout(() => {
        group.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        group.style.opacity = '1';
        group.style.transform = 'translateX(0)';
      }, 600 + (index * 100));
    });
  }
  
  /**
   * Add info items hover effect
   */
  function addInfoItemsEffect() {
    const infoItems = document.querySelectorAll('.info-item');
    
    infoItems.forEach(item => {
      item.addEventListener('mouseenter', function() {
        this.style.borderLeftWidth = '5px';
      });
      
      item.addEventListener('mouseleave', function() {
        this.style.borderLeftWidth = '3px';
      });
    });
  }
  
  /**
   * Validate form on page visibility change
   */
  function handleVisibilityChange() {
    document.addEventListener('visibilitychange', function() {
      if (!document.hidden) {
        // Re-validate when user returns to tab
        const form = document.getElementById('postponeForm');
        if (form) {
          const dateInput = document.getElementById('new_date');
          if (dateInput && dateInput.value) {
            setMinimumDate();
          }
        }
      }
    });
  }
  
  /**
   * Add confirmation before leaving with unsaved changes
   */
  function addUnsavedChangesWarning() {
    const form = document.getElementById('postponeForm');
    let formModified = false;
    
    if (form) {
      const inputs = form.querySelectorAll('input');
      
      inputs.forEach(input => {
        input.addEventListener('change', function() {
          formModified = true;
        });
      });
      
      window.addEventListener('beforeunload', function(e) {
        if (formModified) {
          e.preventDefault();
          e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
          return e.returnValue;
        }
      });
      
      // Don't warn on form submit
      form.addEventListener('submit', function() {
        formModified = false;
      });
    }
  }
  
  // Initialize all additional features
  addDateChangeNotification();
  addFieldAnimations();
  addInfoItemsEffect();
  handleVisibilityChange();
  addUnsavedChangesWarning();
  
  // Add CSS for filled state
  const style = document.createElement('style');
  style.textContent = `
    .form-control.filled {
      background-color: #f8f9fa;
    }
    
    .form-control.invalid {
      border-color: #dc3545 !important;
      animation: shake 0.3s ease;
    }
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }
    
    .info-item {
      transition: all 0.3s ease, border-left-width 0.2s ease;
    }
  `;
  document.head.appendChild(style);