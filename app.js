class FlashBOXApp {
    constructor() {
        this.telegram = null;
        this.username = null;
        this.selectedAction = null;
        this.isDebugMode = !window.Telegram?.WebApp;
        this.isLoading = false;
        this.sendingMethod = null;
        this.lastError = null;
        this.retryCount = 0;
        this.maxRetries = 3;
        
        // Enhanced animation timings
        this.animationTimings = {
            entranceDelay: 0.1,
            transitionDuration: 0.4,
            springTension: 0.6,
            elasticDuration: 0.8
        };
        
        console.log('🚀 Initializing FlashBOX v4.0 - Fixed Edition...');
        
        // Force hide loading overlay after max time
        this.setupLoadingFailsafe();
        
        this.init();
    }

    setupLoadingFailsafe() {
        // Emergency loading overlay hide after 3 seconds
        setTimeout(() => {
            const overlay = document.getElementById('loading-overlay');
            if (overlay && !overlay.classList.contains('hidden')) {
                console.log('⚠️ Emergency: Force hiding loading overlay');
                this.forceHideLoadingOverlay();
            }
        }, 3000);
    }

    forceHideLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.transition = 'opacity 0.5s ease';
            overlay.style.opacity = '0';
            overlay.style.visibility = 'hidden';
            overlay.style.pointerEvents = 'none';
            
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 500);
        }
    }

    async init() {
        try {
            console.log('📱 Starting initialization process...');
            
            // Initialize Telegram WebApp with enhanced detection
            await this.initTelegramWebApp();
            
            // Setup all event listeners
            this.setupEventListeners();
            
            // Initialize UI animations and effects
            this.initializeAnimations();
            
            // Setup debug mode if needed
            this.setupDebugMode();
            
            // Enhanced user feedback
            this.initializeUserFeedback();
            
            console.log('✅ FlashBOX v4.0 initialized successfully');
            
            // Hide loading overlay with proper timing
            setTimeout(() => {
                this.hideLoadingOverlay();
            }, 800);
            
        } catch (error) {
            console.error('❌ Critical error during initialization:', error);
            this.lastError = error.message;
            
            // Always hide loading overlay, even on error
            this.hideLoadingOverlay();
            this.showToast('Aplikace načtena v základním režimu', 'warning');
        }
    }

    async initTelegramWebApp() {
        if (this.isDebugMode) {
            console.log('🔧 Debug mode: Running without Telegram WebApp');
            this.username = 'testuser';
            this.updateUsernameDisplay();
            this.showDebugPanel();
            return;
        }

        try {
            const tg = window.Telegram.WebApp;
            this.telegram = tg;
            
            // Enhanced Telegram WebApp initialization
            tg.ready();
            tg.expand();
            tg.setBackgroundColor('#000000');
            tg.setHeaderColor('#000000');
            
            // Enhanced theme detection
            if (tg.colorScheme === 'dark') {
                document.documentElement.setAttribute('data-color-scheme', 'dark');
            }
            
            // Enhanced user data extraction
            if (tg.initDataUnsafe?.user?.username) {
                this.username = tg.initDataUnsafe.user.username;
            } else if (tg.initDataUnsafe?.user?.first_name) {
                this.username = tg.initDataUnsafe.user.first_name;
            } else if (tg.initDataUnsafe?.user?.last_name) {
                this.username = `${tg.initDataUnsafe.user.first_name || ''} ${tg.initDataUnsafe.user.last_name}`.trim();
            } else {
                this.username = 'user';
            }
            
            // Enable haptic feedback if available
            if (tg.HapticFeedback) {
                console.log('✅ Haptic feedback enabled');
            }
            
            console.log('✅ Telegram WebApp initialized successfully');
            console.log('👤 Username:', this.username);
            console.log('🎨 Theme:', tg.colorScheme);
            
        } catch (error) {
            console.error('❌ Error initializing Telegram WebApp:', error);
            this.username = 'user';
            this.lastError = 'Telegram WebApp initialization failed';
        }
        
        this.updateUsernameDisplay();
        this.updateDebugPanel();
    }

    updateUsernameDisplay() {
        const usernameElement = document.getElementById('username-display');
        if (usernameElement) {
            usernameElement.textContent = `@${this.username}`;
            
            // Enhanced visual feedback
            if (this.username && this.username !== 'user') {
                usernameElement.style.color = 'var(--neon-blue)';
                usernameElement.style.textShadow = '0 0 10px var(--neon-blue)';
            } else {
                usernameElement.style.color = 'var(--neon-red)';
                usernameElement.style.textShadow = '0 0 10px var(--neon-red)';
            }
        }
    }

    setupEventListeners() {
        // Enhanced character counter with live feedback
        this.setupCharacterCounter();
        
        // Advanced state buttons with ripple effects
        this.setupStateButtons();
        
        // Modal system with enhanced interactions
        this.setupModalButtons();
        
        // Keyboard shortcuts and accessibility
        this.setupKeyboardShortcuts();
        
        // Window events for better UX
        this.setupWindowEvents();
    }

    setupCharacterCounter() {
        const descriptionInput = document.getElementById('description-input');
        const charCount = document.getElementById('char-count');
        const characterCounter = document.querySelector('.character-counter');

        if (descriptionInput && charCount && characterCounter) {
            descriptionInput.addEventListener('input', (e) => {
                const length = e.target.value.length;
                const maxLength = 100;
                const warningThreshold = 80;
                const errorThreshold = 95;
                
                charCount.textContent = length;
                
                // Remove previous states
                characterCounter.classList.remove('warning', 'error');
                
                // Add progressive warning states
                if (length >= errorThreshold) {
                    characterCounter.classList.add('error');
                } else if (length >= warningThreshold) {
                    characterCounter.classList.add('warning');
                }
                
                // Enhanced typing animation with physics
                this.addTypingEffect(e.target);
                
                // Live validation feedback
                this.validateInput(e.target.value);
            });

            // Enhanced focus effects
            descriptionInput.addEventListener('focus', () => {
                this.triggerHapticFeedback('light');
                this.addInputFocusEffect(descriptionInput);
            });

            descriptionInput.addEventListener('blur', () => {
                this.removeInputFocusEffect(descriptionInput);
            });
        }
    }

    addTypingEffect(element) {
        // Enhanced typing animation with spring physics
        element.style.transform = 'scale(1.008) translateY(-1px)';
        element.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.3)';
        
        setTimeout(() => {
            element.style.transform = '';
            element.style.boxShadow = '';
        }, 150);
    }

    addInputFocusEffect(element) {
        const focusRing = element.parentNode.querySelector('.input-focus-ring');
        if (focusRing) {
            focusRing.style.opacity = '0.6';
        }
    }

    removeInputFocusEffect(element) {
        const focusRing = element.parentNode.querySelector('.input-focus-ring');
        if (focusRing) {
            focusRing.style.opacity = '0';
        }
    }

    validateInput(value) {
        // Real-time input validation
        const isValid = value.length <= 100;
        const isEmpty = value.trim().length === 0;
        
        // Update input styling based on validation
        const input = document.getElementById('description-input');
        if (input) {
            if (!isValid) {
                input.style.borderColor = 'var(--neon-red)';
            } else if (!isEmpty) {
                input.style.borderColor = 'var(--neon-green)';
            } else {
                input.style.borderColor = 'var(--glass-border)';
            }
        }
        
        return isValid;
    }

    setupStateButtons() {
        document.querySelectorAll('.state-button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleStateButtonClick(e, button);
            });

            // Enhanced hover effects with particle animation
            button.addEventListener('mouseenter', () => {
                this.triggerHapticFeedback('light');
                this.animateButtonParticles(button);
            });

            button.addEventListener('mouseleave', () => {
                this.stopButtonParticles(button);
            });

            // Touch support for mobile
            button.addEventListener('touchstart', (e) => {
                this.handleTouchStart(e, button);
            });
        });
    }

    animateButtonParticles(button) {
        const particles = button.querySelectorAll('.btn-particle');
        particles.forEach((particle, index) => {
            setTimeout(() => {
                particle.style.opacity = '1';
                particle.style.animation = `btnParticle 2s ease-in-out infinite`;
            }, index * 200);
        });
    }

    stopButtonParticles(button) {
        const particles = button.querySelectorAll('.btn-particle');
        particles.forEach(particle => {
            particle.style.opacity = '0';
            particle.style.animation = 'none';
        });
    }

    setupModalButtons() {
        // Cancel button with enhanced feedback
        const cancelBtn = document.getElementById('cancel-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.hideModal('confirmation-modal');
                this.triggerHapticFeedback('light');
                this.showToast('Akce zrušena', 'info');
            });
        }

        // Confirm button with loading states
        const confirmBtn = document.getElementById('confirm-btn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                this.sendMessage();
            });
        }

        // Enhanced modal backdrop interactions
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) {
                    this.hideModal(backdrop.id);
                    this.triggerHapticFeedback('light');
                }
            });
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Enhanced keyboard navigation
            if (e.key === 'Escape') {
                this.hideModal('confirmation-modal');
                this.hideModal('success-modal');
                this.triggerHapticFeedback('light');
            }
            
            if (e.key === 'Enter' && e.ctrlKey) {
                const activeModal = document.querySelector('.modal-backdrop.show');
                if (activeModal && activeModal.id === 'confirmation-modal') {
                    this.sendMessage();
                }
            }

            // Quick actions with number keys
            if (e.key === '1' && !e.target.matches('input')) {
                this.selectAction('Vloženo');
            }
            
            if (e.key === '2' && !e.target.matches('input')) {
                this.selectAction('Vyzvednuto');
            }
        });
    }

    selectAction(action) {
        const button = document.querySelector(`[data-action="${action}"]`);
        if (button) {
            // Create synthetic click event
            const event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: button.offsetLeft + button.offsetWidth / 2,
                clientY: button.offsetTop + button.offsetHeight / 2
            });
            button.dispatchEvent(event);
        }
    }

    setupWindowEvents() {
        // Handle window resize for responsive design
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Handle visibility change for better performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });

        // Handle online/offline status
        window.addEventListener('online', () => {
            this.updateConnectionStatus(true);
        });

        window.addEventListener('offline', () => {
            this.updateConnectionStatus(false);
        });
    }

    handleResize() {
        // Responsive adjustments
        const width = window.innerWidth;
        if (width < 480) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
        }
    }

    pauseAnimations() {
        document.body.style.animationPlayState = 'paused';
    }

    resumeAnimations() {
        document.body.style.animationPlayState = 'running';
    }

    updateConnectionStatus(isOnline) {
        const statusIndicator = document.querySelector('.status-indicator');
        const statusText = document.querySelector('.status-text');
        
        if (statusIndicator && statusText) {
            if (isOnline) {
                statusIndicator.style.background = 'var(--neon-green)';
                statusText.textContent = 'Online';
                statusText.style.color = 'var(--neon-green)';
            } else {
                statusIndicator.style.background = 'var(--neon-red)';
                statusText.textContent = 'Offline';
                statusText.style.color = 'var(--neon-red)';
            }
        }
    }

    initializeAnimations() {
        // Enhanced staggered entrance animations
        this.addStaggeredAnimations();
        
        // Initialize particle system
        this.initParticleAnimations();
        
        // Setup dynamic interaction animations
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
                const delay = 0.2 + (index * this.animationTimings.entranceDelay);
                element.style.animationDelay = `${delay}s`;
            }
        });
    }

    initParticleAnimations() {
        const particles = document.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            // Enhanced particle properties with physics
            const randomDelay = Math.random() * 15;
            const randomSize = 2 + Math.random() * 4;
            const randomOpacity = 0.3 + Math.random() * 0.4;
            const randomSpeed = 0.8 + Math.random() * 0.4;
            
            particle.style.animationDelay = `${randomDelay}s`;
            particle.style.width = particle.style.height = `${randomSize}px`;
            particle.style.opacity = randomOpacity;
            particle.style.animationDuration = `${15 / randomSpeed}s`;
        });
    }

    enhanceButtonAnimations() {
        document.querySelectorAll('.state-button').forEach(button => {
            button.addEventListener('mouseenter', () => {
                if (!button.classList.contains('active')) {
                    button.style.transform = 'translateY(-8px) rotateX(5deg) scale(1.02)';
                    button.style.boxShadow = '0 30px 60px rgba(0, 0, 0, 0.3)';
                }
            });
            
            button.addEventListener('mouseleave', () => {
                if (!button.classList.contains('active')) {
                    button.style.transform = '';
                    button.style.boxShadow = '';
                }
            });
        });
    }

    setupDebugMode() {
        if (this.isDebugMode) {
            this.showDebugPanel();
            console.log('🔧 Debug mode activated');
            
            // Add debug shortcuts
            window.FlashBOXDebug = {
                app: this,
                simulate: {
                    inserted: () => this.selectAction('Vloženo'),
                    removed: () => this.selectAction('Vyzvednuto'),
                    sendMessage: () => this.sendMessage(),
                    showSuccess: () => this.showSuccessModal('debug', new Date().toLocaleTimeString()),
                    testToast: (message, type) => this.showToast(message, type || 'info')
                },
                getState: () => ({
                    username: this.username,
                    selectedAction: this.selectedAction,
                    isLoading: this.isLoading,
                    lastError: this.lastError,
                    sendingMethod: this.sendingMethod
                })
            };
        }
    }

    showDebugPanel() {
        const debugPanel = document.getElementById('debug-panel');
        if (debugPanel) {
            debugPanel.classList.remove('hidden');
            this.updateDebugPanel();
        }
    }

    updateDebugPanel() {
        const lastMethodElement = document.getElementById('debug-last-method');
        const apiStatusElement = document.getElementById('debug-api-status');
        
        if (lastMethodElement) {
            lastMethodElement.textContent = this.sendingMethod || 'Žádný';
        }
        
        if (apiStatusElement) {
            const status = this.isDebugMode ? 'Debug Mode' : 
                          this.telegram ? 'Telegram Ready' : 'Not Available';
            apiStatusElement.textContent = status;
        }
    }

    initializeUserFeedback() {
        // Enhanced haptic feedback patterns
        this.hapticPatterns = {
            light: 'light',
            medium: 'medium',
            heavy: 'heavy',
            success: 'medium',
            error: 'heavy',
            selection: 'light'
        };
        
        // Initialize sound effects (silent, using haptic instead)
        this.soundEnabled = false;
    }

    handleStateButtonClick(event, button) {
        const action = button.getAttribute('data-action');
        this.selectedAction = action;
        
        console.log(`🎯 State selected: ${action}`);
        
        // Create enhanced ripple effect
        this.createAdvancedRippleEffect(event, button);
        
        // Enhanced haptic feedback
        this.triggerHapticFeedback('selection');
        
        // Add advanced selection state
        this.updateButtonSelectionState(button);
        
        // Show confirmation modal with enhanced timing
        setTimeout(() => {
            this.showConfirmationModal();
        }, 300);
        
        // Update debug panel
        this.updateDebugPanel();
    }

    createAdvancedRippleEffect(event, button) {
        const ripple = button.querySelector('.ripple-effect');
        if (!ripple) return;
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.5;
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        // Enhanced ripple with physics
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.background = 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.3) 50%, transparent 100%)';
        ripple.style.animation = 'none';
        
        // Trigger reflow
        ripple.offsetHeight;
        
        ripple.style.animation = 'ripple 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    updateButtonSelectionState(selectedButton) {
        // Remove active state from all buttons
        document.querySelectorAll('.state-button').forEach(btn => {
            btn.classList.remove('active');
            btn.style.transform = '';
        });
        
        // Add active state to selected button
        selectedButton.classList.add('active');
        selectedButton.style.transform = 'translateY(-8px) scale(1.05)';
        selectedButton.style.boxShadow = '0 0 40px rgba(0, 212, 255, 0.4)';
    }

    triggerHapticFeedback(intensity = 'light') {
        if (!this.isDebugMode && this.telegram?.HapticFeedback) {
            try {
                const hapticType = this.hapticPatterns[intensity] || intensity;
                this.telegram.HapticFeedback.impactOccurred(hapticType);
                console.log(`🎮 Haptic feedback: ${hapticType}`);
            } catch (error) {
                console.log('⚠️ Haptic feedback not available:', error.message);
            }
        } else if (this.isDebugMode) {
            console.log(`🎮 Debug haptic: ${intensity}`);
        }
    }

    showConfirmationModal() {
        const messagePreview = document.getElementById('message-preview');
        
        if (messagePreview) {
            const message = this.generateMessage();
            messagePreview.textContent = message;
        }
        
        this.showModal('confirmation-modal');
        this.triggerHapticFeedback('light');
    }

    generateMessage() {
        const descriptionInput = document.getElementById('description-input');
        const description = descriptionInput ? descriptionInput.value.trim() : '';
        
        // New simplified format for n8n compatibility
        if (description) {
            return `FlashBOX: ${this.selectedAction} | ${description}`;
        } else {
            return `FlashBOX: ${this.selectedAction} | -`;
        }
    }

    async sendMessage() {
        if (this.isLoading) {
            console.log('⚠️ Already sending message, please wait...');
            return;
        }
        
        this.isLoading = true;
        this.hideModal('confirmation-modal');
        
        // Show enhanced loading state
        this.showLoadingButton();
        this.showToast('Připravuji odeslání...', 'info');
        
        const message = this.generateMessage();
        console.log('📤 Attempting to send message:', message);
        
        // Reset retry count
        this.retryCount = 0;
        
        try {
            const success = await this.attemptMultipleSendingMethods(message);
            
            if (success) {
                console.log('✅ Message sent successfully');
                this.showToast('Zpráva úspěšně odeslána!', 'success');
                this.showSuccessModal(this.sendingMethod, new Date().toLocaleTimeString());
                
                // Enhanced success tracking
                this.trackEvent('message_sent', {
                    action: this.selectedAction,
                    has_description: document.getElementById('description-input')?.value.trim().length > 0,
                    method: this.sendingMethod,
                    mode: this.isDebugMode ? 'debug' : 'production',
                    retry_count: this.retryCount
                });
                
            } else {
                throw new Error('All sending methods failed');
            }
            
        } catch (error) {
            console.error('❌ Critical error sending message:', error);
            this.lastError = error.message;
            this.showToast('Kritická chyba při odesílání zprávy', 'error');
            this.updateDebugPanel();
        } finally {
            this.isLoading = false;
            this.hideLoadingButton();
        }
    }

    async attemptMultipleSendingMethods(message) {
        const methods = [
            { name: 'switchInlineQuery', method: () => this.trySwitchInlineQuery(message) },
            { name: 'sendData', method: () => this.trySendData(message) },
            { name: 'postEvent', method: () => this.tryPostEvent(message) },
            { name: 'debug', method: () => this.tryDebugMode(message) }
        ];
        
        for (const { name, method } of methods) {
            try {
                console.log(`🔄 Trying method: ${name}`);
                this.updateDebugMethodDisplay(name);
                
                const result = await method();
                if (result) {
                    console.log(`✅ Success with method: ${name}`);
                    this.sendingMethod = name;
                    this.updateDebugPanel();
                    return true;
                }
                
                console.log(`❌ Failed with method: ${name}`);
                await this.delay(500); // Wait between attempts
                
            } catch (error) {
                console.error(`❌ Error with method ${name}:`, error);
                this.lastError = `${name}: ${error.message}`;
            }
        }
        
        return false;
    }

    async trySwitchInlineQuery(message) {
        if (this.isDebugMode || !this.telegram?.switchInlineQuery) {
            throw new Error('switchInlineQuery not available');
        }
        
        try {
            console.log('🚀 Using Telegram switchInlineQuery');
            this.telegram.switchInlineQuery(message, ['groups', 'supergroups']);
            return true;
        } catch (error) {
            throw new Error(`switchInlineQuery failed: ${error.message}`);
        }
    }

    async trySendData(message) {
        if (this.isDebugMode || !this.telegram?.sendData) {
            throw new Error('sendData not available');
        }
        
        try {
            console.log('🚀 Using Telegram sendData');
            this.telegram.sendData(JSON.stringify({
                type: 'flashbox_message',
                message: message,
                timestamp: new Date().toISOString(),
                username: this.username
            }));
            return true;
        } catch (error) {
            throw new Error(`sendData failed: ${error.message}`);
        }
    }

    async tryPostEvent(message) {
        if (this.isDebugMode || !this.telegram?.postEvent) {
            throw new Error('postEvent not available');
        }
        
        try {
            console.log('🚀 Using Telegram postEvent');
            this.telegram.postEvent('web_app_data_sent', {
                data: JSON.stringify({
                    type: 'flashbox_message',
                    message: message,
                    timestamp: new Date().toISOString(),
                    username: this.username
                })
            });
            return true;
        } catch (error) {
            throw new Error(`postEvent failed: ${error.message}`);
        }
    }

    async tryDebugMode(message) {
        if (!this.isDebugMode) {
            throw new Error('Not in debug mode');
        }
        
        console.log('🔧 Debug mode: Simulating message send');
        console.log('📝 Message:', message);
        console.log('👤 Username:', this.username);
        console.log('⏰ Timestamp:', new Date().toISOString());
        
        // Simulate network delay
        await this.delay(1000 + Math.random() * 1000);
        
        // Simulate occasional failures for testing
        if (Math.random() < 0.1) {
            throw new Error('Simulated network error (debug)');
        }
        
        return true;
    }

    updateDebugMethodDisplay(method) {
        this.showToast(`Zkouším: ${method}`, 'info');
        
        const lastMethodElement = document.getElementById('debug-last-method');
        if (lastMethodElement) {
            lastMethodElement.textContent = method;
        }
    }

    showLoadingButton() {
        const confirmBtn = document.getElementById('confirm-btn');
        const btnText = confirmBtn?.querySelector('.btn-text');
        const btnLoading = confirmBtn?.querySelector('.btn-loading');
        
        if (confirmBtn && btnText && btnLoading) {
            btnText.style.opacity = '0';
            btnLoading.style.opacity = '1';
            confirmBtn.disabled = true;
            confirmBtn.style.cursor = 'not-allowed';
        }
    }

    hideLoadingButton() {
        const confirmBtn = document.getElementById('confirm-btn');
        const btnText = confirmBtn?.querySelector('.btn-text');
        const btnLoading = confirmBtn?.querySelector('.btn-loading');
        
        if (confirmBtn && btnText && btnLoading) {
            btnText.style.opacity = '1';
            btnLoading.style.opacity = '0';
            confirmBtn.disabled = false;
            confirmBtn.style.cursor = 'pointer';
        }
    }

    showSuccessModal(method, time) {
        // Update success details
        const successMethod = document.getElementById('success-method');
        const successTime = document.getElementById('success-time');
        
        if (successMethod) {
            successMethod.textContent = method || 'Unknown';
        }
        
        if (successTime) {
            successTime.textContent = time || new Date().toLocaleTimeString();
        }
        
        this.showModal('success-modal');
        
        // Enhanced success effects
        this.triggerSuccessEffects();
        
        // Enhanced haptic feedback for success
        this.triggerHapticFeedback('success');
        
        // Start enhanced countdown
        this.startCountdown();
    }

    triggerSuccessEffects() {
        // Animate burst particles
        const burstParticles = document.querySelectorAll('.burst-particle');
        burstParticles.forEach((particle, index) => {
            const angle = (index / burstParticles.length) * 2 * Math.PI;
            const distance = 80 + Math.random() * 40;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            particle.style.setProperty('--random-x', `${x}px`);
            particle.style.setProperty('--random-y', `${y}px`);
        });
        
        // Animate confetti with enhanced physics
        const confettiElements = document.querySelectorAll('.confetti');
        confettiElements.forEach((confetti, index) => {
            const delay = index * 100;
            const randomX = (Math.random() - 0.5) * 200;
            const randomRotation = Math.random() * 720;
            
            setTimeout(() => {
                confetti.style.transform = `translateY(-300px) translateX(${randomX}px) rotateZ(${randomRotation}deg)`;
                confetti.style.opacity = '0';
            }, delay);
        });
    }

    startCountdown() {
        let countdown = 3;
        const countdownElement = document.getElementById('countdown');
        const progressElement = document.querySelector('.countdown-progress');
        
        const updateCountdown = () => {
            if (countdownElement) {
                countdownElement.textContent = countdown;
            }
            
            if (progressElement) {
                const progress = ((3 - countdown) / 3) * 360;
                progressElement.style.background = `conic-gradient(var(--neon-green) ${progress}deg, transparent ${progress}deg)`;
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

    closeApp() {
        if (!this.isDebugMode && this.telegram) {
            try {
                console.log('🚪 Closing Telegram WebApp');
                this.telegram.close();
            } catch (error) {
                console.log('⚠️ Cannot close app:', error);
                this.showToast('Aplikaci nelze automaticky zavřít', 'warning');
            }
        } else {
            // Debug mode - show message and reset
            this.showToast('Aplikace by se nyní zavřela (DEBUG)', 'info');
            this.hideModal('success-modal');
            this.resetApp();
        }
    }

    resetApp() {
        // Enhanced app reset
        const descriptionInput = document.getElementById('description-input');
        if (descriptionInput) {
            descriptionInput.value = '';
            descriptionInput.style.borderColor = 'var(--glass-border)';
        }
        
        // Reset character counter
        const charCount = document.getElementById('char-count');
        if (charCount) {
            charCount.textContent = '0';
        }
        
        // Reset character counter state
        const characterCounter = document.querySelector('.character-counter');
        if (characterCounter) {
            characterCounter.classList.remove('warning', 'error');
        }
        
        // Remove active states from buttons
        document.querySelectorAll('.state-button').forEach(btn => {
            btn.classList.remove('active');
            btn.style.transform = '';
            btn.style.boxShadow = '';
        });
        
        // Reset state
        this.selectedAction = null;
        this.sendingMethod = null;
        this.lastError = null;
        this.retryCount = 0;
        
        // Update debug panel
        this.updateDebugPanel();
        
        console.log('🔄 App reset completed');
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Enhanced focus management
            const focusableElements = modal.querySelectorAll('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if (focusableElements.length > 0) {
                setTimeout(() => {
                    focusableElements[0].focus();
                }, 200);
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
        
        // Enhanced toast with icon
        const icon = this.getToastIcon(type);
        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-message">${message}</div>
        `;
        
        container.appendChild(toast);
        
        // Enhanced entrance animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        // Auto remove with enhanced timing
        const duration = type === 'error' ? 5000 : 3000;
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (container.contains(toast)) {
                    container.removeChild(toast);
                }
            }, 400);
        }, duration);
        
        // Add click to dismiss
        toast.addEventListener('click', () => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (container.contains(toast)) {
                    container.removeChild(toast);
                }
            }, 400);
        });
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
            
            // Enhanced hiding animation with proper cleanup
            setTimeout(() => {
                overlay.style.display = 'none';
                console.log('✅ Loading overlay hidden successfully');
            }, 600);
        }
    }

    handleTouchStart(event, button) {
        // Enhanced touch feedback
        event.preventDefault();
        
        button.style.transform = 'translateY(-4px) scale(0.98)';
        this.triggerHapticFeedback('light');
        
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    trackEvent(eventName, data = {}) {
        // Enhanced analytics tracking
        const eventData = {
            ...data,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            app_version: '4.0'
        };
        
        console.log(`📊 Event: ${eventName}`, eventData);
        
        // In production, send to analytics service
        if (!this.isDebugMode && window.gtag) {
            window.gtag('event', eventName, eventData);
        }
    }
}

// Global helper functions for modal management
window.hideModal = function(modalId) {
    if (window.flashBoxApp) {
        window.flashBoxApp.hideModal(modalId);
    }
};

// Enhanced initialization with better error handling
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 DOM loaded, starting FlashBOX v4.0 - Fixed Edition...');
    
    try {
        // Initialize main app
        window.flashBoxApp = new FlashBOXApp();
        
        console.log('🚀 FlashBOX v4.0 initialization complete');
    } catch (error) {
        console.error('❌ Critical error initializing FlashBOX App:', error);
        
        // Enhanced fallback handling
        const forceHideOverlay = () => {
            const overlay = document.getElementById('loading-overlay');
            if (overlay) {
                overlay.style.display = 'none';
                console.log('🛡️ Fallback: Loading overlay hidden due to error');
            }
        };
        
        setTimeout(forceHideOverlay, 1000);
        
        // Show error message to user
        setTimeout(() => {
            const container = document.getElementById('toast-container') || document.body;
            const errorToast = document.createElement('div');
            errorToast.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(255, 107, 107, 0.9);
                color: white;
                padding: 16px 24px;
                border-radius: 12px;
                z-index: 10000;
                font-size: 14px;
                font-weight: 500;
            `;
            errorToast.textContent = 'Aplikace načtena v základním režimu';
            container.appendChild(errorToast);
            
            setTimeout(() => {
                if (errorToast.parentNode) {
                    errorToast.parentNode.removeChild(errorToast);
                }
            }, 5000);
        }, 1500);
    }
});

// Multiple failsafe mechanisms for loading overlay
setTimeout(() => {
    const overlay = document.getElementById('loading-overlay');
    if (overlay && !overlay.classList.contains('hidden')) {
        console.log('⚠️ Timeout: Force hiding loading overlay');
        overlay.style.transition = 'opacity 0.3s ease';
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    }
}, 2000);

// Emergency fallback
setTimeout(() => {
    const overlay = document.getElementById('loading-overlay');
    if (overlay && overlay.style.display !== 'none') {
        console.log('🆘 Emergency: Force hide loading overlay');
        overlay.remove();
    }
}, 4000);

// Global error handlers
window.addEventListener('error', (event) => {
    console.error('🚨 Global error:', event.error);
    
    // Force hide loading overlay on any error
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
    
    if (window.flashBoxApp) {
        window.flashBoxApp.showToast('Nastala neočekávaná chyba', 'error');
    }
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Unhandled promise rejection:', event.reason);
    event.preventDefault();
    
    if (window.flashBoxApp) {
        window.flashBoxApp.showToast('Chyba při zpracování požadavku', 'error');
    }
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('⚡ Performance metrics:', {
                loadTime: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
                domReady: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
                totalTime: Math.round(perfData.loadEventEnd - perfData.fetchStart)
            });
        }, 0);
    });
}