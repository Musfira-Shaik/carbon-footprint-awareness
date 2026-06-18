let chart = null;

function calculateFootprint() {
    // Get form inputs
    const carMiles = parseFloat(document.getElementById('carMiles').value) || 0;
    const flights = parseFloat(document.getElementById('flights').value) || 0;
    const electricity = parseFloat(document.getElementById('electricity').value) || 0;
    const heating = parseFloat(document.getElementById('heating').value) || 0;
    const diet = document.getElementById('diet').value;
    const shopping = parseFloat(document.getElementById('shopping').value) || 0;

    // Calculate emissions (in metric tons CO2e per year)
    // Based on EPA and IPCC data
    
    // Transportation
    const carEmissions = (carMiles * 52 * 0.0004); // 0.4 kg CO2 per mile
    const flightEmissions = (flights * 52 * 0.09); // 0.09 metric tons per hour (average)
    
    // Electricity (0.92 metric tons per MWh average US grid)
    const electricityEmissions = (electricity * 12 * 0.92 / 1000);
    
    // Natural gas (5.3 kg CO2 per therm)
    const heatingEmissions = (heating * 12 * 5.3 / 1000);
    
    // Diet
    let dietEmissions = 0;
    switch(diet) {
        case 'meat':
            dietEmissions = 2.5; // metric tons per year
            break;
        case 'mixed':
            dietEmissions = 1.9;
            break;
        case 'vegetarian':
            dietEmissions = 1.0;
            break;
        case 'vegan':
            dietEmissions = 0.7;
            break;
    }
    
    // Shopping (clothing)
    const shoppingEmissions = (shopping * 12 * 0.021); // ~21 kg CO2 per clothing item
    
    // Waste (average 0.5 metric tons per person per year)
    const wasteEmissions = 0.5;
    
    // Calculate total
    const total = carEmissions + flightEmissions + electricityEmissions + 
                  heatingEmissions + dietEmissions + shoppingEmissions + wasteEmissions;
    
    // Display results
    displayResults({
        total: total,
        car: carEmissions,
        flight: flightEmissions,
        electricity: electricityEmissions,
        heating: heatingEmissions,
        diet: dietEmissions,
        shopping: shoppingEmissions,
        waste: wasteEmissions
    }, { carMiles, flights, electricity, heating, diet, shopping });
}

function displayResults(emissions, inputs) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.classList.remove('results-hidden');
    
    // Display total
    document.getElementById('totalEmissions').textContent = emissions.total.toFixed(2);
    
    // Comparison
    const comparisonText = document.getElementById('comparison-text');
    if (emissions.total < 8) {
        comparisonText.innerHTML = '<span style="color: green;">✓ Well below average! You\'re making a positive impact.</span>';
    } else if (emissions.total < 16) {
        comparisonText.innerHTML = '<span style="color: orange;">○ Below average! Keep improving.</span>';
    } else {
        comparisonText.innerHTML = '<span style="color: red;">⚠ Above average. Check recommendations below.</span>';
    }
    
    // Create chart
    createChart(emissions);
    
    // Detailed breakdown
    displayBreakdown(emissions);
    
    // Recommendations
    generateRecommendations(emissions, inputs);
    
    // Scroll to results
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

function createChart(emissions) {
    const ctx = document.getElementById('emissionChart').getContext('2d');
    
    if (chart) {
        chart.destroy();
    }
    
    const data = [
        emissions.car,
        emissions.flight,
        emissions.electricity,
        emissions.heating,
        emissions.diet,
        emissions.shopping,
        emissions.waste
    ];
    
    const labels = ['Transportation', 'Flights', 'Electricity', 'Heating', 'Diet', 'Shopping', 'Waste'];
    const colors = ['#e74c3c', '#e67e22', '#f39c12', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'];
    
    chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderColor: 'white',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function displayBreakdown(emissions) {
    const breakdownDiv = document.getElementById('detailedBreakdown');
    breakdownDiv.innerHTML = '';
    
    const items = [
        { label: '🚗 Transportation', value: emissions.car },
        { label: '✈️ Flights', value: emissions.flight },
        { label: '⚡ Electricity', value: emissions.electricity },
        { label: '🔥 Heating', value: emissions.heating },
        { label: '🍽️ Diet', value: emissions.diet },
        { label: '🛍️ Shopping', value: emissions.shopping },
        { label: '♻️ Waste', value: emissions.waste }
    ];
    
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'breakdown-item';
        div.innerHTML = `
            <h4>${item.label}</h4>
            <div class="value">${item.value.toFixed(2)}</div>
            <div>metric tons CO2e</div>
        `;
        breakdownDiv.appendChild(div);
    });
}

function generateRecommendations(emissions, inputs) {
    const recommendations = [];
    
    // Transportation recommendations
    if (inputs.carMiles > 100) {
        recommendations.push('🚴 Carpool or use public transit 2 days/week to reduce car emissions by 40%');
    }
    if (inputs.flights > 5) {
        recommendations.push('✈️ Reduce flights or consider offsetting with carbon credits');
    }
    if (inputs.carMiles === 0) {
        recommendations.push('✓ Excellent! You\'re not driving regularly.');
    }
    
    // Energy recommendations
    if (inputs.electricity > 500) {
        recommendations.push('⚡ Switch to renewable energy or use energy-efficient appliances');
        recommendations.push('💡 Replace incandescent bulbs with LEDs to save 75% on lighting energy');
    }
    if (inputs.heating > 30) {
        recommendations.push('🔥 Improve home insulation and consider a smart thermostat');
    }
    
    // Diet recommendations
    if (inputs.diet === 'meat') {
        recommendations.push('🥗 Try Meatless Monday or reduce meat consumption to save ~0.6 tons CO2e/year');
    } else if (inputs.diet === 'mixed') {
        recommendations.push('🥗 Reduce red meat consumption - switch to chicken or fish 1-2 times/week');
    }
    if (inputs.diet === 'vegan') {
        recommendations.push('✓ Excellent! Your plant-based diet is highly sustainable.');
    }
    
    // Shopping recommendations
    if (inputs.shopping > 10) {
        recommendations.push('🛍️ Buy secondhand clothes or extend the life of your current wardrobe');
    }
    
    // General recommendations
    recommendations.push('♻️ Recycle and compost to reduce waste');
    recommendations.push('🌱 Plant trees or support reforestation projects to offset emissions');
    recommendations.push('📊 Track your progress monthly and set reduction goals');
    
    // Display recommendations
    const list = document.getElementById('recommendations-list');
    list.innerHTML = '';
    recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.textContent = rec;
        list.appendChild(li);
    });
}

// Initialize with default values on page load
window.addEventListener('load', () => {
    calculateFootprint();
});
