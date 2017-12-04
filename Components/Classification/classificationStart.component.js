jTextMinerApp.component('classificationStart',
{
    templateUrl: 'Components/Classification/classificationStart.component.html',
    controller: function(DialogService, $state, UserService) {
        const ctrl = this;
        ctrl.showWizard = function () {
            $state.go('classificationStart.wizard');
        };

        ctrl.UserService = UserService;
        ctrl.signOut = function () {
            UserService.logout();
        }
    }
}); 