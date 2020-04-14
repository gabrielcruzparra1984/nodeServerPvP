require('dotenv').config({ path: './env/.env'});
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var competenciaController = require('./controllers/competenciasController');
var actorController = require('./controllers/actorController');
var directorController = require('./controllers/directorController');
var generoController = require('./controllers/generoController');
var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/competencias', competenciaController.getChallenges);
app.post('/competencias',competenciaController.saveChallenge);
app.get('/generos', generoController.getGenres);
app.get('/actores', actorController.getActors);
app.get('/directores', directorController.getDirectors);
app.get('/competencias/:id/peliculas', competenciaController.getRandomMovies);
app.post('/competencias/:id/voto', competenciaController.saveVote);
app.get('/competencias/:id/resultados', competenciaController.getResults);
app.delete('/competencias/:id/votos', competenciaController.resetChallenge);
app.delete('/competencias/:id',competenciaController.deleteChallenge);
app.get('/competencias/:id', competenciaController.getChallenge);
app.put('/competencias/:id',competenciaController.updateChallenge);

var port = '8083';

app.listen(port, function(){
    console.log('Escuchando en puerto '+port);
});
