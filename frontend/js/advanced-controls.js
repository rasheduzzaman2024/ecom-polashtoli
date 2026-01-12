// Advanced Theme & Language Controls

document.addEventListener('DOMContentLoaded', function() {
    initAdvancedControls();
});

// Initialize advanced controls
function initAdvancedControls() {
    // Update language selector indicator
    updateLanguageIndicator();
    
    // Add pulse animation to theme toggle on first visit
    const firstVisit = !localStorage.getItem('visitedBefore');
    if (firstVisit) {
        document.querySelector('.theme-toggle')?.classList.add('pulse');
        localStorage.setItem('visitedBefore', 'true');
        
        // Remove pulse after 5 seconds
        setTimeout(() => {
            document.querySelector('.theme-toggle')?.classList.remove('pulse');
        }, 5000);
    }
}

// Enhanced language switching with animation
function setLanguageAdvanced(lang) {
    // Update language
    setLanguage(lang);
    
    // Update indicator
    updateLanguageIndicator();
    
    // Add visual feedback
    const selector = document.querySelector('.language-selector') || document.querySelector('.language-panel');
    if (selector) {
        selector.style.transform = 'scale(0.95)';
        setTimeout(() => {
            selector.style.transform = 'scale(1)';
        }, 100);
    }
}

// Update language indicator position
function updateLanguageIndicator() {
    const selector = document.querySelector('.language-selector');
    if (selector) {
        const activeLang = localStorage.getItem('language') || 'en';
        selector.setAttribute('data-active', activeLang);
        
        // Update active class
        document.querySelectorAll('.lang-option').forEach(option => {
            option.classList.remove('active');
            if (option.dataset.lang === activeLang) {
                option.classList.add('active');
            }
        });
    }
    
    // Update floating panel if exists
    const panel = document.querySelector('.language-panel');
    if (panel) {
        const activeLang = localStorage.getItem('language') || 'en';
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === activeLang) {
                btn.classList.add('active');
            }
        });
    }
}

// Enhanced theme toggle with animation
function toggleThemeAdvanced() {
    const themeToggle = document.querySelector('.theme-toggle');
    
    // Add rotation animation
    themeToggle.style.transform = 'scale(0.9) rotate(180deg)';
    
    setTimeout(() => {
        toggleTheme();
        themeToggle.style.transform = 'scale(1) rotate(0deg)';
    }, 200);
}

// Settings panel toggle (if advanced panel is used)
function toggleSettingsPanel() {
    const panel = document.querySelector('.settings-panel');
    if (panel) {
        panel.classList.toggle('hidden');
    }
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Shift + T = Toggle Theme
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
        e.preventDefault();
        toggleTheme();
    }
    
    // Ctrl/Cmd + Shift + L = Toggle Language
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'L') {
        e.preventDefault();
        const currentLang = localStorage.getItem('language') || 'en';
        const newLang = currentLang === 'en' ? 'bn' : 'en';
        setLanguage(newLang);
        updateLanguageIndicator();
    }
});

// Smooth scroll behavior for settings
function scrollToSettings() {
    const settingsPanel = document.querySelector('.settings-panel');
    if (settingsPanel) {
        settingsPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Export functions for global use
window.setLanguageAdvanced = setLanguageAdvanced;
window.toggleThemeAdvanced = toggleThemeAdvanced;
window.updateLanguageIndicator = updateLanguageIndicator;
