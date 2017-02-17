angular
    .module('myLitleScrumBoardApp')
	.directive('draggable', draggableDirective);

function draggableDirective() {
    return function(scope, element) {
        var el = element[0];
        el.draggable = true;
		
        el.addEventListener('dragstart', function(e) {
			//console.log("dragstart : " + this.id);
			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('DraggedId', this.id);
			this.classList.add('drag');
			return false;
        }, false);

        el.addEventListener('dragend', function(e) {
			//console.log("dragend : " + this.id);
			this.classList.remove('drag');
			return false;
        }, false);
    }
}