angular
    .module('myLitleScrumBoardApp')
    .service("pouchDBService", pouchDBService);

pouchDBService.$inject = ["$rootScope", "$q"];
 function pouchDBService($rootScope, $q) {
    var database;
    var changeListener;
    
    this.setDatabase    = setDatabase;
    this.startListening = startListening;
    this.stopListening  = stopListening;
    this.sync           = sync;
    this.save           = save;
    this.delete         = fn_delete;
    this.get            = get;
    this.query          = query
    this.destroy        = destroy;

    this.addDesignDoc      = addDesignDoc;
    this.createEmptyBoard  = createEmptyBoard;
    this.createEmptyColumn = createEmptyColumn;
    this.createEmptyTask   = createEmptyTask;

    //////////////////////////////////////////////////////

    function setDatabase (databaseName) {
        database = new PouchDB(databaseName);
    }
    
    function startListening() {
        changeListener = database.changes({live: true, include_docs: true})
        .on("change", function(change) {
            //console.log("[pouchDBService, changeListener] change");//, change);
            $rootScope.$broadcast((!change.deleted) ? "pouchDBService:change" : "pouchDBService:delete", change);
        });
    }
    
    function stopListening() {
        changeListener.cancel();
    }
    
    function sync(remoteDatabase) {
        database.sync(remoteDatabase, {live: true, retry: true});
    }
    
    function save(jsonDocumnet) {
        var deferred = $q.defer();
        var methodName = (!jsonDocumnet._id) ? "post" : "put";
        database[methodName](jsonDocumnet)
            .then(function(response) {
                deferred.resolve(response);
            })
            .catch(function(error) {
                deferred.reject(error);
            });
        return deferred.promise;
    }
    
    function fn_delete(documentId, documentRevision) {
        return database.remove(documentId, documentRevision);
    }

    function get(documentId) {
        return database.get(documentId);
    }

    function query(viewName, options) {
        return database.query(viewName, options);
    }

    function destroy() {
        database.destroy();
    }
    
    ///////////////////////////////////////////////////
    
    function addDesignDoc() {
        var ddoc = {
            _id: "_design/mlsb",
            views: {
                "taks-by-board" : {
                map: function (doc) {if(doc.board_id && doc.type == "task") emit(doc.board_id, doc);}.toString()
                }
            },
            language: "javascript"
        };
        return this.save(ddoc);
    }

    function createEmptyBoard() {
        return {
           type: "board",
           name : "",
           privacy: "public",
           lastColumnId : 0,
           columns : new Array()
        };  
    }
    
    function createEmptyColumn() {
        return {
            id: null, 
            display: "default",
            name: ""
        };
    }
    
    function createEmptyTask() {
        return {
            type: "task",
            board_id:  null, 
            column_id: null, 
            name: "", 
            link: "", 
            tag: ""
        };
    }
    
}