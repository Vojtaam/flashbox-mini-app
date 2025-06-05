class FlashBOXApp {
    constructor() {
        this.selectedAction = null;
        this.username = null;
        this.isDebugMode = !window.Telegram?.WebApp;
        this.sendingMode = 'UNKNOWN';
        this.isLoading = false;
        
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Initializing FlashBOX v5.0...');
            
            // Initialize Telegram WebApp
            await this.initTelegramWebApp();
            
            // Detect sending mode
            this.detectSendingMode();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Update UI
            this.updateUI();
            
            console.log('✅ FlashBOX v5.0 initialized successfully');
            console.log(`📡 Sending mode: ${this.sendingMode}`);
            console.log(`👤 Username: ${this.username}`);
            
        } catch (error) {
            console.error('❌ Error during initialization:', error);
            this.showToast('Chyba při inicializaci aplikace', 'error');
        }
    }

    async initTelegramWebApp() {
        if (this.isDebugMode) {
            console.log('🔧 Debug mode: Running without Telegram');
            this.username = 'testuser';
            this.updateConnectionStatus('debug', 'Debug režim');
            return;
        }

        try {
            const tg = window.Telegram.WebApp;
            
            // Initialize Telegram WebApp
            tg.ready();
            tg.expand();
            tg.setBackgroundColor('#0a0a0a');
            tg.setHeaderColor('#0a0a0a');
            
            // Get username from Telegram data
            if (tg.initDataUnsafe?.user?.username) {
                this.username = tg.initDataUnsafe.user.username;
            } else if (tg.initDataUnsafe?.user?.first_name) {
                this.username = tg.initDataUnsafe.user.first_name;
            } else {
                this.username = 'user';
            }
            
            // Store reference to Telegram WebApp
            this.tg = tg;
            
            console.log('✅ Telegram WebApp initialized');
            console.log('📱 Platform:', tg.platform);
            console.log('🎨 Color scheme:', tg.colorScheme);
            
            this.updateConnectionStatus('connected', 'Připojeno k Telegram');
            
        } catch (error) {
            console.error('❌ Error initializing Telegram WebApp:', error);
            this.username = 'user';
            this.updateConnectionStatus('error', 'Chyba připojení');
        }
    }

    detectSendingMode() {
        if (this.isDebugMode) {
            this.sendingMode = 'DEBUG';
            return;
        }

        const tg = window.Telegram.WebApp;
        
        // Try to detect the button type based on available methods
        if (tg?.sendData) {
            this.sendingMode = 'KEYBOARD_BUTTON';
        } else if (tg?.switchInlineQuery) {
            this.sendingMode = 'MENU_BUTTON';
        } else if (tg?.answerWebAppQuery) {
            this.sendingMode = 'ANSWERWEBAPPQUERY';
        } else {
            this.sendingMode = 'FALLBACK';
        }
        
        console.log(`🔍 Detected sending mode: ${this.sendingMode}`);
    }

    setupEventListeners() {
        // Description input character counter
        this.setupCharacterCounter();
        
        // Action buttons
        this.setupActionButtons();
        
        // Dialog buttons
        this.setupDialogButtons();
        
        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
    }

    setupCharacterCounter() {
        const input = document.getElementById('description-input');
        const counter = document.getElementById('char-count');
        const counterElement = document.querySelector('.char-counter');

        if (input && counter) {
            input.addEventListener('input', (e) => {
                const length = e.target.value.length;
                const maxLength = 50;
                
                counter.textContent = length;
                
                // Update counter styling
                counterElement.classList.remove('warning', 'error');
                if (length >= maxLength) {
                    counterElement.classList.add('error');
                } else if (length >= maxLength * 0.8) {
                    counterElement.classList.add('warning');
                }
                
                // Subtle animation feedback
                e.target.style.transform = 'scale(1.01)';
                setTimeout(() => {
                    e.target.style.transform = '';
                }, 150);
            });
        }
    }

    setupActionButtons() {
        const insertBtn = document.getElementById('insert-btn');
        const removeBtn = document.getElementById('remove-btn');

        if (insertBtn) {
            insertBtn.addEventListener('click', () => {
                this.handleActionClick('Vloženo');
            });
        }

        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                this.handleActionClick('Vyzvednuto');
            });
        }
    }

    setupDialogButtons() {
        const cancelBtn = document.getElementById('cancel-btn');
        const confirmBtn = document.getElementById('confirm-btn');

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.hideDialog();
            });
        }

        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                this.sendMessage();
            });
        }

        // Close dialog on overlay click
        const dialogOverlay = document.getElementById('confirmation-dialog');
        if (dialogOverlay) {
            dialogOverlay.addEventListener('click', (e) => {
                if (e.target === dialogOverlay) {
                    this.hideDialog();
                }
            });
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideDialog();
            }
            
            if (e.key === 'Enter' && e.ctrlKey) {
                const dialog = document.getElementById('confirmation-dialog');
                if (dialog && dialog.classList.contains('show')) {
                    this.sendMessage();
                }
            }
        });
    }

    handleActionClick(action) {
        this.selectedAction = action;
        
        console.log(`🎯 Action selected: ${action}`);
        
        // Haptic feedback
        this.triggerHapticFeedback();
        
        // Show confirmation dialog
        this.showConfirmationDialog();
    }

    showConfirmationDialog() {
        const message = this.generateMessage();
        const preview = document.getElementById('message-preview');
        
        if (preview) {
            preview.textContent = message;
        }
        
        const dialog = document.getElementById('confirmation-dialog');
        if (dialog) {
            dialog.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    hideDialog() {
        const dialog = document.getElementById('confirmation-dialog');
        if (dialog) {
            dialog.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    generateMessage() {
        const input = document.getElementById('description-input');
        const description = input ? input.value.trim() : '';
        
        if (description) {
            return `FlashBOX: ${this.selectedAction} | ${description}`;
        } else {
            return `FlashBOX: ${this.selectedAction} | -`;
        }
    }

    async sendMessage() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoadingState(true);
        
        const message = this.generateMessage();
        
        try {
            console.log(`🚀 Sending message via ${this.sendingMode}:`, message);
            
            switch (this.sendingMode) {
                case 'KEYBOARD_BUTTON':
                    await this.sendViaKeyboardButton(message);
                    break;
                    
                case 'MENU_BUTTON':
                    await this.sendViaMenuButton(message);
                    break;
                    
                case 'ANSWERWEBAPPQUERY':
                    await this.sendViaAnswerWebAppQuery(message);
                    break;
                    
                case 'DEBUG':
                    await this.sendViaDebugMode(message);
                    break;
                    
                default:
                    await this.sendViaFallback(message);
                    break;
            }
            
            this.showToast('Zpráva úspěšně odeslána!', 'success');
            this.trackEvent('message_sent', {
                action: this.selectedAction,
                mode: this.sendingMode,
                has_description: document.getElementById('description-input')?.value.trim().length > 0
            });
            
            // Close app after short delay
            setTimeout(() => {
                this.closeApp();
            }, 2000);
            
        } catch (error) {
            console.error('❌ Error sending message:', error);
            this.showToast('Chyba při odesílání zprávy', 'error');
        } finally {
            this.isLoading = false;
            this.showLoadingState(false);
            this.hideDialog();
        }
    }

    async sendViaKeyboardButton(message) {
        if (this.tg?.sendData) {
            this.tg.sendData(message);
            console.log('✅ Message sent via sendData');
        } else {
            throw new Error('sendData method not available');
        }
    }

    async sendViaMenuButton(message) {
        // Simulate backend request for menu button
        const response = await fetch('/api/telegram/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                user_id: this.tg?.initDataUnsafe?.user?.id,
                chat_id: this.tg?.initDataUnsafe?.start_param
            })
        });
        
        if (!response.ok) {
            throw new Error('Backend send failed');
        }
        
        console.log('✅ Message sent via backend');
    }

    async sendViaAnswerWebAppQuery(message) {
        if (this.tg?.answerWebAppQuery) {
            this.tg.answerWebAppQuery(this.tg.initDataUnsafe?.query_id, {
                type: 'article',
                id: Date.now().toString(),
                title: 'FlashBOX Hlášení',
                message_text: message
            });
            console.log('✅ Message sent via answerWebAppQuery');
        } else {
            throw new Error('answerWebAppQuery method not available');
        }
    }

    async sendViaDebugMode(message) {
        // Simulate sending in debug mode
        await this.simulateDelay(1000);
        console.log('✅ Message sent via DEBUG mode:', message);
    }

    async sendViaFallback(message) {
        // Fallback to switchInlineQuery if available
        if (this.tg?.switchInlineQuery) {
            this.tg.switchInlineQuery(message, ['groups', 'supergroups']);
            console.log('✅ Message sent via fallback switchInlineQuery');
        } else {
            throw new Error('No sending method available');
        }
    }

    closeApp() {
        if (!this.isDebugMode && this.tg?.close) {
            try {
                this.tg.close();
            } catch (error) {
                console.log('Cannot close app:', error);
            }
        } else {
            // Debug mode - reset form instead of closing
            this.resetForm();
            this.showToast('Aplikace by se nyní zavřela (DEBUG)', 'info');
        }
    }

    resetForm() {
        const input = document.getElementById('description-input');
        const counter = document.getElementById('char-count');
        
        if (input) {
            input.value = '';
        }
        
        if (counter) {
            counter.textContent = '0';
        }
        
        this.selectedAction = null;
    }

    showLoadingState(show) {
        const btn = document.getElementById('confirm-btn');
        
        if (btn) {
            if (show) {
                btn.classList.add('loading');
                btn.disabled = true;
            } else {
                btn.classList.remove('loading');
                btn.disabled = false;
            }
        }
    }

    updateConnectionStatus(status, text) {
        const dot = document.getElementById('status-dot');
        const textElement = document.getElementById('connection-text');
        
        if (dot) {
            dot.className = `status-dot ${status}`;
        }
        
        if (textElement) {
            textElement.textContent = text;
        }
    }

    updateUI() {
        // Update username display
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay) {
            usernameDisplay.textContent = `@${this.username}`;
        }
        
        // Update debug info
        this.updateDebugInfo();
    }

    updateDebugInfo() {
        const debugMode = document.getElementById('debug-mode');
        const apiStatus = document.getElementById('api-status');
        const debugInfo = document.getElementById('debug-info');
        
        if (debugMode) {
            debugMode.textContent = this.sendingMode;
        }
        
        if (apiStatus) {
            const hasAPI = !this.isDebugMode && window.Telegram?.WebApp;
            apiStatus.textContent = hasAPI ? 'dostupné' : 'nedostupné';
        }
        
        // Hide debug info in production
        if (debugInfo && !this.isDebugMode) {
            debugInfo.classList.add('hidden');
        }
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

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        container.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Hide and remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (container.contains(toast)) {
                    container.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    simulateDelay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    trackEvent(eventName, data = {}) {
        console.log(`📊 Event: ${eventName}`, data);
        
        // In production, send to analytics service
        if (!this.isDebugMode) {
            // Analytics integration would go here
        }
    }
}

// Enhanced error handling
class ErrorHandler {
    static init() {
        window.addEventListener('error', this.handleError);
        window.addEventListener('unhandledrejection', this.handlePromiseRejection);
    }

    static handleError(event) {
        console.error('Global error:', event.error);
        if (window.flashBoxApp) {
            window.flashBoxApp.showToast('Nastala neočekávaná chyba', 'error');
        }
    }

    static handlePromiseRejection(event) {
        console.error('Unhandled promise rejection:', event.reason);
        event.preventDefault();
        if (window.flashBoxApp) {
            window.flashBoxApp.showToast('Chyba při zpracování požadavku', 'error');
        }
    }
}

// Performance monitor for 60fps target
class PerformanceMonitor {
    static init() {
        if (!window.flashBoxApp?.isDebugMode) return;
        
        let frames = 0;
        let lastTime = performance.now();
        
        function tick(currentTime) {
            frames++;
            
            if (currentTime >= lastTime + 1000) {
                const fps = Math.round((frames * 1000) / (currentTime - lastTime));
                console.log(`📈 FPS: ${fps}`);
                
                frames = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(tick);
        }
        
        requestAnimationFrame(tick);
    }
}

// Accessibility enhancements
class AccessibilityManager {
    static init() {
        this.addKeyboardNavigation();
        this.addARIALabels();
    }

    static addKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    static addARIALabels() {
        // Add ARIA labels to buttons
        const insertBtn = document.getElementById('insert-btn');
        const removeBtn = document.getElementById('remove-btn');
        
        if (insertBtn) {
            insertBtn.setAttribute('aria-label', 'Nahlásit vložení úložných karet');
        }
        
        if (removeBtn) {
            removeBtn.setAttribute('aria-label', 'Nahlásit vyzvednutí úložných karet');
        }
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('🌟 DOM loaded, starting FlashBOX v5.0...');
        
        // Initialize main app
        window.flashBoxApp = new FlashBOXApp();
        
        // Initialize additional features
        ErrorHandler.init();
        AccessibilityManager.init();
        
        // Performance monitoring in debug mode
        setTimeout(() => {
            PerformanceMonitor.init();
        }, 1000);
        
        console.log('🚀 FlashBOX v5.0 initialization complete');
        
    } catch (error) {
        console.error('❌ Critical error during initialization:', error);
        
        // Emergency fallback
        document.body.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #fff; font-family: system-ui;">
                <h2>⚠️ Chyba aplikace</h2>
                <p>Nastala kritická chyba při načítání aplikace.</p>
                <p>Zkuste obnovit stránku nebo kontaktujte podporu.</p>
            </div>
        `;
    }
});

// Expose debugging utilities in development
if (typeof window !== 'undefined') {
    window.FlashBOXDebug = {
        getApp: () => window.flashBoxApp,
        testMessage: (action, description = '') => {
            if (window.flashBoxApp) {
                const oldAction = window.flashBoxApp.selectedAction;
                window.flashBoxApp.selectedAction = action;
                
                const input = document.getElementById('description-input');
                const oldValue = input?.value || '';
                if (input) input.value = description;
                
                const result = window.flashBoxApp.generateMessage();
                
                // Restore values
                window.flashBoxApp.selectedAction = oldAction;
                if (input) input.value = oldValue;
                
                return result;
            }
            return null;
        },
        simulateClick: (action) => {
            const btnId = action === 'Vloženo' ? 'insert-btn' : 'remove-btn';
            const button = document.getElementById(btnId);
            if (button) button.click();
        },
        getSendingMode: () => window.flashBoxApp?.sendingMode || 'UNKNOWN',
        showToast: (message, type) => window.flashBoxApp?.showToast(message, type)
    };
}