// Global Health Disparities Platform - Main JavaScript
console.log('=€ Global Health Platform initialized');

// Global data storage
window.globalHealthData = {
    statistics: null,
    treatmentGaps: null,
    isLoaded: false
};

// Initialize data loading
document.addEventListener('DOMContentLoaded', async function() {
    console.log('=Ê Loading comprehensive health data...');
    
    try {
        // Load both datasets
        await Promise.all([
            loadGlobalStatistics(),
            loadTreatmentGaps()
        ]);
        
        // Update UI with real data
        updateDashboard();
        initializeInteractiveElements();
        
        console.log(' All data loaded successfully!');
        
    } catch (error) {
        console.error('L Error loading data:', error);
        showErrorMessage('Failed to load data. Please refresh the page.');
    }
});

// Load global statistics
async function loadGlobalStatistics() {
    try {
        const response = await fetch('./datasets/global-health-statistics.json?v=' + Date.now());
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        window.globalHealthData.statistics = data;
        console.log(' Global statistics loaded');
        return data;
        
    } catch (error) {
        console.error('L Error loading global statistics:', error);
        throw error;
    }
}

// Load treatment gaps data
async function loadTreatmentGaps() {
    try {
        const response = await fetch('./datasets/mental-health-treatment-gaps.json?v=' + Date.now());
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        window.globalHealthData.treatmentGaps = data;
        console.log(' Treatment gaps data loaded');
        return data;
        
    } catch (error) {
        console.error('L Error loading treatment gaps:', error);
        throw error;
    }
}

// Update dashboard with real data
function updateDashboard() {
    const stats = window.globalHealthData.statistics;
    if (!stats) return;
    
    // Update hero statistics
    const elements = {
        'countries-count': stats.globalOverview.totalCountries,
        'treatment-gap': stats.globalOverview.mentalHealthBurden.averageTreatmentGap + '%',
        'affected-population': stats.globalOverview.mentalHealthBurden.peopleAffectedBillions + 'B'
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            animateNumber(element, value);
        }
    });
    
    // Update data cards with real metrics
    updateDataCards();
}

// Animate numbers
function animateNumber(element, targetValue) {
    const isPercentage = targetValue.includes('%');
    const isBillion = targetValue.includes('B');
    const numericValue = parseFloat(targetValue);
    
    let current = 0;
    const increment = numericValue / 50;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
            current = numericValue;
            clearInterval(timer);
        }
        
        let displayValue = Math.floor(current);
        if (isPercentage) {
            element.textContent = displayValue + '%';
        } else if (isBillion) {
            element.textContent = current.toFixed(1) + 'B';
        } else {
            element.textContent = displayValue;
        }
    }, 20);
}

// Update data cards with real statistics
function updateDataCards() {
    const stats = window.globalHealthData.statistics;
    const gaps = window.globalHealthData.treatmentGaps;
    
    if (!stats || !gaps) return;
    
    // Update critical gap countries
    const criticalElement = document.querySelector('.data-metric .metric-value');
    if (criticalElement && gaps.summaryStatistics) {
        criticalElement.textContent = gaps.summaryStatistics.criticalCountries.length;
    }
    
    // Update economic impact
    const economicElements = document.querySelectorAll('.data-card .metric-value');
    if (economicElements.length >= 4) {
        economicElements[2].textContent = '$' + stats.economicImpact.globalCostTrillions + 'T';
        economicElements[3].textContent = stats.economicImpact.averageGDPImpactPercent + '%';
    }
}

// Initialize interactive elements
function initializeInteractiveElements() {
    // Add click handlers for data cards
    document.querySelectorAll('.data-card').forEach(card => {
        card.addEventListener('click', function() {
            const link = this.querySelector('a');
            if (link) {
                window.location.href = link.href;
            }
        });
    });
    
    // Add hover effects for statistics
    document.querySelectorAll('.stat').forEach(stat => {
        stat.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.05)';
        });
        
        stat.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-10px) scale(1)';
        });
    });
}

// Show error message
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <div style="background: #fee; border: 1px solid #fcc; color: #c33; padding: 1rem; margin: 1rem; border-radius: 8px;">
            <strong>  Error:</strong> ${message}
        </div>
    `;
    
    document.body.insertBefore(errorDiv, document.body.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// Utility functions for other pages
window.HealthPlatform = {
    // Get data for specific country
    getCountryData: function(countryName) {
        const gaps = window.globalHealthData.treatmentGaps;
        return gaps?.treatmentGapsByCountry?.[countryName] || null;
    },
    
    // Get global statistics
    getGlobalStats: function() {
        return window.globalHealthData.statistics;
    },
    
    // Calculate treatment gap for specific disorder globally
    calculateGlobalGap: function(disorder) {
        const stats = window.globalHealthData.statistics;
        return stats?.treatmentGaps?.global?.[disorder] || 0;
    },
    
    // Get countries by income group
    getCountriesByIncome: function(incomeGroup) {
        const gaps = window.globalHealthData.treatmentGaps;
        if (!gaps) return [];
        
        return Object.entries(gaps.treatmentGapsByCountry)
            .filter(([_, data]) => data.incomeGroup === incomeGroup)
            .map(([country, _]) => country);
    },
    
    // Format large numbers
    formatNumber: function(num) {
        if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
        return num.toString();
    }
};

// Enhanced navigation effects
document.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    const scrolled = window.pageYOffset;
    
    if (scrolled > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.05)';
    }
});

// Smooth scrolling for all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

console.log(' Global Health Platform script loaded successfully!');