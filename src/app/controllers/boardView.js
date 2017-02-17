/**
 * Controller: Board View.
 **/
app.controller('boardViewCtrl', function($scope, $rootScope, $http, $routeParams, pouchDBService, notificationService)
{
    console.log("Constructor: Board View Controller.");
    console.log("routeParams.boardId : " + $routeParams.boardId);
    
    $scope.currentBoardId = $routeParams.boardId;
    $scope.board       = {};
    $scope.tasks       = new Array();
    $scope.columnSize  = 12
    
    pouchDBService.startListening();
    
    $rootScope.$on("pouchDBService:change", function(event, data) {
        
        if($scope.currentBoardId == data.doc._id && data.doc.type == "board")
        {
            $scope.board = data.doc;
            $scope.columnSize = parseInt(12/$scope.board.columns.length);
            $scope.$apply();
	    }
        if($scope.currentBoardId == data.doc.board_id && data.doc.type == "task")
        {
            console.log("pouchDBService:change, Task recieved", data.doc);
            var res = $scope.setTaskById(data.doc._id, data.doc);
            if(res == false) $scope.tasks.push(data.doc);
            $scope.$apply();
        }
    });
    
    pouchDBService.get($scope.currentBoardId)
    .then($scope.OnGetSuccess, $scope.onError);
    
    $scope.getTasks = function ()
    {
        pouchDBService.query('mlsb/taks-by-board', { key : $scope.currentBoardId })
        .then(function (res) {
            console.log("Query success", res);
            $scope.tasks = new Array();
            for(var i = 0; i < res.rows.length; i++)
            {
                $scope.tasks.push(res.rows[i].value);
            }
            console.log($scope.tasks);
            $scope.$apply();
        }).catch(function (err) {
            console.error("Query error", err);
            if(err.name == "not_found")
            {
                console.info("Don't worry we try to add our design doc now.")
                pouchDBService.addDesignDoc().then(function () {
                    console.log("design doc added");
                    $scope.getTasks();
                }).catch(function (err) {
                    console.error("Can't add design doc", err);
                });
            }
        });
    }

    $scope.getTasks();

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
        var task = pouchDBService.createEmptyTask();
        task.board_id  =  $scope.currentBoardId;
        task.column_id = parseInt($("#selectColumn").val());
        task.name   = $("#inputTaskName").val();
        task.link   = $("#inputTaskLink").val();
        task.tag    = $("#inputTaskJiraId").val();
        
        if(task.name == "" || task.link == "" || task.jiraid == "")
        {
            $scope.msgErrorAddTask = "Some fields are empty.";
            return;
        }
        
        //$scope.tasks.push(task);
        pouchDBService.save(task).then($scope.onCreateSuccess, $scope.onError);
        
        $scope.msgErrorAddTask = "";
        document.getElementById("formAddTask").reset();
        $('#modalAddTask').modal('toggle');
    }
    
    $scope.onCreateSuccess = function(response)
    {
        notificationService.notify('Task added.', 'info');
        console.log("[boardViewCtrl] Adding task was successful!");
        console.log(response);
        $scope.getTasks();
    }

    $scope.getTaskById = function(taskid)
    {
        for(var i = 0; i < $scope.tasks.length; i++)
        {
            if($scope.tasks[i]._id == taskid)
            {
                return $scope.tasks[i];
            }
        }
        return null;
    }

    $scope.setTaskById = function(taskid, doc)
    {
         for(var i = 0; i < $scope.tasks.length; i++)
        {
            if($scope.tasks[i]._id == doc._id)
            {
                $scope.tasks[i] = doc;
                return true;
            }
        }
        return false;
    }

    $scope.getTasksInColumn = function(columnid)
    {
        var res = new Array();
        for(var i = 0; i < $scope.tasks.length; i++)
        {
            if($scope.tasks[i].column_id == columnid) res.push($scope.tasks[i]);
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
        var tID = taskid.replace("task-", "");
        var cID = parseInt(columnid.replace("column-", ""));

        var tData = $scope.getTaskById(tID);
        if(tData == null) console.error("No task found! task ID :" + tID);
        tData.column_id = cID;

        pouchDBService.save(tData).then($scope.onDropSuccess, $scope.onError);
    }
    
    $scope.onDropSuccess = function(response)
    {
        notificationService.notifySingle('Board saved.', 'success');
        console.log("Drop success", response);
        var task = $scope.getTaskById(response.id);
        task._rev = response.rev;
    }

    $scope.handleTaskDropDelete = function(taskid)
    {
        console.log("[handleTaskDropDelete] " + taskid);
        var tID = taskid.replace("task-", "");
        var task_id, task_rev = null;
        for(var i = 0; i < $scope.tasks.length; i++)
        {
            if($scope.tasks[i]._id == tID)
            {
                task_id  = $scope.tasks[i]._id;
                task_rev = $scope.tasks[i]._rev;
                $scope.tasks.splice(i, 1);
                break;
            }
        }
        if(task_id != null && task_rev != null)
        {
             pouchDBService.delete(task_id, task_rev).then($scope.onSaveSuccess, $scope.onError);
            //pouchDBService.save($scope.board).then($scope.onSaveSuccess, $scope.onError);
        }
    }

    $scope.exportBoard = function()
    {
        var uriContent = "data:application/octet-stream," + encodeURIComponent(JSON.stringify($scope.board));
        var newWindow = window.open(uriContent, '_self');
    }
    
    ////////////////////////////////////////////////////////////
        
    $scope.onSaveSuccess = function(response)
    {
        notificationService.notifySingle('Board saved.', 'success');
        console.log("Save success", response)
    }
    
    $scope.onError = function(error) {
        notificationService.notify('Something went wrong!','danger');
        console.error("[listViewCtrl] something went wrong!");
        console.error(error);
    }
    
});











