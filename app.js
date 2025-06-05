// FlashBOX Mini App - Telegram Keyboard Button Integration
class FlashBoxApp {
    constructor() {
        this.isDebugMode = !window.Telegram?.WebApp;
        this.dataSent = false;
        this.selectedAction = null;
        this.username = null;
        
        this.init();
    }

    init() {
        this.initializeTelegram();
        this.setupEventListeners();
        this.updateCharacterCounter();
        this.detectUsername();
        
        if (this.isDebugMode) {
            this.showDebugInfo();
        }
    }

    initializeTelegram() {
        if (window.Telegram?.WebApp) {
            const tg = window.Telegram.WebApp;
            
            try {
                // Initialize Telegram WebApp
                tg.ready();
                tg.expand();
                tg.setBackgroundColor('#0a0a0a');
                tg.setHeaderColor('#1a1a1a');
                
                // Hide main button for keyboard workflow
                tg.MainButton.hide();
                
                this.showToast('Aplikace připojena k Telegramu');
                
                // Handle back button
                tg.onEvent('backButtonClicked', () => {
                    if (this.isModalOpen()) {
                        this.hideAllModals();
                    } else {
                        tg.close();
                    }
                });
                
            } catch (error) {
                console.error('Chyba při inicializaci Telegram WebApp:', error);
                this.showToast('Chyba při inicializaci Telegramu');
                this.isDebugMode = true;
                this.showDebugInfo();
            }
        } else {
            this.isDebugMode = true;
            this.showToast('Debug režim - mimo Telegram');
            this.showDebugInfo();
        }
    }

    detectUsername() {
        if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
            const user = window.Telegram.WebApp.initDataUnsafe.user;
            this.username = user.username || user.first_name || 'Uživatel';
            this.updateUserGreeting();
        } else if (this.isDebugMode) {
            this.username = 'Debug User';
            this.updateUserGreeting();
        } else {
            // Fallback for keyboard button limitations
            this.username = 'Uživatel';
            this.updateUserGreeting();
        }
    }

    updateUserGreeting() {
        const greetingElement = document.getElementById('userGreeting');
        if (greetingElement && this.username) {
            greetingElement.innerHTML = `<span>Ahoj, ${this.username}!</span>`;
        }
    }

    setupEventListeners() {
        // Action buttons
        document.getElementById('insertedBtn').addEventListener('click', () => {
            this.selectAction('Vloženo');
        });

        document.getElementById('retrievedBtn').addEventListener('click', () => {
            this.selectAction('Vyzvednuto');
        });

        // Description input character counter
        const descriptionInput = document.getElementById('description');
        descriptionInput.addEventListener('input', () => {
            this.updateCharacterCounter();
        });

        // Modal buttons
        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.hideConfirmModal();
        });

        document.getElementById('confirmBtn').addEventListener('click', () => {
            this.sendData();
        });

        // Close modals on overlay click
        document.getElementById('confirmModal').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.hideConfirmModal();
            }
        });

        // Prevent form submission on Enter in textarea
        descriptionInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                if (this.selectedAction) {
                    this.selectAction(this.selectedAction);
                }
            }
        });
    }

    selectAction(action) {
        if (this.dataSent) {
            this.showToast('Data již byla odeslána v této relaci');
            return;
        }

        this.selectedAction = action;
        const description = document.getElementById('description').value.trim();
        
        // Show confirmation modal
        this.showConfirmModal(action, description);
    }

    showConfirmModal(action, description) {
        const message = this.formatMessage(action, description);
        
        document.getElementById('previewText').textContent = message;
        document.getElementById('confirmModal').classList.remove('hidden');
        
        // Show back button in Telegram
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.BackButton.show();
        }
    }

    hideConfirmModal() {
        document.getElementById('confirmModal').classList.add('hidden');
        
        // Hide back button in Telegram
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.BackButton.hide();
        }
    }

    hideAllModals() {
        document.getElementById('confirmModal').classList.add('hidden');
        document.getElementById('successModal').classList.add('hidden');
        
        // Hide back button in Telegram
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.BackButton.hide();
        }
    }

    isModalOpen() {
        return !document.getElementById('confirmModal').classList.contains('hidden') ||
               !document.getElementById('successModal').classList.contains('hidden');
    }

    formatMessage(action, description) {
        if (description) {
            return `FlashBOX: ${action} | ${description}`;
        } else {
            return `FlashBOX: ${action}`;
        }
    }

    async sendData() {
        if (this.dataSent) {
            this.showToast('Data již byla odeslána');
            return;
        }

        const description = document.getElementById('description').value.trim();
        const message = this.formatMessage(this.selectedAction, description);

        this.hideConfirmModal();
        this.showLoading();

        try {
            if (window.Telegram?.WebApp?.sendData) {
                // Use Telegram sendData method for keyboard button
                window.Telegram.WebApp.sendData(message);
                
                // Mark as sent
                this.dataSent = true;
                
                // Show success and close after delay
                setTimeout(() => {
                    this.hideLoading();
                    this.showSuccessModal();
                    
                    // Auto close after 2 seconds
                    setTimeout(() => {
                        if (window.Telegram?.WebApp) {
                            window.Telegram.WebApp.close();
                        }
                    }, 2000);
                }, 1000);
                
            } else if (this.isDebugMode) {
                // Debug mode simulation
                setTimeout(() => {
                    this.hideLoading();
                    this.showSuccessModal();
                    console.log('Debug - Data would be sent:', message);
                    this.dataSent = true;
                }, 1500);
            } else {
                throw new Error('Telegram WebApp sendData není dostupné');
            }

        } catch (error) {
            console.error('Chyba při odesílání dat:', error);
            this.hideLoading();
            this.showToast('Chyba při odesílání dat');
            
            if (this.isDebugMode) {
                this.updateDebugInfo('Error: ' + error.message);
            }
        }
    }

    showLoading() {
        document.getElementById('loadingOverlay').classList.remove('hidden');
    }

    hideLoading() {
        document.getElementById('loadingOverlay').classList.add('hidden');
    }

    showSuccessModal() {
        document.getElementById('successModal').classList.remove('hidden');
    }

    updateCharacterCounter() {
        const input = document.getElementById('description');
        const counter = document.getElementById('charCount');
        const counterContainer = document.querySelector('.character-counter');
        
        const currentLength = input.value.length;
        const maxLength = 50;
        
        counter.textContent = currentLength;
        
        // Update counter styling
        counterContainer.classList.remove('warning', 'danger');
        
        if (currentLength >= maxLength - 5) {
            counterContainer.classList.add('warning');
        }
        
        if (currentLength >= maxLength) {
            counterContainer.classList.add('danger');
        }
    }

    showToast(message, duration = 3000) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        toastMessage.textContent = message;
        toast.classList.remove('hidden');
        
        setTimeout(() => {
            toast.classList.add('hidden');
        }, duration);
    }

    showDebugInfo() {
        const debugElement = document.getElementById('debugInfo');
        debugElement.classList.remove('hidden');
        
        const info = {
            'Telegram WebApp': !!window.Telegram?.WebApp,
            'User Data': window.Telegram?.WebApp?.initDataUnsafe?.user || 'Nedostupné',
            'Platform': window.Telegram?.WebApp?.platform || 'Neznámá',
            'Version': window.Telegram?.WebApp?.version || 'Neznámá',
            'Debug Mode': this.isDebugMode,
            'Username': this.username
        };
        
        this.updateDebugInfo(JSON.stringify(info, null, 2));
    }

    updateDebugInfo(content) {
        const debugContent = document.getElementById('debugContent');
        if (debugContent) {
            debugContent.innerHTML = `<pre>${content}</pre>`;
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.flashBoxApp = new FlashBoxApp();
});

// Handle Telegram WebApp ready event
if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.onEvent('viewportChanged', () => {
        // Handle viewport changes if needed
        console.log('Viewport changed');
    });
    
    window.Telegram.WebApp.onEvent('themeChanged', () => {
        // Handle theme changes if needed
        console.log('Theme changed');
    });
}

// Export for debugging
window.FlashBoxApp = FlashBoxApp;