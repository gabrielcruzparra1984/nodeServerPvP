var connection = require('../lib/db');

function getActors(req,res){
    var queryActors ="SELECT * FROM actor";
    connection.query(queryActors, function(error,result,fields){
        if(error){
            console.log("Ha ocurrido un error recuperando actores: "+error.message);
            return res.status(500).send("Ha ocurrido un error recuperando actores: "+error.message);
        }
        
        res.send(JSON.stringify(result));
    });
}

module.exports = {
    getActors : getActors
}