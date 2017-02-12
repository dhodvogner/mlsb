app.service("$pouchDB", ["$rootScope", "$q", function($rootScope, $q) {
    
    var database;
    var changeListener;
    
    this.setDatabase = function(databaseName)
    {
        database = new PouchDB(databaseName);
    }
    
    this.startListening = function()
    {
        changeListener = database.changes({live: true, include_docs: true})
        .on("change", function(change) {
            //console.log("[$pouchDB, changeListener] change", change);
            $rootScope.$broadcast((!change.deleted) ? "$pouchDB:change" : "$pouchDB:delete", change);
        });
    }
    
    this.stopListening = function()
    {
        changeListener.cancel();
    }
    
    this.sync = function(remoteDatabase)
    {
        database.sync(remoteDatabase, {live: true, retry: true});
    }
    
    this.save = function(jsonDocumnet)
    {
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
    
    this.delete = function(documentId, documentRevision)
    {
        return database.remove(documentId, documentRevision);
    }

    this.get = function(documentId)
    {
        return database.get(documentId);
    }

    this.destroy = function()
    {
        database.destroy();
    }
    
    ///////////////////////////////////////////////////
    
    this.createEmptyBoard = function()
    {
        return {
           name : "",
           lastTaskId:    0,
           lastColumnId : 0,
           columns : new Array(),
           tasks: new Array()
        };  
    }
    
    this.createEmptyColumn = function()
    {
        return {
            id: null, 
            display: "default",
            name: ""
        };
    }
    
    this.createEmptyTask = function()
    {
        return {
            id:  null, 
            cid: null, 
            name: "", 
            link: "", 
            tag: ""
        };
    }
    
}]);