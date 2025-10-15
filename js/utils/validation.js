class ValidationUtils {
    static isEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static isRequired(value) {
        return value !== null && value !== undefined && value.toString().trim() !== '';
    }

    static minLength(value, min) {
        return value.length >= min;
    }

    static maxLength(value, max) {
        return value.length <= max;
    }

    static isNumber(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    static isPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    static validateForm(formData, rules) {
        const errors = {};
        
        for (const field in rules) {
            const value = formData[field];
            const fieldRules = rules[field];
            
            for (const rule of fieldRules) {
                if (rule === 'required' && !this.isRequired(value)) {
                    errors[field] = `${field} is required`;
                    break;
                }
                
                if (rule.startsWith('min:') && this.isRequired(value)) {
                    const min = parseInt(rule.split(':')[1]);
                    if (!this.minLength(value, min)) {
                        errors[field] = `${field} must be at least ${min} characters`;
                        break;
                    }
                }
                
                if (rule.startsWith('max:') && this.isRequired(value)) {
                    const max = parseInt(rule.split(':')[1]);
                    if (!this.maxLength(value, max)) {
                        errors[field] = `${field} must be less than ${max} characters`;
                        break;
                    }
                }
                
                if (rule === 'email' && this.isRequired(value) && !this.isEmail(value)) {
                    errors[field] = `${field} must be a valid email address`;
                    break;
                }
                
                if (rule === 'number' && this.isRequired(value) && !this.isNumber(value)) {
                    errors[field] = `${field} must be a valid number`;
                    break;
                }
            }
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    static showErrors(formElement, errors) {
        // Clear previous errors
        this.clearErrors(formElement);
        
        for (const field in errors) {
            const input = formElement.querySelector(`[name="${field}"]`);
            if (input) {
                const errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.textContent = errors[field];
                errorElement.style.color = 'var(--accent-color)';
                errorElement.style.fontSize = '0.8rem';
                errorElement.style.marginTop = '0.25rem';
                
                input.parentNode.appendChild(errorElement);
                input.style.borderColor = 'var(--accent-color)';
            }
        }
    }

    static clearErrors(formElement) {
        const errorMessages = formElement.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
        
        const inputs = formElement.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.style.borderColor = 'var(--border-color)';
        });
    }
}