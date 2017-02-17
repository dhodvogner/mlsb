angular
    .module('myLitleScrumBoardApp')
    .directive('droppable', droppableDirective);

function droppableDirective() {
    return {
        scope: {drop: '&', bin: '=' /*bi-directional scope*/},
        link: function(scope, element) {
            var el = element[0];
			
			el.addEventListener('dragover', function(e) {
				//console.log("dragover : " + this.id);
				e.dataTransfer.dropEffect = 'move';
				if (e.preventDefault) e.preventDefault();
				this.classList.add('over');
				return false;
			}, false);
			
			el.addEventListener('dragenter', function(e) {
				//console.log("dragenter : " + this.id);
				this.classList.add('over');
				return false;
			}, false);

			el.addEventListener('dragleave', function(e) {
				//console.log("dragleave : " + this.id);
				this.classList.remove('over');
				return false;
			}, false);
			
			el.addEventListener('drop', function(e) {
				//console.log("drop : " + this.id);
				if (e.stopPropagation) e.stopPropagation();
				this.classList.remove('over');
				var item = document.getElementById(e.dataTransfer.getData('DraggedId'));
				//this.appendChild(item);
				var droppableID = this.id;
				scope.$apply(function(scope) { // call the passed drop function
					var fn = scope.drop();
					if ('undefined' !== typeof fn) fn(item.id, droppableID);
				});
				return false;
			}, false);
        }
    }
}