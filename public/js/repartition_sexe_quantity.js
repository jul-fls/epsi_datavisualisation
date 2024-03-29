fetch(location.origin+'/data/accidents/ratio-sexe-conducteurs-quantity')
    .then(response => response.json())
    .then(data => {
        const ctx = document.getElementById('genderChartQuantity').getContext('2d');
        const genderChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Homme', 'Femme', 'Inconnu'],
                datasets: [{
                    label: 'Répartition sexe conducteurs',
                    data: [data.homme, data.femme, data.inconnu],
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
                        display: false,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        callback: function(value) {
                            return value;
                        }
                    }
                }
            }
        });
    });