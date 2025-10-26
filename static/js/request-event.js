/**
 * CESMS Request Event JavaScript
 * Handles form validation, date restrictions, and user interactions
 */

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeRequestEvent();
});

/**
 * Initialize request event functionality
 */
function initializeRequestEvent() {
    initializeFormValidation();
    initializeDateRestrictions();
    initializeTimeValidation();
    initializeFormSubmission();
    initializeFlashMessages();
    initializeAccessibility();
}

/**
 * Initialize flash message dismissal
 */
function initializeFlashMessages() {
    const closeButtons = document.querySelectorAll('.flash-message .close-btn');
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const message = this.closest('.flash-message');
            dismissFlashMessage(message);
        });
    });
    
    // Auto-dismiss after 5 seconds
    const messages = document.querySelectorAll('.flash-message');
    messages.forEach(message => {
        setTimeout(() => {
            dismissFlashMessage(message);
        }, 5000);
    });
}

/**
 * Dismiss flash message with animation
 */
function dismissFlashMessage(message) {
    if (!message) return;
    
    message.style.animation = 'slideOutUp 0.3s ease forwards';
    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 300);
}

/**
 * Initialize form validation
 */
function initializeFormValidation() {
    const form = document.querySelector('.event-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('.form-input, .form-textarea');
    
    inputs.forEach(input => {
        // Real-time validation with debounce
        let timeout;
        input.addEventListener('input', () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                validateField(input);
            }, 300);
        });
        
        // Validation on blur
        input.addEventListener('blur', () => {
            validateField(input);
        });
    });
}

/**
 * Validate individual field
 */
function validateField(input) {
    const value = input.value.trim();
    const fieldName = input.name;
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error styling and messages
    input.classList.remove('error', 'success');
    removeErrorMessage(input);
    
    // Required field validation
    if (input.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${getFieldLabel(input)} is required.`;
    }
    
    // Event name validation
    if (fieldName === 'event_name' && value) {
        if (value.length < 3) {
            isValid = false;
            errorMessage = 'Event name must be at least 3 characters long.';
        } else if (value.length > 100) {
            isValid = false;
            errorMessage = 'Event name must be less than 100 characters.';
        }
    }
    
    // Location validation
    if (fieldName === 'location' && value) {
        if (value.length < 3) {
            isValid = false;
            errorMessage = 'Location must be at least 3 characters long.';
        }
    }
    
    // Participant limit validation
    if (fieldName === 'participant_limit' && value) {
        const limit = parseInt(value);
        if (isNaN(limit) || limit < 1) {
            isValid = false;
            errorMessage = 'Participant limit must be a positive number.';
        } else if (limit > 10000) {
            isValid = false;
            errorMessage = 'Participant limit cannot exceed 10,000.';
        }
    }
    
    // Apply validation styling
    if (isValid && value) {
        input.classList.add('success');
    } else if (!isValid) {
        input.classList.add('error');
        showErrorMessage(input, errorMessage);
    }
    
    return isValid;
}

/**
 * Get field label for error messages
 */
function getFieldLabel(input) {
    const label = document.querySelector(`label[for="${input.id}"]`);
    return label ? label.textContent.replace(' *', '').trim() : input.placeholder || 'This field';
}

/**
 * Show error message
 */
function showErrorMessage(input, message) {
    // Check if error already exists
    const existingError = document.getElementById(`${input.name}-error`);
    if (existingError) return;
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.id = `${input.name}-error`;
    
    // Insert after the input
    const helpText = input.nextElementSibling;
    if (helpText && helpText.classList.contains('form-help')) {
        helpText.parentNode.insertBefore(errorDiv, helpText.nextSibling);
    } else {
        input.parentNode.appendChild(errorDiv);
    }
}

/**
 * Remove error message
 */
function removeErrorMessage(input) {
    const existingError = document.getElementById(`${input.name}-error`);
    if (existingError) {
        existingError.remove();
    }
}

/**
 * Initialize date restrictions
 */
function initializeDateRestrictions() {
    const dateInput = document.querySelector('input[name="date"]');
    if (!dateInput) return;
    
    // Set minimum date to 7 days from today
    const today = new Date();
    const minDate = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));
    const minDateString = minDate.toISOString().split('T')[0];
    
    dateInput.setAttribute('min', minDateString);
    
    // Add change event listener
    dateInput.addEventListener('change', () => {
        validateDateInput(dateInput);
    });
}

/**
 * Validate date input
 */
function validateDateInput(dateInput) {
    const selectedDate = new Date(dateInput.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));
    
    dateInput.classList.remove('error', 'success');
    removeErrorMessage(dateInput);
    
    if (!dateInput.value) {
        return false;
    }
    
    if (selectedDate < minDate) {
        dateInput.classList.add('error');
        showErrorMessage(dateInput, 'Event date must be at least 7 days from today.');
        return false;
    } else {
        dateInput.classList.add('success');
        return true;
    }
}

/**
 * Initialize time validation
 */
function initializeTimeValidation() {
    const startTimeInput = document.querySelector('input[name="start_time"]');
    const endTimeInput = document.querySelector('input[name="end_time"]');
    
    if (!startTimeInput || !endTimeInput) return;
    
    // Add change event listeners
    startTimeInput.addEventListener('change', () => {
        validateTimeInputs(startTimeInput, endTimeInput);
    });
    
    endTimeInput.addEventListener('change', () => {
        validateTimeInputs(startTimeInput, endTimeInput);
    });
}

/**
 * Validate time inputs
 */
function validateTimeInputs(startTimeInput, endTimeInput) {
    const startTime = startTimeInput.value;
    const endTime = endTimeInput.value;
    
    endTimeInput.classList.remove('error', 'success');
    removeErrorMessage(endTimeInput);
    
    if (!startTime || !endTime) return true;
    
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    
    if (end <= start) {
        endTimeInput.classList.add('error');
        showErrorMessage(endTimeInput, 'End time must be after start time.');
        return false;
    } else {
        endTimeInput.classList.add('success');
        return true;
    }
}

/**
 * Initialize form submission
 */
function initializeFormSubmission() {
    const form = document.querySelector('.event-form');
    if (!form) return;
    
    // form.addEventListener('submit', (e) => {
    //     if (!validateForm(form)) {
    //         e.preventDefault();
            
    //         // Focus on first error field
    //         const firstError = form.querySelector('.form-input.error, .form-textarea.error');
    //         if (firstError) {
    //             firstError.focus();
    //         }
            
    //         return false;
    //     }
        
    //     // Show loading state
    //     showLoadingState(form);
    // });
}

/**
 * Validate entire form
 */
function validateForm(form) {
    const inputs = form.querySelectorAll('.form-input[required], .form-textarea[required]');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    // Special validation for time inputs
    const startTimeInput = form.querySelector('input[name="start_time"]');
    const endTimeInput = form.querySelector('input[name="end_time"]');
    
    if (startTimeInput && endTimeInput) {
        if (!validateTimeInputs(startTimeInput, endTimeInput)) {
            isFormValid = false;
        }
    }
    
    // Special validation for date input
    const dateInput = form.querySelector('input[name="date"]');
    if (dateInput) {
        if (!validateDateInput(dateInput)) {
            isFormValid = false;
        }
    }
    
    return isFormValid;
}

/**
 * Show loading state on form submission
 */
function showLoadingState(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return;
    
    const originalText = submitBtn.textContent;
    
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    submitBtn.setAttribute('data-original-text', originalText);
    submitBtn.textContent = 'Submitting Request...';
    
    // Disable all form inputs
    const inputs = form.querySelectorAll('input, textarea, button');
    inputs.forEach(input => {
        input.disabled = true;
    });
}

/**
 * Initialize accessibility features
 */
function initializeAccessibility() {
    // Add ARIA labels to form inputs if not present
    const inputs = document.querySelectorAll('.form-input, .form-textarea');
    inputs.forEach(input => {
        if (!input.getAttribute('aria-label') && !input.getAttribute('aria-describedby')) {
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (label) {
                input.setAttribute('aria-label', label.textContent.replace(' *', '').trim());
            }
        }
    });
    
    // Add ARIA live region for dynamic messages
    if (!document.querySelector('.sr-only[aria-live]')) {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);
    }
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
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
`;
document.head.appendChild(style);