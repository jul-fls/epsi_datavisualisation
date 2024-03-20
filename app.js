const csv = require('csv-parser')
var express = require('express')
var app = express()
var path = require('path')
var fs = require('fs')
var os = require('os')

function parseCSVFile (filePath) {
  return new Promise((resolve, reject) => {
    const results = []
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';' })) // Adjust the separator as needed
      .on('data', data => results.push(data))
      .on('end', () => {
        resolve(results)
      })
      .on('error', reject)
  })
}

async function handleData () {
  const src_data = path.join(__dirname, 'src_data')
  const files = await fs.promises.readdir(src_data)
  const dataPromises = files.map(file => {
    const filePath = path.join(src_data, file)
    return parseCSVFile(filePath) // Process each file in parallel
  })

  const data = await Promise.all(dataPromises)
  return data.flat() // Combine all data into a single array
}

// use chart.js
app.use("/chartjs", express.static(path.join(__dirname, 'node_modules/chart.js/dist')));
app.use("/chartjs-plugin-datalabels", express.static(path.join(__dirname, 'node_modules/chartjs-plugin-datalabels/dist')));
app.use("/chartjs-chart-geo", express.static(path.join(__dirname, 'node_modules/chartjs-chart-geo/dist')));

// use the public folder
app.use("/public", express.static(path.join(__dirname, 'public')));

// define the first route
app.get("/", function(req, res){
    res.sendFile(__dirname + "/public/index.html");
});

app.get('/data', async function (req, res) {
  try {
    const data = await handleData()
    res.json(data)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error processing data')
  }
})

app.get('/data/accidents', async function (req, res) {
  	const src_data = path.join(__dirname, 'src_data')
  	const accidentsFilePath = path.join(src_data, 'caracteristiques-2022.csv')
  	const usagersFilePath = path.join(src_data, 'usagers-2022.csv')

  	try {
  	  	let accidents = await parseCSVFile(accidentsFilePath)
  	  	const usagers = await parseCSVFile(usagersFilePath)

		// Filter and transform accidents data
		accidents = accidents.filter(accident => {
			// Ensure dep exists and is trimmed, handling undefined safely
			const dep = accident.dep ? accident.dep.trim() : '';
			// Check if dep is within the specified range or is "2A" or "2B"
			return (parseInt(dep) >= 1 && parseInt(dep) <= 95) || dep === "2A" || dep === "2B";
		}).map(accident => {
			// Replace commas with periods in lat and lng, if they exist
			if (accident.lat) accident.lat = accident.lat.replace(',', '.');
			if (accident.long) accident.long = accident.long.replace(',', '.');
			return accident;
		});


	  	const groupedUsagers = await groupUsagersByAccident(usagers);
  	  	const result = accidents.map(accident => {
  	  	  	const usagersForAccident = groupedUsagers.get(accident.Accident_Id) || []
  	  	  	const people_implied_count = usagersForAccident.length
  	  	  	const conducteur = usagersForAccident.find(
  	  	  	  	usager => usager.catu && usager.catu.trim() === '1'
  	  	  	)
  	  	  	const sexe_conducteur = conducteur ? conducteur.sexe : null;
  	  	  	return {
  	  	  	  	...accident,
  	  	  	  	people_implied_count,
  	  	  	  	sexe_conducteur
  	  	  	}
  	  	})

  	  	res.json(result)
  	} catch (error) {
  	  console.error(error)
  	  res.status(500).send('Error processing data')
  	}
})

app.get('/data/accidents/count', async function (req, res) {
	// return the number of accidents in the dataset with all the previous filtering
	const src_data = path.join(__dirname, 'src_data')
	const accidentsFilePath = path.join(src_data, 'caracteristiques-2022.csv')
	try {
		const accidents = await parseCSVFile(accidentsFilePath)
		const filteredAccidents = accidents.filter(accident => {
			// Ensure dep exists and is trimmed, handling undefined safely
			const dep = accident.dep ? accident.dep.trim() : '';
			// Check if dep is within the specified range or is "2A" or "2B"
			return (parseInt(dep) >= 1 && parseInt(dep) <= 95) || dep === "2A" || dep === "2B";
		})
		res.json(filteredAccidents.length)
	} catch (error) {
		console.error(error)
		res.status(500).send('Error processing data')
	}
});

// now i want a route that returns the ratio of sexe of conducteurs (homme, femme, inconnu (-1))
app.get('/data/accidents/ratio-sexe-conducteurs-percent', async function (req, res) {
	const src_data = path.join(__dirname, 'src_data')
	const accidentsFilePath = path.join(src_data, 'caracteristiques-2022.csv')
	const usagersFilePath = path.join(src_data, 'usagers-2022.csv')

	try {
		const accidents = await parseCSVFile(accidentsFilePath)
		const usagers = await parseCSVFile(usagersFilePath)

		// Filter and transform accidents data
		const filteredAccidents = accidents.filter(accident => {
			// Ensure dep exists and is trimmed, handling undefined safely
			const dep = accident.dep ? accident.dep.trim() : '';
			// Check if dep is within the specified range or is "2A" or "2B"
			return (parseInt(dep) >= 1 && parseInt(dep) <= 95) || dep === "2A" || dep === "2B";
		})

		const groupedUsagers = await groupUsagersByAccident(usagers);
		const result = filteredAccidents.map(accident => {
			const usagersForAccident = groupedUsagers.get(accident.Accident_Id) || []
			const conducteur = usagersForAccident.find(
				usager => usager.catu && usager.catu.trim() === '1'
			)
			if(conducteur){
				const sexe_conducteur = conducteur ? conducteur.sexe : null;
				return sexe_conducteur
			}
		})

		const homme = result.filter(sexe => parseInt(sexe) === 1).length
		const femme = result.filter(sexe => parseInt(sexe) === 2).length
		const inconnu = result.filter(sexe => parseInt(sexe) === -1).length
		const total = homme + femme + inconnu

		res.json({
			homme: homme / total,
			femme: femme / total,
			inconnu: inconnu / total
		})
	} catch (error) {
		console.error(error)
		res.status(500).send('Error processing data')
	}
});

app.get('/data/accidents/ratio-sexe-conducteurs-quantity', async function (req, res) {
	const src_data = path.join(__dirname, 'src_data')
	const accidentsFilePath = path.join(src_data, 'caracteristiques-2022.csv')
	const usagersFilePath = path.join(src_data, 'usagers-2022.csv')

	try {
		const accidents = await parseCSVFile(accidentsFilePath)
		const usagers = await parseCSVFile(usagersFilePath)

		// Filter and transform accidents data
		const filteredAccidents = accidents.filter(accident => {
			// Ensure dep exists and is trimmed, handling undefined safely
			const dep = accident.dep ? accident.dep.trim() : '';
			// Check if dep is within the specified range or is "2A" or "2B"
			return (parseInt(dep) >= 1 && parseInt(dep) <= 95) || dep === "2A" || dep === "2B";
		})

		const groupedUsagers = await groupUsagersByAccident(usagers);
		const result = filteredAccidents.map(accident => {
			const usagersForAccident = groupedUsagers.get(accident.Accident_Id) || []
			const conducteur = usagersForAccident.find(
				usager => usager.catu && usager.catu.trim() === '1'
			)
			if(conducteur){
				const sexe_conducteur = conducteur ? conducteur.sexe : null;
				return sexe_conducteur
			}
		})

		const homme = result.filter(sexe => parseInt(sexe) === 1).length
		const femme = result.filter(sexe => parseInt(sexe) === 2).length
		const inconnu = result.filter(sexe => parseInt(sexe) === -1).length

		res.json({
			homme: homme,
			femme: femme,
			inconnu: inconnu
		})
	} catch (error) {
		console.error(error)
		res.status(500).send('Error processing data')
	}
});

// now i want a route that returns the ratio of accidents in vs out of city ("agg", 1 means out of city and 2 means in city)
app.get('/data/accidents/ratio-accidents-in-out-city-percent', async function (req, res) {
	const src_data = path.join(__dirname, 'src_data')
	const accidentsFilePath = path.join(src_data, 'caracteristiques-2022.csv')

	try {
		const accidents = await parseCSVFile(accidentsFilePath)

		// Filter and transform accidents data
		const filteredAccidents = accidents.filter(accident => {
			// Ensure dep exists and is trimmed, handling undefined safely
			const dep = accident.dep ? accident.dep.trim() : '';
			// Check if dep is within the specified range or is "2A" or "2B"
			return (parseInt(dep) >= 1 && parseInt(dep) <= 95) || dep === "2A" || dep === "2B";
		})

		const inCity = filteredAccidents.filter(accident => parseInt(accident.agg) === 2).length
		const outCity = filteredAccidents.filter(accident => parseInt(accident.agg) === 1).length
		const total = inCity + outCity

		res.json({
			inCity: inCity / total,
			outCity: outCity / total
		})
	} catch (error) {
		console.error(error)
		res.status(500).send('Error processing data')
	}
});

app.get('/data/accidents/ratio-accidents-in-out-city-quantity', async function (req, res) {
	const src_data = path.join(__dirname, 'src_data')
	const accidentsFilePath = path.join(src_data, 'caracteristiques-2022.csv')

	try {
		const accidents = await parseCSVFile(accidentsFilePath)

		// Filter and transform accidents data
		const filteredAccidents = accidents.filter(accident => {
			// Ensure dep exists and is trimmed, handling undefined safely
			const dep = accident.dep ? accident.dep.trim() : '';
			// Check if dep is within the specified range or is "2A" or "2B"
			return (parseInt(dep) >= 1 && parseInt(dep) <= 95) || dep === "2A" || dep === "2B";
		})

		const inCity = filteredAccidents.filter(accident => parseInt(accident.agg) === 2).length
		const outCity = filteredAccidents.filter(accident => parseInt(accident.agg) === 1).length

		res.json({
			inCity: inCity,
			outCity: outCity
		})
	} catch (error) {
		console.error(error)
		res.status(500).send('Error processing data')
	}
});

// now i want a route that returns the repartition of motifs trajets for all the filtered accidents
app.get('/data/accidents/ratio-motifs-trajets-percent', async function (req, res) {
	const src_data = path.join(__dirname, 'src_data')
	const accidentsFilePath = path.join(src_data, 'caracteristiques-2022.csv')
	const usagersFilePath = path.join(src_data, 'usagers-2022.csv')

	try {
		const accidents = await parseCSVFile(accidentsFilePath)
		const usagers = await parseCSVFile(usagersFilePath)

		// Filter and transform accidents data
		const filteredAccidents = accidents.filter(accident => {
			// Ensure dep exists and is trimmed, handling undefined safely
			const dep = accident.dep ? accident.dep.trim() : '';
			// Check if dep is within the specified range or is "2A" or "2B"
			return (parseInt(dep) >= 1 && parseInt(dep) <= 95) || dep === "2A" || dep === "2B";
		})

		const groupedUsagers = await groupUsagersByAccident(usagers);
		const result = filteredAccidents.map(accident => {
			const usagersForAccident = groupedUsagers.get(accident.Accident_Id) || []
			const motifs = usagersForAccident.map(usager => usager.trajet)
			return motifs
		}).flat()

		const promenade_loisirs = result.filter(motif => parseInt(motif) === 5).length
		const domicile_travail = result.filter(motif => parseInt(motif) === 1).length
		const courses_achats = result.filter(motif => parseInt(motif) === 3).length
		const utilisation_professionnelle = result.filter(motif => parseInt(motif) === 4).length
		const domicile_ecole = result.filter(motif => parseInt(motif) === 2).length
		const autres = result.filter(motif => parseInt(motif) === 9).length
		const inconnu = result.filter(motif => parseInt(motif) === -1 || parseInt(motif) === 0).length
		const total = promenade_loisirs + domicile_travail + courses_achats + utilisation_professionnelle + domicile_ecole + autres + inconnu

		res.json({
			promenade_loisirs: promenade_loisirs / total,
			domicile_travail: domicile_travail / total,
			courses_achats: courses_achats / total,
			utilisation_professionnelle: utilisation_professionnelle / total,
			domicile_ecole: domicile_ecole / total,
			autres: autres / total,
			inconnu: inconnu / total
		})

	} catch (error) {
		console.error(error)
		res.status(500).send('Error processing data')
	}
});

// now i want a route that outputs me the number of accidents by person_implied_count (one value for less than 3, another one for less than 6 and another one for 6 or more)
app.get('/data/accidents/ratio-person-implied-count-quantity', async function (req, res) {
	const src_data = path.join(__dirname, 'src_data')
	const accidentsFilePath = path.join(src_data, 'caracteristiques-2022.csv')
	const usagersFilePath = path.join(src_data, 'usagers-2022.csv')

	try {
		const accidents = await parseCSVFile(accidentsFilePath)
		const usagers = await parseCSVFile(usagersFilePath)

		// Filter and transform accidents data
		const filteredAccidents = accidents.filter(accident => {
			// Ensure dep exists and is trimmed, handling undefined safely
			const dep = accident.dep ? accident.dep.trim() : '';
			// Check if dep is within the specified range or is "2A" or "2B"
			return (parseInt(dep) >= 1 && parseInt(dep) <= 95) || dep === "2A" || dep === "2B";
		})

		const groupedUsagers = await groupUsagersByAccident(usagers);
		const result = filteredAccidents.map(accident => {
			const usagersForAccident = groupedUsagers.get(accident.Accident_Id) || []
			const people_implied_count = usagersForAccident.length
			return people_implied_count
		})

		const lessThan3 = result.filter(count => count < 3).length
		const lessThan6 = result.filter(count => count >= 3 && count < 6).length
		const atLeast6 = result.filter(count => count >= 6).length

		res.json({
			lessThan3: lessThan3,
			lessThan6: lessThan6,
			atLeast6: atLeast6
		})
	} catch (error) {
		console.error(error)
		res.status(500).send('Error processing data')
	}
});

// now i want a route that outputs the percentage of accidents under certain light conditions ("lum" key), jour = 1, peu_pas_lumiere = 2 or 3 or 4, nuit_lumiere = 5
app.get('/data/accidents/impacts-lumiere-percent', async function (req, res) {
	const src_data = path.join(__dirname, 'src_data')
	const accidentsFilePath = path.join(src_data, 'caracteristiques-2022.csv')

	try {
		const accidents = await parseCSVFile(accidentsFilePath)

		// Filter and transform accidents data
		const filteredAccidents = accidents.filter(accident => {
			// Ensure dep exists and is trimmed, handling undefined safely
			const dep = accident.dep ? accident.dep.trim() : '';
			// Check if dep is within the specified range or is "2A" or "2B"
			return (parseInt(dep) >= 1 && parseInt(dep) <= 95) || dep === "2A" || dep === "2B";
		})

		const jour = filteredAccidents.filter(accident => parseInt(accident.lum) === 1).length
		const peu_pas_lumiere = filteredAccidents.filter(accident => parseInt(accident.lum) === 2 || parseInt(accident.lum) === 3 || parseInt(accident.lum) === 4).length
		const nuit_lumiere = filteredAccidents.filter(accident => parseInt(accident.lum) === 5).length
		const total = jour + peu_pas_lumiere + nuit_lumiere

		res.json({
			jour: jour / total,
			peu_pas_lumiere: peu_pas_lumiere / total,
			nuit_lumiere: nuit_lumiere / total
		})
	} catch (error) {
		console.error(error)
		res.status(500).send('Error processing data')
	}
});

// okay now create me this route evolution-nb-accidents-par-mois-quantity that returns the number of accidents for each month
app.get('/data/accidents/evolution-nb-accidents-par-mois-quantity', async function (req, res) {
	const src_data = path.join(__dirname, 'src_data')
	const accidentsFilePath = path.join(src_data, 'caracteristiques-2022.csv')

	try {
		const accidents = await parseCSVFile(accidentsFilePath)

		// Filter and transform accidents data
		const filteredAccidents = accidents.filter(accident => {
			// Ensure dep exists and is trimmed, handling undefined safely
			const dep = accident.dep ? accident.dep.trim() : '';
			// Check if dep is within the specified range or is "2A" or "2B"
			return (parseInt(dep) >= 1 && parseInt(dep) <= 95) || dep === "2A" || dep === "2B";
		})

		const january = filteredAccidents.filter(accident => parseInt(accident.mois) === 1).length
		const february = filteredAccidents.filter(accident => parseInt(accident.mois) === 2).length
		const march = filteredAccidents.filter(accident => parseInt(accident.mois) === 3).length
		const april = filteredAccidents.filter(accident => parseInt(accident.mois) === 4).length
		const may = filteredAccidents.filter(accident => parseInt(accident.mois) === 5).length
		const june = filteredAccidents.filter(accident => parseInt(accident.mois) === 6).length
		const july = filteredAccidents.filter(accident => parseInt(accident.mois) === 7).length
		const august = filteredAccidents.filter(accident => parseInt(accident.mois) === 8).length
		const september = filteredAccidents.filter(accident => parseInt(accident.mois) === 9).length
		const october = filteredAccidents.filter(accident => parseInt(accident.mois) === 10).length
		const november = filteredAccidents.filter(accident => parseInt(accident.mois) === 11).length
		const december = filteredAccidents.filter(accident => parseInt(accident.mois) === 12).length

		res.json({
			janvier: january,
			fevrier: february,
			mars: march,
			avril: april,
			mai: may,
			juin: june,
			juillet: july,
			aout: august,
			septembre: september,
			octobre: october,
			novembre: november,
			decembre: december
		})
	} catch (error) {
		console.error(error)
		res.status(500).send('Error processing data')
	}
});

async function groupUsagersByAccident(usagers) {
    const grouped = new Map();
    usagers.forEach(usager => {
        const key = usager.Num_Acc;
        if (!grouped.has(key)) {
            grouped.set(key, []);
        }
        grouped.get(key).push(usager);
    });
    return grouped;
}

// start the server
app.listen(3000, function () {
  	console.log('Server is running on port 3000')
})
