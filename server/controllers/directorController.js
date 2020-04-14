var connection = require('../lib/db');

function getDirectors(req,res){
    var queryDirectors ="SELECT * FROM director";
    connection.query(queryDirectors, function(error,result,fields){
        if(error){
            console.log("Ha ocurrido un error recuperando directores: "+error.message);
            return res.status(500).send("Ha ocurrido un error recuperando directores: "+error.message);
        }
        
        res.send(JSON.stringify(result));
    });
}

module.exports = {
    getDirectors : getDirectors
}