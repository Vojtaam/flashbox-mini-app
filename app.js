// FlashBOX App - Kompletně opravená verze s funkčním klikáním

class FlashBoxApp {
    constructor() {
        // Inicializace stavu aplikace
        this.isDebugMode = false;
        this.selectedState = null;
        this.description = '';
        this.username = 'user';
        this.telegram = null;
        
        // Okamžitá inicializace po načtení DOM
        this.init();
    }

    init() {
        console.log('🚀 FlashBOX inicializace...');
        this.checkTelegramAPI();
        this.setupEventListeners();
        this.setupCharacterCounter();
        this.showDebugPanelIfNeeded();
        
        // App entrance animation
        setTimeout(() => {
            const app = document.getElementById('app');
            if (app) {
                app.classList.add('loaded');
            }
        }, 100);
    }

    checkTelegramAPI() {
        if (typeof window.Telegram !== 'undefined' && window.Telegram.WebApp) {
            try {
                this.telegram = window.Telegram.WebApp;
                
                // TELEGRAM WEBAPP INICIALIZACE
                this.telegram.ready();
                this.telegram.expand();
                this.telegram.setBackgroundColor('#0a0a0a');
                this.telegram.setHeaderColor('#0a0a0a');
                
                // Získání informací o uživateli
                if (this.telegram.initDataUnsafe?.user?.username) {
                    this.username = this.telegram.initDataUnsafe.user.username;
                }
                
                this.isDebugMode = false;
                console.log('✅ Telegram WebApp API initialized successfully');
                
                // UX vylepšení
                if (this.telegram.enableClosingConfirmation) {
                    this.telegram.enableClosingConfirmation();
                }
            } catch (error) {
                console.warn('⚠️ Telegram WebApp API error:', error);
                this.isDebugMode = true;
            }
        } else {
            this.isDebugMode = true;
            console.log('🐛 Running in debug mode - Telegram WebApp API not available');
        }
    }

    setupEventListeners() {
        // OPRAVENO: Správné ID selektory s čekáním na DOM
        console.log('🔧 Nastavuji event listenery...');
        
        // State buttons - s retry mechanismem
        this.setupStateButtons();
        
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
            if (e.target.classList.contains('modal-overlay')) {
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

    setupStateButtons() {
        // Retry mechanismus pro nalezení tlačítek
        let retryCount = 0;
        const maxRetries = 10;
        
        const trySetupButtons = () => {
            const state1Btn = document.getElementById('state1-btn');
            const state2Btn = document.getElementById('state2-btn');
            
            if (state1Btn && state2Btn) {
                console.log('✅ Tlačítka nalezena, přidávám event listenery');
                
                state1Btn.addEventListener('click', (e) => {
                    console.log('🔵 State 1 clicked');
                    this.selectState(1, e);
                });
                
                state2Btn.addEventListener('click', (e) => {
                    console.log('🟢 State 2 clicked');
                    this.selectState(2, e);
                });
                
                return true;
            } else {
                console.log(`⏳ Tlačítka nenalezena, pokus ${retryCount + 1}/${maxRetries}`);
                return false;
            }
        };
        
        // Okamžitý pokus
        if (!trySetupButtons()) {
            // Retry s intervalem
            const retryInterval = setInterval(() => {
                retryCount++;
                
                if (trySetupButtons()) {
                    clearInterval(retryInterval);
                } else if (retryCount >= maxRetries) {
                    console.error('❌ Nepodařilo se najít tlačítka po', maxRetries, 'pokusech');
                    clearInterval(retryInterval);
                }
            }, 100);
        }
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

    showDebugPanelIfNeeded() {
        const debugPanel = document.getElementById('debug-panel');
        if (this.isDebugMode && debugPanel) {
            debugPanel.classList.remove('hidden');
            
            // Update debug username
            const debugUsername = document.getElementById('debug-username');
            if (debugUsername) {
                debugUsername.textContent = this.username;
            }
        }
    }

    selectState(stateId, event) {
        console.log('🎯 State selected:', stateId);
        this.selectedState = stateId;
        this.triggerHapticFeedback();
        
        if (event) {
            this.addRippleEffect(event.currentTarget);
        }

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
        
        // Formát zprávy pro n8n automatizaci
        let message = `[Stav ${stateId}] @${this.username}`;
        
        if (description && description.length > 0) {
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
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            modal.classList.add('hidden');
        });
    }

    // HLAVNÍ METODA PRO ODESÍLÁNÍ - KOMPLETNĚ OPRAVENO
    async confirmSend() {
        this.closeModal('confirmation-modal');
        this.showLoadingModal();
        
        try {
            const message = this.generateMessage(this.selectedState, this.description);
            
            // Simulate progress for better UX
            this.updateProgress(30);
            await this.delay(500);
            this.updateProgress(70);
            await this.delay(500);
            this.updateProgress(100);
            await this.delay(300);

            if (this.isDebugMode) {
                // Debug mode - pouze log zprávy
                console.log('🐛 DEBUG: Would send message:', message);
                this.showToast('Zpráva odeslána (debug režim)', 'success');
            } else {
                // PRODUKČNÍ REŽIM - OPRAVENÁ TELEGRAM INTEGRACE
                if (this.telegram && this.telegram.switchInlineQuery) {
                    // Použití switchInlineQuery pro Menu Button kompatibilitu
                    console.log('📤 Odesílání přes switchInlineQuery...');
                    this.telegram.switchInlineQuery(message, ['groups', 'supergroups']);
                    this.showToast('Přesměrování do chatu...', 'success');
                } else if (this.telegram && this.telegram.sendData) {
                    // Fallback pro jiné typy tlačítek
                    console.log('📤 Odesílání přes sendData...');
                    const payload = {
                        state: this.selectedState,
                        description: this.description,
                        message: message,
                        timestamp: new Date().toISOString()
                    };
                    this.telegram.sendData(JSON.stringify(payload));
                    this.showToast('Zpráva odeslána', 'success');
                } else {
                    console.warn('⚠️ Telegram API není dostupné');
                    this.showToast('Chyba: Telegram API nedostupné', 'error');
                    return;
                }
            }

            this.closeModal('loading-modal');
            this.showSuccessModal();
            this.resetForm();

        } catch (error) {
            console.error('❌ Error sending message:', error);
            this.closeModal('loading-modal');
            this.showToast('Chyba při odesílání zprávy', 'error');
        }
    }

    showLoadingModal() {
        const modal = document.getElementById('loading-modal');
        if (modal) {
            modal.classList.remove('hidden');
            this.updateProgress(0);
        }
    }

    updateProgress(percentage) {
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
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

        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.classList.remove('show');
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
                console.warn('⚠️ Haptic feedback not available:', error);
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

// CSS pro dodatečné animace
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .toast-message {
        color: #ffffff;
        font-weight: 500;
    }
`;
document.head.appendChild(additionalStyles);

// OPRAVENÁ INICIALIZACE - Multiple fallback methods
function initializeApp() {
    console.log('📱 FlashBOX App initializing...');
    
    if (!window.flashBoxApp) {
        window.flashBoxApp = new FlashBoxApp();
    }
}

// Primary initialization method
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM already loaded
    initializeApp();
}

// Secondary fallback
setTimeout(initializeApp, 100);

// Globální error handling
window.addEventListener('error', (event) => {
    console.error('💥 Global error:', event.error);
    if (window.flashBoxApp) {
        window.flashBoxApp.showToast('Došlo k neočekávané chybě', 'error');
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('💥 Unhandled promise rejection:', event.reason);
    if (window.flashBoxApp) {
        window.flashBoxApp.showToast('Chyba při zpracování požadavku', 'error');
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        console.log('👁️ App became visible');
    } else {
        console.log('😴 App became hidden');
    }
});

console.log('✅ FlashBOX App script loaded successfully');