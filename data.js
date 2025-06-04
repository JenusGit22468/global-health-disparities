// CACHE BUSTER v2.0 - Static data loader
console.log('📊 NEW Static data loader v2.0 loaded');

document.addEventListener('DOMContentLoaded', async function() {
    try {
        console.log('🔄 Loading JSON files from datasets folder...');
        
        const response = await fetch('./datasets/mental-health-treatment-gaps.json?v=' + Date.now());
        
        if (!response.ok) {
            throw new Error(`Failed to load: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ JSON data loaded successfully:', data.metadata);
        
        // Update the numbers
        document.getElementById('countries-count').textContent = '194';
        document.getElementById('treatment-gap').textContent = '76%';
        document.getElementById('affected-population').textContent = '2.1B';
        
        console.log('✅ SUCCESS: Static data loaded - NO MORE API CALLS!');
        
    } catch (error) {
        console.error('❌ Error loading static files:', error);
        console.log('📁 Check if datasets folder exists on GitHub');
    }
});