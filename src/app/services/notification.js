/**
 * Notification service.
 */
app.service("notificationService", ["$rootScope", function($rootScope) {

    this.notificationConfig = {
        type: "",
        newest_on_top: true,
        delay: 600,
        placement: { from: "bottom", align: "center" },
        animate: { enter: 'animated fadeInDown', exit: 'animated fadeOutUp' }
    };
    
    this.getIcon = function(type) {
        var icon = 'glyphicon glyphicon-info-sign';
        if(type == "success") icon = 'glyphicon glyphicon-ok-sign';
        if(type == "danger")  icon = 'glyphicon glyphicon-remove-sign';
        return icon;
    }

    this.notify = function(text, type) {
        this.notificationConfig.type = type;
        $.notify({ icon: this.getIcon(type), message: text }, this.notificationConfig);
    }

    this.prevNotification = null;

    this.notifySingle = function(text, type) {
        if(this.prevNotification != null)
        {
            this.prevNotification.close();
        }
        this.notificationConfig.type = type;
        this.prevNotification = $.notify({ icon: this.getIcon(type), message: text }, this.notificationConfig);
    }

}]);