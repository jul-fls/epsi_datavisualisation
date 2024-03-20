fetch(location.origin+'/data/accidents/ratio-person-implied-count-quantity')
    .then(response => response.json())
    .then(data => {
        const ctx = document.getElementById('nb_accidents_par_nb_usagers_impliques').getContext('2d');
        const genderChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['1 - 2 personnes', '3 - 5 personnes', '+5 personnes'],
                datasets: [{
                    label: 'Nombre d\'accidents par nombre d\'usagers impliqués',
                    data: [data.lessThan3, data.lessThan6, data.atLeast6],
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
                            return value;
                        }
                    }
                }
            }
        });
    });