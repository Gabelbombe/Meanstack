

module.exports = {
        
  env : "LOCALHOST",

  mongo :{
//    connection : "mongodb://"+
//      "dev1.api.productplacement.corbis.pre:27017,"+
//      "dev2.api.productplacement.corbis.pre:27017,"+
//      "dev3.api.productplacement.corbis.pre:27017"+
//      "/ben_store?replicaSet=rsBen"
    connection : "mongodb://"+
      "sqa1.api.productplacement.corbis.pre:27017,"+
      "sqa2.api.productplacement.corbis.pre:27017,"+
      "sqa3.api.productplacement.corbis.pre:27017"+
      "/?replicaSet=rsBen"
//      "/BenAPI?replicaSet=rsBen"
  },

  server : {
    port : 3100
  },

  endpoints : [
    {
      dao : "placement",
      url_root : "placement"
    },
    {
      dao : "vehicle",
      url_root : "vehicle"
    },
    {
      dao : "impression",
      url_root : "impression"
    },
    {
      dao : "mediaplan",
      url_root : "mediaplan"
    }
  ],
  
  access : {
    vehicle : {
      database : "BenAPI_test",
      collection : "Vehicle"
    },
    placement : {
      database : "BenAPI_test",
      collection : "Placement"
    },
    impression : {
      database : "BenAPI_test",
      collection : "Impressions"
    },
    mediaplan : {
      database : "BenAPI_test",
      collection : "MediaPlan"
    },
    attribute : {
      database : "BenAPI_test",
      collection : "attribute"
    }
  },
  
  sync : {
    harvest_vehicles : "http://sqa.emos.productplacement.corbis.pre/index.php?layout=vehicles"
  },
  
  performance_threshold : 5,
  stats_check_interval : 1000,
  
  logging : {
    master : {
      "appenders": [{
        "type": "logLevelFilter",
        "level": "DEBUG",
        "appender": {
          "type": "multiprocess",
          "mode": "master",
          "loggerPort": 5001,
          "loggerHost": "localhost",
          "appender": {
            "type": "console"
          }
        }
      }]
    },
    
    fork : {
      "appenders": [{
        "type": "logLevelFilter",
        "level": "DEBUG",
        "appender": {
          "type": "multiprocess",
          "mode": "worker",
          "loggerPort": 5001,
          "loggerHost": "localhost"
        }
      } ]
    }
  }
};
