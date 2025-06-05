// Global Health Data Loader v3.0 - With API Integration
console.log('🌍 Global Health Data Loader v3.0 initialized');

// Global data storage
window.globalHealthData = {
    treatmentGaps: null,
    statistics: null,
    lastUpdated: null,
    dataSource: 'local'
};

// Configuration for data sources
const DATA_CONFIG = {
    useAPI: false, // Set to true to enable live WHO/IHME API calls
    endpoints: {
        who: 'https://ghoapi.azureedge.net/api/',
        ihme: 'https://ghdx.healthdata.org/gbd-api/',
        worldBank: 'https://api.worldbank.org/v2/'
    },
    localFiles: {
        treatmentGaps: './datasets/mental-health-treatment-gaps-expanded.json',
        statistics: './datasets/global-health-statistics.json'
    }
};

document.addEventListener('DOMContentLoaded', async function() {
    try {
        console.log('🔄 Initializing global health data...');
        
        if (DATA_CONFIG.useAPI) {
            console.log('🌐 Loading from live APIs...');
            await loadFromAPIs();
        } else {
            console.log('📁 Loading from local datasets...');
            await loadFromLocal();
        }
        
        // Update homepage statistics
        updateHomepageStats();
        
        console.log('✅ Global health data loaded successfully!');
        console.log('📊 Available data:', Object.keys(window.globalHealthData));
        
    } catch (error) {
        console.error('❌ Error loading health data:', error);
        await fallbackToLocal();
    }
});

// Load data from local JSON files
async function loadFromLocal() {
    try {
        // Load treatment gaps data
        const treatmentResponse = await fetch(DATA_CONFIG.localFiles.treatmentGaps + '?v=' + Date.now());
        if (!treatmentResponse.ok) throw new Error('Failed to load treatment gaps');
        window.globalHealthData.treatmentGaps = await treatmentResponse.json();
        
        // Load global statistics
        const statsResponse = await fetch(DATA_CONFIG.localFiles.statistics + '?v=' + Date.now());
        if (!statsResponse.ok) throw new Error('Failed to load statistics');
        window.globalHealthData.statistics = await statsResponse.json();
        
        window.globalHealthData.lastUpdated = new Date().toISOString();
        window.globalHealthData.dataSource = 'local';
        
        console.log('✅ Local data loaded:', {
            treatmentGaps: Object.keys(window.globalHealthData.treatmentGaps.treatmentGapsByCountry || {}).length + ' countries',
            statistics: 'Global overview available'
        });
        
    } catch (error) {
        console.error('❌ Error loading local data:', error);
        throw error;
    }
}

// Load data from live APIs (WHO, IHME, World Bank)
async function loadFromAPIs() {
    try {
        console.log('🌐 Fetching from WHO Global Health Observatory...');
        
        // Example WHO API calls (simplified - real implementation would be more complex)
        const promises = [
            fetchWHOData('MENTAL_HEALTH_ATLAS'),
            fetchIHMEData('mental-disorders'),
            fetchWorldBankData('population')
        ];
        
        const [whoData, ihmeData, wbData] = await Promise.allSettled(promises);
        
        // Process and combine API data
        window.globalHealthData.treatmentGaps = processAPIData(whoData, ihmeData, wbData);
        window.globalHealthData.lastUpdated = new Date().toISOString();
        window.globalHealthData.dataSource = 'api';
        
        console.log('✅ API data loaded successfully');
        
    } catch (error) {
        console.error('❌ API loading failed:', error);
        throw error;
    }
}

// WHO API integration
async function fetchWHOData(indicator) {
    const url = `${DATA_CONFIG.endpoints.who}${indicator}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`WHO API error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.warn('⚠️ WHO API unavailable:', error.message);
        return null;
    }
}

// IHME API integration
async function fetchIHMEData(cause) {
    const url = `${DATA_CONFIG.endpoints.ihme}causes/${cause}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`IHME API error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.warn('⚠️ IHME API unavailable:', error.message);
        return null;
    }
}

// World Bank API integration
async function fetchWorldBankData(indicator) {
    const url = `${DATA_CONFIG.endpoints.worldBank}indicator/${indicator}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`World Bank API error: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.warn('⚠️ World Bank API unavailable:', error.message);
        return null;
    }
}

// Process and normalize API data
function processAPIData(whoData, ihmeData, wbData) {
    // This would contain complex logic to merge and normalize API responses
    // For now, return a placeholder structure
    console.log('🔄 Processing API data...');
    return {
        metadata: {
            source: 'Live WHO/IHME/World Bank APIs',
            lastUpdated: new Date().toISOString(),
            description: 'Real-time global mental health data'
        },
        treatmentGapsByCountry: {} // Would be populated from API responses
    };
}

// Fallback to local data if APIs fail
async function fallbackToLocal() {
    console.log('🔄 Falling back to local datasets...');
    try {
        await loadFromLocal();
        console.log('✅ Successfully loaded fallback data');
    } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
        showDataError();
    }
}

// Update homepage statistics
function updateHomepageStats() {
    try {
        const treatmentData = window.globalHealthData.treatmentGaps;
        const statsData = window.globalHealthData.statistics;
        
        if (treatmentData && treatmentData.summaryStatistics) {
            // Update country count
            const countElement = document.getElementById('countries-count');
            if (countElement) {
                countElement.textContent = treatmentData.summaryStatistics.totalCountries || '194';
            }
            
            // Update treatment gap
            const gapElement = document.getElementById('treatment-gap');
            if (gapElement) {
                const avgGap = treatmentData.summaryStatistics.averageGapsByIncomeGroup
                    ? Math.round(Object.values(treatmentData.summaryStatistics.averageGapsByIncomeGroup)
                        .reduce((a, b) => a + b) / 4)
                    : 76;
                gapElement.textContent = avgGap + '%';
            }
        }
        
        // Update affected population
        const popElement = document.getElementById('affected-population');
        if (popElement && statsData) {
            popElement.textContent = statsData.globalOverview?.mentalHealthBurden?.peopleAffectedBillions + 'B' || '2.1B';
        }
        
    } catch (error) {
        console.warn('⚠️ Could not update homepage stats:', error);
    }
}

// Show data loading error
function showDataError() {
    console.error('❌ All data sources failed');
    const errorElements = document.querySelectorAll('[id$="-count"], [id$="-gap"], [id$="-population"]');
    errorElements.forEach(el => {
        if (el) el.textContent = '---';
    });
}

// Export functions for use by other pages
window.GlobalHealthData = {
    getCountryData: (countryName) => {
        return window.globalHealthData.treatmentGaps?.treatmentGapsByCountry?.[countryName];
    },
    getRegionalData: (region) => {
        const countries = window.globalHealthData.treatmentGaps?.treatmentGapsByCountry || {};
        return Object.entries(countries)
            .filter(([name, data]) => data.region === region)
            .reduce((acc, [name, data]) => ({ ...acc, [name]: data }), {});
    },
    refreshData: async () => {
        if (DATA_CONFIG.useAPI) {
            await loadFromAPIs();
        } else {
            await loadFromLocal();
        }
        updateHomepageStats();
    },
    enableLiveData: () => {
        DATA_CONFIG.useAPI = true;
        console.log('🌐 Live API data enabled');
    },
    getDataSource: () => window.globalHealthData.dataSource,
    getLastUpdated: () => window.globalHealthData.lastUpdated
};