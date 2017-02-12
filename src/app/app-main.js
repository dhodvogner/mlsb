var app = angular.module('myLitleScrumBoardApp', ["ngRoute"])
.run(['$pouchDB', 'myLitleScrumBoardConfig', function($pouchDB, myLitleScrumBoardConfig) {
    $pouchDB.setDatabase(myLitleScrumBoardConfig.databaseName);
    if(myLitleScrumBoardConfig.globalSync)
    {
        $pouchDB.setDatabase(myLitleScrumBoardConfig.globalHost+"/"+myLitleScrumBoardConfig.databaseName);    
    }
    else
    {
        console.info("myLitleScrumBoard is working in offline mode.");
    }
}]);

// Routes
app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    
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
}]);

function dev_reload()
{
	nw.Window.get().reload();
    console.log("Hello");
}