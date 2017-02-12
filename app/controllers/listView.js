/**
 * Controller: List View.
 **/
app.controller('listViewCtrl', function($scope, $rootScope, $http, $location,  $pouchDB)
{
    console.log("Constructor: List View Controller.");
    
    $scope.boards = new Array();
    
    $pouchDB.startListening();
    
    $rootScope.$on("$pouchDB:change", function(event, data) {
        for(var i = 0; i < $scope.boards.length; i++)
        {
            if($scope.boards[i]._id == data.doc._id)
            {
                $scope.boards[i] = data.doc;
                $scope.$apply();
                return;
            }
        }
        $scope.boards.push(data.doc);
        $scope.$apply();
        
    });
    
    $rootScope.$on("$pouchDB:delete", function(event, data) {
        for(var i = 0; i < $scope.boards.length; i++)
        {
            if($scope.boards[i]._id == data.doc._id)
            {
                $scope.boards.splice(i, 1);
                $scope.$apply();
                return;
            }
        }
    });
    
    ////////////////////////////////////////////////////////////
    
    $scope.gotoBoard = function(boardId)
    {
        console.log("[listViewCtrl] gotoBoard >>", boardId);
        $location.path("board/" + boardId); 
    }
    
    $scope.tmpBoardData = $pouchDB.createEmptyBoard();
	
    $scope.createBoard = function()
    {
        if($("#inputBoardName").val() == "") return;
        if($scope.tmpBoardData.columns.length < 1) return;
        $scope.tmpBoardData.name = $("#inputBoardName").val();
        $scope.tmpBoardData.storageType = $("#selectBoardStorageType").val();
        $pouchDB.save($scope.tmpBoardData).then($scope.onCreateSuccess, $scope.onError);
        $scope.tmpBoardData = $pouchDB.createEmptyBoard();
        document.getElementById("formCreateBoard").reset();
        $('#modalCreateBoard').modal('toggle');
    }
    
    $scope.onCreateSuccess = function(response)
    {
        $scope.notification('Board creation was successful!','success');
        console.log("[listViewCtrl] create was successful!");
        console.log(response);
    }
    
   ////////////////////////////////////////////////////////////
    
    $scope.addColumn = function()
    {
        if($("#inputBoardColumnName").val() == "") return;
        if( $scope.tmpBoardData.columns.length >= 12) return;
        var tmpColumn     = $pouchDB.createEmptyColumn();
        tmpColumn.id      =  $scope.tmpBoardData.lastColumnId;
        $scope.tmpBoardData.lastColumnId++;
        tmpColumn.display = $("#inputBoardColumnDisplay").val();
        tmpColumn.name    = $("#inputBoardColumnName").val();
        $("#inputBoardColumnName").val("");
        console.log(tmpColumn);
        $scope.tmpBoardData.columns.push(tmpColumn);
    }
	
    $scope.deleteColumn = function(id)
    {
        console.log("deleteColumn: " + id);
        for(var i = 0;i < $scope.tmpBoardData.columns.length; i++)
        {
            var column = $scope.tmpBoardData.columns[i];
            if(column.id == id) 
            {
                $scope.tmpBoardData.columns.splice(i, 1);
                return;
            }
        }
    }
    
    ////////////////////////////////////////////////////////////
    
    var delete_id, delete_rev = null;
    
    $scope.startDeleteBoard = function(boardToDelete)
    {
        delete_id  = boardToDelete._id;
        delete_rev = boardToDelete._rev;
        $('#modalDeleteBoardConfirmation').modal('toggle'); 
    }
    
    $scope.confirmDeleteBoard = function()
    {
        if(delete_id == null && delete_rev == null) return;
        $pouchDB.delete(delete_id, delete_rev).then($scope.onDeleteSuccess, $scope);
        delete_id, delete_rev = null;
        $('#modalDeleteBoardConfirmation').modal('toggle');
    }
    
    $scope.onDeleteSuccess = function(response)
    {
        $scope.notification('Board deleted.','success');
        console.log("[listViewCtrl] delete was successful!");
        console.log(response);
    }
    
    ////////////////////////////////////////////////////////////
    
    $scope.onError = function(error)
    {
        $scope.notification('Something went wrong!','danger');
        console.error("[listViewCtrl] something went wrong!");
        console.error(error);
    }
    
    $scope.notification = function(text, type)
    {
        $.notify({
            message: text 
        },{
            type: type,
            newest_on_top: true,
            delay: 600,
            placement: {
                from: "bottom",
                align: "center"
            },
            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
            }
        });
    }
});