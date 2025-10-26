// Edit Request JavaScript

document.addEventListener('DOMContentLoaded', function() {
  
    // Set minimum date to today
    setMinimumDate();
    
    // Setup form validation
    setupFormValidation();
    
    // Setup time validation
    setupTimeValidation();
    
    // Setup form submit
    setupFormSubmit();
    
    // Animate page elements
    animatePageElements();
    
    // Enhance form interactions
    enhanceFormInteractions();
    
    // Add keyboard shortcuts
    addKeyboardShortcuts();
    
    // Add unsaved changes warning
    addUnsavedChangesWarning();
    
  });
  
  /**
   * Set minimum date to today
   */
  function setMinimumDate() {
    const dateInput = document.getElementById('date');
    
    if (dateInput) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const minDate = tomorrow.toISOString().split('T')[0];
      dateInput.setAttribute('min', minDate);
      
      // Validate on change
      dateInput.addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);
        
        if (selectedDate <= todayDate) {
          showError(this, 'Please select a future date');
          this.classList.add('invalid');
        } else {
          clearError(this);
          this.classList.remove('invalid');
          this.classList.add('valid');
          showDateInfo(this);
        }
      });
    }
  }
  
  /**
   * Show date information
   */
  function showDateInfo(dateInput) {
    const selectedDate = new Date(dateInput.value);
    const dayOfWeek = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
    const formattedDate = selectedDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    let dateInfo = dateInput.parentElement.querySelector('.date-info');
    
    if (!dateInfo) {
      dateInfo = document.createElement('small');
      dateInfo.className = 'success-message date-info';
      dateInput.parentElement.appendChild(dateInfo);
    }
    
    dateInfo.textContent = `${dayOfWeek}, ${formattedDate}`;
  }
  
  /**
   * Setup form validation
   */
  function setupFormValidation() {
    const form = document.getElementById('editRequestForm');
    
    if (!form) return;
    
    const requiredInputs = form.querySelectorAll('[required]');
    
    requiredInputs.forEach(input => {
      // Validate on blur
      input.addEventListener('blur', function() {
        validateField(this);
      });
      
      // Clear error on input
      input.addEventListener('input', function() {
        if (this.classList.contains('invalid')) {
          validateField(this);
        }
      });
    });
    
    // Form submission validation
    form.addEventListener('submit', function(e) {
      let isValid = true;
      
      requiredInputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });
      
      // Validate time range
      const startTime = document.getElementById('start_time');
      const endTime = document.getElementById('end_time');
      
      if (startTime && endTime && startTime.value && endTime.value) {
        if (!validateTimeRange(startTime.value, endTime.value)) {
          isValid = false;
          showError(endTime, 'End time must be after start time');
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
    const value = field.value.trim();
    
    if (!value) {
      showError(field, 'This field is required');
      field.classList.add('invalid');
      field.classList.remove('valid');
      return false;
    }
    
    clearError(field);
    field.classList.remove('invalid');
    field.classList.add('valid');
    return true;
  }
  
  /**
   * Setup time validation
   */
  function setupTimeValidation() {
    const startTimeInput = document.getElementById('start_time');
    const endTimeInput = document.getElementById('end_time');
    
    if (!startTimeInput || !endTimeInput) return;
    
    function validateTimes() {
      const startTime = startTimeInput.value;
      const endTime = endTimeInput.value;
      
      if (startTime && endTime) {
        if (!validateTimeRange(startTime, endTime)) {
          showError(endTimeInput, 'End time must be after start time');
          endTimeInput.classList.add('invalid');
          endTimeInput.classList.remove('valid');
          return false;
        } else {
          clearError(endTimeInput);
          endTimeInput.classList.remove('invalid');
          endTimeInput.classList.add('valid');
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
   * Convert time to minutes
   */
  function convertTimeToMinutes(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }
  
  /**
   * Show time duration
   */
  function showTimeDuration(startTime, endTime) {
    const start = convertTimeToMinutes(startTime);
    const end = convertTimeToMinutes(endTime);
    const duration = end - start;
    
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    
    let durationText = 'Duration: ';
    if (hours > 0) {
      durationText += `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
      if (hours > 0) durationText += ' ';
      durationText += `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    
    const endTimeInput = document.getElementById('end_time');
    let durationHint = endTimeInput.parentElement.querySelector('.duration-hint');
    
    if (!durationHint) {
      durationHint = document.createElement('small');
      durationHint.className = 'duration-hint';
      endTimeInput.parentElement.appendChild(durationHint);
    }
    
    durationHint.textContent = durationText;
  }
  
  /**
   * Show error message
   */
  function showError(field, message) {
    clearError(field);
    
    const errorMsg = document.createElement('small');
    errorMsg.className = 'error-message';
    errorMsg.textContent = message;
    field.parentElement.appendChild(errorMsg);
  }
  
  /**
   * Clear error message
   */
  function clearError(field) {
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
   * Setup form submit
   */
  function setupFormSubmit() {
    const form = document.getElementById('editRequestForm');
    const submitBtn = form ? form.querySelector('.btn-primary') : null;
    
    if (!form || !submitBtn) return;
    
    form.addEventListener('submit', function(e) {
      const isValid = form.checkValidity();
      
      if (isValid) {
        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="btn-icon">⏳</span> Updating...';
        submitBtn.disabled = true;
        
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
        <h3 style="color: #2E5090; margin-bottom: 0.5rem;">Updating Event Request</h3>
        <p style="color: #6c757d;">Please wait...</p>
      </div>
    `;
    
    document.body.appendChild(overlay);
  }
  
  /**
   * Animate page elements
   */
  function animatePageElements() {
    const sections = document.querySelectorAll('.form-section');
    
    sections.forEach((section, index) => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        section.style.opacity = '1';
        section.style.transform = 'translateY(0)';
      }, 100 + (index * 150));
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
      
      // Add filled class
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
    
    // Animate section icons
    const sectionIcons = document.querySelectorAll('.section-icon');
    sectionIcons.forEach(icon => {
      icon.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(5deg)';
      });
      
      icon.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
      });
    });
  }
  
  /**
   * Add keyboard shortcuts
   */
  function addKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
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
      
      // Press 'Esc' to cancel
      if (e.key === 'Escape') {
        const cancelBtn = document.querySelector('.btn-secondary');
        if (cancelBtn && confirm('Cancel editing? Any unsaved changes will be lost.')) {
          window.location.href = cancelBtn.href;
        }
      }
      
      // Press 'S' to submit (with Ctrl/Cmd)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const form = document.getElementById('editRequestForm');
        if (form) {
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      }
    });
  }
  
  /**
   * Add unsaved changes warning
   */
  function addUnsavedChangesWarning() {
    const form = document.getElementById('editRequestForm');
    let formModified = false;
    let originalValues = {};
    
    if (form) {
      const inputs = form.querySelectorAll('input, textarea');
      
      // Store original values
      inputs.forEach(input => {
        originalValues[input.name] = input.value;
      });
      
      // Track changes
      inputs.forEach(input => {
        input.addEventListener('change', function() {
          if (this.value !== originalValues[this.name]) {
            formModified = true;
          } else {
            // Check if any field is still modified
            formModified = Array.from(inputs).some(inp => 
              inp.value !== originalValues[inp.name]
            );
          }
        });
      });
      
      // Warn on page leave
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
      
      // Warn on cancel button
      const cancelBtn = document.querySelector('.btn-secondary');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', function(e) {
          if (formModified) {
            if (!confirm('You have unsaved changes. Are you sure you want to cancel?')) {
              e.preventDefault();
            }
          }
        });
      }
    }
  }
  
  /**
   * Add character counter for text inputs
   */
  function addCharacterCounter() {
    const eventNameInput = document.getElementById('event_name');
    const descriptionInput = document.getElementById('description');
    
    if (eventNameInput) {
      addCounter(eventNameInput, 100);
    }
    
    if (descriptionInput) {
      addCounter(descriptionInput, 500);
    }
  }
  
  /**
   * Add counter to input
   */
  function addCounter(input, maxLength) {
    input.setAttribute('maxlength', maxLength);
    
    const counter = document.createElement('small');
    counter.className = 'character-counter';
    counter.style.cssText = `
      display: block;
      text-align: right;
      color: var(--medium-gray);
      font-size: 0.85rem;
      margin-top: 0.25rem;
    `;
    
    const updateCounter = () => {
      const remaining = maxLength - input.value.length;
      counter.textContent = `${input.value.length}/${maxLength} characters`;
      
      if (remaining < 20) {
        counter.style.color = '#dc3545';
      } else if (remaining < 50) {
        counter.style.color = '#ffc107';
      } else {
        counter.style.color = 'var(--medium-gray)';
      }
    };
    
    input.addEventListener('input', updateCounter);
    input.parentElement.appendChild(counter);
    updateCounter();
  }
  
  /**
   * Add real-time form preview (optional)
   */
  function addFormPreview() {
    const inputs = {
      event_name: document.getElementById('event_name'),
      location: document.getElementById('location'),
      date: document.getElementById('date'),
      start_time: document.getElementById('start_time'),
      end_time: document.getElementById('end_time')
    };
    
    // You can add a preview card that shows the event details in real-time
    // This is optional and can be implemented based on requirements
  }
  
  /**
   * Validate participant limit
   */
  function validateParticipantLimit() {
    const participantInput = document.getElementById('participant_limit');
    
    if (participantInput) {
      participantInput.addEventListener('input', function() {
        const value = parseInt(this.value);
        
        if (value && value < 1) {
          showError(this, 'Participant limit must be at least 1');
          this.classList.add('invalid');
        } else if (value && value > 10000) {
          showError(this, 'Participant limit seems too high');
          this.classList.add('invalid');
        } else {
          clearError(this);
          this.classList.remove('invalid');
          if (value) {
            this.classList.add('valid');
          }
        }
      });
    }
  }
  
  /**
   * Add auto-save draft functionality (optional)
   */
  function addAutoSave() {
    const form = document.getElementById('editRequestForm');
    
    if (!form) return;
    
    let autoSaveTimeout;
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('input', function() {
        clearTimeout(autoSaveTimeout);
        
        autoSaveTimeout = setTimeout(() => {
          saveDraft();
        }, 2000); // Save after 2 seconds of inactivity
      });
    });
  }
  
  /**
   * Save draft to localStorage
   */
  function saveDraft() {
    const form = document.getElementById('editRequestForm');
    if (!form) return;
    
    const formData = new FormData(form);
    const draftData = {};
    
    for (let [key, value] of formData.entries()) {
      draftData[key] = value;
    }
    
    try {
      localStorage.setItem('event_request_draft', JSON.stringify(draftData));
      showAutoSaveIndicator();
    } catch (e) {
      console.log('Could not save draft');
    }
  }
  
  /**
   * Show auto-save indicator
   */
  function showAutoSaveIndicator() {
    let indicator = document.getElementById('autosave-indicator');
    
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'autosave-indicator';
      indicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 600;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 1000;
      `;
      indicator.textContent = '✓ Draft saved';
      document.body.appendChild(indicator);
    }
    
    indicator.style.opacity = '1';
    
    setTimeout(() => {
      indicator.style.opacity = '0';
    }, 2000);
  }
  
  /**
   * Handle form field animations on scroll
   */
  function addScrollAnimations() {
    const formGroups = document.querySelectorAll('.form-group');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    formGroups.forEach((group, index) => {
      group.style.opacity = '0';
      group.style.transform = 'translateX(-20px)';
      group.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
      observer.observe(group);
    });
  }
  
  // Initialize additional features
  addCharacterCounter();
  validateParticipantLimit();
  addScrollAnimations();
  
  // Optional: Uncomment to enable auto-save
  // addAutoSave();
  
  // Add CSS for filled state and animations
  const style = document.createElement('style');
  style.textContent = `
    .form-control.filled {
      background-color: #f8f9fa;
    }
    
    .section-icon {
      transition: transform 0.3s ease;
    }
    
    .character-counter {
      transition: color 0.3s ease;
    }
    
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
  `;
  document.head.appendChild(style);