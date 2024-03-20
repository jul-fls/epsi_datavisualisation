var map = L.map('carte_des_accidents_routiers').setView([47.062434, 2.440760], 6);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Initialize the MarkerCluster group
var markers = L.markerClusterGroup();

// Fetch accidents data
fetch(location.origin+'/data/accidents')
    .then(response => response.json())
    .then(data => {
        data.forEach(accident => {
            const people_implied_count = accident.people_implied_count;
            let classNameColor = "";
            switch (true) {
                case (people_implied_count < 3):
                    classNameColor = 'marker-icon-blue';
                    break;
                case (people_implied_count < 6):
                    classNameColor = 'marker-icon-red';
                    break;
                default:
                    classNameColor = 'marker-icon-green';
            }
            let newIcon = L.icon({
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                shadowSize: [41, 41],
                shadowAnchor: [12, 41],
                className : classNameColor,
            });
            var marker = L.marker([accident.lat, accident.long], {icon: newIcon}, {title: accident.Accident_Id});
            marker.bindPopup('Accident le ' + accident.jour + '/' + accident.mois + '/' + accident.an + ' à ' + accident.hrmn + ' impliquant ' + accident.people_implied_count + ' personnes');
            markers.addLayer(marker); // Add marker to MarkerCluster group
        });

        map.addLayer(markers); // Add MarkerCluster group to the map
        Swal.close(); // Close the Swal loading indicator
        document.getElementById('carte_des_accidents_routiers').style.visibility = 'visible';
    });
