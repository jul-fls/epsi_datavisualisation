fetch(location.origin+'/data/accidents/count')
    .then(response => response.json())
    .then(data => {
        document.getElementById('nb_accidents').innerText = data;
    });