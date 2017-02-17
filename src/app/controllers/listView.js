/**
 * Controller: List View.
 **/
angular
    .module('myLitleScrumBoardApp')
    .controller('listViewCtrl', listViewCtrl);


function listViewCtrl($scope, $rootScope, $http, $location, pouchDBService, notificationService) {
    console.log("Constructor: List View Controller.");

    pouchDBService.startListening();
    $rootScope.$on("pouchDBService:change", onPouchDBChange);
    $rootScope.$on("pouchDBService:delete", onPouchDBDelete);

    $scope.boards = new Array();
    $scope.tmpBoardData = pouchDBService.createEmptyBoard();

    $scope.gotoBoard   = gotoBoard;
    $scope.createBoard = createBoard;

    ////////////////////////////////////////////////////////////

    function onPouchDBChange(event, data) {
        if(data.doc.type == "board") {
            console.log(event, data.doc);
            for(var i = 0; i < $scope.boards.length; i++) {
                if($scope.boards[i]._id == data.doc._id) {
                    $scope.boards[i] = data.doc;
                    $scope.$apply();
                    return;
                }
            }
            if(data.doc.privacy != "private") {
                $scope.boards.push(data.doc);
                $scope.$apply();
            }
        }
    }

    function onPouchDBDelete (event, data) {
        for(var i = 0; i < $scope.boards.length; i++) {
            if($scope.boards[i]._id == data.doc._id) {
                $scope.boards.splice(i, 1);
                $scope.$apply();
                return;
            }
        }
    }

    ////////////////////////////////////////////////////////////

    function gotoBoard(boardId) {
        console.log("[listViewCtrl] gotoBoard >>", boardId);
        $location.path("board/" + boardId); 
    }
    
    function createBoard() {
        if($("#inputBoardName").val() == "") return;
        if($scope.tmpBoardData.columns.length < 1) return;
        $scope.tmpBoardData.name = $("#inputBoardName").val();
        $scope.tmpBoardData.privacy = $("#inputBoardPrivacy").val();
        pouchDBService.save($scope.tmpBoardData).then($scope.onBoardCreateSuccess, $scope.onError);
        $scope.tmpBoardData = pouchDBService.createEmptyBoard();
        document.getElementById("formCreateBoard").reset();
        $('#modalCreateBoard').modal('toggle');
    }
    
    $scope.onBoardCreateSuccess = function(response)
    {
        notificationService.notify('Board creation was successful! <a href="#!/board/'+response.id+'">View</a>','success');
        console.log("[listViewCtrl] create was successful!");
        console.log(response);
        //TODO: save private board to localStorage and list them to those who have the id saved.
    }
    
   ////////////////////////////////////////////////////////////
    
    $scope.addColumn = function()
    {
        if($("#inputBoardColumnName").val() == "") return;
        if( $scope.tmpBoardData.columns.length >= 12) return;
        var tmpColumn     = pouchDBService.createEmptyColumn();
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
        pouchDBService.delete(delete_id, delete_rev).then($scope.onDeleteSuccess, $scope.onError);
        $scope.deleteAllTaskFromBoard(delete_id);
        delete_id, delete_rev = null;
        $('#modalDeleteBoardConfirmation').modal('toggle');
    }
    
    $scope.deleteAllTaskFromBoard = function(boardId)
    {
        pouchDBService.query('mlsb/taks-by-board', { key : boardId })
        .then(function (res) {
            console.log("DeleteAllTaskFromBoard -> Query success", res);
            $scope.tasks = new Array();
            for(var i = 0; i < res.rows.length; i++)
            {
                pouchDBService.delete(res.rows[i].value._id, res.rows[i].value._rev)
            }
        });
    }

    $scope.onDeleteSuccess = function(response)
    {
        notificationService.notify('Board deleted.','success');
        console.log("[listViewCtrl] delete was successful!");
        console.log(response);
    }
    
    ////////////////////////////////////////////////////////////
    
    $scope.onError = function(error)
    {
        notificationService.notify('Something went wrong!','danger');
        console.error("[listViewCtrl] something went wrong!");
        console.error(error);
    }
    
}