// on récupère le module tdayjs
const dayjs = require('dayjs');

// on installe aussi son plugin pour gérer les TZ
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

// On switch dayjs en FR
require('dayjs/locale/fr')
dayjs.locale('fr')


// On récupère le module Express
const express = require('express');

// Récupérer le module capitalCities
const capitalCities = require('./my_modules/capitalCities');

// On demande à express de démarer
const app = express();

// Voici ou seront rangé les vues/templates
app.set('views', './views');

// Je configure express pour lui préciser quel moteur de template on utilise
app.set('view engine', 'ejs');

// On indique à Express que les ressources "statiques" (css, images, polices, etc.) sont rangées dans le dossiers 'public'
app.use(express.static('public'));

// On spécifie le port sur lequel on va écouter les requetes
const port = 3000;

// On écrit une route
app.get('/', (request, response) => {
    // on répond au navigateur avec le contenu du fichier index.html
    // response.sendFile(__dirname + '/views/index.html');
    response.render('index', {
        capitalCities: capitalCities
    });
});

app.get('/city/:capitale', (request, response) => {

    // Récupérer la capitale demandée
    const capitale = request.params.capitale;

    // récupérer la TZ de la capitale concernée

    let infoVille = null; 
    // Rechercher dans le tableau capitalCities la bonne entrée
    for (const city of capitalCities) {
        if (city.name.toLowerCase() === capitale.toLowerCase()) {
            infoVille = city;
        }
    }

    // créer une variable contenant la date et l'heure dans la capitale demandée
    const heureActuelle = dayjs().tz(infoVille.tz).format('DD MMMM YYYY HH:mm');

    // Récupérer le contenu du champs `tz` de la bonne entrée
    // response.send(`Coucou, la capitale est ${infoVille.name} ${infoVille.tz}, date : ${heureActuelle}`);

    console.log(infoVille);
    // On demande à express de faire passer EJS sur le fichier capitale.ejs
    response.render('capitale', {
        // ma vue EJS pourra utiliser l'info/variable "city"
        city: infoVille,
        // ma vue EJS pourra utiliser l'info/variable "heure"
        heure: heureActuelle
    });

});



// On demande à express d'écouter les requetes sur le port stocké dans la variable `port`
// En second argument on spécifie aussi un callback, une fonction, qui sera executée quand
// se serveur sera pret à écouter les requetes sur le port spécifié.
app.listen(port, () => {
    console.log(`Je suis pret, envoyer vos requetes sur http://localhost:${port}`);
});