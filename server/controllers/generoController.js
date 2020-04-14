var connection = require('../lib/db');

function getGenres(req,res){
    var queryGenres ="SELECT * FROM genero";
    connection.query(queryGenres, function(error,result,fields){
        if(error){
            console.log("Ha ocurrido un error recuperando generos: "+error.message);
            return res.status(500).send("Ha ocurrido un error recuperando generos: "+error.message);
        }
        
        res.send(JSON.stringify(result));
    });
}

module.exports = {
    getGenres : getGenres
}