# FlashBOX Mini App - Aktualizovaný JavaScript s Telegram Kompatibilitou

```javascript
// Global application state
class FlashBoxApp {
    constructor() {
        this.isDebugMode = false;
        this.selectedState = null;
        this.description = '';
        this.username = 'user';
        this.telegram = null;
        this.init();
    }

    init() {
        this.checkTelegramAPI();
        this.setupEventListeners();
        this.setupCharacterCounter();
        this.showDebugPanel();
        
        // App entrance animation
        setTimeout(() => {
            document.getElementById('app').classList.add('loaded');
        }, 100);
    }

    checkTelegramAPI() {
        if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
            try {
                this.telegram = window.Telegram.WebApp;
                
                // Základní konfigurace Telegram WebApp
                this.telegram.ready();
                this.telegram.expand();
                this.telegram.setBackgroundColor('#0a0a0a');
                this.telegram.setHeaderColor('#0a0a0a');
                
                // Získání informací o uživateli
                if (this.telegram.initDataUnsafe?.user?.username) {
                    this.username = this.telegram.initDataUnsafe.user.username;
                }
                
                this.isDebugMode = false;
                console.log('Telegram WebApp API initialized successfully');
                
                // Vylepšené UX nastavení
                if (this.telegram.enableClosingConfirmation) {
                    this.telegram.enableClosingConfirmation();
                }
                
            } catch (error) {
                console.warn('Telegram WebApp API error:', error);
                this.isDebugMode = true;
            }
        } else {
            this.isDebugMode = true;
            console.log('Running in debug mode - Telegram WebApp API not available');
        }
    }

    setupEventListeners() {
        // State buttons
        const state1Btn = document.getElementById('state1-btn');
        const state2Btn = document.getElementById('state2-btn');
        
        if (state1Btn) {
            state1Btn.addEventListener('click', () => this.selectState(1));
        }
        if (state2Btn) {
            state2Btn.addEventListener('click', () => this.selectState(2));
        }

        // Description input
        const descriptionInput = document.getElementById('description-input');
        if (descriptionInput) {
            descriptionInput.addEventListener('input', (e) => this.updateDescription(e.target.value));
        }

        // Modal buttons
        const cancelBtn = document.getElementById('cancel-btn');
        const confirmBtn = document.getElementById('confirm-btn');
        const successOkBtn = document.getElementById('success-ok-btn');
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeModal('confirmation-modal'));
        }
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => this.confirmSend());
        }
        if (successOkBtn) {
            successOkBtn.addEventListener('click', () => this.closeModal('success-modal'));
        }

        // Click outside modal to close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-backdrop')) {
                this.closeAllModals();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    setupCharacterCounter() {
        const descriptionInput = document.getElementById('description-input');
        const charCount = document.getElementById('char-count');
        
        if (descriptionInput && charCount) {
            descriptionInput.addEventListener('input', (e) => {
                const length = e.target.value.length;
                charCount.textContent = length;
                
                // Visual feedback for character limit
                if (length > 45) {
                    charCount.style.color = '#ff5459';
                } else if (length > 35) {
                    charCount.style.color = '#ff8800';
                } else {
                    charCount.style.color = 'rgba(255, 255, 255, 0.6)';
                }
            });
        }
    }

    showDebugPanel() {
        const debugPanel = document.getElementById('debug-panel');
        if (this.isDebugMode && debugPanel) {
            debugPanel.classList.remove('hidden');
        }
    }

    selectState(stateId) {
        console.log('State selected:', stateId);
        this.selectedState = stateId;
        this.triggerHapticFeedback();
        this.addRippleEffect(event.currentTarget);
        
        // Get current description
        const descriptionInput = document.getElementById('description-input');
        this.description = descriptionInput ? descriptionInput.value.trim() : '';
        
        // Generate preview message
        const previewMessage = this.generateMessage(stateId, this.description);
        
        // Show confirmation modal
        this.showConfirmationModal(previewMessage);
    }

    updateDescription(value) {
        this.description = value.trim();
    }

    generateMessage(stateId, description) {
        const timestamp = new Date().toISOString();
        const stateText = stateId === 1 ? 'Vloženy úložné karty' : 'Vyzvednuty úložné karty';
        
        // Formát zprávy pro n8n automatizaci
        let message = `[Stav ${stateId}] @${this.username}`;
        
        if (description) {
            message += ` | ${description}`;
        } else {
            message += ` | -`;
        }
        
        message += ` | ${timestamp}`;
        return message;
    }

    showConfirmationModal(previewMessage) {
        const modal = document.getElementById('confirmation-modal');
        const preview = document.getElementById('message-preview');
        
        if (modal && preview) {
            preview.textContent = previewMessage;
            modal.classList.remove('hidden');
            
            // Focus on confirm button for better UX
            setTimeout(() => {
                const confirmBtn = document.getElementById('confirm-btn');
                if (confirmBtn) {
                    confirmBtn.focus();
                }
            }, 100);
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.add('hidden');
        });
    }

    // AKTUALIZOVANÁ METODA PRO TELEGRAM KOMPATIBILITU
    async confirmSend() {
        this.closeModal('confirmation-modal');
        this.showLoadingModal();
        
        try {
            const message = this.generateMessage(this.selectedState, this.description);
            
            // Simulate network delay pro lepší UX
            await this.delay(1500);
            
            if (this.isDebugMode) {
                // Debug mode - pouze log zprávy
                console.log('Debug: Would send message:', message);
                this.showToast('Zpráva odeslána (debug režim)', 'success');
            } else {
                // NOVÉ: Použití switchInlineQuery pro Menu Button kompatibilitu
                if (this.telegram && this.telegram.switchInlineQuery) {
                    // switchInlineQuery automaticky otevře chat selector
                    this.telegram.switchInlineQuery(message, ['groups', 'supergroups']);
                    this.showToast('Přesměrování do chatu...', 'success');
                } else {
                    // Fallback pro starší verze nebo jiné typy tlačítek
                    console.warn('switchInlineQuery not available, trying sendData...');
                    const payload = {
                        state: this.selectedState,
                        description: this.description,
                        message: message,
                        timestamp: new Date().toISOString()
                    };
                    
                    if (this.telegram && this.telegram.sendData) {
                        this.telegram.sendData(JSON.stringify(payload));
                    }
                    
                    this.showToast('Zpráva odeslána', 'success');
                }
            }
            
            this.closeModal('loading-modal');
            this.showSuccessModal();
            this.resetForm();
            
        } catch (error) {
            console.error('Error sending message:', error);
            this.closeModal('loading-modal');
            this.showToast('Chyba při odesílání zprávy', 'error');
        }
    }

    showLoadingModal() {
        const modal = document.getElementById('loading-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    showSuccessModal() {
        const modal = document.getElementById('success-modal');
        if (modal) {
            modal.classList.remove('hidden');
            this.triggerHapticFeedback('success');
        }
    }

    resetForm() {
        const descriptionInput = document.getElementById('description-input');
        const charCount = document.getElementById('char-count');
        
        if (descriptionInput) {
            descriptionInput.value = '';
        }
        if (charCount) {
            charCount.textContent = '0';
            charCount.style.color = 'rgba(255, 255, 255, 0.6)';
        }
        
        this.selectedState = null;
        this.description = '';
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        
        const messageEl = document.createElement('div');
        messageEl.className = 'toast-message';
        messageEl.textContent = message;
        
        toast.appendChild(messageEl);
        container.appendChild(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'toastSlideOut 0.3s ease-in forwards';
                setTimeout(() => {
                    if (toast.parentNode) {
                        container.removeChild(toast);
                    }
                }, 300);
            }
        }, 3000);
    }

    addRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.width = '100px';
        ripple.style.height = '100px';
        ripple.style.marginLeft = '-50px';
        ripple.style.marginTop = '-50px';
        ripple.style.pointerEvents = 'none';
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    triggerHapticFeedback(type = 'light') {
        if (!this.isDebugMode && this.telegram?.HapticFeedback) {
            try {
                switch (type) {
                    case 'success':
                        this.telegram.HapticFeedback.notificationOccurred('success');
                        break;
                    case 'error':
                        this.telegram.HapticFeedback.notificationOccurred('error');
                        break;
                    default:
                        this.telegram.HapticFeedback.impactOccurred('light');
                }
            } catch (error) {
                console.warn('Haptic feedback not available:', error);
            }
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Metoda pro zavření aplikace
    closeApp() {
        if (this.telegram) {
            this.telegram.close();
        }
    }
}

// Add CSS for toast slide out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes toastSlideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('FlashBOX App initializing...');
    window.flashBoxApp = new FlashBoxApp();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        console.log('App became visible');
    } else {
        console.log('App became hidden');
    }
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    if (window.flashBoxApp) {
        window.flashBoxApp.showToast('Došlo k neočekávané chybě', 'error');
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    if (window.flashBoxApp) {
        window.flashBoxApp.showToast('Chyba při zpracování požadavku', 'error');
    }
});
```