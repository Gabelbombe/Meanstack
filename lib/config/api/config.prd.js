
module.exports = {
        
  env : "PROD",

  mongo :{
    connection : "mongodb://"+
      "prd1.api.productplacement.com:27017,"+
      "prd2.api.productplacement.com:27017,"+
      "prd3.api.productplacement.com:27017"+
      "/BenAPI?replicaSet=rsBen"
  },

  server : {
    port : 3100
  },
  
  cache : {
    active : false,
    default_timeout : 10000 // 10 sec
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
      database : "BenAPI",
      collection : "Vehicle"
    },
    placement : {
      database : "BenAPI",
      collection : "Placement"
    },
    impression : {
      database : "BenAPI",
      collection : "Impressions"
    },
    mediaplan : {
      database : "BenAPI",
      collection : "MediaPlan"
    },
    attribute : {
      database : "BenAPI",
      collection : "attribute"
    }
  },
  
  sync : {
    harvest_vehicles : "http://svc.productplacement.com/index.php?layout=vehicles",
    vehicle : "http://svc.productplacement.com/index.php?layout=vehicles&id=%s"
  },
  
  performance_threshold : 5,
  stats_check_interval : 1000,
  
  logging : {
    master : {
      "appenders": [{
        "type": "logLevelFilter",
        "level": "INFO",
        "category" : "default",
        "appender": {
          "type": "multiprocess",
          "mode": "master",
          "loggerPort": 5001,
          "loggerHost": "localhost",
          "appender": {
            "type": "console"
//            "type": "file",
//            "absolute" : true,
//            "filename": "C:/Logs/ben_api/default.log",
//            "maxLogSize": 1 * 1024 * 1024 * 1024, // 1mb
//            "backups": 10,
//            "pollInterval": 15
          }
        }
      }, {
        "type": "logLevelFilter",
        "level": "DEBUG",
        "category" : "performance",
        "appender": {
          "type": "multiprocess",
          "mode": "master",
          "loggerPort": 5002,
          "loggerHost": "localhost",
          "appender": {
            "type": "console"
//            "type": "file",
//            "absolute" : true,
//            "filename": "C:/Logs/ben_api/performance.log",
//            "maxLogSize": 1 * 1024 * 1024 * 1024, // 1mb
//            "backups": 10,
//            "pollInterval": 15
          }
        }
      }, {
        "type": "logLevelFilter",
        "level": "DEBUG",
        "category" : "access",
        "appender": {
          "type": "multiprocess",
          "mode": "master",
          "loggerPort": 5003,
          "loggerHost": "localhost",
          "appender": {
            "type": "console",
//            "type": "file",
//            "absolute" : true,
//            "filename": "C:/Logs/ben_api/access.log",
//            "maxLogSize": 1 * 1024 * 1024 * 1024, // 1mb
//            "backups": 10,
//            "pollInterval": 15
            "layout": {
              "type": "pattern",
              "pattern": "%m"
            }
          }
        }
      }]
    },
    
    fork : {
      "appenders": [{
        "type": "logLevelFilter",
        "level": "INFO",
        "category" : "default",
        "appender": {
          "type": "multiprocess",
          "mode": "worker",
          "loggerPort": 5001,
          "loggerHost": "localhost"
        }
      }, {
        "type": "logLevelFilter",
        "level": "DEBUG",
        "category" : "performance",
        "appender": {
          "type": "multiprocess",
          "mode": "worker",
          "loggerPort": 5002,
          "loggerHost": "localhost"
        }
      }, {
        "type": "logLevelFilter",
        "level": "DEBUG",
        "category" : "access",
        "appender": {
          "type": "multiprocess",
          "mode": "worker",
          "loggerPort": 5003,
          "loggerHost": "localhost"
        }
      }]
    }
  }

};
