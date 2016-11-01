jTextMinerApp.directive('viewAllFeaturesDialog',function () {
    return {
    restrict: 'E',
    scope: {
        features: '=',
        onConfirm: '&'
    },
    templateUrl: 'Components/Shared/viewAllFeaturesDialog.component.html',
    controller: function () {
    }
}});