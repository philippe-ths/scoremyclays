// ScoreMyClays MVP - Main Application Logic
// Offline-first clay shooting scoring application

import { openDB } from 'idb';

// Application State
class ScoreMyClaysApp {
    constructor() {
        this.db = null;
        this.currentRound = null;
        this.currentStand = 1;
        this.currentTarget = 1;
        this.currentStandScore = 0;
        this.totalScore = 0;
        this.startTime = null;
        this.config = {
            stands: 8,
            targetsPerStand: 10,
            discipline: 'esp'
        };
        this.shots = [];
        this.deferredPrompt = null;
        
        this.init();
    }

    async init() {
        console.log('🎯 Initializing ScoreMyClays...');
        
        // Initialize IndexedDB
        await this.initDB();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Check online status
        this.setupOfflineHandling();
        
        // Setup PWA install prompt
        this.setupPWAInstall();
        
        // Load user stats
        await this.loadUserStats();
        
        console.log('✅ ScoreMyClays ready!');
    }

    async initDB() {
        try {
            this.db = await openDB('ScoreMyClaysDB', 1, {
                upgrade(db) {
                    // Rounds store
                    const roundsStore = db.createObjectStore('rounds', {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    roundsStore.createIndex('date', 'date');
                    roundsStore.createIndex('discipline', 'discipline');
                    
                    // Settings store
                    db.createObjectStore('settings', {
                        keyPath: 'key'
                    });
                    
                    console.log('📦 Database initialized');
                }
            });
        } catch (error) {
            console.error('❌ Database initialization failed:', error);
        }
    }

    setupEventListeners() {
        // Navigation
        document.getElementById('startRoundBtn').addEventListener('click', () => this.showScreen('setupScreen'));
        document.getElementById('backToHomeBtn').addEventListener('click', () => this.showScreen('homeScreen'));
        document.getElementById('beginRoundBtn').addEventListener('click', () => this.startRound());
        document.getElementById('homeBtn').addEventListener('click', () => this.showScreen('homeScreen'));
        document.getElementById('newRoundBtn').addEventListener('click', () => this.showScreen('setupScreen'));
        
        // Scoring
        document.getElementById('hitBtn').addEventListener('click', () => this.recordShot(true));
        document.getElementById('missBtn').addEventListener('click', () => this.recordShot(false));
        document.getElementById('undoBtn').addEventListener('click', () => this.undoLastShot());
        
        // Configuration
        document.getElementById('standsSelect').addEventListener('change', (e) => {
            this.config.stands = parseInt(e.target.value);
        });
        document.getElementById('targetsSelect').addEventListener('change', (e) => {
            this.config.targetsPerStand = parseInt(e.target.value);
        });
        
        // Share functionality
        document.getElementById('shareBtn').addEventListener('click', () => this.shareScore());
        
        // Prevent accidental navigation away during round
        window.addEventListener('beforeunload', (e) => {
            if (this.currentRound && !this.currentRound.completed) {
                e.preventDefault();
                e.returnValue = 'Are you sure you want to leave? Your current round will be lost.';
                return e.returnValue;
            }
        });
    }

    setupOfflineHandling() {
        const updateOnlineStatus = () => {
            const offlineBanner = document.getElementById('offlineBanner');
            if (navigator.onLine) {
                offlineBanner.classList.remove('show');
                console.log('🌐 Back online');
            } else {
                offlineBanner.classList.add('show');
                console.log('📶 Offline mode active');
            }
        };

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        updateOnlineStatus();
    }

    setupPWAInstall() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            document.getElementById('installPrompt').classList.add('show');
        });

        document.getElementById('installBtn').addEventListener('click', async () => {
            if (this.deferredPrompt) {
                this.deferredPrompt.prompt();
                const { outcome } = await this.deferredPrompt.userChoice;
                console.log(`PWA install: ${outcome}`);
                this.deferredPrompt = null;
                document.getElementById('installPrompt').classList.remove('show');
            }
        });
    }

    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        document.getElementById(screenId).classList.add('active');
        
        // Screen-specific actions
        if (screenId === 'homeScreen') {
            this.loadUserStats();
        }
    }

    async loadUserStats() {
        try {
            const rounds = await this.getAllRounds();
            const totalRounds = rounds.length;
            
            let totalTargets = 0;
            let totalHits = 0;
            
            rounds.forEach(round => {
                if (round.completed) {
                    totalTargets += round.totalTargets;
                    totalHits += round.totalScore;
                }
            });
            
            const avgScore = totalTargets > 0 ? Math.round((totalHits / totalTargets) * 100) : 0;
            
            document.getElementById('totalRounds').textContent = totalRounds;
            document.getElementById('avgScore').textContent = totalTargets > 0 ? `${avgScore}%` : '--%';
            
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    startRound() {
        const now = new Date();
        this.currentRound = {
            id: null,
            discipline: this.config.discipline,
            stands: this.config.stands,
            targetsPerStand: this.config.targetsPerStand,
            totalTargets: this.config.stands * this.config.targetsPerStand,
            totalScore: 0,
            standScores: new Array(this.config.stands).fill(0),
            shots: [],
            startTime: now,
            endTime: null,
            completed: false,
            date: now.toISOString().split('T')[0]
        };
        
        this.currentStand = 1;
        this.currentTarget = 1;
        this.currentStandScore = 0;
        this.totalScore = 0;
        this.shots = [];
        this.startTime = now;
        
        this.updateScoringDisplay();
        this.showScreen('scoringScreen');
        
        console.log('🎯 Round started:', this.currentRound);
    }

    recordShot(isHit) {
        if (!this.currentRound || this.currentRound.completed) return;
        
        const shot = {
            stand: this.currentStand,
            target: this.currentTarget,
            hit: isHit,
            timestamp: new Date()
        };
        
        this.shots.push(shot);
        this.currentRound.shots.push(shot);
        
        if (isHit) {
            this.currentStandScore++;
            this.totalScore++;
            this.currentRound.totalScore++;
        }
        
        // Visual feedback
        const button = isHit ? document.getElementById('hitBtn') : document.getElementById('missBtn');
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);
        
        // Add haptic feedback if available
        if (navigator.vibrate) {
            navigator.vibrate(isHit ? 50 : 100);
        }
        
        this.currentTarget++;
        
        // Check if stand is complete
        if (this.currentTarget > this.config.targetsPerStand) {
            this.completeStand();
        } else {
            this.updateScoringDisplay();
            this.updateUndoButton();
        }
        
        console.log(`Shot recorded: ${isHit ? 'HIT' : 'MISS'} - Stand ${this.currentStand}, Target ${this.currentTarget - 1}`);
    }

    completeStand() {
        this.currentRound.standScores[this.currentStand - 1] = this.currentStandScore;
        
        // Show stand completion feedback
        this.showStandComplete();
        
        setTimeout(() => {
            if (this.currentStand >= this.config.stands) {
                this.completeRound();
            } else {
                this.nextStand();
            }
        }, 1500);
    }

    showStandComplete() {
        const percentage = Math.round((this.currentStandScore / this.config.targetsPerStand) * 100);
        const targetDisplay = document.querySelector('.target-display');
        
        targetDisplay.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 24px; font-weight: 700; color: #228B22; margin-bottom: 8px;">
                    Stand ${this.currentStand} Complete!
                </div>
                <div style="font-family: 'Roboto Mono', monospace; font-size: 32px; font-weight: 700; color: #D2691E; margin: 16px 0;">
                    ${this.currentStandScore}/${this.config.targetsPerStand}
                </div>
                <div style="font-size: 16px; color: #6C757D;">
                    ${percentage}% • ${percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good work!' : 'Keep practicing!'}
                </div>
            </div>
        `;
    }

    nextStand() {
        this.currentStand++;
        this.currentTarget = 1;
        this.currentStandScore = 0;
        
        this.updateScoringDisplay();
        this.updateUndoButton();
        
        // Reset target display
        const targetDisplay = document.querySelector('.target-display');
        targetDisplay.innerHTML = `
            <div class="target-counter" id="targetCounter">Target 1 of ${this.config.targetsPerStand}</div>
            <div class="target-instruction">Report Pair</div>
            <div class="clay-target"></div>
        `;
    }

    async completeRound() {
        this.currentRound.endTime = new Date();
        this.currentRound.completed = true;
        
        // Calculate duration
        const duration = Math.floor((this.currentRound.endTime - this.currentRound.startTime) / 1000);
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        this.currentRound.duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Save to database
        try {
            await this.saveRound(this.currentRound);
            console.log('💾 Round saved successfully');
        } catch (error) {
            console.error('❌ Failed to save round:', error);
        }
        
        this.updateCompletionScreen();
        this.showScreen('completeScreen');
    }

    updateScoringDisplay() {
        document.getElementById('standTitle').textContent = `Stand ${this.currentStand} of ${this.config.stands}`;
        document.getElementById('targetCounter').textContent = `Target ${this.currentTarget} of ${this.config.targetsPerStand}`;
        document.getElementById('currentScore').textContent = `${this.currentStandScore}/${this.currentTarget - 1}`;
        
        const standPercentage = this.currentTarget > 1 ? Math.round((this.currentStandScore / (this.currentTarget - 1)) * 100) : 0;
        const totalPercentage = this.totalScore > 0 ? Math.round((this.totalScore / ((this.currentStand - 1) * this.config.targetsPerStand + this.currentTarget - 1)) * 100) : 0;
        
        document.getElementById('totalScore').textContent = `Total: ${this.totalScore}/${(this.currentStand - 1) * this.config.targetsPerStand + this.currentTarget - 1} • ${totalPercentage}% Average`;
    }

    updateCompletionScreen() {
        const percentage = Math.round((this.totalScore / this.currentRound.totalTargets) * 100);
        const bestStand = Math.max(...this.currentRound.standScores);
        
        document.getElementById('finalScore').textContent = `${this.totalScore}/${this.currentRound.totalTargets}`;
        document.getElementById('finalPercentage').textContent = `${percentage}% • ${this.getPerformanceMessage(percentage)}`;
        document.getElementById('perfStands').textContent = this.config.stands;
        document.getElementById('perfDuration').textContent = this.currentRound.duration;
        document.getElementById('perfBest').textContent = bestStand;
        document.getElementById('perfAvg').textContent = `${percentage}%`;
    }

    getPerformanceMessage(percentage) {
        if (percentage >= 90) return 'Outstanding!';
        if (percentage >= 80) return 'Excellent!';
        if (percentage >= 70) return 'Good work!';
        if (percentage >= 60) return 'Nice shooting!';
        return 'Keep practicing!';
    }

    updateUndoButton() {
        const undoBtn = document.getElementById('undoBtn');
        undoBtn.disabled = this.shots.length === 0;
    }

    undoLastShot() {
        if (this.shots.length === 0) return;
        
        const lastShot = this.shots.pop();
        this.currentRound.shots.pop();
        
        if (lastShot.hit) {
            this.currentStandScore--;
            this.totalScore--;
            this.currentRound.totalScore--;
        }
        
        this.currentTarget--;
        
        this.updateScoringDisplay();
        this.updateUndoButton();
        
        console.log('↶ Undid last shot');
    }

    async shareScore() {
        if (!this.currentRound) return;
        
        const shareData = {
            title: 'ScoreMyClays Score',
            text: `Just shot ${this.totalScore}/${this.currentRound.totalTargets} (${Math.round((this.totalScore / this.currentRound.totalTargets) * 100)}%) in ESP! 🎯`,
            url: window.location.href
        };
        
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback to copying to clipboard
                await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
                this.showToast('Score copied to clipboard!');
            }
        } catch (error) {
            console.error('Share failed:', error);
            this.showToast('Share failed');
        }
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #2C3E50;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 1000;
            font-size: 14px;
            font-weight: 500;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 3000);
    }

    // Database operations
    async saveRound(round) {
        if (!this.db) throw new Error('Database not initialized');
        
        const tx = this.db.transaction('rounds', 'readwrite');
        const store = tx.objectStore('rounds');
        const result = await store.add(round);
        await tx.done;
        
        return result;
    }

    async getAllRounds() {
        if (!this.db) return [];
        
        const tx = this.db.transaction('rounds', 'readonly');
        const store = tx.objectStore('rounds');
        const rounds = await store.getAll();
        await tx.done;
        
        return rounds.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    }

    async getRound(id) {
        if (!this.db) return null;
        
        const tx = this.db.transaction('rounds', 'readonly');
        const store = tx.objectStore('rounds');
        const round = await store.get(id);
        await tx.done;
        
        return round;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.scoreMyClaysApp = new ScoreMyClaysApp();
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('✅ Service Worker registered:', registration);
        } catch (error) {
            console.error('❌ Service Worker registration failed:', error);
        }
    });
}

export default ScoreMyClaysApp; 