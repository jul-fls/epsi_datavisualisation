fetch(location.origin+'/data/accidents/evolution-nb-accidents-par-mois-quantity')
    .then(response => response.json())
    .then(data => {
        const ctx = document.getElementById('nb_accidents_par_mois').getContext('2d');
        const genderChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
                datasets: [
                    {
                        label: 'Nombre d\'accidents par mois',
                        data: [data.janvier, data.fevrier, data.mars, data.avril, data.mai, data.juin, data.juillet, data.aout, data.septembre, data.octobre, data.novembre, data.decembre],
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(201, 203, 207, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(153, 102, 255, 0.6)',
                            'rgba(255, 159, 64, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(201, 203, 207, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(153, 102, 255, 0.6)'
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 99, 132, 1)',
                            'rgba(201, 203, 207, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 99, 132, 1)',
                            'rgba(201, 203, 207, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)'
                        ],
                        borderWidth: 1,
                        stack: 'combined',
                        type: 'bar'
                    },
                    {
                        label: 'Nombre d\'accidents par mois',
                        data: [data.janvier, data.fevrier, data.mars, data.avril, data.mai, data.juin, data.juillet, data.aout, data.septembre, data.octobre, data.novembre, data.decembre],
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        stack: 'combined',
                    }
                ]
            },
            options: {
                responsive: true,
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