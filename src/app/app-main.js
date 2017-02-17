var app = angular
    .module('myLitleScrumBoardApp', ["ngRoute"])
    .run(runBlock)
    .config(configBlock)

runBlock.$inject = ['pouchDBService', 'myLitleScrumBoardConfig'];
function runBlock(pouchDBService, myLitleScrumBoardConfig) {
    pouchDBService.setDatabase(myLitleScrumBoardConfig.databaseName);
    if(myLitleScrumBoardConfig.globalSync) {
        console.info("myLitleScrumBoard is working in online mode.");
        pouchDBService.setDatabase(myLitleScrumBoardConfig.globalHost+"/"+myLitleScrumBoardConfig.databaseName);    
    } else {
        console.info("myLitleScrumBoard is working in offline mode.");
    }
}

configBlock.$inject = ['$locationProvider', '$routeProvider',];
function configBlock($locationProvider, $routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "views/list.html",
            controller  : "listViewCtrl"
        })
        .when("/board/:boardId", {
            templateUrl : "views/board.html",
            controller  : "boardViewCtrl"
        })
        .otherwise({redirectTo: '/' });
    //$locationProvider.html5Mode({enabled: true});
}