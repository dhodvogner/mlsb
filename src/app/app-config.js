angular
    .module('myLitleScrumBoardApp')
    .constant('myLitleScrumBoardConfig', {
        databaseName : "mlsb-db",
        globalSync   : true,
        globalHost   : "http://127.0.0.1:5984",
    });