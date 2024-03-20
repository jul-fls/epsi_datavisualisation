fetch(location.origin+'/data/accidents/evolution-nb-accidents-par-an-quantity')
    .then(response => response.json())
    .then(data => {
        const ctx = document.getElementById('evolution_nb_accidents_annuellement').getContext('2d');
        const genderChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022'],
                datasets: [
                    {
                        label: 'Nombre d\'accidents par an',
                        data: [data.annee2005, data.annee2006, data.annee2007, data.annee2008, data.annee2009, data.annee2010, data.annee2011, data.annee2012, data.annee2013, data.annee2014, data.annee2015, data.annee2016, data.annee2017, data.annee2018, data.annee2019, data.annee2020, data.annee2021, data.annee2022],
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
                            'rgba(153, 102, 255, 0.6)',
                            'rgba(255, 159, 64, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(201, 203, 207, 0.6)',
                            'rgba(75, 192, 192, 0.6)'
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
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 99, 132, 1)',
                            'rgba(201, 203, 207, 1)',
                            'rgba(75, 192, 192, 1)'
                        ],
                        borderWidth: 1,
                        stack: 'combined',
                        type: 'bar'
                    },
                    {
                        label: 'Nombre d\'accidents par an',
                        data: [data.annee2005, data.annee2006, data.annee2007, data.annee2008, data.annee2009, data.annee2010, data.annee2011, data.annee2012, data.annee2013, data.annee2014, data.annee2015, data.annee2016, data.annee2017, data.annee2018, data.annee2019, data.annee2020, data.annee2021, data.annee2022],
                        backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        stack: 'combined',
                    }
                ]
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
                        beginAtZero: false,
                        callback: function(value) {
                            return value;
                        }
                    }
                }
            }
        });
    });