// Enhanced Data Visualization Library for Global Health Disparities Platform
console.log('📊 Enhanced Charts Library loaded');

// Advanced Chart Configuration
const ChartConfig = {
    defaultOptions: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index'
        },
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        family: 'Inter',
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'rgba(59, 130, 246, 0.8)',
                borderWidth: 1,
                cornerRadius: 8,
                titleFont: {
                    family: 'Inter',
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    family: 'Inter',
                    size: 12
                },
                padding: 12
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(226, 232, 240, 0.5)',
                    borderColor: 'rgba(203, 213, 224, 0.8)'
                },
                ticks: {
                    font: {
                        family: 'Inter',
                        size: 11
                    },
                    color: '#64748B'
                }
            },
            y: {
                grid: {
                    color: 'rgba(226, 232, 240, 0.5)',
                    borderColor: 'rgba(203, 213, 224, 0.8)'
                },
                ticks: {
                    font: {
                        family: 'Inter',
                        size: 11
                    },
                    color: '#64748B'
                }
            }
        }
    },
    
    colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        accent: '#F59E0B',
        danger: '#EF4444',
        purple: '#8B5CF6',
        teal: '#06B6D4',
        gradients: {
            blue: ['#3B82F6', '#1E40AF'],
            green: ['#10B981', '#047857'],
            orange: ['#F59E0B', '#D97706'],
            red: ['#EF4444', '#DC2626'],
            purple: ['#8B5CF6', '#7C3AED'],
            teal: ['#06B6D4', '#0891B2']
        }
    }
};

// Enhanced Interactive Charts Class
class EnhancedChart {
    constructor(canvasId, type, data, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas with id '${canvasId}' not found`);
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.type = type;
        this.data = data;
        this.options = this.mergeOptions(options);
        this.chart = null;
        this.animations = [];
        
        this.createChart();
        this.addInteractivity();
    }
    
    mergeOptions(customOptions) {
        return {
            ...ChartConfig.defaultOptions,
            ...customOptions,
            plugins: {
                ...ChartConfig.defaultOptions.plugins,
                ...customOptions.plugins
            }
        };
    }
    
    createChart() {
        this.chart = new Chart(this.ctx, {
            type: this.type,
            data: this.data,
            options: this.options
        });
    }
    
    addInteractivity() {
        // Enhanced hover effects with animation
        this.canvas.addEventListener('mousemove', (e) => {
            this.canvas.style.cursor = 'pointer';
            
            const points = this.chart.getElementsAtEventForMode(e, 'nearest', { intersect: false }, true);
            if (points.length > 0) {
                // Add glow effect on hover
                ChartAnimations.glowEffect(this, '#059669', 300);
                
                // Create hover tooltip
                this.showHoverTooltip(e, points[0]);
            }
        });
        
        this.canvas.addEventListener('mouseleave', (e) => {
            this.canvas.style.cursor = 'default';
            this.hideHoverTooltip();
        });
        
        // Enhanced click events with animation feedback
        this.canvas.addEventListener('click', (e) => {
            const points = this.chart.getElementsAtEventForMode(e, 'nearest', { intersect: true }, true);
            if (points.length) {
                // Add pulse effect on click
                ChartAnimations.pulseEffect(this, 1.1);
                
                // Handle the click
                this.handleChartClick(points[0]);
                
                // Create ripple effect
                this.createRippleEffect(e);
            }
        });
        
        // Add keyboard navigation
        this.canvas.setAttribute('tabindex', '0');
        this.canvas.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                ChartAnimations.pulseEffect(this, 1.05);
            }
        });
        
        // Enhanced mobile touch support
        this.addMobileTouchSupport();
    }
    
    addMobileTouchSupport() {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;
        let lastTap = 0;
        
        // Touch start
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            touchStartX = touch.clientX;
            touchStartY = touch.clientY;
            touchStartTime = Date.now();
            
            // Check for double tap
            const currentTime = Date.now();
            const tapLength = currentTime - lastTap;
            if (tapLength < 500 && tapLength > 0) {
                this.handleDoubleTap(touch);
            }
            lastTap = currentTime;
            
            // Add visual feedback
            this.canvas.style.transform = 'scale(0.98)';
        }, { passive: false });
        
        // Touch move
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const deltaX = touch.clientX - touchStartX;
            const deltaY = touch.clientY - touchStartY;
            
            // Handle pan gesture
            if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
                this.handlePanGesture(deltaX, deltaY);
            }
        }, { passive: false });
        
        // Touch end
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            const deltaTime = Date.now() - touchStartTime;
            const deltaX = touch.clientX - touchStartX;
            const deltaY = touch.clientY - touchStartY;
            
            // Reset visual feedback
            this.canvas.style.transform = 'scale(1)';
            
            // Handle different gestures
            if (deltaTime < 300 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
                // Simple tap
                this.handleTouchTap(touch);
            } else if (Math.abs(deltaX) > 50) {
                // Swipe gesture
                this.handleSwipeGesture(deltaX > 0 ? 'right' : 'left');
            }
        });
        
        // Pinch zoom support
        this.canvas.addEventListener('gesturestart', (e) => {
            e.preventDefault();
            this.initialScale = this.chart.options.scales?.x?.min || 0;
        });
        
        this.canvas.addEventListener('gesturechange', (e) => {
            e.preventDefault();
            this.handlePinchZoom(e.scale);
        });
        
        this.canvas.addEventListener('gestureend', (e) => {
            e.preventDefault();
        });
    }
    
    handleTouchTap(touch) {
        // Convert touch to chart interaction
        const rect = this.canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        const points = this.chart.getElementsAtEventForMode({
            x: x,
            y: y
        }, 'nearest', { intersect: true }, true);
        
        if (points.length) {
            ChartAnimations.pulseEffect(this, 1.1);
            this.handleChartClick(points[0]);
            this.createRippleEffect({ offsetX: x, offsetY: y });
        }
    }
    
    handleDoubleTap(touch) {
        // Reset zoom or show detailed view
        if (this.chart.options.scales?.x?.min !== undefined) {
            this.resetZoom();
        } else {
            this.showDetailedView();
        }
        
        ChartAnimations.bounceIn(this, 600);
    }
    
    handlePanGesture(deltaX, deltaY) {
        // Handle chart panning for mobile
        if (this.chart.options.scales?.x?.min !== undefined) {
            const xScale = this.chart.scales.x;
            const range = xScale.max - xScale.min;
            const panAmount = (deltaX / this.canvas.width) * range * 0.1;
            
            this.chart.options.scales.x.min -= panAmount;
            this.chart.options.scales.x.max -= panAmount;
            this.chart.update('none');
        }
    }
    
    handleSwipeGesture(direction) {
        // Handle chart navigation
        if (direction === 'left') {
            this.showNextDataset();
        } else if (direction === 'right') {
            this.showPreviousDataset();
        }
        
        // Visual feedback
        const animationType = direction === 'left' ? 'slideInFromRight' : 'slideInFromLeft';
        ChartAnimations[animationType](this, 400);
    }
    
    handlePinchZoom(scale) {
        // Handle pinch-to-zoom
        if (this.chart.options.scales?.x) {
            const currentRange = this.chart.scales.x.max - this.chart.scales.x.min;
            const newRange = currentRange / scale;
            const center = (this.chart.scales.x.max + this.chart.scales.x.min) / 2;
            
            this.chart.options.scales.x.min = center - newRange / 2;
            this.chart.options.scales.x.max = center + newRange / 2;
            this.chart.update('none');
        }
    }
    
    resetZoom() {
        // Reset chart zoom to original state
        if (this.chart.options.scales?.x) {
            delete this.chart.options.scales.x.min;
            delete this.chart.options.scales.x.max;
            this.chart.update('active');
        }
    }
    
    showDetailedView() {
        // Show detailed modal or expanded view
        this.createDetailModal();
    }
    
    showNextDataset() {
        // Cycle through datasets
        if (this.chart.data.datasets.length > 1) {
            const visibleDatasets = this.chart.data.datasets.filter(ds => !ds.hidden);
            if (visibleDatasets.length > 0) {
                const currentIndex = this.chart.data.datasets.indexOf(visibleDatasets[0]);
                const nextIndex = (currentIndex + 1) % this.chart.data.datasets.length;
                
                this.chart.data.datasets.forEach((ds, index) => {
                    ds.hidden = index !== nextIndex;
                });
                this.chart.update('active');
            }
        }
    }
    
    showPreviousDataset() {
        // Cycle through datasets backwards
        if (this.chart.data.datasets.length > 1) {
            const visibleDatasets = this.chart.data.datasets.filter(ds => !ds.hidden);
            if (visibleDatasets.length > 0) {
                const currentIndex = this.chart.data.datasets.indexOf(visibleDatasets[0]);
                const prevIndex = currentIndex === 0 ? this.chart.data.datasets.length - 1 : currentIndex - 1;
                
                this.chart.data.datasets.forEach((ds, index) => {
                    ds.hidden = index !== prevIndex;
                });
                this.chart.update('active');
            }
        }
    }
    
    createDetailModal() {
        // Create a detailed modal view for the chart
        const modal = document.createElement('div');
        modal.className = 'chart-detail-modal';
        modal.innerHTML = `
            <div class="modal-content large">
                <span class="close">&times;</span>
                <h3>Detailed Chart View</h3>
                <div class="detail-chart-container">
                    <canvas id="detail-chart-${this.canvas.id}"></canvas>
                </div>
                <div class="chart-controls">
                    <button class="btn secondary" onclick="this.parentElement.parentElement.parentElement.remove()">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Create larger version of the chart
        const detailCanvas = modal.querySelector(`#detail-chart-${this.canvas.id}`);
        const detailChart = new Chart(detailCanvas, {
            type: this.type,
            data: JSON.parse(JSON.stringify(this.data)),
            options: {
                ...this.options,
                responsive: true,
                maintainAspectRatio: false
            }
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.className === 'close') {
                detailChart.destroy();
                modal.remove();
            }
        });
    }
    
    showHoverTooltip(event, point) {
        // Remove existing tooltip
        this.hideHoverTooltip();
        
        const rect = this.canvas.getBoundingClientRect();
        const tooltip = document.createElement('div');
        tooltip.className = 'chart-hover-tooltip';
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(30, 41, 59, 0.95);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            pointer-events: none;
            z-index: 1000;
            left: ${rect.left + event.offsetX + 10}px;
            top: ${rect.top + event.offsetY - 30}px;
            transform: scale(0);
            transition: transform 0.2s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        `;
        
        const datasetIndex = point.datasetIndex;
        const dataIndex = point.index;
        const value = this.chart.data.datasets[datasetIndex].data[dataIndex];
        const label = this.chart.data.labels[dataIndex];
        
        tooltip.textContent = `${label}: ${value}${typeof value === 'number' && value <= 100 ? '%' : ''}`;
        document.body.appendChild(tooltip);
        
        // Animate in
        setTimeout(() => {
            tooltip.style.transform = 'scale(1)';
        }, 10);
        
        this.currentTooltip = tooltip;
    }
    
    hideHoverTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.style.transform = 'scale(0)';
            setTimeout(() => {
                if (this.currentTooltip && this.currentTooltip.parentNode) {
                    this.currentTooltip.parentNode.removeChild(this.currentTooltip);
                }
                this.currentTooltip = null;
            }, 200);
        }
    }
    
    createRippleEffect(event) {
        const rect = this.canvas.getBoundingClientRect();
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(5, 150, 105, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            z-index: 999;
            width: 40px;
            height: 40px;
            left: ${rect.left + event.offsetX - 20}px;
            top: ${rect.top + event.offsetY - 20}px;
        `;
        
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    handleChartClick(point) {
        const datasetIndex = point.datasetIndex;
        const dataIndex = point.index;
        const value = this.chart.data.datasets[datasetIndex].data[dataIndex];
        const label = this.chart.data.labels[dataIndex];
        
        // Emit custom event for drill-down functionality
        this.canvas.dispatchEvent(new CustomEvent('chartPointClick', {
            detail: { datasetIndex, dataIndex, value, label }
        }));
    }
    
    update(newData) {
        this.chart.data = newData;
        this.chart.update('active');
    }
    
    destroy() {
        if (this.chart) {
            this.chart.destroy();
        }
    }
    
    // Animate chart entrance
    animateEntrance() {
        this.chart.options.animation = {
            duration: 1500,
            easing: 'easeOutQuart'
        };
        this.chart.update();
    }
}

// Specialized Chart Types
class GeoHeatmapChart extends EnhancedChart {
    constructor(canvasId, geoData, valueData, options = {}) {
        const chartData = {
            datasets: [{
                label: 'Treatment Gap',
                data: valueData,
                backgroundColor: (ctx) => {
                    const value = ctx.parsed.y;
                    if (value >= 80) return 'rgba(239, 68, 68, 0.8)';
                    if (value >= 60) return 'rgba(245, 158, 11, 0.8)';
                    if (value >= 40) return 'rgba(59, 130, 246, 0.8)';
                    return 'rgba(16, 185, 129, 0.8)';
                },
                borderColor: 'rgba(255, 255, 255, 0.8)',
                borderWidth: 1
            }]
        };
        
        const chartOptions = {
            ...options,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'GDP per Capita (PPP)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Treatment Gap (%)'
                    }
                }
            }
        };
        
        super(canvasId, 'scatter', chartData, chartOptions);
    }
}

class AnimatedBarChart extends EnhancedChart {
    constructor(canvasId, data, options = {}) {
        const chartOptions = {
            ...options,
            animation: {
                duration: 2000,
                easing: 'easeOutBounce',
                delay: (context) => {
                    let delay = 0;
                    if (context.type === 'data' && context.mode === 'default') {
                        delay = context.dataIndex * 100;
                    }
                    return delay;
                }
            },
            plugins: {
                ...options.plugins,
                tooltip: {
                    ...ChartConfig.defaultOptions.plugins.tooltip,
                    callbacks: {
                        title: (tooltipItems) => {
                            return tooltipItems[0].label;
                        },
                        label: (context) => {
                            return `${context.dataset.label}: ${context.parsed.y}%`;
                        }
                    }
                }
            }
        };
        
        super(canvasId, 'bar', data, chartOptions);
    }
}

class InteractiveLineChart extends EnhancedChart {
    constructor(canvasId, data, options = {}) {
        const chartOptions = {
            ...options,
            interaction: {
                intersect: false,
                mode: 'index'
            },
            plugins: {
                ...options.plugins,
                crosshair: {
                    line: {
                        color: 'rgba(59, 130, 246, 0.5)',
                        width: 1,
                        dashPattern: [5, 5]
                    },
                    sync: {
                        enabled: true,
                        group: 1,
                        suppressTooltips: false
                    }
                }
            },
            onHover: (event, activeElements) => {
                if (activeElements.length > 0) {
                    this.showDataPoint(activeElements[0]);
                }
            }
        };
        
        super(canvasId, 'line', data, chartOptions);
    }
    
    showDataPoint(element) {
        const dataIndex = element.index;
        const value = this.chart.data.datasets[element.datasetIndex].data[dataIndex];
        const label = this.chart.data.labels[dataIndex];
        
        // Show data point details
        this.updateDataPointDisplay(label, value);
    }
    
    updateDataPointDisplay(label, value) {
        const display = document.getElementById('data-point-display');
        if (display) {
            display.innerHTML = `
                <div class="data-point-info">
                    <span class="data-label">${label}</span>
                    <span class="data-value">${value}</span>
                </div>
            `;
        }
    }
}

// Enhanced Chart Animation Effects
class ChartAnimations {
    static fadeIn(chart, duration = 1000) {
        const canvas = chart.canvas;
        canvas.style.opacity = '0';
        canvas.style.transition = `opacity ${duration}ms ease-in-out`;
        
        setTimeout(() => {
            canvas.style.opacity = '1';
        }, 100);
    }
    
    static slideUp(chart, duration = 800) {
        const canvas = chart.canvas;
        canvas.style.transform = 'translateY(50px)';
        canvas.style.opacity = '0';
        canvas.style.transition = `all ${duration}ms ease-out`;
        
        setTimeout(() => {
            canvas.style.transform = 'translateY(0)';
            canvas.style.opacity = '1';
        }, 100);
    }
    
    static scaleIn(chart, duration = 600) {
        const canvas = chart.canvas;
        canvas.style.transform = 'scale(0.8)';
        canvas.style.opacity = '0';
        canvas.style.transition = `all ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
        
        setTimeout(() => {
            canvas.style.transform = 'scale(1)';
            canvas.style.opacity = '1';
        }, 100);
    }
    
    static bounceIn(chart, duration = 800) {
        const canvas = chart.canvas;
        canvas.style.transform = 'scale(0.3)';
        canvas.style.opacity = '0';
        canvas.style.transition = `all ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
        
        setTimeout(() => {
            canvas.style.transform = 'scale(1)';
            canvas.style.opacity = '1';
        }, 100);
    }
    
    static rotateIn(chart, duration = 800) {
        const canvas = chart.canvas;
        canvas.style.transform = 'rotate(-180deg) scale(0.8)';
        canvas.style.opacity = '0';
        canvas.style.transition = `all ${duration}ms ease-out`;
        
        setTimeout(() => {
            canvas.style.transform = 'rotate(0deg) scale(1)';
            canvas.style.opacity = '1';
        }, 100);
    }
    
    static slideInFromLeft(chart, duration = 600) {
        const canvas = chart.canvas;
        canvas.style.transform = 'translateX(-100%)';
        canvas.style.opacity = '0';
        canvas.style.transition = `all ${duration}ms ease-out`;
        
        setTimeout(() => {
            canvas.style.transform = 'translateX(0)';
            canvas.style.opacity = '1';
        }, 100);
    }
    
    static slideInFromRight(chart, duration = 600) {
        const canvas = chart.canvas;
        canvas.style.transform = 'translateX(100%)';
        canvas.style.opacity = '0';
        canvas.style.transition = `all ${duration}ms ease-out`;
        
        setTimeout(() => {
            canvas.style.transform = 'translateX(0)';
            canvas.style.opacity = '1';
        }, 100);
    }
    
    static pulseEffect(chart, intensity = 1.05) {
        const canvas = chart.canvas;
        canvas.style.transition = 'transform 0.3s ease';
        canvas.style.transform = `scale(${intensity})`;
        
        setTimeout(() => {
            canvas.style.transform = 'scale(1)';
        }, 200);
    }
    
    static glowEffect(chart, color = '#059669', duration = 500) {
        const canvas = chart.canvas;
        canvas.style.transition = `box-shadow ${duration}ms ease`;
        canvas.style.boxShadow = `0 0 20px ${color}80`;
        
        setTimeout(() => {
            canvas.style.boxShadow = 'none';
        }, duration);
    }
}

// Interactive Data Explorer
class DataExplorer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.data = null;
        this.filters = {};
        this.charts = [];
        
        this.init();
    }
    
    init() {
        this.createFilterControls();
        this.createChartContainer();
        this.bindEvents();
    }
    
    createFilterControls() {
        const filterHTML = `
            <div class="data-explorer-filters">
                <div class="filter-row">
                    <div class="filter-group">
                        <label><i class="fas fa-search"></i> Search Countries:</label>
                        <input type="text" id="country-search" class="filter-input" placeholder="Type country name..." />
                        <div id="search-suggestions" class="search-suggestions"></div>
                    </div>
                    
                    <div class="filter-group">
                        <label><i class="fas fa-globe"></i> Region:</label>
                        <select id="region-filter" class="filter-select">
                            <option value="all">All Regions</option>
                            <option value="Sub-Saharan Africa">Sub-Saharan Africa</option>
                            <option value="South Asia">South Asia</option>
                            <option value="East Asia & Pacific">East Asia & Pacific</option>
                            <option value="Latin America & Caribbean">Latin America & Caribbean</option>
                            <option value="Middle East & North Africa">Middle East & North Africa</option>
                            <option value="Europe & Central Asia">Europe & Central Asia</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label><i class="fas fa-dollar-sign"></i> Income Level:</label>
                        <select id="income-filter" class="filter-select">
                            <option value="all">All Income Levels</option>
                            <option value="Low Income">Low Income</option>
                            <option value="Lower Middle Income">Lower Middle Income</option>
                            <option value="Upper Middle Income">Upper Middle Income</option>
                            <option value="High Income">High Income</option>
                        </select>
                    </div>
                </div>
                
                <div class="filter-row">
                    <div class="filter-group">
                        <label><i class="fas fa-brain"></i> Disorder:</label>
                        <select id="disorder-filter" class="filter-select">
                            <option value="depression">Depression</option>
                            <option value="anxiety">Anxiety</option>
                            <option value="bipolar">Bipolar</option>
                            <option value="schizophrenia">Schizophrenia</option>
                            <option value="substanceUse">Substance Use</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label><i class="fas fa-chart-line"></i> Treatment Gap Range:</label>
                        <div class="range-slider">
                            <input type="range" id="gap-min" min="0" max="100" value="0" class="slider">
                            <input type="range" id="gap-max" min="0" max="100" value="100" class="slider">
                            <div class="range-values">
                                <span id="gap-min-value">0%</span> - <span id="gap-max-value">100%</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="filter-group">
                        <label><i class="fas fa-sort"></i> Sort By:</label>
                        <select id="sort-filter" class="filter-select">
                            <option value="alphabetical">Alphabetical</option>
                            <option value="gap-high">Treatment Gap (High to Low)</option>
                            <option value="gap-low">Treatment Gap (Low to High)</option>
                            <option value="population">Population Size</option>
                            <option value="gdp">GDP per Capita</option>
                        </select>
                    </div>
                </div>
                
                <div class="filter-actions">
                    <button id="apply-filters" class="filter-btn primary">
                        <i class="fas fa-filter"></i> Apply Filters
                    </button>
                    
                    <button id="reset-filters" class="filter-btn secondary">
                        <i class="fas fa-undo"></i> Reset All
                    </button>
                    
                    <button id="save-filter" class="filter-btn tertiary">
                        <i class="fas fa-bookmark"></i> Save Filter
                    </button>
                    
                    <button id="compare-mode" class="filter-btn tertiary">
                        <i class="fas fa-balance-scale"></i> Compare Mode
                    </button>
                    
                    <div class="filter-summary" id="filter-summary">
                        Showing all 194 countries
                    </div>
                </div>
            </div>
        `;
        
        this.container.insertAdjacentHTML('afterbegin', filterHTML);
    }
    
    createChartContainer() {
        const chartHTML = `
            <div class="chart-grid">
                <div class="chart-card">
                    <h3>Treatment Gaps by Region</h3>
                    <canvas id="explorer-chart-1"></canvas>
                </div>
                
                <div class="chart-card">
                    <h3>Economic Impact Analysis</h3>
                    <canvas id="explorer-chart-2"></canvas>
                </div>
                
                <div class="chart-card">
                    <h3>Resource Distribution</h3>
                    <canvas id="explorer-chart-3"></canvas>
                </div>
                
                <div class="chart-card">
                    <h3>Trend Analysis</h3>
                    <canvas id="explorer-chart-4"></canvas>
                </div>
            </div>
        `;
        
        this.container.insertAdjacentHTML('beforeend', chartHTML);
    }
    
    bindEvents() {
        // Primary filter actions
        document.getElementById('apply-filters').addEventListener('click', () => {
            this.applyFilters();
        });
        
        document.getElementById('reset-filters').addEventListener('click', () => {
            this.resetFilters();
        });
        
        document.getElementById('save-filter').addEventListener('click', () => {
            this.saveCurrentFilter();
        });
        
        document.getElementById('compare-mode').addEventListener('click', () => {
            this.toggleCompareMode();
        });
        
        // Real-time search
        const searchInput = document.getElementById('country-search');
        searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });
        
        // Range sliders
        const gapMin = document.getElementById('gap-min');
        const gapMax = document.getElementById('gap-max');
        
        gapMin.addEventListener('input', (e) => {
            this.updateRangeValues();
            this.applyFiltersLive();
        });
        
        gapMax.addEventListener('input', (e) => {
            this.updateRangeValues();
            this.applyFiltersLive();
        });
        
        // Live filtering on select changes
        ['region-filter', 'income-filter', 'disorder-filter', 'sort-filter'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => {
                this.applyFiltersLive();
            });
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'f':
                        e.preventDefault();
                        searchInput.focus();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.resetFilters();
                        break;
                    case 's':
                        e.preventDefault();
                        this.saveCurrentFilter();
                        break;
                }
            }
        });
    }
    
    handleSearch(query) {
        if (query.length < 2) {
            this.hideSuggestions();
            return;
        }
        
        // Mock country data - in real implementation, this would come from your dataset
        const countries = [
            'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria',
            'Bangladesh', 'Belgium', 'Brazil', 'Canada', 'China', 'Colombia',
            'Denmark', 'Egypt', 'Ethiopia', 'Finland', 'France', 'Germany',
            'Ghana', 'Greece', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
            'Israel', 'Italy', 'Japan', 'Kenya', 'South Korea', 'Libya',
            'Malaysia', 'Mexico', 'Morocco', 'Netherlands', 'Nigeria', 'Norway',
            'Pakistan', 'Philippines', 'Poland', 'Portugal', 'Russia', 'Saudi Arabia',
            'South Africa', 'Spain', 'Sweden', 'Switzerland', 'Thailand', 'Turkey',
            'Uganda', 'Ukraine', 'United Kingdom', 'United States', 'Vietnam', 'Zimbabwe'
        ];
        
        const suggestions = countries
            .filter(country => country.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 8);
            
        this.showSuggestions(suggestions);
    }
    
    showSuggestions(suggestions) {
        const container = document.getElementById('search-suggestions');
        container.innerHTML = suggestions
            .map(country => `<div class="suggestion-item" data-country="${country}">${country}</div>`)
            .join('');
            
        container.style.display = suggestions.length > 0 ? 'block' : 'none';
        
        // Add click handlers
        container.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                document.getElementById('country-search').value = item.dataset.country;
                this.hideSuggestions();
                this.applyFiltersLive();
            });
        });
    }
    
    hideSuggestions() {
        document.getElementById('search-suggestions').style.display = 'none';
    }
    
    updateRangeValues() {
        const minValue = document.getElementById('gap-min').value;
        const maxValue = document.getElementById('gap-max').value;
        
        // Ensure min doesn't exceed max
        if (parseInt(minValue) > parseInt(maxValue)) {
            document.getElementById('gap-min').value = maxValue;
        }
        
        document.getElementById('gap-min-value').textContent = `${document.getElementById('gap-min').value}%`;
        document.getElementById('gap-max-value').textContent = `${document.getElementById('gap-max').value}%`;
    }
    
    applyFiltersLive() {
        // Apply filters with debouncing for better performance
        clearTimeout(this.filterTimeout);
        this.filterTimeout = setTimeout(() => {
            this.applyFilters();
        }, 300);
    }
    
    saveCurrentFilter() {
        const filterState = {
            region: document.getElementById('region-filter').value,
            income: document.getElementById('income-filter').value,
            disorder: document.getElementById('disorder-filter').value,
            search: document.getElementById('country-search').value,
            gapMin: document.getElementById('gap-min').value,
            gapMax: document.getElementById('gap-max').value,
            sort: document.getElementById('sort-filter').value,
            timestamp: Date.now()
        };
        
        const savedFilters = JSON.parse(localStorage.getItem('healthDataFilters') || '[]');
        savedFilters.push(filterState);
        
        // Keep only last 10 saved filters
        if (savedFilters.length > 10) {
            savedFilters.shift();
        }
        
        localStorage.setItem('healthDataFilters', JSON.stringify(savedFilters));
        
        // Show confirmation
        this.showNotification('Filter saved successfully!', 'success');
    }
    
    toggleCompareMode() {
        this.compareMode = !this.compareMode;
        const button = document.getElementById('compare-mode');
        
        if (this.compareMode) {
            button.classList.add('active');
            button.innerHTML = '<i class="fas fa-balance-scale"></i> Exit Compare';
            this.showNotification('Compare mode enabled. Click on charts to compare data points.', 'info');
        } else {
            button.classList.remove('active');
            button.innerHTML = '<i class="fas fa-balance-scale"></i> Compare Mode';
            this.clearComparisons();
        }
    }
    
    clearComparisons() {
        // Clear any comparison highlights
        document.querySelectorAll('.comparison-highlight').forEach(el => {
            el.classList.remove('comparison-highlight');
        });
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'info'}-circle"></i>
            ${message}
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10B981' : '#3B82F6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    applyFilters() {
        this.filters = {
            region: document.getElementById('region-filter').value,
            income: document.getElementById('income-filter').value,
            disorder: document.getElementById('disorder-filter').value
        };
        
        this.updateCharts();
    }
    
    resetFilters() {
        document.getElementById('region-filter').value = 'all';
        document.getElementById('income-filter').value = 'all';
        document.getElementById('disorder-filter').value = 'depression';
        
        this.filters = {};
        this.updateCharts();
    }
    
    updateCharts() {
        // Update charts based on current filters
        this.charts.forEach(chart => chart.update());
        
        // Add loading animation
        this.showLoadingAnimation();
        
        setTimeout(() => {
            this.hideLoadingAnimation();
        }, 1000);
    }
    
    showLoadingAnimation() {
        const charts = document.querySelectorAll('.chart-card canvas');
        charts.forEach(canvas => {
            canvas.style.opacity = '0.5';
            canvas.style.filter = 'blur(2px)';
        });
    }
    
    hideLoadingAnimation() {
        const charts = document.querySelectorAll('.chart-card canvas');
        charts.forEach(canvas => {
            canvas.style.opacity = '1';
            canvas.style.filter = 'none';
            canvas.style.transition = 'all 0.5s ease';
        });
    }
}

// Real-time Data Updates
class RealTimeUpdater {
    constructor(charts, updateInterval = 30000) {
        this.charts = charts;
        this.interval = updateInterval;
        this.isActive = false;
        
        this.startUpdates();
    }
    
    startUpdates() {
        this.isActive = true;
        this.updateLoop();
    }
    
    stopUpdates() {
        this.isActive = false;
    }
    
    async updateLoop() {
        while (this.isActive) {
            try {
                await this.fetchLatestData();
                this.updateAllCharts();
                await this.sleep(this.interval);
            } catch (error) {
                console.error('Error updating data:', error);
                await this.sleep(this.interval * 2); // Wait longer on error
            }
        }
    }
    
    async fetchLatestData() {
        // Simulate data updates
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ updated: true });
            }, 100);
        });
    }
    
    updateAllCharts() {
        this.charts.forEach(chart => {
            if (chart && chart.chart) {
                chart.chart.update('none'); // Update without animation for real-time feel
            }
        });
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export classes for use in other files
window.EnhancedChart = EnhancedChart;
window.GeoHeatmapChart = GeoHeatmapChart;
window.AnimatedBarChart = AnimatedBarChart;
window.InteractiveLineChart = InteractiveLineChart;
window.ChartAnimations = ChartAnimations;
window.DataExplorer = DataExplorer;
window.RealTimeUpdater = RealTimeUpdater;
window.ChartConfig = ChartConfig;

console.log('✅ Enhanced Charts Library ready');