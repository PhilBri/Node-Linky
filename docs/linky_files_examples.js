// ----- Exemples de messges ----
//
// {msg} fourni pour une demande de données journalière : (ici le 07 avril)
// => Collectées toutes les 1/2 heures sur 1 jour soit 48 valeurs...
{
   "_msgid":"b1dcc067.3d53d",
   "topic":"linky",                          // Ajout systématique du topic "linky"
   "payload":{
      "debut":"07/04/2018",                  // Votre requête => Date de début.
      "fin":"07/04/2018",                    // Votre requête => Date de fin.
      "linky":{
         "etat":{
            "valeur":"termine"               // Si erreur => "valeur":"erreur"
         },
         "graphe":{
            "decalage":0,                    // Décalage des premières données si demande inférieure aux nb maxi. (ici les 48 valeurs sont invariables)
            "puissanceSouscrite":12,         // En KVA
            "periode":{
               "dateFin":"08/04/2018",       // Période réelle en interne
               "dateDebut":"07/04/2018"      //   "                "
            },
            "data":[                         // 48 valeurs de 00h30 à 24h
            {"valeur":0.398,"ordre":1},      // valeur à 00h30
            {"valeur":0.326,"ordre":2},
            {"valeur":0.834,"ordre":3},
            {"valeur":0.33,"ordre":4},       // valeur de consommation à 02h00
            {"valeur":0.32,"ordre":5},
            {"valeur":0.288,"ordre":6},
            {"valeur":0.21,"ordre":7},
            {"valeur":0.22,"ordre":8},
            {"valeur":0.276,"ordre":9},
            {"valeur":0.214,"ordre":10},
            {"valeur":0.22,"ordre":11},
            {"valeur":0.27,"ordre":12},
            {"valeur":0.21,"ordre":13},
            {"valeur":0.216,"ordre":14},
            {"valeur":0.264,"ordre":15},
            {"valeur":0.226,"ordre":16},
            {"valeur":0.202,"ordre":17},
            {"valeur":0.254,"ordre":18},
            {"valeur":0.814,"ordre":19},
            {"valeur":0.328,"ordre":20},
            {"valeur":0.794,"ordre":21},
            {"valeur":0.878,"ordre":22},
            {"valeur":1.728,"ordre":23},
            {"valeur":0.594,"ordre":24},
            {"valeur":0.274,"ordre":25},
            {"valeur":0.262,"ordre":26},
            {"valeur":0.2,"ordre":27},
            {"valeur":0.232,"ordre":28},
            {"valeur":1.064,"ordre":29},
            {"valeur":0.802,"ordre":30},
            {"valeur":0.532,"ordre":31},
            {"valeur":0.68,"ordre":32},
            {"valeur":0.662,"ordre":33},
            {"valeur":0.32,"ordre":34},
            {"valeur":1.158,"ordre":35},
            {"valeur":0.26,"ordre":36},
            {"valeur":0.312,"ordre":37},
            {"valeur":0.852,"ordre":38},
            {"valeur":2.67,"ordre":39},
            {"valeur":3.55,"ordre":40},
            {"valeur":3.212,"ordre":41},
            {"valeur":0.792,"ordre":42},
            {"valeur":0.66,"ordre":43},
            {"valeur":0.77,"ordre":44},
            {"valeur":2.88,"ordre":45},
            {"valeur":0.64,"ordre":46},
            {"valeur":0.364,"ordre":47},
            {"valeur":0.504,"ordre":48}]        // valeur de consommation à 24h00 ou 00h00
         }
      }
   }
}


// {msg} fourni pour une demande de 2 jours
// Fichier "mensuel" fourni par défaut soit 31 valaurs
//
{
   "_msgid":"289faa8d.4bf176",
   "topic":"linky",
   "payload":{
      "debut":"07/04/2018",
      "fin":"09/04/2018",
      "linky":{
         "etat":{
            "valeur":"termine"
         },
         "graphe":{
            "decalage":14,                      // les premières valeurs commencent à la 14éme position
            "puissanceSouscrite":0,
            "periode":{
               "dateFin":"09/04/2018",
               "dateDebut":"07/04/2018"
            },
            "data":[
            {"valeur":-1,"ordre":1},            // Valeur -1 => non demandé dans la requête d'origine...
            {"valeur":-1,"ordre":2},
            {"valeur":-1,"ordre":3},
            {"valeur":-1,"ordre":4},
            {"valeur":-1,"ordre":5},
            {"valeur":-1,"ordre":6},
            {"valeur":-1,"ordre":7},
            {"valeur":-1,"ordre":8},
            {"valeur":-1,"ordre":9},
            {"valeur":-1,"ordre":10},
            {"valeur":-1,"ordre":11},
            {"valeur":-1,"ordre":12},
            {"valeur":-1,"ordre":13},
            {"valeur":-1,"ordre":14},
            {"valeur":17.033,"ordre":1108},     // Premières données disponibles (Position 14) soit la conso du 07/04
            {"valeur":-2,"ordre":1109},         // Valeur -2 => Donnée non disponible (non collectée ?)
            {"valeur":-2,"ordre":1110},
            {"valeur":-1,"ordre":18},
            {"valeur":-1,"ordre":19},
            {"valeur":-1,"ordre":20},
            {"valeur":-1,"ordre":21},
            {"valeur":-1,"ordre":22},
            {"valeur":-1,"ordre":23},
            {"valeur":-1,"ordre":24},
            {"valeur":-1,"ordre":25},
            {"valeur":-1,"ordre":26},
            {"valeur":-1,"ordre":27},
            {"valeur":-1,"ordre":28},
            {"valeur":-1,"ordre":29},
            {"valeur":-1,"ordre":30},
            {"valeur":-1,"ordre":31}
            ]
         }
      }
   }
}

// ----- Fichiers d'Erreur -----//
//
// {msg} avec fichier d'erreur standard
{
   "_msgid":"cb806cd8.0fedf",
   "topic":"linky",
   "payload":{
      "debut":"01/04/2018",
      "fin":"07/04/2018",
      "linky":{
         "etat":{
            "valeur":"erreur"   // Tester msg.payload.linky.etat.valeur => "valeur":"termine" si pas d'erreur
         },
         "graphe":
         {}
      }
   }
}
// {msg} avec fichier d'erreur technique
{
   "_msgid":"418f5aab.e252d4",
   "topic":"linky","payload":{
      "debut":"07/04/2018",
      "fin":"07/04/2018",
      "linky":{
         "etat":{
            "valeur":"erreur",
            "erreurText":"Une erreur technique s'est produite. Nous nous en excusons. Merci d'essayer ult&eacute;rieurement."
         },
         "graphe":
         {}
      }
   }
}
