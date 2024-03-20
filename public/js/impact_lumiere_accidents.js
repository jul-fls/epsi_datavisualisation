fetch(location.origin+'/data/accidents/impacts-lumiere-percent')
    .then(response => response.json())
    .then(data => {
        const ctx = document.getElementById('impact_lumiere_accidents').getContext('2d');
        const genderChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Jour', 'Peu / Pas de lumière', 'Nuit avec lumière'],
                datasets: [{
                    label: 'Impact de la lumière sur les accidents',
                    data: [data.jour*100, data.peu_pas_lumiere*100, data.nuit_lumiere*100],
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
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'right'
                    }
                }
            }
        });
    });