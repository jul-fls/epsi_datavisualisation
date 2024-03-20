fetch(location.origin+'/data/accidents/ratio-accidents-in-out-city-percent')
    .then(response => response.json())
    .then(data => {
        const ctx = document.getElementById('cityChartPercent').getContext('2d');
        const genderChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['En Ville', 'Hors Ville'],
                datasets: [{
                    label: 'Répartition des accidents en / hors agglomération',
                    data: [data.inCity*100, data.outCity*100],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(201, 203, 207, 0.6)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(201, 203, 207, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        callback: function(value) {
                            return value + '%'; // Add percentage sign
                        }
                    }
                }
            }
        });
    });