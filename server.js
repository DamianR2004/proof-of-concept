import dotenv from "dotenv";
dotenv.config()
console.log(process.env.PRIVATE_KEY)

// 1. Opzetten van de webserver

// Importeer het npm pakket express uit de node_modules map
import express from 'express'
// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

const propertyId = '301922918';

// Imports the Google Analytics Data API client library.
import {BetaAnalyticsDataClient} from '@google-analytics/data';

const analyticsDataClient = new BetaAnalyticsDataClient();



// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine
// View engine zorgt ervoor dat data die je ophaalt uit de api , waar je in je code dingen mee doet, daar html van maakt
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'))

// Zorg dat werken met request data makkelijker wordt
app.use(express.urlencoded({ extended: true }))

/*** Routes & data ***/


// Maak een GET route voor de index
// Stap 1
app.get('/', async function (request, response) {
  const [apiResponse] = await analyticsDataClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate: '2024-06-08',
        endDate: 'today',
      },
    ],
    dimensions: [
      {
        name: 'city',
      },
    ],
    metrics: [
      {
        name: 'activeUsers',
      },
    ],
  });
  response.render('index', {apiResponse: apiResponse})
})


// 3. Start de webserver
// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})
