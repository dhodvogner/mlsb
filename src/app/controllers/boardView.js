/**
 * Controller: Board View.
 **/
app.controller('boardViewCtrl', function($scope, $rootScope, $http, $routeParams, $pouchDB, notificationService)
{
    console.log("Constructor: Board View Controller.");
    console.log("routeParams.boardId : " + $routeParams.boardId);
    
    $scope.board       = {};
    $scope.columnSize  = 12
    
    $pouchDB.startListening();
    
    $rootScope.$on("$pouchDB:change", function(event, data) {
        $scope.board = data.doc;
        $scope.columnSize = parseInt(12/$scope.board.columns.length);
        $scope.$apply();
    });
    
    $pouchDB.get($routeParams.boardId)
    .then($scope.OnGetSuccess, $scope.onError);
    
    $scope.OnGetSuccess = function(response) {
        notificationService.notify('Board loaded.', 'success');
        console.error("[boardViewCtrl] recived the board successfuly!");
        console.log(response);
    }
    
    $('[data-toggle="tooltip"]').tooltip();
        
    ////////////////////////////////////////////////////////////
    
    // Drag & Drop support for URLs
    $(document).bind('drop dragover', function (e) {
        e.preventDefault();
    });
    
    $(document).bind('drop', function (e) {
        var dropData = e.originalEvent.dataTransfer.getData('Text');
        //console.log(dropData);  
        if(dropData.match(/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi))
        {
            console.log("It's an URL!");
            $("#inputTaskLink").val(dropData);
            $('#modalAddTask').modal('toggle');
        }
    });
    
    ////////////////////////////////////////////////////////////
        
    $scope.addNewTask = function()
    {
        var task = $pouchDB.createEmptyTask();
        task.cid    = parseInt($("#selectColumn").val());
        task.name   = $("#inputTaskName").val();
        task.link   = $("#inputTaskLink").val();
        task.tag    = $("#inputTaskJiraId").val();
        
        if(task.name == "" || task.link == "" || task.jiraid == "")
        {
            $scope.msgErrorAddTask = "Some fields are empty.";
            return;
        }
        
        task.id = $scope.board.lastTaskId;
        $scope.board.lastTaskId++;
        $scope.board.tasks.push(task);
        $pouchDB.save($scope.board).then($scope.onCreateSuccess, $scope.onError);
        
        $scope.msgErrorAddTask = "";
        document.getElementById("formAddTask").reset();
        $('#modalAddTask').modal('toggle');
    }
    
    $scope.onCreateSuccess = function(response)
    {
        notificationService.notify('Task added.', 'info');
        console.log("[boardViewCtrl] Adding task was successful!");
        console.log(response);
    }

    $scope.getTaskById = function(taskid)
    {
        for(var i = 0; i < $scope.board.tasks.length; i++)
        {
            if($scope.board.tasks[i].id == taskid)
            {
                return $scope.board.tasks[i];
            }
        }
        return null;
    }

    $scope.getTasksInColumn = function(columnid)
    {
        var res = new Array();
        for(var i = 0; i < $scope.board.tasks.length; i++)
        {
            if($scope.board.tasks[i].cid == columnid) res.push($scope.board.tasks[i]);
        }
        //console.log("getTasksInColumn " + columnid + " l: " + res.length);
        return res;
    }
    ////////////////////////////////////////////////////////////
	
    $scope.handleTaskClick = function(taskid)
    {
        console.log("[handleTaskClick] taskid-" + taskid);
        var task = $scope.getTaskById(taskid);
        window.open(task.link,'_blank');
    }
    
    $scope.handleTaskDrop = function(taskid, columnid)
    {
        console.log("[handleTaskDrop] " + taskid + " moved to " + columnid);
        var tID = parseInt(taskid.replace("task-", ""));
        var cID = parseInt(columnid.replace("column-", ""));
        var cData = $scope.board.columns[cID];

        var tData = $scope.getTaskById(tID);
        if(tData == null) console.error("No task found! task ID :" + tID);
        tData.cid = cID;

        $pouchDB.save($scope.board).then($scope.onSaveSuccess, $scope.onError);
    }
    
    $scope.handleTaskDropDelete = function(taskid)
    {
        console.log("[handleTaskDropDelete] " + taskid);
        var tID = parseInt(taskid.replace("task-", ""));
        
        for(var i = 0; i < $scope.board.tasks.length; i++)
        {
            if($scope.board.tasks[i].id == tID)
            {
                $scope.board.tasks.splice(i, 1);
                break;
            }
        }
        $pouchDB.save($scope.board).then($scope.onSaveSuccess, $scope.onError);
    }
    
    $scope.exportBoard = function()
    {
        var uriContent = "data:application/octet-stream," + encodeURIComponent(JSON.stringify($scope.board));
        var newWindow = window.open(uriContent, '_self');
    }
    
    ////////////////////////////////////////////////////////////
        
    $scope.onSaveSuccess = function(response)
    {
        notificationService.notifySingle('Board saved.', 'success')
    }
    
    $scope.onError = function(error) {
        notificationService.notify('Something went wrong!','danger');
        console.error("[listViewCtrl] something went wrong!");
        console.error(error);
    }
    
});











