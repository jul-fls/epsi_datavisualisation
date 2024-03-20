fetch(location.origin+'/data/accidents/ratio-motifs-trajets-percent')
    .then(response => response.json())
    .then(data => {
        const ctx = document.getElementById('repartition_motifs_trajets').getContext('2d');
        const genderChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Promenade - Loisirs', 'Domicile - Travail', 'Courses - Achats', 'Utilisation Professionnelle', 'Domicile - Ecole', 'Autres', 'Inconnu'],
                datasets: [{
                    label: 'Répartition motifs trajets',
                    data: [data.promenade_loisirs*100, data.domicile_travail*100, data.courses_achats*100, data.utilisation_professionnelle*100, data.domicile_ecole*100, data.autres*100, data.inconnu*100],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(201, 203, 207, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)',
                        'rgba(255, 206, 86, 0.6)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(201, 203, 207, 1)',
						'rgba(75, 192, 192, 1)',
						'rgba(153, 102, 255, 1)',
						'rgba(255, 159, 64, 1)',
						'rgba(255, 206, 86, 1)'
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