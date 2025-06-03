// FlashBOX Logger v2 - Modern Dark UI with Telegram Integration
class FlashBoxLogger {
    constructor() {
        this.currentState = null;
        this.isLoading = false;
        this.debugMode = false;
        this.telegram = null;

        // Inicializace při načtení DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    async init() {
        this.setupTelegramWebApp();
        this.setupEventListeners();
        this.setupCharCounter();
        this.setupDebugMode();
        this.addMicroInteractions();

        // Fade-in animace při načtení
        await this.playFadeInAnimation();
        this.debugLog('FlashBOX Logger v2 initialized');
    }

    async playFadeInAnimation() {
        return new Promise(resolve => {
            const elements = [
                '.header',
                '.state-buttons-section', 
                '.description-section'
            ];

            elements.forEach((selector, index) => {
                const element = document.querySelector(selector);
                if (element) {
                    element.style.animationDelay = `${index * 0.2}s`;
                }
            });

            setTimeout(resolve, 800);
        });
    }

    setupTelegramWebApp() {
        // Telegram WebApp inicializace podle požadavků uživatele
        if (window.Telegram && window.Telegram.WebApp) {
            const tg = window.Telegram.WebApp;

            // Oznámení Telegram, že aplikace je připravena
            tg.ready();

            // Zvětšení aplikace na celou obrazovku
            tg.expand();

            // Nastavení barvy pozadí a hlavičky
            tg.setBackgroundColor('#0a0a0a');
            tg.setHeaderColor('#0a0a0a');

            this.telegram = tg;
            this.hapticFeedback = tg.HapticFeedback;

            this.debugLog('Telegram WebApp initialized successfully');
        } else {
            this.debugMode = true;
            this.debugLog('Telegram WebApp not available - Debug mode enabled');
            this.showDebugPanel();
        }
    }

    // Pro případné zavření aplikace
    closeApp() {
        if (this.telegram) {
            this.telegram.close();
        } else {
            this.debugLog('Close app called - would close Telegram app');
        }
    }

    // Generování payload podle specifikace
    generatePayload(state) {
        // Získání uživatelského jména
        const username = this.telegram?.initDataUnsafe?.user?.username || 'unknown';

        // Získání textu z inputu
        const description = document.getElementById('description-input')?.value?.trim() || '';

        // Generování časového razítka v ISO formátu
        const timestamp = new Date().toISOString();

        // Formátování zprávy pro n8n
        const message = `[Stav ${state}] @${username} | ${description} | ${timestamp}`;

        return {
            state: state,
            username: username,
            description: description,
            timestamp: timestamp,
            message: message
        };
    }

    // Odeslání dat do Telegram
    sendDataToTelegram(payload) {
        try {
            if (this.telegram && this.telegram.sendData) {
                // Odeslání dat do Telegram
                this.telegram.sendData(JSON.stringify(payload));

                // Zavření aplikace po odeslání
                setTimeout(() => this.telegram.close(), 1000);

                this.debugLog('Data sent successfully:', payload);
                return true;
            } else {
                // Debug režim
                this.debugLog('Debug mode - data would be sent:', payload);
                this.showSuccessToast('Debug: Data odeslána (simulace)');
                return true;
            }
        } catch (error) {
            console.error('Error sending data:', error);
            this.showError('Nepodařilo se odeslat data');
            return false;
        }
    }

    setupEventListeners() {
        // State buttons
        document.getElementById('state1-btn')?.addEventListener('click', (e) => {
            this.handleStateClick(1, e);
        });

        document.getElementById('state2-btn')?.addEventListener('click', (e) => {
            this.handleStateClick(2, e);
        });

        // Modal buttons
        document.getElementById('confirm-btn')?.addEventListener('click', () => {
            this.confirmSend();
        });

        document.getElementById('cancel-btn')?.addEventListener('click', () => {
            this.hideModal();
        });

        // Modal backdrop
        document.querySelector('.modal-backdrop')?.addEventListener('click', () => {
            this.hideModal();
        });

        // Debug toggle
        const debugToggle = document.getElementById('debug-toggle');
        if (debugToggle) {
            debugToggle.addEventListener('click', () => {
                this.hideDebugPanel();
            });
        }

        // Escape key pro zavření modalu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !document.getElementById('confirm-modal')?.classList.contains('hidden')) {
                this.hideModal();
            }
        });
    }

    setupCharCounter() {
        const input = document.getElementById('description-input');
        const counter = document.getElementById('char-count');

        if (!input || !counter) return;

        input.addEventListener('input', () => {
            const length = input.value.length;
            counter.textContent = length;

            // Update counter styling based on character count
            const counterElement = counter.parentElement;
            counterElement.classList.remove('warning', 'danger');

            if (length >= 45) {
                counterElement.classList.add('danger');
            } else if (length >= 35) {
                counterElement.classList.add('warning');
            }
        });

        // Přidání plynulé animace při psaní
        input.addEventListener('focus', () => {
            input.style.transform = 'scale(1.02)';
        });

        input.addEventListener('blur', () => {
            input.style.transform = 'scale(1)';
        });
    }

    setupDebugMode() {
        // Aktivace debug režimu pokud není dostupné Telegram API
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('debug') === 'true' || !this.telegram) {
            this.debugMode = true;
            this.showDebugPanel();
        }
    }

    addMicroInteractions() {
        // Hover efekty pro state buttons
        const stateButtons = document.querySelectorAll('.state-btn');
        stateButtons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                if (this.hapticFeedback) {
                    this.hapticFeedback.selectionChanged();
                }
            });
        });

        // Ripple effect pro tlačítka
        const buttons = document.querySelectorAll('.btn, .state-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.createRippleEffect(e, btn);
            });
        });
    }

    createRippleEffect(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;

        element.style.position = 'relative';
        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    handleStateClick(state, event) {
        if (this.isLoading) return;

        // Haptic feedback
        if (this.hapticFeedback) {
            this.hapticFeedback.impactOccurred('medium');
        }

        this.currentState = state;
        const description = document.getElementById('description-input')?.value?.trim() || '';

        // Validace délky popisu
        if (description.length > 50) {
            this.showError('Popis může mít maximálně 50 znaků');
            return;
        }

        this.showConfirmModal(state, description);
        this.debugLog(`State ${state} clicked`, { description });
    }

    showConfirmModal(state, description) {
        const username = this.getUsername();
        const timestamp = this.getTimestamp();

        // Vytvoření preview zprávy
        const message = this.formatMessage(state, username, description, timestamp);

        const previewElement = document.getElementById('message-preview');
        if (previewElement) {
            previewElement.textContent = message;
        }

        const modal = document.getElementById('confirm-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }

        // Focus na confirm button pro accessibility
        setTimeout(() => {
            document.getElementById('confirm-btn')?.focus();
        }, 100);

        this.debugLog(`Preview message: ${message}`);
    }

    hideModal() {
        const modal = document.getElementById('confirm-modal');
        if (modal) {
            modal.classList.add('hidden');
        }

        this.currentState = null;

        // Skrytí loading animace pokud je zobrazena
        const loadingAnimation = document.getElementById('loading-animation');
        if (loadingAnimation) {
            loadingAnimation.classList.add('hidden');
        }
    }

    async confirmSend() {
        if (this.isLoading || !this.currentState) return;

        // Haptic feedback
        if (this.hapticFeedback) {
            this.hapticFeedback.impactOccurred('heavy');
        }

        this.setLoading(true);

        try {
            // Generování payload podle nové specifikace
            const payload = this.generatePayload(this.currentState);

            this.debugLog('Sending payload:', payload);

            // Simulace odesílání s progress animací
            await this.simulateSending();

            // Odeslání dat pomocí nové funkce
            const success = this.sendDataToTelegram(payload);

            if (success) {
                // Success animace a notifikace
                await this.showSuccessAnimation();
                this.showSuccessToast('Stav byl úspěšně odeslán!');

                // Reset formuláře
                this.resetForm();
                this.hideModal();
            }

        } catch (error) {
            this.debugLog('Error sending data:', error);
            this.showError('Chyba při odesílání zprávy');
        } finally {
            this.setLoading(false);
        }
    }

    async simulateSending() {
        const loadingContainer = document.getElementById('loading-animation');
        if (loadingContainer) {
            loadingContainer.classList.remove('hidden');
        }

        // Skrytí modal body
        const modalBody = document.querySelector('.modal-body .glass-preview');
        if (modalBody) {
            modalBody.style.display = 'none';
        }

        // Skrytí footer buttons
        const modalFooter = document.querySelector('.modal-footer');
        if (modalFooter) {
            modalFooter.style.display = 'none';
        }

        // Simulace 3 sekundového uploadu
        return new Promise(resolve => {
            setTimeout(resolve, 3000);
        });
    }

    async showSuccessAnimation() {
        // Zobrazení success ikony v loading kontejneru
        const loadingContainer = document.getElementById('loading-animation');
        if (loadingContainer) {
            loadingContainer.innerHTML = `
                <div class="loading-container">
                    <div style="font-size: 48px; color: var(--flashbox-accent-green); margin-bottom: 16px;">✅</div>
                    <div class="loading-text">Úspěšně odesláno!</div>
                </div>
            `;
        }

        return new Promise(resolve => {
            setTimeout(resolve, 1500);
        });
    }

    setLoading(loading) {
        this.isLoading = loading;

        const confirmBtn = document.getElementById('confirm-btn');
        if (confirmBtn) {
            confirmBtn.disabled = loading;
            confirmBtn.textContent = loading ? 'Odesílám...' : 'Potvrdit';
        }
    }

    resetForm() {
        const descriptionInput = document.getElementById('description-input');
        if (descriptionInput) {
            descriptionInput.value = '';
        }

        const charCount = document.getElementById('char-count');
        if (charCount) {
            charCount.textContent = '0';
        }

        this.currentState = null;
    }

    getUsername() {
        return this.telegram?.initDataUnsafe?.user?.username || 'TestUser';
    }

    getTimestamp() {
        return new Date().toISOString();
    }

    formatMessage(state, username, description, timestamp) {
        const desc = description || '';
        return `[Stav ${state}] @${username} | ${desc} | ${timestamp}`;
    }

    showError(message) {
        alert(message); // Jednoduchá implementace - lze vylepšit
        this.debugLog('Error:', message);
    }

    showSuccessToast(message) {
        // Vytvoření toast notifikace
        const toast = document.createElement('div');
        toast.className = 'toast toast--success';
        toast.innerHTML = `
            <span class="toast-icon">✅</span>
            <span>${message}</span>
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('hidden');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    showDebugPanel() {
        if (!this.debugMode) return;

        const existingPanel = document.getElementById('debug-panel');
        if (existingPanel) return;

        const debugPanel = document.createElement('div');
        debugPanel.id = 'debug-panel';
        debugPanel.className = 'debug-panel glass-card';
        debugPanel.innerHTML = `
            <div class="debug-header">
                <h4>🔧 Debug Mode</h4>
                <button id="debug-toggle" class="debug-toggle">×</button>
            </div>
            <div class="debug-content">
                <p>Telegram WebApp není dostupné. Aplikace běží v debug režimu.</p>
                <div id="debug-log"></div>
            </div>
        `;

        document.body.appendChild(debugPanel);

        // Event listener pro zavření
        document.getElementById('debug-toggle')?.addEventListener('click', () => {
            this.hideDebugPanel();
        });
    }

    hideDebugPanel() {
        const panel = document.getElementById('debug-panel');
        if (panel) {
            panel.remove();
        }
    }

    debugLog(message, data = null) {
        if (!this.debugMode) return;

        console.log(`[FlashBOX Debug] ${message}`, data);

        const debugLog = document.getElementById('debug-log');
        if (debugLog) {
            const logEntry = document.createElement('div');
            logEntry.style.cssText = 'margin: 4px 0; font-size: 12px; color: #ccc;';
            logEntry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;

            if (data) {
                logEntry.textContent += ` | ${JSON.stringify(data)}`;
            }

            debugLog.appendChild(logEntry);

            // Omezit počet log entries
            const entries = debugLog.children;
            if (entries.length > 10) {
                debugLog.removeChild(entries[0]);
            }
        }
    }
}

// Spuštění aplikace
new FlashBoxLogger();
