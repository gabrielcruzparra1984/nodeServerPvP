var connection = require('../lib/db');

function getChallenges(req, res){
    var queryChallenge = "select * from competencia";
    connection.query(queryChallenge, function(error, result, fields){
        if(error){
            console.log("ha ocurrido un error en la ejecución de la consulta: "+error.message);
            return res.status(500).send("Hubo un error en la ejecución de la consulta: "+error.message);
        }

        if(result.length==0){
            console.log("No se han recuperado competencias ");
            return res.status(404).send("No se han recuperado competencias");
        }

        res.send(JSON.stringify(result));
    });
    
}

function getChallenge(req, res){
    var id = req.params.id;
    var queryChallenge = "select comp.id, "+ 
    " comp.nombre as nombre, "+
    " gen.nombre as genero_nombre, "+
    " act.nombre as actor_nombre, "+
    " dir.nombre as director_nombre "+
    " from competencia comp "+
    " left outer join genero gen "+
    " on gen.id = comp.genero_id "+
    " left outer join actor act "+
    " on act.id = comp.actor_id "+
    " left outer join director dir "+
    " on dir.id = comp.director_id "+
    " where comp.id ="+id;
    connection.query(queryChallenge, function(error, result, fields){
        if(error){
            console.log("ha ocurrido un error en la ejecución de la consulta: "+error.message);
            return res.status(500).send("Hubo un error en la ejecución de la consulta: "+error.message);
        }

        if(result.length==0){
            console.log("No se han recuperado competencias con id: "+id);
            return res.status(404).send("No se han recuperado competencias con id: "+id);
        }
        res.send(JSON.stringify(result[0]));
    });
    
}

function getRandomMovies(req, res){
    var id = req.params.id;
    var queryChallenge = "select comp.* from competencia comp where comp.id = "+id;
    var queryMovies = "select pel.* from pelicula pel" +
    " inner join  competencia_pelicula cp "+
    " on cp.pelicula_id = pel.id "+
    " inner join competencia comp "+
    " on comp.id = cp.competencia_id "+
    " where comp.id = "+id+
    " order by RAND() LIMIT 0,2";

    var respuesta ={"competencia":null, "peliculas":[]};

    connection.query(queryChallenge, function(error, result, fields){
            if(error){
                console.log("ha ocurrido un error en la ejecución de la consulta: "+error.message);
                return res.status(500).send("Hubo un error en la ejecución de la consulta: "+error.message);
            }
            if(result.length == 0){
                console.log("No se ha encontrado la entidad competencia con id: "+id);
                return res.status(404).send("No se ha encontrado la entidad competencia con id: "+id);                
            }   

            respuesta.competencia = result[0].nombre;

    });

    connection.query(queryMovies, function(error, result, fields){
        if(error){
            console.log("ha ocurrido un error en la ejecución de la consulta: "+error.message);
            return res.status(500).send("Hubo un error en la ejecución de la consulta: "+error.message);
        }
        if(result.length == 0){
            console.log("No se han encontrado registros de peliculas. Competencia con id: "+id);
            return res.status(404).send("No se han encontrado registros de peliculas. Competencia con id: "+id);                
        }

        respuesta.peliculas = result;
        console.log(JSON.stringify(respuesta));
        res.send(JSON.stringify(respuesta));
    });

}

function saveVote(req,res){
    var body = req.body;
    var idCompetencia = req.params.id;
    var idPelicula = body.idPelicula;
    var queryVCha =  'SELECT * FROM competencia WHERE id = '+idCompetencia;
    var queryVMov = 'SELECT * FROM pelicula WHERE id = '+idPelicula;
    var statement = 'INSERT INTO voto (competencia_id, pelicula_id) VALUES ('+
    ""+idCompetencia+","+idPelicula+")";

    connection.query(queryVCha, function(error, result, fields){
        if(error){
            console.log("Ha ocurrido un error validando competencia: "+error.message);
            return res.status(500).send("Ha ocurrido un error validando competencia: "+error.message);
        }

        if(result.length==0){
            console.log("No se encontró la competencia con id: "+idCompetencia);
            return res.status(404).send("No se encontró la competencia con id: "+idCompetencia);
        }
    });

    connection.query(queryVMov, function(error, result, fields){
        if(error){
            console.log("Ha ocurrido un error validando película: "+error.message);
            return res.status(500).send("Ha ocurrido un error validando película: "+error.message);
        }

        if(result.length==0){
            console.log("No se encontró la película con id: "+idPelicula);
            return res.status(404).send("No se encontró la película con id: "+idPelicula);
        }
    });

    connection.query(statement, function(error, result, fields){
        if(error){
            console.log("ha ocurrido un error en la ejecución de inserción: "+error.message);
            return res.status(500).send("Hubo un error en la ejecución de inserción: "+error.message);
        }

        res.send(JSON.stringify({"status":200, 
        "message":"Inserción de voto competencia: "+idCompetencia+" pelicula: "+idPelicula+" OK"}));
    });
}

function getResults(req, res){
    var idCompentencia = req.params.id;
    var queryVCha = "SELECT * FROM competencia WHERE id = "+idCompentencia;
    var queryResults = "SELECT "+
    " pel.id as pelicula_id, "+
    " pel.poster as poster, "+
    " pel.titulo as titulo, "+
    " COUNT(0) as votos "+
    " FROM pelicula pel "+
    " INNER JOIN voto vot "+
    " ON vot.pelicula_id = pel.id "+
    " INNER JOIN competencia comp "+
    " ON comp.id = vot.competencia_id "+
    " WHERE comp.id = "+idCompentencia+
    " GROUP BY pel.id, pel.poster, pel.titulo "+
    " ORDER BY 4 DESC "+
    " LIMIT 3";
    var respuesta = {"competencia":null,"resultados":[]};

    connection.query(queryVCha, function(error, result, fields){
        if(error){
            console.log("ha ocurrido un error en la verificación de competencia: "+error.message);
            return res.status(500).send("Hubo un error en la verificación de competencia: "+error.message);
        }

        if(result.length==0){
            console.log("No se encontró la competencia con id: "+idCompetencia);
            return res.status(404).send("No se encontró la competencia con id: "+idCompetencia);
        }

        respuesta.competencia= result[0].nombre;
    });
    
    connection.query(queryResults, function(error, result, fields){
        if(error){
            console.log("ha ocurrido un error en la recuperacion de resultados: "+error.message);
            return res.status(500).send("Hubo un error en la recuperación de resultados: "+error.message);
        }

        if(result.length==0){
            console.log("No se encontraron resultados para competencia con id: "+idCompetencia);
            return res.status(404).send("No se encontraron resultados para competencia cod id: "+idCompetencia);
        }
        respuesta.resultados = result;
        res.send(JSON.stringify(respuesta));
    });
}

function saveChallenge(req, res){
    var body = req.body;
    var nombre = body.nombre;
    var idGenero = body.genero || null;
    var idDirector = body.director || null;
    var idActor = body.actor || null;


    var statement = "INSERT INTO competencia (nombre, genero_id, actor_id, director_id ) "+
    " VALUES ('"+nombre+"',"+(idGenero==0?"null":idGenero)+","+(idActor==0?"null":idActor)
    +","+(idDirector==0?"null":idDirector)+")";

    console.log("consulta inserción competencia :", statement);

    if(!nombre){
        console.log("No se envió una entidad competencia bien formada, debe enviar nombre");
        return res.status(422).send("No se envió una entidad competencia bien formada, debe enviar nombre");
    }

    var queryVerifica = "SELECT * FROM competencia WHERE nombre = '"+nombre+"'";
    var insertedId =0;

    connection.query(queryVerifica, function(error, result, fields){
        if(error){
            console.log("ha ocurrido un error en verificación de competencia: "+error.message);
            return res.status(500).send("Hubo un error en verificación de competencia: "+error.message);
        }
        if(result.length>0){
            console.log("la competencia con nombre "+nombre+" ya existe.");
            return res.status(422).send("la competencia con nombre "+nombre+" ya existe.");
        }

        connection.query(statement, function(error, result, fields){
            if(error){
                console.log("ha ocurrido un error en inserción de competencia: "+error.message);
                return res.status(500).send("Hubo un error en la inserción de competencia: "+error.message);
            }
    
            console.log("id insertado en competencia:", result.insertId);        
            insertedId = result.insertId;
    
            var statementDetails = "INSERT INTO competencia_pelicula (pelicula_id, competencia_id) "+ 
                " SELECT pel.id as pelicula_id, "+insertedId+" as competencia_id "+
                " FROM pelicula pel "+
                " LEFT OUTER JOIN genero gen "+
                " ON gen.id = pel.genero_id "+
                " LEFT OUTER JOIN actor_pelicula acpe "+
                " ON acpe.pelicula_id = pel.id "+
                " LEFT OUTER JOIN director_pelicula dirpe"+
                " ON dirpe.pelicula_id = pel.id ";
    
            if(idGenero && idGenero > 0){
                statementDetails = statementDetails +
                " WHERE gen.id = "+idGenero;
                if(idActor && idActor > 0){
                    statementDetails = statementDetails +
                    " AND acpe.actor_id = "+idActor;
                }
                if(idDirector && idDirector > 0){
                    statementDetails = statementDetails +
                    " AND dirpe.director_id = "+idDirector;
                }
            } else if(idActor && idActor > 0){
                statementDetails= statementDetails+
                " WHERE acpe.actor_id = "+idActor;
    
                if(idDirector && idDirector >0){
                    statementDetails = statementDetails +
                    " AND dirpe.director_id = "+idDirector;
                }
            } else if(idDirector && idDirector >0){
                statementDetails = statementDetails +
                " WHERE dirpe.director_id = "+idDirector;
            }
    
            console.log("consulta detalles: ", statementDetails);
            connection.query(statementDetails, function(error, result, fields){
                if(error){
                    console.log("ha ocurrido un error en inserción de detalles competencia: "+error.message);
                    return res.status(500).send("Hubo un error en la inserción de detalles competencia: "+error.message);
                }
                
                res.status(200).send(JSON.stringify("Operacion exitosa"));
                
            });
        });
    });    
    
}


function deleteChallenge(req, res){
    var id = req.params.id;
    var statementDeleteDetailsVote = "DELETE from voto where competencia_id = "+id;
    var statementDeleteDetailsMovie = "DELETE from competencia_pelicula where competencia_id ="+id;
    var statementDelete = "DELETE from competencia where id = "+id;

    connection.query(statementDeleteDetailsVote, function(error, result, fields){
        if(error){
            console.log("Hubo un error en borrado de votación:"+error.message);
            return res.status(500).send("Hubo un error en borrado de votación:"+error.message);
        }
    });
    
    connection.query(statementDeleteDetailsMovie, function(error, result, fields){
        if(error){
            console.log("Hubo un error en borrado de detalles de competencia:"+error.message);
            return res.status(500).send("Hubo un error en borrado de detalles de competencia:"+error.message);
        }
    });

    connection.query(statementDelete, function(error, result, fields){
        if(error){
            console.log("Hubo un error en borrado de competencia:"+error.message);
            return res.status(500).send("Hubo un error en borrado de competencia:"+error.message);
        }

        res.send(JSON.stringify({"status":200, "message":"Competencia borrada satisfactoriamente"}));
    });
}

function updateChallenge(req,res){
    var id = req.params.id;
    var body = req.body;
    var nombre = body.nombre;
    var statementUpdate = "UPDATE competencia SET nombre = '"+nombre+"' WHERE id = "+id;
    if(!nombre || nombre ==''){
        console.log("Debe enviarse un nombre de competencia válido");
        return res.status(422).send("Debe enviarse un nombre de competencia válido");
    }

    var queryVerifica = "SELECT * FROM competencia WHERE nombre = '"+nombre+"'";
    

    connection.query(queryVerifica, function(error, result, fields){
        if(error){
            console.log("ha ocurrido un error en verificación de competencia: "+error.message);
            return res.status(500).send("Hubo un error en verificación de competencia: "+error.message);
        }
        if(result.length>0 && result[0].id != id){
            console.log("la competencia con nombre "+nombre+" ya existe.");
            return res.status(422).send("la competencia con nombre "+nombre+" ya existe.");
        }

        connection.query(statementUpdate, function(error, result, fields){ 
            if(error){
                console.log("Hubo un error en actualización de competencia:"+error.message);
                return res.status(500).send("Hubo un error en actualización de competencia:"+error.message);
            }
            res.status(200).send(JSON.stringify({"status":200, "message":"Competencia actualizada correctamente"}));
        });
    });

    
}

function resetChallenge(req, res){
    var id = req.params.id;
    var statementReset = "DELETE from voto where competencia_id = "+id;
    connection.query(statementReset, function(error, result, fields){
        if(error){
            console.log("Hubo un error en borrado de votos de competencia:"+error.message);
            return res.status(500).send("Hubo un error en borrado de votos de competencia:"+error.message);
        }

        res.send(JSON.stringify({"status":200, "message":"Competencia reiniciada correctamente"}));

    });

}

module.exports = {
    getChallenges : getChallenges,
    getChallenge : getChallenge,
    getRandomMovies: getRandomMovies,
    saveVote:saveVote,
    getResults: getResults,
    saveChallenge:saveChallenge,
    deleteChallenge: deleteChallenge,
    updateChallenge: updateChallenge,
    resetChallenge: resetChallenge
}