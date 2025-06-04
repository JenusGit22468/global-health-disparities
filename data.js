// Static Data Loader for Global Health Disparities Platform
// Uses local JSON files with real WHO, World Bank, and IHME data

class StaticHealthDataFetcher {
    constructor() {
        this.baseURL = './datasets/';
        this.cache = new Map();
        this.cacheDuration = 3600000; // 1 hour
    }

    // Generic fetch with caching for static files
    async fetchStaticData(filename, cacheKey) {
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
            console.log(`📦 Using cached data for ${filename}`);
            return cached.data;
        }

        try {
            console.log(`📊 Loading ${filename}...`);
            const response = await fetch(this.baseURL + filename);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            this.cache.set(cacheKey, {
                data: data,
                timestamp: Date.now()
            });
            
            console.log(`✅ Successfully loaded ${filename}`);
            return data;
        } catch (error) {
            console.error(`❌ Error loading ${filename}:`, error);
            throw error;
        }
    }

    // Load mental health treatment gaps
    async getMentalHealthTreatmentGaps() {
        return await this.fetchStaticData('mental-health-treatment-gaps.json', 'treatment_gaps');
    }

    // Load global health statistics
    async getGlobalHealthStatistics() {
        return await this.fetchStaticData('global-health-statistics.json', 'global_stats');
    }

    // Get top countries with highest treatment gaps
    async getTopTreatmentGapCountries(limit = 15) {
        const data = await this.getMentalHealthTreatmentGaps();
        return data.treatmentGaps
            .sort((a, b) => b.gap - a.gap)
            .slice(0, limit);
    }

    // Get regional analysis
    async getRegionalAnalysis() {
        const data = await this.getMentalHealthTreatmentGaps();
        return data.regionalSummary;
    }

    // Get global statistics for dashboard
    async getGlobalStatistics() {
        const [treatmentData, globalData] = await Promise.all([
            this.getMentalHealthTreatmentGaps(),
            this.getGlobalHealthStatistics()
        ]);

        return {
            totalCountries: treatmentData.metadata.totalCountries,
            lmicCount: globalData.globalOverview.lmicCount,
            averageTreatmentGap: treatmentData.globalStatistics.averageTreatmentGap,
            criticalGapCountries: treatmentData.globalStatistics.criticalGapCountries,
            peopleAffected: globalData.globalOverview.mentalHealthBurden.peopleAffectedBillions,
            economicImpact: globalData.economicImpact.globalCostTrillions,
            lastUpdated: treatmentData.metadata.lastUpdated
        };
    }

    // Get country-specific data
    async getCountryData(countryCode) {
        const treatmentData = await this.getMentalHealthTreatmentGaps();
        return treatmentData.treatmentGaps.find(country => 
            country.countryCode.toLowerCase() === countryCode.toLowerCase() ||
            country.country.toLowerCase().includes(countryCode.toLowerCase())
        );
    }

    // Get data by income group
    async getDataByIncomeGroup() {
        const treatmentData = await this.getMentalHealthTreatmentGaps();
        const globalData = await this.getGlobalHealthStatistics();
        
        const grouped = {
            'LIC': [],
            'LMIC': [],
            'UMIC': [],
            'HIC': []
        };

        treatmentData.treatmentGaps.forEach(country => {
            if (grouped[country.incomeGroup]) {
                grouped[country.incomeGroup].push(country);
            }
        });

        // Calculate averages for each group
        Object.keys(grouped).forEach(group => {
            const countries = grouped[group];
            if (countries.length > 0) {
                grouped[group] = {
                    countries: countries,
                    averageGap: countries.reduce((sum, c) => sum + c.gap, 0) / countries.length,
                    totalPopulation: countries.reduce((sum, c) => sum + c.population, 0),
                    averageGDP: countries.reduce((sum, c) => sum + c.gdpPerCapita, 0) / countries.length,
                    countryCount: countries.length
                };
            }
        });

        return grouped;
    }

    // Get prevalence data by disorder
    async getPrevalenceByDisorder() {
        const globalData = await this.getGlobalHealthStatistics();
        return globalData.prevalenceData;
    }

    // Get healthcare resources data
    async getHealthcareResources() {
        const globalData = await this.getGlobalHealthStatistics();
        return globalData.healthcareResources;
    }

    // Get economic impact data
    async getEconomicImpact() {
        const globalData = await this.getGlobalHealthStatistics();
        return globalData.economicImpact;
    }

    // Get trend data over time
    async getTrends() {
        const globalData = await this.getGlobalHealthStatistics();
        return globalData.trends;
    }

    // Get top challenges
    async getTopChallenges() {
        const globalData = await this.getGlobalHealthStatistics();
        return globalData.topChallenges;
    }
}

// Create global instance
const healthDataFetcher = new StaticHealthDataFetcher();

// Helper functions for easy use
async function loadTreatmentGaps() {
    try {
        return await healthDataFetcher.getMentalHealthTreatmentGaps();
    } catch (error) {
        console.error('Error loading treatment gaps:', error);
        return null;
    }
}

async function loadGlobalStats() {
    try {
        return await healthDataFetcher.getGlobalStatistics();
    } catch (error) {
        console.error('Error loading global stats:', error);
        return null;
    }
}

async function loadRegionalData() {
    try {
        return await healthDataFetcher.getRegionalAnalysis();
    } catch (error) {
        console.error('Error loading regional data:', error);
        return null;
    }
}

async function loadCountryData(countryCode) {
    try {
        return await healthDataFetcher.getCountryData(countryCode);
    } catch (error) {
        console.error('Error loading country data:', error);
        return null;
    }
}

async function loadTopTreatmentGapCountries(limit = 15) {
    try {
        return await healthDataFetcher.getTopTreatmentGapCountries(limit);
    } catch (error) {
        console.error('Error loading top countries:', error);
        return null;
    }
}

// Real-time data update function
async function updateDashboardData() {
    try {
        console.log('🔄 Loading static health data files...');
        
        const [globalStats, treatmentGaps, regionalData] = await Promise.all([
            loadGlobalStats(),
            loadTreatmentGaps(),
            loadRegionalData()
        ]);

        if (!globalStats || !treatmentGaps) {
            throw new Error('Failed to load required data files');
        }

        // Update homepage statistics
        if (document.getElementById('countries-count')) {
            document.getElementById('countries-count').textContent = globalStats.totalCountries;
        }
        if (document.getElementById('treatment-gap')) {
            document.getElementById('treatment-gap').textContent = globalStats.averageTreatmentGap + '%';
        }
        if (document.getElementById('affected-population')) {
            document.getElementById('affected-population').textContent = globalStats.peopleAffected + 'B';
        }

        console.log('✅ Dashboard updated with static health data');
        console.log('📊 Data sources: WHO Mental Health Atlas, World Bank, IHME GBD');
        
        return { globalStats, treatmentGaps, regionalData };
        
    } catch (error) {
        console.error('❌ Error updating dashboard data:', error);
        console.log('⚠️ Please ensure datasets folder exists with JSON files');
        return null;
    }
}

// Initialize data loading when page loads
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', updateDashboardData);
}