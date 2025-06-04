class FlashBOXApp {
    constructor() {
        this.selectedAction = null;
        this.username = null;
        this.isDebugMode = !window.Telegram?.WebApp;
        this.isLoading = false;
        
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Initializing FlashBOX v3.0...');
            
            // Initialize Telegram WebApp
            await this.initTelegramWebApp();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize UI animations
            this.initializeAnimations();
            
            console.log('✅ FlashBOX v3.0 initialized successfully');
            
            // Hide loading overlay after initialization
            setTimeout(() => {
                this.hideLoadingOverlay();
            }, 800);
            
        } catch (error) {
            console.error('❌ Error during initialization:', error);
            // Ensure loading overlay is hidden even on error
            setTimeout(() => {
                this.hideLoadingOverlay();
            }, 1000);
        }
    }

    async initTelegramWebApp() {
        if (this.isDebugMode) {
            console.log('🔧 Debug mode: Running without Telegram');
            this.username = 'testuser';
            this.updateUsernameDisplay();
            return;
        }

        try {
            const tg = window.Telegram.WebApp;
            
            // Initialize Telegram WebApp
            tg.ready();
            tg.expand();
            tg.setBackgroundColor('#000000');
            tg.setHeaderColor('#000000');
            
            // Get username from Telegram data
            if (tg.initDataUnsafe?.user?.username) {
                this.username = tg.initDataUnsafe.user.username;
            } else if (tg.initDataUnsafe?.user?.first_name) {
                this.username = tg.initDataUnsafe.user.first_name;
            } else {
                this.username = 'user';
            }
            
            // Enable haptic feedback
            this.tg = tg;
            
            console.log('✅ Telegram WebApp initialized');
            console.log('👤 Username:', this.username);
            
        } catch (error) {
            console.error('❌ Error initializing Telegram WebApp:', error);
            this.username = 'user';
        }
        
        this.updateUsernameDisplay();
    }

    updateUsernameDisplay() {
        const usernameElement = document.getElementById('username-display');
        if (usernameElement) {
            usernameElement.textContent = `@${this.username}`;
            usernameElement.style.color = 'var(--neon-blue)';
        }
    }

    setupEventListeners() {
        // Description input character counter
        this.setupCharacterCounter();
        
        // State buttons
        this.setupStateButtons();
        
        // Modal buttons
        this.setupModalButtons();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
    }

    setupCharacterCounter() {
        const descriptionInput = document.getElementById('description-input');
        const charCount = document.getElementById('char-count');
        const characterCounter = document.querySelector('.character-counter');

        if (descriptionInput && charCount) {
            descriptionInput.addEventListener('input', (e) => {
                const length = e.target.value.length;
                const maxLength = 100;
                
                charCount.textContent = length;
                
                // Remove previous states
                characterCounter.classList.remove('warning', 'error');
                
                // Add warning/error states based on length
                if (length >= maxLength) {
                    characterCounter.classList.add('error');
                } else if (length >= maxLength * 0.8) {
                    characterCounter.classList.add('warning');
                }
                
                // Add typing animation
                this.addTypingEffect(e.target);
            });

            // Focus effects
            descriptionInput.addEventListener('focus', () => {
                this.triggerHapticFeedback('light');
            });
        }
    }

    addTypingEffect(element) {
        element.style.transform = 'scale(1.005)';
        setTimeout(() => {
            element.style.transform = '';
        }, 100);
    }

    setupStateButtons() {
        document.querySelectorAll('.state-button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleStateButtonClick(e, button);
            });

            // Add hover sound effect simulation
            button.addEventListener('mouseenter', () => {
                this.triggerHapticFeedback('light');
            });
        });
    }

    setupModalButtons() {
        // Cancel button
        const cancelBtn = document.getElementById('cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.hideModal('confirmation-modal');
                this.triggerHapticFeedback('light');
            });
        }

        // Confirm button
        const confirmBtn = document.getElementById('confirm-btn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                this.sendMessage();
            });
        }

        // Modal backdrop clicks
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) {
                    this.hideModal(backdrop.id);
                }
            });
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideModal('confirmation-modal');
                this.hideModal('success-modal');
            }
            
            if (e.key === 'Enter' && e.ctrlKey) {
                const activeModal = document.querySelector('.modal-backdrop.show');
                if (activeModal && activeModal.id === 'confirmation-modal') {
                    this.sendMessage();
                }
            }
        });
    }

    initializeAnimations() {
        // Staggered entrance animations
        this.addStaggeredAnimations();
        
        // Particle animations
        this.initParticleAnimations();
        
        // Add button interaction animations
        this.enhanceButtonAnimations();
    }

    addStaggeredAnimations() {
        const elements = [
            '.header',
            '.user-info-panel', 
            '.input-section',
            '.state-buttons'
        ];

        elements.forEach((selector, index) => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.animationDelay = `${0.2 + (index * 0.1)}s`;
            }
        });
    }

    initParticleAnimations() {
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            // Random properties for each particle
            const randomDelay = Math.random() * 20;
            const randomSize = 2 + Math.random() * 4;
            const randomOpacity = 0.2 + Math.random() * 0.3;
            
            particle.style.animationDelay = `${randomDelay}s`;
            particle.style.width = particle.style.height = `${randomSize}px`;
            particle.style.opacity = randomOpacity;
        });
    }

    enhanceButtonAnimations() {
        document.querySelectorAll('.state-button').forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (!button.classList.contains('active')) {
                    button.style.transform = 'translateY(-6px) scale(1.02)';
                }
            });
            
            button.addEventListener('mouseleave', () => {
                if (!button.classList.contains('active')) {
                    button.style.transform = '';
                }
            });
        });
    }

    handleStateButtonClick(event, button) {
        const action = button.getAttribute('data-action');
        this.selectedAction = action;
        
        console.log(`🎯 State selected: ${action}`);
        
        // Create ripple effect
        this.createRippleEffect(event, button);
        
        // Haptic feedback
        this.triggerHapticFeedback('medium');
        
        // Add selection state
        document.querySelectorAll('.state-button').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');
        
        // Show confirmation modal with delay for animation
        setTimeout(() => {
            this.showConfirmationModal();
        }, 300);
    }

    createRippleEffect(event, button) {
        const ripple = button.querySelector('.ripple-effect');
        if (!ripple) return;
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.animation = 'none';
        
        // Trigger reflow
        ripple.offsetHeight;
        
        ripple.style.animation = 'ripple 0.6s linear';
    }

    triggerHapticFeedback(intensity = 'light') {
        if (!this.isDebugMode && this.tg?.HapticFeedback) {
            try {
                this.tg.HapticFeedback.impactOccurred(intensity);
            } catch (error) {
                console.log('Haptic feedback not available');
            }
        }
    }

    showConfirmationModal() {
        const messagePreview = document.getElementById('message-preview');
        
        if (messagePreview) {
            const message = this.generateMessage();
            messagePreview.textContent = message;
        }
        
        this.showModal('confirmation-modal');
    }

    generateMessage() {
        const descriptionInput = document.getElementById('description-input');
        const description = descriptionInput ? descriptionInput.value.trim() : '';
        
        if (description) {
            return `FlashBOX: ${this.selectedAction} | ${description}`;
        } else {
            return `FlashBOX: ${this.selectedAction} | -`;
        }
    }

    async sendMessage() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.hideModal('confirmation-modal');
        
        // Show loading state
        this.showLoadingButton();
        this.showToast('Odesílám zprávu...', 'info');
        
        const message = this.generateMessage();
        
        try {
            if (this.isDebugMode) {
                // Debug mode - simulate sending
                console.log('🚀 Sending message (DEBUG):', message);
                await this.simulateDelay(1000);
                
                // Success path for debug mode
                console.log('✅ Message sent successfully (DEBUG)');
                this.showToast('Zpráva úspěšně odeslána!', 'success');
                this.showSuccessModal();
                
                // Track success
                this.trackEvent('message_sent', {
                    action: this.selectedAction,
                    has_description: document.getElementById('description-input')?.value.trim().length > 0,
                    mode: 'debug'
                });
                
            } else {
                // Real Telegram integration
                if (this.tg && this.tg.switchInlineQuery) {
                    console.log('🚀 Sending via Telegram:', message);
                    this.tg.switchInlineQuery(message, ['groups', 'supergroups']);
                    this.showToast('Přesměrování do chatu...', 'success');
                    this.showSuccessModal();
                    
                    // Track success
                    this.trackEvent('message_sent', {
                        action: this.selectedAction,
                        has_description: document.getElementById('description-input')?.value.trim().length > 0,
                        mode: 'telegram'
                    });
                    
                } else {
                    throw new Error('Telegram switchInlineQuery není dostupné');
                }
            }
            
        } catch (error) {
            console.error('❌ Error sending message:', error);
            this.showToast('Chyba při odesílání zprávy', 'error');
        } finally {
            this.isLoading = false;
            this.hideLoadingButton();
        }
    }

    showLoadingButton() {
        const confirmBtn = document.getElementById('confirm-btn');
        const btnLoading = confirmBtn?.querySelector('.btn-loading');
        const btnText = confirmBtn?.querySelector('span');
        
        if (confirmBtn && btnLoading && btnText) {
            btnText.style.opacity = '0';
            btnLoading.style.opacity = '1';
            confirmBtn.disabled = true;
        }
    }

    hideLoadingButton() {
        const confirmBtn = document.getElementById('confirm-btn');
        const btnLoading = confirmBtn?.querySelector('.btn-loading');
        const btnText = confirmBtn?.querySelector('span');
        
        if (confirmBtn && btnLoading && btnText) {
            btnText.style.opacity = '1';
            btnLoading.style.opacity = '0';
            confirmBtn.disabled = false;
        }
    }

    showSuccessModal() {
        this.showModal('success-modal');
        
        // Trigger confetti animation
        this.triggerConfettiAnimation();
        
        // Haptic feedback for success
        this.triggerHapticFeedback('heavy');
        
        // Start countdown
        let countdown = 3;
        const countdownElement = document.getElementById('countdown');
        
        const updateCountdown = () => {
            if (countdownElement) {
                countdownElement.textContent = countdown;
            }
            countdown--;
            
            if (countdown >= 0) {
                setTimeout(updateCountdown, 1000);
            } else {
                this.closeApp();
            }
        };
        
        updateCountdown();
    }

    triggerConfettiAnimation() {
        const confetti = document.querySelector('.confetti');
        if (confetti) {
            // Create multiple confetti pieces
            for (let i = 0; i < 6; i++) {
                const piece = confetti.cloneNode(true);
                const randomX = -100 + Math.random() * 200;
                const randomY = -100 + Math.random() * 200;
                const randomColor = ['var(--neon-blue)', 'var(--neon-green)', 'var(--neon-purple)'][Math.floor(Math.random() * 3)];
                
                piece.style.background = randomColor;
                piece.style.animationDelay = `${i * 0.1}s`;
                piece.style.setProperty('--random-x', `${randomX}px`);
                piece.style.setProperty('--random-y', `${randomY}px`);
                
                confetti.parentNode.appendChild(piece);
                
                setTimeout(() => {
                    if (piece.parentNode) {
                        piece.parentNode.removeChild(piece);
                    }
                }, 1000);
            }
        }
    }

    closeApp() {
        if (!this.isDebugMode && this.tg) {
            try {
                this.tg.close();
            } catch (error) {
                console.log('Cannot close app:', error);
            }
        } else {
            // Debug mode - show message instead of closing
            this.showToast('Aplikace by se nyní zavřela (DEBUG)', 'info');
            this.hideModal('success-modal');
            this.resetApp();
        }
    }

    resetApp() {
        // Clear form
        const descriptionInput = document.getElementById('description-input');
        if (descriptionInput) {
            descriptionInput.value = '';
        }
        
        // Update character counter
        const charCount = document.getElementById('char-count');
        if (charCount) {
            charCount.textContent = '0';
        }
        
        // Remove active states
        document.querySelectorAll('.state-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        this.selectedAction = null;
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Focus management
            const focusableElements = modal.querySelectorAll('button, input, select, textarea');
            if (focusableElements.length > 0) {
                setTimeout(() => {
                    focusableElements[0].focus();
                }, 100);
            }
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">${this.getToastIcon(type)}</div>
            <div class="toast-message">${message}</div>
        `;
        
        container.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (container.contains(toast)) {
                    container.removeChild(toast);
                }
            }, 400);
        }, 3000);
    }

    getToastIcon(type) {
        const icons = {
            success: '✅',
            error: '❌', 
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    hideLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            console.log('🎭 Hiding loading overlay...');
            overlay.classList.add('hidden');
            
            // Force display none after transition
            setTimeout(() => {
                overlay.style.display = 'none';
                console.log('✅ Loading overlay hidden');
            }, 600);
        }
    }

    simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    trackEvent(eventName, data = {}) {
        // Analytics tracking
        console.log(`📊 Event: ${eventName}`, data);
        
        // In production, send to analytics service
        if (!this.isDebugMode) {
            // Send to analytics
        }
    }
}

// Animation and UI enhancement classes
class AnimationManager {
    static init() {
        this.addIntersectionObserver();
        this.enhanceScrollAnimations();
    }

    static addIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.state-button').forEach(el => {
                observer.observe(el);
            });
        }
    }

    static enhanceScrollAnimations() {
        // Add subtle scroll-based animations
        let ticking = false;
        
        function updateScrollAnimations() {
            const scrollY = window.pageYOffset;
            const elements = document.querySelectorAll('.parallax-element');
            
            elements.forEach(el => {
                const speed = el.dataset.speed || 0.5;
                const yPos = -(scrollY * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateScrollAnimations);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick);
    }
}

// Theme and visual enhancement manager
class ThemeManager {
    static init() {
        this.detectSystemTheme();
        this.addDynamicThemeEffects();
    }

    static detectSystemTheme() {
        if (window.matchMedia) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
            this.updateTheme(prefersDark.matches);
            
            prefersDark.addEventListener('change', (e) => {
                this.updateTheme(e.matches);
            });
        }
    }

    static updateTheme(isDark) {
        document.documentElement.setAttribute('data-color-scheme', isDark ? 'dark' : 'light');
    }

    static addDynamicThemeEffects() {
        // Add dynamic color effects based on time of day
        const hour = new Date().getHours();
        const body = document.body;
        
        if (hour >= 22 || hour <= 6) {
            // Night mode - enhance purple tones
            body.style.setProperty('--bg-tertiary', '#2a1a3a');
        } else if (hour >= 6 && hour <= 18) {
            // Day mode - enhance blue tones  
            body.style.setProperty('--bg-tertiary', '#1a2a3a');
        } else {
            // Evening mode - enhance warm tones
            body.style.setProperty('--bg-tertiary', '#3a2a1a');
        }
    }
}

// Global helper functions
window.hideModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal && window.flashBoxApp) {
        window.flashBoxApp.hideModal(modalId);
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 DOM loaded, starting FlashBOX v3.0...');
    
    try {
        // Initialize main app
        window.flashBoxApp = new FlashBOXApp();
        
        // Initialize additional features
        AnimationManager.init();
        ThemeManager.init();
        
        console.log('🚀 FlashBOX v3.0 initialization complete');
    } catch (error) {
        console.error('❌ Error initializing FlashBOX App:', error);
        
        // Fallback: hide loading overlay even if initialization fails
        setTimeout(() => {
            const overlay = document.getElementById('loading-overlay');
            if (overlay) {
                overlay.style.display = 'none';
                console.log('🛡️ Fallback: Loading overlay hidden due to error');
            }
        }, 1500);
    }
});

// Ensure loading overlay is hidden if still visible after 3 seconds
setTimeout(() => {
    const overlay = document.getElementById('loading-overlay');
    if (overlay && !overlay.classList.contains('hidden')) {
        console.log('⚠️ Force hiding loading overlay after timeout');
        overlay.style.display = 'none';
    }
}, 3000);

// Debug helper for development
if (typeof window !== 'undefined') {
    window.FlashBOXDebug = {
        getCurrentAction: () => window.flashBoxApp?.selectedAction || null,
        getUsername: () => window.flashBoxApp?.username || 'unknown',
        getTelegramData: () => window.Telegram?.WebApp?.initDataUnsafe || null,
        testMessage: (action, description) => {
            if (window.flashBoxApp) {
                const oldAction = window.flashBoxApp.selectedAction;
                window.flashBoxApp.selectedAction = action;
                
                const oldInput = document.getElementById('description-input');
                const oldValue = oldInput?.value || '';
                if (oldInput) oldInput.value = description || '';
                
                const result = window.flashBoxApp.generateMessage();
                
                // Restore original values
                window.flashBoxApp.selectedAction = oldAction;
                if (oldInput) oldInput.value = oldValue;
                
                return result;
            }
            return null;
        },
        simulateClick: (action) => {
            const button = document.querySelector(`[data-action="${action}"]`);
            if (button) button.click();
        },
        hideLoading: () => {
            const overlay = document.getElementById('loading-overlay');
            if (overlay) {
                overlay.style.display = 'none';
                console.log('🎭 Debug: Loading overlay manually hidden');
            }
        }
    };
}