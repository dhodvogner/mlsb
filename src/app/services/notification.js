angular
    .module('myLitleScrumBoardApp')
    .service("notificationService", notificationService);
    
notificationService.$inject = ["$rootScope"];
function notificationService($rootScope) {
    this.notificationConfig = {
        type: "",
        newest_on_top: true,
        delay: 600,
        placement: { from: "bottom", align: "center" },
        animate: { enter: 'animated fadeInDown', exit: 'animated fadeOutUp' }
    };
    this.prevNotification = null;

    this.getIcon = getIcon;
    this.notify  = notify;
    this.notifySingle = notifySingle;

    ////////////////////////////////////////////////////////////////////////

    function getIcon(type) {
        var icon = 'glyphicon glyphicon-info-sign';
        if(type == "success") icon = 'glyphicon glyphicon-ok-sign';
        if(type == "danger")  icon = 'glyphicon glyphicon-remove-sign';
        return icon;
    }

    function notify(text, type) {
        this.notificationConfig.type = type;
        $.notify({ icon: this.getIcon(type), message: text }, this.notificationConfig);
    }

    function notifySingle(text, type) {
        if(this.prevNotification != null) {
            this.prevNotification.close();
        }
        this.notificationConfig.type = type;
        this.prevNotification = $.notify({ icon: this.getIcon(type), message: text }, this.notificationConfig);
    }
}