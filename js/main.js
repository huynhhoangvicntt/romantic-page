// Global variables
let currentScreen = 1;
const totalScreens = 7;
let musicPlaying = false;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Website loaded!');
    initializeAudio();
});

// Audio functions
function initializeAudio() {
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');

    if (!bgMusic || !musicToggle) {
        console.error('❌ Audio elements not found');
        return;
    }

    bgMusic.volume = 0.3;

    // Try auto-play
    const playPromise = bgMusic.play();

    if (playPromise !== undefined) {
        playPromise.then(() => {
            musicPlaying = true;
            musicToggle.textContent = '🔊';
            musicToggle.classList.remove('muted');
            console.log('🎵 Music started');
        }).catch(error => {
            musicPlaying = false;
            musicToggle.textContent = '🔇';
            musicToggle.classList.add('muted');
            console.log('🔇 Auto-play blocked');
            showMusicNotification();
        });
    }
}

// Special effects functions
function createFireworks() {
    const fireworksContainer = document.getElementById('fireworks');
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'];

    console.log('🎆 Creating fireworks!');

    // Create multiple firework bursts
    for (let burst = 0; burst < 5; burst++) {
        setTimeout(() => {
            const centerX = Math.random() * window.innerWidth;
            const centerY = Math.random() * (window.innerHeight * 0.6) + 50;

            // Create particles for each burst
            for (let i = 0; i < 12; i++) {
                const firework = document.createElement('div');
                firework.className = 'firework';
                firework.style.left = centerX + 'px';
                firework.style.top = centerY + 'px';
                firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

                // Random direction for explosion
                const angle = (i / 12) * 2 * Math.PI;
                const distance = 50 + Math.random() * 50;
                const finalX = centerX + Math.cos(angle) * distance;
                const finalY = centerY + Math.sin(angle) * distance;

                firework.style.setProperty('--final-x', finalX + 'px');
                firework.style.setProperty('--final-y', finalY + 'px');

                fireworksContainer.appendChild(firework);

                // Remove firework after animation
                setTimeout(() => {
                    if (firework.parentNode) {
                        firework.parentNode.removeChild(firework);
                    }
                }, 1000);
            }
        }, burst * 200);
    }
}

function createFallingLanterns() {
    const lanternsContainer = document.getElementById('falling-lanterns');
    const lanternEmojis = ['🏮', '🎋', '🥮', '🌙', '✨', '🧧'];

    console.log('🏮 Creating falling lanterns!');

    // Create multiple falling lanterns
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const lantern = document.createElement('div');
            lantern.className = 'falling-lantern';
            lantern.textContent = lanternEmojis[Math.floor(Math.random() * lanternEmojis.length)];
            lantern.style.left = Math.random() * window.innerWidth + 'px';
            lantern.style.animationDuration = (2 + Math.random() * 2) + 's';
            lantern.style.animationDelay = Math.random() * 0.5 + 's';

            lanternsContainer.appendChild(lantern);

            // Remove lantern after animation
            setTimeout(() => {
                if (lantern.parentNode) {
                    lantern.parentNode.removeChild(lantern);
                }
            }, 4000);
        }, i * 100);
    }
}

function toggleMusic() {
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');

    if (!bgMusic || !musicToggle) return;

    if (musicPlaying) {
        bgMusic.pause();
        musicToggle.textContent = '🔇';
        musicToggle.classList.add('muted');
        musicPlaying = false;
        console.log('🔇 Music paused');
    } else {
        bgMusic.play().then(() => {
            musicToggle.textContent = '🔊';
            musicToggle.classList.remove('muted');
            musicPlaying = true;
            console.log('🎵 Music playing');
        }).catch(error => {
            console.log('❌ Could not play music');
        });
    }
}

function showMusicNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        left: 20px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px 15px;
        border-radius: 10px;
        font-size: 0.9rem;
        z-index: 1001;
        cursor: pointer;
        transition: all 0.3s ease;
    `;
    notification.innerHTML = '🎵 Nhấn để bật nhạc! 💕';

    notification.addEventListener('click', function() {
        toggleMusic();
        notification.remove();
    });

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Navigation functions
function nextScreen() {
    console.log(`🔄 Going from screen ${currentScreen} to ${currentScreen + 1}`);

    if (currentScreen >= totalScreens) {
        console.log('🏁 Already at final screen');
        return;
    }

    // Hide current screen
    const current = document.getElementById(`screen${currentScreen}`);
    if (current) {
        current.classList.add('hidden');
    }

    // Show next screen
    currentScreen++;
    const next = document.getElementById(`screen${currentScreen}`);
    if (next) {
        next.classList.remove('hidden');
        console.log(`✅ Now showing screen ${currentScreen}`);
    }
}

function showAnswer1() {
    console.log('🎉 Answer 1 clicked');
    createFireworks();
    setTimeout(() => {
        nextScreen();
    }, 1500);
}

function showAnswer2() {
    console.log('💖 Answer 2 clicked');
    createFallingLanterns();
    setTimeout(() => {
        nextScreen();
    }, 1500);
}

function showFinalAnswer() {
    console.log('🌟 Final answer clicked');
    createFireworks();
    createFallingLanterns();
    setTimeout(() => {
        nextScreen();
    }, 2000);
}

function restart() {
    console.log('🔄 Restarting');

    // Hide all screens
    for (let i = 1; i <= totalScreens; i++) {
        const screen = document.getElementById(`screen${i}`);
        if (screen) {
            screen.classList.add('hidden');
        }
    }

    // Reset and show first screen
    currentScreen = 1;
    const firstScreen = document.getElementById('screen1');
    if (firstScreen) {
        firstScreen.classList.remove('hidden');
        console.log('✅ Back to screen 1');
    }
}

// Enable audio on any click (fallback)
document.addEventListener('click', function enableAudio() {
    const bgMusic = document.getElementById('bgMusic');
    if (!musicPlaying && bgMusic && bgMusic.paused) {
        bgMusic.play().then(() => {
            musicPlaying = true;
            const musicToggle = document.getElementById('musicToggle');
            if (musicToggle) {
                musicToggle.textContent = '🔊';
                musicToggle.classList.remove('muted');
            }
            console.log('🎵 Music enabled by click');
        }).catch(() => {
            console.log('❌ Still cannot play music');
        });
    }
}, { once: true });